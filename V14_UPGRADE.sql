-- PEGS v14 upgrade: team accounts, server-enforced team actions,
-- frozen draft pools, trade counterparty approval, audit history and backups.
-- Safe to run more than once after the existing PEGS schema.

-- ---------------------------------------------------------------------------
-- Team accounts
-- ---------------------------------------------------------------------------
create table if not exists public.pegs_team_accounts (
  team_key text primary key,
  coach_name text not null,
  username text not null unique,
  user_id uuid unique references auth.users(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pegs_team_accounts enable row level security;

drop policy if exists "PEGS team can read own account" on public.pegs_team_accounts;
create policy "PEGS team can read own account"
on public.pegs_team_accounts for select
to authenticated
using (user_id = auth.uid() or public.is_pegs_commissioner());

-- Current coach names are also the login usernames. Passwords are never stored
-- in this table; the Commissioner account tool generates/reset them through Auth.
insert into public.pegs_team_accounts(team_key,coach_name,username)
values
  ('CAMA','Cama','cama'),
  ('JAYDEN','Jayden','jayden'),
  ('TOM','Tom','tom'),
  ('BRETT','Brett','brett'),
  ('SEMINI','Semini','semini'),
  ('KARIKAS','Karikas','karikas'),
  ('DARCY','Darcy','darcy'),
  ('PAT','Pat','pat'),
  ('SCHULZ','Schulz','schulz'),
  ('FENNER','Fenner','fenner'),
  ('PETO','Peto','peto'),
  ('MARCUS','Marcus','marcus')
on conflict (team_key) do update
set coach_name=excluded.coach_name, username=excluded.username, updated_at=now();

create or replace function public.pegs_current_team_key()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select a.team_key
  from public.pegs_team_accounts a
  where a.user_id = auth.uid() and a.active
  limit 1;
$$;

grant execute on function public.pegs_current_team_key() to authenticated;

create or replace function public.pegs_whoami()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  a public.pegs_team_accounts%rowtype;
begin
  if auth.uid() is null then
    return jsonb_build_object('role','public');
  end if;
  if public.is_pegs_commissioner() then
    return jsonb_build_object('role','commissioner');
  end if;
  select * into a from public.pegs_team_accounts where user_id=auth.uid() and active limit 1;
  if found then
    return jsonb_build_object('role','team','teamKey',a.team_key,'coachName',a.coach_name,'username',a.username);
  end if;
  return jsonb_build_object('role','unknown');
end;
$$;

grant execute on function public.pegs_whoami() to authenticated;

-- ---------------------------------------------------------------------------
-- Server authority mirrors. These are derived from the official Commissioner
-- action ledger and let the database independently block spoofed/illegal team
-- submissions even if someone edits JavaScript in their browser.
-- ---------------------------------------------------------------------------
create table if not exists public.pegs_roster_authority (
  team_key text primary key,
  roster jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.pegs_roster_authority enable row level security;

drop policy if exists "PEGS public can read roster authority" on public.pegs_roster_authority;
create policy "PEGS public can read roster authority"
on public.pegs_roster_authority for select
to anon, authenticated
using (true);

drop policy if exists "PEGS commissioner can manage roster authority" on public.pegs_roster_authority;
create policy "PEGS commissioner can manage roster authority"
on public.pegs_roster_authority for all
to authenticated
using (public.is_pegs_commissioner())
with check (public.is_pegs_commissioner());

create table if not exists public.pegs_draft_pick_authority (
  pick_id text primary key,
  phase text not null,
  season integer not null,
  pick integer not null,
  round integer not null default 0,
  original_owner text not null,
  owner text not null,
  updated_at timestamptz not null default now()
);

alter table public.pegs_draft_pick_authority enable row level security;

drop policy if exists "PEGS public can read pick authority" on public.pegs_draft_pick_authority;
create policy "PEGS public can read pick authority"
on public.pegs_draft_pick_authority for select
to anon, authenticated
using (true);

drop policy if exists "PEGS commissioner can manage pick authority" on public.pegs_draft_pick_authority;
create policy "PEGS commissioner can manage pick authority"
on public.pegs_draft_pick_authority for all
to authenticated
using (public.is_pegs_commissioner())
with check (public.is_pegs_commissioner());

create or replace function public.pegs_sync_roster_authority(p_rosters jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  n integer := 0;
begin
  if not public.is_pegs_commissioner() then
    raise exception 'Commissioner access required' using errcode='42501';
  end if;
  if jsonb_typeof(coalesce(p_rosters,'{}'::jsonb)) <> 'object' then
    raise exception 'Roster authority must be a JSON object';
  end if;
  for r in select key,value from jsonb_each(p_rosters) loop
    insert into public.pegs_roster_authority(team_key,roster,updated_at)
    values(r.key,coalesce(r.value,'[]'::jsonb),now())
    on conflict(team_key) do update set roster=excluded.roster,updated_at=now();
    n := n + 1;
  end loop;
  return n;
end;
$$;

revoke all on function public.pegs_sync_roster_authority(jsonb) from public, anon;
grant execute on function public.pegs_sync_roster_authority(jsonb) to authenticated;

create or replace function public.pegs_sync_pick_authority(p_picks jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  x jsonb;
  n integer := 0;
begin
  if not public.is_pegs_commissioner() then
    raise exception 'Commissioner access required' using errcode='42501';
  end if;
  if jsonb_typeof(coalesce(p_picks,'[]'::jsonb)) <> 'array' then
    raise exception 'Pick authority must be a JSON array';
  end if;
  delete from public.pegs_draft_pick_authority;
  for x in select value from jsonb_array_elements(p_picks) loop
    insert into public.pegs_draft_pick_authority(pick_id,phase,season,pick,round,original_owner,owner,updated_at)
    values(
      x->>'id', x->>'type', coalesce((x->>'season')::integer,0),
      coalesce((x->>'pick')::integer,0), coalesce((x->>'round')::integer,0),
      coalesce(x->>'originalOwner',''), coalesce(x->>'owner',''), now()
    )
    on conflict(pick_id) do update set phase=excluded.phase,season=excluded.season,pick=excluded.pick,
      round=excluded.round,original_owner=excluded.original_owner,owner=excluded.owner,updated_at=now();
    n := n + 1;
  end loop;
  return n;
end;
$$;

revoke all on function public.pegs_sync_pick_authority(jsonb) from public, anon;
grant execute on function public.pegs_sync_pick_authority(jsonb) to authenticated;

create or replace function public.pegs_roster_summary(p_roster jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  with r as (
    select e
    from jsonb_array_elements(coalesce(p_roster,'[]'::jsonb)) e
  ), a as (
    select
      coalesce(sum(case when lower(e->>'contract')='main' then coalesce((e->>'salary')::numeric,0) else 0 end),0) as main_salary,
      coalesce(sum(case when lower(e->>'status')='field' then coalesce((e->>'salary')::numeric,0) else 0 end),0) as field_salary,
      coalesce(sum(case when lower(e->>'contract')='rookie' then coalesce((e->>'salary')::numeric,0) else 0 end),0) as rookie_salary,
      count(*) filter (where lower(e->>'contract')='main') as main_count,
      count(*) filter (where lower(e->>'status')='field') as field_count,
      count(*) filter (where lower(e->>'status')='interchange') as interchange_count,
      count(*) filter (where lower(e->>'status')='field' and upper(e->>'position')='DEF') as def_count,
      count(*) filter (where lower(e->>'status')='field' and upper(e->>'position')='MID') as mid_count,
      count(*) filter (where lower(e->>'status')='field' and upper(e->>'position')='FWD') as fwd_count,
      count(*) filter (where lower(e->>'status')='field' and upper(e->>'position')='RUC') as ruc_count
    from r
  )
  select jsonb_build_object(
    'caps',jsonb_build_object('main',main_salary,'field',field_salary,'rookie',rookie_salary),
    'counts',jsonb_build_object('main',main_count,'field',field_count,'interchange',interchange_count,
      'DEF',def_count,'MID',mid_count,'FWD',fwd_count,'RUC',ruc_count)
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
    coalesce((s->'counts'->>'field')::integer,0) <= 28 and
    coalesce((s->'counts'->>'DEF')::integer,0) <= 8 and
    coalesce((s->'counts'->>'MID')::integer,0) <= 10 and
    coalesce((s->'counts'->>'FWD')::integer,0) <= 8 and
    coalesce((s->'counts'->>'RUC')::integer,0) <= 2
  from (select public.pegs_roster_summary(p_roster) s) q;
$$;

grant execute on function public.pegs_roster_is_legal(jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Frozen SuperCoach draft pool snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.pegs_draft_pools (
  session_id text primary key,
  season integer not null,
  phase text not null,
  captured_at timestamptz not null default now(),
  source text not null default 'Supercoach.live',
  complete boolean not null default false,
  club_count integer not null default 0,
  player_count integer not null default 0,
  players jsonb not null default '[]'::jsonb
);

alter table public.pegs_draft_pools enable row level security;

drop policy if exists "PEGS public can read draft pools" on public.pegs_draft_pools;
create policy "PEGS public can read draft pools"
on public.pegs_draft_pools for select
to anon, authenticated
using (true);

drop policy if exists "PEGS commissioner can insert draft pools" on public.pegs_draft_pools;
create policy "PEGS commissioner can insert draft pools"
on public.pegs_draft_pools for insert
to authenticated
with check (public.is_pegs_commissioner());

drop policy if exists "PEGS commissioner can update draft pools" on public.pegs_draft_pools;
create policy "PEGS commissioner can update draft pools"
on public.pegs_draft_pools for update
to authenticated
using (public.is_pegs_commissioner())
with check (public.is_pegs_commissioner());

drop policy if exists "PEGS commissioner can delete draft pools" on public.pegs_draft_pools;
create policy "PEGS commissioner can delete draft pools"
on public.pegs_draft_pools for delete
to authenticated
using (public.is_pegs_commissioner());

-- ---------------------------------------------------------------------------
-- Proposal workflow upgrade
-- ---------------------------------------------------------------------------
alter table public.pegs_proposals add column if not exists counterparty_decided_at timestamptz;
alter table public.pegs_proposals add column if not exists counterparty_user_id uuid;

alter table public.pegs_proposals drop constraint if exists pegs_proposals_status_check;
alter table public.pegs_proposals drop constraint if exists pegs_proposals_status_check1;
alter table public.pegs_proposals drop constraint if exists pegs_proposals_status_check2;
-- The original anonymous constraint may have an automatically generated name.
do $$
declare r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid='public.pegs_proposals'::regclass and contype='c'
      and pg_get_constraintdef(oid) ilike '%status%PENDING%APPROVED%REJECTED%'
  loop
    execute format('alter table public.pegs_proposals drop constraint %I',r.conname);
  end loop;
end $$;

alter table public.pegs_proposals add constraint pegs_proposals_status_check
check (status in ('PENDING','AWAITING_COUNTERPARTY','AWAITING_COMMISSIONER','DECLINED','APPROVED','REJECTED','CANCELLED'));

-- Direct browser inserts are no longer accepted. Team submissions go through a
-- security-definer RPC that derives the proposer from auth.uid().
-- Proposals are no longer a public inbox. The Commissioner sees all proposals;
-- a coach sees only proposals involving their authenticated franchise.
drop policy if exists "PEGS public can read proposals" on public.pegs_proposals;
drop policy if exists "PEGS teams can read relevant proposals" on public.pegs_proposals;
create policy "PEGS teams can read relevant proposals"
on public.pegs_proposals for select
to authenticated
using (
  public.is_pegs_commissioner()
  or proposer_team = public.pegs_current_team_key()
  or counterparty_team = public.pegs_current_team_key()
);

drop policy if exists "PEGS public can submit pending proposals" on public.pegs_proposals;
drop policy if exists "PEGS commissioner can insert proposals" on public.pegs_proposals;
create policy "PEGS commissioner can insert proposals"
on public.pegs_proposals for insert
to authenticated
with check (public.is_pegs_commissioner());

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
  if jsonb_typeof(pa)<>'array' or jsonb_typeof(pb)<>'array' or jsonb_typeof(pka)<>'array' or jsonb_typeof(pkb)<>'array' then
    errs := array_append(errs,'Trade assets are malformed.');
    return jsonb_build_object('legal',false,'errors',to_jsonb(errs));
  end if;
  if jsonb_array_length(pa)>3 or jsonb_array_length(pb)>3 or jsonb_array_length(pka)>3 or jsonb_array_length(pkb)>3 then
    errs := array_append(errs,'Maximum three players and three draft picks per side.');
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

  select coalesce(jsonb_agg(e),'[]'::jsonb) into aa from jsonb_array_elements(ra) e where not (pa ? (e->>'player'));
  select coalesce(jsonb_agg(e),'[]'::jsonb) into ab from jsonb_array_elements(rb) e where not (pb ? (e->>'player'));
  aa := coalesce(aa,'[]'::jsonb) || moved_b;
  ab := coalesce(ab,'[]'::jsonb) || moved_a;
  sa := public.pegs_roster_summary(aa); sb := public.pegs_roster_summary(ab);
  if not public.pegs_roster_is_legal(aa) then errs := array_append(errs,p_team_a||' cannot accommodate this trade under salary/list/position caps.'); end if;
  if not public.pegs_roster_is_legal(ab) then errs := array_append(errs,p_team_b||' cannot accommodate this trade under salary/list/position caps.'); end if;

  return jsonb_build_object(
    'legal',coalesce(array_length(errs,1),0)=0,
    'errors',to_jsonb(errs),
    'teamA',jsonb_build_object('teamKey',p_team_a,'before',public.pegs_roster_summary(ra),'after',sa),
    'teamB',jsonb_build_object('teamKey',p_team_b,'before',public.pegs_roster_summary(rb),'after',sb)
  );
end;
$$;

grant execute on function public.pegs_validate_trade_payload(text,text,text,jsonb) to authenticated;

create or replace function public.pegs_submit_team_proposal(p_type text,p_phase text,p_counterparty_team text,p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  k text := public.pegs_current_team_key();
  t text := upper(coalesce(p_type,''));
  v jsonb; r public.pegs_proposals%rowtype;
  roster jsonb; after_roster jsonb; in_name text; out_name text; nm text;
  draft_state jsonb; pool public.pegs_draft_pools%rowtype; pl jsonb; price numeric; chosen_pos text; contract_type text; list_status text;
begin
  if k is null then raise exception 'Team login required' using errcode='42501'; end if;
  if not public.pegs_proposal_window_open(t,coalesce(p_phase,'')) then raise exception 'This league window is closed'; end if;

  if t='TRADE' then
    if coalesce(p_counterparty_team,'')='' or p_counterparty_team=k then raise exception 'Choose a valid trade partner'; end if;
    v := public.pegs_validate_trade_payload(k,p_counterparty_team,p_phase,coalesce(p_payload,'{}'::jsonb));
    if not coalesce((v->>'legal')::boolean,false) then
      raise exception 'Trade blocked: %',coalesce(v->'errors'->>0,'roster rules not satisfied');
    end if;
    insert into public.pegs_proposals(type,phase,proposer_team,counterparty_team,payload,status)
    values('TRADE',p_phase,k,p_counterparty_team,p_payload || jsonb_build_object('submittedValidation',v),'AWAITING_COUNTERPARTY')
    returning * into r;

  elsif t='SWAP' then
    select r0.roster into roster from public.pegs_roster_authority r0 where r0.team_key=k;
    if roster is null then raise exception 'Server roster authority is not initialised'; end if;
    in_name := p_payload->>'playerIn'; out_name := p_payload->>'playerOut';
    if not exists(select 1 from jsonb_array_elements(roster) e where e->>'player'=in_name and lower(e->>'status')='interchange')
       or not exists(select 1 from jsonb_array_elements(roster) e where e->>'player'=out_name and lower(e->>'status')='field') then
      raise exception 'Swap players are not eligible on the current roster';
    end if;
    select coalesce(jsonb_agg(case when e->>'player'=in_name then jsonb_set(e,'{status}','"Field"'::jsonb,true)
                                   when e->>'player'=out_name then jsonb_set(e,'{status}','"Interchange"'::jsonb,true)
                                   else e end),'[]'::jsonb)
    into after_roster from jsonb_array_elements(roster) e;
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
      if not exists(select 1 from jsonb_array_elements(roster) e where e->>'player'=nm) then raise exception '% is no longer owned by this team',nm; end if;
    end loop;
    insert into public.pegs_proposals(type,phase,proposer_team,payload,status)
    values('DELIST',p_phase,k,p_payload,'AWAITING_COMMISSIONER') returning * into r;

  elsif t='DRAFT_PICK' then
    select value into draft_state from public.pegs_state where key='draft_state' for update;
    if draft_state is null or not coalesce((draft_state->>'active')::boolean,false) then raise exception 'The draft is closed'; end if;
    if coalesce(draft_state->>'type','')<>p_phase then raise exception 'Wrong draft phase'; end if;
    if coalesce(draft_state->'order'->>greatest(0,coalesce((draft_state->>'currentIndex')::integer,0)),'')<>k then raise exception 'It is not your pick'; end if;
    if coalesce((draft_state->>'currentPick')::integer,0)<>coalesce((p_payload->>'pick')::integer,-1) then raise exception 'The live pick has changed'; end if;
    if coalesce(draft_state->>'sessionId','')<>coalesce(p_payload->>'sessionId','') then raise exception 'Draft session mismatch'; end if;
    select * into pool from public.pegs_draft_pools where session_id=coalesce(draft_state->>'poolSessionId','') and complete;
    if not found then raise exception 'A complete frozen player pool is required before drafting'; end if;
    select e into pl from jsonb_array_elements(pool.players) e where lower(e->>'player')=lower(p_payload->>'player') limit 1;
    if pl is null then raise exception 'Player is not in the frozen draft pool'; end if;
    if exists(select 1 from public.pegs_roster_authority a, jsonb_array_elements(a.roster) e where lower(e->>'player')=lower(pl->>'player')) then
      raise exception 'Player is already on a PEGS list';
    end if;
    if exists(
      select 1 from public.pegs_proposals q
      where q.type='DRAFT_PICK'
        and q.status in ('PENDING','AWAITING_COUNTERPARTY','AWAITING_COMMISSIONER')
        and (coalesce(q.payload->>'sessionId','')=coalesce(p_payload->>'sessionId','') and coalesce((q.payload->>'pick')::integer,-1)=coalesce((p_payload->>'pick')::integer,-2)
             or lower(coalesce(q.payload->>'player',''))=lower(coalesce(pl->>'player','')))
    ) then
      raise exception 'This pick or player is already provisionally reserved';
    end if;
    chosen_pos := upper(coalesce(p_payload->>'position',''));
    if chosen_pos='' or not (chosen_pos=any(string_to_array(upper(coalesce(pl->>'position','')),'/'))) then raise exception 'Choose one valid PEGS position for this contract'; end if;
    contract_type := case when lower(coalesce(p_payload->>'contract','main'))='rookie' then 'Rookie' else 'Main' end;
    list_status := case when lower(coalesce(p_payload->>'listStatus','field'))='interchange' then 'Interchange' else 'Field' end;
    price := coalesce((pl->>'price')::numeric,0);
    select r0.roster into roster from public.pegs_roster_authority r0 where r0.team_key=k;
    if roster is null then raise exception 'Server roster authority is not initialised'; end if;
    after_roster := roster || jsonb_build_array(jsonb_build_object('player',pl->>'player','contract',contract_type,'salary',price,'position',chosen_pos,'status',list_status,'club',pl->>'club'));
    if not public.pegs_roster_is_legal(after_roster) then raise exception 'Draft selection would breach salary/list/position caps'; end if;
    p_payload := p_payload || jsonb_build_object('salary',price,'club',pl->>'club','poolSessionId',pool.session_id);
    insert into public.pegs_proposals(type,phase,proposer_team,payload,status)
    values('DRAFT_PICK',p_phase,k,p_payload,'AWAITING_COMMISSIONER') returning * into r;
  else
    raise exception 'Unsupported proposal type';
  end if;

  return to_jsonb(r);
end;
$$;

revoke all on function public.pegs_submit_team_proposal(text,text,text,jsonb) from public, anon;
grant execute on function public.pegs_submit_team_proposal(text,text,text,jsonb) to authenticated;

create or replace function public.pegs_respond_trade(p_proposal_id bigint,p_accept boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  k text := public.pegs_current_team_key();
  p public.pegs_proposals%rowtype;
  v jsonb;
begin
  if k is null then raise exception 'Team login required' using errcode='42501'; end if;
  select * into p from public.pegs_proposals where id=p_proposal_id for update;
  if not found or p.type<>'TRADE' then raise exception 'Trade request not found'; end if;
  if p.counterparty_team<>k then raise exception 'This trade is not addressed to your team' using errcode='42501'; end if;
  if p.status<>'AWAITING_COUNTERPARTY' then raise exception 'This trade has already been answered'; end if;
  if p_accept then
    v := public.pegs_validate_trade_payload(p.proposer_team,p.counterparty_team,p.phase,p.payload);
    if not coalesce((v->>'legal')::boolean,false) then
      raise exception 'Trade can no longer be accepted: %',coalesce(v->'errors'->>0,'roster rules not satisfied');
    end if;
    update public.pegs_proposals set status='AWAITING_COMMISSIONER',counterparty_decided_at=now(),counterparty_user_id=auth.uid(),payload=payload || jsonb_build_object('counterpartyValidation',v)
    where id=p.id returning * into p;
  else
    update public.pegs_proposals set status='DECLINED',counterparty_decided_at=now(),counterparty_user_id=auth.uid(),decided_at=now()
    where id=p.id returning * into p;
  end if;
  return to_jsonb(p);
end;
$$;

revoke all on function public.pegs_respond_trade(bigint,boolean) from public, anon;
grant execute on function public.pegs_respond_trade(bigint,boolean) to authenticated;

-- Draft clock advancement is now authenticated and tied to the logged-in team.
create or replace function public.pegs_advance_draft_after_submission(p_pick integer, p_team text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  s jsonb; idx integer; current_pick integer; order_len integer; current_team text;
begin
  if not public.is_pegs_commissioner() and coalesce(public.pegs_current_team_key(),'')<>coalesce(p_team,'') then
    raise exception 'You cannot submit a pick for another franchise' using errcode='42501';
  end if;
  select value into s from public.pegs_state where key='draft_state' for update;
  if s is null or not coalesce((s->>'active')::boolean,false) then return coalesce(s,'{}'::jsonb); end if;
  idx := greatest(0,coalesce((s->>'currentIndex')::integer,0));
  current_pick := greatest(1,coalesce((s->>'currentPick')::integer,idx+1));
  order_len := jsonb_array_length(coalesce(s->'order','[]'::jsonb));
  current_team := case when idx<order_len then s->'order'->>idx else '' end;
  if current_pick<>p_pick or current_team<>p_team then return s; end if;
  if not exists(
    select 1 from public.pegs_proposals p
    where p.type='DRAFT_PICK' and p.status='AWAITING_COMMISSIONER' and p.proposer_team=p_team
      and coalesce((p.payload->>'pick')::integer,0)=p_pick
      and coalesce(p.payload->>'sessionId','')=coalesce(s->>'sessionId','')
  ) then return s; end if;
  idx := idx+1;
  s := jsonb_set(s,'{currentIndex}',to_jsonb(idx),true);
  s := jsonb_set(s,'{currentPick}',to_jsonb(current_pick+1),true);
  s := jsonb_set(s,'{pickStartedAt}',to_jsonb(now()::text),true);
  s := jsonb_set(s,'{updatedAt}',to_jsonb(now()::text),true);
  if order_len=0 or idx>=order_len then
    s := jsonb_set(s,'{active}','false'::jsonb,true);
    s := jsonb_set(s,'{endedAt}',to_jsonb(now()::text),true);
  end if;
  update public.pegs_state set value=s,updated_at=now() where key='draft_state';
  return s;
end;
$$;

revoke all on function public.pegs_advance_draft_after_submission(integer,text) from public, anon;
grant execute on function public.pegs_advance_draft_after_submission(integer,text) to authenticated;

-- ---------------------------------------------------------------------------
-- Audit trail
-- ---------------------------------------------------------------------------
create table if not exists public.pegs_audit_log (
  id bigint generated by default as identity primary key,
  created_at timestamptz not null default now(),
  actor_user_id uuid,
  actor_role text not null default '',
  actor_team text,
  action text not null,
  entity_type text not null default '',
  entity_id text not null default '',
  detail jsonb not null default '{}'::jsonb
);

alter table public.pegs_audit_log enable row level security;

drop policy if exists "PEGS commissioner can read audit log" on public.pegs_audit_log;
create policy "PEGS commissioner can read audit log"
on public.pegs_audit_log for select
to authenticated
using (public.is_pegs_commissioner());

create or replace function public.pegs_log_commissioner_action(p_action text,p_entity_type text,p_entity_id text,p_detail jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_pegs_commissioner() then raise exception 'Commissioner access required' using errcode='42501'; end if;
  insert into public.pegs_audit_log(actor_user_id,actor_role,action,entity_type,entity_id,detail)
  values(auth.uid(),'commissioner',p_action,coalesce(p_entity_type,''),coalesce(p_entity_id,''),coalesce(p_detail,'{}'::jsonb));
end;
$$;

revoke all on function public.pegs_log_commissioner_action(text,text,text,jsonb) from public, anon;
grant execute on function public.pegs_log_commissioner_action(text,text,text,jsonb) to authenticated;

-- Log team proposal creation and trade response without exposing credentials.
create or replace function public.pegs_audit_team_proposal()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op='INSERT' then
    insert into public.pegs_audit_log(actor_user_id,actor_role,actor_team,action,entity_type,entity_id,detail)
    values(auth.uid(),case when public.is_pegs_commissioner() then 'commissioner' else 'team' end,new.proposer_team,'PROPOSAL_CREATED','proposal',new.id::text,jsonb_build_object('type',new.type,'status',new.status,'counterparty',new.counterparty_team));
  elsif tg_op='UPDATE' and old.status is distinct from new.status then
    insert into public.pegs_audit_log(actor_user_id,actor_role,actor_team,action,entity_type,entity_id,detail)
    values(auth.uid(),case when public.is_pegs_commissioner() then 'commissioner' else 'team' end,public.pegs_current_team_key(),'PROPOSAL_STATUS_CHANGED','proposal',new.id::text,jsonb_build_object('from',old.status,'to',new.status,'type',new.type));
  end if;
  return new;
end;
$$;

drop trigger if exists pegs_proposal_audit_trigger on public.pegs_proposals;
create trigger pegs_proposal_audit_trigger
after insert or update on public.pegs_proposals
for each row execute function public.pegs_audit_team_proposal();

-- ---------------------------------------------------------------------------
-- Immutable weekly/manual backups. Team Auth accounts are intentionally NOT
-- part of restore snapshots so a league-data rollback never changes passwords.
-- ---------------------------------------------------------------------------
create table if not exists public.pegs_backups (
  id bigint generated by default as identity primary key,
  created_at timestamptz not null default now(),
  season integer,
  round integer,
  label text not null default '',
  reason text not null default 'MANUAL',
  snapshot jsonb not null,
  created_by uuid references auth.users(id) on delete set null
);

alter table public.pegs_backups enable row level security;

drop policy if exists "PEGS commissioner can read backups" on public.pegs_backups;
create policy "PEGS commissioner can read backups"
on public.pegs_backups for select
to authenticated
using (public.is_pegs_commissioner());

create or replace function public.pegs_create_backup(p_label text default '',p_reason text default 'MANUAL',p_derived jsonb default '{}'::jsonb)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  state_json jsonb; proposals_json jsonb; pools_json jsonb; rosters_json jsonb; picks_json jsonb; audit_json jsonb;
  snap jsonb; new_id bigint; season_no integer; round_no integer;
begin
  if not public.is_pegs_commissioner() then raise exception 'Commissioner access required' using errcode='42501'; end if;
  select coalesce(jsonb_object_agg(key,value),'{}'::jsonb) into state_json from public.pegs_state;
  select coalesce(jsonb_agg(to_jsonb(p) order by p.id),'[]'::jsonb) into proposals_json from public.pegs_proposals p;
  select coalesce(jsonb_agg(to_jsonb(d) order by d.captured_at),'[]'::jsonb) into pools_json from public.pegs_draft_pools d;
  select coalesce(jsonb_object_agg(team_key,roster),'{}'::jsonb) into rosters_json from public.pegs_roster_authority;
  select coalesce(jsonb_agg(to_jsonb(k) order by k.season,k.phase,k.pick),'[]'::jsonb) into picks_json from public.pegs_draft_pick_authority k;
  select coalesce(jsonb_agg(to_jsonb(a) order by a.id),'[]'::jsonb) into audit_json from public.pegs_audit_log a;
  snap := jsonb_build_object('schemaVersion',14,'createdAt',now(),'state',state_json,'proposals',proposals_json,
    'draftPools',pools_json,'rosterAuthority',rosters_json,'pickAuthority',picks_json,'auditLog',audit_json,'derived',coalesce(p_derived,'{}'::jsonb));
  season_no := nullif(state_json->'season_setup'->>'season','')::integer;
  round_no := nullif(state_json->'season_setup'->>'currentRound','')::integer;
  insert into public.pegs_backups(season,round,label,reason,snapshot,created_by)
  values(season_no,round_no,coalesce(p_label,''),coalesce(p_reason,'MANUAL'),snap,auth.uid()) returning id into new_id;
  insert into public.pegs_audit_log(actor_user_id,actor_role,action,entity_type,entity_id,detail)
  values(auth.uid(),'commissioner','BACKUP_CREATED','backup',new_id::text,jsonb_build_object('label',p_label,'reason',p_reason));
  return new_id;
end;
$$;

revoke all on function public.pegs_create_backup(text,text,jsonb) from public, anon;
grant execute on function public.pegs_create_backup(text,text,jsonb) to authenticated;

create or replace function public.pegs_restore_backup(p_backup_id bigint)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  target jsonb; safeguard_id bigint; x jsonb; max_id bigint;
begin
  if not public.is_pegs_commissioner() then raise exception 'Commissioner access required' using errcode='42501'; end if;
  select snapshot into target from public.pegs_backups where id=p_backup_id;
  if target is null then raise exception 'Backup not found'; end if;

  safeguard_id := public.pegs_create_backup('Automatic pre-restore safeguard','PRE_RESTORE',jsonb_build_object('restoringBackupId',p_backup_id));

  delete from public.pegs_state;
  insert into public.pegs_state(key,value,updated_at)
  select key,value,now() from jsonb_each(coalesce(target->'state','{}'::jsonb));

  delete from public.pegs_proposals;
  for x in select value from jsonb_array_elements(coalesce(target->'proposals','[]'::jsonb)) loop
    insert into public.pegs_proposals(id,created_at,type,phase,proposer_team,counterparty_team,payload,status,commissioner_note,decided_at,counterparty_decided_at,counterparty_user_id)
    values(
      (x->>'id')::bigint,coalesce((x->>'created_at')::timestamptz,now()),x->>'type',coalesce(x->>'phase',''),x->>'proposer_team',nullif(x->>'counterparty_team',''),
      coalesce(x->'payload','{}'::jsonb),coalesce(x->>'status','PENDING'),coalesce(x->>'commissioner_note',''),nullif(x->>'decided_at','')::timestamptz,
      nullif(x->>'counterparty_decided_at','')::timestamptz,nullif(x->>'counterparty_user_id','')::uuid
    );
  end loop;
  select coalesce(max(id),1) into max_id from public.pegs_proposals;
  perform setval(pg_get_serial_sequence('public.pegs_proposals','id'),max_id,true);

  delete from public.pegs_draft_pools;
  for x in select value from jsonb_array_elements(coalesce(target->'draftPools','[]'::jsonb)) loop
    insert into public.pegs_draft_pools(session_id,season,phase,captured_at,source,complete,club_count,player_count,players)
    values(x->>'session_id',(x->>'season')::integer,x->>'phase',coalesce((x->>'captured_at')::timestamptz,now()),coalesce(x->>'source','Supercoach.live'),
      coalesce((x->>'complete')::boolean,false),coalesce((x->>'club_count')::integer,0),coalesce((x->>'player_count')::integer,0),coalesce(x->'players','[]'::jsonb));
  end loop;

  delete from public.pegs_roster_authority;
  insert into public.pegs_roster_authority(team_key,roster,updated_at)
  select key,value,now() from jsonb_each(coalesce(target->'rosterAuthority','{}'::jsonb));

  delete from public.pegs_draft_pick_authority;
  for x in select value from jsonb_array_elements(coalesce(target->'pickAuthority','[]'::jsonb)) loop
    insert into public.pegs_draft_pick_authority(pick_id,phase,season,pick,round,original_owner,owner,updated_at)
    values(x->>'pick_id',x->>'phase',(x->>'season')::integer,(x->>'pick')::integer,coalesce((x->>'round')::integer,0),x->>'original_owner',x->>'owner',now());
  end loop;

  insert into public.pegs_audit_log(actor_user_id,actor_role,action,entity_type,entity_id,detail)
  values(auth.uid(),'commissioner','BACKUP_RESTORED','backup',p_backup_id::text,jsonb_build_object('preRestoreSafeguardId',safeguard_id));
  return safeguard_id;
end;
$$;

revoke all on function public.pegs_restore_backup(bigint) from public, anon;
grant execute on function public.pegs_restore_backup(bigint) to authenticated;
