# Going-live checklist

Everything needed to take chess.tz v2 live, with what is already done. Server steps are in [server setup](server-setup.md); background is in [deployment notes](deployment-notes.md). Tick items as they are done; nothing here has been deployed.

The first release covers the homepage, leaderboards, calendar, 24/7 chess and TACA. The blog, shop and CMS are deferred.

## Done in code

- [x] Ratings and tournaments come from saved snapshots; visitors never trigger provider requests.
- [x] Our events and Lichess prizes come from a Google Sheet ([events sheet](events-sheet.md)). All visitors share one copy for a minute, so traffic never reaches Google directly. If Google fails, the last good copy stays up for a day.
- [x] Invalid sheet rows are skipped and listed at `/calendar/sheet-check`.
- [x] Server addresses (`RATINGS_API_URL`, `EVENTS_SHEET_URL`, `PRIZES_SHEET_URL`) are server-only.
- [x] Development-only routes (the local sheet templates, the share image page, `?fixture=`) are unavailable in production.

- [x] Both deploy workflows updated to build and restart everything ([server setup](server-setup.md)). The API workflow builds the four collectors and installs their services; the website workflow runs v2 as a Node service, keeps the five newest builds and rolls back if a new one does not answer.
- [x] `noindex` removed from the public pages; it stays on `/calendar/sheet-check`.

- [x] Link previews: every public page has its own title, description, canonical URL and Open Graph tags, with `static/share.jpg` (1200 × 630, 157 KB; WhatsApp ignores images over about 300 KB).
- [x] `sitemap.xml` (listed in `robots.txt`), `favicon.ico` and an iPhone home-screen icon.
- [x] Accessibility check on the five public pages at 1280 px and 375 px, including the mobile menu and an event dialog: every control has a name, headings run in order, no duplicate IDs, text contrast meets WCAG AA, focus is visible, and nothing scrolls sideways. The mobile menu takes focus on open and returns it on Escape. Checked with a script in the browser; axe-core could not be loaded.

To redraw the share image after changing the hero, run the dev server and:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=4000 \
  --screenshot=/tmp/share.png http://127.0.0.1:5174/preview/share-image
sips -s format jpeg -s formatOptions 82 /tmp/share.png --out static/share.jpg
```

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
- [ ] Real phone test, on mobile data as well as Wi-Fi:
  - Home: the hero fills the screen; Join us on WhatsApp opens the group; an upcoming event opens its dialog.
  - Menu: each link opens its page; the menu closes after a tap.
  - Leaderboards: switch FIDE, Lichess and Chess.com and a category; search for a player; page through.
  - Calendar: Upcoming and Past; open an event; its button opens Lichess or the registration link.
  - 24/7 chess: scroll the timeline sideways; join a tournament.
  - TACA: view and download each PDF; tap a phone number and the email link.
  - Share `https://chess.tz` in a WhatsApp chat: the preview shows the blue card, title and description.
- [ ] Submit `https://chess.tz/sitemap.xml` in Google Search Console.
- [ ] Check the TACA page against TACA's documents, and compare the Executive Committee with the FIDE directory once FIDE updates it.

### After release

- [ ] Schedule daily database backups and test a restore.
- [ ] Firewall: open only ports 80, 443 and SSH. PostgreSQL, the website and the Go API listen on `127.0.0.1` only.
- [ ] Do not expose the Go API's new snapshot endpoints publicly unless something outside the website needs them; existing bot and auth routes stay as they are.
- [ ] Replace the password-based deploy with an SSH key and limited `sudo` rights.
- [ ] Consider Cloudflare or a similar proxy in front for caching and DDoS protection.
