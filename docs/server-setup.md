# Server setup for the v2 release

Written 1 November 2026 for chunk 11. The release reuses the two GitHub Actions workflows that already deploy chess.tz on every push to `main`. They sign in over SSH with the repository secrets `HOST`, `USERNAME`, `PASSWORD` and `PORT`; both last succeeded in February 2026. The steps below are needed once, on the server, before the first v2 deploy. After that, every push to `main` deploys on its own.

## What the workflows do

**API (`swahilichess-api`).** Tests, then builds the API and the four collectors (`fide-refresh`, `lichess-refresh`, `chesscom-refresh`, `events-refresh`). Copies them to `~/chess/swahilichess-api`, restarts `swahilichess-api.service` as before, installs the collectors' services from `deploy/systemd/` and restarts them. It stops with an error if `/etc/swahilichess/api.env` is missing.

**Website (`swahilichess`).** In `/var/www/<user>/swahilichess`: pulls, installs Node 24 through nvm if needed, builds with pnpm 12.3.4, and copies the build into a new folder in `/var/www/<user>/swahilichess-releases`. Points `current` at it, installs and restarts `swahilichess-web.service` (Node on `127.0.0.1:3000`), and checks the site answers. If it does not, it switches back to the previous build and fails. The five newest builds are kept. It stops with an error if `/etc/swahilichess/web.env` is missing.

The old React site builds into `dist/`, which v2 neither tracks nor touches. If Nginx serves that folder (check in step 2), visitors keep seeing the old site until step 6 switches Nginx, so the new one can be checked on the server first.

## One-time setup

Run these on the server as the deploy user (the `USERNAME` secret), with `sudo`. `<user>` is that user.

### 1. Back up the database

```sh
pg_dump "<the API's database URL>" > ~/swahilichess-before-v2.sql
```

### 2. Read the API's current settings

```sh
systemctl cat swahilichess-api.service
sudo ss -ltnp | grep -E ':3000|api'
grep -rn -A3 'chess.tz' /etc/nginx/sites-enabled/
```

Note the API's port and where its database URL (`SW_DB_DSN`) comes from. Note the folder in the chess.tz server block's `root` line; it should be `/var/www/<user>/swahilichess/dist`. If it is the project folder itself, tell the person releasing before step 5. Check that nothing already uses port 3000. If something does, change `PORT` in `deploy/systemd/swahilichess-web.service`, the workflow's health check and the Nginx snippet together.

### 3. Apply the database migrations

Four new tables; nothing existing changes. Each file runs in one transaction, so a failure changes nothing.

```sh
cd ~/chess && git clone --branch website-v2 https://github.com/swahili-chess/swahilichess-api.git v2-migrations
for n in 000002_fide 000003_lichess 000004_chesscom 000005_events; do
  psql "<the API's database URL>" -v ON_ERROR_STOP=1 -1 -f v2-migrations/db/migrations/${n}_snapshot.up.sql
done
rm -rf v2-migrations
```

If the server records migrations with a tool, such as a `schema_migrations` table, apply them with that tool instead.

### 4. Create the settings files

```sh
sudo install -d -m 750 -o root -g <user> /etc/swahilichess
sudo install -m 640 -o root -g <user> /dev/null /etc/swahilichess/api.env
sudo install -m 640 -o root -g <user> /dev/null /etc/swahilichess/web.env
sudo nano /etc/swahilichess/api.env
sudo nano /etc/swahilichess/web.env
```

Fill them in from `swahilichess-api/deploy/api.env.example` and `swahilichess/deploy/web.env.example`:

| File      | Setting            | Value                                                                             |
| --------- | ------------------ | --------------------------------------------------------------------------------- |
| `api.env` | `SW_DB_DSN`        | The same database URL the API uses                                                |
| `api.env` | `LICHESS_TOKEN`    | A Lichess token with `team:read`, from an account that administers Nyumbani Mates |
| `web.env` | `ORIGIN`           | `https://chess.tz`                                                                |
| `web.env` | `RATINGS_API_URL`  | `http://127.0.0.1:<API port>`                                                     |
| `web.env` | `EVENTS_SHEET_URL` | The Events tab's published CSV link ([events sheet](events-sheet.md))             |
| `web.env` | `PRIZES_SHEET_URL` | The Lichess prizes tab's published CSV link                                       |

Only root and the deploy user can read these files. Never put their values in a workflow, a unit file or the repository.

### 5. Release the API, then the website

1. Merge the API's `website-v2` into `main`. Watch the run under the repository's Actions tab.
2. Check the collectors and the API:
   ```sh
   systemctl status 'swahilichess-*'
   journalctl -u swahilichess-fide-refresh -n 20
   curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:<API port>/fide/leaderboard
   ```
   Each collector runs as soon as it starts. The endpoints return 503 until their first snapshot is saved, which takes a few minutes for Chess.com. Check that the bots, auth and `/lichess/leaderboard` still work.
3. Merge the website's `website-v2` into `main`, then check `curl -I http://127.0.0.1:3000/`.

### 6. Point Nginx at the new site

```sh
sudo cp deploy/nginx/swahilichess-limits.conf /etc/nginx/conf.d/
sudo cp deploy/nginx/chess.tz-proxy.conf /etc/nginx/snippets/
sudo nano /etc/nginx/sites-available/<chess.tz site file>
```

In the chess.tz server block, replace the `root` and `location /` lines with `include snippets/chess.tz-proxy.conf;`. Keep the `listen`, `server_name` and Certbot's `ssl_*` lines. Then:

```sh
sudo nginx -t && sudo systemctl reload nginx
```

Both files are checked against Nginx 1.18, the version on the server.

## Rolling back

- **Website, quickly.** Point `current` at an earlier build and restart:
  ```sh
  ls /var/www/<user>/swahilichess-releases
  ln -sfn /var/www/<user>/swahilichess-releases/<earlier build> /var/www/<user>/swahilichess-releases/current
  sudo systemctl restart swahilichess-web
  ```
- **Back to the old site.** Restore the Nginx server block's old `root` lines and reload Nginx; the old files are untouched.
- **API.** In the API repository's Actions tab, open the last good run before the release and choose Re-run all jobs. It rebuilds and redeploys that commit. The new tables can stay; the old API ignores them.
