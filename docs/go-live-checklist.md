# Going-live checklist

Everything needed to take chess.tz v2 live, with what is already done. Server steps are in [server setup](server-setup.md); background is in [deployment notes](deployment-notes.md). Tick items as they are done; nothing here has been deployed.

The first release covers the homepage, leaderboards, calendar, 24/7 chess and TACA. The blog, shop and CMS are deferred.

## Done in code

- [x] Ratings and tournaments come from saved snapshots; visitors never trigger provider requests.
- [x] Our events and Lichess prizes come from a Google Sheet ([events sheet](events-sheet.md)). All visitors share one copy for a minute, so traffic never reaches Google directly. If Google fails, the last good copy stays up for a day.
- [x] Invalid sheet rows are skipped and listed at `/calendar/sheet-check`.
- [x] Server addresses (`RATINGS_API_URL`, `EVENTS_SHEET_URL`, `PRIZES_SHEET_URL`) are server-only.
- [x] Development-only routes (`/preview`, the local sheet templates, `?fixture=`) return 404 in production.

- [x] Both deploy workflows updated to build and restart everything ([server setup](server-setup.md)). The API workflow builds the four collectors and installs their services; the website workflow runs v2 as a Node service, keeps the five newest builds and rolls back if a new one does not answer.
- [x] `noindex` removed from the public pages; it stays on `/preview` and `/calendar/sheet-check`.

## Before going live

### Access

- [ ] SSH access to the server as the deploy user, with `sudo`, or a session with the person who has it.
- [ ] Access to both repositories' Actions tabs, to watch the deploys.

### One-time server setup

Every step is in [server setup](server-setup.md).

- [ ] Back up the database.
- [ ] Note the API's port and database settings, and where Nginx serves the old site from.
- [ ] Apply the Go API migrations `000002` to `000005`.
- [ ] Create `/etc/swahilichess/api.env` (`SW_DB_DSN`, `LICHESS_TOKEN`) and `/etc/swahilichess/web.env` (`ORIGIN`, `RATINGS_API_URL`, both sheet links), readable only by root and the deploy user.
- [ ] Copy the two Nginx files from `deploy/nginx/`; switch the server block only after the new site answers on port 3000.

### Events sheet

- [ ] Create the Google Sheet from the templates and share editing only with the people who maintain events.
- [ ] Publish both tabs as CSV; their links go in `web.env`.
- [ ] Confirm the 2026 calendar in the sheet and fill in missing days, venues and times.
- [ ] Open `/calendar/sheet-check` and fix any skipped rows.

### Release

- [ ] Merge the API's `website-v2` into `main` first. Check the collectors, the API, the bots, auth and `/lichess/leaderboard`.
- [ ] Then merge the website's `website-v2` into `main`, and check the site on port 3000.
- [ ] Switch Nginx to the new site and check `https://chess.tz` on a phone and a desktop.
- [ ] Check the TACA page against TACA's documents, and compare the Executive Committee with the FIDE directory once FIDE updates it.

### After release

- [ ] Schedule daily database backups and test a restore.
- [ ] Firewall: open only ports 80, 443 and SSH. PostgreSQL, the website and the Go API listen on `127.0.0.1` only.
- [ ] Do not expose the Go API's new snapshot endpoints publicly unless something outside the website needs them; existing bot and auth routes stay as they are.
- [ ] Replace the password-based deploy with an SSH key and limited `sudo` rights.
- [ ] Consider Cloudflare or a similar proxy in front for caching and DDoS protection.
