# Deployment notes

Recorded 28 October 2026 and updated 1 November 2026 for the release (chunk 11). Nothing here has been deployed. The [going-live checklist](go-live-checklist.md) tracks every step, including rate limits and the firewall. The user deploys; contributors prepare and review the changes on `website-v2` without merging or deploying during a review checkpoint.

## Ratings collectors

The Go repository has four collectors beside the API. Each one only writes saved snapshots, and the API only reads them. Their schedules live in PostgreSQL, so a restarted collector checks what is due and continues without repeating work. An advisory lock prevents overlapping runs.

| Collector          | Schedule                                       | Needs                                    |
| ------------------ | ---------------------------------------------- | ---------------------------------------- |
| `fide-refresh`     | First of each month; failures retry after 24 h | `SW_DB_DSN`                              |
| `lichess-refresh`  | Hourly                                         | `SW_DB_DSN`, `LICHESS_TOKEN` (team:read) |
| `chesscom-refresh` | Daily; failures retry after 6 h                | `SW_DB_DSN`                              |
| `events-refresh`   | Every 15 min; reads `config/clubs.json`        | `SW_DB_DSN`                              |

Chess.com collection builds its roster by keeping every account from each daily country list. Every day it does not run is a day of active players missed. Start it as early as possible; the ranking approaches Chess.com's own Tanzania page after about 90 days of daily runs. See `chesscom-review.md`.

## Release

Done on 1 November 2026: both workflows on `website-v2` now deploy everything, and `noindex` is removed from the public pages. The one-time server steps, the release order and rollback are in [server setup](server-setup.md).

- **Collectors.** The API workflow builds the four collectors with `CGO_ENABLED=0` and installs `deploy/systemd/swahilichess-*-refresh.service`, which run `<collector> -watch` with `Restart=always`. They read `SW_DB_DSN` and `LICHESS_TOKEN` from `/etc/swahilichess/api.env`, never from the unit or workflow.
- **Migrations.** Applied once, by hand, before the new API: `000002` to `000005`. They only add tables. The endpoints return HTTP 503 until each collector saves its first snapshot.
- **Website.** `adapter-node` with server rendering, run by `swahilichess-web.service` on `127.0.0.1:3000` behind Nginx. The build runs without `node_modules`. Its settings live in `/etc/swahilichess/web.env`.
- **Existing consumers.** `/lichess/leaderboard`, the bot's `lichess` table, `/bot` routes and auth routes are unchanged. Check them after release.
- **Order.** Both repositories deploy on every push to `main`. Merge the API first, then the website, then switch Nginx.
