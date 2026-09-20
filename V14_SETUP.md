# PEGS v14 upgrade

This upgrade is designed for the existing PEGS v13.2 deployment. It adds franchise logins, team-enforced transactions/drafting, two-stage trade approval, current-price draft-pool snapshots, audit history, and server backups with JSON/Excel export + restore.

## What changes

### Franchise accounts
- One Supabase Auth account per PEGS franchise.
- Username shown to users is the current coach name (Cama, Jayden, Tom, Brett, Semini, Karikas, Darcy, Pat, Schulz, Fenner, Peto, Marcus).
- The Commissioner provisions/reset accounts from **Commissioner > Team accounts**.
- Passwords are six random uppercase letters. The password is shown to the Commissioner only at creation/reset and is not stored in PEGS tables or website files.
- Server-side RPCs derive the franchise from the authenticated user. A coach cannot submit a draft pick, swap, delisting or trade as another franchise by editing browser fields.

### Trades
- Flow: proposer -> counterparty -> Commissioner.
- Before submission PEGS displays both teams' before/after:
  - Main-contract salary / $9.5m cap
  - Field salary / $9.5m cap
  - Rookie-contract salary / $400k cap
  - Main-contract count / 28
  - Field count / 28
  - DEF / MID / FWD / RUC Field counts (8 / 10 / 8 / 2)
- Proposal is blocked unless **both teams** remain legal.
- The receiving coach sees the same impact before accepting.
- Server rules re-check ownership and both rosters on proposal, counterparty acceptance and Commissioner approval.
- Up to 3 players and 3 owned draft picks per side.

### Current AFL draft pool
- Commissioner runs **Refresh current AFL player pool** immediately before a Pre-Season or Mid-Season draft.
- Supercoach.live is fetched one AFL club per Edge Function invocation to stay within free-tier worker limits.
- PEGS requires all 18 clubs and at least 35 valid priced/positioned players from every club before the pool is marked complete.
- Every player already on a PEGS list is removed before the snapshot is stored.
- Exact structured SuperCoach prices are used when available; table display price is the fallback.
- The pool and prices are frozen when the draft starts.
- Only the franchise currently on the live draft clock can submit a pick.

### Backups and restore
- Every Commissioner round finalisation creates an immutable server backup (the normal weekly backup point).
- Commissioner can also create a backup manually.
- Backups contain shared league state, proposal history, frozen draft pools, authoritative rosters, pick ownership, audit history and a derived human-readable league snapshot.
- **JSON** is the restoration/archive format.
- **Excel** export contains League Summary, Team Lists, Ladder, Round Results, Player Scores, Transactions, Draft History, Draft Pick Ownership, Opening Round Banking, Finals, Season Settings and Audit Log.
- Restore automatically creates a pre-restore safeguard first.
- Franchise Auth accounts/passwords are deliberately excluded from restore so a league rollback never changes login credentials.

## Installation order for the existing project

Do these in order. The SQL upgrade is additive and can run while v13.2 is still the live front end.

### 1. Run the database upgrade
Open Supabase Dashboard -> SQL Editor -> New query.
Paste the complete contents of `V14_UPGRADE.sql` and click **Run**.
Expected result: success/no rows returned.

### 2. Replace/add Edge Functions locally
Copy:
- `supabase/functions/supercoach-sync/index.ts` -> replace existing file.
- `supabase/functions/team-account-admin/index.ts` -> add this new folder/file.

From the PEGS project folder deploy:

```powershell
npx.cmd supabase functions deploy supercoach-sync --no-verify-jwt
npx.cmd supabase functions deploy team-account-admin
```

Important: `team-account-admin` must **not** be deployed with `--no-verify-jwt`. It uses the logged-in Commissioner token and the server-side Supabase service role environment to create/reset Auth users. The service-role key is never placed in the website.

### 3. Replace the four static website files
Replace:
- `app.js`
- `styles.css`
- `index.html`
- `sw.js`

Do not replace `config.js` or `league-data.js`.

Start the local website and hard refresh (`Ctrl + F5`).

### 4. Initialise server authority
Log in as Commissioner once after the upgrade. The site automatically mirrors the current official rosters and draft-pick ownership into server authority tables. Until this has happened, team trade/draft submissions deliberately fail closed.

### 5. Provision the 12 coach accounts
Commissioner -> **Team accounts** -> **Provision missing team accounts**.
Copy the displayed username/password sheet immediately and distribute each credential privately to the relevant coach. PEGS does not store plaintext passwords. A lost password is reset from the same panel.

### 6. Test one team account
Log out of Commissioner, choose **Team Login**, sign in with one test coach credential, and verify:
- Moves is locked to that franchise.
- Incoming trade requests can be accepted/declined only by that franchise.
- A draft pick can only be submitted when that franchise is on the clock.

### 7. Create the first v14 backup
Commissioner -> **Backups** -> **Create backup now**.
Test both JSON and Excel downloads. Do not test Restore on the live production data unless you intentionally want to roll back; restore creates a safeguard first but is still a consequential action.

### 8. Draft-pool test (when appropriate)
Immediately before an actual draft, Commissioner -> **Draft control** -> choose draft type -> **Refresh current AFL player pool**. Do not start a real draft merely to test this on production. PEGS will refuse to start without a complete matching pool.

### 9. Publish the static files
After local testing:

```powershell
git add app.js styles.css index.html sw.js
git commit -m "Add PEGS team accounts trades draft pool and backups"
git pull --rebase origin main
git push
```

The Supabase SQL/functions are deployed separately and are not required to be public in the GitHub Pages repository.
