PEGS v14.1l – Loading stall repair

Fixes:
- Restores current v14 Team Login markup that the Prototype 3 index had accidentally dropped.
- Removes stale/non-shipped intro assets from service-worker precache.
- Adds a 5.5 second app-level intro failsafe.
- Adds a 7 second independent HTML failsafe so the intro can never trap the site even if app.js or a backend startup request fails.
- Preserves the Prototype 3 visual design.

Replace:
- index.html
- styles.css
- app.js
- sw.js
- assets/intro-prototype3-stage.webp

No SQL or Supabase function deployment required.
