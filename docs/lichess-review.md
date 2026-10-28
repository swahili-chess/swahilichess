# Lichess integration review

Checkpoint 4b, ready for review on 28 October 2026. Both repositories use their own `website-v2` branch. Chunks 1–3 and 4a are accepted. Stop here for review before Chess.com integration.

## Who is included

Lichess has no country leaderboard. The ranking includes members of the [Nyumbani Mates](https://lichess.org/team/nyumbani-mates) team. A community member joins the team to appear after the next hourly refresh. Accounts closed on Lichess, accounts marked for terms violations, and bot accounts are excluded. Names are never matched with FIDE or Chess.com.

The team's member list is private, so the collector needs a Lichess personal access token with the `team:read` scope from a team member's account. The token is read only from the `LICHESS_TOKEN` environment variable of the Go collector. The website never receives it.

The original `/lichess/leaderboard` route and the chess bot's `lichess` table are unchanged. The old site keeps working. The new read path does not use that table.

## Start the preview

From the sibling `swahilichess-api` repository, with the database from the FIDE review running:

```sh
export SW_DB_DSN='postgres://chess:local_review_only@127.0.0.1:55432/chess_ratings?sslmode=disable'
set -a; . ./.env; set +a   # git-ignored; contains LICHESS_TOKEN with team:read
go run ./cmd/lichess-refresh
go run ./cmd/api -host 127.0.0.1 -port 8081
```

An existing review database needs `db/migrations/000003_lichess_snapshot.up.sql` once. New Compose volumes apply it automatically. Then run `pnpm dev` here and open <http://127.0.0.1:5174/leaderboards?provider=lichess&category=rapid>.

## Real data, 28 October 2026

| Count                         |           Value |
| ----------------------------- | --------------: |
| Team members                  |             168 |
| Excluded for terms violations |               7 |
| Closed, bots, missing         |               0 |
| Ranked players                |             161 |
| Rapid / Blitz / Bullet rated  | 147 / 142 / 101 |

A category with no games stays empty. Lichess reports these as a 1500 placeholder, which the old leaderboard displayed as a real rating. Ratings Lichess marks provisional stay ranked and labelled Provisional, as confirmed by the user on 28 October 2026: 97 Rapid, 74 Blitz and 64 Bullet. Lichess marks a rating provisional when its deviation is high, including after a long break from that category.

## Review in the browser

- Nyumbani Mates in the description opens the team page in a new tab.
- Switch between Rapid, Blitz and Bullet. Player names open their Lichess profiles.
- Search `luffy` in Bullet. The player keeps global rank 2.
- Open the last Blitz page. Low ratings show with their Provisional label.
- On the homepage, the rankings widget shows the real top five with no sample label.
- Resize to mobile. Tabs, search and the table fit the viewport.
- Press Refresh. The Last updated time stays unchanged until the collector runs again.
- Switch to Chess.com. Its sample label returns.

## Refresh behaviour

`cmd/lichess-refresh` checks a schedule stored in PostgreSQL. A successful import waits one hour. A failed import also retries after one hour and keeps the previous snapshot. The response is stale after a failed import or when the snapshot is more than three hours old. `-watch` runs hourly until stopped, and `-force` refreshes once immediately. Requests are serialized in batches of up to 300 accounts, as the Lichess API requires. Any failed request fails the whole run, so a partial roster is never saved.

## Validation completed

- Go collector tests: team eligibility, the 1500 placeholder, provisional flags, 300-account batching, unexpected or duplicate users, truncated JSON, an empty team, an invalid ID, a missing token, HTTP 429 and 500.
- PostgreSQL persistence test with the race detector: empty database, save, hourly wait, failure retention, retry, recovery and staleness after three hours. FIDE tests still pass. `go vet ./...` is clean.
- Fifteen frontend tests, including Lichess boundary validation and the unavailable state. Svelte check, autofixer on both changed components, formatting check and production build.
- Desktop and 375px mobile browser review of real data, search, the last page, the homepage widget and the stale warning. A temporary failure flag in the isolated database showed the warning with retained ratings and was restored afterwards. No console errors.

No production database, merge or deployment was involved.
