# Chess.com integration review

Checkpoint 4c, accepted on 28 October 2026. Both repositories use their own `website-v2` branch. Chunks 1–3, 4a and 4b are accepted. Stop here for review before the calendar.

## Who is included

The ranking includes active Chess.com accounts that list Tanzania as their country. The collector uses the official [Published-Data API](https://www.chess.com/news/view/published-data-api) without a login, token or HTML scraping. Names are never matched with FIDE or Lichess.

Chess.com's country list only contains new and recently active accounts. Its documentation says to request it daily and keep the results, so each run adds the latest list to every account saved by the previous run. Every saved profile is rechecked; closed accounts and accounts that no longer list Tanzania are dropped.

Each category follows the rules Chess.com shows on its own leaderboard:

- the account is at least 7 days old
- at least 20 games in that category
- at least one rated game in the last 90 days

Comparison with Chess.com's Tanzania pages showed that the 90 days apply to a game in any category, including daily chess. A Rapid player who played Blitz last week stays on the Rapid ranking. An account without any game in 90 days is saved but unranked.

## Start the preview

From the sibling `swahilichess-api` repository, with the review database running:

```sh
export SW_DB_DSN='postgres://chess:local_review_only@127.0.0.1:55432/chess_ratings?sslmode=disable'
go run ./cmd/chesscom-refresh
go run ./cmd/api -host 127.0.0.1 -port 8081
```

An existing review database needs `db/migrations/000004_chesscom_snapshot.up.sql` once. Then run `pnpm dev` here and open <http://127.0.0.1:5174/leaderboards?provider=chesscom&category=rapid>.

## Real data, 28 October 2026

The country list contained 1991 accounts. One was closed and two no longer list Tanzania. Of 1988 saved accounts, 367 meet no category's rules. The run took about 8 minutes with four requests at a time.

| Category | Our ranking | Chess.com Tanzania page | On both | Only Chess.com, never in the country list | Only Chess.com, excluded by our rules | Only ours |
| -------- | ----------: | ----------------------: | ------: | ----------------------------------------: | ------------------------------------: | --------: |
| Rapid    |        1525 |                    3879 |    1160 |                                      2693 |                                    26 |       365 |
| Blitz    |         941 |                    2371 |     898 |                                      1462 |                                    11 |        43 |
| Bullet   |         621 |                    1629 |     595 |                                      1024 |                                    10 |        26 |

The Chess.com pages were read once from the feed behind its public leaderboard pages, for comparison only. The collector does not use that feed.

- **Discovery is the main gap.** Most missing players never appeared in the country list. Daily runs add each day's active players, so coverage should grow towards Chess.com's page over about 90 days. Until then, many strong players are missing, including several of Chess.com's Rapid and Blitz top ten.
- **Rules match for most found players.** Counting activity in any category reduced Rapid disagreements from 157 to 26 and Blitz from 128 to 11.
- **Chess.com's Rapid page stops near rank 3950.** 321 of the 365 Rapid players only we show are rated below 359, the lowest rating on Chess.com's page.
- **The rest have no single rule.** Some players Chess.com still lists last played that category more than two years ago, while others it omits played more recently. Chess.com may update its pages on its own schedule.
- **Ratings differ for 37 Rapid, 22 Blitz and 24 Bullet players**, mostly by a few points from games played between the two reads. One account shows a 400 rating in the API and a higher one on Chess.com.

## Why players are missing from the country list

A sample of 150 players on Chess.com's Tanzania pages but missing from the country list, and 100 players in the list, was checked through the official profile API. Every sampled account lists Tanzania; none is closed. The difference is when they were last online:

- Players in the list were online within about a day of the list being generated.
- Missing players were last online a median of 53 days earlier. 33 of 150 were online within the previous week, but not that day.
- 65 of 150 had not been online for more than 90 days. Their last rated game was a median of 367 days ago. Chess.com's page still ranks them, despite its own 90-day rule. Our rules exclude them.

The country list is a daily snapshot of who is active, not a roster. Daily collection adds players as they return, and players who stay inactive should not be ranked under the published rules.

## Review in the browser

- Switch between Rapid, Blitz and Bullet. Player names open their Chess.com profiles.
- Compare the top of each category with Chess.com's Tanzania pages. Expect missing players while the roster grows.
- Switch between all three providers. None shows a sample label.
- Check the unavailable state at `?provider=fide&fixture=error`. It shares the empty-state layout.

## Refresh behaviour

`cmd/chesscom-refresh` refreshes daily. A failed run retries after six hours and keeps the previous snapshot. The response is stale after a failed run or when the snapshot is more than two days old. HTTP 429, server errors and network failures retry five times with exponential backoff before the run fails.

## Validation completed

- Go collector tests: status and country checks, the 7-day, 20-game and 90-day rules at their boundaries, activity in another category, non-category stats fields, carried-forward accounts, renamed duplicates, rate-limit retries and persistent errors.
- PostgreSQL persistence test with the race detector. Lichess shares `internal/snapshot`; its tests and the FIDE tests still pass. `go vet ./...` is clean.
- Eighteen frontend tests, Svelte check, autofixer on changed components, formatting check and production build.
- Browser review of real data, search, the last page and the error state at desktop and 375px widths. No console errors.

No production database, merge or deployment was involved.
