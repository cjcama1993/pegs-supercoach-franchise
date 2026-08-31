(() => {
  'use strict';

  const D = window.LEAGUE_DATA;
  const CONFIG = window.PEGS_CONFIG || {};
  const main = document.getElementById('main-content');
  const toastEl = document.getElementById('toast');
  const commissionerDialog = document.getElementById('commissioner-dialog');
  const commissionerContent = document.getElementById('commissioner-content');
  const teamDialog = document.getElementById('team-dialog');
  const teamLoginContent = document.getElementById('team-login-content');
  const teamMap = Object.fromEntries(D.teams.map(t => [t.key, t]));
  const ownerToKey = Object.fromEntries(D.teams.map(t => [t.owner.toUpperCase(), t.key]));
  const OVERRIDE_KEY = 'pegs-score-overrides-v6';
  const SELECTION_OVERRIDE_KEY = 'pegs-selection-overrides-v6';
  const STAGED_DRAFT_KEY = 'pegs-staged-draft-v6';
  const COMM_PIN_KEY = 'pegs-commissioner-pin-v6';
  const COMM_SESSION_KEY = 'pegs-commissioner-session-v6';
  const COMM_ACTIONS_KEY = 'pegs-commissioner-actions-v6';
  const DRAFT_STATE_KEY = 'pegs-draft-state-v6';
  const PROPOSALS_KEY = 'pegs-proposals-v6';
  const BACKEND_TOKEN_KEY = 'pegs-supabase-token-v6';
  const BACKEND_REFRESH_KEY = 'pegs-supabase-refresh-v14';
  const IDENTITY_KEY = 'pegs-identity-v14';
  const COMM_BACKEND_TOKEN_KEY = 'pegs-commissioner-supabase-token-v14q';
  const COMM_BACKEND_REFRESH_KEY = 'pegs-commissioner-supabase-refresh-v14q';
  const DRAFT_POOL_KEY = 'pegs-draft-pool-v14';
  const SEASON_SETUP_KEY = 'pegs-season-setup-v6';
  const SEASON_RESULTS_KEY = 'pegs-season-results-v6';
  const LIVE_FEED_KEY = 'pegs-live-feed-v6';
  const OPENING_BANK_KEY = 'pegs-opening-bank-v6';
  const PROPOSAL_WINDOWS_KEY = 'pegs-proposal-windows-v8';
  const SCORING_SNAPSHOTS_KEY = 'pegs-scoring-snapshots-v10';
  const FIGUREHEAD_OVERRIDE_KEY = 'pegs-figurehead-overrides-v11';
  const TRANSACTION_REVERSALS_KEY = 'pegs-transaction-reversals-v14o';
  const LEGACY_TRANSACTION_META = {"legacy|2026-07-15T22:45:11|Rookie swap|FENNER|Isaac Cumming → Field; Jeremy Cameron → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-07-15T22:45:11","team":"FENNER","detail":"Isaac Cumming → Field; Jeremy Cameron → Interchange","players":["Isaac Cumming","Jeremy Cameron"],"inverse":{"kind":"UNDO_SWAP","team":"FENNER","playerIn":"Isaac Cumming","playerOut":"Jeremy Cameron"}},"legacy|2026-06-06T22:45:11|Rookie swap|SCHULZ|Toby Nankervis → Field":{"source":"legacy","type":"Rookie swap","timestamp":"2026-06-06T22:45:11","team":"SCHULZ","detail":"Toby Nankervis → Field","players":["Toby Nankervis"],"inverse":{"kind":"UNDO_SWAP","team":"SCHULZ","playerIn":"Toby Nankervis","playerOut":""}},"legacy|2026-06-02T22:45:11|Rookie swap|FENNER|Logan Morris → Field; Isaac Cumming → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-06-02T22:45:11","team":"FENNER","detail":"Logan Morris → Field; Isaac Cumming → Interchange","players":["Logan Morris","Isaac Cumming"],"inverse":{"kind":"UNDO_SWAP","team":"FENNER","playerIn":"Logan Morris","playerOut":"Isaac Cumming"}},"legacy|2026-05-27T22:45:11.010000|Rookie swap|PAT|Changkuoth Jiath → Field; Matt Carroll → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-05-27T22:45:11.010000","team":"PAT","detail":"Changkuoth Jiath → Field; Matt Carroll → Interchange","players":["Changkuoth Jiath","Matt Carroll"],"inverse":{"kind":"UNDO_SWAP","team":"PAT","playerIn":"Changkuoth Jiath","playerOut":"Matt Carroll"}},"legacy|2026-05-27T22:32:24|Drafted|KARIKAS|Pick 67: Jackson Macrae (MID) · $420,600":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:32:24","team":"KARIKAS","detail":"Pick 67: Jackson Macrae (MID) · $420,600","players":["Jackson Macrae"],"inverse":{"kind":"REMOVE_PLAYER","team":"KARIKAS","player":"Jackson Macrae"},"pick":67,"draftType":"Mid-Season"},"legacy|2026-05-27T22:31:24|Drafted|SEMINI|Pick 60: Conor McKenna (FWD) · $214,900":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:31:24","team":"SEMINI","detail":"Pick 60: Conor McKenna (FWD) · $214,900","players":["Conor McKenna"],"inverse":{"kind":"REMOVE_PLAYER","team":"SEMINI","player":"Conor McKenna"},"pick":60,"draftType":"Mid-Season"},"legacy|2026-05-27T22:24:23.932000|Drafted|SCHULZ|Pick 56: Campbell Lake (FWD) · $99,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:24:23.932000","team":"SCHULZ","detail":"Pick 56: Campbell Lake (FWD) · $99,100","players":["Campbell Lake"],"inverse":{"kind":"REMOVE_PLAYER","team":"SCHULZ","player":"Campbell Lake"},"pick":56,"draftType":"Mid-Season"},"legacy|2026-05-27T22:22:26.855000|Drafted|KARIKAS|Pick 55: Will Hayward (FWD) · $381,400":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:22:26.855000","team":"KARIKAS","detail":"Pick 55: Will Hayward (FWD) · $381,400","players":["Will Hayward"],"inverse":{"kind":"REMOVE_PLAYER","team":"KARIKAS","player":"Will Hayward"},"pick":55,"draftType":"Mid-Season"},"legacy|2026-05-27T22:14:47.303000|Drafted|TOM|Pick 51: Jake Waterman (FWD) · $383,700":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:14:47.303000","team":"TOM","detail":"Pick 51: Jake Waterman (FWD) · $383,700","players":["Jake Waterman"],"inverse":{"kind":"REMOVE_PLAYER","team":"TOM","player":"Jake Waterman"},"pick":51,"draftType":"Mid-Season"},"legacy|2026-05-27T22:12:01.787000|Drafted|CAMA|Pick 50: Joshua Kelly (MID) · $477,400":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:12:01.787000","team":"CAMA","detail":"Pick 50: Joshua Kelly (MID) · $477,400","players":["Joshua Kelly"],"inverse":{"kind":"REMOVE_PLAYER","team":"CAMA","player":"Joshua Kelly"},"pick":50,"draftType":"Mid-Season"},"legacy|2026-05-27T22:10:43.649000|Drafted|DARCY|Pick 49: Oliver Hannaford (FWD) · $131,900":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:10:43.649000","team":"DARCY","detail":"Pick 49: Oliver Hannaford (FWD) · $131,900","players":["Oliver Hannaford"],"inverse":{"kind":"REMOVE_PLAYER","team":"DARCY","player":"Oliver Hannaford"},"pick":49,"draftType":"Mid-Season"},"legacy|2026-05-27T22:07:31.805000|Drafted|SEMINI|Pick 48: Conor Stone (DEF) · $235,200":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:07:31.805000","team":"SEMINI","detail":"Pick 48: Conor Stone (DEF) · $235,200","players":["Conor Stone"],"inverse":{"kind":"REMOVE_PLAYER","team":"SEMINI","player":"Conor Stone"},"pick":48,"draftType":"Mid-Season"},"legacy|2026-05-27T22:03:02.501000|Drafted|MARCUS|Pick 45: Oliver Greeves (MID) · $99,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T22:03:02.501000","team":"MARCUS","detail":"Pick 45: Oliver Greeves (MID) · $99,100","players":["Oliver Greeves"],"inverse":{"kind":"REMOVE_PLAYER","team":"MARCUS","player":"Oliver Greeves"},"pick":45,"draftType":"Mid-Season"},"legacy|2026-05-27T21:59:26.265000|Drafted|SCHULZ|Pick 44: Jayden Laverde (DEF) · $376,600":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:59:26.265000","team":"SCHULZ","detail":"Pick 44: Jayden Laverde (DEF) · $376,600","players":["Jayden Laverde"],"inverse":{"kind":"REMOVE_PLAYER","team":"SCHULZ","player":"Jayden Laverde"},"pick":44,"draftType":"Mid-Season"},"legacy|2026-05-27T21:58:14.024000|Drafted|KARIKAS|Pick 43: Elliot Yeo (FWD) · $426,300":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:58:14.024000","team":"KARIKAS","detail":"Pick 43: Elliot Yeo (FWD) · $426,300","players":["Elliot Yeo"],"inverse":{"kind":"REMOVE_PLAYER","team":"KARIKAS","player":"Elliot Yeo"},"pick":43,"draftType":"Mid-Season"},"legacy|2026-05-27T21:55:15.042000|Drafted|BRETT|Pick 42: Mitch Podhajski (FWD) · $99,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:55:15.042000","team":"BRETT","detail":"Pick 42: Mitch Podhajski (FWD) · $99,100","players":["Mitch Podhajski"],"inverse":{"kind":"REMOVE_PLAYER","team":"BRETT","player":"Mitch Podhajski"},"pick":42,"draftType":"Mid-Season"},"legacy|2026-05-27T21:51:53.188000|Drafted|PETO|Pick 40: Adam Treloar (MID) · $311,700":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:51:53.188000","team":"PETO","detail":"Pick 40: Adam Treloar (MID) · $311,700","players":["Adam Treloar"],"inverse":{"kind":"REMOVE_PLAYER","team":"PETO","player":"Adam Treloar"},"pick":40,"draftType":"Mid-Season"},"legacy|2026-05-27T21:43:56.739000|Drafted|TOM|Pick 39: Xavier Bamert (MID) · $99,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:43:56.739000","team":"TOM","detail":"Pick 39: Xavier Bamert (MID) · $99,100","players":["Xavier Bamert"],"inverse":{"kind":"REMOVE_PLAYER","team":"TOM","player":"Xavier Bamert"},"pick":39,"draftType":"Mid-Season"},"legacy|2026-05-27T21:42:29.942000|Drafted|CAMA|Pick 38: Koltyn Tholstrup (FWD) · $346,600":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:42:29.942000","team":"CAMA","detail":"Pick 38: Koltyn Tholstrup (FWD) · $346,600","players":["Koltyn Tholstrup"],"inverse":{"kind":"REMOVE_PLAYER","team":"CAMA","player":"Koltyn Tholstrup"},"pick":38,"draftType":"Mid-Season"},"legacy|2026-05-27T21:40:04.049000|Drafted|DARCY|Pick 37: Jack Ough (MID) · $119,900":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:40:04.049000","team":"DARCY","detail":"Pick 37: Jack Ough (MID) · $119,900","players":["Jack Ough"],"inverse":{"kind":"REMOVE_PLAYER","team":"DARCY","player":"Jack Ough"},"pick":37,"draftType":"Mid-Season"},"legacy|2026-05-27T21:38:45.781000|Drafted|SEMINI|Pick 36: Aliir Aliir (DEF) · $428,600":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:38:45.781000","team":"SEMINI","detail":"Pick 36: Aliir Aliir (DEF) · $428,600","players":["Aliir Aliir"],"inverse":{"kind":"REMOVE_PLAYER","team":"SEMINI","player":"Aliir Aliir"},"pick":36,"draftType":"Mid-Season"},"legacy|2026-05-27T21:37:31.184000|Drafted|PAT|Pick 35: James Rowbottom (MID) · $316,500":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:37:31.184000","team":"PAT","detail":"Pick 35: James Rowbottom (MID) · $316,500","players":["James Rowbottom"],"inverse":{"kind":"REMOVE_PLAYER","team":"PAT","player":"James Rowbottom"},"pick":35,"draftType":"Mid-Season"},"legacy|2026-05-27T21:34:09.455000|Drafted|MARCUS|Pick 33: Nic Newman (DEF) · $438,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:34:09.455000","team":"MARCUS","detail":"Pick 33: Nic Newman (DEF) · $438,100","players":["Nic Newman"],"inverse":{"kind":"REMOVE_PLAYER","team":"MARCUS","player":"Nic Newman"},"pick":33,"draftType":"Mid-Season"},"legacy|2026-05-27T21:33:14.644000|Drafted|SCHULZ|Pick 32: Thomas Liberatore (MID) · $562,800":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:33:14.644000","team":"SCHULZ","detail":"Pick 32: Thomas Liberatore (MID) · $562,800","players":["Thomas Liberatore"],"inverse":{"kind":"REMOVE_PLAYER","team":"SCHULZ","player":"Thomas Liberatore"},"pick":32,"draftType":"Mid-Season"},"legacy|2026-05-27T21:30:21.861000|Drafted|KARIKAS|Pick 31: Mitchell Edwards (RUC) · $223,700":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:30:21.861000","team":"KARIKAS","detail":"Pick 31: Mitchell Edwards (RUC) · $223,700","players":["Mitchell Edwards"],"inverse":{"kind":"REMOVE_PLAYER","team":"KARIKAS","player":"Mitchell Edwards"},"pick":31,"draftType":"Mid-Season"},"legacy|2026-05-27T21:28:35.793000|Drafted|BRETT|Pick 30: Oliver Francou (MID) · $99,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:28:35.793000","team":"BRETT","detail":"Pick 30: Oliver Francou (MID) · $99,100","players":["Oliver Francou"],"inverse":{"kind":"REMOVE_PLAYER","team":"BRETT","player":"Oliver Francou"},"pick":30,"draftType":"Mid-Season"},"legacy|2026-05-27T21:19:19.849000|Drafted|PETO|Pick 28: Cody Weightman (FWD) · $226,700":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:19:19.849000","team":"PETO","detail":"Pick 28: Cody Weightman (FWD) · $226,700","players":["Cody Weightman"],"inverse":{"kind":"REMOVE_PLAYER","team":"PETO","player":"Cody Weightman"},"pick":28,"draftType":"Mid-Season"},"legacy|2026-05-27T21:17:25.440000|Drafted|TOM|Pick 27: Karl Worner (DEF) · $403,600":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:17:25.440000","team":"TOM","detail":"Pick 27: Karl Worner (DEF) · $403,600","players":["Karl Worner"],"inverse":{"kind":"REMOVE_PLAYER","team":"TOM","player":"Karl Worner"},"pick":27,"draftType":"Mid-Season"},"legacy|2026-05-27T21:14:54.054000|Drafted|CAMA|Pick 26: Elijah Tsatas (MID) · $272,300":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:14:54.054000","team":"CAMA","detail":"Pick 26: Elijah Tsatas (MID) · $272,300","players":["Elijah Tsatas"],"inverse":{"kind":"REMOVE_PLAYER","team":"CAMA","player":"Elijah Tsatas"},"pick":26,"draftType":"Mid-Season"},"legacy|2026-05-27T21:13:49.577000|Drafted|DARCY|Pick 25: Seth Campbell (FWD) · $395,000":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:13:49.577000","team":"DARCY","detail":"Pick 25: Seth Campbell (FWD) · $395,000","players":["Seth Campbell"],"inverse":{"kind":"REMOVE_PLAYER","team":"DARCY","player":"Seth Campbell"},"pick":25,"draftType":"Mid-Season"},"legacy|2026-05-27T21:11:32.727000|Drafted|SEMINI|Pick 24: Bradley Hill (MID) · $431,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:11:32.727000","team":"SEMINI","detail":"Pick 24: Bradley Hill (MID) · $431,100","players":["Bradley Hill"],"inverse":{"kind":"REMOVE_PLAYER","team":"SEMINI","player":"Bradley Hill"},"pick":24,"draftType":"Mid-Season"},"legacy|2026-05-27T21:09:18.699000|Drafted|PAT|Pick 23: Adam Saad (DEF) · $420,200":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:09:18.699000","team":"PAT","detail":"Pick 23: Adam Saad (DEF) · $420,200","players":["Adam Saad"],"inverse":{"kind":"REMOVE_PLAYER","team":"PAT","player":"Adam Saad"},"pick":23,"draftType":"Mid-Season"},"legacy|2026-05-27T21:05:25.386000|Drafted|MARCUS|Pick 22: Daniel Turner (DEF) · $399,000":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:05:25.386000","team":"MARCUS","detail":"Pick 22: Daniel Turner (DEF) · $399,000","players":["Daniel Turner"],"inverse":{"kind":"REMOVE_PLAYER","team":"MARCUS","player":"Daniel Turner"},"pick":22,"draftType":"Mid-Season"},"legacy|2026-05-27T21:03:27.647000|Drafted|FENNER|Pick 21: Arthur Jones (MID) · $236,200":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T21:03:27.647000","team":"FENNER","detail":"Pick 21: Arthur Jones (MID) · $236,200","players":["Arthur Jones"],"inverse":{"kind":"REMOVE_PLAYER","team":"FENNER","player":"Arthur Jones"},"pick":21,"draftType":"Mid-Season"},"legacy|2026-05-27T20:57:52.201000|Drafted|SCHULZ|Pick 20: Joel Fitzgerald (MID) · $99,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:57:52.201000","team":"SCHULZ","detail":"Pick 20: Joel Fitzgerald (MID) · $99,100","players":["Joel Fitzgerald"],"inverse":{"kind":"REMOVE_PLAYER","team":"SCHULZ","player":"Joel Fitzgerald"},"pick":20,"draftType":"Mid-Season"},"legacy|2026-05-27T20:52:47.536000|Drafted|KARIKAS|Pick 19: Phoenix Gothard (FWD) · $324,900":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:52:47.536000","team":"KARIKAS","detail":"Pick 19: Phoenix Gothard (FWD) · $324,900","players":["Phoenix Gothard"],"inverse":{"kind":"REMOVE_PLAYER","team":"KARIKAS","player":"Phoenix Gothard"},"pick":19,"draftType":"Mid-Season"},"legacy|2026-05-27T20:51:37.143000|Drafted|BRETT|Pick 18: Ben Miller (DEF) · $399,500":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:51:37.143000","team":"BRETT","detail":"Pick 18: Ben Miller (DEF) · $399,500","players":["Ben Miller"],"inverse":{"kind":"REMOVE_PLAYER","team":"BRETT","player":"Ben Miller"},"pick":18,"draftType":"Mid-Season"},"legacy|2026-05-27T20:46:16.190000|Drafted|PETO|Pick 16: Jaxon Artemis (DEF) · $99,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:46:16.190000","team":"PETO","detail":"Pick 16: Jaxon Artemis (DEF) · $99,100","players":["Jaxon Artemis"],"inverse":{"kind":"REMOVE_PLAYER","team":"PETO","player":"Jaxon Artemis"},"pick":16,"draftType":"Mid-Season"},"legacy|2026-05-27T20:43:32.612000|Drafted|TOM|Pick 15: Jack Ison (MID) · $113,500":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:43:32.612000","team":"TOM","detail":"Pick 15: Jack Ison (MID) · $113,500","players":["Jack Ison"],"inverse":{"kind":"REMOVE_PLAYER","team":"TOM","player":"Jack Ison"},"pick":15,"draftType":"Mid-Season"},"legacy|2026-05-27T20:42:21.509000|Drafted|PAT|Pick 14: Kade Chandler (FWD) · $428,200":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:42:21.509000","team":"PAT","detail":"Pick 14: Kade Chandler (FWD) · $428,200","players":["Kade Chandler"],"inverse":{"kind":"REMOVE_PLAYER","team":"PAT","player":"Kade Chandler"},"pick":14,"draftType":"Mid-Season"},"legacy|2026-05-27T20:38:15.892000|Drafted|DARCY|Pick 13: Charlie Banfield (FWD) · $113,500":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:38:15.892000","team":"DARCY","detail":"Pick 13: Charlie Banfield (FWD) · $113,500","players":["Charlie Banfield"],"inverse":{"kind":"REMOVE_PLAYER","team":"DARCY","player":"Charlie Banfield"},"pick":13,"draftType":"Mid-Season"},"legacy|2026-05-27T20:36:24.513000|Drafted|SEMINI|Pick 12: Brayden Maynard (DEF) · $427,600":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:36:24.513000","team":"SEMINI","detail":"Pick 12: Brayden Maynard (DEF) · $427,600","players":["Brayden Maynard"],"inverse":{"kind":"REMOVE_PLAYER","team":"SEMINI","player":"Brayden Maynard"},"pick":12,"draftType":"Mid-Season"},"legacy|2026-05-27T20:34:11.465000|Drafted|PAT|Pick 11: Marc Pittonet (RUC) · $349,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:34:11.465000","team":"PAT","detail":"Pick 11: Marc Pittonet (RUC) · $349,100","players":["Marc Pittonet"],"inverse":{"kind":"REMOVE_PLAYER","team":"PAT","player":"Marc Pittonet"},"pick":11,"draftType":"Mid-Season"},"legacy|2026-05-27T20:29:47.651000|Drafted|MARCUS|Pick 10: Tom Sparrow (FWD) · $468,600":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:29:47.651000","team":"MARCUS","detail":"Pick 10: Tom Sparrow (FWD) · $468,600","players":["Tom Sparrow"],"inverse":{"kind":"REMOVE_PLAYER","team":"MARCUS","player":"Tom Sparrow"},"pick":10,"draftType":"Mid-Season"},"legacy|2026-05-27T20:27:36.510000|Drafted|CAMA|Pick 9: Harvey Thomas (FWD) · $402,000":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:27:36.510000","team":"CAMA","detail":"Pick 9: Harvey Thomas (FWD) · $402,000","players":["Harvey Thomas"],"inverse":{"kind":"REMOVE_PLAYER","team":"CAMA","player":"Harvey Thomas"},"pick":9,"draftType":"Mid-Season"},"legacy|2026-05-27T20:12:29.748000|Drafted|SCHULZ|Pick 8: Marcus Herbert (MID) · $99,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:12:29.748000","team":"SCHULZ","detail":"Pick 8: Marcus Herbert (MID) · $99,100","players":["Marcus Herbert"],"inverse":{"kind":"REMOVE_PLAYER","team":"SCHULZ","player":"Marcus Herbert"},"pick":8,"draftType":"Mid-Season"},"legacy|2026-05-27T20:06:19.753000|Drafted|KARIKAS|Pick 7: Riley Bice (DEF) · $392,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:06:19.753000","team":"KARIKAS","detail":"Pick 7: Riley Bice (DEF) · $392,100","players":["Riley Bice"],"inverse":{"kind":"REMOVE_PLAYER","team":"KARIKAS","player":"Riley Bice"},"pick":7,"draftType":"Mid-Season"},"legacy|2026-05-27T20:03:54.403000|Drafted|BRETT|Pick 6: Tim Kelly (FWD) · $449,000":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:03:54.403000","team":"BRETT","detail":"Pick 6: Tim Kelly (FWD) · $449,000","players":["Tim Kelly"],"inverse":{"kind":"REMOVE_PLAYER","team":"BRETT","player":"Tim Kelly"},"pick":6,"draftType":"Mid-Season"},"legacy|2026-05-27T20:01:53.010000|Drafted|JAYDEN|Pick 5: Jordon Sweet (RUC) · $456,900":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:01:53.010000","team":"JAYDEN","detail":"Pick 5: Jordon Sweet (RUC) · $456,900","players":["Jordon Sweet"],"inverse":{"kind":"REMOVE_PLAYER","team":"JAYDEN","player":"Jordon Sweet"},"pick":5,"draftType":"Mid-Season"},"legacy|2026-05-27T20:00:29.138000|Drafted|PETO|Pick 4: Patrick Retschko (MID) · $281,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T20:00:29.138000","team":"PETO","detail":"Pick 4: Patrick Retschko (MID) · $281,100","players":["Patrick Retschko"],"inverse":{"kind":"REMOVE_PLAYER","team":"PETO","player":"Patrick Retschko"},"pick":4,"draftType":"Mid-Season"},"legacy|2026-05-27T19:59:23.262000|Drafted|TOM|Pick 3: Bailey J. Williams (RUC) · $432,400":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T19:59:23.262000","team":"TOM","detail":"Pick 3: Bailey J. Williams (RUC) · $432,400","players":["Bailey J. Williams"],"inverse":{"kind":"REMOVE_PLAYER","team":"TOM","player":"Bailey J. Williams"},"pick":3,"draftType":"Mid-Season"},"legacy|2026-05-27T19:58:08.926000|Drafted|CAMA|Pick 2: Joe Fonti (DEF) · $298,000":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T19:58:08.926000","team":"CAMA","detail":"Pick 2: Joe Fonti (DEF) · $298,000","players":["Joe Fonti"],"inverse":{"kind":"REMOVE_PLAYER","team":"CAMA","player":"Joe Fonti"},"pick":2,"draftType":"Mid-Season"},"legacy|2026-05-27T19:57:00.488000|Drafted|DARCY|Pick 1: Bodhi Uwland (DEF) · $525,100":{"source":"legacy","type":"Drafted","timestamp":"2026-05-27T19:57:00.488000","team":"DARCY","detail":"Pick 1: Bodhi Uwland (DEF) · $525,100","players":["Bodhi Uwland"],"inverse":{"kind":"REMOVE_PLAYER","team":"DARCY","player":"Bodhi Uwland"},"pick":1,"draftType":"Mid-Season"},"legacy|2026-05-27T19:01:04.678000|Delisted|DARCY|Jesse Hogan":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T19:01:04.678000","team":"DARCY","detail":"Jesse Hogan","players":["Jesse Hogan"],"inverse":{"kind":"RESTORE_PLAYER","team":"DARCY","record":{"player":"Jesse Hogan","contract":"Main","salary":416900,"position":"FWD","status":"Field","contractEnd":2027,"club":"GWS"}}},"legacy|2026-05-27T19:01:03.862000|Delisted|DARCY|Will Graham":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T19:01:03.862000","team":"DARCY","detail":"Will Graham","players":["Will Graham"],"inverse":{"kind":"RESTORE_PLAYER","team":"DARCY","record":{"player":"Will Graham","contract":"Main","salary":277800,"position":"MID","status":"Field","contractEnd":2027,"club":"Gold Coast"}}},"legacy|2026-05-27T19:01:02.868000|Delisted|DARCY|Cooper Lord":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T19:01:02.868000","team":"DARCY","detail":"Cooper Lord","players":["Cooper Lord"],"inverse":{"kind":"RESTORE_PLAYER","team":"DARCY","record":{"player":"Cooper Lord","contract":"Main","salary":324200,"position":"MID","status":"Field","contractEnd":2029,"club":"Carlton"}}},"legacy|2026-05-27T19:01:01.523000|Delisted|DARCY|Zak Johnson":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T19:01:01.523000","team":"DARCY","detail":"Zak Johnson","players":["Zak Johnson"],"inverse":{"kind":"RESTORE_PLAYER","team":"DARCY","record":{"player":"Zak Johnson","contract":"Main","salary":273600,"position":"DEF","status":"Field","contractEnd":2029,"club":"Essendon"}}},"legacy|2026-05-27T18:41:31.408000|Delisted|SCHULZ|Riley Onley":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T18:41:31.408000","team":"SCHULZ","detail":"Riley Onley","players":["Riley Onley"],"inverse":{"kind":"RESTORE_PLAYER","team":"SCHULZ","record":{"player":"Riley Onley","contract":"Rookie","salary":99100,"position":"MID","status":"Interchange","contractEnd":2027,"club":"Melbourne"}}},"legacy|2026-05-27T18:41:30.567000|Delisted|SCHULZ|Jackson Macrae":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T18:41:30.567000","team":"SCHULZ","detail":"Jackson Macrae","players":["Jackson Macrae"],"inverse":{"kind":"RESTORE_PLAYER","team":"SCHULZ","record":{"player":"Jackson Macrae","contract":"Main","salary":558400,"position":"FWD","status":"Field","contractEnd":2027,"club":"St Kilda"}}},"legacy|2026-05-27T18:41:29.722000|Delisted|SCHULZ|Matt Johnson":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T18:41:29.722000","team":"SCHULZ","detail":"Matt Johnson","players":["Matt Johnson"],"inverse":{"kind":"RESTORE_PLAYER","team":"SCHULZ","record":{"player":"Matt Johnson","contract":"Main","salary":393800,"position":"MID","status":"Field","contractEnd":2026,"club":"Fremantle"}}},"legacy|2026-05-27T18:41:28.711000|Delisted|SCHULZ|Jai Culley":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T18:41:28.711000","team":"SCHULZ","detail":"Jai Culley","players":["Jai Culley"],"inverse":{"kind":"RESTORE_PLAYER","team":"SCHULZ","record":{"player":"Jai Culley","contract":"Rookie","salary":291100,"position":"MID","status":"Field","contractEnd":2027,"club":"Melbourne"}}},"legacy|2026-05-27T18:41:27.398000|Delisted|SCHULZ|Christian Salem":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T18:41:27.398000","team":"SCHULZ","detail":"Christian Salem","players":["Christian Salem"],"inverse":{"kind":"RESTORE_PLAYER","team":"SCHULZ","record":{"player":"Christian Salem","contract":"Main","salary":420800,"position":"DEF","status":"Field","contractEnd":2027,"club":"Melbourne"}}},"legacy|2026-05-27T16:22:41.391000|Delisted|BRETT|Tom Atkins":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T16:22:41.391000","team":"BRETT","detail":"Tom Atkins","players":["Tom Atkins"],"inverse":{"kind":"RESTORE_PLAYER","team":"BRETT","record":{"player":"Tom Atkins","contract":"Main","salary":431600,"position":"MID","status":"Field","contractEnd":2028,"club":"Geelong"}}},"legacy|2026-05-27T16:21:34.576000|Delisted|BRETT|Sam Butler":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T16:21:34.576000","team":"BRETT","detail":"Sam Butler","players":["Sam Butler"],"inverse":{"kind":"RESTORE_PLAYER","team":"BRETT","record":{"player":"Sam Butler","contract":"Main","salary":126600,"position":"FWD","status":"Field","contractEnd":2028,"club":"Hawthorn"}}},"legacy|2026-05-27T11:57:12.168000|Delisted|TOM|Josh Sinn":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:57:12.168000","team":"TOM","detail":"Josh Sinn","players":["Josh Sinn"],"inverse":{"kind":"RESTORE_PLAYER","team":"TOM","record":{"player":"Josh Sinn","contract":"Main","salary":229500,"position":"DEF","status":"Field","contractEnd":2028,"club":"Port Adelaide"}}},"legacy|2026-05-27T11:54:56.202000|Delisted|TOM|Finlay Macrae":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:54:56.202000","team":"TOM","detail":"Finlay Macrae","players":["Finlay Macrae"],"inverse":{"kind":"RESTORE_PLAYER","team":"TOM","record":{"player":"Finlay Macrae","contract":"Main","salary":119900,"position":"FWD","status":"Field","contractEnd":2029,"club":"West Coast"}}},"legacy|2026-05-27T11:48:57.701000|Delisted|TOM|James Rowbottom":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:48:57.701000","team":"TOM","detail":"James Rowbottom","players":["James Rowbottom"],"inverse":{"kind":"RESTORE_PLAYER","team":"TOM","record":{"player":"James Rowbottom","contract":"Main","salary":441600,"position":"MID","status":"Field","contractEnd":2029,"club":"Sydney"}}},"legacy|2026-05-27T11:45:23.579000|Delisted|TOM|Dante Visentini":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:45:23.579000","team":"TOM","detail":"Dante Visentini","players":["Dante Visentini"],"inverse":{"kind":"RESTORE_PLAYER","team":"TOM","record":{"player":"Dante Visentini","contract":"Main","salary":292800,"position":"RUC","status":"Field","contractEnd":2028,"club":"Port Adelaide"}}},"legacy|2026-05-27T11:45:20.845000|Delisted|MARCUS|Thomas Liberatore":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:45:20.845000","team":"MARCUS","detail":"Thomas Liberatore","players":["Thomas Liberatore"],"inverse":{"kind":"RESTORE_PLAYER","team":"MARCUS","record":{"player":"Thomas Liberatore","contract":"Main","salary":561700,"position":"MID","status":"Field","contractEnd":2028,"club":"Western Bulldogs"}}},"legacy|2026-05-27T11:44:47.104000|Delisted|TOM|Jacob Hopper":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:44:47.104000","team":"TOM","detail":"Jacob Hopper","players":["Jacob Hopper"],"inverse":{"kind":"RESTORE_PLAYER","team":"TOM","record":{"player":"Jacob Hopper","contract":"Main","salary":439400,"position":"MID","status":"Field","contractEnd":2027,"club":"Richmond"}}},"legacy|2026-05-27T11:43:50.219000|Delisted|MARCUS|Lachlan Jones":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:43:50.219000","team":"MARCUS","detail":"Lachlan Jones","players":["Lachlan Jones"],"inverse":{"kind":"RESTORE_PLAYER","team":"MARCUS","record":{"player":"Lachlan Jones","contract":"Main","salary":318600,"position":"DEF","status":"Field","contractEnd":2027,"club":"Port Adelaide"}}},"legacy|2026-05-27T11:43:01.237000|Delisted|MARCUS|Darcy Moore":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:43:01.237000","team":"MARCUS","detail":"Darcy Moore","players":["Darcy Moore"],"inverse":{"kind":"RESTORE_PLAYER","team":"MARCUS","record":{"player":"Darcy Moore","contract":"Main","salary":505900,"position":"DEF","status":"Field","contractEnd":2027,"club":"Collingwood"}}},"legacy|2026-05-27T11:42:25.243000|Delisted|TOM|Brady Hough":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T11:42:25.243000","team":"TOM","detail":"Brady Hough","players":["Brady Hough"],"inverse":{"kind":"RESTORE_PLAYER","team":"TOM","record":{"player":"Brady Hough","contract":"Rookie","salary":370200,"position":"DEF","status":"Field","contractEnd":2027,"club":"West Coast"}}},"legacy|2026-05-27T10:19:13.879000|Delisted|KARIKAS|Charlie Curnow":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T10:19:13.879000","team":"KARIKAS","detail":"Charlie Curnow","players":["Charlie Curnow"],"inverse":{"kind":"RESTORE_PLAYER","team":"KARIKAS","record":{"player":"Charlie Curnow","contract":"Main","salary":545300,"position":"FWD","status":"Field","contractEnd":2027,"club":"Sydney"}}},"legacy|2026-05-27T10:19:12.737000|Delisted|KARIKAS|Ryan Maric":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T10:19:12.737000","team":"KARIKAS","detail":"Ryan Maric","players":["Ryan Maric"],"inverse":{"kind":"RESTORE_PLAYER","team":"KARIKAS","record":{"player":"Ryan Maric","contract":"Main","salary":483100,"position":"FWD","status":"Field","contractEnd":2028,"club":"West Coast"}}},"legacy|2026-05-27T10:19:00.363000|Rookie upgrade|BRETT|Angus Anderson: Rookie → Main ($113,500 → $224,300)":{"source":"legacy","type":"Rookie upgrade","timestamp":"2026-05-27T10:19:00.363000","team":"BRETT","detail":"Angus Anderson: Rookie → Main ($113,500 → $224,300)","players":["Angus Anderson"],"inverse":{"kind":"UNDO_ELEVATION","team":"BRETT","player":"Angus Anderson","contract":"Rookie","salary":113500,"contractEnd":2027,"position":"MID","status":"Field","club":"Collingwood"}},"legacy|2026-05-27T10:16:29.336000|Delisted|KARIKAS|Liam Reidy":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T10:16:29.336000","team":"KARIKAS","detail":"Liam Reidy","players":["Liam Reidy"],"inverse":{"kind":"RESTORE_PLAYER","team":"KARIKAS","record":{"player":"Liam Reidy","contract":"Main","salary":132600,"position":"RUC","status":"Field","contractEnd":2028,"club":"Carlton"}}},"legacy|2026-05-27T10:10:15|Rookie swap|TOM|Sam Taylor → Field; Josh Sinn → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-05-27T10:10:15","team":"TOM","detail":"Sam Taylor → Field; Josh Sinn → Interchange","players":["Sam Taylor","Josh Sinn"],"inverse":{"kind":"UNDO_SWAP","team":"TOM","playerIn":"Sam Taylor","playerOut":"Josh Sinn"}},"legacy|2026-05-27T10:01:46.925000|Trade|CAMA|Pat sends Nathan O'Driscoll · Cama sends pick 14":{"source":"legacy","type":"Trade","timestamp":"2026-05-27T10:01:46.925000","team":"CAMA","detail":"Pat sends Nathan O'Driscoll · Cama sends pick 14","players":["Nathan O'Driscoll"],"inverse":{"kind":"UNDO_TRADE","moves":[{"player":"Nathan O'Driscoll","from":"CAMA","to":"PAT"}]},"otherTeam":"PAT","picksA":[14],"picksB":[]},"legacy|2026-05-27T09:57:50.487000|Delisted|KARIKAS|Reef McInnes":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T09:57:50.487000","team":"KARIKAS","detail":"Reef McInnes","players":["Reef McInnes"],"inverse":{"kind":"RESTORE_PLAYER","team":"KARIKAS","record":{"player":"Reef McInnes","contract":"Rookie","salary":155900,"position":"DEF","status":"Interchange","contractEnd":2027,"club":"Collingwood"}}},"legacy|2026-05-27T09:57:49.433000|Delisted|KARIKAS|Harry Rowston":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T09:57:49.433000","team":"KARIKAS","detail":"Harry Rowston","players":["Harry Rowston"],"inverse":{"kind":"RESTORE_PLAYER","team":"KARIKAS","record":{"player":"Harry Rowston","contract":"Main","salary":271700,"position":"MID","status":"Field","contractEnd":2029,"club":"GWS"}}},"legacy|2026-05-27T09:57:48.426000|Delisted|KARIKAS|Jack Bowes":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T09:57:48.426000","team":"KARIKAS","detail":"Jack Bowes","players":["Jack Bowes"],"inverse":{"kind":"RESTORE_PLAYER","team":"KARIKAS","record":{"player":"Jack Bowes","contract":"Main","salary":341900,"position":"DEF","status":"Field","contractEnd":2027,"club":"Geelong"}}},"legacy|2026-05-27T09:55:44.447000|Delisted|KARIKAS|Jamie Elliott":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T09:55:44.447000","team":"KARIKAS","detail":"Jamie Elliott","players":["Jamie Elliott"],"inverse":{"kind":"RESTORE_PLAYER","team":"KARIKAS","record":{"player":"Jamie Elliott","contract":"Main","salary":404200,"position":"FWD","status":"Field","contractEnd":2029,"club":"Collingwood"}}},"legacy|2026-05-27T09:11:18.390000|Delisted|JAYDEN|Reilly O'Brien":{"source":"legacy","type":"Delisted","timestamp":"2026-05-27T09:11:18.390000","team":"JAYDEN","detail":"Reilly O'Brien","players":["Reilly O'Brien"],"inverse":{"kind":"RESTORE_PLAYER","team":"JAYDEN","record":{"player":"Reilly O'Brien","contract":"Main","salary":535300,"position":"RUC","status":"Field","contractEnd":2027,"club":"Adelaide"}}},"legacy|2026-05-26T22:45:37.850000|Trade|CAMA|Cama sends Karl Amon · Fenner sends pick 10":{"source":"legacy","type":"Trade","timestamp":"2026-05-26T22:45:37.850000","team":"CAMA","detail":"Cama sends Karl Amon · Fenner sends pick 10","players":["Karl Amon"],"inverse":{"kind":"UNDO_TRADE","moves":[{"player":"Karl Amon","from":"FENNER","to":"CAMA"}]},"otherTeam":"FENNER","picksA":[],"picksB":[10]},"legacy|2026-05-26T20:48:39.577000|Delisted|BRETT|Jarrod Berry":{"source":"legacy","type":"Delisted","timestamp":"2026-05-26T20:48:39.577000","team":"BRETT","detail":"Jarrod Berry","players":["Jarrod Berry"],"inverse":{"kind":"RESTORE_PLAYER","team":"BRETT","record":{"player":"Jarrod Berry","contract":"Main","salary":427500,"position":"MID","status":"Field","contractEnd":2027,"club":"Brisbane"}}},"legacy|2026-05-26T20:48:38.587000|Delisted|BRETT|Tom Brown":{"source":"legacy","type":"Delisted","timestamp":"2026-05-26T20:48:38.587000","team":"BRETT","detail":"Tom Brown","players":["Tom Brown"],"inverse":{"kind":"RESTORE_PLAYER","team":"BRETT","record":{"player":"Tom Brown","contract":"Main","salary":302000,"position":"DEF","status":"Field","contractEnd":2028,"club":"Richmond"}}},"legacy|2026-05-26T20:09:43.730000|Delisted|PAT|Jack Scrimshaw":{"source":"legacy","type":"Delisted","timestamp":"2026-05-26T20:09:43.730000","team":"PAT","detail":"Jack Scrimshaw","players":["Jack Scrimshaw"],"inverse":{"kind":"RESTORE_PLAYER","team":"PAT","record":{"player":"Jack Scrimshaw","contract":"Main","salary":441800,"position":"DEF","status":"Field","contractEnd":2028,"club":"Hawthorn"}}},"legacy|2026-05-26T16:48:24.761000|Delisted|CAMA|James Worpel":{"source":"legacy","type":"Delisted","timestamp":"2026-05-26T16:48:24.761000","team":"CAMA","detail":"James Worpel","players":["James Worpel"],"inverse":{"kind":"RESTORE_PLAYER","team":"CAMA","record":{"player":"James Worpel","contract":"Main","salary":403500,"position":"MID","status":"Field","contractEnd":2029,"club":"Geelong"}}},"legacy|2026-05-26T16:48:24.057000|Delisted|CAMA|Oscar Allen":{"source":"legacy","type":"Delisted","timestamp":"2026-05-26T16:48:24.057000","team":"CAMA","detail":"Oscar Allen","players":["Oscar Allen"],"inverse":{"kind":"RESTORE_PLAYER","team":"CAMA","record":{"player":"Oscar Allen","contract":"Main","salary":317000,"position":"FWD","status":"Field","contractEnd":2029,"club":"Brisbane"}}},"legacy|2026-05-26T16:48:23.473000|Delisted|CAMA|Jamarra Ugle-Hagan":{"source":"legacy","type":"Delisted","timestamp":"2026-05-26T16:48:23.473000","team":"CAMA","detail":"Jamarra Ugle-Hagan","players":["Jamarra Ugle-Hagan"],"inverse":{"kind":"RESTORE_PLAYER","team":"CAMA","record":{"player":"Jamarra Ugle-Hagan","contract":"Main","salary":214100,"position":"FWD","status":"Field","contractEnd":2029,"club":"Gold Coast"}}},"legacy|2026-05-26T16:48:22.900000|Delisted|CAMA|Elijah Hollands":{"source":"legacy","type":"Delisted","timestamp":"2026-05-26T16:48:22.900000","team":"CAMA","detail":"Elijah Hollands","players":["Elijah Hollands"],"inverse":{"kind":"RESTORE_PLAYER","team":"CAMA","record":{"player":"Elijah Hollands","contract":"Main","salary":276300,"position":"MID","status":"Field","contractEnd":2027,"club":"Carlton"}}},"legacy|2026-05-26T16:48:22.332000|Delisted|CAMA|Judd McVee":{"source":"legacy","type":"Delisted","timestamp":"2026-05-26T16:48:22.332000","team":"CAMA","detail":"Judd McVee","players":["Judd McVee"],"inverse":{"kind":"RESTORE_PLAYER","team":"CAMA","record":{"player":"Judd McVee","contract":"Main","salary":310700,"position":"DEF","status":"Field","contractEnd":2029,"club":"Fremantle"}}},"legacy|2026-05-25T20:37:54.644000|Delisted|PAT|Harrison Jones":{"source":"legacy","type":"Delisted","timestamp":"2026-05-25T20:37:54.644000","team":"PAT","detail":"Harrison Jones","players":["Harrison Jones"],"inverse":{"kind":"RESTORE_PLAYER","team":"PAT","record":{"player":"Harrison Jones","contract":"Main","salary":238600,"position":"FWD","status":"Field","contractEnd":2029,"club":"Essendon"}}},"legacy|2026-05-25T20:37:53.831000|Delisted|PAT|Archer Reid":{"source":"legacy","type":"Delisted","timestamp":"2026-05-25T20:37:53.831000","team":"PAT","detail":"Archer Reid","players":["Archer Reid"],"inverse":{"kind":"RESTORE_PLAYER","team":"PAT","record":{"player":"Archer Reid","contract":"Main","salary":216700,"position":"RUC","status":"Field","contractEnd":2028,"club":"West Coast"}}},"legacy|2026-05-25T10:20:13.612000|Delisted|PETO|Adam Saad":{"source":"legacy","type":"Delisted","timestamp":"2026-05-25T10:20:13.612000","team":"PETO","detail":"Adam Saad","players":["Adam Saad"],"inverse":{"kind":"RESTORE_PLAYER","team":"PETO","record":{"player":"Adam Saad","contract":"Main","salary":500700,"position":"DEF","status":"Field","contractEnd":2027,"club":"Carlton"}}},"legacy|2026-05-25T10:18:19.605000|Delisted|FENNER|Jed Walter":{"source":"legacy","type":"Delisted","timestamp":"2026-05-25T10:18:19.605000","team":"FENNER","detail":"Jed Walter","players":["Jed Walter"],"inverse":{"kind":"RESTORE_PLAYER","team":"FENNER","record":{"player":"Jed Walter","contract":"Main","salary":198300,"position":"FWD","status":"Field","contractEnd":2027,"club":"Gold Coast"}}},"legacy|2026-05-24T21:42:21.107000|Delisted|PETO|Cody Angove":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:42:21.107000","team":"PETO","detail":"Cody Angove","players":["Cody Angove"],"inverse":{"kind":"RESTORE_PLAYER","team":"PETO","record":{"player":"Cody Angove","contract":"Main","salary":113500,"position":"FWD","status":"Field","contractEnd":2028,"club":"GWS"}}},"legacy|2026-05-24T21:42:20.596000|Delisted|PETO|Will Brodie":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:42:20.596000","team":"PETO","detail":"Will Brodie","players":["Will Brodie"],"inverse":{"kind":"RESTORE_PLAYER","team":"PETO","record":{"player":"Will Brodie","contract":"Main","salary":119900,"position":"MID","status":"Field","contractEnd":2029,"club":"Port Adelaide"}}},"legacy|2026-05-24T21:42:20.056000|Delisted|PETO|Brayden Fiorini":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:42:20.056000","team":"PETO","detail":"Brayden Fiorini","players":["Brayden Fiorini"],"inverse":{"kind":"RESTORE_PLAYER","team":"PETO","record":{"player":"Brayden Fiorini","contract":"Main","salary":515100,"position":"MID","status":"Field","contractEnd":2029,"club":"Essendon"}}},"legacy|2026-05-24T21:35:58.865000|Delisted|FENNER|Lloyd Meek":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:35:58.865000","team":"FENNER","detail":"Lloyd Meek","players":["Lloyd Meek"],"inverse":{"kind":"RESTORE_PLAYER","team":"FENNER","record":{"player":"Lloyd Meek","contract":"Main","salary":529700,"position":"RUC","status":"Field","contractEnd":2027,"club":"Hawthorn"}}},"legacy|2026-05-24T21:25:04.338000|Delisted|SEMINI|Xavier Duursma":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:25:04.338000","team":"SEMINI","detail":"Xavier Duursma","players":["Xavier Duursma"],"inverse":{"kind":"RESTORE_PLAYER","team":"SEMINI","record":{"player":"Xavier Duursma","contract":"Main","salary":373200,"position":"MID","status":"Field","contractEnd":2027,"club":"Essendon"}}},"legacy|2026-05-24T21:22:40.488000|Delisted|SEMINI|Ethan Read":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:22:40.488000","team":"SEMINI","detail":"Ethan Read","players":["Ethan Read"],"inverse":{"kind":"RESTORE_PLAYER","team":"SEMINI","record":{"player":"Ethan Read","contract":"Main","salary":171300,"position":"RUC","status":"Interchange","contractEnd":2027,"club":"Gold Coast"}}},"legacy|2026-05-24T21:21:12.845000|Delisted|SEMINI|Jack Buckley":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:21:12.845000","team":"SEMINI","detail":"Jack Buckley","players":["Jack Buckley"],"inverse":{"kind":"RESTORE_PLAYER","team":"SEMINI","record":{"player":"Jack Buckley","contract":"Rookie","salary":399900,"position":"DEF","status":"Field","contractEnd":2027,"club":"GWS"}}},"legacy|2026-05-24T21:20:05.536000|Delisted|SEMINI|Adam Treloar":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:20:05.536000","team":"SEMINI","detail":"Adam Treloar","players":["Adam Treloar"],"inverse":{"kind":"RESTORE_PLAYER","team":"SEMINI","record":{"player":"Adam Treloar","contract":"Main","salary":311700,"position":"MID","status":"Interchange","contractEnd":2029,"club":"Western Bulldogs"}}},"legacy|2026-05-24T21:18:49.693000|Delisted|SEMINI|Liam Baker":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:18:49.693000","team":"SEMINI","detail":"Liam Baker","players":["Liam Baker"],"inverse":{"kind":"RESTORE_PLAYER","team":"SEMINI","record":{"player":"Liam Baker","contract":"Main","salary":443600,"position":"FWD","status":"Field","contractEnd":2028,"club":"West Coast"}}},"legacy|2026-05-24T21:16:53.331000|Delisted|SEMINI|Steele Sidebottom":{"source":"legacy","type":"Delisted","timestamp":"2026-05-24T21:16:53.331000","team":"SEMINI","detail":"Steele Sidebottom","players":["Steele Sidebottom"],"inverse":{"kind":"RESTORE_PLAYER","team":"SEMINI","record":{"player":"Steele Sidebottom","contract":"Main","salary":499600,"position":"MID","status":"Field","contractEnd":2028,"club":"Collingwood"}}},"legacy|2026-05-07T19:53:59.730000|Rookie swap|PAT|Jake Bowey → Field; Changkuoth Jiath → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-05-07T19:53:59.730000","team":"PAT","detail":"Jake Bowey → Field; Changkuoth Jiath → Interchange","players":["Jake Bowey","Changkuoth Jiath"],"inverse":{"kind":"UNDO_SWAP","team":"PAT","playerIn":"Jake Bowey","playerOut":"Changkuoth Jiath"}},"legacy|2026-04-09T16:26:47.114000|Rookie swap|BRETT|Angus Anderson → Field; Connor Rozee → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-04-09T16:26:47.114000","team":"BRETT","detail":"Angus Anderson → Field; Connor Rozee → Interchange","players":["Angus Anderson","Connor Rozee"],"inverse":{"kind":"UNDO_SWAP","team":"BRETT","playerIn":"Angus Anderson","playerOut":"Connor Rozee"}},"legacy|2026-03-26T07:59:27.392000|Rookie swap|SCHULZ|Jai Culley → Field; Toby Nankervis → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-03-26T07:59:27.392000","team":"SCHULZ","detail":"Jai Culley → Field; Toby Nankervis → Interchange","players":["Jai Culley","Toby Nankervis"],"inverse":{"kind":"UNDO_SWAP","team":"SCHULZ","playerIn":"Jai Culley","playerOut":"Toby Nankervis"}},"legacy|2026-03-19T11:31:46.031000|Rookie swap|SEMINI|Jack Buckley → Field; Ethan Read → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-03-19T11:31:46.031000","team":"SEMINI","detail":"Jack Buckley → Field; Ethan Read → Interchange","players":["Jack Buckley","Ethan Read"],"inverse":{"kind":"UNDO_SWAP","team":"SEMINI","playerIn":"Jack Buckley","playerOut":"Ethan Read"}},"legacy|2026-03-19T11:24:44.997000|Rookie swap|PETO|Brayden Cook → Field; Braeden Campbell → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-03-19T11:24:44.997000","team":"PETO","detail":"Brayden Cook → Field; Braeden Campbell → Interchange","players":["Brayden Cook","Braeden Campbell"],"inverse":{"kind":"UNDO_SWAP","team":"PETO","playerIn":"Brayden Cook","playerOut":"Braeden Campbell"}},"legacy|2026-03-10T11:31:46|Rookie swap|BRETT|Logan McDonald → Field; Darcy Jones → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-03-10T11:31:46","team":"BRETT","detail":"Logan McDonald → Field; Darcy Jones → Interchange","players":["Logan McDonald","Darcy Jones"],"inverse":{"kind":"UNDO_SWAP","team":"BRETT","playerIn":"Logan McDonald","playerOut":"Darcy Jones"}},"legacy|2026-03-10T10:31:46|Rookie swap|TOM|Brady Hough → Field; Sam Taylor → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-03-10T10:31:46","team":"TOM","detail":"Brady Hough → Field; Sam Taylor → Interchange","players":["Changkuoth Jiath","Jake Bowey"],"inverse":{"kind":"UNDO_SWAP","team":"TOM","playerIn":"Changkuoth Jiath","playerOut":"Jake Bowey"}},"legacy|2026-03-10T10:31:46|Rookie swap|PAT|Changkuoth Jiath → Field; Jake Bowey → Interchange":{"source":"legacy","type":"Rookie swap","timestamp":"2026-03-10T10:31:46","team":"PAT","detail":"Changkuoth Jiath → Field; Jake Bowey → Interchange","players":["Changkuoth Jiath","Jake Bowey"],"inverse":{"kind":"UNDO_SWAP","team":"PAT","playerIn":"Changkuoth Jiath","playerOut":"Jake Bowey"}}};
  const INITIAL_FIGUREHEAD_PHOTOS = {
    'max holmes':'assets/figureheads/max-holmes.png',
    'nasiah wanganeen milera':'assets/figureheads/nasiah-wanganeen-milera.png',
    'errol gulden':'assets/figureheads/errol-gulden.png',
    'matt rowell':'assets/figureheads/matt-rowell.png',
    'brodie grundy':'assets/figureheads/brodie-grundy.png',
    'nick daicos':'assets/figureheads/nick-daicos.png',
    'harry sheezel':'assets/figureheads/harry-sheezel.png',
    'zak butters':'assets/figureheads/zak-butters.png',
    'bailey smith':'assets/figureheads/bailey-smith.png',
    'will ashcroft':'assets/figureheads/will-ashcroft.png',
    'max gawn':'assets/figureheads/max-gawn.png',
    'clayton oliver':'assets/figureheads/clayton-oliver.png'
  };
  const AFL_TEAMS = [
    ['ADE','Adelaide'],['BRL','Brisbane'],['CAR','Carlton'],['COL','Collingwood'],['ESS','Essendon'],['FRE','Fremantle'],
    ['GEE','Geelong'],['GCS','Gold Coast'],['GWS','GWS'],['HAW','Hawthorn'],['MEL','Melbourne'],['NTH','North Melbourne'],
    ['PTA','Port Adelaide'],['RIC','Richmond'],['STK','St Kilda'],['SYD','Sydney'],['WBD','Western Bulldogs'],['WCE','West Coast']
  ];
  const AFL_CODE_SET = new Set(AFL_TEAMS.map(x=>x[0]));
  const AFL_NAME_TO_CODE = Object.fromEntries(AFL_TEAMS.flatMap(([code,name])=>[[name.toUpperCase(),code],[code,code]]));
  const AFL_CLUB_TO_CODE = {
    'ADELAIDE':'ADE','ADELAIDE CROWS':'ADE','BRISBANE':'BRL','BRISBANE LIONS':'BRL','CARLTON':'CAR','CARLTON BLUES':'CAR',
    'COLLINGWOOD':'COL','COLLINGWOOD MAGPIES':'COL','ESSENDON':'ESS','ESSENDON BOMBERS':'ESS','FREMANTLE':'FRE','FREMANTLE DOCKERS':'FRE',
    'GEELONG':'GEE','GEELONG CATS':'GEE','GOLD COAST':'GCS','GOLD COAST SUNS':'GCS','GWS':'GWS','GWS GIANTS':'GWS','GREATER WESTERN SYDNEY':'GWS',
    'HAWTHORN':'HAW','HAWTHORN HAWKS':'HAW','MELBOURNE':'MEL','MELBOURNE DEMONS':'MEL','NORTH MELBOURNE':'NTH','NORTH MELBOURNE KANGAROOS':'NTH',
    'PORT ADELAIDE':'PTA','PORT ADELAIDE POWER':'PTA','RICHMOND':'RIC','RICHMOND TIGERS':'RIC','ST KILDA':'STK','ST KILDA SAINTS':'STK',
    'SYDNEY':'SYD','SYDNEY SWANS':'SYD','WESTERN BULLDOGS':'WBD','WEST COAST':'WCE','WEST COAST EAGLES':'WCE'
  };
  let selectedRosterFilter = 'ALL';
  let draftSelection = null;
  let draftSearch = '';
  let commissionerTab = 'scores';
  let matchupScoreEditOpen = false;
  let reversingTransactionKey = '';
  let transactionScope = 'mine';
  let proposalCache = [];
  let draftTicker = null;
  let currentIdentity = (()=>{try{return JSON.parse(sessionStorage.getItem(IDENTITY_KEY)||'{"role":"public"}');}catch(_){return {role:'public'};}})();
  let draftPoolCache = null;
  let backupCache = [];
  let auditCache = [];
  let teamAccountsCache = [];
  let teamCredentialCache = [];
  // Background polling used to fully re-render the current page every 10 seconds,
  // which destroyed unsent trade selections and Commissioner form input. Track
  // genuine user edits and let background data continue syncing without replacing
  // the active DOM until the user navigates or completes an action.
  let interactionDraftDirty = false;
  let backgroundRenderPending = false;

  const DRAFT_ROUNDS = { 'Pre-Season': 5, 'Mid-Season': 10 };

  function markInteractionDraft(){ interactionDraftDirty=true; }
  function clearInteractionDraft(){ interactionDraftDirty=false; backgroundRenderPending=false; }
  function protectedInteractionTarget(target){
    if(!target||!target.matches)return false;
    if(['round-select','results-round-select'].includes(target.id))return false;
    if(!target.matches('input:not([type="hidden"]):not([type="button"]):not([type="submit"]), select, textarea, [contenteditable="true"]'))return false;
    if(target.disabled||target.readOnly)return false;
    return main.contains(target)||commissionerContent.contains(target)||teamLoginContent.contains(target);
  }
  function backgroundRefreshUi({commissioner=false}={}){
    updateSessionUI();
    if(interactionDraftDirty){backgroundRenderPending=true;return false;}
    render();
    if(commissioner&&commissionerDialog.open)renderCommissionerControls();
    return true;
  }

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function money(value) {
    const n = Number(value || 0);
    return '$' + Math.round(n).toLocaleString('en-AU');
  }

  function compactMoney(value) {
    const n = Number(value || 0);
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'm';
    return '$' + Math.round(n / 1000) + 'k';
  }

  function fmtDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(d);
  }

  function team(key) {
    return teamMap[String(key || '').toUpperCase()] || { key, owner: key, name: key, code: String(key || '').slice(0, 3), accent: '#4d91ff', caps: {}, counts: {} };
  }

  function getFigureheadOverrides(){try{return JSON.parse(localStorage.getItem(FIGUREHEAD_OVERRIDE_KEY)||'{}');}catch(_){return {};}}
  function saveFigureheadOverrides(value){localStorage.setItem(FIGUREHEAD_OVERRIDE_KEY,JSON.stringify(value));void pushSharedState('figurehead_overrides',value);}
  function playerPoolRecord(name){return D.playerPool.find(p=>canonicalPlayerName(p.player)===canonicalPlayerName(name))||null;}
  function figureheadAverage(name){
    const feed=getLiveFeed(),rec=feed.players?.[canonicalPlayerName(name)],liveAvg=Number(rec?.average||0);
    if(Number(feed.season)===currentSeason()&&liveAvg>0)return liveAvg;
    return Number(playerPoolRecord(name)?.average||0);
  }
  function figureheadPlayer(key){
    const teamKey=String(key||'').toUpperCase(),rows=(effectiveRosters()[teamKey]||[]),override=getFigureheadOverrides()[teamKey];
    if(override){const row=rows.find(p=>canonicalPlayerName(p.player)===canonicalPlayerName(override));if(row)return {...row,average:figureheadAverage(row.player),manual:true};}
    const ranked=rows.map(r=>({...r,average:figureheadAverage(r.player)})).sort((a,b)=>Number(b.average||0)-Number(a.average||0));
    return ranked[0]||{player:team(key).owner,club:'',average:0,manual:false};
  }
  function playerPhotoUrl(player,club){
    const known=INITIAL_FIGUREHEAD_PHOTOS[canonicalPlayerName(player)]; if(known)return known;
    if(!backendConfigured())return '';
    const teamCode=AFL_CLUB_TO_CODE[String(club||'').toUpperCase()]||AFL_NAME_TO_CODE[String(club||'').toUpperCase()]||String(club||'').toUpperCase();
    const fn=CONFIG.playerPhotoFunction||'supercoach-photo';
    return `${CONFIG.supabaseUrl.replace(/\/$/,'')}/functions/v1/${encodeURIComponent(fn)}?player=${encodeURIComponent(player)}&team=${encodeURIComponent(teamCode)}&v=3`;
  }
  function figurehead(key,size=''){
    const t=team(key),p=figureheadPlayer(key),src=playerPhotoUrl(p.player,p.club),initials=String(p.player||t.owner).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
    // Keep the initials visible until a portrait has actually decoded. If a
    // remote player photo is missing or malformed, the figurehead stays as a
    // clean branded fallback instead of showing a broken-image state.
    return `<span class="team-figurehead ${size}" style="--accent:${esc(t.accent)}" title="${esc(p.player)} — ${esc(t.name)}"><span class="figurehead-fallback" aria-hidden="true">${esc(initials||t.code)}</span>${src?`<img src="${esc(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="this.parentElement.classList.add('photo-ready')" onerror="this.remove()">`:''}</span>`;
  }

  function teamIdentity(key, size = '') {
    const t = team(key);
    return `<div class="team-identity">${figurehead(key, size)}<div class="team-meta"><strong>${esc(t.owner)}</strong><small>${esc(t.name)}</small></div></div>`;
  }

  function getOverrides() {
    try { return JSON.parse(localStorage.getItem(OVERRIDE_KEY) || '{}'); }
    catch (_) { return {}; }
  }

  function saveOverrides(value) {
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(value));
    void pushSharedState('score_overrides', value);
  }
  function getSelectionOverrides(){try{return JSON.parse(localStorage.getItem(SELECTION_OVERRIDE_KEY)||'{}');}catch(_){return {};}}
  function selectionOverride(round,teamKey,player){const all=getSelectionOverrides(),id=overrideId(round,teamKey,player);return String(all[id]||'').toUpperCase();}
  function saveSelectionOverrides(value){localStorage.setItem(SELECTION_OVERRIDE_KEY,JSON.stringify(value));void pushSharedState('selection_overrides',value);}

  function getCommissionerActions() {
    try { return JSON.parse(localStorage.getItem(COMM_ACTIONS_KEY) || '[]'); } catch (_) { return []; }
  }
  function saveCommissionerActions(value) { localStorage.setItem(COMM_ACTIONS_KEY, JSON.stringify(value)); void pushSharedState('commissioner_actions', value); }
  function getTransactionReversals(){try{return JSON.parse(localStorage.getItem(TRANSACTION_REVERSALS_KEY)||'{}');}catch(_){return {};}}
  function saveTransactionReversals(value){localStorage.setItem(TRANSACTION_REVERSALS_KEY,JSON.stringify(value));void pushSharedState('transaction_reversals',value);}
  function legacyTransactionKey(x){return ['legacy',x?.timestamp||'',x?.type||'',x?.team||x?.teamA||'',x?.detail||''].join('|');}
  function modernTransactionKey(x){return ['modern',x?.timestamp||'',x?.type||'',x?.team||x?.teamA||'',x?.detail||''].join('|');}
  function visibleLegacyTransactions(){const deleted=getTransactionReversals();return (D.transactions||[]).filter(x=>!deleted[legacyTransactionKey(x)]);}
  function getDraftState() {
    try { return JSON.parse(localStorage.getItem(DRAFT_STATE_KEY) || '{}'); } catch (_) { return {}; }
  }
  function saveDraftState(value) { localStorage.setItem(DRAFT_STATE_KEY, JSON.stringify(value)); void pushSharedState('draft_state', value); }
  function defaultProposalWindows(){
    return {
      trade:{open:false,phase:'Pre-Season',openedAt:null,closedAt:null},
      delist:{open:false,phase:'Pre-Season',openedAt:null,closedAt:null},
      elevation:{open:false,phase:'Pre-Season',season:null,openedAt:null,closedAt:null}
    };
  }
  function getProposalWindows(){
    try{
      const saved=JSON.parse(localStorage.getItem(PROPOSAL_WINDOWS_KEY)||'null'),base=defaultProposalWindows();
      if(!saved||typeof saved!=='object')return base;
      return {trade:{...base.trade,...(saved.trade||{})},delist:{...base.delist,...(saved.delist||{})},elevation:{...base.elevation,...(saved.elevation||{})}};
    }catch(_){return defaultProposalWindows();}
  }
  function saveProposalWindows(value){localStorage.setItem(PROPOSAL_WINDOWS_KEY,JSON.stringify(value));void pushSharedState('proposal_windows',value);}
  function getScoringSnapshots(){try{return JSON.parse(localStorage.getItem(SCORING_SNAPSHOTS_KEY)||'{}');}catch(_){return {};}}
  function saveScoringSnapshots(value){localStorage.setItem(SCORING_SNAPSHOTS_KEY,JSON.stringify(value));void pushSharedState('scoring_snapshots',value);}
  function cloneRosters(rosters){const out={};for(const [k,rows] of Object.entries(rosters||{}))out[k]=(rows||[]).map(r=>({...r}));return out;}
  function nextUnfinalizedScoringRound(){
    const setup=activeSeasonSetup(); if(!setup)return 1;
    const done=Object.keys(getSeasonResults()?.[String(currentSeason())]||{}).map(Number).filter(Number.isFinite);
    const last=done.length?Math.max(...done):Number(setup.completedThroughRound||0);
    return Math.max(1,Number(setup.currentRound||1),last+1);
  }
  function captureScoringSnapshot(stage,effectiveFromRound){
    const season=String(currentSeason()),all=getScoringSnapshots();all[season]=all[season]||{};
    const key=stage==='Mid-Season'?'midSeason':'preSeason';
    all[season][key]={stage,capturedAt:new Date().toISOString(),effectiveFromRound:Number(effectiveFromRound||1),rosters:cloneRosters(effectiveRosters())};
    saveScoringSnapshots(all);return all[season][key];
  }
  function scoringSnapshotForRound(round){
    const seasonData=getScoringSnapshots()?.[String(currentSeason())]||{},candidates=[seasonData.preSeason,seasonData.midSeason].filter(Boolean).filter(x=>Number(x.effectiveFromRound||1)<=Number(round));
    if(!candidates.length)return null;return [...candidates].sort((a,b)=>Number(b.effectiveFromRound||1)-Number(a.effectiveFromRound||1))[0];
  }
  function legacyScoringEffectiveRound(action){
    // PEGS phase windows are roster periods. A Pre-Season or Mid-Season trade,
    // delisting or elevation belongs to that scoring lock even if the action was
    // approved later while testing/replaying the season. This also repairs older
    // confirmed actions that were stamped with the then-current round.
    const phase=String(action?.phase||'').toLowerCase(),seasonData=getScoringSnapshots()?.[String(currentSeason())]||{};
    if(phase.startsWith('pre')){
      const locked=Number(seasonData.preSeason?.effectiveFromRound||0);if(locked>0)return locked;
    }
    if(phase.startsWith('mid')){
      const locked=Number(seasonData.midSeason?.effectiveFromRound||0);if(locked>0)return locked;
    }
    const explicit=Number(action?.effectiveFromRound||0);if(explicit>0)return explicit;
    const actionTime=Date.parse(action?.timestamp||'');if(!Number.isFinite(actionTime))return nextUnfinalizedScoringRound();
    const locks=[seasonData.preSeason,seasonData.midSeason].filter(Boolean).map(x=>({...x,time:Date.parse(x.capturedAt||'')})).filter(x=>Number.isFinite(x.time)).sort((a,b)=>a.time-b.time);
    const nextLock=locks.find(x=>x.time>=actionTime);if(nextLock)return Number(nextLock.effectiveFromRound||1);
    const results=getSeasonResults()?.[String(currentSeason())]||{};
    const finalizedBefore=Object.entries(results).filter(([,rec])=>{const t=Date.parse(rec?.finalizedAt||'');return Number.isFinite(t)&&t<=actionTime;}).map(([r])=>Number(r)).filter(Number.isFinite);
    if(finalizedBefore.length)return Math.max(...finalizedBefore)+1;
    return nextUnfinalizedScoringRound();
  }
  function applyScoringAction(rosters,a){
    if(a.type==='Trade'){
      for(const move of a.moves||[]){const from=rosters[move.from]||[],idx=from.findIndex(p=>p.player===move.player);if(idx>=0){const [rec]=from.splice(idx,1);(rosters[move.to]||(rosters[move.to]=[])).push(rec);}}
      for(const [teamKey,names] of Object.entries(a.conditionalDelists||{})){const remove=new Set((names||[]).filter(Boolean));if(remove.size)rosters[teamKey]=(rosters[teamKey]||[]).filter(p=>!remove.has(p.player));}
    }else if(a.type==='Rookie swap'){
      const rows=rosters[a.team]||[],pin=rows.find(p=>p.player===a.playerIn),pout=rows.find(p=>p.player===a.playerOut);if(pin){pin.status='Field';if(a.playerInPosition)pin.position=String(a.playerInPosition).toUpperCase();}if(pout)pout.status='Interchange';
    }else if(a.type==='Rookie elevation'&&a.team&&a.player){
      const rows=rosters[a.team]||[],rec=rows.find(p=>p.player===a.player);if(rec){rec.contract='Main';rec.salary=Number(a.newSalary||rec.salary||0);rec.position=String(a.newPosition||rec.position||'').toUpperCase();if(a.contractEnd)rec.contractEnd=Number(a.contractEnd);}
    }else if(a.type==='Delisted'&&a.team){
      const names=new Set((a.players||[a.player]).filter(Boolean));if(names.size)rosters[a.team]=(rosters[a.team]||[]).filter(p=>!names.has(p.player));
    }
  }
  function scoringActionsForRound(round){
    const allowed=new Set(['Trade','Rookie swap','Rookie elevation','Delisted']);
    return getCommissionerActions().filter(a=>a.status==='CONFIRMED'&&allowed.has(a.type)&&(!a.season||Number(a.season)===currentSeason())).map(a=>({...a,_scoringFrom:legacyScoringEffectiveRound(a)})).filter(a=>Number(a._scoringFrom)<=Number(round)).sort((a,b)=>Number(a._scoringFrom)-Number(b._scoringFrom)||String(a.timestamp||'').localeCompare(String(b.timestamp||'')));
  }
  function scoringActionTouchesTeam(action,teamKey){
    if(action.type==='Trade')return (action.moves||[]).some(m=>m.from===teamKey||m.to===teamKey);
    return action.team===teamKey;
  }
  function scoringRostersForRound(round){
    const snap=scoringSnapshotForRound(round); if(!snap)return effectiveRosters();
    const rosters=cloneRosters(snap.rosters),actions=scoringActionsForRound(round);
    for(const a of actions)applyScoringAction(rosters,a);
    return rosters;
  }
  function legacyRoundPlayer(round,name){
    const canon=canonicalPlayerName(name),roundRows=D.roundScores?.[String(round)]||{};
    for(const rows of Object.values(roundRows)){
      const rec=(rows||[]).find(p=>canonicalPlayerName(p.player)===canon);if(rec)return rec;
    }
    return null;
  }
  function proposalWindowOpen(type,phase=''){
    const kind=String(type||'').toUpperCase(),w=getProposalWindows();
    if(kind==='SWAP')return true;
    if(kind==='DRAFT_PICK'){const d=getDraftState();return Boolean(d.active)&&(!phase||String(d.type||'')===String(phase));}
    const slot=kind==='TRADE'?w.trade:kind==='DELIST'?w.delist:kind==='ELEVATION'?w.elevation:null;
    return Boolean(slot?.open)&&(!phase||String(slot.phase||'')===String(phase));
  }


  function canonicalPlayerName(value){
    return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  }
  function normalizeAflCode(value){
    const raw=String(value||'').trim().toUpperCase();
    return AFL_NAME_TO_CODE[raw] || AFL_CLUB_TO_CODE[raw] || (AFL_CODE_SET.has(raw)?raw:'');
  }
  function legacySeasonSetup(){
    const rounds=Object.entries(D.roundSchedule||{}).map(([round,rec])=>({
      round:Number(round),
      aflTeamsPlaying:Number(rec.aflTeamsPlaying||rec.topPlayers||18),
      byeClubs:[],
      bankClubs:(D.openingRound?.byeBanks?.[String(round)]||[]).map(normalizeAflCode).filter(Boolean)
    }));
    return {active:false,season:Number(D.meta.season||2026),currentRound:Number(D.meta.currentRound||1),completedThroughRound:Number(D.meta.currentRound||1),
      openingRound:{enabled:Boolean(D.openingRound?.headToHead===false),label:D.openingRound?.label||'Opening Round',participants:[]},
      aflFixtureCsv:'',rounds,pegsRegularRounds:20,pegsFixtures:(D.fixtures||[]).filter(x=>Number(x.round)<=20).map(x=>({...x})),
      finals:{enabled:true,format:'TOP4_PAGE',week1Round:21,preliminaryRound:22,grandFinalRound:23,bracket:null},liveScoringEnabled:true,updatedAt:null};
  }
  function newSeasonTemplate(){
    const season=Number(D.meta.season||2026)+1, regularRounds=20;
    return {active:false,season,currentRound:1,completedThroughRound:0,openingRound:{enabled:false,label:'Opening Round',participants:[]},aflFixtureCsv:'',rounds:[],pegsRegularRounds:regularRounds,pegsFixtures:generatePegsFixture(regularRounds),
      finals:{enabled:true,format:'TOP4_PAGE',week1Round:regularRounds+1,preliminaryRound:regularRounds+2,grandFinalRound:regularRounds+3,bracket:null},liveScoringEnabled:true,updatedAt:null};
  }
  function getSeasonSetup(){
    try { const x=JSON.parse(localStorage.getItem(SEASON_SETUP_KEY)||'null'); return x&&typeof x==='object'?x:legacySeasonSetup(); } catch(_){ return legacySeasonSetup(); }
  }
  function saveSeasonSetup(value){ localStorage.setItem(SEASON_SETUP_KEY,JSON.stringify(value)); void pushSharedState('season_setup',value); }
  function getSeasonResults(){
    try { return JSON.parse(localStorage.getItem(SEASON_RESULTS_KEY)||'{}'); } catch(_){ return {}; }
  }
  function saveSeasonResults(value){ localStorage.setItem(SEASON_RESULTS_KEY,JSON.stringify(value)); void pushSharedState('season_results',value); }
  function getLiveFeed(){
    try { return JSON.parse(localStorage.getItem(LIVE_FEED_KEY)||'{}'); } catch(_){ return {}; }
  }
  function saveLiveFeed(value,{share=true}={}){ localStorage.setItem(LIVE_FEED_KEY,JSON.stringify(value)); if(share) void pushSharedState('live_feed',value); }
  function getOpeningBank(){ try { return JSON.parse(localStorage.getItem(OPENING_BANK_KEY)||'{}'); } catch(_){ return {}; } }
  function saveOpeningBank(value){ localStorage.setItem(OPENING_BANK_KEY,JSON.stringify(value)); void pushSharedState('opening_bank',value); }
  function activeSeasonSetup(){ const x=getSeasonSetup(); return x&&x.active?x:null; }
  function currentSeason(){ return Number(activeSeasonSetup()?.season||D.meta.season||2026); }
  function effectiveCurrentRound(){ return Number(activeSeasonSetup()?.currentRound||D.meta.currentRound||1); }
  function finalsConfig(setup=activeSeasonSetup()||getSeasonSetup()){
    const regular=Number(setup?.pegsRegularRounds||20),f=setup?.finals||{};
    return {enabled:f.enabled!==false,format:'TOP4_PAGE',week1Round:Number(f.week1Round||regular+1),preliminaryRound:Number(f.preliminaryRound||regular+2),grandFinalRound:Number(f.grandFinalRound||regular+3),bracket:f.bracket||null};
  }
  function finalsResult(round,home,away){
    if(!home||!away)return null;
    const rec=getSeasonResults()?.[String(currentSeason())]?.[String(round)],hs=Number(rec?.teamScores?.[home]),as=Number(rec?.teamScores?.[away]);
    if(!Number.isFinite(hs)||!Number.isFinite(as)||hs===as)return null;
    return {homeScore:hs,awayScore:as,winner:hs>as?home:away,loser:hs>as?away:home};
  }
  function calculatedFinalsBracket(setup=activeSeasonSetup()||getSeasonSetup()){
    const f=finalsConfig(setup),b=f.bracket;if(!f.enabled||!b?.seeds?.length)return b||null;
    const seeds=b.seeds,qf={round:f.week1Round,home:seeds[0],away:seeds[1],label:'Qualifying Final'},ef={round:f.week1Round,home:seeds[2],away:seeds[3],label:'Elimination Final'};
    const qr=finalsResult(qf.round,qf.home,qf.away),er=finalsResult(ef.round,ef.home,ef.away);
    const pf={round:f.preliminaryRound,home:qr?.loser||null,away:er?.winner||null,label:'Preliminary Final'};
    const pr=finalsResult(pf.round,pf.home,pf.away);
    const gf={round:f.grandFinalRound,home:qr?.winner||null,away:pr?.winner||null,label:'Grand Final'};
    return {...b,qf,ef,pf,gf};
  }
  function effectiveFinals(){
    const setup=activeSeasonSetup();
    if(!setup)return (D.finals||[]).map((x,i)=>{const base={...x,label:Number(x.round)===23?'Grand Final':Number(x.round)===22?'Preliminary Final':i===0?'Qualifying Final':'Elimination Final'};if(!hasScoreCorrections()||!x.home||!x.away)return base;const homeScore=calcTeamRound(Number(x.round),x.home).actual,awayScore=calcTeamRound(Number(x.round),x.away).actual;return {...base,homeScore,awayScore,winner:homeScore>awayScore?x.home:awayScore>homeScore?x.away:null};});
    const b=calculatedFinalsBracket(setup); if(!b)return [];
    return [b.qf,b.ef,b.pf,b.gf].filter(x=>x?.home).map(x=>{const r=x.away?finalsResult(x.round,x.home,x.away):null;return {...x,homeScore:r?.homeScore,awayScore:r?.awayScore,winner:r?.winner};});
  }
  function roundLabel(round){
    const n=Number(round),f=finalsConfig();
    if(activeSeasonSetup()?.finals?.enabled!==false){if(n===f.week1Round)return 'Finals Week 1';if(n===f.preliminaryRound)return 'Preliminary Final';if(n===f.grandFinalRound)return 'Grand Final';}
    if(!activeSeasonSetup()){if(n===23)return 'Grand Final';if(n===22)return 'Preliminary Final';if(n===21)return 'Finals Week 1';}
    return `Round ${n}`;
  }
  function effectiveFixtures(){
    const x=activeSeasonSetup(); if(!x)return D.fixtures;
    const regular=Array.isArray(x.pegsFixtures)?x.pegsFixtures:[];
    const finals=effectiveFinals().filter(f=>f.away).map(f=>({round:Number(f.round),home:f.home,away:f.away,finalType:f.label}));
    return [...regular,...finals];
  }
  function effectiveRoundRecord(round){
    const x=activeSeasonSetup();
    const found=x?.rounds?.find(r=>Number(r.round)===Number(round));
    if(found)return found;
    if(x)return {round:Number(round),aflTeamsPlaying:18,byeClubs:[],bankClubs:[]};
    const rec=D.roundSchedule?.[String(round)]||{};
    return {round:Number(round),aflTeamsPlaying:Number(rec.aflTeamsPlaying||rec.topPlayers||D.meta.topPlayersDefault||18),byeClubs:[],bankClubs:(D.openingRound?.byeBanks?.[String(round)]||[]).map(normalizeAflCode).filter(Boolean)};
  }
  function playerPoolRecord(name){ return D.playerPool.find(p=>canonicalPlayerName(p.player)===canonicalPlayerName(name)); }
  function baselineProjection(name,fallback=0){
    const p=playerPoolRecord(name); if(!p)return Number(fallback||0);
    const vals=[Number(p.average||0),Number(p.last5||0),Number(p.last3||0)].filter(v=>v>0);
    if(!vals.length)return Number(fallback||0);
    if(vals.length===3)return vals[0]*0.5+vals[1]*0.3+vals[2]*0.2;
    return vals.reduce((a,b)=>a+b,0)/vals.length;
  }
  function feedPlayer(name){
    const feed=getLiveFeed(); if(Number(feed.season)!==currentSeason()||Number(feed.round)!==effectiveCurrentRound())return null;
    return feed.players?.[canonicalPlayerName(name)]||null;
  }
  function roundFinalized(round){ return getSeasonResults()?.[String(currentSeason())]?.[String(round)]||null; }

  function applyOpeningBankDestinations(parsed,mapping=null){
    const base=parsed||{games:[],rounds:[],openingRound:{enabled:false,label:'Opening Round',participants:[]}};
    const op=base.openingRound||{enabled:false,label:'Opening Round',participants:[]};
    const suggested=op.suggestedBankDestinations||{};
    const chosen={};
    for(const club of op.participants||[]){
      const raw=mapping&&Object.prototype.hasOwnProperty.call(mapping,club)?mapping[club]:suggested[club];
      const round=Number(raw||0);
      if(Number.isInteger(round)&&round>0)chosen[club]=round;
    }
    const rounds=(base.rounds||[]).map(r=>({...r,bankClubs:Object.entries(chosen).filter(([,rd])=>Number(rd)===Number(r.round)).map(([club])=>club)}));
    return {...base,rounds,openingRound:{...op,bankDestinations:chosen}};
  }
  function parseAflFixtureCsv(text){
    const games=[],lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    for(const line of lines){
      if(/^round\s*,/i.test(line))continue;
      const bits=line.split(/[,\t;]/).map(x=>x.trim()).filter((_,i)=>i<3);
      if(bits.length<3)continue;
      let token=bits[0].toUpperCase().replace(/ROUND\s*/,'').trim();
      const home=normalizeAflCode(bits[1]),away=normalizeAflCode(bits[2]); if(!home||!away||home===away)continue;
      const round=(token==='OR'||token==='OPENING'||token==='OPENING ROUND'||token==='0')?'OR':Number(token);
      if(round!=='OR'&&!Number.isInteger(round))continue;
      games.push({round,home,away});
    }
    const openingGames=games.filter(g=>g.round==='OR');
    const openingParticipants=[...new Set(openingGames.flatMap(g=>[g.home,g.away]))];
    const numeric=[...new Set(games.filter(g=>g.round!=='OR').map(g=>Number(g.round)))].sort((a,b)=>a-b);
    if(!games.length)return {games:[],rounds:[],openingRound:{enabled:false,label:'Opening Round',participants:[],bankDestinations:{},suggestedBankDestinations:{}}};
    const maxRound=numeric.length?Math.max(...numeric):0;
    const rounds=Array.from({length:maxRound},(_,i)=>{
      const round=i+1,participants=[...new Set(games.filter(g=>g.round===round).flatMap(g=>[g.home,g.away]))];
      const byeClubs=participants.length?AFL_TEAMS.map(x=>x[0]).filter(c=>!participants.includes(c)):[];
      return {round,aflTeamsPlaying:participants.length||18,byeClubs,bankClubs:[]};
    });
    const suggestedBankDestinations={};
    for(const club of openingParticipants){
      const bye=rounds.find(r=>(r.byeClubs||[]).includes(club));
      if(bye)suggestedBankDestinations[club]=Number(bye.round);
    }
    return applyOpeningBankDestinations({games,rounds,openingRound:{enabled:openingGames.length>0,label:'Opening Round',participants:openingParticipants,suggestedBankDestinations}},suggestedBankDestinations);
  }
  function fixtureCsvFromRetrievedGames(games){
    return (games||[]).filter(g=>!Number(g.is_final||0)).map(g=>{
      const rn=String(g.roundname||'').toUpperCase(),rawRound=Number(g.round);
      const token=(rawRound===0||rn.includes('OPENING ROUND'))?'OR':rawRound;
      const home=normalizeAflCode(g.hteam||g.home||''),away=normalizeAflCode(g.ateam||g.away||'');
      return home&&away&&token!==null&&token!==undefined?`${token},${home},${away}`:'';
    }).filter(Boolean).join('\n');
  }
  function openingRoundMappingControls(setup){
    const op=setup?.openingRound;
    if(!op?.enabled||!(op.participants||[]).length)return '<div class="notice"><strong>No Opening Round detected.</strong> No score-bank mapping is required.</div>';
    const chosen=op.bankDestinations||{},suggested=op.suggestedBankDestinations||{};
    return `<div class="or-map-grid">${(op.participants||[]).map(club=>{
      const available=(setup.rounds||[]).filter(r=>(r.byeClubs||[]).includes(club));
      const selected=Number(chosen[club]||suggested[club]||0);
      const opts=[`<option value="0" ${!selected?'selected':''}>Do not bank</option>`,...available.map(r=>`<option value="${r.round}" ${Number(r.round)===selected?'selected':''}>Round ${r.round} · ${club} bye</option>`)].join('');
      return `<label class="or-map-card"><span>${club}</span><small>Use this club's Opening Round player scores in:</small><select class="select or-bank-round" data-or-club="${club}">${opts}</select></label>`;
    }).join('')}</div>`;
  }
  function readOpeningRoundMapping(setup){
    const mapping={};
    document.querySelectorAll('.or-bank-round').forEach(el=>{const round=Number(el.value||0);if(round>0)mapping[String(el.dataset.orClub||'')]=round;});
    return applyOpeningBankDestinations(setup,mapping);
  }
  async function retrieveAflFixtureForSeason(year){
    if(!backendConfigured())throw new Error('Configure the free shared backend first. Fixture retrieval runs through the PEGS server function so league visitors do not query the source directly.');
    const fn=CONFIG.aflFixtureFunction||'afl-fixture-sync';
    const url=CONFIG.supabaseUrl.replace(/\/$/,'')+`/functions/v1/${fn}?season=${Number(year)}`;
    const res=await fetch(url,{headers:{apikey:CONFIG.supabaseAnonKey,Authorization:'Bearer '+(backendToken()||commissionerBackendToken()||CONFIG.supabaseAnonKey)}});
    if(!res.ok){let msg='Fixture retrieval failed.';try{const x=await res.json();msg=x.error||x.message||msg;}catch(_){msg=await res.text()||msg;}throw new Error(msg);}
    const payload=await res.json();
    const csv=String(payload.csv||fixtureCsvFromRetrievedGames(payload.games||[]));
    if(!csv.trim())throw new Error(`No home-and-away AFL fixture was returned for ${year}. It may not be published yet.`);
    return {...payload,csv};
  }
  function pegsFixtureCsv(fixtures){ return (fixtures||[]).map(f=>`${f.round},${f.home},${f.away}`).join('\n'); }
  function parsePegsFixtureCsv(text){
    const out=[]; for(const line of String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean)){
      if(/^round\s*,/i.test(line))continue; const bits=line.split(/[,\t;]/).map(x=>x.trim()); if(bits.length<3)continue;
      const round=Number(String(bits[0]).replace(/round\s*/i,'')),home=String(bits[1]).toUpperCase(),away=String(bits[2]).toUpperCase();
      if(Number.isInteger(round)&&teamMap[home]&&teamMap[away]&&home!==away)out.push({round,home,away});
    } return out;
  }
  function generatePegsFixture(roundCount=20){
    const teams=D.teams.map(t=>t.key),n=teams.length,cycle=n-1; if(n%2)return [];
    const rounds=[]; let arr=[...teams];
    const cyclePairs=[];
    for(let r=0;r<cycle;r++){
      const pairs=[]; for(let i=0;i<n/2;i++){let a=arr[i],b=arr[n-1-i]; if((r+i)%2) [a,b]=[b,a]; pairs.push([a,b]);}
      cyclePairs.push(pairs); arr=[arr[0],arr[n-1],...arr.slice(1,n-1)];
    }
    for(let r=0;r<Number(roundCount||20);r++) cyclePairs[r%cycle].forEach(([home,away])=>rounds.push({round:r+1,home,away}));
    return rounds;
  }
  function validatePegsFixture(fixtures,roundCount){
    const errors=[]; for(let r=1;r<=Number(roundCount||0);r++){
      const fs=fixtures.filter(x=>Number(x.round)===r),seen=[]; fs.forEach(f=>seen.push(f.home,f.away));
      if(fs.length!==D.teams.length/2)errors.push(`Round ${r} has ${fs.length} matchups; expected ${D.teams.length/2}.`);
      if(new Set(seen).size!==seen.length)errors.push(`Round ${r} contains a team more than once.`);
    } return errors;
  }

  function getLocalProposals() {
    try { return JSON.parse(localStorage.getItem(PROPOSALS_KEY) || '[]'); } catch (_) { return []; }
  }
  function saveLocalProposals(value) { localStorage.setItem(PROPOSALS_KEY, JSON.stringify(value)); proposalCache = value; }
  function normalizeProposal(row) {
    if (!row) return null;
    return {
      id: row.id ?? row.local_id ?? '',
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      type: row.type || '',
      phase: row.phase || '',
      proposerTeam: row.proposer_team || row.proposerTeam || '',
      counterpartyTeam: row.counterparty_team || row.counterpartyTeam || '',
      payload: row.payload || {},
      status: row.status || 'PENDING',
      commissionerNote: row.commissioner_note || row.commissionerNote || '',
      decidedAt: row.decided_at || row.decidedAt || null,
      counterpartyDecidedAt: row.counterparty_decided_at || row.counterpartyDecidedAt || null,
      counterpartyUserId: row.counterparty_user_id || row.counterpartyUserId || null
    };
  }
  async function syncProposals() {
    if (!backendConfigured()) { proposalCache = getLocalProposals(); return proposalCache; }
    try {
      const rows = await backendFetch('/rest/v1/pegs_proposals?select=*&order=created_at.desc&limit=250');
      proposalCache = (rows || []).map(normalizeProposal).filter(Boolean);
    } catch (e) { console.warn('Proposal sync unavailable', e); }
    return proposalCache;
  }
  async function submitProposal(proposal) {
    const row = normalizeProposal({...proposal, createdAt:new Date().toISOString()});
    if(row.type==='TRADE'&&!proposalWindowOpen('TRADE',row.phase))throw new Error('The Commissioner has closed trading submissions.');
    if(row.type==='DELIST'&&!proposalWindowOpen('DELIST',row.phase))throw new Error('The Commissioner has closed delisting submissions.');
    if(row.type==='ELEVATION'&&!proposalWindowOpen('ELEVATION',row.phase))throw new Error('The Commissioner has closed rookie elevation submissions.');
    if(row.type==='DRAFT_PICK'&&!proposalWindowOpen('DRAFT_PICK',row.phase))throw new Error('The draft is not currently open.');
    if (!backendConfigured()) {
      row.status=row.type==='TRADE'?'AWAITING_COUNTERPARTY':'AWAITING_COMMISSIONER';
      row.id = 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2,8);
      const all = [row, ...getLocalProposals()]; saveLocalProposals(all); return row;
    }
    if(!teamLoggedIn())throw new Error('Team login required.');
    const out=await backendFetch('/rest/v1/rpc/pegs_submit_team_proposal',{method:'POST',body:JSON.stringify({p_type:row.type,p_phase:row.phase||'',p_counterparty_team:row.counterpartyTeam||null,p_payload:row.payload||{}})});
    await syncProposals(); updateSessionUI(); return normalizeProposal(out);
  }

  async function decideProposal(id,status,note='') {
    if (!backendConfigured()) {
      const all=getLocalProposals().map(p=>String(p.id)===String(id)?{...p,status,commissionerNote:note,decidedAt:new Date().toISOString()}:p);
      saveLocalProposals(all); return;
    }
    if(!commissionerLoggedIn())throw new Error('Commissioner login required.');
    await commissionerFetch('/rest/v1/pegs_proposals?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status,commissioner_note:note,decided_at:new Date().toISOString()})});
    await syncProposals();
  }
  async function respondTrade(id,accept){
    if(!teamLoggedIn())throw new Error('Team login required.');
    const out=await backendFetch('/rest/v1/rpc/pegs_respond_trade',{method:'POST',body:JSON.stringify({p_proposal_id:Number(id),p_accept:Boolean(accept)})});
    await syncProposals();updateSessionUI();return normalizeProposal(out);
  }


  function backendConfigured() { return Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey); }
  function backendToken() { return sessionStorage.getItem(BACKEND_TOKEN_KEY) || ''; }
  function backendRefreshToken(){return sessionStorage.getItem(BACKEND_REFRESH_KEY)||'';}
  function commissionerBackendToken(){return sessionStorage.getItem(COMM_BACKEND_TOKEN_KEY)||'';}
  function commissionerBackendRefreshToken(){return sessionStorage.getItem(COMM_BACKEND_REFRESH_KEY)||'';}
  function identity(){return currentIdentity&&typeof currentIdentity==='object'?currentIdentity:{role:'public'};}
  function setIdentity(value){currentIdentity=value||{role:'public'};sessionStorage.setItem(IDENTITY_KEY,JSON.stringify(currentIdentity));updateSessionUI();}
  function clearBackendSession(){sessionStorage.removeItem(BACKEND_TOKEN_KEY);sessionStorage.removeItem(BACKEND_REFRESH_KEY);sessionStorage.removeItem(IDENTITY_KEY);currentIdentity={role:'public'};transactionScope='mine';updateSessionUI();}
  function clearCommissionerSession(){sessionStorage.removeItem(COMM_BACKEND_TOKEN_KEY);sessionStorage.removeItem(COMM_BACKEND_REFRESH_KEY);sessionStorage.removeItem(COMM_SESSION_KEY);matchupScoreEditOpen=false;updateSessionUI();}
  function dismissDialog(dialog){
    if(!dialog)return;
    try{if(dialog.open)dialog.close();}catch(_){/* fall through to attribute cleanup */}
    if(dialog.open||dialog.hasAttribute('open'))dialog.removeAttribute('open');
  }
  async function refreshSessionToken(mode='team'){
    const commissioner=mode==='commissioner';
    const refresh=commissioner?commissionerBackendRefreshToken():backendRefreshToken();if(!refresh)return false;
    const res=await fetch(CONFIG.supabaseUrl.replace(/\/$/,'')+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:CONFIG.supabaseAnonKey,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:refresh})});
    if(!res.ok){if(commissioner)clearCommissionerSession();else clearBackendSession();return false;}
    const data=await res.json();
    sessionStorage.setItem(commissioner?COMM_BACKEND_TOKEN_KEY:BACKEND_TOKEN_KEY,data.access_token||'');
    if(data.refresh_token)sessionStorage.setItem(commissioner?COMM_BACKEND_REFRESH_KEY:BACKEND_REFRESH_KEY,data.refresh_token);
    return true;
  }
  async function refreshBackendToken(){return refreshSessionToken('team');}
  function backendErrorText(raw,status=0) {
    const text=String(raw||'').trim();
    if(!text)return 'HTTP '+status;
    try{
      const x=JSON.parse(text);
      const parts=[x.message,x.details,x.hint].filter(Boolean);
      const code=x.code?` [${x.code}]`:'';
      return (parts.join(' - ')||text)+code;
    }catch(_){return text;}
  }
  async function backendFetch(path, options={}, retry=true, authMode='auto') {
    const commissioner=authMode==='commissioner'||(authMode==='auto'&&!backendToken()&&commissionerLoggedIn());
    let token=commissioner?commissionerBackendToken():backendToken();
    const refresh=commissioner?commissionerBackendRefreshToken():backendRefreshToken();
    if(!token&&refresh&&await refreshSessionToken(commissioner?'commissioner':'team'))token=commissioner?commissionerBackendToken():backendToken();
    const headers={apikey:CONFIG.supabaseAnonKey,'Content-Type':'application/json',...(options.headers||{})};
    headers.Authorization='Bearer '+(token||CONFIG.supabaseAnonKey);
    const res=await fetch(CONFIG.supabaseUrl.replace(/\/$/,'')+path,{...options,headers});
    if(res.status===401&&retry&&refresh&&await refreshSessionToken(commissioner?'commissioner':'team'))return backendFetch(path,options,false,authMode);
    if(!res.ok){const raw=await res.text();throw new Error(backendErrorText(raw,res.status));}
    return res.status===204 ? null : res.json();
  }
  async function commissionerFetch(path,options={},retry=true){
    if(!commissionerLoggedIn())throw new Error('Commissioner login required.');
    return backendFetch(path,options,retry,'commissioner');
  }
  async function backendWhoAmIWithToken(token){
    const res=await fetch(CONFIG.supabaseUrl.replace(/\/$/,'')+'/rest/v1/rpc/pegs_whoami',{method:'POST',headers:{apikey:CONFIG.supabaseAnonKey,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:'{}'});
    if(!res.ok)throw new Error('Could not verify this login.');
    return await res.json();
  }
  async function authenticateBackend(email,password){
    const res=await fetch(CONFIG.supabaseUrl.replace(/\/$/,'')+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:CONFIG.supabaseAnonKey,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    if(!res.ok) throw new Error('Login failed. Check the username/password and try again.');
    const data=await res.json(),token=data.access_token||'';if(!token)throw new Error('Login failed. No access token was returned.');
    const who=await backendWhoAmIWithToken(token);return {data,who};
  }
  async function refreshIdentity(){
    if(!backendConfigured()||!backendToken()){setIdentity({role:'public'});return currentIdentity;}
    try{
      const who=await backendFetch('/rest/v1/rpc/pegs_whoami',{method:'POST',body:'{}'});
      // Seamlessly migrate a v14.1p Commissioner-only session into the new
      // independent Commissioner credential slot, freeing the normal slot for a team login.
      if(String(who?.role||'').toLowerCase()==='commissioner'){
        const token=backendToken(),refresh=backendRefreshToken();
        if(token)sessionStorage.setItem(COMM_BACKEND_TOKEN_KEY,token);
        if(refresh)sessionStorage.setItem(COMM_BACKEND_REFRESH_KEY,refresh);
        sessionStorage.setItem(COMM_SESSION_KEY,'1');
        clearBackendSession();
        return currentIdentity;
      }
      setIdentity(who||{role:'unknown'});return currentIdentity;
    }catch(e){clearBackendSession();return currentIdentity;}
  }
  async function refreshCommissionerSession(){
    if(!backendConfigured())return sessionStorage.getItem(COMM_SESSION_KEY)==='1';
    if(!commissionerBackendToken()&&!commissionerBackendRefreshToken()){sessionStorage.removeItem(COMM_SESSION_KEY);return false;}
    try{
      const who=await backendFetch('/rest/v1/rpc/pegs_whoami',{method:'POST',body:'{}'},true,'commissioner');
      if(String(who?.role||'').toLowerCase()!=='commissioner')throw new Error('Not a Commissioner session.');
      sessionStorage.setItem(COMM_SESSION_KEY,'1');return true;
    }catch(_){clearCommissionerSession();return false;}
  }
  async function backendLogin(email,password,expectedRole='team') {
    const {data,who}=await authenticateBackend(email,password);
    if(expectedRole&&who.role!==expectedRole)throw new Error(expectedRole==='commissioner'?'This account is not the Commissioner account.':'This is not an active team account.');
    sessionStorage.setItem(BACKEND_TOKEN_KEY,data.access_token||'');sessionStorage.setItem(BACKEND_REFRESH_KEY,data.refresh_token||'');setIdentity(who||{role:'unknown'});return data;
  }
  async function commissionerBackendLogin(email,password){
    const {data,who}=await authenticateBackend(email,password);
    if(String(who?.role||'').toLowerCase()!=='commissioner')throw new Error('This account is not the Commissioner account.');
    sessionStorage.setItem(COMM_BACKEND_TOKEN_KEY,data.access_token||'');sessionStorage.setItem(COMM_BACKEND_REFRESH_KEY,data.refresh_token||'');sessionStorage.setItem(COMM_SESSION_KEY,'1');updateSessionUI();return data;
  }
  async function commissionerAccessToken(){
    let token=commissionerBackendToken();
    if(!token&&commissionerBackendRefreshToken()&&await refreshSessionToken('commissioner'))token=commissionerBackendToken();
    if(!token)throw new Error('Commissioner login required.');return token;
  }
  async function verifyCommissionerPassword(password){
    if(!commissionerLoggedIn())throw new Error('Commissioner login required.');
    const pw=String(password||'');if(!pw)throw new Error('Enter the Commissioner password.');
    if(!backendConfigured()){
      const expected=localStorage.getItem(COMM_PIN_KEY)||'';if(!expected)throw new Error('No local Commissioner password is configured.');
      if(await hashPin(pw)!==expected)throw new Error('Incorrect Commissioner password.');
      return true;
    }
    const email=String(CONFIG.commissionerEmail||'').trim();if(!email)throw new Error('Commissioner email is not configured.');
    const base=CONFIG.supabaseUrl.replace(/\/$/,'');
    const authRes=await fetch(base+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:CONFIG.supabaseAnonKey,'Content-Type':'application/json'},body:JSON.stringify({email,password:pw})});
    if(!authRes.ok)throw new Error('Incorrect Commissioner password.');
    const auth=await authRes.json(),token=auth.access_token||'';if(!token)throw new Error('Commissioner password verification failed.');
    const whoRes=await fetch(base+'/rest/v1/rpc/pegs_whoami',{method:'POST',headers:{apikey:CONFIG.supabaseAnonKey,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:'{}'});
    if(!whoRes.ok)throw new Error('Commissioner password verification failed.');
    const who=await whoRes.json();if(String(who?.role||'').toLowerCase()!=='commissioner')throw new Error('This password is not for the Commissioner account.');
    return true;
  }
  async function pushSharedState(key,value) {
    if(!backendConfigured() || !commissionerLoggedIn()) return;
    try { await commissionerFetch('/rest/v1/pegs_state?on_conflict=key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({key,value,updated_at:new Date().toISOString()})}); } catch(e){ console.warn('Shared PEGS state update failed',e); }
  }
  async function pullSharedState() {
    if(!backendConfigured()) return;
    try {
      const rows=await backendFetch('/rest/v1/pegs_state?select=key,value');
      for(const row of rows||[]){
        if(row.key==='score_overrides') localStorage.setItem(OVERRIDE_KEY,JSON.stringify(row.value||{}));
        if(row.key==='selection_overrides') localStorage.setItem(SELECTION_OVERRIDE_KEY,JSON.stringify(row.value||{}));
        if(row.key==='commissioner_actions') localStorage.setItem(COMM_ACTIONS_KEY,JSON.stringify(row.value||[]));
        if(row.key==='transaction_reversals') localStorage.setItem(TRANSACTION_REVERSALS_KEY,JSON.stringify(row.value||{}));
        if(row.key==='draft_state') localStorage.setItem(DRAFT_STATE_KEY,JSON.stringify(row.value||{}));
        if(row.key==='season_setup') localStorage.setItem(SEASON_SETUP_KEY,JSON.stringify(row.value||{}));
        if(row.key==='season_results') localStorage.setItem(SEASON_RESULTS_KEY,JSON.stringify(row.value||{}));
        if(row.key==='live_feed') localStorage.setItem(LIVE_FEED_KEY,JSON.stringify(row.value||{}));
        if(row.key==='opening_bank') localStorage.setItem(OPENING_BANK_KEY,JSON.stringify(row.value||{}));
        if(row.key==='proposal_windows') localStorage.setItem(PROPOSAL_WINDOWS_KEY,JSON.stringify(row.value||{}));
        if(row.key==='scoring_snapshots') localStorage.setItem(SCORING_SNAPSHOTS_KEY,JSON.stringify(row.value||{}));
        if(row.key==='figurehead_overrides') localStorage.setItem(FIGUREHEAD_OVERRIDE_KEY,JSON.stringify(row.value||{}));
      }
    } catch(e){ console.warn('Shared PEGS state unavailable',e); }
  }
  function commissionerLoggedIn() { return backendConfigured() ? sessionStorage.getItem(COMM_SESSION_KEY)==='1'&&Boolean(commissionerBackendToken()||commissionerBackendRefreshToken()) : sessionStorage.getItem(COMM_SESSION_KEY)==='1'; }
  function teamLoggedIn(){return backendConfigured()&&identity().role==='team'&&Boolean(identity().teamKey);}
  function loggedTeamKey(){return teamLoggedIn()?String(identity().teamKey||'').toUpperCase():'';}
  function teamAuthEmail(teamKey){const t=team(teamKey);return `${String(t.owner||teamKey).toLowerCase().replace(/[^a-z0-9]+/g,'')}@pegs.local`;}
  function incomingTradeRequests(){const k=loggedTeamKey();return k?proposalCache.filter(p=>p.type==='TRADE'&&p.status==='AWAITING_COUNTERPARTY'&&p.counterpartyTeam===k):[];}
  function updateSessionUI(){
    const label=document.getElementById('team-login-label'),dot=document.getElementById('team-notification-dot'),comm=document.getElementById('open-commissioner');
    if(label)label.textContent=teamLoggedIn()?team(loggedTeamKey()).owner:'Team Login';
    if(dot){const n=incomingTradeRequests().length;dot.hidden=!n;dot.textContent=n?String(n):'';}
    if(comm){
      const enabled=commissionerLoggedIn();
      comm.classList.toggle('commissioner-mode-active',enabled);
      comm.setAttribute('aria-label',enabled?'Commissioner Mode enabled — open Control Centre':'Commissioner login');
      comm.title=enabled?'Commissioner Mode enabled — open Control Centre':'Commissioner login';
      comm.innerHTML=enabled?'<span class="commissioner-mode-dot" aria-hidden="true"></span><span class="commissioner-mode-label">Commissioner</span>':'<span aria-hidden="true">C</span>';
    }
  }
  function teamNotificationBanner(){
    if(!teamLoggedIn())return '';const n=incomingTradeRequests().length;if(!n)return '';
    return `<button class="home-trade-notification" data-route="transactions"><span class="notification-pulse">${n}</span><span><strong>${n} trade request${n===1?'':'s'} awaiting your decision</strong><small>Review the trade impact, accept or decline.</small></span><span class="notification-open">Review →</span></button>`;
  }
  function ordinal(value){
    const n=Math.max(0,Number(value||0));if(!n)return '—';const mod100=n%100;if(mod100>=11&&mod100<=13)return `${n}th`;const mod10=n%10;return `${n}${mod10===1?'st':mod10===2?'nd':mod10===3?'rd':'th'}`;
  }
  function teamFixtureRows(teamKey){
    const k=String(teamKey||'').toUpperCase();
    return effectiveFixtures().filter(f=>f?.home&&f?.away&&(f.home===k||f.away===k)).slice().sort((a,b)=>Number(a.round)-Number(b.round));
  }
  function personalisedCurrentRound(){
    return playerProfileRoundCeiling();
  }
  function completedTeamFixtures(teamKey){
    const k=String(teamKey||'').toUpperCase(),setup=activeSeasonSetup(),current=personalisedCurrentRound(),seasonResults=getSeasonResults()?.[String(currentSeason())]||{},out=[];
    for(const f of teamFixtureRows(k)){
      const round=Number(f.round||0);if(round>current)continue;
      let hs=0,as=0,complete=false;
      if(setup){
        const rr=seasonResults[String(round)];if(!rr)continue;
        complete=Boolean(rr.finalizedAt||round<current);if(!complete)continue;
        hs=Number(rr.teamScores?.[f.home]??calcTeamRound(round,f.home).actual??0);as=Number(rr.teamScores?.[f.away]??calcTeamRound(round,f.away).actual??0);
      }else{
        const totals=D.roundTotals?.[String(round)]||D.roundTotals?.[round];if(!totals)continue;
        if(hasScoreCorrections()){hs=Number(calcTeamRound(round,f.home).actual||0);as=Number(calcTeamRound(round,f.away).actual||0);}else{hs=Number(totals[f.home]||0);as=Number(totals[f.away]||0);}
        complete=Boolean(hs||as);if(!complete)continue;
      }
      const own=f.home===k?hs:as,opp=f.home===k?as:hs,opponent=f.home===k?f.away:f.home,result=own>opp?'W':own<opp?'L':'D';
      out.push({fixture:f,round,homeScore:hs,awayScore:as,ownScore:own,opponentScore:opp,opponent,result,margin:Math.abs(own-opp)});
    }
    return out;
  }
  function transactionInvolvesTeam(x,teamKey){
    const k=String(teamKey||'').toUpperCase();if(!k||!x)return false;
    if(String(x.team||'').toUpperCase()===k)return true;
    if(x._source==='modern'){
      const a=x._action||{};
      if([a.team,a.teamA,a.teamB].some(v=>String(v||'').toUpperCase()===k))return true;
      if((a.moves||[]).some(m=>String(m.from||'').toUpperCase()===k||String(m.to||'').toUpperCase()===k))return true;
      if(Object.keys(a.conditionalDelists||{}).some(v=>String(v).toUpperCase()===k))return true;
      return false;
    }
    const meta=x._meta||{},inv=meta.inverse||{};
    if([meta.team,meta.teamA,meta.teamB,inv.team].some(v=>String(v||'').toUpperCase()===k))return true;
    return (inv.moves||[]).some(m=>String(m.from||'').toUpperCase()===k||String(m.to||'').toUpperCase()===k);
  }
  function personalisedLadderData(){
    const regular=Number(activeSeasonSetup()?.pegsRegularRounds||20),rows=D.teams.map(t=>{
      const games=completedTeamFixtures(t.key).filter(x=>Number(x.round)<=regular),r={position:0,team:t.key,played:games.length,wins:0,losses:0,draws:0,pf:0,pa:0,points:0,percentage:0};
      for(const g of games){r.pf+=Number(g.ownScore||0);r.pa+=Number(g.opponentScore||0);if(g.result==='W'){r.wins++;r.points+=4;}else if(g.result==='L')r.losses++;else{r.draws++;r.points+=2;}}
      r.percentage=r.pa?100*r.pf/r.pa:(r.pf?999:0);return r;
    });
    rows.sort((a,b)=>b.points-a.points||b.percentage-a.percentage||b.pf-a.pf||a.team.localeCompare(b.team));rows.forEach((r,i)=>r.position=i+1);return rows;
  }
  function personalisedFormBars(teamKey){
    const regular=Number(activeSeasonSetup()?.pegsRegularRounds||20),form=completedTeamFixtures(teamKey).filter(x=>Number(x.round)<=regular).slice(-5).map(x=>x.result);
    return `<div class="form-results" aria-label="Last five results: ${form.join(', ')}">${form.length?form.map(v=>`<span class="${v==='W'?'win':v==='L'?'loss':'draw'}" title="${v==='W'?'Win':v==='L'?'Loss':'Draw'}">${v}</span>`).join(''):'<span class="empty-form">—</span>'}</div>`;
  }
  function dashboardDraftPhase(){
    const state=getDraftState(),regular=Number(activeSeasonSetup()?.pegsRegularRounds||20);
    if(state.active)return normalizedDraftType(state.type||'Pre-Season');
    return Number(personalisedCurrentRound())<=regular?'Mid-Season':'Pre-Season';
  }
  function teamDashboardData(teamKey){
    const k=String(teamKey||'').toUpperCase(),currentRound=personalisedCurrentRound(),fixtures=teamFixtureRows(k),completed=completedTeamFixtures(k),ladder=personalisedLadderData(),ladderRow=ladder.find(r=>r.team===k)||null;
    const currentFixture=fixtures.find(f=>Number(f.round)===currentRound)||null,last=completed.length?completed[completed.length-1]:null;
    const currentCompleted=currentFixture&&last&&Number(last.round)===Number(currentFixture.round);
    const nextFixture=!currentCompleted&&currentFixture?currentFixture:(fixtures.find(f=>Number(f.round)>currentRound)||null);
    const displayFixture=nextFixture||currentFixture||null,regular=Number(activeSeasonSetup()?.pegsRegularRounds||20),regularCompleted=completed.filter(x=>Number(x.round)<=regular),scores=regularCompleted.map(x=>Number(x.ownScore||0)).filter(Number.isFinite);
    const roster=effectiveRosters()[k]||[],summary=rosterSummary(roster),expiring=roster.filter(p=>Number(p.contractEnd||0)===Number(currentSeason())).length,form=completed.slice(-5).map(x=>x.result),scoreAvg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
    const phase=dashboardDraftPhase(),picks=ownedDraftPicks(k,phase,{excludePending:false}),moves=transactionRecords().filter(x=>transactionInvolvesTeam(x,k)).slice(0,4);
    const projectedRow=activeSeasonSetup()&&currentFixture&&!currentCompleted&&Number(currentFixture.round)<=regular?projectedLadderForRound(currentRound).find(r=>r.team===k)||ladderRow:ladderRow;
    return {teamKey:k,currentRound,fixtures,completed,last,currentFixture,nextFixture,displayFixture,ladder,ladderRow,projectedRow,roster,summary,expiring,form,scoreAvg,phase,picks,moves};
  }
  function dashboardMatchupCard(data){
    const f=data.displayFixture;if(!f)return '<div class="empty">No upcoming fixture is currently configured.</div>';
    const round=Number(f.round),home=calcTeamRound(round,f.home),away=calcTeamRound(round,f.away),isCurrent=round===Number(data.currentRound),final=completedTeamFixtures(data.teamKey).some(x=>Number(x.round)===round),badge=final?'FINAL':isCurrent?liveRoundBadge(round).label:'UP NEXT';
    return `<button class="my-matchup-card" data-action="open-matchup" data-round="${round}" data-home="${esc(f.home)}" data-away="${esc(f.away)}"><div class="my-matchup-card-head"><span class="eyebrow">${esc(roundLabel(round))}</span><span class="badge ${final?'green':isCurrent?'blue':'neutral'}">${esc(badge)}</span></div><div class="my-matchup-teams"><div>${teamIdentity(f.home,'sm')}<strong>${final||isCurrent?home.actual:'—'}</strong><small>${!final?`Proj ${Math.round(home.projected||0)}`:'Final'}</small></div><span class="vs-dot">VS</span><div>${teamIdentity(f.away,'sm')}<strong>${final||isCurrent?away.actual:'—'}</strong><small>${!final?`Proj ${Math.round(away.projected||0)}`:'Final'}</small></div></div><span class="my-matchup-open">View matchup →</span></button>`;
  }
  function renderPersonalizedHome(teamKey){
    const d=teamDashboardData(teamKey),t=team(teamKey),last=d.last,next=d.nextFixture,ladder=d.ladderRow||{},projected=d.projectedRow||ladder;
    const lastLabel=last?`${last.result} · ${Number(last.ownScore).toLocaleString('en-AU')}–${Number(last.opponentScore).toLocaleString('en-AU')}`:'No result yet';
    const lastSub=last?`${roundLabel(last.round)} vs ${team(last.opponent).owner}`:'Season results will appear here';
    const nextOpponent=next?(next.home===teamKey?next.away:next.home):'',nextLabel=next?`R${Number(next.round)} · ${team(nextOpponent).owner}`:'Not scheduled';
    const ladderIndex=Math.max(0,d.ladder.findIndex(r=>r.team===teamKey)),start=Math.max(0,Math.min(ladderIndex-2,Math.max(0,d.ladder.length-5))),nearby=d.ladder.slice(start,start+5);
    const form=d.form.length?d.form.map(v=>`<span class="my-form-pill ${v==='W'?'win':v==='L'?'loss':'draw'}">${v}</span>`).join(''):'<span class="muted-copy">No completed fixtures yet</span>';
    const picks=d.picks.slice(0,8),pickHtml=picks.length?picks.map(p=>`<span class="my-pick-chip"><b>${p.pick}</b><small>R${p.round}${p.originalOwner!==p.owner?` · from ${esc(team(p.originalOwner).owner)}`:''}</small></span>`).join(''):'<span class="muted-copy">No ${esc(d.phase)} picks currently owned.</span>';
    const moves=d.moves.length?d.moves.map(x=>transactionItem(x,false)).join(''):'<div class="empty">No confirmed franchise moves yet.</div>';
    const currentFixture=d.currentFixture,matchRoute=currentFixture?`matchups/${currentFixture.round}/${currentFixture.home}/${currentFixture.away}`:(next?`matchups/${next.round}/${next.home}/${next.away}`:'matchups');
    main.innerHTML=`${teamNotificationBanner()}<section class="my-franchise-home" data-team="${esc(teamKey)}">
      <header class="card my-franchise-hero" style="--accent:${esc(t.accent)}"><div class="my-franchise-hero-team">${figurehead(teamKey,'lg')}<div><span class="badge green">YOUR FRANCHISE</span><span class="eyebrow">${currentSeason()} · Round ${d.currentRound}</span><h1>Welcome back, ${esc(t.owner)}</h1><p>${esc(t.name)}</p></div></div><div class="my-franchise-actions"><button class="primary-button" data-route="teams">My Franchise</button><button class="secondary-button" data-route="${esc(matchRoute)}">My Matchup</button><button class="secondary-button" data-route="transactions">My Moves</button></div></header>
      <section class="my-franchise-kpis" aria-label="Franchise overview"><article class="card my-kpi"><span>Ladder position</span><strong>${ordinal(ladder.position)}</strong><small>${ladder.points??0} pts · ${Number(ladder.percentage||0).toFixed(1)}%</small>${projected&&ladder.position&&projected.position!==ladder.position?`<em>Projected ${ordinal(projected.position)}</em>`:''}</article><article class="card my-kpi"><span>Season record</span><strong>${ladder.wins??0}–${ladder.losses??0}${ladder.draws?`–${ladder.draws}`:''}</strong><small>${ladder.played??0} completed</small></article><article class="card my-kpi"><span>Last result</span><strong>${esc(lastLabel)}</strong><small>${esc(lastSub)}</small></article><article class="card my-kpi"><span>Next fixture</span><strong>${esc(nextLabel)}</strong><small>${nextOpponent?esc(team(nextOpponent).name):'Fixture TBC'}</small></article></section>
      <section class="my-franchise-main-grid"><article class="card card-pad my-current-match"><div class="section-title"><div><span class="eyebrow">Match centre</span><h2>${currentFixture&&!d.completed.some(x=>Number(x.round)===Number(currentFixture.round))?'Your current matchup':'Your next matchup'}</h2></div><button class="link-button" data-route="matchups">All matchups</button></div>${dashboardMatchupCard(d)}</article><article class="card card-pad my-team-snapshot"><div class="section-title"><div><span class="eyebrow">List health</span><h2>Team snapshot</h2></div><button class="link-button" data-route="teams">Full team</button></div><div class="my-snapshot-grid"><div><span>Players</span><strong>${d.roster.length}</strong></div><div><span>Field</span><strong>${d.summary.counts.field||0}</strong></div><div><span>Interchange</span><strong>${d.summary.counts.interchange||0}</strong></div><div><span>Score avg</span><strong>${d.scoreAvg||'—'}</strong></div><div><span>Expiring ${currentSeason()}</span><strong>${d.expiring}</strong></div><div><span>Roster</span><strong class="${rosterIsLegal(d.roster)?'legal-copy':'illegal-copy'}">${rosterIsLegal(d.roster)?'LEGAL':'REVIEW'}</strong></div></div></article></section>
      <section class="my-franchise-secondary-grid"><article class="card card-pad"><div class="section-title"><div><span class="eyebrow">Recent form</span><h2>Last five</h2></div><button class="link-button" data-route="results">Results</button></div><div class="my-form-line">${form}</div><div class="my-score-summary"><span>Regular-season score average</span><strong>${d.scoreAvg||'—'}</strong></div></article><article class="card card-pad"><div class="section-title"><div><span class="eyebrow">Your position</span><h2>Ladder neighbourhood</h2></div><button class="link-button" data-route="ladder">Full ladder</button></div><div class="my-mini-ladder">${nearby.map(r=>`<button data-route="team/${r.team}" class="my-mini-ladder-row ${r.team===teamKey?'is-me':''}"><b>${r.position}</b>${teamIdentity(r.team,'sm')}<span>${r.wins}-${r.losses}</span><strong>${r.points}</strong></button>`).join('')}</div></article></section>
      <section class="my-franchise-secondary-grid"><article class="card card-pad"><div class="section-title"><div><span class="eyebrow">${esc(d.phase)}</span><h2>Your draft assets</h2></div><button class="link-button" data-route="draft">Draft room</button></div><div class="my-pick-list">${pickHtml}</div></article><article class="card card-pad"><div class="section-title"><div><span class="eyebrow">Franchise activity</span><h2>Your recent moves</h2></div><button class="link-button" data-route="transactions">All my moves</button></div><div class="transaction-list my-home-moves">${moves}</div></article></section>
    </section>`;
  }
  async function hashPin(pin) {
    if(globalThis.crypto?.subtle){const bytes=new TextEncoder().encode(pin);const digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');}
    let h=0; for(const c of pin) h=((h<<5)-h)+c.charCodeAt(0)|0; return String(h);
  }

  async function teamLoginUI(){
    if(!backendConfigured()){
      teamLoginContent.innerHTML='<div class="commissioner-body commissioner-login"><div class="notice danger"><strong>Team accounts require the shared Supabase backend.</strong></div></div>';
      return;
    }
    if(teamLoggedIn()){
      const k=loggedTeamKey(),incoming=incomingTradeRequests();
      teamLoginContent.innerHTML=`<div class="commissioner-body commissioner-login"><div class="team-login-avatar">${figurehead(k,'md')}</div><span class="eyebrow">Signed in</span><h3>${esc(team(k).owner)} · ${esc(team(k).name)}</h3><p>This login can only submit actions for this franchise.${commissionerLoggedIn()?' Commissioner Mode is also enabled in this browser session.':''}</p>${incoming.length?`<div class="notice trade-notification"><strong>${incoming.length} trade request${incoming.length===1?'':'s'} waiting.</strong> Review ${incoming.length===1?'it':'them'} in Moves.</div>`:''}<div class="button-row"><button class="primary-button" id="team-go-moves">Open Moves</button><button class="secondary-button" id="team-logout">Log out</button></div></div>`;
      document.getElementById('team-go-moves')?.addEventListener('click',()=>{teamDialog.close();routeTo('transactions');});
      document.getElementById('team-logout')?.addEventListener('click',()=>{teamCredentialCache=[];clearBackendSession();proposalCache=[];teamDialog.close();void syncProposals().then(()=>render());toast('Team logged out.');});
      return;
    }
    const options=D.teams.map(t=>`<option value="${t.key}">${esc(t.owner)} · ${esc(t.name)}</option>`).join('');
    teamLoginContent.innerHTML=`<div class="commissioner-body commissioner-login"><div class="team-login-avatar"><span class="commissioner-lock">T</span></div><span class="eyebrow">Franchise access</span><h3>Team Login</h3><p>Choose your coach username and enter the six-letter password supplied by the Commissioner.</p><div class="form-grid" style="margin-top:16px"><div class="field-group"><label for="team-login-team">Coach username</label><select class="select" id="team-login-team">${options}</select></div><div class="field-group"><label for="team-login-password">Password</label><input class="search-input team-password-input" id="team-login-password" type="password" maxlength="6" autocomplete="current-password" placeholder="ABCDEF"></div></div><div class="button-row"><button class="primary-button" id="team-login-submit">Login to my team</button></div><div class="notice" style="margin-top:16px"><strong>Permissions:</strong> your login is tied to one franchise. Commissioner Mode, when enabled, remains a separate concurrent permission layer.  PEGS will not accept a draft pick, swap, rookie elevation, delisting or trade proposal for another team.</div></div>`;
    const login=async()=>{const k=document.getElementById('team-login-team').value,pw=String(document.getElementById('team-login-password').value||'').trim().toUpperCase();if(pw.length!==6){toast('Enter the six-letter team password.');return;}try{await backendLogin(teamAuthEmail(k),pw,'team');transactionScope='mine';dismissDialog(teamDialog);updateSessionUI();toast(`${team(k).owner} logged in.${commissionerLoggedIn()?' Commissioner Mode remains enabled.':''}`);render();try{await Promise.all([pullSharedState(),syncProposals(),loadDraftPool()]);backgroundRefreshUi();}catch(syncError){console.warn('Team post-login sync incomplete',syncError);}}catch(e){toast(e.message||'Team login failed.');}};
    document.getElementById('team-login-submit')?.addEventListener('click',login);
    document.getElementById('team-login-password')?.addEventListener('keydown',e=>{if(e.key==='Enter')void login();});
  }

  function tradeActionFor(teamA,teamB,assetsA,assetsB,conditionalDelistsA=[],conditionalDelistsB=[]){
    const moves=[];(assetsA?.players||[]).forEach(player=>moves.push({player,from:teamA,to:teamB}));(assetsB?.players||[]).forEach(player=>moves.push({player,from:teamB,to:teamA}));
    const conditionalDelists={};
    if(teamA)conditionalDelists[teamA]=[...new Set((conditionalDelistsA||[]).filter(Boolean))];
    if(teamB)conditionalDelists[teamB]=[...new Set((conditionalDelistsB||[]).filter(Boolean))];
    return {type:'Trade',status:'CONFIRMED',teamA,teamB,moves,conditionalDelists};
  }
  function rosterImpactTeamHtml(teamKey,beforeRows,afterRows,label='After proposed move'){
    const b=rosterSummary(beforeRows||[]),a=rosterSummary(afterRows||[]),legal=rosterIsLegal(afterRows||[]);
    const item=(text,before,after,cap,kind='money')=>{const roomBefore=Number(cap)-Number(before),roomAfter=Number(cap)-Number(after),fmt=kind==='money'?money:(n=>String(n));return `<div class="trade-impact-row"><span>${esc(text)}</span><span>${fmt(before)} <small>(${kind==='money'?money(roomBefore)+' room':roomBefore+' room'})</small></span><span class="trade-impact-arrow">→</span><strong class="${roomAfter<0?'impact-bad':'impact-good'}">${fmt(after)} <small>(${kind==='money'?money(roomAfter)+' room':roomAfter+' room'})</small></strong></div>`;};
    const invalid=a.counts.invalidFieldPositions||0;
    return `<article class="trade-impact-card ${legal?'legal':'blocked'}"><div class="section-title"><div class="trade-team-label" style="--trade-accent:${esc(team(teamKey).accent)}"><span class="trade-team-dot"></span><div><strong>${esc(team(teamKey).name)}</strong><small>${esc(team(teamKey).owner)}</small></div></div><span class="eyebrow">${esc(label)}</span><span class="badge ${legal?'green':'red'}">${legal?'CAN ACCOMMODATE':'BLOCKED'}</span></div><div class="trade-impact-head"><span>Rule</span><span>Before</span><span></span><span>After</span></div>${item('Main salary',b.caps.main,a.caps.main,D.rules.mainContractCap)}${item('Field salary',b.caps.field,a.caps.field,D.rules.fieldCap)}${item('Rookie salary',b.caps.rookie,a.caps.rookie,D.rules.rookieContractCap)}${item('Main contracts',b.counts.main||0,a.counts.main||0,28,'count')}${item('Field players',b.counts.field,a.counts.field,D.rules.maxFieldPlayers,'count')}<div class="trade-position-impact">${Object.entries(D.rules.positionMax).map(([pos,max])=>`<span class="${Number(a.counts[pos]||0)>Number(max)?'impact-bad':''}">${pos} <b>${b.counts[pos]||0} → ${a.counts[pos]||0}</b> / ${max}</span>`).join('')}${invalid?`<span class="impact-bad">Invalid field position <b>${invalid}</b></span>`:''}</div></article>`;
  }
  function tradeImpactTeamHtml(teamKey,beforeRows,afterRows){return rosterImpactTeamHtml(teamKey,beforeRows,afterRows,'After proposed trade');}
  function tradeImpactHtml(teamA,teamB,assetsA,assetsB,conditionalDelistsA=[],conditionalDelistsB=[]){
    if(!teamA||!teamB)return '<div class="notice">Choose both franchises to see the trade impact.</div>';
    const before=effectiveRosters(),after=effectiveRosters(tradeActionFor(teamA,teamB,assetsA,assetsB,conditionalDelistsA,conditionalDelistsB));
    return `<div class="trade-impact-grid">${tradeImpactTeamHtml(teamA,before[teamA]||[],after[teamA]||[])}${tradeImpactTeamHtml(teamB,before[teamB]||[],after[teamB]||[])}</div>`;
  }

  function tradeAssetPlayerRecord(teamKey,name){
    const canon=canonicalPlayerName(name),rows=effectiveRosters()[teamKey]||[],rec=rows.find(p=>canonicalPlayerName(p.player)===canon);
    if(rec)return rec;
    const pool=playerPoolRecord(name)||{};
    return name?{player:name,position:pool.position||'',salary:Number(pool.startPrice||pool.price||0),contract:'',status:'',contractEnd:'',club:pool.club||''}:null;
  }
  function tradeAssetPickRecord(ref,type='Pre-Season'){
    const x=decodePickRef(ref,type),ledger=draftPickLedger(x.type,{season:x.season}),rec=ledger.find(p=>p.id===x.id||p.pick===x.pick);
    return rec?{...rec,type:x.type,season:x.season}:{...x,round:x.round||Math.ceil(Number(x.pick||0)/Math.max(1,D.teams.length)),originalOwner:x.originalOwner||'',owner:x.owner||''};
  }
  function tradeVisualPlayerCard(teamKey,name){
    const rec=tradeAssetPlayerRecord(teamKey,name);if(!rec)return '';
    const t=team(teamKey),src=playerPhotoUrl(rec.player,rec.club),initials=String(rec.player||'').split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase(),positions=positionChoices(rec.position||'');
    return `<article class="trade-visual-player" style="--trade-accent:${esc(t.accent)}"><div class="trade-visual-headshot"><span>${esc(initials||t.code)}</span>${src?`<img src="${esc(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">`:''}</div><div class="trade-visual-copy"><div class="trade-visual-player-top"><strong>${esc(rec.player)}</strong><b>${money(rec.salary)}</b></div><div class="trade-visual-position-row">${(positions.length?positions:[rec.position||'—']).map(pos=>`<span>${esc(pos)}</span>`).join('')}</div><small>${[rec.contract,rec.status,rec.contractEnd?`Ends ${rec.contractEnd}`:''].filter(Boolean).map(esc).join(' · ')||'Current PEGS player'}</small></div></article>`;
  }
  function tradeVisualPickCard(teamKey,ref,type='Pre-Season'){
    const rec=tradeAssetPickRecord(ref,type),t=team(teamKey),origin=rec.originalOwner&&teamMap[rec.originalOwner]?team(rec.originalOwner).owner:'Original owner';
    return `<article class="trade-visual-pick" style="--trade-accent:${esc(t.accent)}"><div class="trade-pick-number"><span>R${Number(rec.round||0)}</span><strong>${Number(rec.pick||0)}</strong></div><div><span class="eyebrow">${esc(rec.season)} ${esc(rec.type)}</span><h4>PICK ${Number(rec.pick||0)}</h4><small>${esc(origin)}${rec.owner&&rec.originalOwner&&rec.owner!==rec.originalOwner?' · acquired pick':''}</small></div></article>`;
  }
  function tradeVisualDelistCard(teamKey,name){
    const rec=tradeAssetPlayerRecord(teamKey,name);if(!rec)return '';
    const t=team(teamKey),src=playerPhotoUrl(rec.player,rec.club),initials=String(rec.player||'').split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
    return `<article class="trade-visual-player trade-visual-delist" style="--trade-accent:${esc(t.accent)}"><div class="trade-visual-headshot"><span>${esc(initials||t.code)}</span>${src?`<img src="${esc(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">`:''}</div><div class="trade-visual-copy"><div class="trade-visual-player-top"><strong>${esc(rec.player)}</strong><b>− ${money(rec.salary)}</b></div><div class="trade-visual-position-row"><span>CONDITIONAL DELIST</span></div><small>Removed only if this trade is accepted and Commissioner-approved.</small></div></article>`;
  }
  function tradeVisualSide(teamKey,targetKey,assets,type='Pre-Season',conditionalDelists=[]){
    if(!teamKey)return '<div class="trade-visual-empty">Select a franchise.</div>';
    const t=team(teamKey),players=assets?.players||[],picks=assets?.picks||[],delists=(conditionalDelists||[]).filter(Boolean),cards=[...players.map(x=>tradeVisualPlayerCard(teamKey,x)),...picks.map(x=>tradeVisualPickCard(teamKey,x,type)),...delists.map(x=>tradeVisualDelistCard(teamKey,x))];
    const sum=rosterSummary(effectiveRosters()[teamKey]||[]),count=[players.length?`${players.length} player${players.length===1?'':'s'}`:'',picks.length?`${picks.length} pick${picks.length===1?'':'s'}`:'',delists.length?`${delists.length} delist${delists.length===1?'':'s'}`:''].filter(Boolean).join(' · ')||'No assets selected';
    return `<section class="trade-visual-side" style="--trade-accent:${esc(t.accent)}"><div class="trade-visual-side-head"><div class="trade-team-label large" style="--trade-accent:${esc(t.accent)}"><span class="trade-team-dot"></span><div><span class="eyebrow">Sends to ${esc(targetKey?team(targetKey).name:'trade partner')}</span><h3>${esc(t.name)}</h3><small>${esc(t.owner)}</small></div></div><span class="badge neutral">${esc(count)}</span></div><div class="trade-visual-cap-chips"><span>Main room ${compactMoney(D.rules.mainContractCap-sum.caps.main)}</span><span>Field room ${compactMoney(D.rules.fieldCap-sum.caps.field)}</span><span>Rookie room ${compactMoney(D.rules.rookieContractCap-sum.caps.rookie)}</span></div><div class="trade-visual-assets">${cards.join('')||'<div class="trade-visual-empty">Select players, draft picks or conditional delistings to preview them here.</div>'}</div></section>`;
  }
  function tradeVisualAssetsHtml(teamA,teamB,assetsA,assetsB,type='Pre-Season',conditionalDelistsA=[],conditionalDelistsB=[]){
    if(!teamA||!teamB)return '<div class="trade-visual-empty trade-visual-empty-wide">Choose a trade partner to open the visual trade board.</div>';
    return `<div class="trade-visual-board">${tradeVisualSide(teamA,teamB,assetsA,type,conditionalDelistsA)}<div class="trade-visual-swap">⇄</div>${tradeVisualSide(teamB,teamA,assetsB,type,conditionalDelistsB)}</div>`;
  }


  function elevationSeasonFor(phase='Pre-Season'){
    const normalized=normalizedDraftType(phase);return normalized==='Pre-Season'?draftSeasonFor('Pre-Season'):currentSeason();
  }
  function actionSeason(action){
    const explicit=Number(action?.season||action?.draftSeason||0);if(explicit)return explicit;
    const year=Number(String(action?.timestamp||'').slice(0,4));return year||currentSeason();
  }
  function rookieElevationsUsed(teamKey,season=currentSeason()){
    const isElevation=x=>['ROOKIE UPGRADE','ROOKIE ELEVATION'].includes(String(x?.type||'').toUpperCase());
    const legacy=visibleLegacyTransactions().filter(x=>isElevation(x)&&String(x.team||'').toUpperCase()===String(teamKey||'').toUpperCase()&&actionSeason(x)===Number(season)).length;
    const live=getCommissionerActions().filter(x=>x.status==='CONFIRMED'&&isElevation(x)&&String(x.team||'').toUpperCase()===String(teamKey||'').toUpperCase()&&actionSeason(x)===Number(season)).length;
    return legacy+live;
  }
  async function fetchRookieElevationQuote(player){
    if(!backendConfigured()||!teamLoggedIn())throw new Error('Team Login required.');
    const fn=CONFIG.liveScoreFunction||'supercoach-sync',base=CONFIG.supabaseUrl.replace(/\/$/,'')+`/functions/v1/${fn}`,headers={apikey:CONFIG.supabaseAnonKey,Authorization:'Bearer '+backendToken()};
    const r=await fetch(`${base}?mode=elevation-quote&player=${encodeURIComponent(player)}`,{headers});
    if(!r.ok){let msg='Could not retrieve the current SuperCoach elevation price.';try{const x=await r.json();msg=x.error||msg;}catch(_){msg=await r.text()||msg;}throw new Error(msg);}
    return await r.json();
  }

  function activeProposalStatus(status){return ['PENDING','AWAITING_COUNTERPARTY','AWAITING_COMMISSIONER'].includes(String(status||'').toUpperCase());}
  function draftPoolRecord(){
    if(draftPoolCache)return draftPoolCache;
    try{return JSON.parse(localStorage.getItem(DRAFT_POOL_KEY)||'null');}catch(_){return null;}
  }
  async function loadDraftPool(sessionId=''){
    if(!backendConfigured())return draftPoolRecord();
    try{
      const state=getDraftState(),wanted=sessionId||state.poolSessionId||'';
      let path='/rest/v1/pegs_draft_pools?select=*&order=captured_at.desc&limit=1';
      if(wanted)path='/rest/v1/pegs_draft_pools?select=*&session_id=eq.'+encodeURIComponent(wanted)+'&limit=1';
      const rows=await backendFetch(path);draftPoolCache=rows?.[0]||null;if(draftPoolCache)localStorage.setItem(DRAFT_POOL_KEY,JSON.stringify(draftPoolCache));return draftPoolCache;
    }catch(e){console.warn('Draft pool unavailable',e);return draftPoolRecord();}
  }
  function frozenDraftPlayers(){
    const state=getDraftState(),pool=draftPoolRecord();
    if(state.active)return pool&&pool.complete&&(!state.poolSessionId||pool.session_id===state.poolSessionId)?(pool.players||[]):[];
    return pool?.complete?(pool.players||[]):D.playerPool;
  }
  function draftPlayerByName(name){return frozenDraftPlayers().find(p=>canonicalPlayerName(p.player)===canonicalPlayerName(name))||null;}
  async function refreshCurrentDraftPool(type,onProgress=()=>{}){
    if(!commissionerLoggedIn())throw new Error('Commissioner login required.');
    const fn=CONFIG.liveScoreFunction||'supercoach-sync',base=CONFIG.supabaseUrl.replace(/\/$/,'')+`/functions/v1/${fn}`,headers={apikey:CONFIG.supabaseAnonKey,Authorization:'Bearer '+await commissionerAccessToken()};
    const all=[],clubResults=[];
    for(let i=0;i<AFL_TEAMS.length;i++){
      const [code]=AFL_TEAMS[i];onProgress(i,code);
      const r=await fetch(`${base}?mode=pool&team=${encodeURIComponent(code)}`,{headers});if(!r.ok)throw new Error(`${code} player pool failed: ${await r.text()}`);const x=await r.json();const rows=Array.isArray(x.players)?x.players:[];clubResults.push({club:code,count:rows.length});all.push(...rows);
    }
    const rostered=new Set(Object.values(effectiveRosters()).flat().map(p=>canonicalPlayerName(p.player))),seen=new Set(),players=[];
    for(const p of all){const key=canonicalPlayerName(p.player);if(!key||seen.has(key)||rostered.has(key)||!Number(p.price||0)||!p.position)continue;seen.add(key);players.push({player:p.player,club:p.club,position:String(p.position).toUpperCase(),price:Number(p.price),startPrice:Number(p.price),average:Number(p.average||0),source:'Supercoach.live'});}
    players.sort((a,b)=>a.player.localeCompare(b.player));
    const phase=normalizedDraftType(type),season=draftSeasonFor(phase),sessionId=`pool-${season}-${phase.toLowerCase().replace(/[^a-z]+/g,'-')}-${Date.now()}`,complete=clubResults.length===18&&clubResults.every(x=>x.count>=35);
    const rec={session_id:sessionId,season,phase,captured_at:new Date().toISOString(),source:'Supercoach.live current-price snapshot',complete,club_count:clubResults.length,player_count:players.length,players};
    const created=await commissionerFetch('/rest/v1/pegs_draft_pools',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(rec)});draftPoolCache=created?.[0]||rec;localStorage.setItem(DRAFT_POOL_KEY,JSON.stringify(draftPoolCache));onProgress(18,'DONE');return draftPoolCache;
  }
  function draftPoolStatusHtml(type){
    const p=draftPoolRecord(),phase=normalizedDraftType(type),season=draftSeasonFor(phase),match=p&&p.complete&&Number(p.season)===season&&normalizedDraftType(p.phase)===phase;
    if(!match)return `<div class="notice danger"><strong>No complete ${esc(phase)} draft pool.</strong> Refresh all 18 AFL clubs immediately before starting the draft. PEGS will freeze current prices and remove every player already on a PEGS list.</div>`;
    return `<div class="notice"><strong>Frozen draft pool ready:</strong> ${p.player_count||p.players?.length||0} unrostered AFL players · 18/18 clubs · captured ${fmtDate(p.captured_at)}. Prices will not change once the draft starts.</div>`;
  }

  async function syncServerAuthority(){
    if(!backendConfigured()||!commissionerLoggedIn())return;
    const rosters=effectiveRosters();
    const rawPicks=[...draftPickLedger('Pre-Season'),...draftPickLedger('Mid-Season')];
    const pickMap=new Map();
    for(const p of rawPicks){const id=String(p?.id||'').trim();if(id)pickMap.set(id,p);}
    const picks=[...pickMap.values()];
    try{
      await commissionerFetch('/rest/v1/rpc/pegs_sync_roster_authority',{method:'POST',body:JSON.stringify({p_rosters:rosters})});
    }catch(e){throw new Error(`Roster authority sync failed: ${e.message||e}`);}
    try{
      await commissionerFetch('/rest/v1/rpc/pegs_sync_pick_authority',{method:'POST',body:JSON.stringify({p_picks:picks})});
    }catch(e){throw new Error(`Draft-pick authority sync failed: ${e.message||e}`);}
  }
  async function logCommissioner(action,entityType='',entityId='',detail={}){if(!commissionerLoggedIn())return;try{await commissionerFetch('/rest/v1/rpc/pegs_log_commissioner_action',{method:'POST',body:JSON.stringify({p_action:action,p_entity_type:entityType,p_entity_id:String(entityId||''),p_detail:detail||{}})});}catch(e){console.warn('Audit log write failed',e);}}

  async function teamAccountAdmin(action,teamKey=''){
    if(!commissionerLoggedIn())throw new Error('Commissioner login required.');
    const fn=CONFIG.teamAccountFunction||'team-account-admin',r=await fetch(CONFIG.supabaseUrl.replace(/\/$/,'')+`/functions/v1/${fn}`,{method:'POST',headers:{apikey:CONFIG.supabaseAnonKey,Authorization:'Bearer '+await commissionerAccessToken(),'Content-Type':'application/json'},body:JSON.stringify({action,teamKey})});
    if(!r.ok)throw new Error((await r.text())||'Team account operation failed');return await r.json();
  }
  async function loadTeamAccounts(){try{const x=await teamAccountAdmin('list');teamAccountsCache=x.accounts||[];}catch(e){console.warn(e);teamAccountsCache=[];}return teamAccountsCache;}
  function credentialsTable(credentials){if(!credentials?.length)return '<div class="notice">No new passwords were generated.</div>';return `<div class="credential-sheet" id="credential-sheet"><div class="credential-head"><span>Coach</span><span>Username</span><span>6-letter password</span></div>${credentials.map(c=>`<div><strong>${esc(c.coachName)}</strong><span>${esc(c.username)}</span><code>${esc(c.password)}</code></div>`).join('')}</div><div class="notice danger"><strong>Copy these now.</strong> Passwords are not stored in PEGS and cannot be displayed again; you can reset a team later.</div>`;}

  function backupDerivedData(){
    return {meta:{league:D.meta.league,season:currentSeason(),round:effectiveCurrentRound(),createdAt:new Date().toISOString()},rules:D.rules,teams:D.teams,rosters:effectiveRosters(),ladder:effectiveLadder(),fixtures:effectiveFixtures(),finals:effectiveFinals(),transactions:[...getCommissionerActions().filter(x=>x.status==='CONFIRMED'),...visibleLegacyTransactions()],draftHistory:[...D.draft.filter(d=>!Object.keys(getTransactionReversals()).map(k=>LEGACY_TRANSACTION_META[k]).filter(m=>m?.type==='Drafted'&&m.pick).some(m=>Number(m.pick)===Number(d.pick)&&m.team===d.team&&canonicalPlayerName(m.players?.[0]||'')===canonicalPlayerName(d.player))),...getCommissionerActions().filter(x=>x.type==='Drafted'&&x.status==='CONFIRMED')],pickOwnership:{preSeason:draftPickLedger('Pre-Season'),midSeason:draftPickLedger('Mid-Season')},honours:D.honours};
  }
  async function syncBackups(){if(!commissionerLoggedIn())return [];try{backupCache=await commissionerFetch('/rest/v1/pegs_backups?select=id,created_at,season,round,label,reason&order=created_at.desc&limit=100')||[];}catch(e){console.warn(e);backupCache=[];}return backupCache;}
  async function createServerBackup(reason='MANUAL',label=''){const id=await commissionerFetch('/rest/v1/rpc/pegs_create_backup',{method:'POST',body:JSON.stringify({p_label:label,p_reason:reason,p_derived:backupDerivedData()})});await syncBackups();return id;}
  async function getBackupSnapshot(id){const rows=await commissionerFetch('/rest/v1/pegs_backups?select=*&id=eq.'+encodeURIComponent(id)+'&limit=1');if(!rows?.[0])throw new Error('Backup not found.');return rows[0];}
  function downloadBlob(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);}
  async function exportBackupJson(id){const rec=await getBackupSnapshot(id);downloadBlob(`PEGS-Backup-${rec.season||currentSeason()}-R${rec.round||0}-${id}.json`,new Blob([JSON.stringify(rec.snapshot,null,2)],{type:'application/json'}));}
  async function ensureSheetJs(){if(globalThis.XLSX)return globalThis.XLSX;await new Promise((resolve,reject)=>{const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';sc.onload=resolve;sc.onerror=()=>reject(new Error('Excel library could not be loaded.'));document.head.appendChild(sc);});return globalThis.XLSX;}
  function backupSheetRows(snapshot){
    const d=snapshot?.derived||{},state=snapshot?.state||{},results=state.season_results||{},season=String(d.meta?.season||state.season_setup?.season||currentSeason()),seasonResults=results?.[season]||{};
    const teamLists=[];for(const [k,rows] of Object.entries(d.rosters||{}))for(const p of rows||[])teamLists.push({Team:team(k).name,Coach:team(k).owner,Player:p.player,AFLClub:p.club,Position:p.position,Contract:p.contract,Salary:Number(p.salary||0),ContractEnd:p.contractEnd,ListLocation:p.status});
    const roundResults=[],playerScores=[];for(const [round,rr] of Object.entries(seasonResults)){for(const [k,score] of Object.entries(rr.teamScores||{}))roundResults.push({Round:Number(round),Team:team(k).name,Coach:team(k).owner,Score:Number(score||0),TopPlayers:Number(rr.topPlayers||0),FinalizedAt:rr.finalizedAt||''});for(const [k,ps] of Object.entries(rr.players||{}))for(const p of ps||[])playerScores.push({Round:Number(round),Team:team(k).name,Player:p.player,Position:p.position,AFLClub:p.club,Score:Number(p.score||0),Source:p.scoreSource||''});}
    const bank=state.opening_bank?.[season]?.players||{},opening=Object.values(bank).map(p=>({Player:p.player,AFLClub:p.club,OpeningRoundScore:Number(p.actual||0),Source:p.source||''}));
    const auditLog=(snapshot?.auditLog||[]).map(a=>({ID:a.id,CreatedAt:a.created_at,ActorRole:a.actor_role,ActorTeam:a.actor_team,Action:a.action,EntityType:a.entity_type,EntityID:a.entity_id,Detail:JSON.stringify(a.detail||{})}));
    return {summary:[{League:d.meta?.league||D.meta.league,Season:d.meta?.season||season,Round:d.meta?.round||'',CreatedAt:snapshot?.createdAt||''}],teamLists,ladder:d.ladder||[],roundResults,playerScores,transactions:d.transactions||[],draftHistory:d.draftHistory||[],pickOwnership:[...(d.pickOwnership?.preSeason||[]),...(d.pickOwnership?.midSeason||[])],opening,finals:d.finals||[],seasonSettings:[state.season_setup||{}],auditLog};
  }
  async function exportBackupExcel(id){const rec=await getBackupSnapshot(id),X=await ensureSheetJs(),rows=backupSheetRows(rec.snapshot),wb=X.utils.book_new(),add=(name,data)=>X.utils.book_append_sheet(wb,X.utils.json_to_sheet(data?.length?data:[{Info:'No records'}]),name);add('League Summary',rows.summary);add('Team Lists',rows.teamLists);add('Ladder',rows.ladder);add('Round Results',rows.roundResults);add('Player Scores',rows.playerScores);add('Transactions',rows.transactions);add('Draft History',rows.draftHistory);add('Draft Pick Ownership',rows.pickOwnership);add('Opening Round Banking',rows.opening);add('Finals',rows.finals);add('Season Settings',rows.seasonSettings);add('Audit Log',rows.auditLog);X.writeFile(wb,`PEGS-Backup-${rec.season||currentSeason()}-R${rec.round||0}-${id}.xlsx`);}
  async function restoreServerBackup(id){if(!commissionerLoggedIn())throw new Error('Commissioner login required.');const typed=prompt(`Restore backup #${id}? PEGS will first create an emergency copy of the current state. Type RESTORE to continue.`);if(typed!=='RESTORE')return false;await commissionerFetch('/rest/v1/rpc/pegs_restore_backup',{method:'POST',body:JSON.stringify({p_backup_id:Number(id)})});[OVERRIDE_KEY,SELECTION_OVERRIDE_KEY,COMM_ACTIONS_KEY,TRANSACTION_REVERSALS_KEY,DRAFT_STATE_KEY,SEASON_SETUP_KEY,SEASON_RESULTS_KEY,LIVE_FEED_KEY,OPENING_BANK_KEY,PROPOSAL_WINDOWS_KEY,SCORING_SNAPSHOTS_KEY,FIGUREHEAD_OVERRIDE_KEY,DRAFT_POOL_KEY].forEach(k=>localStorage.removeItem(k));draftPoolCache=null;proposalCache=[];await pullSharedState();await syncProposals();await loadDraftPool();await syncBackups();await syncServerAuthority();return true;}
  async function syncAudit(){if(!commissionerLoggedIn())return [];try{auditCache=await commissionerFetch('/rest/v1/pegs_audit_log?select=*&order=created_at.desc&limit=100')||[];}catch(e){auditCache=[];}return auditCache;}

  function validPegsPosition(value){return Object.prototype.hasOwnProperty.call(D.rules.positionMax,String(value||'').trim().toUpperCase());}
  function positionChoices(value){return [...new Set(String(value||'').toUpperCase().split('/').map(x=>x.trim()).filter(validPegsPosition))];}
  function rosterSummary(rows){
    const main=Math.round(rows.filter(x=>String(x.contract).toLowerCase()==='main').reduce((s,x)=>s+Number(x.salary||0),0));
    const field=Math.round(rows.filter(x=>String(x.status).toLowerCase()==='field').reduce((s,x)=>s+Number(x.salary||0),0));
    const rookie=Math.round(rows.filter(x=>String(x.contract).toLowerCase()==='rookie').reduce((s,x)=>s+Number(x.salary||0),0));
    const fieldRows=rows.filter(x=>String(x.status).toLowerCase()==='field');
    const counts={main:rows.filter(x=>String(x.contract).toLowerCase()==='main').length,field:fieldRows.length,interchange:rows.filter(x=>String(x.status).toLowerCase()==='interchange').length,invalidFieldPositions:fieldRows.filter(x=>!validPegsPosition(x.position)).length};
    for(const pos of Object.keys(D.rules.positionMax)) counts[pos]=fieldRows.filter(x=>String(x.position||'').toUpperCase()===pos).length;
    return {caps:{main,field,rookie},counts};
  }
  function rosterIsLegal(rows){const x=rosterSummary(rows);return x.caps.main<=D.rules.mainContractCap&&x.caps.field<=D.rules.fieldCap&&x.caps.rookie<=D.rules.rookieContractCap&&x.counts.main<=28&&x.counts.field<=D.rules.maxFieldPlayers&&x.counts.invalidFieldPositions===0&&Object.entries(D.rules.positionMax).every(([p,m])=>(x.counts[p]||0)<=m);}
  function applyLegacyTransactionInverse(out,meta){
    const inv=meta?.inverse||{};
    if(inv.kind==='REMOVE_PLAYER'){
      out[inv.team]=(out[inv.team]||[]).filter(p=>canonicalPlayerName(p.player)!==canonicalPlayerName(inv.player));
    }else if(inv.kind==='RESTORE_PLAYER'&&inv.record){
      const rows=out[inv.team]||(out[inv.team]=[]),exists=Object.values(out).flat().some(p=>canonicalPlayerName(p.player)===canonicalPlayerName(inv.record.player));
      if(!exists)rows.push({...inv.record});
    }else if(inv.kind==='UNDO_SWAP'){
      const rows=out[inv.team]||[],pin=rows.find(p=>canonicalPlayerName(p.player)===canonicalPlayerName(inv.playerIn)),pout=rows.find(p=>canonicalPlayerName(p.player)===canonicalPlayerName(inv.playerOut));
      if(pin)pin.status='Interchange';if(pout)pout.status='Field';
    }else if(inv.kind==='UNDO_ELEVATION'){
      const rows=out[inv.team]||[],rec=rows.find(p=>canonicalPlayerName(p.player)===canonicalPlayerName(inv.player));if(rec){rec.contract=inv.contract||'Rookie';rec.salary=Number(inv.salary||rec.salary||0);if(inv.contractEnd)rec.contractEnd=Number(inv.contractEnd);if(inv.position)rec.position=inv.position;if(inv.status)rec.status=inv.status;if(inv.club&&!rec.club)rec.club=inv.club;}
    }else if(inv.kind==='UNDO_TRADE'){
      for(const move of inv.moves||[]){const from=out[move.from]||[],idx=from.findIndex(p=>canonicalPlayerName(p.player)===canonicalPlayerName(move.player));if(idx>=0){const [rec]=from.splice(idx,1);(out[move.to]||(out[move.to]=[])).push(rec);}}
    }
  }
  function effectiveRosters(extraAction=null){
    const out={}; for(const [k,rows] of Object.entries(D.rosters)) out[k]=rows.map(x=>({...x}));
    const reversed=getTransactionReversals();Object.keys(reversed).filter(k=>LEGACY_TRANSACTION_META[k]).map(k=>LEGACY_TRANSACTION_META[k]).sort((a,b)=>String(b.timestamp||'').localeCompare(String(a.timestamp||''))).forEach(meta=>applyLegacyTransactionInverse(out,meta));
    const actions=[...getCommissionerActions(),...(extraAction?[extraAction]:[])].filter(x=>x.status==='CONFIRMED');
    for(const a of actions){
      if(a.type==='Trade'){
        for(const move of a.moves||[]){const from=out[move.from]||[];const idx=from.findIndex(p=>p.player===move.player);if(idx>=0){const [rec]=from.splice(idx,1);(out[move.to]||(out[move.to]=[])).push(rec);}}
        for(const [teamKey,names] of Object.entries(a.conditionalDelists||{})){const remove=new Set((names||[]).filter(Boolean));if(remove.size)out[teamKey]=(out[teamKey]||[]).filter(p=>!remove.has(p.player));}
      } else if(a.type==='Rookie swap'){
        const rows=out[a.team]||[]; const pin=rows.find(p=>p.player===a.playerIn); const pout=rows.find(p=>p.player===a.playerOut); if(pin){pin.status='Field';if(a.playerInPosition)pin.position=String(a.playerInPosition).toUpperCase();} if(pout) pout.status='Interchange';
      } else if(a.type==='Rookie elevation' && a.team && a.player){
        const rows=out[a.team]||[];const rec=rows.find(p=>p.player===a.player);if(rec){rec.contract='Main';rec.salary=Number(a.newSalary||rec.salary||0);rec.position=String(a.newPosition||rec.position||'').toUpperCase();if(a.contractEnd)rec.contractEnd=Number(a.contractEnd);}
      } else if(a.type==='Drafted' && a.team && a.player){
        const rows=out[a.team]||(out[a.team]=[]); if(!rows.some(p=>p.player===a.player)) rows.push({player:a.player,contract:a.contract||'Main',salary:Number(a.salary||0),position:a.position||'',status:a.listStatus||'Field',contractEnd:a.contractEnd||D.meta.season+2,club:a.club||''});
      } else if(a.type==='Delisted' && a.team){
        const names=new Set((a.players||[a.player]).filter(Boolean));
        if(names.size) out[a.team]=(out[a.team]||[]).filter(p=>!names.has(p.player));
      }
    }
    return out;
  }
  function effectiveTeam(key){const base=team(key);const rows=effectiveRosters()[base.key]||[];const sum=rosterSummary(rows);return {...base,...sum};}

  function overrideId(round, teamKey, player) {
    return `${round}|${teamKey}|${player}`;
  }

  function scoreOverride(round, teamKey, player) {
    const all = getOverrides();
    const id = overrideId(round, teamKey, player);
    return Object.prototype.hasOwnProperty.call(all, id) ? Number(all[id]) : undefined;
  }

  function scoreCountForRoundRecord(rec){
    const playing=Number(rec?.aflTeamsPlaying||D.meta.topPlayersDefault||18);
    const banked=[...new Set((rec?.bankClubs||[]).map(normalizeAflCode).filter(Boolean))].length;
    // An OR banked club contributes one available score slot in addition to
    // the clubs physically playing that round. There are only 18 AFL clubs.
    return Math.min(18,Math.max(0,playing)+banked);
  }
  function topPlayersForRound(round) {
    return scoreCountForRoundRecord(effectiveRoundRecord(round));
  }
  function futureScoringRound(round){
    const setup=activeSeasonSetup();
    return Boolean(setup)&&!roundFinalized(round)&&Number(round)>Number(setup.currentRound||effectiveCurrentRound()||1);
  }
  function roundContext(round){
    const rec=effectiveRoundRecord(round),banks=rec.bankClubs||[],byes=rec.byeClubs||[],count=topPlayersForRound(round);
    if(banks.length) return `${rec.aflTeamsPlaying} AFL clubs play and ${banks.length} Opening Round club${banks.length===1?' is':'s are'} banked, so the top ${count} PEGS Field scores count.`;
    if(byes.length) return `${rec.aflTeamsPlaying} AFL clubs play. Byes: ${byes.join(', ')}. The top ${count} PEGS Field scores count.`;
    return `All ${rec.aflTeamsPlaying} AFL clubs are playing, so the top ${count} PEGS Field scores count.`;
  }

  function teamRoundPlayers(round, teamKey) {
    const finalized=roundFinalized(round);
    if(finalized?.players?.[teamKey]) return finalized.players[teamKey].map(p=>({...p,scoreSource:p.scoreSource||'Finalised round'}));
    const usingNewSeason=Boolean(activeSeasonSetup()&&currentSeason()!==Number(D.meta.season));
    const legacy=(D.roundScores[String(round)]?.[teamKey]||[]).filter(p=>p.status==='Field');
    const hasScoringChanges=scoringActionsForRound(round).some(a=>scoringActionTouchesTeam(a,teamKey));
    const future=futureScoringRound(round);
    // Future PEGS rounds are roster previews only. The workbook contains later-
    // round historical scores, but those must never leak into a round that has
    // not opened yet. We still use the locked trade-aware roster so approved
    // moves are visible before the round starts, while actual scores stay at 0.
    if(future){
      return (scoringRostersForRound(round)[teamKey]||[]).filter(p=>p.status==='Field').map(p=>({
        ...p,
        player:p.player,position:p.position,status:'Field',score:0,projected:Number(baselineProjection(p.player,0)),club:p.club||'',scoreSource:'Future round roster preview'
      }));
    }
    // Imported workbook rounds remain the source of truth until a roster action
    // applies to that scoring period. Once a trade/swap/delist/elevation applies,
    // membership comes from the locked scoring roster instead of the old workbook
    // team list. Historical scores are then re-attached by player name so a traded
    // player's Round score follows the player to the receiving franchise.
    if(!usingNewSeason&&legacy.length&&!hasScoringChanges)return legacy;
    return (scoringRostersForRound(round)[teamKey]||[]).filter(p=>p.status==='Field').map(p=>{
      const historical=!usingNewSeason?legacyRoundPlayer(round,p.player):null;
      return {
        ...p,
        player:p.player,position:p.position,status:'Field',score:Number(historical?.score||0),projected:Number(historical?.projected??baselineProjection(p.player,0)),club:p.club||historical?.club||'',
        scoreSource:historical?'Workbook result · roster adjusted':(scoringSnapshotForRound(round)?`${scoringSnapshotForRound(round).stage} scoring lock`:'Season roster')
      };
    });
  }
  function normalizeAvailabilityStatus(value){
    const raw=String(value||'TBC').trim().toUpperCase();
    const compact=raw.replace(/[\s_-]+/g,'');
    if(compact==='PLAYINGNEXTROUND'||compact==='SELECTED'||compact==='PLAYING')return 'SELECTED';
    if(compact==='NOTPLAYINGNEXTROUND'||compact==='NOTSELECTED'||compact==='OUT')return 'OUT';
    if(compact==='EMERGENCY'||compact==='EMERGENCYNEXTROUND')return 'EMERGENCY';
    if(compact==='INJURED'||compact==='INJURY'||compact.includes('INJUR'))return 'INJURED';
    if(compact==='BYE')return 'BYE';
    if(compact==='BANKED')return 'BANKED';
    if(compact==='OVERRIDE')return 'OVERRIDE';
    if(compact==='FT')return 'FT';
    if(compact==='LIVE')return 'LIVE';
    return raw||'TBC';
  }
  function unavailableForProjection(status){
    return ['OUT','NOT_SELECTED','NOTPLAYINGNEXTROUND','EMERGENCY','INJURED','BYE'].includes(normalizeAvailabilityStatus(status));
  }
  function mergeProviderTeamRecord(matchRec={},teamRec={}){
    return {...matchRec,...teamRec,
      status:normalizeAvailabilityStatus(teamRec.status||matchRec.status||'TBC'),
      actual:matchRec.actual===null||matchRec.actual===undefined?(teamRec.actual??null):matchRec.actual,
      gameStatus:String(matchRec.gameStatus||teamRec.gameStatus||'PRE').toUpperCase(),
      source:matchRec.source||teamRec.source||'Supercoach.live'
    };
  }
  function liveFeedCompleteForRound(round){
    const feed=getLiveFeed(),same=Number(feed.season)===currentSeason()&&Number(feed.round)===Number(round),expected=Number(feed.expectedGameCount||0),matched=Number(feed.matchedGameCount||feed.games?.length||0),completed=Number(feed.completedGameCount||0);
    return Boolean(same&&expected>0&&matched>=expected&&completed>=expected);
  }
  function availabilityInfo(p,round,teamKey){
    const over=scoreOverride(round,teamKey,p.player); if(over!==undefined)return {status:'OVERRIDE',gameStatus:'FT',source:'Commissioner score correction',projection:Number(over),actual:Number(over)};
    const finalized=roundFinalized(round); if(finalized)return {status:'FT',gameStatus:'FT',source:'Finalised',projection:Number(p.score||0),actual:Number(p.score||0)};
    if(futureScoringRound(round))return {status:'TBC',gameStatus:'PRE',source:'Future round - scoring locked',projection:Number(p.projected||baselineProjection(p.player,0)),actual:null};
    if(p.scoreSource==='Workbook result · roster adjusted')return {status:'FT',gameStatus:'FT',source:p.scoreSource,projection:Number(p.projected||p.score||0),actual:Number(p.score||0)};
    if(!activeSeasonSetup() && !teamLoggedIn() && currentSeason()===Number(D.meta.season) && D.roundScores[String(round)]?.[teamKey]) return {status:'FT',gameStatus:'FT',source:p.scoreSource||'Workbook result',projection:Number(p.projected||p.score||0),actual:Number(p.score||0)};
    if(p.scoreSource==='Opening Round banked')return {status:'BANKED',gameStatus:'FT',source:'OR bank',projection:Number(p.score||0),actual:Number(p.score||0)};
    const roundRec=effectiveRoundRecord(round),clubCode=normalizeAflCode(p.club),bankApplies=(roundRec.bankClubs||[]).includes(clubCode),onBye=(roundRec.byeClubs||[]).includes(clubCode);
    if(bankApplies){const bank=getOpeningBank()?.[String(currentSeason())]?.players?.[canonicalPlayerName(p.player)];if(bank&&bank.actual!==null&&bank.actual!==undefined)return {status:'BANKED',gameStatus:'FT',source:'Opening Round bank',projection:Number(bank.actual||0),actual:Number(bank.actual||0)};return {status:'BYE',gameStatus:'PRE',source:'AFL bye - no Opening Round score',projection:0,actual:null};}
    if(onBye)return {status:'BYE',gameStatus:'PRE',source:'AFL bye',projection:0,actual:null};
    const feed=getLiveFeed(),liveRound=Number(feed.season)===currentSeason()&&Number(feed.round)===Number(round),feedComplete=liveFeedCompleteForRound(round),rec=liveRound?feed.players?.[canonicalPlayerName(p.player)]:null;
    const statusOverride=selectionOverride(round,teamKey,p.player);
    if(statusOverride==='OUT')return {status:'OUT',gameStatus:feedComplete?'FT':'PRE',source:'Commissioner selection override',projection:0,actual:feedComplete?0:null};
    if(statusOverride==='SELECTED'){
      if(feedComplete&&!rec)return {status:'OUT',gameStatus:'FT',source:'Complete round feed - did not play',projection:0,actual:0,updatedAt:feed.updatedAt};
      return {status:'SELECTED',gameStatus:String(rec?.gameStatus||'PRE').toUpperCase(),source:'Commissioner selection override',projection:Number(rec?.projection??p.projected??baselineProjection(p.player,0)),actual:rec?.actual===null||rec?.actual===undefined?null:Number(rec.actual),updatedAt:rec?.updatedAt||feed.updatedAt};
    }
    if(!rec){
      if(feedComplete)return {status:'OUT',gameStatus:'FT',source:'Complete round feed - did not play',projection:0,actual:0,updatedAt:feed.updatedAt};
      return {status:'TBC',gameStatus:'PRE',source:'Projection',projection:Number(p.projected||baselineProjection(p.player,0)),actual:null};
    }
    const providerStatus=normalizeAvailabilityStatus(rec.status||'TBC');
    const providerProjection=unavailableForProjection(providerStatus)?0:Number(rec.projection??p.projected??baselineProjection(p.player,0));
    return {status:providerStatus,gameStatus:String(rec.gameStatus||'PRE').toUpperCase(),source:rec.source||feed.source||'Live feed',projection:providerProjection,actual:rec.actual===null||rec.actual===undefined?null:Number(rec.actual),updatedAt:rec.updatedAt||feed.updatedAt};
  }
  function calcTeamRound(round, teamKey) {
    const topN=topPlayersForRound(round);
    const players=teamRoundPlayers(round,teamKey).map(p=>{
      const info=availabilityInfo(p,round,teamKey); let score=0,played=false,liveValue=Number(info.projection||0),status=info.status;
      if(info.status==='BANKED'||info.status==='OVERRIDE'||info.gameStatus==='FT'){
        score=Number(info.actual??p.score??0); played=score>0||info.status==='BANKED'||info.status==='OVERRIDE'; liveValue=score;
      } else if(info.gameStatus==='LIVE'&&Number(info.actual||0)>0){
        // A positive live score is proof the player has taken the field, even if a
        // stale team-list marker still says emergency/out.
        score=Number(info.actual||0); played=true; liveValue=Math.max(score,Number(info.projection||0)); status='LIVE';
      } else if(unavailableForProjection(info.status)){
        score=0; played=false; liveValue=0;
      } else if(info.gameStatus==='LIVE'){
        score=Number(info.actual||0); played=score>0; liveValue=Math.max(score,Number(info.projection||0));
      } else if(Number(p.score||0)>0 && currentSeason()===Number(D.meta.season) && !activeSeasonSetup() && !teamLoggedIn()){
        score=Number(p.score||0); played=true; liveValue=score; status='FT';
      }
      return {...p,score,played,liveValue,availability:status,gameStatus:info.gameStatus,feedSource:info.source,feedProjection:Number(info.projection||0)};
    });
    const actualRank=[...players].sort((a,b)=>b.score-a.score||b.liveValue-a.liveValue),actualCounted=new Set(actualRank.slice(0,topN).map(p=>p.player));
    const liveRank=[...players].sort((a,b)=>b.liveValue-a.liveValue||b.score-a.score),liveCounted=new Set(liveRank.slice(0,topN).map(p=>p.player));
    const actual=actualRank.slice(0,topN).reduce((s,p)=>s+p.score,0),projected=liveRank.slice(0,topN).reduce((s,p)=>s+p.liveValue,0);
    const preRoundProjection=[...players].map(p=>({...p,effectiveFeedProjection:unavailableForProjection(p.availability)?0:p.feedProjection})).sort((a,b)=>b.effectiveFeedProjection-a.effectiveFeedProjection).slice(0,topN).reduce((s,p)=>s+p.effectiveFeedProjection,0);
    return {players,actual:Math.round(actual),projected:Math.round(projected),preRoundProjection:Math.round(preRoundProjection),actualCounted,liveCounted,topN};
  }

  function winProbability(homeProjected, awayProjected) {
    const diff = Number(homeProjected) - Number(awayProjected);
    const p = 1 / (1 + Math.exp(-diff / 115));
    return Math.max(5, Math.min(95, Math.round(p * 100)));
  }

  function highestRoundScore() {
    let best = { score: 0, team: '', round: 0 };
    Object.entries(D.roundTotals).forEach(([round, totals]) => {
      Object.entries(totals).forEach(([teamKey, score]) => {
        if (Number(score) > best.score) best = { score: Number(score), team: teamKey, round: Number(round) };
      });
    });
    return best;
  }

  function latestFinal() {
    const finals=effectiveFinals(); return finals[finals.length - 1] || null;
  }

  function pageHeader(eyebrow, title, sub, extra = '') {
    return `<div class="page-head"><div><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(title)}</h1><p>${esc(sub)}</p></div>${extra}</div>`;
  }

  function capMeter(label, value, cap) {
    const used = Number(value || 0), limit = Number(cap || 1);
    const rawPct = Math.max(0, used / limit * 100);
    const pct = Math.min(100, rawPct);
    const legal = used <= limit;
    const meter = legal ? '#59ca65' : '#e32636';
    return `<div class="cap-row ${legal?'cap-legal':'cap-illegal'}"><div class="cap-label"><span>${esc(label)}</span><strong>${compactMoney(value)} / ${compactMoney(cap)}</strong></div><div class="meter" aria-label="${esc(label)} ${rawPct.toFixed(1)} percent used · ${legal?'legal':'illegal'}"><span style="--pct:${pct.toFixed(1)}%;--meter:${meter}"></span></div></div>`;
  }

  function routeTo(route) {
    clearInteractionDraft();
    location.hash = route.startsWith('#') ? route : '#' + route;
  }

  function currentRoute() {
    const raw = (location.hash || '#home').slice(1);
    const path = raw.split('?')[0];
    const [page, ...parts] = path.split('/');
    return { page: page || 'home', parts };
  }

  function setNavState(page) {
    const base = page === 'team' ? 'teams' : page;
    document.querySelectorAll('[data-route]').forEach(btn => {
      const active = btn.dataset.route === base;
      if (active) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
    });
  }

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  function projectedLadderForRound(round){
    const base=effectiveLadder().map(r=>({...r})),setup=activeSeasonSetup(),regular=Number(setup?.pegsRegularRounds||20);
    if(Number(round)>regular||roundFinalized(round))return base;
    const byTeam=Object.fromEntries(base.map(r=>[r.team,r]));
    const fixtures=effectiveFixtures().filter(f=>Number(f.round)===Number(round)&&Number(f.round)<=regular&&f.away&&!f.finalType);
    for(const f of fixtures){
      const h=byTeam[f.home],a=byTeam[f.away]; if(!h||!a)continue;
      const hc=calcTeamRound(round,f.home),ac=calcTeamRound(round,f.away),hs=Number(hc.projected||0),as=Number(ac.projected||0);
      h.played++;a.played++;h.pf+=hs;h.pa+=as;a.pf+=as;a.pa+=hs;
      if(hs>as){h.wins++;a.losses++;h.points+=4;}else if(as>hs){a.wins++;h.losses++;a.points+=4;}else{h.draws++;a.draws++;h.points+=2;a.points+=2;}
    }
    const rows=Object.values(byTeam);rows.forEach(r=>r.percentage=r.pa?100*r.pf/r.pa:(r.pf?999:0));rows.sort((a,b)=>b.points-a.points||b.percentage-a.percentage||b.pf-a.pf);rows.forEach((r,i)=>r.position=i+1);return rows;
  }
  function liveRoundBadge(round){
    const feed=getLiveFeed(),same=Number(feed.season)===currentSeason()&&Number(feed.round)===Number(round),expected=Number(feed.expectedGameCount||0),done=Number(feed.completedGameCount||0);
    if(roundFinalized(round))return {label:'FINAL',tone:'green'};
    if(liveFeedCompleteForRound(round))return {label:'FULL TIME DATA',tone:'green'};
    if(same&&Object.values(feed.players||{}).some(p=>String(p.gameStatus||'').toUpperCase()==='LIVE'))return {label:'LIVE',tone:'red'};
    if(same&&Object.keys(feed.players||{}).length)return {label:'PROJECTED',tone:'blue'};
    return {label:'PROJECTIONS',tone:'neutral'};
  }
  function renderConfiguredSeasonHome(){
    const round=effectiveCurrentRound(),fixtures=effectiveFixtures().filter(f=>Number(f.round)===round),badge=liveRoundBadge(round),ladder=projectedLadderForRound(round),regular=Number(activeSeasonSetup()?.pegsRegularRounds||20),roundComplete=Boolean(roundFinalized(round)||liveFeedCompleteForRound(round)),ladderProjected=Number(round)<=regular&&!roundComplete;
    const fixtureCards=fixtures.map(f=>{
      const h=calcTeamRound(round,f.home),a=calcTeamRound(round,f.away),hp=winProbability(h.projected,a.projected),hSub=roundComplete?'Final':`Proj ${h.projected}`,aSub=roundComplete?'Final':`Proj ${a.projected}`,centre=roundComplete?'FINAL':`${hp}% · ${100-hp}%`;
      return `<button class="live-h2h-card" data-action="open-matchup" data-round="${round}" data-home="${f.home}" data-away="${f.away}"><div class="live-h2h-team">${teamIdentity(f.home,'sm')}<div class="live-h2h-score"><strong>${h.actual}</strong><span>${hSub}</span></div></div><div class="live-h2h-centre"><span class="vs-dot">VS</span><small>${centre}</small></div><div class="live-h2h-team away">${teamIdentity(f.away,'sm')}<div class="live-h2h-score"><strong>${a.actual}</strong><span>${aSub}</span></div></div></button>`;
    }).join('');
    const ladderRows=ladder.map(r=>`<button class="live-ladder-row ${r.position<=4?'top-four':''}" data-route="team/${r.team}"><b class="live-ladder-pos">${r.position}</b>${teamIdentity(r.team,'sm')}<span class="live-ladder-record">${r.wins}-${r.losses}${r.draws?`-${r.draws}`:''}</span><strong>${r.points}</strong><span class="live-ladder-pct">${Number(r.percentage||0).toFixed(1)}%</span></button>`).join('');
    main.innerHTML=`${teamNotificationBanner()}<section class="live-home"><header class="live-round-head"><div><span class="eyebrow">${currentSeason()} PEGS</span><h1>ROUND ${round}</h1>${roundLabel(round)!==`Round ${round}`?`<p>${esc(roundLabel(round))}</p>`:''}</div><span class="badge ${badge.tone}">${badge.label}</span></header><div class="live-home-grid"><section class="card live-h2h-board"><div class="section-title"><div><span class="eyebrow">Live</span><h2>Head-to-head board</h2></div><span class="live-count-note">${topPlayersForRound(round)} scores count</span></div><div class="live-h2h-list">${fixtureCards||'<div class="empty">No PEGS matchups are configured for this round.</div>'}</div></section><aside class="card live-ladder"><div class="section-title"><div><span class="eyebrow">${ladderProjected?'Projected':'Live'}</span><h2>Live ladder</h2></div><button class="link-button" data-route="ladder">Full ladder</button></div><div class="live-ladder-head"><span>#</span><span>Team</span><span>W-L</span><span>Pts</span><span>%</span></div><div class="live-ladder-list">${ladderRows}</div>${Number(round)>regular?'<p class="live-ladder-note">Regular-season ladder locked for finals.</p>':ladderProjected?'<p class="live-ladder-note">Includes this round using current live projections.</p>':''}</aside></div></section>`;
  }

  function renderHome() {
    if(teamLoggedIn()){renderPersonalizedHome(loggedTeamKey());return;}
    if(activeSeasonSetup()){renderConfiguredSeasonHome();return;}
    const gf = latestFinal();
    const champ = gf?.winner || D.ladder[0]?.team;
    const runner = gf ? (gf.home === champ ? gf.away : gf.home) : null;
    const champScore = gf ? (gf.home === champ ? gf.homeScore : gf.awayScore) : 0;
    const runnerScore = gf ? (gf.home === runner ? gf.homeScore : gf.awayScore) : 0;
    const hp = highestRoundScore();
    const gfHomeProjection = gf ? calcTeamRound(gf.round, gf.home).preRoundProjection : 0;
    const gfAwayProjection = gf ? calcTeamRound(gf.round, gf.away).preRoundProjection : 0;

    const ladderRows = D.ladder.slice(0, 6).map(r => `
      <div class="mini-ladder-row">
        <b>${r.position}</b>
        ${teamIdentity(r.team, 'sm')}
        <span>${r.wins}-${r.losses}</span>
        <b>${r.points}</b>
      </div>`).join('');

    const finals = effectiveFinals().map(f => {
      const ht = team(f.home), at = team(f.away);
      return `<div class="final-card"><div class="final-team">${figurehead(f.home,'sm')}<div><strong>${esc(ht.owner)}</strong><div class="final-score">${f.homeScore ?? '-'}</div></div></div><div><div class="final-round">Round ${f.round}</div><div class="vs-dot" style="width:34px;height:34px;font-size:10px">VS</div></div><div class="final-team">${figurehead(f.away,'sm')}<div><strong>${esc(at.owner)}</strong><div class="final-score">${f.awayScore ?? '-'}</div></div></div></div>`;
    }).join('');

    const tx = transactionRecords().slice(0, 5).map(x=>transactionItem(x,false)).join('');

    main.innerHTML = `${teamNotificationBanner()}
      <section class="hero-grid" aria-labelledby="home-title">
        <article class="card hero-score">
          <span class="eyebrow kicker">${currentSeason()} Grand Final</span>
          <div class="hero-meta"><span class="badge green">Final</span><span class="badge neutral">Round ${gf?.round || effectiveCurrentRound()}</span></div>
          <h1 id="home-title">${esc(team(champ).name)} are PEGS premiers</h1>
          <div class="matchup-hero">
            <div class="team-score">${teamIdentity(champ,'lg')}<div class="score-big">${champScore}</div><div class="score-proj">Pre-round projection <strong>${champ === gf?.home ? gfHomeProjection : gfAwayProjection}</strong></div></div>
            <div class="vs-dot">VS</div>
            <div class="team-score">${teamIdentity(runner,'lg')}<div class="score-big">${runnerScore}</div><div class="score-proj">Pre-round projection <strong>${runner === gf?.home ? gfHomeProjection : gfAwayProjection}</strong></div></div>
          </div>
          <div class="button-row"><button class="primary-button" data-action="open-matchup" data-round="${gf?.round || 23}" data-home="${gf?.home || ''}" data-away="${gf?.away || ''}">View Grand Final breakdown</button><button class="secondary-button" data-route="history">League history</button></div>
        </article>
        <aside class="hero-side">
          <article class="card mini-ladder"><div class="section-title"><h2>Regular season ladder</h2><button class="link-button" data-route="ladder">Full ladder</button></div>${ladderRows}</article>
          <article class="card card-pad"><div class="section-title"><h2>Season snapshot</h2></div>
            <div class="stat-strip" style="grid-template-columns:1fr 1fr">
              <div class="stat-box"><span>Minor premiers</span><strong>${esc(team(D.ladder[0].team).owner)}</strong><small>${D.ladder[0].wins}-${D.ladder[0].losses}</small></div>
              <div class="stat-box"><span>Highest score</span><strong>${hp.score.toLocaleString('en-AU')}</strong><small>${esc(team(hp.team).owner)}, Rd ${hp.round}</small></div>
            </div>
          </article>
        </aside>
      </section>

      <section class="dashboard-grid" aria-label="League dashboard">
        <article class="card card-pad"><div class="section-title"><h2>Finals path</h2><button class="link-button" data-route="matchups">All matchups</button></div><div class="finals-list">${finals}</div></article>
        <article class="card card-pad"><div class="section-title"><h2>Latest moves</h2><button class="link-button" data-route="transactions">All moves</button></div><div class="transaction-list">${tx}</div></article>
        <article class="card card-pad"><div class="section-title"><h2>League rules at a glance</h2><button class="link-button" data-route="history">Full rules</button></div><div class="rules-list">
          ${D.rules.notes.map((n,i)=>`<div class="rule-item"><span class="rule-num">${i+1}</span><span>${esc(n)}</span></div>`).join('')}
        </div></article>
      </section>
    `;
  }

  function fixtureCard(round, f, selected) {
    const hs = calcTeamRound(round,f.home).actual; const as = f.away ? calcTeamRound(round,f.away).actual : null;
    const hWin = as != null && hs > as; const aWin = as != null && as > hs,myFixture=teamLoggedIn()&&(f.home===loggedTeamKey()||f.away===loggedTeamKey());
    return `<button class="fixture-card ${selected ? 'active' : ''} ${myFixture?'my-fixture':''}" data-action="select-matchup" data-round="${round}" data-home="${esc(f.home)}" data-away="${esc(f.away || '')}">${myFixture?'<span class="my-fixture-label">YOUR MATCHUP</span>':''}
      <div class="fixture-team ${hWin ? 'winner' : ''}"><span>${esc(team(f.home).name)}</span><strong>${hs ?? '-'}</strong></div>
      ${f.away ? `<div class="fixture-team ${aWin ? 'winner' : ''}"><span>${esc(team(f.away).name)}</span><strong>${as ?? '-'}</strong></div>` : `<div class="empty" style="padding:8px">Bye</div>`}
    </button>`;
  }

  function availabilityBadge(p){
    const st=normalizeAvailabilityStatus(p.availability||'TBC');
    const map={SELECTED:['green','PLAYING'],LIVE:['red','LIVE'],FT:['neutral','FT'],OUT:['red','OUT'],EMERGENCY:['amber','EMG'],INJURED:['red','OUT'],BYE:['neutral','BYE'],BANKED:['blue','OR BANK'],OVERRIDE:['blue','OVERRIDE'],TBC:['neutral','TBC']};
    const unavailable=unavailableForProjection(st);
    const positiveLive=String(p.gameStatus||'').toUpperCase()==='LIVE'&&Number(p.score||0)>0;
    const displayKey=positiveLive?'LIVE':unavailable?st:String(p.gameStatus||'').toUpperCase()==='LIVE'?'LIVE':String(p.gameStatus||'').toUpperCase()==='FT'&&st!=='BANKED'&&st!=='OVERRIDE'?'FT':st;
    const [tone,label]=map[displayKey]||['neutral',displayKey];
    return `<span class="badge ${tone} availability-badge">${label}</span>`;
  }
  function lineupColumn(round, teamKey, calc) {
    const ranked=[...calc.players].sort((a,b)=>b.liveValue-a.liveValue||b.score-a.score);
    return `<div class="lineup-column"><div class="section-title"><h3>${esc(team(teamKey).name)}</h3><span class="badge neutral">Top ${calc.topN} count</span></div>
      <div class="lineup-head lineup-head-v6"><span>Player</span><span>Status</span><span style="text-align:right">Score</span><span style="text-align:right">Proj.</span></div>
      ${ranked.map((p,i)=>{const counted=calc.liveCounted.has(p.player),banked=p.scoreSource==='Opening Round banked'||p.availability==='BANKED';return `<div class="player-row player-row-v6 ${banked?'banked-row':''}"><div class="player-main"><span class="rank-bubble ${counted?'counted':''}">${i+1}</span><span class="player-name"><strong>${esc(p.player)}${banked?' <span class="score-source">OR bank</span>':''}</strong><small>${esc(p.position)} - ${esc(p.club)}${counted?' - counting':''}</small></span></div><span>${availabilityBadge(p)}</span><span class="score-cell ${p.score===0?'zero':''}">${Math.round(p.score)}</span><span class="projected-cell">${Math.round(p.liveValue)}</span></div>`;}).join('')}
    </div>`;
  }

  function renderMatchupDetail(round, home, away) {
    if (!away) return '<div class="card empty">No opponent for this fixture.</div>';
    const h = calcTeamRound(round, home); const a = calcTeamRound(round, away);
    const hp = winProbability(h.projected, a.projected); const ap = 100 - hp;
    const playedH = h.players.filter(p=>p.played).length; const playedA = a.players.filter(p=>p.played).length;
    const future=futureScoringRound(round);
    const commissionerTools=commissionerLoggedIn()?`<div class="commissioner-matchup-toolbar"><div><span class="badge green">Commissioner Mode</span><small>Official player-score controls are enabled for this matchup.</small></div><button class="secondary-button" id="open-matchup-score-editor">${matchupScoreEditOpen?'Score editor open':'Edit player scores'}</button></div>`:'';
    return `<article class="card matchup-detail">
      <div class="matchup-header">
        <div class="section-title"><div><span class="eyebrow">Round ${round}</span><h2>${roundLabel(round)==='Round '+round?'Head to head':roundLabel(round)}</h2></div></div>
        ${future?`<div class="notice round-rule-note"><strong>Future round preview.</strong> Round ${round} scoring is locked until Round ${effectiveCurrentRound()} is finalised. Approved roster moves are shown, but no scores are imported or counted yet.</div>`:`<div class="notice round-rule-note"><strong>${topPlayersForRound(round)} players count.</strong> ${esc(roundContext(round))}</div>`}
        ${commissionerTools}
        <div class="matchup-hero">
          <div class="team-score">${teamIdentity(home,'lg')}<div class="score-big">${h.actual}</div><div class="score-proj">Live projection <strong>${h.projected}</strong> - ${playedH} scores</div></div>
          <div class="vs-dot">VS</div>
          <div class="team-score">${teamIdentity(away,'lg')}<div class="score-big">${a.actual}</div><div class="score-proj">Live projection <strong>${a.projected}</strong> - ${playedA} scores</div></div>
        </div>
        <div class="section-title" style="margin-top:14px"><h3>Projected win probability</h3><span>${hp}% / ${ap}%</span></div>
        <div class="probability" style="--left:${hp}%"><div class="prob-home">${hp}% ${esc(team(home).owner)}</div><div class="prob-away">${esc(team(away).owner)} ${ap}%</div></div>
      </div>
      ${matchupScoreCorrectionEditor(round,home,away)}
      <div class="lineup-grid">${lineupColumn(round,home,h)}${lineupColumn(round,away,a)}</div>
    </article>`;
  }

  function renderMatchups(parts) {
    const fixtures=effectiveFixtures(),defaultRound=teamLoggedIn()?personalisedCurrentRound():effectiveCurrentRound();
    let round = Number(parts[0] || defaultRound);
    if (!fixtures.some(f=>Number(f.round)===round)) round = Number(fixtures[0]?.round||defaultRound);
    const roundFixtures = fixtures.filter(f => Number(f.round) === round && f.home);
    let selected = null;
    if (parts[1] && parts[2]) selected = roundFixtures.find(f => f.home === parts[1] && f.away === parts[2]);
    if (!selected && teamLoggedIn()) selected = roundFixtures.find(f => f.away && (f.home===loggedTeamKey()||f.away===loggedTeamKey()));
    if (!selected) selected = roundFixtures.find(f => f.away) || roundFixtures[0];
    const displayFixtures=teamLoggedIn()?roundFixtures.slice().sort((a,b)=>Number(!(a.home===loggedTeamKey()||a.away===loggedTeamKey()))-Number(!(b.home===loggedTeamKey()||b.away===loggedTeamKey()))):roundFixtures;
    const opts = [...new Set(fixtures.map(f=>Number(f.round)))].sort((a,b)=>a-b).map(r=>`<option value="${r}" ${r===round?'selected':''}>${roundLabel(r)}</option>`).join('');
    main.innerHTML = `${pageHeader('Match centre','Head-to-head matchups','Opening Round banks scores only. PEGS head-to-head fixtures begin in Round 1, with the counted-player total matching the number of AFL clubs playing.',`<div class="filters"><label class="screen-reader-only" for="round-select">Round</label><select class="select" id="round-select">${opts}</select></div>`)}
      ${(()=>{const setup=activeSeasonSetup(),op=setup?.openingRound||D.openingRound;if(op?.enabled===false)return '<section class="card opening-bank-card no-opening"><div><span class="eyebrow kicker">Season format</span><h2>No Opening Round this season</h2><p>PEGS scoring begins with Round 1. Bye-round player counts are calculated directly from the AFL fixture.</p></div></section>';const setupBankRounds=(setup?.rounds||[]).filter(r=>(r.bankClubs||[]).length).map(r=>Number(r.round)).filter(Number.isFinite),fallbackBankRounds=Object.entries(D.openingRound?.byeBanks||{}).filter(([,clubs])=>Array.isArray(clubs)&&clubs.length).map(([r])=>Number(r)).filter(Number.isFinite),bankRounds=setupBankRounds.length?setupBankRounds:fallbackBankRounds,lastBankRound=bankRounds.length?Math.max(...bankRounds):0,completed=Number(setup?.completedThroughRound||0),current=Number(setup?.currentRound||effectiveCurrentRound()||1);if(!lastBankRound||completed>=lastBankRound||current>lastBankRound)return '';const banks=bankRounds.sort((a,b)=>a-b).map(r=>'R'+r).join(' / ');return `<section class="card opening-bank-card"><div><span class="eyebrow kicker">${esc(op?.label||'Opening Round')}</span><h2>Score bank only - no head-to-head matchup</h2><p>Opening Round scores are banked only for clubs that later have a bye in configured early rounds.</p></div><div class="opening-bank-flow"><span>Opening Round</span><b>→</b><span>${banks}</span></div></section>`;})()}
      <div class="fixture-grid">${displayFixtures.map(f=>fixtureCard(round,f,selected===f)).join('')}</div>
      ${selected ? renderMatchupDetail(round,selected.home,selected.away) : '<div class="card empty">No fixtures in this round.</div>'}`;
    if(selected?.away)bindMatchupScoreEditor(round,selected.home,selected.away);
  }


  function hasScoreCorrections(){return Object.keys(getOverrides()).length>0;}
  function refreshStoredRoundTotals(round){
    const all=getSeasonResults(),season=String(currentSeason()),rec=all?.[season]?.[String(round)];if(!rec)return null;
    const teamScores={};D.teams.forEach(t=>teamScores[t.key]=calcTeamRound(round,t.key).actual);rec.teamScores=teamScores;rec.correctedAt=new Date().toISOString();saveSeasonResults(all);return all;
  }
  function matchupScoreCorrectionEditor(round,home,away){
    if(!commissionerLoggedIn()||!matchupScoreEditOpen||!away)return '';
    const teamKeys=[home,away].filter(Boolean),defaultTeam=teamKeys[0]||'',players=teamRoundPlayers(round,defaultTeam),first=players[0]?.player||'';
    const current=first?calcTeamRound(round,defaultTeam).players.find(p=>p.player===first)?.score:0;
    return `<section class="matchup-score-editor"><div class="section-title"><div><span class="eyebrow">Commissioner Mode</span><h3>Edit official player score</h3></div><button class="secondary-button" id="close-matchup-score-editor">Close</button></div><div class="notice"><strong>Matchup score override.</strong> Your Commissioner session is already authenticated, so no password re-entry is required. The corrected score becomes official everywhere: this matchup, Results, ladder and finals.</div><div class="form-grid" style="margin-top:16px"><div class="field-group"><label for="matchup-score-team">Team</label><select class="select" id="matchup-score-team">${teamKeys.map(k=>`<option value="${k}">${esc(team(k).name)} (${esc(team(k).owner)})</option>`).join('')}</select></div><div class="field-group"><label for="matchup-score-player">Player</label><select class="select" id="matchup-score-player">${players.map(p=>`<option value="${esc(p.player)}">${esc(p.player)} · ${esc(p.position)}</option>`).join('')}</select></div><div class="field-group"><label>Current official score</label><input class="search-input" id="matchup-score-current" value="${Number(current||0)}" disabled></div><div class="field-group"><label for="matchup-score-new">Corrected score</label><input class="search-input" id="matchup-score-new" type="number" min="0" max="400" step="1" placeholder="Enter score"></div></div><label class="destructive-confirm score-confirm"><input type="checkbox" id="matchup-score-confirm"> <span>I confirm this is the official ${esc(roundLabel(round))} score for the selected player.</span></label><div class="button-row"><button class="primary-button" id="save-matchup-score">Save official score</button><button class="secondary-button" id="clear-matchup-score">Restore original/live score</button></div></section>`;
  }
  function bindMatchupScoreEditor(round,home,away){
    const rerender=()=>renderMatchups([String(round),home,away]);
    document.getElementById('open-matchup-score-editor')?.addEventListener('click',()=>{matchupScoreEditOpen=true;rerender();});
    document.getElementById('close-matchup-score-editor')?.addEventListener('click',()=>{matchupScoreEditOpen=false;rerender();});
    const teamEl=document.getElementById('matchup-score-team'),playerEl=document.getElementById('matchup-score-player'),currentEl=document.getElementById('matchup-score-current'),newEl=document.getElementById('matchup-score-new'),confirmEl=document.getElementById('matchup-score-confirm');
    if(!teamEl||!playerEl)return;
    const refreshCurrent=()=>{const key=teamEl.value,name=playerEl.value,rec=calcTeamRound(round,key).players.find(p=>p.player===name),over=scoreOverride(round,key,name);currentEl.value=Number(rec?.score||0);newEl.value=over===undefined?'':String(over);};
    const refreshPlayers=()=>{const key=teamEl.value;playerEl.innerHTML=teamRoundPlayers(round,key).map(p=>`<option value="${esc(p.player)}">${esc(p.player)} · ${esc(p.position)}</option>`).join('');refreshCurrent();};
    teamEl.addEventListener('change',refreshPlayers);playerEl.addEventListener('change',refreshCurrent);refreshCurrent();
    const requireCommissioner=()=>{if(!commissionerLoggedIn())throw new Error('Commissioner Mode is no longer active. Log in again.');};
    const requireConfirm=()=>{if(!confirmEl.checked)throw new Error('Tick the confirmation box before changing an official score.');};
    document.getElementById('save-matchup-score')?.addEventListener('click',async()=>{try{requireCommissioner();requireConfirm();if(futureScoringRound(round))throw new Error('Future-round scores cannot be edited before the round opens.');const value=Number(newEl.value);if(!Number.isFinite(value)||value<0||value>400)throw new Error('Enter a valid score between 0 and 400.');const key=teamEl.value,name=playerEl.value,old=calcTeamRound(round,key).players.find(p=>p.player===name)?.score??0,backupId=backendConfigured()?await createServerBackup('SCORE_CORRECTION',`${roundLabel(round)} · ${name}`):null,all=getOverrides();all[overrideId(round,key,name)]=Math.round(value);saveOverrides(all);const stored=refreshStoredRoundTotals(round);if(backendConfigured()){await pushSharedState('score_overrides',all);if(stored)await pushSharedState('season_results',stored);await logCommissioner('SCORE_CORRECTED','player-score',overrideId(round,key,name),{round,team:key,player:name,from:Number(old),to:Math.round(value),backupId});}confirmEl.checked=false;toast(`${name} updated to ${Math.round(value)}.`);rerender();}catch(e){toast(e.message||'Score could not be changed.');}});
    document.getElementById('clear-matchup-score')?.addEventListener('click',async()=>{try{requireCommissioner();requireConfirm();const key=teamEl.value,name=playerEl.value,all=getOverrides();if(!Object.prototype.hasOwnProperty.call(all,overrideId(round,key,name)))throw new Error('This player does not have a Commissioner score correction.');const old=Number(all[overrideId(round,key,name)]),backupId=backendConfigured()?await createServerBackup('SCORE_CORRECTION_REMOVED',`${roundLabel(round)} · ${name}`):null;delete all[overrideId(round,key,name)];saveOverrides(all);const stored=refreshStoredRoundTotals(round);if(backendConfigured()){await pushSharedState('score_overrides',all);if(stored)await pushSharedState('season_results',stored);await logCommissioner('SCORE_CORRECTION_REMOVED','player-score',overrideId(round,key,name),{round,team:key,player:name,from:old,backupId});}confirmEl.checked=false;toast(`${name} restored to the original/live score.`);rerender();}catch(e){toast(e.message||'Score correction could not be removed.');}});
  }


  function renderResults(parts) {
    const fixtures=effectiveFixtures();
    let round = Number(parts[0] || effectiveCurrentRound());
    if (!fixtures.some(f=>Number(f.round)===round)) round = Number(fixtures[0]?.round||effectiveCurrentRound());
    const roundFixtures = fixtures.filter(f => Number(f.round) === round && f.home);
    const options = [...new Set(fixtures.map(f => Number(f.round)))].sort((a,b)=>a-b).map(r=>`<option value="${r}" ${r===round?'selected':''}>${roundLabel(r)}</option>`).join('');
    const completed = roundFixtures.filter(f=>f.away).map(f=>{
      const hs=calcTeamRound(round,f.home).actual; const as=calcTeamRound(round,f.away).actual;
      const winner=hs>as?f.home:(as>hs?f.away:null);
      return `<article class="card card-pad"><div class="final-round">${roundLabel(round)}</div><div class="matchup-hero" style="margin:10px 0 0"><div class="team-score">${teamIdentity(f.home,'sm')}<div class="score-big" style="font-size:38px">${hs??'-'}</div>${winner===f.home?'<span class="badge green">Winner</span>':''}</div><div class="vs-dot" style="width:36px;height:36px;font-size:10px">VS</div><div class="team-score">${teamIdentity(f.away,'sm')}<div class="score-big" style="font-size:38px">${as??'-'}</div>${winner===f.away?'<span class="badge green">Winner</span>':''}</div></div><div class="button-row" style="justify-content:center"><button class="secondary-button" data-action="open-matchup" data-round="${round}" data-home="${f.home}" data-away="${f.away}">Full scorecard</button></div></article>`;
    }).join('');
    const scores=D.teams.map(t=>[t.key,calcTeamRound(round,t.key).actual]).sort((a,b)=>b[1]-a[1]);
    const controls=`<div class="filters"><label class="screen-reader-only" for="results-round-select">Round</label><select class="select" id="results-round-select">${options}</select></div>`;
    main.innerHTML = `${pageHeader('Scoreboard','Results','Opening Round has no PEGS result. From Round 1 onward, each score uses the number of AFL clubs playing that round, including banked Opening Round scores in Rounds 2-4.',controls)}
      <div class="notice round-rule-note"><strong>Round ${round}: top ${topPlayersForRound(round)} count.</strong> ${esc(roundContext(round))}</div>
      <div class="fixture-grid">${completed || '<div class="card empty">No completed fixtures.</div>'}</div>
      <section class="card ladder-card" style="margin-top:16px"><div class="table-wrap" style="border:0"><table class="data-table"><caption>Round ${round} scoring leaderboard</caption><thead><tr><th>#</th><th>Team</th><th>Score</th><th>Players counted</th></tr></thead><tbody>${scores.map(([k,v],i)=>`<tr><td class="ladder-pos">${i+1}</td><td>${teamIdentity(k,'sm')}</td><td><strong>${Number(v).toLocaleString('en-AU')}</strong></td><td>Top ${topPlayersForRound(round)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }

  function teamValidity(t) {
    const c=t.caps, n=t.counts, r=D.rules;
    return c.main <= r.mainContractCap && c.field <= r.fieldCap && c.rookie <= r.rookieContractCap && n.field <= r.maxFieldPlayers && Object.entries(r.positionMax).every(([p,max]) => (n[p]||0) <= max);
  }

  function teamCard(t) {
    return `<button class="card team-card" style="--accent:${esc(t.accent)};text-align:left" data-action="open-team" data-team="${esc(t.key)}">
      ${teamIdentity(t.key)}
      <div class="badge ${teamValidity(t)?'green':'red'}">${teamValidity(t)?'Roster legal':'Review roster'}</div>
      ${capMeter('Main contracts',t.caps.main,D.rules.mainContractCap)}
      ${capMeter('Field',t.caps.field,D.rules.fieldCap)}
      ${capMeter('Rookie contracts',t.caps.rookie,D.rules.rookieContractCap)}
      <div class="position-chips">${Object.entries(D.rules.positionMax).map(([p,max])=>`<span class="position-chip ${(t.counts[p]||0)===max?'complete':''}">${p} ${t.counts[p]||0}/${max}</span>`).join('')}<span class="position-chip">INT ${t.counts.interchange||0}</span></div>
    </button>`;
  }

  function renderTeams() {
    if(teamLoggedIn()){renderTeamDetail(loggedTeamKey(),true);return;}
    main.innerHTML = `${pageHeader('Franchises','Teams','Current 2026 lists from the workbook, with contract and salary-cap validation built in.')}
      <div class="team-grid">${D.teams.map(t=>teamCard(effectiveTeam(t.key))).join('')}</div>`;
  }

  function directPlayerPortrait(player,size=''){
    const src=playerPhotoUrl(player.player,player.club),initials=String(player.player||'').split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
    return `<span class="field-player-portrait ${size}" title="${esc(player.player)}"><span>${esc(initials||'?')}</span>${src?`<img src="${esc(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="this.parentElement.classList.add('photo-ready')" onerror="this.remove()">`:''}</span>`;
  }

  function aflFieldPlayerCard(player,teamKey=''){
    return `<button type="button" class="afl-field-player player-profile-trigger" title="Open ${esc(player.player)} profile · ${money(player.salary)} · contract ends ${esc(player.contractEnd||'—')}" data-action="open-player-profile" data-team="${esc(teamKey)}" data-player="${esc(player.player)}">
      ${directPlayerPortrait(player,'field')}
      <div class="afl-field-player-copy"><strong>${esc(player.player)}</strong><span>${money(player.salary)}</span><small>Ends ${esc(player.contractEnd||'—')}</small></div>
    </button>`;
  }

  function aflFieldZone(label,players,zoneClass,teamKey=''){
    return `<section class="afl-field-zone ${zoneClass}"><span class="afl-field-zone-label">${esc(label)}</span><div class="afl-field-zone-players">${players.map(p=>aflFieldPlayerCard(p,teamKey)).join('')||'<span class="afl-field-empty">No players</span>'}</div></section>`;
  }

  function teamAflField(roster,teamKey=''){
    const field=roster.filter(p=>String(p.status).toLowerCase()==='field');
    const groups={DEF:[],MID:[],FWD:[],RUC:[]};
    field.forEach(p=>{const pos=String(p.position||'').toUpperCase();if(groups[pos])groups[pos].push(p);});
    Object.values(groups).forEach(rows=>rows.sort((a,b)=>a.player.localeCompare(b.player)));
    return `<div class="afl-field-shell">
      <div class="afl-field-goals top" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="afl-field-markings" aria-hidden="true"><span class="afl-field-centre-square"></span><span class="afl-field-centre-circle"></span><span class="afl-field-arc top"></span><span class="afl-field-arc bottom"></span></div>
      <div class="afl-field-zones">
        ${aflFieldZone('DEF',groups.DEF,'defenders',teamKey)}
        ${aflFieldZone('MID',groups.MID,'mids',teamKey)}
        ${aflFieldZone('RUC',groups.RUC,'rucks',teamKey)}
        ${aflFieldZone('FWD',groups.FWD,'forwards',teamKey)}
      </div>
      <div class="afl-field-goals bottom" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    </div>`;
  }

  function rosterListRow(player,teamKey=''){
    return `<button type="button" class="team-roster-list-row player-profile-trigger ${String(player.status).toLowerCase()==='field'?'is-field':'is-interchange'}" data-action="open-player-profile" data-team="${esc(teamKey)}" data-player="${esc(player.player)}" aria-label="Open ${esc(player.player)} player profile">
      <div class="team-roster-list-player">${directPlayerPortrait(player,'list')}<span><strong>${esc(player.player)}</strong><small>${esc(player.club)} · ${esc(player.position)}</small></span></div>
      <span class="team-roster-contract"><b>${esc(player.contract)}</b><small>Ends ${esc(player.contractEnd||'—')}</small></span>
      <span class="team-roster-salary">${money(player.salary)}<small>${esc(player.status)}</small></span>
    </button>`;
  }

  function playerProfileRoundCeiling(){
    const season=currentSeason(),setup=activeSeasonSetup(),setupRound=Number(setup?.currentRound);
    if(Number.isFinite(setupRound)&&setupRound>0)return Math.floor(setupRound);
    const feed=getLiveFeed(),feedRound=Number(feed?.round);
    if(Number(feed?.season)===season&&Number.isFinite(feedRound)&&feedRound>0)return Math.floor(feedRound);
    const finalized=Object.keys(getSeasonResults()?.[String(season)]||{}).map(Number).filter(r=>Number.isFinite(r)&&r>0);
    if(finalized.length)return Math.max(...finalized)+1;
    // The bundled workbook may contain later/final-season rounds for testing/history.
    // Never use its meta.currentRound as a live profile ceiling because that can expose future scores.
    return 1;
  }

  function playerSeasonScoreHistory(name){
    const canon=canonicalPlayerName(name),season=currentSeason(),roundCeiling=playerProfileRoundCeiling(),stored=getSeasonResults()?.[String(season)]||{},rounds=new Set(Object.keys(stored).map(Number).filter(r=>Number.isFinite(r)&&r<=roundCeiling));
    if(Number(D.meta?.season||0)===season)Object.keys(D.roundScores||{}).map(Number).filter(r=>Number.isFinite(r)&&r<=roundCeiling).forEach(r=>rounds.add(r));
    const history=[];
    [...rounds].sort((a,b)=>a-b).forEach(round=>{
      let found=null,foundTeam='';
      const storedPlayers=stored?.[String(round)]?.players||{};
      for(const [teamKey,rows] of Object.entries(storedPlayers)){const rec=(rows||[]).find(p=>canonicalPlayerName(p.player)===canon);if(rec){found=rec;foundTeam=teamKey;break;}}
      if(!found&&Number(D.meta?.season||0)===season){const legacy=D.roundScores?.[String(round)]||{};for(const [teamKey,rows] of Object.entries(legacy)){const rec=(rows||[]).find(p=>canonicalPlayerName(p.player)===canon);if(rec){found=rec;foundTeam=teamKey;break;}}}
      if(!found)return;
      const corrected=foundTeam?scoreOverride(round,foundTeam,found.player):undefined,score=Number(corrected!==undefined?corrected:found.score||0);
      if(score>0)history.push({round,score,team:foundTeam,corrected:corrected!==undefined});
    });
    return history;
  }

  function playerPerformance(name){
    const history=playerSeasonScoreHistory(name),scores=history.map(x=>Number(x.score||0));
    const average=rows=>rows.length?rows.reduce((a,b)=>a+b,0)/rows.length:null;
    return {history,games:scores.length,seasonAvg:average(scores),last3:average(scores.slice(-3)),last5:average(scores.slice(-5)),high:scores.length?Math.max(...scores):null,last:scores.length?scores[scores.length-1]:null,throughRound:playerProfileRoundCeiling()};
  }

  function playerContractRemaining(rec){
    const end=Number(rec?.contractEnd||0),season=currentSeason();if(!end)return null;return Math.max(0,end-season+1);
  }

  function ensurePlayerProfileDialog(){
    let dialog=document.getElementById('player-profile-dialog');if(dialog)return dialog;
    dialog=document.createElement('dialog');dialog.id='player-profile-dialog';dialog.className='player-profile-dialog commissioner-dialog';dialog.setAttribute('aria-labelledby','player-profile-name');dialog.innerHTML='<div id="player-profile-content"></div>';document.body.appendChild(dialog);
    dialog.addEventListener('click',e=>{if(e.target===dialog||e.target.closest('[data-player-profile-close]'))dismissDialog(dialog);});
    return dialog;
  }

  function showPlayerProfile(teamKey,name){
    const roster=effectiveRosters()?.[teamKey]||[],canon=canonicalPlayerName(name),rec=roster.find(p=>canonicalPlayerName(p.player)===canon)||{player:name},pool=playerPoolRecord(name)||{},perf=playerPerformance(name),dialog=ensurePlayerProfileDialog(),content=dialog.querySelector('#player-profile-content');
    const src=playerPhotoUrl(rec.player,rec.club||pool.club),initials=String(rec.player||'').split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase(),remaining=playerContractRemaining(rec),avg=v=>v===null||v===undefined?'—':Number(v).toFixed(1),club=rec.club||pool.club||'—',aflPosition=pool.position||rec.position||'—',pegsPosition=rec.position||aflPosition,currentPrice=Number(pool.price||pool.startPrice||0),recent=[...perf.history].slice(-5).reverse();
    content.innerHTML=`<div class="dialog-head player-profile-dialog-head"><div><span class="eyebrow">${esc(team(teamKey).name)} · Player profile</span><h2 id="player-profile-name">${esc(rec.player)}</h2></div><button type="button" class="icon-button player-profile-close" data-player-profile-close aria-label="Close player profile">×</button></div>
      <div class="player-profile-body">
        <section class="player-profile-hero" style="--player-team-accent:${esc(team(teamKey).accent)}">
          <div class="player-profile-portrait"><span>${esc(initials||'?')}</span>${src?`<img src="${esc(src)}" alt="${esc(rec.player)}" loading="eager" decoding="async" referrerpolicy="no-referrer" onload="this.parentElement.classList.add('photo-ready')" onerror="this.remove()">`:''}</div>
          <div class="player-profile-identity"><span class="badge neutral">${esc(club)}</span><h3>${esc(rec.player)}</h3><p>${esc(aflPosition)} · PEGS ${esc(pegsPosition)} · ${esc(rec.status||'Current list')}</p><small>${esc(team(teamKey).owner)} · ${esc(team(teamKey).name)}</small></div>
        </section>
        <section class="player-profile-stats" aria-label="${currentSeason()} SuperCoach performance">
          <div class="player-profile-stat"><span>Games played</span><strong>${perf.games}</strong><small>${currentSeason()} through R${perf.throughRound}</small></div>
          <div class="player-profile-stat"><span>Season average</span><strong>${avg(perf.seasonAvg)}</strong><small>${perf.games?`${perf.games} games`:'Current data'}</small></div>
          <div class="player-profile-stat"><span>3-round average</span><strong>${avg(perf.last3)}</strong><small>Last ${Math.min(3,perf.games)||3} games</small></div>
          <div class="player-profile-stat"><span>5-round average</span><strong>${avg(perf.last5)}</strong><small>Last ${Math.min(5,perf.games)||5} games</small></div>
        </section>
        <section class="player-profile-grid">
          <div class="player-profile-detail"><span>Position</span><strong>${esc(aflPosition)}</strong><small>PEGS position: ${esc(pegsPosition)}</small></div>
          <div class="player-profile-detail"><span>Contract / length</span><strong>${esc(rec.contract||'—')}</strong><small>${remaining===null?'Length unavailable':remaining===0?'Expires / expired':`${remaining} season${remaining===1?'':'s'} remaining`}</small></div>
          <div class="player-profile-detail"><span>Contract ends</span><strong>${esc(rec.contractEnd||'—')}</strong><small>End of PEGS season</small></div>
          <div class="player-profile-detail"><span>PEGS salary</span><strong>${money(rec.salary||0)}</strong><small>${esc(rec.status||'Current list')}</small></div>
          <div class="player-profile-detail"><span>Current SC price</span><strong>${currentPrice?money(currentPrice):'—'}</strong><small>${esc(club)}</small></div>
          <div class="player-profile-detail"><span>Season high</span><strong>${perf.high??'—'}</strong><small>${perf.last!==null?`Last score ${perf.last}`:'No scores loaded'}</small></div>
        </section>
        <section class="player-profile-recent"><div class="section-title"><div><span class="eyebrow">Form line · through Round ${perf.throughRound}</span><h3>Recent scores</h3></div></div><div class="player-profile-score-list">${recent.length?recent.map(x=>`<div class="player-profile-score ${x.corrected?'is-corrected':''}"><span>${esc(roundLabel(x.round))}</span><strong>${Math.round(x.score)}</strong>${x.corrected?'<small>Commissioner corrected</small>':'<small>Official score</small>'}</div>`).join(''):'<div class="empty">No completed player scores are available yet.</div>'}</div></section>
      </div>`;
    if(!dialog.open)dialog.showModal();
    requestAnimationFrame(()=>dialog.querySelector('[data-player-profile-close]')?.focus());
  }

  function renderTeamDetail(key,personalizedLanding=false) {
    const t = effectiveTeam(key);
    const roster = effectiveRosters()[t.key] || [];
    const regular=Number(activeSeasonSetup()?.pegsRegularRounds||20),regularScores=completedTeamFixtures(t.key).filter(x=>Number(x.round)<=regular).map(x=>Number(x.ownScore||0)).filter(Number.isFinite);
    const avg = regularScores.length ? Math.round(regularScores.reduce((a,b)=>a+b,0)/regularScores.length) : 0;
    const filters = ['ALL','DEF','MID','FWD','RUC','INTERCHANGE'];
    const visible = roster.filter(p => selectedRosterFilter === 'ALL' || (selectedRosterFilter === 'INTERCHANGE' ? p.status === 'Interchange' : p.position === selectedRosterFilter));
    const rows = [...visible].sort((a,b)=> (a.status===b.status?0:(a.status==='Field'?-1:1)) || ['DEF','MID','FWD','RUC'].indexOf(a.position)-['DEF','MID','FWD','RUC'].indexOf(b.position) || a.player.localeCompare(b.player));
    const teamViewControls=personalizedLanding?`<div class="my-team-view-controls"><span class="badge green">YOUR TEAM</span><label class="screen-reader-only" for="team-view-select">View another team</label><select class="select" id="team-view-select">${D.teams.map(x=>`<option value="${x.key}" ${x.key===t.key?'selected':''}>${esc(x.name)} (${esc(x.owner)})</option>`).join('')}</select></div>`:`<button class="secondary-button" data-route="teams">${teamLoggedIn()?'Back to My Team':'Back to teams'}</button>`;
    main.innerHTML = `${pageHeader(personalizedLanding?'My Franchise':'Franchise profile',t.name,`Coach: ${t.owner} - ${roster.length} contracted players`,teamViewControls)}
      <section class="card team-detail-head">
        <div class="team-figurehead-hero">${figurehead(t.key,'lg')}<span>${esc(figureheadPlayer(t.key).player)}</span></div>
        <div><span class="badge ${teamValidity(t)?'green':'red'}">${teamValidity(t)?'All cap tests passed':'Roster requires review'}</span><h1>${esc(t.owner)}</h1><p>${esc(t.name)} - ${esc(t.code)}</p><div class="stat-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:0"><div class="stat-box"><span>Team score avg</span><strong>${avg}</strong></div><div class="stat-box"><span>Field players</span><strong>${t.counts.field}</strong></div><div class="stat-box"><span>Interchange</span><strong>${t.counts.interchange}</strong></div></div></div>
        <div class="cap-stack">${capMeter('Main contract cap',t.caps.main,D.rules.mainContractCap)}${capMeter('Field cap',t.caps.field,D.rules.fieldCap)}${capMeter('Rookie contract cap',t.caps.rookie,D.rules.rookieContractCap)}</div>
      </section>
      <section class="team-roster-field-layout">
        <div class="team-roster-list-panel">
          <div class="team-roster-panel-head"><div><span class="eyebrow">Contracted list</span><h2>Player list</h2></div><span class="badge neutral">${visible.length} shown</span></div>
          <div class="roster-tabs" role="group" aria-label="Roster filter">${filters.map(f=>`<button class="tab-button ${selectedRosterFilter===f?'active':''}" data-action="roster-filter" data-filter="${f}">${f==='INTERCHANGE'?'Interchange':f}</button>`).join('')}</div>
          <div class="team-roster-list">${rows.map(p=>rosterListRow(p,t.key)).join('')||'<div class="empty">No players match this filter.</div>'}</div>
        </div>
        <div class="team-afl-field-panel">
          <div class="team-roster-panel-head"><div><span class="eyebrow">Starting field</span><h2>On-field 28</h2></div><span class="badge green">${roster.filter(p=>String(p.status).toLowerCase()==='field').length} players</span></div>
          ${teamAflField(roster,t.key)}
        </div>
      </section>`;
  }

  function recentTeamScores(teamKey, n=5) {
    if(activeSeasonSetup()) return Object.entries(getSeasonResults()?.[String(currentSeason())]||{}).sort((a,b)=>Number(a[0])-Number(b[0])).map(([,v])=>Number(v.teamScores?.[teamKey]||0)).filter(Boolean).slice(-n);
    if(hasScoreCorrections())return Object.entries(D.roundTotals).filter(([r])=>Number(r)<=20).sort((a,b)=>Number(a[0])-Number(b[0])).map(([r])=>Number(calcTeamRound(Number(r),teamKey).actual||0)).filter(Boolean).slice(-n);
    return Object.entries(D.roundTotals).filter(([r])=>Number(r)<=20).sort((a,b)=>Number(a[0])-Number(b[0])).map(([,v])=>Number(v[teamKey]||0)).filter(Boolean).slice(-n);
  }

  function recentTeamForm(teamKey,n=5){
    const setup=activeSeasonSetup(),regular=Number(setup?.pegsRegularRounds||20),fixtures=(setup?.pegsFixtures?.length?setup.pegsFixtures:D.fixtures||[]).filter(f=>Number(f.round)<=regular&&f.home&&f.away&&(f.home===teamKey||f.away===teamKey)).sort((a,b)=>Number(a.round)-Number(b.round)),results=setup?(getSeasonResults()?.[String(currentSeason())]||{}):null,out=[];
    for(const f of fixtures){
      let hs=0,as=0,complete=false;
      if(setup){const rr=results[String(f.round)];if(!rr)continue;hs=Number(rr.teamScores?.[f.home]||0);as=Number(rr.teamScores?.[f.away]||0);complete=Boolean(rr.finalizedAt||roundFinalized(f.round));}
      else {const totals=D.roundTotals?.[String(f.round)]||D.roundTotals?.[Number(f.round)];if(!totals)continue;if(hasScoreCorrections()){hs=Number(calcTeamRound(Number(f.round),f.home).actual||0);as=Number(calcTeamRound(Number(f.round),f.away).actual||0);}else{hs=Number(totals[f.home]||0);as=Number(totals[f.away]||0);}complete=Boolean(hs||as);}
      if(!complete)continue;
      const own=f.home===teamKey?hs:as,opp=f.home===teamKey?as:hs;
      out.push(own>opp?'W':own<opp?'L':'D');
    }
    return out.slice(-n);
  }

  function formBars(teamKey) {
    const form=recentTeamForm(teamKey,5);
    return `<div class="form-results" aria-label="Last five results: ${form.join(', ')}">${form.length?form.map(v=>`<span class="${v==='W'?'win':v==='L'?'loss':'draw'}" title="${v==='W'?'Win':v==='L'?'Loss':'Draw'}">${v}</span>`).join(''):'<span class="empty-form">—</span>'}</div>`;
  }

  function effectiveLadder(){
    const setup=activeSeasonSetup(),results=getSeasonResults()?.[String(currentSeason())]||{};
    if(!setup&&!hasScoreCorrections())return D.ladder;
    if(!setup&&hasScoreCorrections()){const rows=Object.fromEntries(D.teams.map(t=>[t.key,{position:0,team:t.key,played:0,wins:0,losses:0,draws:0,pf:0,pa:0,points:0,percentage:0}]));for(const f of (D.fixtures||[]).filter(x=>Number(x.round)<=20&&x.home&&x.away)){const hs=Number(calcTeamRound(Number(f.round),f.home).actual||0),as=Number(calcTeamRound(Number(f.round),f.away).actual||0);if(!hs&&!as)continue;const h=rows[f.home],a=rows[f.away];if(!h||!a)continue;h.played++;a.played++;h.pf+=hs;h.pa+=as;a.pf+=as;a.pa+=hs;if(hs>as){h.wins++;a.losses++;h.points+=4;}else if(as>hs){a.wins++;h.losses++;a.points+=4;}else{h.draws++;a.draws++;h.points+=2;a.points+=2;}}const arr=Object.values(rows);arr.forEach(r=>r.percentage=r.pa?100*r.pf/r.pa:(r.pf?999:0));arr.sort((a,b)=>b.points-a.points||b.percentage-a.percentage||b.pf-a.pf);arr.forEach((r,i)=>r.position=i+1);return arr;}
    const regular=Number(setup.pegsRegularRounds||20),regularFixtures=(setup.pegsFixtures||[]).filter(f=>Number(f.round)<=regular&&f.away),hasRegularResults=Object.keys(results).some(r=>Number(r)<=regular);
    // When the live 2026 setup was activated after the regular season, preserve
    // the workbook ladder until real regular-season rounds exist in shared state.
    if(currentSeason()===Number(D.meta.season)&&!hasRegularResults)return D.ladder;
    const rows=Object.fromEntries(D.teams.map(t=>[t.key,{position:0,team:t.key,played:0,wins:0,losses:0,draws:0,pf:0,pa:0,points:0,percentage:0}]));
    for(const f of regularFixtures){
      const rr=results[String(f.round)]; if(!rr)continue; const hs=Number(rr.teamScores?.[f.home]||0),as=Number(rr.teamScores?.[f.away]||0); if(!hs&&!as)continue;
      const h=rows[f.home],a=rows[f.away]; if(!h||!a)continue; h.played++;a.played++;h.pf+=hs;h.pa+=as;a.pf+=as;a.pa+=hs;
      if(hs>as){h.wins++;a.losses++;h.points+=4;} else if(as>hs){a.wins++;h.losses++;a.points+=4;} else {h.draws++;a.draws++;h.points+=2;a.points+=2;}
    }
    const arr=Object.values(rows); arr.forEach(r=>r.percentage=r.pa?100*r.pf/r.pa:(r.pf?999:0)); arr.sort((a,b)=>b.points-a.points||b.percentage-a.percentage||b.pf-a.pf); arr.forEach((r,i)=>r.position=i+1); return arr;
  }
  function renderLadder() {
    const personalised=teamLoggedIn(),ladderData=personalised?personalisedLadderData():effectiveLadder(),myKey=loggedTeamKey(),myRow=personalised?ladderData.find(r=>r.team===myKey):null,formFor=personalised?personalisedFormBars:formBars;
    const rows=ladderData.map(r=>`<tr class="${r.position<=4?'ladder-row-highlight':''} ${myRow&&r.team===myKey?'my-team-ladder-row':''}"><td class="ladder-pos">${r.position}</td><td>${teamIdentity(r.team,'sm')}${myRow&&r.team===myKey?'<span class="badge green ladder-me-badge">YOU</span>':''}</td><td>${r.played}</td><td><strong>${r.wins}</strong></td><td>${r.losses}</td><td>${r.draws}</td><td>${r.pf.toLocaleString('en-AU')}</td><td>${r.pa.toLocaleString('en-AU')}</td><td>${r.percentage.toFixed(1)}%</td><td><strong>${r.points}</strong></td><td>${formFor(r.team)}</td></tr>`).join('');
    const active=activeSeasonSetup(),mySummary=myRow?`<section class="card my-ladder-summary"><div>${teamIdentity(myKey,'sm')}<div><span class="eyebrow">Your ladder position</span><h2>${ordinal(myRow.position)}</h2></div></div><div class="my-ladder-summary-stats"><span><small>Record</small><strong>${myRow.wins}-${myRow.losses}${myRow.draws?`-${myRow.draws}`:''}</strong></span><span><small>Points</small><strong>${myRow.points}</strong></span><span><small>Percentage</small><strong>${Number(myRow.percentage||0).toFixed(1)}%</strong></span><span><small>Last 5</small>${formFor(myKey)}</span></div></section>`:'';
    main.innerHTML = `${pageHeader(`${currentSeason()} season`,'Ladder',personalised?`Your live franchise ladder through Round ${personalisedCurrentRound()}, using completed results only.`:active?'Calculated only from rounds the Commissioner has finalised. This ladder is also the source for the mid-season draft order.':'Calculated from the 2026 workbook regular season. Finals are shown separately.')}${mySummary}
      <div class="card ladder-card"><div class="table-wrap" style="border:0;border-radius:0"><table class="data-table"><caption>${currentSeason()} regular-season ladder</caption><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>L</th><th>D</th><th>PF</th><th>PA</th><th>%</th><th>Pts</th><th>Last 5</th></tr></thead><tbody>${rows}</tbody></table></div></div>
      <section class="card card-pad" style="margin-top:16px"><div class="notice"><strong>Draft link:</strong> when the Mid-Season Draft is activated, this ladder is snapshotted in reverse order. Later ladder changes do not change that draft order.</div></section>
      ${(()=>{const regular=Number(activeSeasonSetup()?.pegsRegularRounds||20),finals=personalised&&personalisedCurrentRound()<=regular?[]:effectiveFinals();return finals.length?`<section class="card card-pad" style="margin-top:16px"><div class="section-title"><h2>${currentSeason()} finals</h2></div><div class="finals-list">${finals.map(f=>`<div class="final-card"><div class="final-team">${teamIdentity(f.home,'sm')}<div class="final-score">${f.homeScore??'-'}</div></div><div><div class="final-round">${esc(f.label||roundLabel(f.round))}</div><div class="vs-dot" style="width:34px;height:34px;font-size:10px">VS</div></div><div class="final-team">${f.away?teamIdentity(f.away,'sm'):'TBC'}<div class="final-score">${f.awayScore??'-'}</div></div></div>`).join('')}</div></section>`:'';})()}`;
  }

  function availablePlayers() {
    const q=draftSearch.trim().toLowerCase(),pool=frozenDraftPlayers();
    const rostered=new Set(Object.values(effectiveRosters()).flat().map(p=>canonicalPlayerName(p.player)));
    const reserved=new Set(proposalCache.filter(x=>x.type==='DRAFT_PICK'&&activeProposalStatus(x.status)).map(x=>canonicalPlayerName(x.payload?.player)).filter(Boolean));
    return pool.filter(p=>!rostered.has(canonicalPlayerName(p.player))&&!reserved.has(canonicalPlayerName(p.player))&&(!q||String(p.player).toLowerCase().includes(q)||String(p.club).toLowerCase().includes(q)||String(p.position).toLowerCase().includes(q))).slice(0,120);
  }

  function validateDraft(teamKey, player, contract, status, fixedPosition='') {
    const t=effectiveTeam(teamKey),price=Number(player?.price||player?.startPrice||0),pos=String(fixedPosition||String(player?.position||'').split('/')[0]).toUpperCase();
    const checks=[];if(!player)return checks;
    const isMain=contract==='Main',isField=status==='Field',newMain=t.caps.main+(isMain?price:0),newField=t.caps.field+(isField?price:0),newRookie=t.caps.rookie+(!isMain?price:0),newMainCount=(t.counts.main||0)+(isMain?1:0),newFieldCount=t.counts.field+(isField?1:0),newPos=(t.counts[pos]||0)+(isField?1:0);
    const rostered=new Set(Object.values(effectiveRosters()).flat().map(p=>canonicalPlayerName(p.player)));
    const validPositions=String(player?.position||'').toUpperCase().split('/').filter(Boolean);
    checks.push({label:'Player is currently unrostered',pass:!rostered.has(canonicalPlayerName(player.player)),detail:player.player});
    checks.push({label:'Frozen draft price available',pass:price>0,detail:money(price)});
    checks.push({label:'PEGS contract position',pass:Boolean(pos)&&validPositions.includes(pos),detail:pos||'Choose position'});
    checks.push({label:'Main contract cap',pass:newMain<=D.rules.mainContractCap,detail:`${compactMoney(newMain)} / ${compactMoney(D.rules.mainContractCap)}`});
    checks.push({label:'Field salary cap',pass:newField<=D.rules.fieldCap,detail:`${compactMoney(newField)} / ${compactMoney(D.rules.fieldCap)}`});
    checks.push({label:'Rookie contract cap',pass:newRookie<=D.rules.rookieContractCap,detail:`${compactMoney(newRookie)} / ${compactMoney(D.rules.rookieContractCap)}`});
    checks.push({label:'Main contract list size',pass:newMainCount<=28,detail:`${newMainCount} / 28`});
    checks.push({label:'Field list size',pass:newFieldCount<=D.rules.maxFieldPlayers,detail:`${newFieldCount} / ${D.rules.maxFieldPlayers}`});
    if(isField&&pos)checks.push({label:`${pos} position limit`,pass:newPos<=(D.rules.positionMax[pos]||99),detail:`${newPos} / ${D.rules.positionMax[pos]||'-'}`});
    return checks;
  }

  function draftOrder(state=getDraftState()) {
    const order=Array.isArray(state.order)?state.order.filter(k=>teamMap[k]):[];
    return order.length?order:D.teams.map(t=>t.key);
  }
  function currentDraftTeam(state=getDraftState()) {
    const order=draftOrder(state);
    const idx=Math.max(0,Number(state.currentIndex||0));
    return order[idx] || '';
  }
  function draftSecondsRemaining(state=getDraftState()) {
    if(!state.active) return 0;
    const started=new Date(state.pickStartedAt||state.updatedAt||state.startedAt||Date.now()).getTime();
    const timer=Math.max(1,Number(state.timerSeconds||180));
    return Math.max(0,Math.ceil((started+timer*1000-Date.now())/1000));
  }
  function draftIsOvertime(state=getDraftState()){ return Boolean(state.active)&&draftSecondsRemaining(state)<=0; }
  function clockText(seconds){const m=Math.floor(seconds/60),s=seconds%60;return `${m}:${String(s).padStart(2,'0')}`;}
  function draftClockText(state=getDraftState()){const rem=draftSecondsRemaining(state);return draftIsOvertime(state)?`OVERTIME · ${clockText(rem)}`:clockText(rem);}
  function nextDraftTeam(state=getDraftState()){const order=draftOrder(state),idx=Math.max(0,Number(state.currentIndex||0));return order[idx+1]||'';}
  function advanceDraftLocal(reason='SUBMITTED') {
    const state=getDraftState(); if(!state.active)return state;
    const order=draftOrder(state),idx=Number(state.currentIndex||0),next=idx+1;
    const value={...state,currentIndex:next,currentPick:Number(state.currentPick||idx+1)+1,pickStartedAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    if(next>=order.length){value.active=false;value.endedAt=new Date().toISOString();}
    saveDraftState(value); return value;
  }
  function pushDraftPickBackLocal(){
    const state=getDraftState();
    if(!state.active)return {state,changed:false,reason:'Draft is closed.'};
    if(!draftIsOvertime(state))return {state,changed:false,reason:'The current pick is still inside its 3-minute clock.'};
    const order=draftOrder(state),idx=Math.max(0,Number(state.currentIndex||0)),next=idx+1;
    if(next>=order.length)return {state,changed:false,reason:'There is no later pick to promote.'};
    const currentPick=Number(state.currentPick||idx+1),lateTeam=order[idx]||'',promotedTeam=order[next]||'',newOrder=[...order];
    [newOrder[idx],newOrder[next]]=[newOrder[next],newOrder[idx]];
    const picks=Array.isArray(state.picks)?state.picks.map(rec=>({...rec})):[];
    const a=picks.find(rec=>Number(rec.pick)===currentPick),b=picks.find(rec=>Number(rec.pick)===currentPick+1);
    if(a&&b){const owner=a.owner;a.owner=b.owner;b.owner=owner;}
    const reorders=[...(state.reorders||[]),{pick:currentPick,pushedTo:currentPick+1,lateTeam,promotedTeam,timestamp:new Date().toISOString(),reason:'COMMISSIONER OVERTIME PUSH'}];
    const now=new Date().toISOString(),value={...state,order:newOrder,picks,pickStartedAt:now,updatedAt:now,reorders};
    saveDraftState(value);
    return {state:value,changed:true,lateTeam,promotedTeam,pick:currentPick};
  }
  function updateDraftClockUI(){
    const state=getDraftState(),rem=draftSecondsRemaining(state),overtime=draftIsOvertime(state),label=overtime?`OVERTIME · ${clockText(rem)}`:clockText(rem);
    const publicClock=document.getElementById('draft-countdown'); if(publicClock){publicClock.textContent=label;publicClock.classList?.toggle?.('overtime-clock',overtime);}
    const adminClock=document.getElementById('admin-draft-countdown'); if(adminClock){adminClock.textContent=label;adminClock.classList?.toggle?.('overtime-clock',overtime);}
    const publicBadge=document.getElementById('draft-clock-badge'); if(publicBadge){publicBadge.textContent=overtime?'OVERTIME':'3 MIN CLOCK';publicBadge.classList?.toggle?.('amber',overtime);}
    const adminBadge=document.getElementById('admin-draft-clock-badge'); if(adminBadge){adminBadge.textContent=overtime?'OVERTIME':'3 MIN CLOCK';adminBadge.classList?.toggle?.('amber',overtime);}
    const notice=document.getElementById('draft-overtime-notice'); if(notice)notice.style.display=overtime?'block':'none';
    const adminNotice=document.getElementById('admin-draft-overtime-notice'); if(adminNotice)adminNotice.style.display=overtime?'block':'none';
    const push=document.getElementById('push-draft-back'); if(push)push.disabled=!(overtime&&Boolean(nextDraftTeam(state)));
  }
  function startDraftTicker(){
    clearInterval(draftTicker);
    const tick=()=>updateDraftClockUI();
    tick(); draftTicker=setInterval(tick,1000);
  }

  function renderDraft() {
    const ds=getDraftState(),currentTeam=currentDraftTeam(ds),currentPick=Number(ds.currentPick||1),currentPickRec=Array.isArray(ds.picks)?ds.picks.find(p=>Number(p.pick)===currentPick):null;
    const selected=draftSelection?draftPlayerByName(draftSelection):null,results=availablePlayers(),liveDraftActions=getCommissionerActions().filter(a=>a.type==='Drafted'&&a.status==='CONFIRMED');
    const reversedDraftPicks=new Set(Object.keys(getTransactionReversals()).map(k=>LEGACY_TRANSACTION_META[k]).filter(m=>m?.type==='Drafted'&&m.pick).map(m=>`${m.pick}|${m.team}|${canonicalPlayerName(m.players?.[0]||'')}`));
    const draftSource=[...D.draft.filter(d=>!reversedDraftPicks.has(`${Number(d.pick||0)}|${d.team}|${canonicalPlayerName(d.player)}`)),...liveDraftActions.map(a=>({pick:a.pick,team:a.team,player:a.player,position:a.position,club:a.club,salary:a.salary,type:a.phase||''}))];
    const draftRows=draftSource.sort((a,b)=>(a.pick||0)-(b.pick||0)).map(d=>`<div class="draft-pick"><span class="pick-no">${d.pick}</span>${figurehead(d.team,'sm')}<span class="draft-player"><strong>${esc(d.player)}</strong><small>${esc(d.position)} - ${esc(d.club)} - ${esc(team(d.team).name)}</small></span><span class="money">${money(d.salary)}</span></div>`).join('');
    const pendingCurrent=proposalCache.find(p=>p.type==='DRAFT_PICK'&&p.status==='AWAITING_COMMISSIONER'&&Number(p.payload?.pick)===currentPick&&p.proposerTeam===currentTeam);
    const myTurn=ds.active&&teamLoggedIn()&&loggedTeamKey()===currentTeam;
    const draftSub=ds.active?`${Number(ds.season||draftSeasonFor(ds.type))} ${esc(ds.type||'Draft')} · Pick <strong>${currentPick}</strong> · ${team(currentTeam).name} (${team(currentTeam).owner}) · <strong id="draft-countdown" class="${draftIsOvertime(ds)?'overtime-clock':''}">${draftClockText(ds)}</strong>${currentPickRec&&currentPickRec.originalOwner!==currentPickRec.owner?` · <span class="muted-copy">slot originally ${esc(team(currentPickRec.originalOwner).owner)}</span>`:''}`:'The Commissioner starts and ends both pre-season and mid-season drafts.';
    const accessNotice=!ds.active?'Draft selections are closed.':!teamLoggedIn()?'<strong>Team Login required.</strong> Sign in as the coach whose franchise is on the clock to submit a pick.':myTurn?`<strong>Your pick is live.</strong> ${esc(team(currentTeam).name)} can submit the current selection.`:`<strong>Watching draft.</strong> You are signed in as ${esc(team(loggedTeamKey()).owner)}; only ${esc(team(currentTeam).owner)} can submit Pick ${currentPick}.`;
    const myDraftPhase=teamLoggedIn()?(ds.active?normalizedDraftType(ds.type):dashboardDraftPhase()):'',myDraftPicks=teamLoggedIn()?ownedDraftPicks(loggedTeamKey(),myDraftPhase,{excludePending:false}):[],myDraftAssets=teamLoggedIn()?`<section class="card my-draft-assets"><div>${teamIdentity(loggedTeamKey(),'sm')}<div><span class="eyebrow">Your draft assets · ${esc(myDraftPhase)}</span><h2>${myDraftPicks.length} pick${myDraftPicks.length===1?'':'s'} owned</h2></div></div><div class="my-draft-pick-row">${myDraftPicks.length?myDraftPicks.slice(0,12).map(p=>`<span><b>Pick ${p.pick}</b><small>R${p.round}${p.originalOwner!==p.owner?` · from ${esc(team(p.originalOwner).owner)}`:''}</small></span>`).join(''):'<span class="muted-copy">No picks currently owned in this draft.</span>'}</div></section>`:'';
    main.innerHTML=`${pageHeader('Draft centre',`${currentSeason()} Draft Room`,'Only the logged-in franchise on the clock can submit a player. Current prices are frozen when the Commissioner starts the draft.')}${myDraftAssets}
      <section class="card draft-status-card ${ds.active?'live-draft-card':''}"><div><span class="eyebrow">Draft status</span><h2>${ds.active?'LIVE - '+esc(ds.type||'Draft'):'Draft closed'}</h2><p>${draftSub}</p>${ds.active?`<div style="margin-top:12px">${teamIdentity(currentTeam,'sm')}</div>`:''}</div><span id="draft-clock-badge" class="badge ${ds.active?(draftIsOvertime(ds)?'amber':'red'):'neutral'}">${ds.active?(draftIsOvertime(ds)?'OVERTIME':'3 MIN CLOCK'):'CLOSED'}</span></section>
      ${ds.active?`<div class="notice ${myTurn?'':'warning-notice'}" style="margin-bottom:14px">${accessNotice}</div>`:''}
      ${ds.active?`<div id="draft-overtime-notice" class="notice danger" style="display:${draftIsOvertime(ds)?'block':'none'};margin-bottom:14px"><strong>Clock expired — ${esc(team(currentTeam).name)} remains on the clock.</strong> Nothing advances automatically. The Commissioner may push the overdue pick back one slot.</div>`:''}
      ${pendingCurrent?`<div class="notice pending-pick-notice"><strong>Selection awaiting Commissioner:</strong> ${esc(pendingCurrent.payload?.player||'')} is provisionally reserved.</div>`:''}
      <section class="draft-layout"><article class="card draft-board"><div class="section-title" style="padding:18px 18px 0"><div><span class="eyebrow">Completed</span><h2>Draft history</h2></div><span class="badge neutral">${draftSource.length} recorded picks</span></div>${draftRows}</article>
      <article class="card draft-sim"><span class="eyebrow">${ds.active?'Current selection':'Player explorer'}</span><h2>${ds.active?`${esc(team(currentTeam).name)} is on the clock`:'Draft selections are closed'}</h2><p class="muted-copy">${ds.active?'The available pool is the frozen pre-draft AFL/SuperCoach snapshot less PEGS-owned and provisionally selected players.':'You can inspect the most recently loaded player pool.'}</p>
      <div class="field-group"><label for="draft-search">Find available player</label><input class="search-input" id="draft-search" value="${esc(draftSearch)}" placeholder="Search player, club or position"></div>
      <div class="draft-search-results" id="draft-search-results">${results.map(p=>`<button class="player-option ${selected?.player===p.player?'selected':''}" data-action="select-draft-player" data-player="${esc(p.player)}"><span><strong>${esc(p.player)}</strong><small>${esc(p.position)} - ${esc(p.club)}${Number(p.average||0)?` - Avg ${Number(p.average).toFixed(1)}`:''}</small></span><span class="money"><strong>${money(p.price||p.startPrice)}</strong><small>${ds.active?'frozen':'price'}</small></span></button>`).join('')||'<div class="empty">No available players match.</div>'}</div>
      <div class="form-grid" style="margin-top:14px"><div class="field-group"><label for="draft-contract">Contract</label><select class="select" id="draft-contract"><option>Main</option><option>Rookie</option></select></div><div class="field-group"><label for="draft-status">List location</label><select class="select" id="draft-status"><option>Field</option><option>Interchange</option></select></div><div class="field-group"><label for="draft-fixed-position">PEGS position for contract</label><select class="select" id="draft-fixed-position" ${selected?'':'disabled'}>${selected?String(selected.position||'').split('/').map(pos=>`<option value="${esc(pos)}">${esc(pos)}</option>`).join(''):'<option>Select player first</option>'}</select></div></div>
      <div id="draft-check-output">${selected?draftCheckOutput(currentTeam,selected,'Main','Field',myTurn,Boolean(pendingCurrent),String(selected.position||'').split('/')[0]):'<div class="notice" style="margin-top:16px">Select an available player to run the salary-cap, list-size and positional checks.</div>'}</div></article></section>`;
    startDraftTicker();
  }

  async function handleDraftProposalSubmission() {
    const state=getDraftState(),key=currentDraftTeam(state),pick=Number(state.currentPick||1),p=draftSelection?draftPlayerByName(draftSelection):null;
    if(!state.active){toast('The draft is closed.');render();return;}
    if(!teamLoggedIn()){toast('Team Login required to draft.');return;}
    if(loggedTeamKey()!==key){toast(`It is ${team(key).owner}'s pick.`);return;}
    if(proposalCache.some(x=>x.type==='DRAFT_PICK'&&activeProposalStatus(x.status)&&Number(x.payload?.pick)===pick&&x.proposerTeam===key)){toast('This pick already has a submitted selection.');return;}
    const contract=document.getElementById('draft-contract')?.value||'Main',status=document.getElementById('draft-status')?.value||'Field',fixedPosition=document.getElementById('draft-fixed-position')?.value||String(p?.position||'').split('/')[0];
    const checks=validateDraft(key,p,contract,status,fixedPosition);if(!p||!checks.length||!checks.every(c=>c.pass)){toast('That selection is blocked by the league rules.');return;}
    try{
      await submitProposal({type:'DRAFT_PICK',phase:state.type||'Draft',proposerTeam:key,payload:{pick,draftSeason:Number(state.season||draftSeasonFor(state.type)),sessionId:state.sessionId||'',player:p.player,position:fixedPosition,club:p.club,salary:Number(p.price||p.startPrice||0),contract,listStatus:status,poolSessionId:state.poolSessionId||''}});
      if(backendConfigured()){
        const value=await backendFetch('/rest/v1/rpc/pegs_advance_draft_after_submission',{method:'POST',body:JSON.stringify({p_pick:pick,p_team:key})});
        if(value&&typeof value==='object')localStorage.setItem(DRAFT_STATE_KEY,JSON.stringify(value));await pullSharedState();
      }else advanceDraftLocal('SUBMITTED');
      draftSelection=null;toast(`Pick ${pick} submitted. Next franchise is on the clock.`);render();
    }catch(e){toast(e.message||'Could not submit the draft pick.');}
  }

  function draftCheckOutput(teamKey,player,contract,status,canSubmit=false,alreadyPending=false,fixedPosition='') {
    const checks=validateDraft(teamKey,player,contract,status,fixedPosition),pass=checks.length&&checks.every(c=>c.pass),buttonText=alreadyPending?'Selection already submitted':canSubmit?'Submit my pick':'Only team on clock can submit';
    return `<div class="draft-check"><div class="section-title"><h3>${esc(player.player)} - ${esc(player.position)}</h3><span class="badge ${pass?'green':'red'}">${pass?'Selection legal':'Selection blocked'}</span></div><div class="notice"><strong>Draft salary:</strong> ${money(player.price||player.startPrice)} — frozen from the current-price player pool captured before this draft.</div>${checks.map(c=>`<div class="rule-check"><span>${esc(c.label)}</span><span class="${c.pass?'check-pass':'check-fail'}">${c.pass?'PASS':'FAIL'} - ${esc(c.detail)}</span></div>`).join('')}<div class="button-row"><button class="primary-button" id="submit-draft-proposal" ${pass&&canSubmit&&!alreadyPending?'':'disabled'}>${buttonText}</button></div></div>`;
  }

  function modernTransactionRecord(action){return {timestamp:action.timestamp,type:action.type,team:action.team||action.teamA,detail:action.detail||'',status:action.status,_source:'modern',_action:action,_txKey:modernTransactionKey(action)};}
  function legacyTransactionRecord(x){return {...x,_source:'legacy',_txKey:legacyTransactionKey(x),_meta:LEGACY_TRANSACTION_META[legacyTransactionKey(x)]||null};}
  function transactionRecords(){return [...getCommissionerActions().filter(x=>x.status==='CONFIRMED').map(modernTransactionRecord),...visibleLegacyTransactions().map(legacyTransactionRecord)].sort((a,b)=>String(b.timestamp||'').localeCompare(String(a.timestamp||'')));}
  function transactionPlayers(x){
    if(x._source==='legacy')return [...new Set((x._meta?.players||[]).map(canonicalPlayerName).filter(Boolean))];
    const a=x._action||{},names=[];if(a.type==='Trade'){for(const m of a.moves||[])names.push(m.player);for(const v of Object.values(a.conditionalDelists||{}))names.push(...(v||[]));}else if(a.type==='Rookie swap')names.push(a.playerIn,a.playerOut);else if(['Rookie elevation','Drafted'].includes(a.type))names.push(a.player);else if(a.type==='Delisted')names.push(...(a.players||[a.player]));return [...new Set(names.map(canonicalPlayerName).filter(Boolean))];
  }
  function transactionPickRefs(x){
    if(x._source==='legacy'){
      const meta=x._meta||{},season=Number(String(x.timestamp||'').slice(0,4))||currentSeason(),phase=normalizedDraftType(meta.draftType||'Mid-Season');
      if(String(x.type)==='Trade')return [...new Set([...(meta.picksA||[]),...(meta.picksB||[])].map(n=>draftPickRef('Mid-Season',Number(n),season)).filter(Boolean))];
      if(String(x.type)==='Drafted'&&Number(meta.pick||0)>0)return [draftPickRef(phase,Number(meta.pick),season)];
      return [];
    }
    const a=x._action||{};
    if(String(x.type)==='Trade')return [...new Set(actionPickTransfers(a).map(v=>draftPickRef(v.type||a.phase,Number(v.pick||0),Number(v.season||draftSeasonFor(v.type||a.phase)))).filter(v=>!v.endsWith('|0')))];
    if(String(x.type)==='Drafted'&&Number(a.pick||0)>0)return [draftPickRef(a.phase||'Pre-Season',Number(a.pick),Number(a.draftSeason||a.season||draftSeasonFor(a.phase||'Pre-Season')))];
    return [];
  }
  function transactionDependency(x){
    const players=new Set(transactionPlayers(x)),pickRefs=new Set(transactionPickRefs(x)),ts=String(x.timestamp||'');
    const later=transactionRecords().filter(y=>y._txKey!==x._txKey&&String(y.timestamp||'')>ts);
    if(String(x.type)==='Drafted'){
      const a=x._action||{},phase=normalizedDraftType(a.phase||x._meta?.draftType||'');const dep=later.find(y=>String(y.type)==='Drafted'&&normalizedDraftType(y._action?.phase||y._meta?.draftType||'')===phase);if(dep)return dep;
    }
    const pickDep=later.find(y=>transactionPickRefs(y).some(ref=>pickRefs.has(ref)));if(pickDep)return pickDep;
    return later.find(y=>transactionPlayers(y).some(p=>players.has(p)))||null;
  }
  function transactionItem(x,allowReverse=false) {
    const typeClass='type-'+String(x.type).toLowerCase().replaceAll(' ','-'),canReverse=allowReverse&&commissionerLoggedIn(),open=canReverse&&reversingTransactionKey===x._txKey,dependency=open?transactionDependency(x):null;
    const reverse=`${canReverse?`<button class="secondary-button compact-button danger-button" data-reverse-transaction="${encodeURIComponent(x._txKey)}">Reverse</button>`:''}`;
    const confirmPanel=open?`<div class="transaction-reverse-confirm"><div class="notice danger"><strong>Permanent transaction reversal.</strong> Commissioner Mode is active. This removes the original transaction from Moves and reverses its roster effect. A separate Commissioner audit record and recovery backup are retained.</div>${dependency?`<div class="notice danger"><strong>Reverse a later dependent transaction first.</strong> ${esc(dependency.type)} · ${esc(dependency.detail)}</div>`:`<label class="destructive-confirm"><input type="checkbox" id="reverse-transaction-confirm"> <span>I confirm I want to reverse this transaction and delete the original transaction from Moves.</span></label><div class="button-row"><button class="primary-button danger-action" data-confirm-reverse-transaction="${encodeURIComponent(x._txKey)}">Confirm reversal & delete</button><button class="secondary-button" data-cancel-reverse-transaction>Cancel</button></div>`}</div>`:'';
    return `<div class="transaction-item-wrap"><div class="transaction-item">${figurehead(x.team,'sm')}<div class="transaction-body"><strong class="${typeClass}">${esc(x.type)} - ${esc(team(x.team).owner)}</strong><p>${esc(x.detail)}</p><time>${fmtDate(x.timestamp)}</time></div><div class="transaction-actions">${reverse}</div></div>${confirmPanel}</div>`;
  }

  async function reverseTransaction(key){
    if(!commissionerLoggedIn())throw new Error('Commissioner Mode is not active. Log in again.');const tx=transactionRecords().find(x=>x._txKey===key);if(!tx)throw new Error('That transaction no longer exists.');const dep=transactionDependency(tx);if(dep)throw new Error(`Reverse the later ${dep.type} transaction first: ${dep.detail}`);
    const backupId=backendConfigured()?await createServerBackup('TRANSACTION_REVERSAL',`${tx.type} · ${tx.detail}`):null;
    if(tx._source==='modern'){
      if(backendConfigured()){
        const updated=await commissionerFetch('/rest/v1/rpc/pegs_reverse_commissioner_action',{method:'POST',body:JSON.stringify({p_action:tx._action})});localStorage.setItem(COMM_ACTIONS_KEY,JSON.stringify(Array.isArray(updated)?updated:[]));
      }else{saveCommissionerActions(getCommissionerActions().filter(a=>modernTransactionKey(a)!==key));}
      const a=tx._action||{},state=getDraftState();if(a.type==='Drafted'&&a.sessionId&&state.sessionId===a.sessionId&&Number(state.currentPick||0)===Number(a.pick||0)+1){saveDraftState({...state,active:true,currentIndex:Math.max(0,Number(a.pick||1)-1),currentPick:Number(a.pick||1),pickStartedAt:new Date().toISOString(),endedAt:null,updatedAt:new Date().toISOString()});}
    }else{
      const all=getTransactionReversals();all[key]={deletedAt:new Date().toISOString(),type:tx.type,team:tx.team,detail:tx.detail,timestamp:tx.timestamp};saveTransactionReversals(all);if(backendConfigured())await pushSharedState('transaction_reversals',all);
      if(backendConfigured()&&String(tx.type).toUpperCase()==='ROOKIE UPGRADE')await commissionerFetch('/rest/v1/rpc/pegs_reverse_legacy_rookie_elevation',{method:'POST',body:JSON.stringify({p_team:tx.team,p_player:tx._meta?.players?.[0]||'',p_season:actionSeason(tx)})});
      if(backendConfigured())await logCommissioner('LEGACY_TRANSACTION_REVERSED','transaction',key,{type:tx.type,team:tx.team,detail:tx.detail,backupId});
    }
    await syncServerAuthority();if(backendConfigured())await pullSharedState();reversingTransactionKey='';return true;
  }

  function proposalTypeLabel(p){
    return p.type==='TRADE'?'Trade proposal':p.type==='SWAP'?'Field / Rookie swap':p.type==='DELIST'?'Delisting request':p.type==='ELEVATION'?'Rookie elevation':'Draft selection';
  }
  function proposalSummary(p){
    const x=p.payload||{};
    if(p.type==='TRADE'){
      const a=x.assetsA||{players:[],picks:[]},b=x.assetsB||{players:[],picks:[]},da=x.conditionalDelistsA||[],db=x.conditionalDelistsB||[];
      const fmt=v=>[...(v.players||[]),...(v.picks||[]).map(n=>pickLabel(n,p.phase))].join(', ')||'No assets';
      const delistText=(names=[])=>names.length?` · conditional delist ${names.join(', ')}`:'';
      return `${team(p.proposerTeam).name} sends ${fmt(a)}${delistText(da)} · ${team(p.counterpartyTeam).name} sends ${fmt(b)}${delistText(db)}`;
    }
    if(p.type==='SWAP') return `${x.playerIn||''} → Field · ${x.playerOut||''} → Interchange`;
    if(p.type==='DELIST') return `${(x.players||[]).join(', ')||'No players selected'}`;
    if(p.type==='ELEVATION') return `${x.player||''}: Rookie → Main · ${x.position||''} · ${money(x.newSalary||0)}`;
    if(p.type==='DRAFT_PICK') return `Pick ${x.pick}: ${x.player||''} (${x.position||''})`;
    return '';
  }
  function proposalCards(items,commissioner=false){
    if(!items.length)return '<div class="empty">No proposals here.</div>';
    const tone=status=>['APPROVED'].includes(status)?'green':['REJECTED','DECLINED','CANCELLED'].includes(status)?'red':'amber';
    return items.map(p=>`<article class="proposal-card"><div class="proposal-card-head"><div>${teamIdentity(p.proposerTeam,'sm')}<span class="badge ${tone(p.status)}">${esc(String(p.status||'').replaceAll('_',' '))}</span></div><time>${fmtDate(p.createdAt)}</time></div><strong>${esc(proposalTypeLabel(p))}${p.phase?' · '+esc(p.phase):''}</strong><p>${esc(proposalSummary(p))}</p>${commissioner&&p.status==='AWAITING_COMMISSIONER'?`<div class="button-row"><button class="primary-button" data-proposal-approve="${esc(p.id)}">Approve</button><button class="secondary-button" data-proposal-reject="${esc(p.id)}">Reject</button></div>`:''}</article>`).join('');
  }

  function renderTransactions() {
    clearInteractionDraft();
    const logged=teamLoggedIn(),myTeam=loggedTeamKey(),params=new URLSearchParams(location.hash.split('?')[1]||''),allTx=transactionRecords(),types=['All',...new Set(allTx.map(x=>x.type))],selected=params.get('type')||'All',scope=logged?(params.get('scope')||transactionScope||'mine'):'all';
    transactionScope=scope==='all'?'all':'mine';
    const scopedTx=transactionScope==='mine'&&logged?allTx.filter(x=>transactionInvolvesTeam(x,myTeam)):allTx,rows=scopedTx.filter(x=>selected==='All'||x.type===selected).slice(0,250);
    const windows=getProposalWindows(),tradeOpen=Boolean(windows.trade.open),delistOpen=Boolean(windows.delist.open),elevationOpen=Boolean(windows.elevation?.open),tradePhase=windows.trade.phase||'Pre-Season',delistPhase=windows.delist.phase||'Pre-Season',elevationPhase=windows.elevation?.phase||'Pre-Season',elevationSeason=Number(windows.elevation?.season||elevationSeasonFor(elevationPhase)),conditionalDelistOpen=tradeOpen&&delistOpen&&String(tradePhase)===String(delistPhase);
    const tradeStatus=tradeOpen?`<span class="badge green">OPEN · ${esc(tradePhase)}</span>`:'<span class="badge red">CLOSED</span>',delistStatus=delistOpen?`<span class="badge green">OPEN · ${esc(delistPhase)}</span>`:'<span class="badge red">CLOSED</span>',elevationStatus=elevationOpen?`<span class="badge green">OPEN · ${esc(elevationPhase)}</span>`:'<span class="badge red">CLOSED</span>';
    const pendingMine=logged?proposalCache.filter(p=>activeProposalStatus(p.status)&&(p.proposerTeam===myTeam||p.counterpartyTeam===myTeam)&&p.type!=='DRAFT_PICK'):[],incoming=logged?incomingTradeRequests():[];
    const playerSlots=(side,key='')=>[1,2,3].map(i=>`<div class="field-group"><label>Player ${i} (optional)</label><select class="select proposal-player" id="proposal-player-${side}-${i}" data-side="${side}" ${key&&tradeOpen?'':'disabled'}>${playerOptions(key,null,'No player')}</select></div>`).join('');
    const pickSlots=(side,key='',phase=tradePhase)=>[1,2,3].map(i=>`<div class="field-group"><label>Draft pick ${i} (optional)</label><select class="select proposal-pick" id="proposal-pick-${side}-${i}" data-side="${side}" ${key&&tradeOpen?'':'disabled'}>${pickOptions(key,phase,'No pick')}</select></div>`).join('');
    const conditionalDelistSlots=(side,key='')=>[1,2,3].map(i=>`<div class="field-group"><label>Conditional delist ${i} (optional)</label><select class="select proposal-conditional-delist" id="proposal-delist-${side}-${i}" data-side="${side}" ${key&&conditionalDelistOpen?'':'disabled'}>${playerOptions(key,null,'No conditional delist')}</select></div>`).join('');
    const incomingCards=incoming.map(p=>{const x=p.payload||{},a=x.assetsA||{players:[],picks:[]},b=x.assetsB||{players:[],picks:[]},da=x.conditionalDelistsA||[],db=x.conditionalDelistsB||[],after=effectiveRosters(tradeActionFor(p.proposerTeam,p.counterpartyTeam,a,b,da,db)),legalNow=rosterIsLegal(after[p.proposerTeam]||[])&&rosterIsLegal(after[p.counterpartyTeam]||[]);return `<article class="proposal-card incoming-trade-card"><div class="proposal-card-head"><div>${teamIdentity(p.proposerTeam,'sm')}<span class="badge ${legalNow?'amber':'red'}">${legalNow?'YOUR DECISION':'NOW BLOCKED'}</span></div><time>${fmtDate(p.createdAt)}</time></div><strong>Trade request from ${esc(team(p.proposerTeam).owner)}</strong><p>${esc(proposalSummary(p))}</p>${(da.length||db.length)?'<div class="notice conditional-trade-note"><strong>Conditional delistings included.</strong> These players are removed only if you accept this trade and the Commissioner approves the whole transaction.</div>':''}${tradeVisualAssetsHtml(p.proposerTeam,p.counterpartyTeam,a,b,p.phase||'Pre-Season',da,db)}${tradeImpactHtml(p.proposerTeam,p.counterpartyTeam,a,b,da,db)}${legalNow?'':`<div class="notice danger"><strong>This trade cannot currently be accepted.</strong> One or both franchises would breach a salary, list or Field-position rule after all trade assets and conditional delistings are applied.</div>`}<div class="button-row"><button class="primary-button" data-trade-accept="${esc(p.id)}" ${legalNow?'':'disabled'}>${legalNow?'Accept whole trade & send to Commissioner':'Cannot accept'}</button><button class="secondary-button" data-trade-decline="${esc(p.id)}">Decline</button></div></article>`;}).join('');
    const elevationUsed=logged?rookieElevationsUsed(myTeam,elevationSeason):0,pendingElevation=logged?proposalCache.some(p=>activeProposalStatus(p.status)&&p.type==='ELEVATION'&&p.proposerTeam===myTeam&&Number(p.payload?.season||elevationSeason)===elevationSeason):false;
    const rookieOptions=logged?`<option value="">Select rookie player</option>`+(effectiveRosters()[myTeam]||[]).filter(p=>String(p.contract).toLowerCase()==='rookie').sort((a,b)=>a.player.localeCompare(b.player)).map(p=>`<option value="${esc(p.player)}">${esc(p.player)} · ${esc(p.position)} · ${esc(p.status)} · ${money(p.salary)}</option>`).join(''):'';
    const teamTools=logged?`<section class="team-moves-banner card card-pad"><div>${teamIdentity(myTeam,'sm')}<div><span class="eyebrow">Signed in as coach</span><h2>${esc(team(myTeam).owner)}</h2><p>Every form below is locked to ${esc(team(myTeam).name)}.</p></div></div><button class="secondary-button" id="moves-team-logout">Log out</button></section>
      ${incoming.length?`<section class="card card-pad incoming-trades"><div class="section-title"><div><span class="eyebrow">Action required</span><h2>Trade requests</h2></div><span class="badge amber">${incoming.length}</span></div><div class="proposal-list">${incomingCards}</div></section>`:''}
      <section class="proposal-grid"><article class="card card-pad"><div class="section-title"><div><span class="eyebrow">${esc(team(myTeam).owner)} proposes</span><h2>Trade proposal</h2></div>${tradeStatus}</div>
      ${tradeOpen?`<div class="notice"><strong>${esc(tradePhase)} trading is open.</strong> PEGS checks both franchises before allowing submission. The other coach must accept before the Commissioner sees it.${conditionalDelistOpen?' Because delisting is also open, this trade can include up to three conditional delistings for each franchise.':' Conditional trade delistings are available only while the matching delisting window is also open.'}</div>`:`<div class="notice danger"><strong>Trading is closed.</strong></div>`}<input type="hidden" id="proposal-phase" value="${esc(tradePhase)}"><input type="hidden" id="proposal-team-a" value="${esc(myTeam)}">
      <div class="form-grid" style="margin-top:14px"><div class="field-group"><label>Your team</label><input class="search-input" value="${esc(team(myTeam).name)} (${esc(team(myTeam).owner)})" disabled></div><div class="field-group"><label for="proposal-team-b">Trade partner</label><select class="select" id="proposal-team-b" ${tradeOpen?'':'disabled'}><option value="">Select trade partner…</option>${D.teams.filter(t=>t.key!==myTeam).map(t=>`<option value="${t.key}">${esc(t.name)} (${esc(t.owner)})</option>`).join('')}</select></div><div id="proposal-pick-owner-note" class="field-help"></div></div>
      <div class="trade-sides"><div class="trade-side"><h3 id="proposal-side-a-title">${esc(team(myTeam).name)} sends</h3><div id="proposal-side-a-players">${playerSlots('a',myTeam)}</div><div id="proposal-side-a-picks">${pickSlots('a',myTeam)}</div>${conditionalDelistOpen?`<div class="conditional-delist-builder"><div class="conditional-delist-builder-head"><span class="eyebrow">Conditional on this trade</span><strong>Delist up to 3</strong></div><p>Only occurs if the complete trade is accepted and approved.</p><div id="proposal-side-a-delists">${conditionalDelistSlots('a',myTeam)}</div></div>`:''}</div><div class="trade-arrow">⇄</div><div class="trade-side"><h3 id="proposal-side-b-title">Trade partner sends</h3><div id="proposal-side-b-players">${playerSlots('b')}</div><div id="proposal-side-b-picks">${pickSlots('b')}</div>${conditionalDelistOpen?`<div class="conditional-delist-builder"><div class="conditional-delist-builder-head"><span class="eyebrow">Conditional on this trade</span><strong>Delist up to 3</strong></div><p>The other coach accepts these delistings as part of the whole trade.</p><div id="proposal-side-b-delists">${conditionalDelistSlots('b')}</div></div>`:''}</div></div>
      <div class="trade-visual-title"><div><span class="eyebrow">Visual proposal</span><h3>Complete trade package</h3></div><span>Players, picks and conditional delistings update live as you build the trade.</span></div><div id="proposal-trade-visual" class="trade-visual-shell"><div class="trade-visual-empty trade-visual-empty-wide">Choose a trade partner to open the visual trade board.</div></div>
      <div id="proposal-trade-validation" style="margin-top:14px"><div class="notice">Choose a trade partner and assets. PEGS will show both teams' before/after salary, list and field-position impact.</div></div><div class="button-row"><button class="primary-button" id="submit-trade-proposal" disabled>Send trade request</button></div></article>
      <div class="proposal-side-stack"><article class="card card-pad"><div class="section-title"><div><span class="eyebrow">My team</span><h2>Field / Rookie swap</h2></div><span class="badge neutral">Commissioner approval</span></div><p class="muted-copy">Move one Interchange player onto the Field and one Field player to Interchange. Contracts and salaries stay unchanged. A dual-position player must nominate the PEGS position used when entering the Field.</p><input type="hidden" id="proposal-swap-team" value="${esc(myTeam)}"><div class="form-grid"><div class="field-group"><label>Interchange → Field</label><select class="select" id="proposal-swap-in">${playerOptions(myTeam,'Interchange','Select interchange player')}</select></div><div class="field-group"><label>Field → Interchange</label><select class="select" id="proposal-swap-out">${playerOptions(myTeam,'Field','Select field player')}</select></div><div class="field-group" id="proposal-swap-position-group" style="display:none"><label for="proposal-swap-position">PEGS Field position</label><select class="select" id="proposal-swap-position"></select><small class="field-help">For a dual-position rookie, this nominates the fixed PEGS position when they first enter the Field.</small></div></div><div id="proposal-swap-validation" style="margin-top:14px"></div><div class="button-row"><button class="primary-button" id="submit-swap-proposal" disabled>Submit my swap</button></div></article>
      <article class="card card-pad"><div class="section-title"><div><span class="eyebrow">My team</span><h2>Rookie elevation</h2></div>${elevationStatus}</div>${elevationOpen?`<div class="notice"><strong>${esc(elevationPhase)} rookie elevations are open for ${elevationSeason}.</strong> PEGS will retrieve the player's current SuperCoach price and eligible positions before submission.</div>`:`<div class="notice danger"><strong>Rookie elevations are closed.</strong></div>`}<div class="notice"><strong>Elevations used:</strong> ${elevationUsed} / 1${pendingElevation?' · one request is already pending':''}.</div><div class="form-grid"><div class="field-group"><label for="proposal-elevation-player">Rookie player</label><select class="select" id="proposal-elevation-player" ${elevationOpen&&elevationUsed<1&&!pendingElevation?'':'disabled'}>${rookieOptions}</select></div><div class="field-group"><label for="proposal-elevation-position">New Main contract position</label><select class="select" id="proposal-elevation-position" disabled><option value="">Select player first</option></select></div></div><div id="proposal-elevation-validation" style="margin-top:14px"><div class="notice">Select a Rookie contract player to retrieve the live upgrade price and calculate the salary/position impact.</div></div><div class="button-row"><button class="primary-button" id="submit-elevation-proposal" disabled>Request rookie elevation</button></div></article>
      <article class="card card-pad"><div class="section-title"><div><span class="eyebrow">My team</span><h2>Delisting request</h2></div>${delistStatus}</div>${delistOpen?`<div class="notice"><strong>${esc(delistPhase)} delisting is open.</strong> Choose one or more players from your roster.</div>`:`<div class="notice danger"><strong>Delisting is closed.</strong></div>`}<input type="hidden" id="proposal-delist-team" value="${esc(myTeam)}"><div id="proposal-delist-players" class="delist-player-grid"></div><div id="proposal-delist-validation" style="margin-top:12px"></div><div class="button-row"><button class="primary-button" id="submit-delist-proposal" disabled>Submit my delisting</button></div></article></div></section>
      <section class="card card-pad" style="margin-top:16px"><div class="section-title"><div><span class="eyebrow">My requests</span><h2>Pending team actions</h2></div><span class="badge amber">${pendingMine.length}</span></div><div class="proposal-list">${proposalCards(pendingMine)}</div></section>`:`<section class="card card-pad team-login-required"><div class="section-title"><div><span class="eyebrow">Franchise controls</span><h2>Team Login required</h2></div><button class="primary-button" id="moves-open-team-login">Team Login</button></div><p>League moves remain publicly visible, but only the authenticated coach can propose trades, swaps, rookie elevations, delistings or submit draft picks for their franchise.</p></section>`;
    main.innerHTML=`${pageHeader('League moves','Moves & Trades','Team accounts control submissions. A trade must be legal for both teams, accepted by the other coach, then approved by the Commissioner.')}
      <section class="move-window-strip"><div><span>Trading</span>${tradeStatus}</div><div><span>Draft</span><span class="badge ${getDraftState().active?'green':'red'}">${getDraftState().active?'OPEN · '+esc(getDraftState().type||'Draft'):'CLOSED'}</span></div><div><span>Rookie elevation</span>${elevationStatus}</div><div><span>Delisting</span>${delistStatus}</div></section>${teamTools}
      <section style="margin-top:24px">${pageHeader('Audit trail',logged&&transactionScope==='mine'?'My Confirmed Transactions':'Confirmed Transactions',logged&&transactionScope==='mine'?`Confirmed league moves involving ${team(myTeam).name}. Switch to All League to inspect the full audit trail.`:'Only fully approved moves appear in the official transaction history.')}${logged?`<div class="transaction-scope-toolbar"><button class="tab-button ${transactionScope==='mine'?'active':''}" data-action="tx-scope" data-scope="mine">My Moves</button><button class="tab-button ${transactionScope==='all'?'active':''}" data-action="tx-scope" data-scope="all">All League</button></div>`:''}<div class="transaction-toolbar">${types.map(t=>`<button class="tab-button ${selected===t?'active':''}" data-action="tx-filter" data-type="${esc(t)}">${esc(t)}</button>`).join('')}</div><div class="card card-pad transaction-table"><div class="transaction-list">${rows.length?rows.map(x=>transactionItem(x,true)).join(''):`<div class="empty">No ${transactionScope==='mine'?'franchise ':''}transactions match this filter.</div>`}</div></div></section>`;
    document.getElementById('moves-open-team-login')?.addEventListener('click',()=>{void teamLoginUI();teamDialog.showModal();});document.getElementById('moves-team-logout')?.addEventListener('click',()=>{teamCredentialCache=[];clearBackendSession();proposalCache=[];void syncProposals().then(()=>renderTransactions());toast('Team logged out.');});
    document.querySelectorAll('[data-trade-accept]').forEach(btn=>btn.addEventListener('click',async()=>{try{await respondTrade(btn.dataset.tradeAccept,true);toast('Trade accepted and sent to the Commissioner.');renderTransactions();}catch(e){toast(e.message||'Trade could not be accepted.');}}));
    document.querySelectorAll('[data-trade-decline]').forEach(btn=>btn.addEventListener('click',async()=>{try{await respondTrade(btn.dataset.tradeDecline,false);toast('Trade declined.');renderTransactions();}catch(e){toast(e.message||'Trade could not be declined.');}}));
    document.querySelectorAll('[data-reverse-transaction]').forEach(btn=>btn.addEventListener('click',()=>{reversingTransactionKey=decodeURIComponent(btn.dataset.reverseTransaction||'');renderTransactions();}));
    document.querySelectorAll('[data-cancel-reverse-transaction]').forEach(btn=>btn.addEventListener('click',()=>{reversingTransactionKey='';renderTransactions();}));
    document.querySelectorAll('[data-confirm-reverse-transaction]').forEach(btn=>btn.addEventListener('click',async()=>{const confirmEl=document.getElementById('reverse-transaction-confirm');if(!confirmEl?.checked){toast('Tick the confirmation box before reversing the transaction.');return;}try{btn.disabled=true;await reverseTransaction(decodeURIComponent(btn.dataset.confirmReverseTransaction||''));toast('Transaction reversed and removed from Moves.');renderTransactions();}catch(e){btn.disabled=false;toast(e.message||'Transaction could not be reversed.');}}));
    if(!logged)return;
    const phase=document.getElementById('proposal-phase'),ta={value:myTeam},tb=document.getElementById('proposal-team-b'),tv=document.getElementById('proposal-trade-validation'),visual=document.getElementById('proposal-trade-visual'),submitTrade=document.getElementById('submit-trade-proposal'),ownerNote=document.getElementById('proposal-pick-owner-note');
    const sidePlayers=side=>[1,2,3].map(i=>document.getElementById(`proposal-player-${side}-${i}`)?.value||'').filter(Boolean),sidePicks=side=>[1,2,3].map(i=>document.getElementById(`proposal-pick-${side}-${i}`)?.value||'').filter(Boolean),sideConditionalDelists=side=>conditionalDelistOpen?[1,2,3].map(i=>document.getElementById(`proposal-delist-${side}-${i}`)?.value||'').filter(Boolean):[];
    const tradeValidation=()=>{
      if(!tradeOpen){tv.innerHTML='<div class="notice danger">Trading is closed.</div>';if(visual)visual.innerHTML='<div class="trade-visual-empty trade-visual-empty-wide">Trading is closed.</div>';submitTrade.disabled=true;return false;}
      const a=myTeam,b=tb.value,type=phase.value,pa=sidePlayers('a'),pb=sidePlayers('b'),pka=sidePicks('a'),pkb=sidePicks('b'),da=sideConditionalDelists('a'),db=sideConditionalDelists('b'),assetsA={players:pa,picks:pka},assetsB={players:pb,picks:pkb};
      if(visual)visual.innerHTML=tradeVisualAssetsHtml(a,b,assetsA,assetsB,type,da,db);
      if(!b){tv.innerHTML='<div class="notice">Choose a trade partner to calculate impact.</div>';submitTrade.disabled=true;return false;}
      const duplicate=pa.length!==new Set(pa).size||pb.length!==new Set(pb).size||pka.length!==new Set(pka).size||pkb.length!==new Set(pkb).size||da.length!==new Set(da).size||db.length!==new Set(db).size;
      const delistTradeConflict=da.some(name=>pa.includes(name))||db.some(name=>pb.includes(name));
      const current=effectiveRosters(),ownsConditionalDelists=da.every(name=>(current[a]||[]).some(r=>r.player===name))&&db.every(name=>(current[b]||[]).some(r=>r.player===name));
      const delistTermsValid=(da.length<=3&&db.length<=3&&(!da.length&&!db.length||conditionalDelistOpen));
      const action=tradeActionFor(a,b,assetsA,assetsB,da,db),after=effectiveRosters(action),legalA=rosterIsLegal(after[a]||[]),legalB=rosterIsLegal(after[b]||[]),ownA=picksOwnedBy(a,pka,type),ownB=picksOwnedBy(b,pkb,type),hasEach=(pa.length+pka.length)>0&&(pb.length+pkb.length)>0;
      const ok=!duplicate&&!delistTradeConflict&&delistTermsValid&&ownsConditionalDelists&&hasEach&&ownA&&ownB&&legalA&&legalB;
      const conditionalSummary=(da.length||db.length)?`<div class="notice conditional-trade-note"><strong>Conditional delistings:</strong> ${esc(team(a).name)} ${da.length?esc(da.join(', ')):'none'} · ${esc(team(b).name)} ${db.length?esc(db.join(', ')):'none'}. They occur only if the entire trade is accepted and Commissioner-approved.</div>`:(conditionalDelistOpen?'<div class="notice"><strong>Optional:</strong> both franchises may include up to three conditional delistings in this trade.</div>':'');
      tv.innerHTML=`<div class="trade-impact-intro"><strong>Live trade impact · before submission</strong><span>Recalculates the final roster after traded players, picks and conditional delistings are applied together.</span></div>${conditionalSummary}${tradeImpactHtml(a,b,assetsA,assetsB,da,db)}${duplicate?'<div class="notice danger">The same player, pick or conditional delisting cannot be selected twice on one side.</div>':''}${delistTradeConflict?'<div class="notice danger">A player cannot be both traded away and conditionally delisted by the same franchise.</div>':''}${!hasEach?'<div class="notice danger">Each team must send at least one player or draft pick. A conditional delisting is not a traded asset.</div>':''}${!ownA||!ownB?'<div class="notice danger">A selected draft pick is no longer owned by the offering team.</div>':''}${!ownsConditionalDelists?'<div class="notice danger">A conditional delisting player is no longer owned by that franchise.</div>':''}${!delistTermsValid?'<div class="notice danger">Conditional delistings require the matching delisting window to be open and are limited to three per franchise.</div>':''}${!legalA?`<div class="notice danger"><strong>${esc(team(a).name)} cannot accommodate the complete transaction.</strong> Adjust trade assets or conditional delistings until every rule is green.</div>`:''}${!legalB?`<div class="notice danger"><strong>${esc(team(b).name)} cannot accommodate the complete transaction.</strong> The receiving coach could not legally accept these terms.</div>`:''}`;
      submitTrade.disabled=!ok;submitTrade.textContent=ok?`Send complete request to ${team(b).owner}`:'Trade blocked';return ok;
    };
    const bindTradeAssets=()=>document.querySelectorAll('.proposal-player,.proposal-pick,.proposal-conditional-delist').forEach(x=>{x.addEventListener('change',tradeValidation);x.addEventListener('input',tradeValidation);});
    const renderPartnerAssets=()=>{const b=tb.value,type=phase.value;document.getElementById('proposal-side-b-title').textContent=b?team(b).name+' sends':'Trade partner sends';document.getElementById('proposal-side-b-players').innerHTML=playerSlots('b',b);document.getElementById('proposal-side-b-picks').innerHTML=pickSlots('b',b,type);if(conditionalDelistOpen&&document.getElementById('proposal-side-b-delists'))document.getElementById('proposal-side-b-delists').innerHTML=conditionalDelistSlots('b',b);ownerNote.innerHTML=`<strong>${esc(team(myTeam).owner)}</strong> owns ${ownedDraftPicks(myTeam,type).map(p=>'Pick '+p.pick).join(', ')||'no available '+esc(type)+' picks'}.${conditionalDelistOpen?' Conditional delistings are part of this trade and do not execute separately.':''}`;bindTradeAssets();tradeValidation();};
    tb?.addEventListener('change',renderPartnerAssets);bindTradeAssets();tradeValidation();
    submitTrade?.addEventListener('click',async()=>{if(!tradeValidation()){toast('Fix the blocked trade before submitting.');return;}const b=tb.value,assetsA={players:sidePlayers('a'),picks:sidePicks('a')},assetsB={players:sidePlayers('b'),picks:sidePicks('b')},conditionalDelistsA=sideConditionalDelists('a'),conditionalDelistsB=sideConditionalDelists('b');try{await submitProposal({type:'TRADE',phase:phase.value,proposerTeam:myTeam,counterpartyTeam:b,payload:{assetsA,assetsB,conditionalDelistsA,conditionalDelistsB}});toast(`Trade request sent to ${team(b).owner}. Conditional delistings, if any, are locked to this trade.`);renderTransactions();}catch(e){toast(e.message||'Could not submit the trade.');}});
    const st=document.getElementById('proposal-swap-team'),si=document.getElementById('proposal-swap-in'),so=document.getElementById('proposal-swap-out'),sp=document.getElementById('proposal-swap-position'),spg=document.getElementById('proposal-swap-position-group'),sv=document.getElementById('proposal-swap-validation'),submitSwap=document.getElementById('submit-swap-proposal'),usedCount=k=>visibleLegacyTransactions().filter(x=>x.type==='Rookie swap'&&x.team===k).length+getCommissionerActions().filter(x=>x.type==='Rookie swap'&&x.team===k&&x.status==='CONFIRMED').length;
    const swapIncoming=()=>((effectiveRosters()[myTeam]||[]).find(p=>p.player===si.value)||null);
    const refreshSwapPosition=()=>{const rec=swapIncoming(),choices=positionChoices(rec?.position||'');sp.innerHTML=choices.map(pos=>`<option value="${esc(pos)}">${esc(pos)}</option>`).join('');sp.disabled=!choices.length;spg.style.display=choices.length>1?'block':'none';if(choices.length)sp.value=choices[0];validateSwap();};
    const validateSwap=()=>{const rec=swapIncoming(),choices=positionChoices(rec?.position||''),fieldPosition=String(sp?.value||choices[0]||'').toUpperCase(),before=effectiveRosters(),action={type:'Rookie swap',status:'CONFIRMED',team:myTeam,playerIn:si.value,playerOut:so.value,playerInPosition:fieldPosition},after=effectiveRosters(action),validPosition=Boolean(rec&&choices.includes(fieldPosition)),ok=Boolean(si.value&&so.value)&&validPosition&&usedCount(myTeam)<D.rules.maxSwaps&&rosterIsLegal(after[myTeam]||[]);sv.innerHTML=(si.value&&so.value?rosterImpactTeamHtml(myTeam,before[myTeam]||[],after[myTeam]||[],'After proposed swap'):'<div class="notice">Select the Interchange player coming in and the Field player going out.</div>')+`<div class="notice"><strong>Season swaps:</strong> ${usedCount(myTeam)} / ${D.rules.maxSwaps} already confirmed.${choices.length>1?` <strong>${esc(rec.player)}</strong> is dual-position; ${esc(fieldPosition||'choose a position')} will be used on the Field.`:''}</div>`+(!ok&&si.value&&so.value?'<div class="notice danger">This swap is blocked until the resulting roster passes every salary, list and Field-position rule.</div>':'');submitSwap.disabled=!ok;return ok;};si?.addEventListener('change',refreshSwapPosition);so?.addEventListener('change',validateSwap);sp?.addEventListener('change',validateSwap);refreshSwapPosition();submitSwap?.addEventListener('click',async()=>{if(!validateSwap())return;try{await submitProposal({type:'SWAP',phase:'In-Season',proposerTeam:myTeam,payload:{playerIn:si.value,playerOut:so.value,fieldPosition:String(sp.value||'').toUpperCase()}});toast('Swap sent to the Commissioner.');renderTransactions();}catch(e){toast(e.message||'Could not submit the swap.');}});

    const ep=document.getElementById('proposal-elevation-player'),epp=document.getElementById('proposal-elevation-position'),ev=document.getElementById('proposal-elevation-validation'),submitElevation=document.getElementById('submit-elevation-proposal');let elevationQuote=null;
    const validateElevation=()=>{const rows=effectiveRosters()[myTeam]||[],rec=rows.find(r=>r.player===ep?.value),pos=String(epp?.value||'').toUpperCase(),positions=(elevationQuote?.positions||[]).map(x=>String(x).toUpperCase()),used=rookieElevationsUsed(myTeam,elevationSeason),pending=proposalCache.some(p=>activeProposalStatus(p.status)&&p.type==='ELEVATION'&&p.proposerTeam===myTeam&&Number(p.payload?.season||elevationSeason)===elevationSeason),termsOk=Boolean(elevationOpen&&elevationQuote&&rec&&String(rec.contract).toLowerCase()==='rookie'&&Number(elevationQuote.price||0)>0&&positions.includes(pos)&&used<1&&!pending),action=termsOk?{type:'Rookie elevation',status:'CONFIRMED',team:myTeam,player:rec.player,newSalary:Number(elevationQuote.price),newPosition:pos,contractEnd:Number(elevationQuote.contractEnd||elevationSeason+3)}:null,before=effectiveRosters(),after=action?effectiveRosters(action):before,legal=Boolean(action&&rosterIsLegal(after[myTeam]||[])),ok=termsOk&&legal;
      if(!ep?.value){ev.innerHTML='<div class="notice">Select a Rookie contract player to retrieve the live upgrade price and calculate the salary/position impact.</div>';submitElevation.disabled=true;return false;}
      if(!elevationQuote){submitElevation.disabled=true;return false;}
      ev.innerHTML=`<div class="notice"><strong>Live upgrade quote:</strong> ${money(elevationQuote.price)} · SuperCoach positions ${esc(positions.join('/')||'-')} · expires ${fmtDate(elevationQuote.expiresAt)}. Main contract runs to ${Number(elevationQuote.contractEnd||elevationSeason+3)}.</div>${rosterImpactTeamHtml(myTeam,before[myTeam]||[],after[myTeam]||[],'After rookie elevation')}<div class="notice"><strong>Elevation allowance:</strong> ${used} / 1 used for ${elevationSeason}.${pending?' A request is already pending.':''}</div>${!legal?'<div class="notice danger"><strong>Elevation blocked.</strong> The resulting roster would breach a salary, list or Field-position rule.</div>':''}`;submitElevation.disabled=!ok;return ok;};
    ep?.addEventListener('change',async()=>{elevationQuote=null;epp.innerHTML='<option value="">Loading current SuperCoach terms…</option>';epp.disabled=true;submitElevation.disabled=true;if(!ep.value){validateElevation();return;}ev.innerHTML='<div class="notice"><strong>Checking SuperCoach.live…</strong> Retrieving the current upgrade price and eligible positions.</div>';const requested=ep.value;try{const q=await fetchRookieElevationQuote(requested);if(ep.value!==requested)return;elevationQuote=q;epp.innerHTML=(q.positions||[]).map(pos=>`<option value="${esc(pos)}">${esc(pos)}</option>`).join('');epp.disabled=!(q.positions||[]).length;validateElevation();}catch(e){if(ep.value!==requested)return;ev.innerHTML=`<div class="notice danger"><strong>Quote unavailable.</strong> ${esc(e.message||'Could not retrieve current SuperCoach terms.')}</div>`;}});
    epp?.addEventListener('change',validateElevation);validateElevation();submitElevation?.addEventListener('click',async()=>{if(!validateElevation())return;const rec=(effectiveRosters()[myTeam]||[]).find(r=>r.player===ep.value),pos=String(epp.value||'').toUpperCase();try{await submitProposal({type:'ELEVATION',phase:elevationPhase,proposerTeam:myTeam,payload:{quoteId:elevationQuote.quoteId,player:rec.player,position:pos,season:Number(elevationQuote.season||elevationSeason),oldSalary:Number(rec.salary||0),oldPosition:rec.position||'',newSalary:Number(elevationQuote.price||0),contractEnd:Number(elevationQuote.contractEnd||elevationSeason+3),quoteSource:elevationQuote.source||'Supercoach.live',quoteExpiresAt:elevationQuote.expiresAt||''}});toast('Rookie elevation sent to the Commissioner.');renderTransactions();}catch(e){toast(e.message||'Could not submit the rookie elevation.');}});
    const dp=document.getElementById('proposal-delist-players'),dv=document.getElementById('proposal-delist-validation'),submitDelist=document.getElementById('submit-delist-proposal'),pendingNames=new Set(proposalCache.filter(p=>activeProposalStatus(p.status)&&p.type==='DELIST'&&p.proposerTeam===myTeam).flatMap(p=>p.payload?.players||[]));
    const roster=(effectiveRosters()[myTeam]||[]).slice().sort((a,b)=>String(a.position).localeCompare(String(b.position))||String(a.player).localeCompare(String(b.player)));dp.innerHTML=delistOpen?(roster.map(p=>`<label class="delist-check ${pendingNames.has(p.player)?'pending':''}"><input type="checkbox" class="proposal-delist-player" value="${esc(p.player)}" ${pendingNames.has(p.player)?'disabled':''}><span><strong>${esc(p.player)}</strong><small>${esc(p.position)} · ${esc(p.contract)} · ${esc(p.status)} · ${money(p.salary)}${pendingNames.has(p.player)?' · already pending':''}</small></span></label>`).join('')||'<div class="empty">No players on this roster.</div>'):'<div class="empty">Delisting is closed.</div>';
    const selectedDelists=()=>[...document.querySelectorAll('.proposal-delist-player:checked')].map(x=>x.value),validateDelist=()=>{const chosen=selectedDelists(),owned=new Set(roster.map(p=>p.player)),ok=delistOpen&&chosen.length>0&&chosen.every(x=>owned.has(x));dv.innerHTML=chosen.length?`<div class="notice"><strong>${chosen.length} player${chosen.length===1?'':'s'} selected.</strong> If approved, they are removed from ${esc(team(myTeam).name)}.</div>`:'<div class="notice">Select at least one player.</div>';submitDelist.disabled=!ok;return ok;};document.querySelectorAll('.proposal-delist-player').forEach(x=>x.addEventListener('change',validateDelist));validateDelist();submitDelist?.addEventListener('click',async()=>{if(!validateDelist())return;const players=selectedDelists();try{await submitProposal({type:'DELIST',phase:delistPhase,proposerTeam:myTeam,payload:{players}});toast('Delisting request sent to the Commissioner.');renderTransactions();}catch(e){toast(e.message||'Could not submit delisting.');}});
  }

  function renderHistory() {
    const current=D.honours.find(h=>h.year===2026) || D.honours[D.honours.length-1];
    // The workbook contains duplicate legacy 2018/2019 honour rows. Prefer the
    // complete record (the one with a wooden-spoon entry), then keep one row per year.
    const byYear=new Map();
    [...D.honours].forEach(h=>{
      const year=Number(h.year||0),existing=byYear.get(year);
      if(!existing || (!existing.spoon && h.spoon)) byYear.set(year,h);
    });
    const history=[...byYear.values()].sort((a,b)=>b.year-a.year);
    main.innerHTML = `${pageHeader('Since 2018','League history','Premiers, runners-up, wooden spoons and the core rules that power the site.')}
      <section class="history-hero"><article class="card trophy-card"><div class="trophy-mark" aria-hidden="true">&#127942;</div><span class="eyebrow kicker">2026 Premiers</span><h2>${esc(current?.premier||'')}</h2><p>${esc(current?.premierCoach||'')} - defeated ${esc(current?.runnerUp||'')} in the Grand Final.</p></article>
      <article class="card card-pad"><div class="section-title"><h2>Core cap rules</h2></div><div class="stat-strip" style="grid-template-columns:1fr 1fr"><div class="stat-box"><span>Main contracts</span><strong>${compactMoney(D.rules.mainContractCap)}</strong></div><div class="stat-box"><span>Field cap</span><strong>${compactMoney(D.rules.fieldCap)}</strong></div><div class="stat-box"><span>Rookie contracts</span><strong>${compactMoney(D.rules.rookieContractCap)}</strong></div><div class="stat-box"><span>Max field list</span><strong>${D.rules.maxFieldPlayers}</strong></div></div></article></section>
      <div class="honour-grid">${history.map(h=>`<article class="honour-item"><span class="eyebrow">${h.year}</span><strong>${esc(h.premier)}</strong><small>Premiers - ${esc(h.premierCoach)}</small><p style="margin:9px 0 0;font-size:12px"><b>Runner-up:</b> ${esc(h.runnerUp)}<br><b>Wooden spoon:</b> ${esc(h.spoon)}</p></article>`).join('')}</div>
      <section class="card card-pad" style="margin-top:16px"><div class="section-title"><h2>Rules encoded in this build</h2></div><div class="rules-list">${D.rules.notes.map((n,i)=>`<div class="rule-item"><span class="rule-num">${i+1}</span><span>${esc(n)}</span></div>`).join('')}</div><div class="notice" style="margin-top:14px"><strong>Roster validation applied:</strong> Schulz's corrected current roster contains 28 players and is used consistently across caps, positions and player-count calculations.</div></section>`;
  }

  async function commissionerUI() {
    if (backendConfigured() && !commissionerLoggedIn()) {
      commissionerContent.innerHTML=`<div class="commissioner-body commissioner-login"><div class="commissioner-lock">C</div><span class="eyebrow">Private administration</span><h3>Commissioner login</h3><p>Commissioner Mode is an additional permission layer. Any active Team Login remains signed in while Commissioner controls are enabled.</p><div class="form-grid" style="margin-top:16px"><div class="field-group"><label for="comm-backend-email">Commissioner email</label><input class="search-input" id="comm-backend-email" type="email" autocomplete="username" value="${esc(CONFIG.commissionerEmail||'')}" placeholder="commissioner@example.com"></div><div class="field-group"><label for="comm-backend-password">Password</label><input class="search-input" id="comm-backend-password" type="password" autocomplete="current-password"></div></div><div class="button-row"><button class="primary-button" id="commissioner-backend-login">Login</button></div><div class="notice" style="margin-top:16px"><strong>Concurrent access:</strong> you can be signed into a franchise and have Commissioner Mode enabled at the same time. Disabling one does not log out the other.</div></div>`;
      const login=async()=>{try{await commissionerBackendLogin(document.getElementById('comm-backend-email').value,document.getElementById('comm-backend-password').value);dismissDialog(commissionerDialog);updateSessionUI();toast('Commissioner Mode enabled.');render();try{await Promise.all([pullSharedState(),syncProposals(),loadDraftPool()]);await syncServerAuthority();backgroundRefreshUi();}catch(syncError){console.warn('Commissioner post-login sync incomplete',syncError);toast('Commissioner Mode enabled. Some admin data will retry syncing automatically.');}}catch(e){toast(e.message||'Login failed.');}};
      document.getElementById('commissioner-backend-login').addEventListener('click',login);
      document.getElementById('comm-backend-password').addEventListener('keydown',e=>{if(e.key==='Enter') login();});
      return;
    }
    if (backendConfigured() && commissionerLoggedIn()) { renderCommissionerControls(); return; }

    const savedHash=localStorage.getItem(COMM_PIN_KEY);
    if(!savedHash){
      commissionerContent.innerHTML=`<div class="commissioner-body commissioner-login"><div class="commissioner-lock">C</div><span class="eyebrow">Commissioner only</span><h3>Create Commissioner PIN</h3><p>No team logins are required. Create one Commissioner PIN for this local preview.</p><div class="notice"><strong>Preview mode:</strong> this PIN and changes stay in this browser. The included free hosted setup provides the same single Commissioner login across devices.</div><div class="form-grid" style="margin-top:16px"><div class="field-group"><label for="comm-new-pin">New PIN</label><input class="search-input" id="comm-new-pin" type="password" minlength="4" autocomplete="new-password" placeholder="At least 4 characters"></div><div class="field-group"><label for="comm-new-pin2">Confirm PIN</label><input class="search-input" id="comm-new-pin2" type="password" minlength="4" autocomplete="new-password"></div></div><div class="button-row"><button class="primary-button" id="create-commissioner-pin">Create Commissioner login</button></div></div>`;
      document.getElementById('create-commissioner-pin').addEventListener('click',async()=>{const a=document.getElementById('comm-new-pin').value,b=document.getElementById('comm-new-pin2').value;if(a.length<4){toast('Use at least 4 characters.');return;}if(a!==b){toast('PINs do not match.');return;}localStorage.setItem(COMM_PIN_KEY,await hashPin(a));sessionStorage.setItem(COMM_SESSION_KEY,'1');dismissDialog(commissionerDialog);updateSessionUI();toast('Commissioner Mode enabled.');render();});
      return;
    }
    if(!commissionerLoggedIn()){
      commissionerContent.innerHTML=`<div class="commissioner-body commissioner-login"><div class="commissioner-lock">C</div><span class="eyebrow">Private administration</span><h3>Commissioner login</h3><p>Teams and league pages are public. Only Commissioner functions require authentication.</p><div class="field-group" style="margin-top:16px"><label for="comm-login-pin">Commissioner PIN</label><input class="search-input" id="comm-login-pin" type="password" autocomplete="current-password" placeholder="Enter PIN"></div><div class="button-row"><button class="primary-button" id="commissioner-login-button">Login</button></div></div>`;
      const login=async()=>{const hash=await hashPin(document.getElementById('comm-login-pin').value);if(hash!==savedHash){toast('Incorrect Commissioner PIN.');return;}sessionStorage.setItem(COMM_SESSION_KEY,'1');dismissDialog(commissionerDialog);updateSessionUI();toast('Commissioner Mode enabled.');render();};
      document.getElementById('commissioner-login-button').addEventListener('click',login);
      document.getElementById('comm-login-pin').addEventListener('keydown',e=>{if(e.key==='Enter') login();});
      return;
    }
    renderCommissionerControls();
  }

  function commissionerTabs(){
    const tabs=[['scores','Scores & live'],['season','Season setup'],['finals','Finals'],['windows','League windows'],['approvals','Approvals'],['draft','Draft control'],['accounts','Team accounts'],['figureheads','Figureheads'],['backups','Backups'],['data','Legacy data']];
    return `<div class="admin-tabs">${tabs.map(([id,label])=>`<button class="tab-button ${commissionerTab===id?'active':''}" data-admin-tab="${id}">${label}</button>`).join('')}<button class="tab-button admin-logout" id="commissioner-logout">Disable Commissioner</button></div>`;
  }

  function teamOptions(selected=''){return D.teams.map(t=>`<option value="${t.key}" ${t.key===selected?'selected':''}>${esc(t.name)} (${esc(t.owner)})</option>`).join('');}
  function playerOptions(teamKey,status=null,blank='No player'){const rows=(effectiveRosters()[teamKey]||[]).filter(p=>!status||p.status===status);return `<option value="">${blank}</option>`+rows.sort((a,b)=>a.player.localeCompare(b.player)).map(p=>`<option value="${esc(p.player)}">${esc(p.player)} · ${esc(p.position)} · ${money(p.salary)}</option>`).join('');}
  function capReadout(teamKey,rosters=effectiveRosters()){
    const rows=rosters[teamKey]||[],x=rosterSummary(rows),legal=rosterIsLegal(rows);
    return `<div class="admin-readout"><strong>${esc(team(teamKey).name)}</strong><span class="badge ${legal?'green':'red'}">${legal?'LEGAL':'BLOCKED'}</span><small>Main ${compactMoney(x.caps.main)} / ${compactMoney(D.rules.mainContractCap)} · Field ${compactMoney(x.caps.field)} / ${compactMoney(D.rules.fieldCap)} · Rookie ${compactMoney(x.caps.rookie)} / ${compactMoney(D.rules.rookieContractCap)} · Field ${x.counts.field}/${D.rules.maxFieldPlayers}</small></div>`;
  }
  function normalizedDraftType(value){
    return String(value||'').toLowerCase().startsWith('mid') ? 'Mid-Season' : 'Pre-Season';
  }
  function draftSeasonFor(type){
    const base=currentSeason(); return normalizedDraftType(type)==='Pre-Season' ? base+(activeSeasonSetup()?0:1) : base;
  }
  function draftRoundsFor(type){ return DRAFT_ROUNDS[normalizedDraftType(type)] || 3; }
  function reverseLadderOrder(){
    return [...effectiveLadder()].sort((a,b)=>Number(b.position||0)-Number(a.position||0)).map(r=>r.team).filter(k=>teamMap[k]);
  }
  function preSeasonDraftOrder(){
    const setup=activeSeasonSetup();
    if(setup?.preSeasonDraftOrder?.length)return setup.preSeasonDraftOrder.filter(k=>teamMap[k]);
    return [...D.ladder].sort((a,b)=>Number(b.position||0)-Number(a.position||0)).map(r=>r.team).filter(k=>teamMap[k]);
  }
  function draftLadderOrder(type){ return normalizedDraftType(type)==='Pre-Season'?preSeasonDraftOrder():reverseLadderOrder(); }
  function draftPickRef(type,pick,season=draftSeasonFor(type)){
    return `${Number(season)}|${normalizedDraftType(type)}|${Number(pick)}`;
  }
  function decodePickRef(ref,fallbackType='Pre-Season'){
    if(ref && typeof ref==='object'){
      const type=normalizedDraftType(ref.type||fallbackType),season=Number(ref.season||draftSeasonFor(type)),pick=Number(ref.pick||0);
      return {id:ref.id||draftPickRef(type,pick,season),type,season,pick,round:Number(ref.round||0),slot:Number(ref.slot||0),originalOwner:ref.originalOwner||'',owner:ref.owner||''};
    }
    const raw=String(ref??'').trim(),parts=raw.split('|');
    if(parts.length>=3 && Number.isFinite(Number(parts[0])) && Number.isFinite(Number(parts[2]))){
      const type=normalizedDraftType(parts[1]); return {id:draftPickRef(type,Number(parts[2]),Number(parts[0])),type,season:Number(parts[0]),pick:Number(parts[2])};
    }
    const pick=Number(raw); const type=normalizedDraftType(fallbackType); return {id:draftPickRef(type,pick),type,season:draftSeasonFor(type),pick};
  }
  function draftBasePicks(type,ladderOrder=null){
    type=normalizedDraftType(type); const season=draftSeasonFor(type),base=(ladderOrder&&ladderOrder.length?ladderOrder:draftLadderOrder(type)).filter(k=>teamMap[k]);
    const rounds=draftRoundsFor(type),out=[]; let pick=1;
    for(let round=1;round<=rounds;round++) for(let slot=0;slot<base.length;slot++,pick++) out.push({id:draftPickRef(type,pick,season),type,season,pick,round,slot:slot+1,originalOwner:base[slot],owner:base[slot]});
    return out;
  }
  function actionPickTransfers(action){
    if(Array.isArray(action?.pickTransfers)) return action.pickTransfers.map(x=>({...decodePickRef(x.id||x.ref||x.pick, x.type||action.phase),from:x.from||'',to:x.to||'',type:normalizedDraftType(x.type||action.phase),season:Number(x.season||draftSeasonFor(x.type||action.phase))}));
    const phase=normalizedDraftType(action?.phase),season=draftSeasonFor(phase),picks=action?.picks||{},out=[];
    if(action?.teamA&&action?.teamB){
      for(const ref of picks[action.teamA]||[]){const x=decodePickRef(ref,phase);out.push({...x,type:phase,season:x.season||season,from:action.teamA,to:action.teamB});}
      for(const ref of picks[action.teamB]||[]){const x=decodePickRef(ref,phase);out.push({...x,type:phase,season:x.season||season,from:action.teamB,to:action.teamA});}
    }
    return out;
  }
  function draftPickLedger(type,options={}){
    type=normalizedDraftType(type); const season=Number(options.season||draftSeasonFor(type));
    const picks=draftBasePicks(type,options.ladderOrder).map(p=>({...p,season,id:draftPickRef(type,p.pick,season)}));
    const trades=getCommissionerActions().filter(a=>a.type==='Trade'&&a.status==='CONFIRMED').slice().sort((a,b)=>String(a.timestamp||'').localeCompare(String(b.timestamp||'')));
    for(const tr of trades){
      for(const x of actionPickTransfers(tr)){
        if(normalizedDraftType(x.type)!==type||Number(x.season||season)!==season) continue;
        const rec=picks.find(p=>p.id===x.id||p.pick===Number(x.pick));
        if(rec&&rec.owner===x.from) rec.owner=x.to;
      }
    }
    return picks;
  }
  function pendingPickRefs(teamKey,type){
    type=normalizedDraftType(type); const refs=new Set();
    for(const p of proposalCache.filter(x=>activeProposalStatus(x.status)&&x.type==='TRADE'&&normalizedDraftType(x.phase)===type)){
      const assets=p.payload||{};
      const side=p.proposerTeam===teamKey?assets.assetsA:p.counterpartyTeam===teamKey?assets.assetsB:null;
      for(const ref of side?.picks||[]) refs.add(decodePickRef(ref,type).id);
    }
    return refs;
  }
  function ownedDraftPicks(teamKey,type,{excludePending=true}={}){
    const pending=excludePending?pendingPickRefs(teamKey,type):new Set();
    return draftPickLedger(type).filter(p=>p.owner===teamKey&&!pending.has(p.id));
  }
  function pickLabel(ref,type='Pre-Season'){
    const x=decodePickRef(ref,type),ledger=draftPickLedger(x.type,{season:x.season}),rec=ledger.find(p=>p.id===x.id||p.pick===x.pick),p=rec||x;
    const round=p.round||Math.ceil(Number(p.pick||0)/Math.max(1,D.teams.length));
    return `${p.season} ${p.type} Pick ${p.pick} (R${round})`;
  }
  function pickOptions(teamKey,type,blank='No pick'){
    if(!teamKey) return `<option value="">${blank}</option>`;
    const picks=ownedDraftPicks(teamKey,type);
    return `<option value="">${blank}</option>`+picks.map(p=>`<option value="${esc(p.id)}">Pick ${p.pick} · Round ${p.round}${p.originalOwner!==p.owner?' · from '+esc(team(p.originalOwner).owner):''}</option>`).join('');
  }
  function picksOwnedBy(teamKey,refs,type){
    const ledger=draftPickLedger(type),seen=new Set();
    for(const ref of refs||[]){const x=decodePickRef(ref,type);if(seen.has(x.id))return false;seen.add(x.id);const rec=ledger.find(p=>p.id===x.id);if(!rec||rec.owner!==teamKey)return false;}
    return true;
  }
  function buildPickTransfers(from,to,refs,type){
    return (refs||[]).map(ref=>{const x=decodePickRef(ref,type),rec=draftPickLedger(type,{season:x.season}).find(p=>p.id===x.id)||x;return {id:x.id,type:x.type,season:x.season,pick:x.pick,round:rec.round||0,originalOwner:rec.originalOwner||'',from,to};});
  }
  function scoringLockStatusHtml(){
    const season=String(currentSeason()),x=getScoringSnapshots()?.[season]||{},pre=x.preSeason,mid=x.midSeason;
    const card=(label,snap)=>`<div class="stat-box"><span>${label}</span><strong>${snap?'LOCKED':'NOT LOCKED'}</strong><small>${snap?`From Round ${Number(snap.effectiveFromRound||1)} · ${fmtDate(snap.capturedAt)}`:'Ends when that draft is completed'}</small></div>`;
    return `<div class="notice" style="margin-top:14px"><strong>Scoring roster locks:</strong> a player's scores remain attached to the roster snapshot for that period. Pre-Season rosters persist until the Mid-Season scoring lock replaces them; completed earlier rounds never use the later list.</div><div class="stat-strip" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:12px">${card('Pre-Season list',pre)}${card('Mid-Season list',mid)}</div>`;
  }
  function draftOrderPreviewHtml(type){
    type=normalizedDraftType(type); const ledger=draftPickLedger(type),first=ledger.filter(p=>p.round===1),source=type==='Pre-Season'?`${currentSeason()-1} final ladder reversed`:`${currentSeason()} ladder reversed at draft activation`;
    return `<div class="notice"><strong>Order source:</strong> ${esc(source)}. Standard AFL format repeats the same ladder order each round. Approved trades set pick ownership before/during the draft; if a 3-minute clock expires, the Commissioner may push that live pick back one slot, temporarily reordering the next two pick positions.</div><div class="draft-order-preview">${first.map(p=>`<div class="draft-order-chip"><span>${p.pick}</span>${figurehead(p.owner,'sm')}<strong>${esc(team(p.owner).owner)}</strong>${p.owner!==p.originalOwner?`<small>from ${esc(team(p.originalOwner).owner)}</small>`:''}</div>`).join('')}</div>`;
  }
  function approvalDetail(p){
    if(p.type==='TRADE'){
      const x=p.payload||{},a=x.assetsA||{players:[],picks:[]},b=x.assetsB||{players:[],picks:[]},da=x.conditionalDelistsA||[],db=x.conditionalDelistsB||[];
      return `<div class="notice"><strong>Counterparty:</strong> ${p.counterpartyDecidedAt?'Accepted '+fmtDate(p.counterpartyDecidedAt):'Awaiting team acceptance'}</div>${(da.length||db.length)?'<div class="notice conditional-trade-note"><strong>Atomic trade package:</strong> conditional delistings below execute only with this approved trade. Rejecting the trade leaves every listed player on their current roster.</div>':''}${tradeVisualAssetsHtml(p.proposerTeam,p.counterpartyTeam,a,b,p.phase||'Pre-Season',da,db)}${tradeImpactHtml(p.proposerTeam,p.counterpartyTeam,a,b,da,db)}`;
    }
    if(p.type==='SWAP'){
      const x=p.payload||{},action={type:'Rookie swap',status:'CONFIRMED',team:p.proposerTeam,playerIn:x.playerIn,playerOut:x.playerOut,playerInPosition:x.fieldPosition||''},before=effectiveRosters(),rosters=effectiveRosters(action);
      return `${x.fieldPosition?`<div class="notice"><strong>Field position:</strong> ${esc(x.playerIn||'')} will enter as ${esc(x.fieldPosition)}.</div>`:''}${rosterImpactTeamHtml(p.proposerTeam,before[p.proposerTeam]||[],rosters[p.proposerTeam]||[],'After proposed swap')}`;
    }
    if(p.type==='DELIST'){
      const x=p.payload||{},players=x.players||[],action={type:'Delisted',status:'CONFIRMED',team:p.proposerTeam,players},rosters=effectiveRosters(action);return `<div class="notice"><strong>Players to remove:</strong> ${esc(players.join(', '))}</div>`+capReadout(p.proposerTeam,rosters);
    }
    if(p.type==='ELEVATION'){
      const x=p.payload||{},action={type:'Rookie elevation',status:'CONFIRMED',team:p.proposerTeam,player:x.player,newSalary:Number(x.newSalary||0),newPosition:x.position||'',contractEnd:Number(x.contractEnd||0)},before=effectiveRosters(),after=effectiveRosters(action),season=Number(x.season||elevationSeasonFor(p.phase));
      return `<div class="notice"><strong>Upgrade terms:</strong> ${esc(x.player||'')} · ${money(x.oldSalary||0)} → ${money(x.newSalary||0)} · ${esc(x.oldPosition||'')} → ${esc(x.position||'')} · Main contract to ${Number(x.contractEnd||season+3)}</div>${rosterImpactTeamHtml(p.proposerTeam,before[p.proposerTeam]||[],after[p.proposerTeam]||[],'After rookie elevation')}<div class="notice"><strong>Elevations used:</strong> ${rookieElevationsUsed(p.proposerTeam,season)} / 1 before this request.</div>`;
    }
    if(p.type==='DRAFT_PICK'){
      const x=p.payload||{},pl={player:x.player,club:x.club||'',position:x.position||'',price:Number(x.salary||0),startPrice:Number(x.salary||0)},checks=validateDraft(p.proposerTeam,pl,x.contract||'Main',x.listStatus||'Field',x.position||'');
      return `<div class="notice"><strong>Frozen draft salary:</strong> ${money(x.salary||0)} · ${esc(x.position||'')}</div>`+checks.map(c=>`<div class="rule-check"><span>${esc(c.label)}</span><span class="${c.pass?'check-pass':'check-fail'}">${c.pass?'PASS':'FAIL'} · ${esc(c.detail)}</span></div>`).join('');
    }
    return '';
  }

  function commissionerProposalCards(items){
    if(!items.length)return '<div class="empty">No proposals awaiting approval.</div>';
    return items.map(p=>`<article class="proposal-card commissioner-proposal"><div class="proposal-card-head"><div>${teamIdentity(p.proposerTeam,'sm')}<span class="badge amber">AWAITING COMMISSIONER</span></div><time>${fmtDate(p.createdAt)}</time></div><strong>${esc(proposalTypeLabel(p))}${p.phase?' · '+esc(p.phase):''}</strong><p>${esc(proposalSummary(p))}</p>${approvalDetail(p)}<div class="button-row"><button class="primary-button" data-proposal-approve="${esc(p.id)}">Approve</button><button class="secondary-button" data-proposal-reject="${esc(p.id)}">Reject</button></div></article>`).join('');
  }

  async function approveProposal(id){
    const p=proposalCache.find(x=>String(x.id)===String(id));if(!p){toast('Proposal no longer exists.');return;}
    if(String(p.status)!=='AWAITING_COMMISSIONER'){toast('This proposal is not ready for Commissioner approval.');return;}
    let action=null,serverDecided=false,serverActionApplied=false;
    if(p.type==='TRADE'){
      if(!p.counterpartyDecidedAt){toast('Trade approval blocked until the other coach accepts it.');return;}
      const x=p.payload||{},a=x.assetsA||{players:[],picks:[]},b=x.assetsB||{players:[],picks:[]},da=[...new Set((x.conditionalDelistsA||[]).filter(Boolean))],db=[...new Set((x.conditionalDelistsB||[]).filter(Boolean))],phase=normalizedDraftType(p.phase);
      if(da.length>3||db.length>3){toast('Trade approval blocked: maximum three conditional delistings per franchise.');return;}
      if(da.some(name=>(a.players||[]).includes(name))||db.some(name=>(b.players||[]).includes(name))){toast('Trade approval blocked: a player cannot be both traded away and conditionally delisted.');return;}
      if(backendConfigured()){
        try{const serverCheck=await commissionerFetch('/rest/v1/rpc/pegs_validate_trade_payload',{method:'POST',body:JSON.stringify({p_team_a:p.proposerTeam,p_team_b:p.counterpartyTeam,p_phase:p.phase,p_payload:p.payload})});if(!serverCheck?.legal){toast('Trade approval blocked by current server roster rules.');return;}}catch(e){toast(e.message||'Trade validation failed.');return;}
      }
      const currentRosters=effectiveRosters(),ownsPlayers=(key,names)=>(names||[]).every(name=>(currentRosters[key]||[]).some(r=>r.player===name));
      if(!ownsPlayers(p.proposerTeam,a.players||[])||!ownsPlayers(p.counterpartyTeam,b.players||[])){toast('Trade approval blocked: a player is no longer owned by the team offering them.');return;}
      if(!ownsPlayers(p.proposerTeam,da)||!ownsPlayers(p.counterpartyTeam,db)){toast('Trade approval blocked: a conditional delisting player is no longer owned by that franchise.');return;}
      if(!picksOwnedBy(p.proposerTeam,a.picks||[],phase)||!picksOwnedBy(p.counterpartyTeam,b.picks||[],phase)){toast('Trade approval blocked: a draft pick is no longer owned by the team offering it.');return;}
      const test=tradeActionFor(p.proposerTeam,p.counterpartyTeam,a,b,da,db),rosters=effectiveRosters(test);if(!rosterIsLegal(rosters[p.proposerTeam]||[])||!rosterIsLegal(rosters[p.counterpartyTeam]||[])){toast('Trade approval blocked by current salary/list/position rules after conditional delistings.');return;}
      const fmt=v=>[...(v.players||[]),...(v.picks||[]).map(n=>pickLabel(n,phase))].join(', ')||'No assets',fmtDelists=names=>names.length?` · conditional delist ${names.join(', ')}`:'',pickTransfers=[...buildPickTransfers(p.proposerTeam,p.counterpartyTeam,a.picks||[],phase),...buildPickTransfers(p.counterpartyTeam,p.proposerTeam,b.picks||[],phase)];
      action={...test,teamA:p.proposerTeam,teamB:p.counterpartyTeam,phase,season:currentSeason(),effectiveFromRound:nextUnfinalizedScoringRound(),timestamp:new Date().toISOString(),picks:{[p.proposerTeam]:a.picks||[],[p.counterpartyTeam]:b.picks||[]},pickTransfers,detail:`${phase}: ${team(p.proposerTeam).owner} sends ${fmt(a)}${fmtDelists(da)} · ${team(p.counterpartyTeam).owner} sends ${fmt(b)}${fmtDelists(db)}`};
    }else if(p.type==='SWAP'){
      const x=p.payload||{},used=visibleLegacyTransactions().filter(v=>v.type==='Rookie swap'&&v.team===p.proposerTeam).length+getCommissionerActions().filter(v=>v.type==='Rookie swap'&&v.team===p.proposerTeam&&v.status==='CONFIRMED').length,rows=effectiveRosters()[p.proposerTeam]||[],pin=rows.find(r=>r.player===x.playerIn),choices=positionChoices(pin?.position||'');
      const fieldPosition=String(x.fieldPosition||pin?.position||'').toUpperCase();if(!pin||!choices.includes(fieldPosition)){toast('Swap approval blocked: choose a valid PEGS Field position for the incoming player.');return;}
      action={type:'Rookie swap',status:'CONFIRMED',team:p.proposerTeam,playerIn:x.playerIn,playerOut:x.playerOut,playerInPosition:fieldPosition,season:currentSeason(),effectiveFromRound:nextUnfinalizedScoringRound(),timestamp:new Date().toISOString(),detail:`${x.playerIn} → Field (${fieldPosition}); ${x.playerOut} → Interchange`};const rosters=effectiveRosters(action);if(used>=D.rules.maxSwaps||!rosterIsLegal(rosters[p.proposerTeam]||[])){toast('Swap approval blocked by current roster rules or swap limit.');return;}
    }else if(p.type==='DELIST'){
      const x=p.payload||{},players=[...new Set((x.players||[]).filter(Boolean))],rows=effectiveRosters()[p.proposerTeam]||[],owned=new Set(rows.map(r=>r.player));if(!players.length||!players.every(name=>owned.has(name))){toast('Delisting approval blocked: one or more players are no longer owned by this team.');return;}action={type:'Delisted',status:'CONFIRMED',team:p.proposerTeam,phase:p.phase||'',season:currentSeason(),effectiveFromRound:nextUnfinalizedScoringRound(),players,timestamp:new Date().toISOString(),detail:`${p.phase||'Delisting'}: ${players.join(', ')}`};
    }else if(p.type==='ELEVATION'){
      if(!backendConfigured()){toast('Rookie elevations require the shared Supabase backend.');return;}
      let approved;try{approved=normalizeProposal(await commissionerFetch('/rest/v1/rpc/pegs_approve_rookie_elevation',{method:'POST',body:JSON.stringify({p_proposal_id:Number(p.id)})}));}catch(e){toast(e.message||'Rookie elevation approval failed.');return;}
      const x=approved?.payload||{};if(!x.player||!Number(x.newSalary||0)||!validPegsPosition(x.position)){toast('Rookie elevation approval returned incomplete terms.');return;}
      action={type:'Rookie elevation',status:'CONFIRMED',team:p.proposerTeam,player:x.player,oldSalary:Number(x.oldSalary||0),newSalary:Number(x.newSalary||0),oldPosition:x.oldPosition||'',newPosition:x.position||'',contractEnd:Number(x.contractEnd||0),season:Number(x.season||elevationSeasonFor(p.phase)),phase:p.phase||'',timestamp:new Date().toISOString(),detail:`${x.player}: Rookie → Main (${money(x.oldSalary||0)} → ${money(x.newSalary||0)}) · ${x.position}`};serverDecided=true;serverActionApplied=true;
    }else if(p.type==='DRAFT_PICK'){
      const x=p.payload||{},pl={player:x.player,club:x.club||'',position:x.position||'',price:Number(x.salary||0),startPrice:Number(x.salary||0)},checks=validateDraft(p.proposerTeam,pl,x.contract||'Main',x.listStatus||'Field',x.position||'');if(!checks.length||!checks.every(c=>c.pass)){toast('Draft pick approval blocked by current roster rules.');return;}action={type:'Drafted',status:'CONFIRMED',phase:p.phase||'Draft',draftSeason:Number(x.draftSeason||getDraftState().season||D.meta.season),sessionId:x.sessionId||'',pick:Number(x.pick||0),team:p.proposerTeam,player:x.player,position:x.position||'',club:x.club||'',contract:x.contract||'Main',listStatus:x.listStatus||'Field',salary:Number(x.salary||0),timestamp:new Date().toISOString(),detail:`${p.phase||'Draft'} pick ${Number(x.pick||0)}: ${x.player} (${x.position||''}) · ${money(x.salary||0)}`};
    }
    if(!action)return;if(serverActionApplied){await pullSharedState();}else{const all=getCommissionerActions();all.unshift(action);saveCommissionerActions(all);if(!serverDecided)await decideProposal(id,'APPROVED');}await syncServerAuthority();await logCommissioner('PROPOSAL_APPROVED','proposal',id,{type:p.type,team:p.proposerTeam,counterparty:p.counterpartyTeam||null});await syncProposals();toast('Proposal approved and applied.');render();renderCommissionerControls();
  }

  async function rejectProposal(id){
    const p=proposalCache.find(x=>String(x.id)===String(id));if(!p||p.status!=='AWAITING_COMMISSIONER'){toast('Proposal is not awaiting Commissioner approval.');return;}await decideProposal(id,'REJECTED');await logCommissioner('PROPOSAL_REJECTED','proposal',id,{type:p.type,team:p.proposerTeam});await syncProposals();toast('Proposal rejected.');render();renderCommissionerControls();
  }

  function liveFeedSummary(){
    const f=getLiveFeed(),players=Object.values(f.players||{}),counts={}; players.forEach(p=>{const k=String(p.status||'TBC').toUpperCase();counts[k]=(counts[k]||0)+1;});
    if(!players.length)return '<div class="notice"><strong>No live feed loaded.</strong> Once the free provider function is configured, player selections and SuperCoach scores can refresh automatically.</div>';
    const expected=Number(f.expectedGameCount||0),matched=Number(f.matchedGameCount||f.games?.length||0),completed=Number(f.completedGameCount||0),gameBadge=expected?`<span class="badge ${matched>=expected?'green':'red'}">Games ${matched}/${expected}</span><span class="badge ${completed>=expected?'green':'amber'}">FT ${completed}/${expected}</span>`:'';
    return `<div class="live-feed-summary"><div><span class="eyebrow">Live data</span><h3>${esc(f.source||'SuperCoach feed')}</h3><p>${currentSeason()} · Round ${Number(f.round||0)} · ${fmtDate(f.updatedAt)}</p></div><div class="status-chip-row">${gameBadge}<span class="badge green">Selected ${counts.SELECTED||counts.PLAYINGNEXTROUND||0}</span><span class="badge red">Out ${(counts.OUT||0)+(counts.NOT_SELECTED||0)+(counts.NOTPLAYINGNEXTROUND||0)+(counts.INJURED||0)}</span><span class="badge amber">Emergency ${counts.EMERGENCY||0}</span></div></div>${(f.warnings||[]).length?`<div class="notice warning-notice" style="margin-top:10px"><strong>Feed check:</strong> ${esc((f.warnings||[]).join(' · '))}</div>`:''}`;
  }
  async function syncLiveProvider(force=false,roundOverride=null){
    if(!backendConfigured()){toast('Configure the free Supabase backend first; automatic SuperCoach sync uses its Edge Function.');return;}
    try{
      const fn=CONFIG.liveScoreFunction||'supercoach-sync',round=roundOverride===null?effectiveCurrentRound():Number(roundOverride),base=CONFIG.supabaseUrl.replace(/\/$/,'')+`/functions/v1/${fn}`;
      const parsed=parseAflFixtureCsv(activeSeasonSetup()?.aflFixtureCsv||''),token=Number(round)===0?'OR':Number(round),roundGames=(parsed.games||[]).filter(g=>g.round===token);
      if(!roundGames.length)throw new Error(`No AFL fixture games are configured for ${Number(round)===0?'Opening Round':'Round '+round}.`);
      const headers={apikey:CONFIG.supabaseAnonKey,Authorization:'Bearer '+(backendToken()||commissionerBackendToken()||CONFIG.supabaseAnonKey)};
      const fetchSlice=async params=>{const qs=new URLSearchParams(params);const res=await fetch(`${base}?${qs.toString()}`,{headers});if(!res.ok)throw new Error(await res.text());return await res.json();};
      const players={},games=[],warnings=[];
      // Each AFL match is a separate Edge Function invocation. This keeps every
      // free-tier worker well below Supabase's CPU limit instead of parsing a whole
      // AFL round inside one invocation.
      for(const g of roundGames){
        try{
          const x=await fetchSlice({mode:'match',round:String(Number(round)||0),home:g.home,away:g.away});
          if(x.game)games.push({...x.game,expected:true});
          for(const [key,p] of Object.entries(x.players||{}))players[key]={...(players[key]||{}),...p};
        }catch(e){console.warn(e);warnings.push(`Match feed unavailable: ${g.home} v ${g.away}`);}
      }
      const allFinal=games.length===roundGames.length&&games.every(g=>String(g.status||'').toUpperCase()==='FT');
      // Team pages are only needed while a round is pre-game/live. Once every
      // match is final, actual scores are sufficient and we avoid 18 extra calls.
      if(!allFinal){
        const clubs=[...new Set(roundGames.flatMap(g=>[g.home,g.away]))];
        for(const club of clubs){
          try{
            const x=await fetchSlice({mode:'team',team:club});
            for(const [key,p] of Object.entries(x.players||{})){
              const matchRec=players[key]||{};
              // Team pages are authoritative for selection availability and
              // projections. Match pages are authoritative for actual score and
              // match state. Do not let a generic match-page SELECTED flag overwrite
              // OUT / emergency / injury markers from the team list.
              players[key]=mergeProviderTeamRecord(matchRec,p);
            }
          }catch(e){console.warn(e);warnings.push(`${club} selection/projection feed unavailable`);}
        }
      }
      const expectedGameCount=roundGames.length,matchedGameCount=games.length,completedGameCount=games.filter(g=>String(g.status||'').toUpperCase()==='FT').length,complete=matchedGameCount>=expectedGameCount&&completedGameCount>=expectedGameCount;
      if(matchedGameCount<expectedGameCount)warnings.push(`Only ${matchedGameCount}/${expectedGameCount} AFL games were retrieved for Round ${round}.`);
      else if(completedGameCount<expectedGameCount)warnings.push(`${completedGameCount}/${expectedGameCount} AFL games are final for Round ${round}.`);
      const feed={season:currentSeason(),round:Number(round),source:'Supercoach.live (split free-tier sync)',updatedAt:new Date().toISOString(),players,games,warnings,expectedGameCount,matchedGameCount,completedGameCount,complete};
      saveLiveFeed(feed,{share:commissionerLoggedIn()});
      if(force)toast(`Live SuperCoach data synced for Round ${feed.round}: ${matchedGameCount}/${expectedGameCount} AFL games.`);
      backgroundRefreshUi({commissioner:true});
    }catch(e){console.warn(e);toast('Live score sync failed. Commissioner overrides remain available.');}
  }
  function captureOpeningRoundBank(){
    const setup=activeSeasonSetup(),feed=getLiveFeed(); if(!setup?.openingRound?.enabled){toast('This season has no Opening Round.');return;} if(Number(feed.season)!==currentSeason()||Number(feed.round)!==0){toast('Sync Opening Round data first.');return;}
    const players={}; for(const [key,p] of Object.entries(feed.players||{})){if(p.actual!==null&&p.actual!==undefined&&String(p.gameStatus||'').toUpperCase()==='FT')players[key]={player:p.player,club:p.club,actual:Number(p.actual),source:p.source||feed.source};}
    const all=getOpeningBank(); all[String(currentSeason())]={season:currentSeason(),capturedAt:new Date().toISOString(),players}; saveOpeningBank(all); toast(`${Object.keys(players).length} Opening Round scores banked.`); render(); renderCommissionerControls();
  }
  async function finalizeRound(round,force=false){
    let setup=activeSeasonSetup();if(!setup){toast('Activate a season setup first.');return;}
    const feed=getLiveFeed(),expected=Number(feed.expectedGameCount||0),matched=Number(feed.matchedGameCount||feed.games?.length||0),completed=Number(feed.completedGameCount||0);
    if(!force&&Number(feed.season)===currentSeason()&&Number(feed.round)===Number(round)&&expected>0&&(matched<expected||completed<expected)){toast(`Round ${round} is incomplete: ${matched}/${expected} games retrieved and ${completed}/${expected} final. Sync again or use Finalise anyway.`);return;}
    const teamScores={},players={};D.teams.forEach(t=>{const c=calcTeamRound(round,t.key);teamScores[t.key]=c.actual;players[t.key]=c.players.map(p=>({player:p.player,position:p.position,status:'Field',club:p.club,score:p.score,projected:p.liveValue,scoreSource:'Finalised live round',availability:'FT',gameStatus:'FT'}));});
    const all=getSeasonResults(),season=String(currentSeason());all[season]=all[season]||{};all[season][String(round)]={round:Number(round),teamScores,players,finalizedAt:new Date().toISOString(),topPlayers:topPlayersForRound(round),feedGames:{expected,matched,completed,forced:Boolean(force)}};saveSeasonResults(all);
    setup={...setup,completedThroughRound:Math.max(Number(setup.completedThroughRound||0),Number(round)),currentRound:Number(round)+1,updatedAt:new Date().toISOString()};saveSeasonSetup(setup);
    if(backendConfigured()&&commissionerLoggedIn()){
      try{await Promise.all([pushSharedState('season_results',all),pushSharedState('season_setup',setup)]);await syncServerAuthority();const backupId=await createServerBackup('ROUND_FINALIZED',`${roundLabel(round)} finalised`);await logCommissioner('ROUND_FINALIZED','round',round,{forced:Boolean(force),backupId});toast(`${roundLabel(round)} finalised and backup #${backupId} created.`);}catch(e){console.warn(e);toast(`${roundLabel(round)} finalised, but automatic backup needs attention.`);}
    }else toast(`${roundLabel(round)} finalised${force?' by Commissioner override':''}.`);
    render();renderCommissionerControls();
  }

  function seasonRoundPreview(setup){
    const rounds=setup.rounds||[]; if(!rounds.length)return '<div class="notice"><strong>No AFL fixture loaded yet.</strong> Retrieve it by season, or paste/upload a fixture manually as a fallback.</div>';
    const byeRounds=rounds.filter(r=>(r.byeClubs||[]).length),rows=rounds.slice(0,Math.max(1,Math.min(30,rounds.length))).map(r=>`<tr><td>${r.round}</td><td><strong>${scoreCountForRoundRecord(r)}</strong></td><td>${(r.byeClubs||[]).join(', ')||'—'}</td><td>${(r.bankClubs||[]).join(', ')||'—'}</td></tr>`).join('');
    const source=setup.fixtureSource?`<div class="fixture-source">Fixture source: <strong>${esc(setup.fixtureSource)}</strong>${setup.fixtureRetrievedAt?` · retrieved ${fmtDate(setup.fixtureRetrievedAt)}`:''}</div>`:'';
    return `${source}<div class="stat-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:12px"><div class="stat-box"><span>Opening Round</span><strong>${setup.openingRound?.enabled?'YES':'NO'}</strong></div><div class="stat-box"><span>Bye rounds</span><strong>${byeRounds.length}</strong></div><div class="stat-box"><span>AFL rounds loaded</span><strong>${rounds.length}</strong></div></div><div class="table-wrap setup-round-table"><table class="data-table"><thead><tr><th>Round</th><th>PEGS scores count</th><th>AFL byes</th><th>OR banked clubs</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function seasonFixturePreview(fixtures,limit=24){
    if(!fixtures?.length)return '<div class="empty">No PEGS H2H fixture loaded.</div>'; const grouped={}; fixtures.forEach(f=>(grouped[f.round]||(grouped[f.round]=[])).push(f));
    return `<div class="fixture-setup-preview">${Object.entries(grouped).slice(0,limit).map(([r,fs])=>`<div class="setup-fixture-round"><strong>R${r}</strong><span>${fs.map(f=>`${esc(team(f.home).owner)} v ${esc(team(f.away).owner)}`).join(' · ')}</span></div>`).join('')}</div>`;
  }
  function renderCommissionerControls(){
    clearInteractionDraft();
    const ds=getDraftState(); let panel='';
    if(commissionerTab==='scores'){
      const round=effectiveCurrentRound(),keys=D.teams.map(t=>t.key),defaultTeam=keys[0];
      panel=`${liveFeedSummary()}<div class="button-row" style="margin-top:12px"><button class="primary-button" id="sync-live-feed">Sync SuperCoach.live now</button>${activeSeasonSetup()?.openingRound?.enabled?'<button class="secondary-button" id="sync-opening-feed">Sync Opening Round</button><button class="secondary-button" id="capture-opening-bank">Capture OR bank</button>':''}<button class="secondary-button" id="finalise-current-round">Finalise Round ${round}</button><button class="secondary-button" id="force-finalise-current-round">Finalise anyway</button></div><div class="notice" style="margin-top:14px"><strong>Official player score corrections are handled in Matchups.</strong> Commissioner Mode enables the score editor inside the selected head-to-head matchup. No password re-entry is required while this Commissioner session remains active.</div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><div class="notice"><strong>Selection status correction:</strong> this remains here for provider team-list issues. It changes selected/OUT status only — not the player's official score.</div><div class="form-grid" style="margin-top:16px"><div class="field-group"><label for="comm-round">Round</label><select class="select" id="comm-round">${(activeSeasonSetup()?.rounds||Object.keys(D.roundSchedule).map(r=>({round:Number(r)}))).map(x=>`<option value="${x.round}" ${Number(x.round)===round?'selected':''}>Round ${x.round}</option>`).join('')}</select></div><div class="field-group"><label for="comm-team">Team</label><select class="select" id="comm-team">${keys.map(k=>`<option value="${k}">${esc(team(k).name)}</option>`).join('')}</select></div><div class="field-group"><label for="comm-player">Player</label><select class="select" id="comm-player">${teamRoundPlayers(round,defaultTeam).map(p=>`<option value="${esc(p.player)}">${esc(p.player)}</option>`).join('')}</select></div><div class="field-group"><label for="comm-selection">Selection override</label><select class="select" id="comm-selection"><option value="">Use live feed</option><option value="SELECTED">Force selected</option><option value="OUT">Force OUT (projects 0)</option></select></div></div><div class="button-row"><button class="secondary-button" id="save-selection-override">Save selection override</button><button class="secondary-button" id="clear-selection-override">Use feed again</button><button class="primary-button" id="open-matchups-from-admin">Open Matchups score editor</button></div>`;
    } else if(commissionerTab==='season'){
      const saved=localStorage.getItem(SEASON_SETUP_KEY)?getSeasonSetup():newSeasonTemplate(),pegsCsv=pegsFixtureCsv(saved.pegsFixtures||[]);
      panel=`<div class="notice"><strong>Season setup:</strong> choose the season and retrieve the AFL home-and-away fixture automatically. PEGS detects Opening Round, byes and the number of scores that count. CSV paste/upload remains available as a fallback.</div><div class="form-grid" style="margin-top:16px"><div class="field-group"><label for="season-year">Season</label><input class="search-input" id="season-year" type="number" value="${Number(saved.season||currentSeason()+1)}"></div><div class="field-group"><label for="season-current-round">Current AFL / PEGS round</label><input class="search-input" id="season-current-round" type="number" min="1" value="${Number(saved.currentRound||1)}"></div><div class="field-group"><label for="season-regular-rounds">PEGS regular H2H rounds</label><input class="search-input" id="season-regular-rounds" type="number" min="1" max="40" value="${Number(saved.pegsRegularRounds||20)}"></div><div class="field-group"><label>Live SuperCoach data</label><select class="select" id="season-live-enabled"><option value="1" ${saved.liveScoringEnabled!==false?'selected':''}>Enabled</option><option value="0" ${saved.liveScoringEnabled===false?'selected':''}>Disabled</option></select></div></div><div class="button-row" style="margin-top:14px"><button class="primary-button" id="retrieve-afl-fixture">Retrieve AFL fixture</button><span class="button-help">One request per setup/reload, cached in PEGS — no fixture file required.</span></div><div class="field-group" style="margin-top:14px"><label for="afl-fixture-csv">AFL fixture data <small>(advanced / fallback)</small></label><textarea class="setup-textarea" id="afl-fixture-csv" rows="7" placeholder="OR,SYD,CAR\nOR,BRL,GEE\n1,ADE,RIC\n1,COL,HAW\n...">${esc(saved.aflFixtureCsv||'')}</textarea><small>Automatically filled after retrieval. You can still paste or upload a corrected fixture if required.</small></div><div class="button-row"><button class="secondary-button" id="analyse-afl-fixture">Analyse fixture</button><label class="secondary-button file-button" for="afl-fixture-file">Upload fixture CSV</label><input id="afl-fixture-file" type="file" accept=".csv,.txt,text/csv,text/plain" hidden></div><div id="season-round-preview" style="margin-top:14px">${seasonRoundPreview(saved)}</div><div class="or-map-section"><div class="section-title"><div><span class="eyebrow">Opening Round</span><h3>Choose where banked scores are used</h3></div></div><p class="muted-copy">For each AFL club that plays Opening Round, choose the later bye round in which its Opening Round player scores should be inserted. PEGS suggests the club's bye from the retrieved fixture, but the Commissioner controls the final mapping.</p><div id="opening-round-map">${openingRoundMappingControls(saved)}</div></div><hr style="border:0;border-top:1px solid var(--line);margin:22px 0"><div class="section-title"><div><span class="eyebrow">PEGS fixture</span><h3>Who plays who</h3></div><button class="secondary-button" id="generate-pegs-fixture">Generate round-robin</button></div><div class="field-group"><label for="pegs-fixture-csv">PEGS H2H fixture CSV</label><textarea class="setup-textarea" id="pegs-fixture-csv" rows="10">${esc(pegsCsv)}</textarea><small>Format: round,home-team-key,away-team-key. Team keys: ${D.teams.map(t=>t.key).join(', ')}.</small></div><div id="pegs-fixture-preview" style="margin-top:14px">${seasonFixturePreview(saved.pegsFixtures||[])}</div><div class="button-row"><button class="primary-button" id="save-season-setup">Save & activate season</button><button class="secondary-button" id="deactivate-season-setup">Use workbook 2026 season</button></div>`;
    } else if(commissionerTab==='finals'){
      const setup=getSeasonSetup(),f=finalsConfig(setup),b=calculatedFinalsBracket(setup),ladder=[...effectiveLadder()].sort((a,b)=>Number(a.position)-Number(b.position));
      const seeds=b?.seeds||ladder.slice(0,4).map(x=>x.team),seedSelect=(i)=>`<select class="select" id="final-seed-${i}">${D.teams.map(t=>`<option value="${t.key}" ${seeds[i]===t.key?'selected':''}>${i+1}. ${esc(t.name)} (${esc(t.owner)})</option>`).join('')}</select>`;
      const card=(label,x)=>`<div class="final-card"><div class="final-team">${x?.home?teamIdentity(x.home,'sm'):'TBC'}</div><div><div class="final-round">${label}<br><small>Round ${Number(x?.round||0)}</small></div><div class="vs-dot" style="width:34px;height:34px;font-size:10px">VS</div></div><div class="final-team">${x?.away?teamIdentity(x.away,'sm'):'TBC'}</div></div>`;
      panel=`<div class="notice"><strong>Top-four finals:</strong> 1st v 2nd in the Qualifying Final (winner directly to the Grand Final); 3rd v 4th in the Elimination Final (loser eliminated); the Qualifying Final loser then plays the Elimination Final winner in the Preliminary Final; the winner meets the Qualifying Final winner in the Grand Final.</div>
      <div class="form-grid" style="margin-top:16px"><div class="field-group"><label>Finals format</label><input class="search-input" value="Top 4 · Page system" disabled></div><div class="field-group"><label for="final-week1-round">Finals Week 1 AFL round</label><input class="search-input" id="final-week1-round" type="number" min="1" value="${f.week1Round}"></div><div class="field-group"><label for="final-prelim-round">Preliminary Final AFL round</label><input class="search-input" id="final-prelim-round" type="number" min="1" value="${f.preliminaryRound}"></div><div class="field-group"><label for="final-gf-round">Grand Final AFL round</label><input class="search-input" id="final-gf-round" type="number" min="1" value="${f.grandFinalRound}"></div></div>
      <div class="section-title" style="margin-top:20px"><div><span class="eyebrow">Seeding</span><h3>Final ladder top four</h3></div><button class="secondary-button" id="seed-finals-from-ladder">Use current ladder top 4</button></div><div class="form-grid"><div class="field-group"><label>Seed 1</label>${seedSelect(0)}</div><div class="field-group"><label>Seed 2</label>${seedSelect(1)}</div><div class="field-group"><label>Seed 3</label>${seedSelect(2)}</div><div class="field-group"><label>Seed 4</label>${seedSelect(3)}</div></div><div class="button-row"><button class="primary-button" id="save-finals-setup">Save finals setup</button><button class="secondary-button" id="clear-finals-bracket">Clear bracket</button></div>
      <div class="section-title" style="margin-top:22px"><div><span class="eyebrow">Bracket</span><h3>Finals path</h3></div></div><div class="finals-list">${b?[card('Qualifying Final',b.qf),card('Elimination Final',b.ef),card('Preliminary Final',b.pf),card('Grand Final',b.gf)].join(''):'<div class="empty">Seed the finals after the regular season ladder is complete.</div>'}</div>`;
    } else if(commissionerTab==='windows'){
      const w=getProposalWindows(),trade=w.trade||{},delist=w.delist||{},elevation=w.elevation||{},draft=getDraftState();
      panel=`<div class="notice"><strong>League submission windows:</strong> teams cannot submit trades, rookie elevations, draft selections or delistings until you open the relevant activity. Existing pending proposals remain available for approval after a window closes.</div>
      <div class="window-admin-grid" style="margin-top:16px">
        <article class="window-admin-card"><div class="section-title"><div><span class="eyebrow">Trading</span><h3>Trade window</h3></div><span class="badge ${trade.open?'green':'red'}">${trade.open?'OPEN':'CLOSED'}</span></div><p class="muted-copy">Teams can only submit trades while this window is open. The phase you choose also controls which owned draft picks appear in trade forms.</p><div class="field-group"><label for="admin-trade-phase">Trading phase</label><select class="select" id="admin-trade-phase" ${trade.open?'disabled':''}><option ${trade.phase==='Pre-Season'?'selected':''}>Pre-Season</option><option ${trade.phase==='Mid-Season'?'selected':''}>Mid-Season</option></select></div><div class="button-row"><button class="primary-button" id="open-trade-window" ${trade.open?'disabled':''}>Open trading</button><button class="secondary-button" id="close-trade-window" ${trade.open?'':'disabled'}>Close trading</button></div>${trade.open?`<div class="notice"><strong>Active:</strong> ${esc(trade.phase)} trading opened ${fmtDate(trade.openedAt)}.</div>`:''}</article>
        <article class="window-admin-card"><div class="section-title"><div><span class="eyebrow">Delisting</span><h3>Delisting window</h3></div><span class="badge ${delist.open?'green':'red'}">${delist.open?'OPEN':'CLOSED'}</span></div><p class="muted-copy">Teams can submit one request containing one or more currently-owned players. Nothing is removed until you approve it.</p><div class="field-group"><label for="admin-delist-phase">Delisting phase</label><select class="select" id="admin-delist-phase" ${delist.open?'disabled':''}><option ${delist.phase==='Pre-Season'?'selected':''}>Pre-Season</option><option ${delist.phase==='Mid-Season'?'selected':''}>Mid-Season</option></select></div><div class="button-row"><button class="primary-button" id="open-delist-window" ${delist.open?'disabled':''}>Open delisting</button><button class="secondary-button" id="close-delist-window" ${delist.open?'':'disabled'}>Close delisting</button></div>${delist.open?`<div class="notice"><strong>Active:</strong> ${esc(delist.phase)} delisting opened ${fmtDate(delist.openedAt)}.</div>`:''}</article>
        <article class="window-admin-card"><div class="section-title"><div><span class="eyebrow">Rookie elevation</span><h3>Elevation window</h3></div><span class="badge ${elevation.open?'green':'red'}">${elevation.open?'OPEN':'CLOSED'}</span></div><p class="muted-copy">Open only at the Pre-Season or Mid-Season draft stage. Each franchise may complete one Rookie → Main elevation per season, subject to Commissioner approval.</p><div class="field-group"><label for="admin-elevation-phase">Elevation phase</label><select class="select" id="admin-elevation-phase" ${elevation.open?'disabled':''}><option ${elevation.phase==='Pre-Season'?'selected':''}>Pre-Season</option><option ${elevation.phase==='Mid-Season'?'selected':''}>Mid-Season</option></select></div><div class="button-row"><button class="primary-button" id="open-elevation-window" ${elevation.open?'disabled':''}>Open rookie elevations</button><button class="secondary-button" id="close-elevation-window" ${elevation.open?'':'disabled'}>Close rookie elevations</button></div>${elevation.open?`<div class="notice"><strong>Active:</strong> ${esc(elevation.phase)} · ${Number(elevation.season||elevationSeasonFor(elevation.phase))} · opened ${fmtDate(elevation.openedAt)}.</div>`:''}</article>
        <article class="window-admin-card"><div class="section-title"><div><span class="eyebrow">Drafting</span><h3>Draft window</h3></div><span class="badge ${draft.active?'green':'red'}">${draft.active?'OPEN':'CLOSED'}</span></div><p class="muted-copy">Drafting is opened by starting a Pre-Season or Mid-Season Draft in Draft Control. When live, only the franchise on the clock can submit the current pick. Each pick gets 3:00; expiry creates OVERTIME but does not automatically skip anyone. The Commissioner may push an overdue pick back one slot.</p><div class="notice"><strong>${draft.active?'Live now':'Currently closed'}:</strong> ${draft.active?`${esc(draft.type||'Draft')} · Pick ${Number(draft.currentPick||1)} · ${esc(team(currentDraftTeam(draft)).name)}`:'Use Draft Control to open drafting.'}</div><div class="button-row"><button class="secondary-button" id="go-draft-control">Open Draft Control</button></div></article>
      </div><div class="notice" style="margin-top:14px"><strong>Field / Rookie swaps:</strong> these remain available for teams to propose at any time, but every swap still requires Commissioner approval and must pass the swap-limit/roster checks.</div>`;
    } else if(commissionerTab==='approvals'){
      const pending=proposalCache.filter(p=>p.status==='AWAITING_COMMISSIONER'&&p.type!=='DRAFT_PICK');
      panel=`<div class="notice"><strong>Approval inbox:</strong> team proposals do not change any roster until you approve them. All rules are re-checked against the current roster at approval time.</div><div class="proposal-list" style="margin-top:14px">${commissionerProposalCards(pending)}</div>`;
    } else if(commissionerTab==='draft'){
      const pending=proposalCache.filter(p=>p.status==='AWAITING_COMMISSIONER'&&p.type==='DRAFT_PICK');
      const current=currentDraftTeam(ds),defaultType=normalizedDraftType(ds.type||'Pre-Season');
      const liveRec=Array.isArray(ds.picks)?ds.picks.find(p=>Number(p.pick)===Number(ds.currentPick||1)):null;
      const nextKey=nextDraftTeam(ds),over=draftIsOvertime(ds),pickNo=Number(ds.currentPick||1);
      panel=`<div class="commissioner-draft-state ${ds.active?'live':''}"><div><span class="eyebrow">Current draft status</span><h3>${ds.active?'LIVE - '+esc(ds.type||'Draft'):'Draft closed'}</h3><p>${ds.active?`${Number(ds.season||draftSeasonFor(ds.type))} · Pick ${pickNo} · ${esc(team(current).name)} · <strong id="admin-draft-countdown" class="${over?'overtime-clock':''}">${draftClockText(ds)}</strong>${liveRec&&liveRec.owner!==liveRec.originalOwner?` · slot originally ${esc(team(liveRec.originalOwner).owner)}`:''}`:'Draft order is generated automatically from the ladder rule.'}</p></div><span id="admin-draft-clock-badge" class="badge ${ds.active?(over?'amber':'red'):'neutral'}">${ds.active?(over?'OVERTIME':'3 MIN CLOCK'):'CLOSED'}</span></div>
      ${ds.active?`<div id="admin-draft-overtime-notice" class="notice danger" style="display:${over?'block':'none'};margin-top:14px"><strong>Overtime decision:</strong> ${nextKey?`Push back will promote ${esc(team(nextKey).name)} from Pick ${pickNo+1} to Pick ${pickNo}, and move ${esc(team(current).name)} back to Pick ${pickNo+1}. A new 3:00 clock starts immediately for ${esc(team(nextKey).name)}.`:'This is the final pick, so there is no later franchise to promote.'}</div>`:''}
      ${scoringLockStatusHtml()}
      <div class="form-grid" style="margin-top:16px"><div class="field-group"><label for="admin-draft-type">Draft type</label><select class="select" id="admin-draft-type" ${ds.active?'disabled':''}><option ${defaultType==='Pre-Season'?'selected':''}>Pre-Season</option><option ${defaultType==='Mid-Season'?'selected':''}>Mid-Season</option></select></div><div class="field-group"><label>Pick clock</label><input class="search-input" value="3:00 + Commissioner overtime control" disabled></div></div>
      <div id="admin-draft-order-preview" style="margin-top:14px">${draftOrderPreviewHtml(defaultType)}</div>
      <div id="admin-draft-pool-status" style="margin-top:14px">${draftPoolStatusHtml(defaultType)}</div>
      <div class="button-row"><button class="secondary-button" id="refresh-draft-pool" ${ds.active?'disabled':''}>Refresh current AFL player pool</button><button class="primary-button" id="start-draft" ${ds.active?'disabled':''}>Start draft</button><button class="secondary-button" id="push-draft-back" ${ds.active&&over&&nextKey?'':'disabled'}>Push overdue pick back 1</button><button class="secondary-button" id="end-draft" ${ds.active?'':'disabled'}>End draft</button></div>
      ${(ds.reorders||[]).length?`<div class="notice" style="margin-top:14px"><strong>Overtime reorder history:</strong><br>${[...(ds.reorders||[])].slice(-5).reverse().map(r=>`Pick ${Number(r.pick)}: ${esc(team(r.promotedTeam).name)} promoted; ${esc(team(r.lateTeam).name)} moved to Pick ${Number(r.pushedTo||Number(r.pick)+1)} · ${fmtDate(r.timestamp)}`).join('<br>')}</div>`:''}
      <hr style="border:0;border-top:1px solid var(--line);margin:22px 0"><div class="section-title"><div><span class="eyebrow">Team selections</span><h3>Draft approval inbox</h3></div><span class="badge amber">${pending.length} pending</span></div><div class="proposal-list">${commissionerProposalCards(pending)}</div>`;
    } else if(commissionerTab==='accounts'){
      const rows=D.teams.map(t=>{const a=teamAccountsCache.find(x=>x.teamKey===t.key)||{};return `<tr><td>${teamIdentity(t.key,'sm')}</td><td><strong>${esc(t.owner)}</strong></td><td><code>${esc(a.username||String(t.owner).toLowerCase())}</code></td><td><span class="badge ${a.provisioned&&a.active!==false?'green':'amber'}">${a.provisioned&&a.active!==false?'ACTIVE':'NOT PROVISIONED'}</span></td><td><button class="secondary-button compact-button" data-reset-team-password="${t.key}">${a.provisioned?'Reset password':'Create account'}</button></td></tr>`;}).join('');
      panel=`<div class="notice"><strong>12 franchise logins:</strong> each coach account is permanently tied to one team. Passwords are six random letters and are never stored or displayed again after creation/reset.</div><div class="button-row" style="margin-top:14px"><button class="primary-button" id="provision-team-accounts">Provision missing team accounts</button><button class="secondary-button" id="reload-team-accounts">Refresh status</button></div><div id="team-credential-output" style="margin-top:14px">${teamCredentialCache.length?credentialsTable(teamCredentialCache):''}</div><div class="table-wrap" style="margin-top:16px"><table class="data-table"><thead><tr><th>Franchise</th><th>Coach</th><th>Username</th><th>Status</th><th>Password</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    } else if(commissionerTab==='backups'){
      const rows=backupCache.map(b=>`<tr><td><strong>#${b.id}</strong></td><td>${fmtDate(b.created_at)}</td><td>${b.season||'—'}</td><td>${b.round||'—'}</td><td>${esc(b.reason||'')}</td><td>${esc(b.label||'')}</td><td><div class="backup-actions"><button class="secondary-button compact-button" data-backup-json="${b.id}">JSON</button><button class="secondary-button compact-button" data-backup-excel="${b.id}">Excel</button><button class="secondary-button compact-button danger-button" data-backup-restore="${b.id}">Restore</button></div></td></tr>`).join('');
      const audit=auditCache.slice(0,15).map(a=>`<div class="audit-row"><time>${fmtDate(a.created_at)}</time><strong>${esc(a.action)}</strong><span>${esc(a.actor_team||a.actor_role||'')}</span><small>${esc(a.entity_type||'')} ${esc(a.entity_id||'')}</small></div>`).join('');
      panel=`<div class="notice"><strong>Recovery system:</strong> finalising a round creates an immutable server backup automatically. You can also create one manually. Restore first creates an emergency pre-restore safeguard, and team login credentials are deliberately excluded from rollback.</div><div class="button-row" style="margin-top:14px"><button class="primary-button" id="create-manual-backup">Create backup now</button><button class="secondary-button" id="reload-backups">Refresh list</button></div><div class="table-wrap" style="margin-top:16px"><table class="data-table"><thead><tr><th>ID</th><th>Created</th><th>Season</th><th>Round</th><th>Reason</th><th>Label</th><th>Actions</th></tr></thead><tbody>${rows||'<tr><td colspan="7">No backups yet.</td></tr>'}</tbody></table></div><div class="section-title" style="margin-top:22px"><div><span class="eyebrow">Audit trail</span><h3>Recent official activity</h3></div></div><div class="audit-list">${audit||'<div class="empty">No audit entries loaded.</div>'}</div>`;
    } else if(commissionerTab==='figureheads'){
      const overrides=getFigureheadOverrides();
      panel=`<div class="notice"><strong>Team figureheads:</strong> PEGS automatically uses each franchise's highest-averaging current SuperCoach player. The average is used only behind the scenes and is not displayed anywhere with the figurehead. You can pin a different current roster player here.</div><div class="figurehead-admin-grid">${D.teams.map(t=>{const fh=figureheadPlayer(t.key),rows=(effectiveRosters()[t.key]||[]).slice().sort((a,b)=>a.player.localeCompare(b.player));return `<div class="figurehead-admin-card"><div class="figurehead-admin-identity">${figurehead(t.key,'md')}<div><strong>${esc(t.name)}</strong><span>${esc(fh.player)}</span><small>${fh.manual?'Commissioner override':'Automatic figurehead'}</small></div></div><div class="field-group"><label for="figurehead-${t.key}">Figurehead</label><select class="select" id="figurehead-${t.key}" data-figurehead-select="${t.key}"><option value="">Automatic · highest average</option>${rows.map(p=>`<option value="${esc(p.player)}" ${canonicalPlayerName(overrides[t.key]||'')===canonicalPlayerName(p.player)?'selected':''}>${esc(p.player)}</option>`).join('')}</select></div></div>`;}).join('')}</div>`;
    } else {
      panel=`<div class="notice"><strong>Commissioner data:</strong> export a backup of overrides, confirmed transactions, proposals and draft state, or restore one later.</div><div class="button-row" style="margin-top:16px"><button class="secondary-button" id="export-admin-state">Export Commissioner data</button><label class="secondary-button" for="import-admin-state" style="cursor:pointer">Import Commissioner data</label><input class="screen-reader-only" id="import-admin-state" type="file" accept="application/json"></div>${backendConfigured()?'<div class="notice" style="margin-top:14px"><strong>Shared mode enabled.</strong> Team proposals and Commissioner decisions are stored in the configured free backend.</div>':'<div class="notice" style="margin-top:14px"><strong>Local preview mode.</strong> Team proposals and Commissioner decisions stay in this browser until the free shared backend is configured.</div>'}`;
    }
    commissionerContent.innerHTML=`<div class="commissioner-body"><div class="commissioner-title-row"><div><span class="eyebrow">Private administration</span><h3>Commissioner Control Centre</h3></div><span class="badge green">Unlocked</span></div>${commissionerTabs()}<div class="admin-panel">${panel}</div></div>`;
    document.querySelectorAll('[data-admin-tab]').forEach(btn=>btn.addEventListener('click',async()=>{commissionerTab=btn.dataset.adminTab;if(commissionerTab==='accounts')await loadTeamAccounts();if(commissionerTab==='backups')await Promise.all([syncBackups(),syncAudit()]);renderCommissionerControls();}));
    document.getElementById('commissioner-logout')?.addEventListener('click',()=>{teamCredentialCache=[];clearCommissionerSession();dismissDialog(commissionerDialog);toast(`Commissioner Mode disabled.${teamLoggedIn()?' Team Login remains active.':''}`);render();});
    document.querySelectorAll('[data-proposal-approve]').forEach(btn=>btn.addEventListener('click',()=>void approveProposal(btn.dataset.proposalApprove)));
    document.querySelectorAll('[data-proposal-reject]').forEach(btn=>btn.addEventListener('click',()=>void rejectProposal(btn.dataset.proposalReject)));

    if(commissionerTab==='scores'){
      document.getElementById('sync-live-feed')?.addEventListener('click',()=>void syncLiveProvider(true));
      document.getElementById('sync-opening-feed')?.addEventListener('click',()=>void syncLiveProvider(true,0));
      document.getElementById('capture-opening-bank')?.addEventListener('click',()=>captureOpeningRoundBank());
      document.getElementById('finalise-current-round')?.addEventListener('click',()=>void finalizeRound(effectiveCurrentRound(),false));
      document.getElementById('force-finalise-current-round')?.addEventListener('click',()=>{if(confirm('Finalise this round even though the live-feed game check may be incomplete?'))void finalizeRound(effectiveCurrentRound(),true);});
      const roundEl=document.getElementById('comm-round'),teamEl=document.getElementById('comm-team'),playerEl=document.getElementById('comm-player'),selectionEl=document.getElementById('comm-selection');
      const load=()=>{selectionEl.value=selectionOverride(Number(roundEl.value),teamEl.value,playerEl.value)||'';};
      const refreshPlayers=()=>{const rd=Number(roundEl.value),key=teamEl.value;playerEl.innerHTML=teamRoundPlayers(rd,key).map(p=>`<option value="${esc(p.player)}">${esc(p.player)}${p.scoreSource==='Opening Round banked'?' · OR bank':''}</option>`).join('');load();};
      const refreshTeams=()=>{teamEl.innerHTML=D.teams.map(t=>`<option value="${t.key}">${esc(t.name)}</option>`).join('');refreshPlayers();};
      roundEl.addEventListener('change',refreshTeams);teamEl.addEventListener('change',refreshPlayers);playerEl.addEventListener('change',load);load();
      document.getElementById('save-selection-override')?.addEventListener('click',()=>{const all=getSelectionOverrides(),id=overrideId(Number(roundEl.value),teamEl.value,playerEl.value),v=String(selectionEl.value||'');if(v)all[id]=v;else delete all[id];saveSelectionOverrides(all);toast(v==='OUT'?`${playerEl.value} forced OUT — projection is 0.`:`${playerEl.value} selection override saved.`);render();});
      document.getElementById('clear-selection-override')?.addEventListener('click',()=>{const all=getSelectionOverrides();delete all[overrideId(Number(roundEl.value),teamEl.value,playerEl.value)];saveSelectionOverrides(all);selectionEl.value='';toast('Selection returned to live feed.');render();});
      document.getElementById('open-matchups-from-admin')?.addEventListener('click',()=>{matchupScoreEditOpen=true;commissionerDialog.close();routeTo('matchups/'+effectiveCurrentRound());});
    }
    if(commissionerTab==='finals'){
      const saveFinals=(useLadder=false)=>{
        const setup=getSeasonSetup(),ladder=[...effectiveLadder()].sort((a,b)=>Number(a.position)-Number(b.position)),seeds=useLadder?ladder.slice(0,4).map(x=>x.team):[0,1,2,3].map(i=>document.getElementById(`final-seed-${i}`)?.value).filter(Boolean);
        if(seeds.length!==4||new Set(seeds).size!==4){toast('Finals require four different teams.');return;}
        const finals={enabled:true,format:'TOP4_PAGE',week1Round:Number(document.getElementById('final-week1-round')?.value||21),preliminaryRound:Number(document.getElementById('final-prelim-round')?.value||22),grandFinalRound:Number(document.getElementById('final-gf-round')?.value||23),bracket:{seededAt:new Date().toISOString(),seeds}};
        if(!(finals.week1Round<finals.preliminaryRound&&finals.preliminaryRound<finals.grandFinalRound)){toast('Finals rounds must run in chronological order.');return;}
        saveSeasonSetup({...setup,finals,updatedAt:new Date().toISOString()});toast(`Finals seeded: ${seeds.map((k,i)=>`${i+1} ${team(k).name}`).join(' · ')}`);render();renderCommissionerControls();
      };
      document.getElementById('seed-finals-from-ladder')?.addEventListener('click',()=>saveFinals(true));
      document.getElementById('save-finals-setup')?.addEventListener('click',()=>saveFinals(false));
      document.getElementById('clear-finals-bracket')?.addEventListener('click',()=>{const setup=getSeasonSetup(),f=finalsConfig(setup);saveSeasonSetup({...setup,finals:{...f,bracket:null},updatedAt:new Date().toISOString()});toast('Finals bracket cleared.');render();renderCommissionerControls();});
    }
    if(commissionerTab==='windows'){
      document.getElementById('open-trade-window')?.addEventListener('click',()=>{const w=getProposalWindows(),phase=document.getElementById('admin-trade-phase').value,now=new Date().toISOString();saveProposalWindows({...w,trade:{open:true,phase,openedAt:now,closedAt:null}});toast(`${phase} trading is now open.`);render();renderCommissionerControls();});
      document.getElementById('close-trade-window')?.addEventListener('click',()=>{const w=getProposalWindows();saveProposalWindows({...w,trade:{...(w.trade||{}),open:false,closedAt:new Date().toISOString()}});toast('Trading submissions closed.');render();renderCommissionerControls();});
      document.getElementById('open-delist-window')?.addEventListener('click',()=>{const w=getProposalWindows(),phase=document.getElementById('admin-delist-phase').value,now=new Date().toISOString();saveProposalWindows({...w,delist:{open:true,phase,openedAt:now,closedAt:null}});toast(`${phase} delisting is now open.`);render();renderCommissionerControls();});
      document.getElementById('close-delist-window')?.addEventListener('click',()=>{const w=getProposalWindows();saveProposalWindows({...w,delist:{...(w.delist||{}),open:false,closedAt:new Date().toISOString()}});toast('Delisting submissions closed.');render();renderCommissionerControls();});
      document.getElementById('open-elevation-window')?.addEventListener('click',()=>{const w=getProposalWindows(),phase=document.getElementById('admin-elevation-phase').value,season=elevationSeasonFor(phase),now=new Date().toISOString();saveProposalWindows({...w,elevation:{open:true,phase,season,openedAt:now,closedAt:null}});toast(`${season} ${phase} rookie elevations are now open.`);render();renderCommissionerControls();});
      document.getElementById('close-elevation-window')?.addEventListener('click',()=>{const w=getProposalWindows();saveProposalWindows({...w,elevation:{...(w.elevation||{}),open:false,closedAt:new Date().toISOString()}});toast('Rookie elevation submissions closed.');render();renderCommissionerControls();});
      document.getElementById('go-draft-control')?.addEventListener('click',()=>{commissionerTab='draft';renderCommissionerControls();});
    }
    if(commissionerTab==='season'){
      let analysed=getSeasonSetup();
      const renderSeasonAnalysis=()=>{document.getElementById('season-round-preview').innerHTML=seasonRoundPreview(analysed);document.getElementById('opening-round-map').innerHTML=openingRoundMappingControls(analysed);};
      const analyse=()=>{
        const parsed=parseAflFixtureCsv(document.getElementById('afl-fixture-csv').value);
        const year=Number(document.getElementById('season-year').value||currentSeason()+1),regular=Number(document.getElementById('season-regular-rounds').value||20);
        const existing=analysed?.openingRound?.bankDestinations||{};
        const mapped=applyOpeningBankDestinations(parsed,Object.keys(existing).length?existing:parsed.openingRound?.suggestedBankDestinations||{});
        analysed={...analysed,season:year,currentRound:Number(document.getElementById('season-current-round').value||1),openingRound:mapped.openingRound,aflFixtureCsv:document.getElementById('afl-fixture-csv').value,aflGameCount:mapped.games.length,rounds:mapped.rounds,pegsRegularRounds:regular,liveScoringEnabled:document.getElementById('season-live-enabled').value==='1'};
        renderSeasonAnalysis(); return analysed;
      };
      document.getElementById('retrieve-afl-fixture')?.addEventListener('click',async()=>{
        const btn=document.getElementById('retrieve-afl-fixture'),year=Number(document.getElementById('season-year').value||currentSeason()+1);btn.disabled=true;btn.textContent='Retrieving…';
        try{
          const payload=await retrieveAflFixtureForSeason(year);
          document.getElementById('afl-fixture-csv').value=payload.csv;
          analysed={...analysed,fixtureSource:payload.source||'Squiggle AFL fixture API',fixtureRetrievedAt:payload.retrievedAt||new Date().toISOString(),fixtureProviderYear:Number(payload.season||year)};
          analyse();
          toast(`${year} AFL fixture retrieved: ${analysed.aflGameCount} games, ${analysed.openingRound?.enabled?'Opening Round detected':'no Opening Round'}.`);
        }catch(e){console.warn(e);toast(e.message||'AFL fixture retrieval failed.');}
        finally{btn.disabled=false;btn.textContent='Retrieve AFL fixture';}
      });
      document.getElementById('analyse-afl-fixture')?.addEventListener('click',()=>{analyse();toast(`${analysed.openingRound?.enabled?'Opening Round detected':'No Opening Round detected'}. Bye counts recalculated.`);});
      document.getElementById('afl-fixture-file')?.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{document.getElementById('afl-fixture-csv').value=await f.text();analysed={...analysed,fixtureSource:'Commissioner CSV upload',fixtureRetrievedAt:new Date().toISOString()};analyse();toast(`Fixture loaded: ${analysed.rounds.length} AFL rounds, ${analysed.openingRound?.enabled?'Opening Round detected':'no Opening Round'}.`);}catch(_){toast('The AFL fixture file could not be read.');}});
      document.getElementById('opening-round-map')?.addEventListener('change',()=>{analysed=readOpeningRoundMapping(analysed);document.getElementById('season-round-preview').innerHTML=seasonRoundPreview(analysed);});
      document.getElementById('generate-pegs-fixture')?.addEventListener('click',()=>{const regular=Number(document.getElementById('season-regular-rounds').value||20),fixtures=generatePegsFixture(regular);document.getElementById('pegs-fixture-csv').value=pegsFixtureCsv(fixtures);document.getElementById('pegs-fixture-preview').innerHTML=seasonFixturePreview(fixtures);toast(`${regular}-round PEGS fixture generated.`);});
      document.getElementById('pegs-fixture-csv')?.addEventListener('input',e=>{document.getElementById('pegs-fixture-preview').innerHTML=seasonFixturePreview(parsePegsFixtureCsv(e.target.value));});
      document.getElementById('save-season-setup')?.addEventListener('click',()=>{let base=analyse();base=readOpeningRoundMapping(base);if(!Number(base.aflGameCount||0)){toast('Retrieve or load the AFL fixture before activating the season.');return;}const fixtures=parsePegsFixtureCsv(document.getElementById('pegs-fixture-csv').value),regular=Number(document.getElementById('season-regular-rounds').value||20),errors=validatePegsFixture(fixtures,regular);if(errors.length){toast(errors[0]);return;}const priorOrder=(getSeasonSetup()?.preSeasonDraftOrder?.length?getSeasonSetup().preSeasonDraftOrder:[...D.ladder].sort((a,b)=>Number(b.position||0)-Number(a.position||0)).map(r=>r.team));const value={...base,active:true,pegsFixtures:fixtures,preSeasonDraftOrder:priorOrder,updatedAt:new Date().toISOString()};saveSeasonSetup(value);const pill=document.getElementById('season-pill-year');if(pill)pill.textContent=String(value.season);toast(`${value.season} season activated.`);render();renderCommissionerControls();});
      document.getElementById('deactivate-season-setup')?.addEventListener('click',()=>{saveSeasonSetup({...getSeasonSetup(),active:false,updatedAt:new Date().toISOString()});const pill=document.getElementById('season-pill-year');if(pill)pill.textContent=String(D.meta.season);toast('Workbook season restored.');render();renderCommissionerControls();});
    }
    if(commissionerTab==='draft'){
      startDraftTicker();
      const adminTick=()=>{const el=document.getElementById('admin-draft-countdown');if(el)el.textContent=clockText(draftSecondsRemaining(getDraftState()));};adminTick();
      document.getElementById('admin-draft-type')?.addEventListener('change',e=>{const box=document.getElementById('admin-draft-order-preview'),poolBox=document.getElementById('admin-draft-pool-status');if(box)box.innerHTML=draftOrderPreviewHtml(e.target.value);if(poolBox)poolBox.innerHTML=draftPoolStatusHtml(e.target.value);});
      document.getElementById('refresh-draft-pool')?.addEventListener('click',async()=>{const btn=document.getElementById('refresh-draft-pool'),type=normalizedDraftType(document.getElementById('admin-draft-type').value),box=document.getElementById('admin-draft-pool-status');btn.disabled=true;try{await refreshCurrentDraftPool(type,(i,club)=>{if(box)box.innerHTML=`<div class="notice"><strong>Refreshing AFL player pool…</strong> ${Math.min(i,18)}/18 clubs${club&&club!=='DONE'?` · ${esc(club)}`:''}</div>`;});toast('Current AFL player pool captured and frozen-ready.');}catch(e){toast(e.message||'Draft pool refresh failed.');}finally{btn.disabled=false;renderCommissionerControls();}});
      document.getElementById('start-draft')?.addEventListener('click',async()=>{const type=normalizedDraftType(document.getElementById('admin-draft-type').value),pool=draftPoolRecord(),season=draftSeasonFor(type);if(!pool?.complete||Number(pool.season)!==season||normalizedDraftType(pool.phase)!==type){toast('Refresh a complete 18-club current-price player pool before starting this draft.');return;}await syncServerAuthority();const ladderSnapshot=draftLadderOrder(type),picks=draftPickLedger(type,{ladderOrder:ladderSnapshot}),order=picks.map(p=>p.owner),now=new Date().toISOString(),value={active:true,type,season,rounds:draftRoundsFor(type),timerSeconds:180,currentIndex:0,currentPick:1,ladderSnapshot,baseOrder:picks.map(p=>p.originalOwner),picks,order,poolSessionId:pool.session_id,sessionId:'draft-'+Date.now(),startedAt:now,pickStartedAt:now,updatedAt:now,reorders:[]};saveDraftState(value);await logCommissioner('DRAFT_STARTED','draft',value.sessionId,{type,season,poolSessionId:pool.session_id,playerCount:pool.player_count});toast(`${value.season} ${value.type} draft is live. Pick 1 has 3 minutes.`);render();renderCommissionerControls();});
      document.getElementById('push-draft-back')?.addEventListener('click',async()=>{
        const before=getDraftState(),pick=Number(before.currentPick||1),lateTeam=currentDraftTeam(before),promotedTeam=nextDraftTeam(before);
        if(!before.active||!draftIsOvertime(before)||!promotedTeam){toast('That pick cannot currently be pushed back.');return;}
        try{
          if(backendConfigured()){
            const value=await commissionerFetch('/rest/v1/rpc/pegs_push_draft_pick_back',{method:'POST',body:'{}'});
            if(value&&typeof value==='object')localStorage.setItem(DRAFT_STATE_KEY,JSON.stringify(value));
            await pullSharedState();
          } else {
            const result=pushDraftPickBackLocal(); if(!result.changed){toast(result.reason||'That pick cannot be pushed back.');return;}
          }
          toast(`${team(promotedTeam).name} promoted to Pick ${pick}; ${team(lateTeam).name} moves to Pick ${pick+1}.`);render();renderCommissionerControls();
        }catch(e){toast(e.message||'Could not reorder the overdue pick.');}
      });
      document.getElementById('end-draft')?.addEventListener('click',()=>{
        const current=getDraftState(),value={...current,active:false,endedAt:new Date().toISOString(),updatedAt:new Date().toISOString()};saveDraftState(value);
        if(current.type==='Pre-Season'){captureScoringSnapshot('Pre-Season',1);toast('Pre-Season Draft ended. Scoring rosters locked from Round 1 until the Mid-Season Draft.');}
        else if(current.type==='Mid-Season'){const from=nextUnfinalizedScoringRound();captureScoringSnapshot('Mid-Season',from);toast(`Mid-Season Draft ended. New scoring rosters locked from Round ${from}.`);}
        else toast('Draft ended.');
        render();renderCommissionerControls();
      });
    }
    if(commissionerTab==='accounts'){
      document.getElementById('reload-team-accounts')?.addEventListener('click',async()=>{await loadTeamAccounts();renderCommissionerControls();});
      document.getElementById('provision-team-accounts')?.addEventListener('click',async()=>{try{const x=await teamAccountAdmin('provision_missing');teamCredentialCache=x.credentials||[];await loadTeamAccounts();toast(`${teamCredentialCache.length} team account${teamCredentialCache.length===1?'':'s'} created.`);renderCommissionerControls();}catch(e){toast(e.message||'Could not provision team accounts.');}});
      document.querySelectorAll('[data-reset-team-password]').forEach(btn=>btn.addEventListener('click',async()=>{const k=btn.dataset.resetTeamPassword;if(!confirm(`Generate a new six-letter password for ${team(k).owner}? Their old password will stop working.`))return;try{const x=await teamAccountAdmin('reset',k);teamCredentialCache=x.credential?[x.credential]:[];await loadTeamAccounts();toast(`${team(k).owner} password reset.`);renderCommissionerControls();}catch(e){toast(e.message||'Password reset failed.');}}));
    }
    if(commissionerTab==='backups'){
      document.getElementById('create-manual-backup')?.addEventListener('click',async()=>{try{const id=await createServerBackup('MANUAL','Commissioner manual backup');await syncAudit();toast(`Backup #${id} created.`);renderCommissionerControls();}catch(e){toast(e.message||'Backup failed.');}});
      document.getElementById('reload-backups')?.addEventListener('click',async()=>{await Promise.all([syncBackups(),syncAudit()]);renderCommissionerControls();});
      document.querySelectorAll('[data-backup-json]').forEach(btn=>btn.addEventListener('click',()=>void exportBackupJson(btn.dataset.backupJson).catch(e=>toast(e.message))));
      document.querySelectorAll('[data-backup-excel]').forEach(btn=>btn.addEventListener('click',()=>void exportBackupExcel(btn.dataset.backupExcel).catch(e=>toast(e.message))));
      document.querySelectorAll('[data-backup-restore]').forEach(btn=>btn.addEventListener('click',async()=>{try{if(await restoreServerBackup(btn.dataset.backupRestore)){await syncAudit();toast('Backup restored. A pre-restore safeguard was created automatically.');render();renderCommissionerControls();}}catch(e){toast(e.message||'Restore failed.');}}));
    }
    if(commissionerTab==='figureheads'){
      document.querySelectorAll('[data-figurehead-select]').forEach(el=>el.addEventListener('change',()=>{const all=getFigureheadOverrides(),key=el.dataset.figureheadSelect;if(el.value)all[key]=el.value;else delete all[key];saveFigureheadOverrides(all);toast(el.value?`${team(key).name} figurehead pinned to ${el.value}.`:`${team(key).name} returned to automatic figurehead.`);render();renderCommissionerControls();}));
    }
    if(commissionerTab==='data'){
      document.getElementById('export-admin-state').addEventListener('click',()=>{const data={version:12,exportedAt:new Date().toISOString(),overrides:getOverrides(),selectionOverrides:getSelectionOverrides(),actions:getCommissionerActions(),draftState:getDraftState(),proposalWindows:getProposalWindows(),scoringSnapshots:getScoringSnapshots(),figureheadOverrides:getFigureheadOverrides(),transactionReversals:getTransactionReversals(),proposals:proposalCache,seasonSetup:getSeasonSetup(),seasonResults:getSeasonResults(),liveFeed:getLiveFeed(),openingBank:getOpeningBank()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='pegs-commissioner-data-v12.json';a.click();URL.revokeObjectURL(a.href);toast('Commissioner data exported.');});
      document.getElementById('import-admin-state').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const x=JSON.parse(await f.text());saveOverrides(x.overrides||{});saveSelectionOverrides(x.selectionOverrides||{});saveCommissionerActions(x.actions||[]);saveDraftState(x.draftState||{});if(x.proposalWindows)saveProposalWindows(x.proposalWindows);if(x.scoringSnapshots)saveScoringSnapshots(x.scoringSnapshots);if(x.figureheadOverrides)saveFigureheadOverrides(x.figureheadOverrides);if(x.transactionReversals)saveTransactionReversals(x.transactionReversals);if(x.seasonSetup)saveSeasonSetup(x.seasonSetup);if(x.seasonResults)saveSeasonResults(x.seasonResults);if(x.liveFeed)saveLiveFeed(x.liveFeed);if(x.openingBank)saveOpeningBank(x.openingBank);if(!backendConfigured())saveLocalProposals((x.proposals||[]).map(normalizeProposal));toast('Commissioner data restored.');render();renderCommissionerControls();}catch(_){toast('That backup could not be imported.');}});
    }
  }

  function render() {
    clearInteractionDraft();
    const {page,parts}=currentRoute();
    setNavState(page);
    if(page==='home') renderHome();
    else if(page==='matchups') renderMatchups(parts);
    else if(page==='results') renderResults(parts);
    else if(page==='teams') renderTeams();
    else if(page==='team') renderTeamDetail((parts[0]||'BRETT').toUpperCase());
    else if(page==='ladder') renderLadder();
    else if(page==='draft') renderDraft();
    else if(page==='transactions') renderTransactions();
    else if(page==='history') renderHistory();
    else renderHome();
    main.focus({preventScroll:true});
  }

  function refreshDraftCheck() {
    const out=document.getElementById('draft-check-output'); if(!out) return;
    const p=draftSelection?draftPlayerByName(draftSelection):null;
    if(!p){out.innerHTML='<div class="notice" style="margin-top:16px">Select an available player to run the salary-cap and positional checks.</div>';return;}
    const state=getDraftState(),key=currentDraftTeam(state),pending=proposalCache.some(x=>x.type==='DRAFT_PICK'&&activeProposalStatus(x.status)&&Number(x.payload?.pick)===Number(state.currentPick||1)&&x.proposerTeam===key),canSubmit=Boolean(state.active&&teamLoggedIn()&&loggedTeamKey()===key);
    out.innerHTML=draftCheckOutput(key,p,document.getElementById('draft-contract').value,document.getElementById('draft-status').value,canSubmit,pending,document.getElementById('draft-fixed-position')?.value||String(p.position||'').split('/')[0]);
  }

  document.addEventListener('click', e => {
    const routeBtn=e.target.closest('[data-route]');
    if(routeBtn){routeTo(routeBtn.dataset.route);return;}
    if(e.target.closest('#submit-draft-proposal')){void handleDraftProposalSubmission();return;}
    const action=e.target.closest('[data-action]'); if(!action)return;
    const type=action.dataset.action;
    if(type==='open-team'){selectedRosterFilter='ALL';routeTo('team/'+action.dataset.team);}
    if(type==='open-player-profile'){showPlayerProfile(action.dataset.team,action.dataset.player);}
    if(type==='roster-filter'){selectedRosterFilter=action.dataset.filter;render();}
    if(type==='open-matchup'||type==='select-matchup'){routeTo(`matchups/${action.dataset.round}/${action.dataset.home}/${action.dataset.away}`);}
    if(type==='select-draft-player'){draftSelection=action.dataset.player;renderDraft();refreshDraftCheck();}
    if(type==='tx-filter'){const value=action.dataset.type,params=new URLSearchParams(location.hash.split('?')[1]||'');if(value==='All')params.delete('type');else params.set('type',value);if(teamLoggedIn()&&transactionScope==='all')params.set('scope','all');else params.delete('scope');location.hash='transactions'+(params.toString()?'?'+params.toString():'');render();}
    if(type==='tx-scope'){transactionScope=action.dataset.scope==='all'?'all':'mine';const params=new URLSearchParams(location.hash.split('?')[1]||'');if(transactionScope==='all')params.set('scope','all');else params.delete('scope');location.hash='transactions'+(params.toString()?'?'+params.toString():'');render();}
  });

  document.addEventListener('change', e => {
    if(protectedInteractionTarget(e.target))markInteractionDraft();
    if(e.target.id==='round-select'){routeTo('matchups/'+e.target.value);}
    if(e.target.id==='results-round-select'){routeTo('results/'+e.target.value);}
    if(e.target.id==='team-view-select'){selectedRosterFilter='ALL';const value=String(e.target.value||'').toUpperCase();if(value===loggedTeamKey())routeTo('teams');else routeTo('team/'+value);}
    if(['draft-contract','draft-status','draft-fixed-position'].includes(e.target.id)) refreshDraftCheck();
  });

  document.addEventListener('input', e => {
    if(protectedInteractionTarget(e.target))markInteractionDraft();
    if(e.target.id==='draft-search'){
      draftSearch=e.target.value;
      const results=document.getElementById('draft-search-results');
      if(results){results.innerHTML=availablePlayers().map(p=>`<button class="player-option ${draftSelection===p.player?'selected':''}" data-action="select-draft-player" data-player="${esc(p.player)}"><span><strong>${esc(p.player)}</strong><small>${esc(p.position)} - ${esc(p.club)} - Avg ${p.average}</small></span><span class="money"><strong>${money(p.startPrice||p.price)}</strong><small>${getDraftState().active?'frozen':'price'}</small></span></button>`).join('')||'<div class="empty">No available players match.</div>';}
    }
  });

  const introLoader={el:document.getElementById('intro-loading-screen'),fill:document.getElementById('intro-loading-fill'),percent:document.getElementById('intro-loading-percent'),label:document.getElementById('intro-loading-label'),skip:document.getElementById('intro-loading-skip'),startedAt:Date.now(),hidden:false};

  function setIntroProgress(value,label){
    if(!introLoader.el||introLoader.hidden)return;
    const pct=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
    if(introLoader.fill)introLoader.fill.style.width=`${pct}%`;
    if(introLoader.percent)introLoader.percent.textContent=`${pct}%`;
    if(label&&introLoader.label)introLoader.label.textContent=label;
  }

  function finishIntroLoader({label='Ready to play',immediate=false}={}){
    if(!introLoader.el||introLoader.hidden)return Promise.resolve();
    // Update the visible bar before marking the loader hidden; otherwise
    // setIntroProgress intentionally ignores the final 100% update.
    setIntroProgress(100,label);
    introLoader.hidden=true;
    if(window.__pegsIntroFailsafe){clearTimeout(window.__pegsIntroFailsafe);window.__pegsIntroFailsafe=0;}
    const elapsed=Date.now()-introLoader.startedAt;
    const wait=immediate?0:Math.max(0,1700-elapsed);
    return new Promise(resolve=>setTimeout(resolve,wait)).then(()=>{
      introLoader.el.classList.add('is-exiting');
      setTimeout(()=>introLoader.el?.remove(),700);
    });
  }

  setIntroProgress(7,'Warming up stadium lights…');
  const introAppFailsafe=setTimeout(()=>{void finishIntroLoader({label:'League hub ready',immediate:true});},5500);
  const finishIntroOriginal=finishIntroLoader;
  // Keep a local failsafe handle so every normal finish path cancels it.
  const finishIntroSafely=(options)=>{clearTimeout(introAppFailsafe);return finishIntroOriginal(options);};
  introLoader.skip?.addEventListener('click',()=>{void finishIntroSafely({label:'Skipping intro…',immediate:true});});

  document.getElementById('open-team-login')?.addEventListener('click',()=>{void teamLoginUI();teamDialog.showModal();});
  document.getElementById('open-commissioner').addEventListener('click',()=>{commissionerUI();commissionerDialog.showModal();});
  commissionerDialog?.addEventListener('close',clearInteractionDraft);
  teamDialog?.addEventListener('close',clearInteractionDraft);
  window.addEventListener('hashchange',()=>{clearInteractionDraft();render();});
  window.addEventListener('storage',e=>{if([OVERRIDE_KEY,SELECTION_OVERRIDE_KEY,COMM_ACTIONS_KEY,TRANSACTION_REVERSALS_KEY,DRAFT_STATE_KEY,PROPOSALS_KEY,SEASON_SETUP_KEY,SEASON_RESULTS_KEY,LIVE_FEED_KEY,OPENING_BANK_KEY,PROPOSAL_WINDOWS_KEY,SCORING_SNAPSHOTS_KEY,DRAFT_POOL_KEY].includes(e.key)){if(e.key===PROPOSALS_KEY)proposalCache=getLocalProposals();backgroundRefreshUi();}});

  // Lightweight non-UI test surface used by the bundled QA script.
  window.__PEGS_TEST__={render,markInteractionDraft,clearInteractionDraft,backgroundRefreshUi,parseAflFixtureCsv,generatePegsFixture,validatePegsFixture,saveSeasonSetup,getSeasonSetup,saveLiveFeed,getLiveFeed,getSelectionOverrides,saveSelectionOverrides,saveOpeningBank,getOpeningBank,calcTeamRound,effectiveRoundRecord,scoreCountForRoundRecord,topPlayersForRound,effectiveLadder,projectedLadderForRound,liveRoundBadge,liveFeedCompleteForRound,normalizeAvailabilityStatus,unavailableForProjection,mergeProviderTeamRecord,preSeasonDraftOrder,draftPickLedger,teamRoundPlayers,availabilityInfo,currentSeason,effectiveCurrentRound,getProposalWindows,saveProposalWindows,proposalWindowOpen,getScoringSnapshots,saveScoringSnapshots,captureScoringSnapshot,scoringSnapshotForRound,scoringRostersForRound,futureScoringRound,nextUnfinalizedScoringRound,effectiveRosters,rosterSummary,rosterIsLegal,getTransactionReversals,saveTransactionReversals,visibleLegacyTransactions,transactionRecords,transactionPickRefs,transactionDependency,reverseTransaction,verifyCommissionerPassword,commissionerLoggedIn,teamLoggedIn,loggedTeamKey,clearBackendSession,clearCommissionerSession,dismissDialog,tradeActionFor,tradeImpactHtml,activeProposalStatus,submitProposal,respondTrade,approveProposal,getDraftState,saveDraftState,draftOrder,currentDraftTeam,nextDraftTeam,draftSecondsRemaining,draftIsOvertime,pushDraftPickBackLocal,advanceDraftLocal,getFigureheadOverrides,saveFigureheadOverrides,figureheadPlayer,figureheadAverage,playerPhotoUrl,playerProfileRoundCeiling,playerSeasonScoreHistory,playerPerformance,ordinal,teamFixtureRows,personalisedCurrentRound,completedTeamFixtures,personalisedLadderData,transactionInvolvesTeam,teamDashboardData,renderPersonalizedHome,finalsConfig,calculatedFinalsBracket,effectiveFinals,roundLabel,finalizeRound};

  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  setIntroProgress(18,'Loading local league settings…');
  proposalCache=getLocalProposals();
  setIntroProgress(36,'Rendering franchises and fixtures…');
  const seasonPill=document.getElementById('season-pill-year'); if(seasonPill)seasonPill.textContent=String(currentSeason());
  updateSessionUI();render();
  setIntroProgress(58,'Base site ready…');
  if(backendConfigured()){
    (async()=>{
      try{
        setIntroProgress(68,'Connecting to league server…');
        await refreshIdentity();
        await refreshCommissionerSession();
        setIntroProgress(82,'Syncing scores, trades and draft state…');
        await Promise.all([pullSharedState(),syncProposals(),loadDraftPool()]);
        if(commissionerLoggedIn()){setIntroProgress(92,'Authorising commissioner controls…');await syncServerAuthority();}
        const pill=document.getElementById('season-pill-year');if(pill)pill.textContent=String(currentSeason());
        updateSessionUI();render();
        await finishIntroSafely({label:'League hub ready'});
      }catch(_){
        await finishIntroSafely({label:'Loaded in offline mode'});
      }
    })();
    setInterval(()=>Promise.all([pullSharedState(),syncProposals(),loadDraftPool()]).then(()=>{const pill=document.getElementById('season-pill-year');if(pill)pill.textContent=String(currentSeason());backgroundRefreshUi();}).catch(()=>{}),10000);
    const refreshSeconds=Math.max(60,Number(CONFIG.liveRefreshSeconds||90));
    setInterval(()=>{if(activeSeasonSetup()?.liveScoringEnabled!==false)void syncLiveProvider(false);},refreshSeconds*1000);
  } else void finishIntroSafely({label:'League hub ready'});
})();
