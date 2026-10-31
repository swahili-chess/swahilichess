# Going-live checklist

Everything needed to take chess.tz v2 live, with what is already done. Step-by-step details are in [deployment notes](deployment-notes.md). Tick items as they are done; nothing here has been deployed.

The first release covers the homepage, leaderboards, calendar, 24/7 chess and TACA. The blog, shop and CMS are deferred.

## Done in code

- [x] Ratings and tournaments come from saved snapshots; visitors never trigger provider requests.
- [x] Our events and Lichess prizes come from a Google Sheet ([events sheet](events-sheet.md)). All visitors share one copy for a minute, so traffic never reaches Google directly. If Google fails, the last good copy stays up for a day.
- [x] Invalid sheet rows are skipped and listed at `/calendar/sheet-check`.
- [x] Server addresses (`RATINGS_API_URL`, `EVENTS_SHEET_URL`, `PRIZES_SHEET_URL`) are server-only.
- [x] Development-only routes (`/preview`, the local sheet templates, `?fixture=`) return 404 in production.

## Before going live

### Hosting and addresses

- [ ] Choose the server and confirm Node.js 24 and pnpm 12.3.4 are available.
- [ ] HTTPS certificate for `chess.tz`.
- [ ] Set up a staging address and test there first.

### Services

- [ ] Run the website as a Node service (`node build`) behind Nginx.
- [ ] Run the four Go collectors with systemd (`fide-refresh`, `lichess-refresh`, `chesscom-refresh`, `events-refresh`).
- [ ] Bind the Go API to `127.0.0.1` and set the website's `RATINGS_API_URL` to that local address.

### Events sheet

- [ ] Create the Google Sheet from the templates and share editing only with the people who maintain events.
- [ ] Publish both tabs as CSV and set `EVENTS_SHEET_URL` and `PRIZES_SHEET_URL`.
- [ ] Confirm the 2026 calendar in the sheet and fill in missing days, venues and times.
- [ ] Open `/calendar/sheet-check` and fix any skipped rows.

### Database and secrets

- [ ] Apply the Go API migrations `000002` to `000005` by hand, then run each collector once.
- [ ] Keep `SW_DB_DSN` and `LICHESS_TOKEN` in an environment file readable only by the service user.
- [ ] Schedule daily database backups and test a restore.

### Protecting the server

- [ ] Nginx rate limit for the website, so page floods are rejected before they reach Node:

  ```nginx
  # In the http block
  limit_req_zone $binary_remote_addr zone=site:10m rate=20r/s;
  limit_req_status 429;

  # In the chess.tz server block
  location / {
      limit_req zone=site burst=40 nodelay;
      proxy_pass http://127.0.0.1:3000;
  }
  ```

- [ ] Do not expose the Go API's new snapshot endpoints publicly unless something outside the website needs them; existing bot and auth routes stay as they are.
- [ ] Firewall: open only ports 80, 443 and SSH. PostgreSQL, the website and the Go API listen on `127.0.0.1` only.
- [ ] Consider Cloudflare or a similar proxy in front for caching and DDoS protection.

### Content and release

- [ ] Remove `noindex` after the content review.
- [ ] Update the website workflow on `main`, which still copies a static build.
- [ ] Merge `website-v2` deliberately: the API deploys on every push to `main`.
- [ ] After release, check `/lichess/leaderboard`, the bot routes and auth routes.
- [ ] Keep the previous builds on the server for rollback.
