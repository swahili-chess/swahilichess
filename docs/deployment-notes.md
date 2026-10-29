# Deployment notes

Recorded 28 October 2026 for the release checkpoint (chunk 11). Nothing here has been deployed. The user deploys; contributors prepare and review the changes on `website-v2` without merging or deploying during a review checkpoint.

## Ratings collectors

The Go repository has three collectors beside the API. Each one only writes saved snapshots, and the API only reads them. Their schedules live in PostgreSQL, so a restarted collector checks what is due and continues without repeating work. An advisory lock prevents overlapping runs.

| Collector          | Schedule                                       | Needs                                    |
| ------------------ | ---------------------------------------------- | ---------------------------------------- |
| `fide-refresh`     | First of each month; failures retry after 24 h | `SW_DB_DSN`                              |
| `lichess-refresh`  | Hourly                                         | `SW_DB_DSN`, `LICHESS_TOKEN` (team:read) |
| `chesscom-refresh` | Daily; failures retry after 6 h                | `SW_DB_DSN`                              |
| `events-refresh`   | Every 15 min; reads `config/clubs.json`        | `SW_DB_DSN`                              |

Chess.com collection builds its roster by keeping every account from each daily country list. Every day it does not run is a day of active players missed. Start it as early as possible; the ranking approaches Chess.com's own Tanzania page after about 90 days of daily runs. See `chesscom-review.md`.

## Required changes before release

1. **Build the collectors.** `.github/workflows/deploy.yml` in `swahilichess-api` only builds `./cmd/api`. Also build `./cmd/fide-refresh`, `./cmd/lichess-refresh`, `./cmd/chesscom-refresh` and `./cmd/events-refresh` with `CGO_ENABLED=0`, copy them to the server, and restart their services.
2. **Add a systemd unit per collector**, following the existing `swahilichess-api.service`. Run `<collector> -watch` with `Restart=always`, and enable it at boot. Read `SW_DB_DSN` and, for Lichess, `LICHESS_TOKEN` from an environment file readable only by the service user, not from the unit or workflow.
3. **Apply migrations once, by hand, before starting the new code.** The API never migrates implicitly. Apply `000002_fide_snapshot`, `000003_lichess_snapshot`, `000004_chesscom_snapshot` and `000005_events_snapshot` to the production database. Run each collector once afterwards so the endpoints have data; they return HTTP 503 until a first snapshot exists.
4. **Deploy the website as a Node service.** The SvelteKit site uses `adapter-node` and server rendering, so it is no longer static files behind Nginx. Run `pnpm install --frozen-lockfile`, `pnpm build`, and `node build` as a systemd service, with Nginx proxying to it. Set the server-only `RATINGS_API_URL` to the API's address. The current website workflow on `main` copies a static build and must change.
5. **Merge to `main` deliberately.** The API deploys on every push to `main`, so merging `website-v2` releases all backend changes at once. Existing consumers are preserved: `/lichess/leaderboard`, the bot's `lichess` table and `/bot` routes, and auth routes are unchanged. Check them after release.
6. **Remove development-only routes and `noindex`** only when the content review in chunk 11 is accepted. `/preview` routes and `?fixture=` controls are already disabled outside development.

## Rollback

Keep the previous `api` binary and static website build on the server. The new snapshot tables are additive; rolling back the binaries does not require dropping them. Stopping the collectors leaves the last saved ratings in place, and the API marks them stale.
