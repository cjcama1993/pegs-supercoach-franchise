-- PEGS v14.8.4 end-to-end QA fixes
-- Run once in Supabase SQL Editor after the existing PEGS schema / v14 upgrade.
-- Safe to re-run.

begin;

-- ---------------------------------------------------------------------------
-- Proposal types and server-side roster-window gates
-- ---------------------------------------------------------------------------


-- Keep server legality exactly aligned with the browser rules, including the
-- three-player Rookie-list maximum and invalid Field-position rejection.
create or replace function public.pegs_roster_summary(p_roster jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  with r as (
    select e from jsonb_array_elements(coalesce(p_roster,'[]'::jsonb)) e
  ), a as (
    select
      coalesce(sum(case when lower(e->>'contract')='main' then coalesce((e->>'salary')::numeric,0) else 0 end),0) as main_salary,
      coalesce(sum(case when lower(e->>'status')='field' then coalesce((e->>'salary')::numeric,0) else 0 end),0) as field_salary,
      coalesce(sum(case when lower(e->>'contract')='rookie' then coalesce((e->>'salary')::numeric,0) else 0 end),0) as rookie_salary,
      count(*) filter (where lower(e->>'contract')='main') as main_count,
      count(*) filter (where lower(e->>'contract')='rookie') as rookie_count,
      count(*) filter (where lower(e->>'status')='field') as field_count,
      count(*) filter (where lower(e->>'status')='interchange') as interchange_count,
      count(*) filter (where lower(e->>'status')='field' and upper(e->>'position')='DEF') as def_count,
      count(*) filter (where lower(e->>'status')='field' and upper(e->>'position')='MID') as mid_count,
      count(*) filter (where lower(e->>'status')='field' and upper(e->>'position')='FWD') as fwd_count,
      count(*) filter (where lower(e->>'status')='field' and upper(e->>'position')='RUC') as ruc_count,
      count(*) filter (where lower(e->>'status')='field' and upper(coalesce(e->>'position','')) not in ('DEF','MID','FWD','RUC')) as invalid_field_count
    from r
  )
  select jsonb_build_object(
    'caps',jsonb_build_object('main',main_salary,'field',field_salary,'rookie',rookie_salary),
    'counts',jsonb_build_object('main',main_count,'rookie',rookie_count,'field',field_count,'interchange',interchange_count,
      'DEF',def_count,'MID',mid_count,'FWD',fwd_count,'RUC',ruc_count,'invalidFieldPositions',invalid_field_count)
  ) from a;
$$;

grant execute on function public.pegs_roster_summary(jsonb) to anon, authenticated;

create or replace function public.pegs_roster_is_legal(p_roster jsonb)
returns boolean
language sql
immutable
set search_path = public
as $$
  select
    coalesce((s->'caps'->>'main')::numeric,0) <= 9500000 and
    coalesce((s->'caps'->>'field')::numeric,0) <= 9500000 and
    coalesce((s->'caps'->>'rookie')::numeric,0) <= 400000 and
    coalesce((s->'counts'->>'main')::integer,0) <= 28 and
    coalesce((s->'counts'->>'rookie')::integer,0) <= 3 and
    coalesce((s->'counts'->>'field')::integer,0) <= 28 and
    coalesce((s->'counts'->>'invalidFieldPositions')::integer,0) = 0 and
    coalesce((s->'counts'->>'DEF')::integer,0) <= 8 and
    coalesce((s->'counts'->>'MID')::integer,0) <= 10 and
    coalesce((s->'counts'->>'FWD')::integer,0) <= 8 and
    coalesce((s->'counts'->>'RUC')::integer,0) <= 2
  from (select public.pegs_roster_summary(p_roster) s) q;
$$;

grant execute on function public.pegs_roster_is_legal(jsonb) to anon, authenticated;


do $$
declare r record;
begin
  for r in
    select conname
    from pg_constraint
    where conrelid='public.pegs_proposals'::regclass
      and contype='c'
      and pg_get_constraintdef(oid) ilike '%type%TRADE%'
  loop
    execute format('alter table public.pegs_proposals drop constraint %I',r.conname);
  end loop;
end $$;

alter table public.pegs_proposals
  add constraint pegs_proposals_type_check
  check (type in ('TRADE','SWAP','DELIST','ELEVATION','RENEWAL','DRAFT_PICK'));

create or replace function public.pegs_canonical_player_name(p_name text)
returns text
language sql
immutable
as $$
  select regexp_replace(lower(coalesce(p_name,'')),'[^a-z0-9]+','','g');
$$;

grant execute on function public.pegs_canonical_player_name(text) to anon, authenticated;

create or replace function public.pegs_proposal_window_open(p_type text, p_phase text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  w jsonb;
  t text := upper(coalesce(p_type,''));
  ph text := lower(coalesce(p_phase,''));
begin
  if t='SWAP' then return true; end if;
  if t='DRAFT_PICK' then
    return exists (
      select 1 from public.pegs_state s
      where s.key='draft_state'
        and coalesce((s.value->>'active')::boolean,false)
        and lower(coalesce(s.value->>'type',''))=ph
    );
  end if;

  select value into w from public.pegs_state where key='proposal_windows';
  if w is null then return false; end if;

  if t='TRADE' then
    return coalesce((w->'trade'->>'open')::boolean,false)
      and lower(coalesce(w->'trade'->>'phase',''))=ph;
  elsif t='DELIST' then
    return coalesce((w->'delist'->>'open')::boolean,false)
      and lower(coalesce(w->'delist'->>'phase',''))=ph;
  elsif t='ELEVATION' then
    return coalesce((w->'elevation'->>'open')::boolean,false)
      and lower(coalesce(w->'elevation'->>'phase',''))=ph;
  elsif t='RENEWAL' then
    return coalesce((w->'delist'->>'open')::boolean,false)
      and lower(coalesce(w->'delist'->>'phase','')) in ('pre-season','preseason')
      and ph in ('pre-season','preseason')
      and coalesce(w->'rosterCycle'->>'phase','')='PRESEASON_WINDOW_OPEN';
  end if;

  return false;
end;
$$;

grant execute on function public.pegs_proposal_window_open(text,text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Trade validation: include conditional delistings in the legality test.
-- ---------------------------------------------------------------------------

create or replace function public.pegs_validate_trade_payload(p_team_a text,p_team_b text,p_phase text,p_payload jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  ra jsonb; rb jsonb; aa jsonb; ab jsonb;
  pa jsonb := coalesce(p_payload#>'{assetsA,players}','[]'::jsonb);
  pb jsonb := coalesce(p_payload#>'{assetsB,players}','[]'::jsonb);
  pka jsonb := coalesce(p_payload#>'{assetsA,picks}','[]'::jsonb);
  pkb jsonb := coalesce(p_payload#>'{assetsB,picks}','[]'::jsonb);
  da jsonb := coalesce(p_payload->'conditionalDelistsA','[]'::jsonb);
  db jsonb := coalesce(p_payload->'conditionalDelistsB','[]'::jsonb);
  moved_a jsonb := '[]'::jsonb; moved_b jsonb := '[]'::jsonb;
  rec jsonb; nm text; pid text;
  errs text[] := array[]::text[];
  sa jsonb; sb jsonb;
begin
  if coalesce(p_team_a,'')='' or coalesce(p_team_b,'')='' or p_team_a=p_team_b then
    errs := array_append(errs,'Choose two different franchises.');
  end if;

  select roster into ra from public.pegs_roster_authority where team_key=p_team_a;
  select roster into rb from public.pegs_roster_authority where team_key=p_team_b;
  if ra is null or rb is null then
    errs := array_append(errs,'Server roster authority is not initialised. Commissioner must open the site once after the upgrade.');
    return jsonb_build_object('legal',false,'errors',to_jsonb(errs));
  end if;

  if jsonb_typeof(pa)<>'array' or jsonb_typeof(pb)<>'array' or jsonb_typeof(pka)<>'array' or jsonb_typeof(pkb)<>'array'
     or jsonb_typeof(da)<>'array' or jsonb_typeof(db)<>'array' then
    return jsonb_build_object('legal',false,'errors',jsonb_build_array('Trade assets are malformed.'));
  end if;

  if jsonb_array_length(pa)>3 or jsonb_array_length(pb)>3 or jsonb_array_length(pka)>3 or jsonb_array_length(pkb)>3
     or jsonb_array_length(da)>3 or jsonb_array_length(db)>3 then
    errs := array_append(errs,'Maximum three players, three draft picks and three conditional delistings per side.');
  end if;
  if jsonb_array_length(pa)+jsonb_array_length(pka)=0 or jsonb_array_length(pb)+jsonb_array_length(pkb)=0 then
    errs := array_append(errs,'Each franchise must send at least one asset.');
  end if;

  if (select count(*) from jsonb_array_elements_text(pa)) <> (select count(distinct value) from jsonb_array_elements_text(pa))
     or (select count(*) from jsonb_array_elements_text(pb)) <> (select count(distinct value) from jsonb_array_elements_text(pb)) then
    errs := array_append(errs,'A player cannot appear twice in a trade.');
  end if;
  if (select count(*) from jsonb_array_elements_text(pka)) <> (select count(distinct value) from jsonb_array_elements_text(pka))
     or (select count(*) from jsonb_array_elements_text(pkb)) <> (select count(distinct value) from jsonb_array_elements_text(pkb)) then
    errs := array_append(errs,'A draft pick cannot appear twice in a trade.');
  end if;

  for nm in select value from jsonb_array_elements_text(pa) loop
    select e into rec from jsonb_array_elements(ra) e where e->>'player'=nm limit 1;
    if rec is null then errs := array_append(errs,p_team_a||' no longer owns '||nm||'.');
    else moved_a := moved_a || jsonb_build_array(rec); end if;
  end loop;
  for nm in select value from jsonb_array_elements_text(pb) loop
    select e into rec from jsonb_array_elements(rb) e where e->>'player'=nm limit 1;
    if rec is null then errs := array_append(errs,p_team_b||' no longer owns '||nm||'.');
    else moved_b := moved_b || jsonb_build_array(rec); end if;
  end loop;

  for nm in select value from jsonb_array_elements_text(da) loop
    if pa ? nm then errs := array_append(errs,nm||' cannot be traded and conditionally delisted.'); end if;
    if not exists(select 1 from jsonb_array_elements(ra) e where e->>'player'=nm) then errs := array_append(errs,p_team_a||' no longer owns conditional delisting player '||nm||'.'); end if;
  end loop;
  for nm in select value from jsonb_array_elements_text(db) loop
    if pb ? nm then errs := array_append(errs,nm||' cannot be traded and conditionally delisted.'); end if;
    if not exists(select 1 from jsonb_array_elements(rb) e where e->>'player'=nm) then errs := array_append(errs,p_team_b||' no longer owns conditional delisting player '||nm||'.'); end if;
  end loop;

  for pid in select value from jsonb_array_elements_text(pka) loop
    if not exists(select 1 from public.pegs_draft_pick_authority d where d.pick_id=pid and d.owner=p_team_a and d.phase=p_phase) then
      errs := array_append(errs,p_team_a||' no longer owns draft pick '||pid||'.');
    end if;
  end loop;
  for pid in select value from jsonb_array_elements_text(pkb) loop
    if not exists(select 1 from public.pegs_draft_pick_authority d where d.pick_id=pid and d.owner=p_team_b and d.phase=p_phase) then
      errs := array_append(errs,p_team_b||' no longer owns draft pick '||pid||'.');
    end if;
  end loop;

  select coalesce(jsonb_agg(e),'[]'::jsonb) into aa
  from jsonb_array_elements(ra) e
  where not (pa ? (e->>'player')) and not (da ? (e->>'player'));
  select coalesce(jsonb_agg(e),'[]'::jsonb) into ab
  from jsonb_array_elements(rb) e
  where not (pb ? (e->>'player')) and not (db ? (e->>'player'));

  aa := coalesce(aa,'[]'::jsonb) || moved_b;
  ab := coalesce(ab,'[]'::jsonb) || moved_a;
  sa := public.pegs_roster_summary(aa);
  sb := public.pegs_roster_summary(ab);

  if not public.pegs_roster_is_legal(aa) then errs := array_append(errs,p_team_a||' cannot accommodate this trade after conditional delistings.'); end if;
  if not public.pegs_roster_is_legal(ab) then errs := array_append(errs,p_team_b||' cannot accommodate this trade after conditional delistings.'); end if;

  return jsonb_build_object(
    'legal',coalesce(array_length(errs,1),0)=0,
    'errors',to_jsonb(errs),
    'teamA',jsonb_build_object('teamKey',p_team_a,'before',public.pegs_roster_summary(ra),'after',sa),
    'teamB',jsonb_build_object('teamKey',p_team_b,'before',public.pegs_roster_summary(rb),'after',sb)
  );
end;
$$;

grant execute on function public.pegs_validate_trade_payload(text,text,text,jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Team proposals, including Rookie Elevation and Contract Renewal.
-- ---------------------------------------------------------------------------

create or replace function public.pegs_submit_team_proposal(p_type text,p_phase text,p_counterparty_team text,p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  k text := public.pegs_current_team_key();
  t text := upper(coalesce(p_type,''));
  phase_norm text := case when lower(coalesce(p_phase,'')) like 'mid%' then 'Mid-Season' else 'Pre-Season' end;
  v jsonb; r public.pegs_proposals%rowtype;
  roster jsonb; after_roster jsonb; in_name text; out_name text; nm text;
  rec jsonb; master jsonb; master_player jsonb; actions jsonb; cycle jsonb;
  season_no integer; price numeric; chosen_pos text; contract_end integer; term_years numeric;
begin
  if k is null then raise exception 'Team login required' using errcode='42501'; end if;
  p_payload := coalesce(p_payload,'{}'::jsonb);
  if not public.pegs_proposal_window_open(t,coalesce(p_phase,'')) then raise exception 'This league window is closed'; end if;

  if t='TRADE' then
    if coalesce(p_counterparty_team,'')='' or p_counterparty_team=k then raise exception 'Choose a valid trade partner'; end if;
    v := public.pegs_validate_trade_payload(k,p_counterparty_team,p_phase,p_payload);
    if not coalesce((v->>'legal')::boolean,false) then
      raise exception 'Trade blocked: %',coalesce(v->'errors'->>0,'roster rules not satisfied');
    end if;
    insert into public.pegs_proposals(type,phase,proposer_team,counterparty_team,payload,status)
    values('TRADE',p_phase,k,p_counterparty_team,p_payload || jsonb_build_object('submittedValidation',v),'AWAITING_COUNTERPARTY')
    returning * into r;

  elsif t='SWAP' then
    select r0.roster into roster from public.pegs_roster_authority r0 where r0.team_key=k for update;
    if roster is null then raise exception 'Server roster authority is not initialised'; end if;
    in_name := p_payload->>'playerIn'; out_name := p_payload->>'playerOut'; chosen_pos := upper(coalesce(p_payload->>'fieldPosition',''));
    select e into rec from jsonb_array_elements(roster) e where e->>'player'=in_name and lower(e->>'status')='interchange' limit 1;
    if rec is null or not exists(select 1 from jsonb_array_elements(roster) e where e->>'player'=out_name and lower(e->>'status')='field') then
      raise exception 'Swap players are not eligible on the current roster';
    end if;
    if chosen_pos='' or not (chosen_pos=any(string_to_array(upper(coalesce(rec->>'position','')),'/'))) then
      raise exception 'Choose a valid PEGS Field position for the incoming player';
    end if;
    select coalesce(jsonb_agg(
      case
        when e->>'player'=in_name then jsonb_set(jsonb_set(e,'{status}','"Field"'::jsonb,true),'{position}',to_jsonb(chosen_pos),true)
        when e->>'player'=out_name then jsonb_set(e,'{status}','"Interchange"'::jsonb,true)
        else e
      end
    ),'[]'::jsonb) into after_roster from jsonb_array_elements(roster) e;
    if not public.pegs_roster_is_legal(after_roster) then raise exception 'Swap would breach a roster rule'; end if;
    insert into public.pegs_proposals(type,phase,proposer_team,payload,status)
    values('SWAP',p_phase,k,p_payload,'AWAITING_COMMISSIONER') returning * into r;

  elsif t='DELIST' then
    select r0.roster into roster from public.pegs_roster_authority r0 where r0.team_key=k;
    if roster is null then raise exception 'Server roster authority is not initialised'; end if;
    if jsonb_typeof(coalesce(p_payload->'players','[]'::jsonb))<>'array' or jsonb_array_length(coalesce(p_payload->'players','[]'::jsonb))=0 then
      raise exception 'Select at least one player';
    end if;
    for nm in select value from jsonb_array_elements_text(p_payload->'players') loop
      if not exists(select 1 from jsonb_array_elements(roster) e where public.pegs_canonical_player_name(e->>'player')=public.pegs_canonical_player_name(nm)) then
        raise exception '% is no longer owned by this team',nm;
      end if;
    end loop;
    insert into public.pegs_proposals(type,phase,proposer_team,payload,status)
    values('DELIST',p_phase,k,p_payload,'AWAITING_COMMISSIONER') returning * into r;

  elsif t in ('ELEVATION','RENEWAL') then
    select value into cycle from public.pegs_state where key='proposal_windows';
    season_no := coalesce((cycle->'rosterCycle'->>'season')::integer,0);
    select value into master from public.pegs_state where key='player_master';
    if master is null or not coalesce((master->>'complete')::boolean,false) or coalesce(master->>'confirmed_at','')='' then
      raise exception 'A confirmed SuperCoach master list is required';
    end if;
    if coalesce((master->>'season')::integer,0)<>season_no or lower(coalesce(master->>'phase',''))<>lower(phase_norm) then
      raise exception 'The confirmed SuperCoach master list does not match this roster window';
    end if;

    select e into master_player
    from jsonb_array_elements(coalesce(master->'players','[]'::jsonb)) e
    where public.pegs_canonical_player_name(e->>'player')=public.pegs_canonical_player_name(p_payload->>'player')
    limit 1;
    if master_player is null then raise exception 'Player is not on the confirmed SuperCoach master list'; end if;
    price := coalesce((master_player->>'price')::numeric,0);
    chosen_pos := upper(coalesce(p_payload->>'position',''));
    if price<=0 or chosen_pos='' or not (chosen_pos=any(string_to_array(upper(coalesce(master_player->>'position','')),'/'))) then
      raise exception 'Choose one current eligible SuperCoach position for this contract';
    end if;

    select r0.roster into roster from public.pegs_roster_authority r0 where r0.team_key=k for update;
    select e into rec from jsonb_array_elements(coalesce(roster,'[]'::jsonb)) e
    where public.pegs_canonical_player_name(e->>'player')=public.pegs_canonical_player_name(p_payload->>'player') limit 1;
    if rec is null then raise exception 'Player is no longer owned by this franchise'; end if;

    if t='ELEVATION' then
      if lower(coalesce(rec->>'contract',''))<>'rookie' then raise exception 'Player is no longer on a Rookie contract'; end if;
      select coalesce(value,'[]'::jsonb) into actions from public.pegs_state where key='commissioner_actions';
      if exists(
        select 1 from jsonb_array_elements(coalesce(actions,'[]'::jsonb)) a
        where upper(coalesce(a->>'type','')) in ('ROOKIE ELEVATION','ROOKIE UPGRADE')
          and upper(coalesce(a->>'team',''))=upper(k)
          and coalesce((a->>'season')::integer,0)=season_no
      ) or exists(
        select 1 from public.pegs_proposals q
        where q.type='ELEVATION' and q.proposer_team=k
          and q.status in ('PENDING','AWAITING_COUNTERPARTY','AWAITING_COMMISSIONER')
          and coalesce((q.payload->>'season')::integer,season_no)=season_no
      ) then raise exception 'This franchise has already used or requested its Rookie elevation for this season'; end if;
      contract_end := season_no + case when phase_norm='Mid-Season' then 3 else 2 end;
      term_years := case when phase_norm='Mid-Season' then 2.5 else 2 end;
      p_payload := p_payload || jsonb_build_object(
        'player',rec->>'player','oldSalary',coalesce((rec->>'salary')::numeric,0),'oldPosition',rec->>'position',
        'newSalary',price,'position',chosen_pos,'season',season_no,'contractEnd',contract_end,'contractTermYears',term_years,
        'quoteSource','Confirmed '||phase_norm||' SuperCoach master list'
      );
      select coalesce(jsonb_agg(
        case when public.pegs_canonical_player_name(e->>'player')=public.pegs_canonical_player_name(rec->>'player')
             then jsonb_set(jsonb_set(jsonb_set(jsonb_set(e,'{contract}','"Main"'::jsonb,true),'{salary}',to_jsonb(price),true),'{position}',to_jsonb(chosen_pos),true),'{contractEnd}',to_jsonb(contract_end),true)
             else e end
      ),'[]'::jsonb) into after_roster from jsonb_array_elements(roster) e;
      if not public.pegs_roster_is_legal(after_roster) then raise exception 'Rookie elevation would breach the current salary, list or Field-position rules'; end if;
      insert into public.pegs_proposals(type,phase,proposer_team,payload,status)
      values('ELEVATION',phase_norm,k,p_payload,'AWAITING_COMMISSIONER') returning * into r;

    else
      if phase_norm<>'Pre-Season' then raise exception 'Contract renewals are preseason-only'; end if;
      if lower(coalesce(rec->>'contract',''))<>'main' or coalesce((rec->>'contractEnd')::integer,9999)>season_no then
        raise exception 'This Main contract is not due for renewal';
      end if;
      if exists(
        select 1 from public.pegs_proposals q
        where q.type='RENEWAL' and q.proposer_team=k
          and q.status in ('PENDING','AWAITING_COUNTERPARTY','AWAITING_COMMISSIONER')
          and public.pegs_canonical_player_name(q.payload->>'player')=public.pegs_canonical_player_name(rec->>'player')
      ) then raise exception 'A renewal request for this player is already pending'; end if;
      contract_end := season_no+2;
      p_payload := p_payload || jsonb_build_object(
        'player',rec->>'player','oldSalary',coalesce((rec->>'salary')::numeric,0),'oldPosition',rec->>'position',
        'oldContractEnd',coalesce((rec->>'contractEnd')::integer,0),'newSalary',price,'position',chosen_pos,
        'season',season_no,'contractEnd',contract_end,'contractTermYears',2,
        'quoteSource','Confirmed Pre-Season SuperCoach master list'
      );
      insert into public.pegs_proposals(type,phase,proposer_team,payload,status)
      values('RENEWAL','Pre-Season',k,p_payload,'AWAITING_COMMISSIONER') returning * into r;
    end if;

  else
    raise exception 'Unsupported proposal type';
  end if;

  return to_jsonb(r);
end;
$$;

revoke all on function public.pegs_submit_team_proposal(text,text,text,jsonb) from public, anon;
grant execute on function public.pegs_submit_team_proposal(text,text,text,jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Direct-confirmation draft pick. Valid team picks are applied atomically and
-- immediately; there is no Commissioner approval inbox for draft selections.
-- ---------------------------------------------------------------------------

create or replace function public.pegs_submit_draft_pick_direct(
  p_pick integer,
  p_player text,
  p_position text,
  p_contract text,
  p_list_status text,
  p_session_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  k text := public.pegs_current_team_key();
  s jsonb; pool public.pegs_draft_pools%rowtype; pl jsonb; roster jsonb; after_roster jsonb;
  idx integer; current_pick integer; order_len integer; season_no integer; next_idx integer; contract_end integer;
  current_team text; draft_type text; chosen_pos text; contract_type text; list_status text; price numeric;
  action jsonb; actions jsonb; windows jsonb; cycle jsonb; snaps jsonb; season_setup jsonb; rosters_json jsonb; effective_round integer;
  now_text text := now()::text;
begin
  if k is null then raise exception 'Team login required' using errcode='42501'; end if;
  select value into s from public.pegs_state where key='draft_state' for update;
  if s is null or not coalesce((s->>'active')::boolean,false) then raise exception 'The draft is closed'; end if;

  idx := greatest(0,coalesce((s->>'currentIndex')::integer,0));
  current_pick := greatest(1,coalesce((s->>'currentPick')::integer,idx+1));
  order_len := jsonb_array_length(coalesce(s->'order','[]'::jsonb));
  current_team := case when idx<order_len then s->'order'->>idx else '' end;
  if current_team<>k then raise exception 'It is not your pick' using errcode='42501'; end if;
  if current_pick<>p_pick then raise exception 'The live pick has changed'; end if;
  if coalesce(s->>'sessionId','')<>coalesce(p_session_id,'') then raise exception 'Draft session mismatch'; end if;

  draft_type := coalesce(s->>'type','Pre-Season');
  season_no := coalesce((s->>'season')::integer,0);
  chosen_pos := upper(coalesce(p_position,''));
  contract_type := case when lower(coalesce(p_contract,''))='rookie' then 'Rookie' else 'Main' end;
  list_status := case when lower(coalesce(p_list_status,''))='interchange' then 'Interchange' else 'Field' end;

  if lower(draft_type)='rookie draft' then
    if contract_type<>'Rookie' or list_status<>'Interchange' then raise exception 'Rookie Draft selections must be Rookie contracts on the Rookie List'; end if;
    contract_end := season_no+1;
  elsif lower(draft_type)='mid-season' then
    if contract_type<>'Main' then raise exception 'Mid-Season Draft selections must be Main contracts'; end if;
    -- 2.5-year term: the balance of this season plus the next two full seasons.
    contract_end := season_no+3;
  else
    if contract_type<>'Main' then raise exception 'Pre-Season Draft selections must be Main contracts'; end if;
    contract_end := season_no+2;
  end if;

  select * into pool from public.pegs_draft_pools
  where session_id=coalesce(s->>'poolSessionId','') and complete for share;
  if not found then raise exception 'A complete frozen player pool is required before drafting'; end if;
  select e into pl from jsonb_array_elements(pool.players) e
  where public.pegs_canonical_player_name(e->>'player')=public.pegs_canonical_player_name(p_player) limit 1;
  if pl is null then raise exception 'Player is not in the frozen draft pool'; end if;
  if chosen_pos='' or not (chosen_pos=any(string_to_array(upper(coalesce(pl->>'position','')),'/'))) then raise exception 'Choose one valid PEGS position for this contract'; end if;
  price := coalesce((pl->>'price')::numeric,0);
  if price<=0 then raise exception 'Frozen draft price is unavailable'; end if;
  if exists(select 1 from public.pegs_roster_authority a, jsonb_array_elements(a.roster) e where public.pegs_canonical_player_name(e->>'player')=public.pegs_canonical_player_name(pl->>'player')) then
    raise exception 'Player is already on a PEGS list';
  end if;

  select r0.roster into roster from public.pegs_roster_authority r0 where r0.team_key=k for update;
  if roster is null then raise exception 'Server roster authority is not initialised'; end if;
  after_roster := roster || jsonb_build_array(jsonb_build_object(
    'player',pl->>'player','contract',contract_type,'salary',price,'position',chosen_pos,
    'status',list_status,'contractEnd',contract_end,'club',coalesce(pl->>'club','')
  ));
  if not public.pegs_roster_is_legal(after_roster) then raise exception 'Draft selection would breach salary/list/position caps'; end if;

  action := jsonb_build_object(
    'type','Drafted','status','CONFIRMED','phase',draft_type,'draftSeason',season_no,'sessionId',p_session_id,
    'pick',p_pick,'team',k,'player',pl->>'player','position',chosen_pos,'club',coalesce(pl->>'club',''),
    'contract',contract_type,'listStatus',list_status,'salary',price,'contractEnd',contract_end,
    'timestamp',now_text,'detail',draft_type||' pick '||p_pick||': '||(pl->>'player')||' ('||chosen_pos||')'
  );

  update public.pegs_roster_authority set roster=after_roster,updated_at=now() where team_key=k;

  select coalesce(value,'[]'::jsonb) into actions from public.pegs_state where key='commissioner_actions' for update;
  actions := jsonb_build_array(action) || coalesce(actions,'[]'::jsonb);
  insert into public.pegs_state(key,value,updated_at) values('commissioner_actions',actions,now())
  on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at;

  next_idx := idx+1;
  s := jsonb_set(s,'{currentIndex}',to_jsonb(next_idx),true);
  s := jsonb_set(s,'{currentPick}',to_jsonb(current_pick+1),true);
  s := jsonb_set(s,'{pickStartedAt}',to_jsonb(now_text),true);
  s := jsonb_set(s,'{updatedAt}',to_jsonb(now_text),true);

  if order_len=0 or next_idx>=order_len then
    s := jsonb_set(s,'{active}','false'::jsonb,true);
    s := jsonb_set(s,'{endedAt}',to_jsonb(now_text),true);

    select value into windows from public.pegs_state where key='proposal_windows' for update;
    if windows is not null then
      cycle := coalesce(windows->'rosterCycle','{}'::jsonb);
      if lower(draft_type)='pre-season' then
        cycle := jsonb_set(cycle,'{phase}','"ROOKIE_DRAFT"'::jsonb,true);
        cycle := jsonb_set(cycle,'{preSeasonDraftCompletedAt}',to_jsonb(now_text),true);
      elsif lower(draft_type)='rookie draft' then
        cycle := jsonb_set(cycle,'{phase}','"ROSTERS_LOCKED"'::jsonb,true);
        cycle := jsonb_set(cycle,'{rookieDraftCompletedAt}',to_jsonb(now_text),true);
      else
        cycle := jsonb_set(cycle,'{phase}','"POST_MIDSEASON_LOCKED"'::jsonb,true);
        cycle := jsonb_set(cycle,'{midSeasonDraftCompletedAt}',to_jsonb(now_text),true);
      end if;
      cycle := jsonb_set(cycle,'{updatedAt}',to_jsonb(now_text),true);
      windows := jsonb_set(windows,'{rosterCycle}',cycle,true);
      update public.pegs_state set value=windows,updated_at=now() where key='proposal_windows';
    end if;

    if lower(draft_type) in ('rookie draft','mid-season') then
      select coalesce(jsonb_object_agg(team_key,roster),'{}'::jsonb) into rosters_json from public.pegs_roster_authority;
      select coalesce(value,'{}'::jsonb) into snaps from public.pegs_state where key='scoring_snapshots' for update;
      snaps := coalesce(snaps,'{}'::jsonb);
      if not (snaps ? season_no::text) then snaps := jsonb_set(snaps,array[season_no::text],'{}'::jsonb,true); end if;
      if lower(draft_type)='rookie draft' then
        effective_round := 1;
        snaps := jsonb_set(snaps,array[season_no::text,'preSeason'],jsonb_build_object('stage','Pre-Season','capturedAt',now_text,'effectiveFromRound',effective_round,'rosters',rosters_json),true);
      else
        select value into season_setup from public.pegs_state where key='season_setup';
        effective_round := greatest(1,coalesce((season_setup->>'currentRound')::integer,1),coalesce((season_setup->>'completedThroughRound')::integer,0)+1);
        snaps := jsonb_set(snaps,array[season_no::text,'midSeason'],jsonb_build_object('stage','Mid-Season','capturedAt',now_text,'effectiveFromRound',effective_round,'rosters',rosters_json),true);
      end if;
      insert into public.pegs_state(key,value,updated_at) values('scoring_snapshots',snaps,now())
      on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at;
    end if;
  end if;

  update public.pegs_state set value=s,updated_at=now() where key='draft_state';

  if to_regclass('public.pegs_audit_log') is not null then
    insert into public.pegs_audit_log(actor_user_id,actor_role,actor_team,action,entity_type,entity_id,detail)
    values(auth.uid(),'team',k,'DRAFT_PICK_CONFIRMED','draft',p_session_id||':'||p_pick,
      jsonb_build_object('pick',p_pick,'player',pl->>'player','position',chosen_pos,'salary',price,'phase',draft_type,'season',season_no));
  end if;

  return jsonb_build_object('action',action,'draft_state',s);
end;
$$;

revoke all on function public.pegs_submit_draft_pick_direct(integer,text,text,text,text,text) from public, anon;
grant execute on function public.pegs_submit_draft_pick_direct(integer,text,text,text,text,text) to authenticated;

-- ---------------------------------------------------------------------------
-- Recovery / reversal RPCs used by the current website.
-- ---------------------------------------------------------------------------

create or replace function public.pegs_replace_backups_with_snapshot(p_label text,p_reason text,p_snapshot jsonb)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id bigint; season_no integer; round_no integer;
begin
  if not public.is_pegs_commissioner() then raise exception 'Commissioner access required' using errcode='42501'; end if;
  season_no := nullif(p_snapshot#>>'{state,season_setup,season}','')::integer;
  round_no := nullif(p_snapshot#>>'{state,season_setup,currentRound}','')::integer;
  delete from public.pegs_backups;
  insert into public.pegs_backups(season,round,label,reason,snapshot,created_by)
  values(season_no,round_no,coalesce(p_label,''),coalesce(p_reason,'BASELINE_REPLACE'),coalesce(p_snapshot,'{}'::jsonb),auth.uid())
  returning id into new_id;
  if to_regclass('public.pegs_audit_log') is not null then
    insert into public.pegs_audit_log(actor_user_id,actor_role,action,entity_type,entity_id,detail)
    values(auth.uid(),'commissioner','BACKUP_BASELINE_REPLACED','backup',new_id::text,jsonb_build_object('label',p_label,'reason',p_reason));
  end if;
  return new_id;
end;
$$;

revoke all on function public.pegs_replace_backups_with_snapshot(text,text,jsonb) from public, anon;
grant execute on function public.pegs_replace_backups_with_snapshot(text,text,jsonb) to authenticated;

create or replace function public.pegs_reverse_commissioner_action(p_action jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actions jsonb; updated jsonb; removed boolean := false; elem jsonb;
begin
  if not public.is_pegs_commissioner() then raise exception 'Commissioner access required' using errcode='42501'; end if;
  select coalesce(value,'[]'::jsonb) into actions from public.pegs_state where key='commissioner_actions' for update;
  updated := '[]'::jsonb;
  for elem in select value from jsonb_array_elements(coalesce(actions,'[]'::jsonb)) loop
    if not removed and (
      elem=p_action or (
        coalesce(elem->>'timestamp','')=coalesce(p_action->>'timestamp','')
        and coalesce(elem->>'type','')=coalesce(p_action->>'type','')
        and coalesce(elem->>'team',elem->>'teamA','')=coalesce(p_action->>'team',p_action->>'teamA','')
        and coalesce(elem->>'detail','')=coalesce(p_action->>'detail','')
      )
    ) then removed := true;
    else updated := updated || jsonb_build_array(elem);
    end if;
  end loop;
  if not removed then raise exception 'Commissioner action not found'; end if;
  insert into public.pegs_state(key,value,updated_at) values('commissioner_actions',updated,now())
  on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at;
  if to_regclass('public.pegs_audit_log') is not null then
    insert into public.pegs_audit_log(actor_user_id,actor_role,action,entity_type,entity_id,detail)
    values(auth.uid(),'commissioner','TRANSACTION_REVERSED','transaction',coalesce(p_action->>'timestamp',''),p_action);
  end if;
  return updated;
end;
$$;

revoke all on function public.pegs_reverse_commissioner_action(jsonb) from public, anon;
grant execute on function public.pegs_reverse_commissioner_action(jsonb) to authenticated;

create or replace function public.pegs_reverse_legacy_rookie_elevation(p_team text,p_player text,p_season integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_pegs_commissioner() then raise exception 'Commissioner access required' using errcode='42501'; end if;
  -- The website records the legacy transaction reversal in pegs_state and then
  -- re-syncs the authoritative roster mirror. This RPC provides a server-side
  -- permission/audit boundary for that legacy-only operation.
  if to_regclass('public.pegs_audit_log') is not null then
    insert into public.pegs_audit_log(actor_user_id,actor_role,action,entity_type,entity_id,detail)
    values(auth.uid(),'commissioner','LEGACY_ROOKIE_ELEVATION_REVERSED','transaction',coalesce(p_team,'')||':'||coalesce(p_player,''),jsonb_build_object('team',p_team,'player',p_player,'season',p_season));
  end if;
  return true;
end;
$$;

revoke all on function public.pegs_reverse_legacy_rookie_elevation(text,text,integer) from public, anon;
grant execute on function public.pegs_reverse_legacy_rookie_elevation(text,text,integer) to authenticated;

commit;
