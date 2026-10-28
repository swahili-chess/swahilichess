# FIDE integration review

Checkpoint 4a, accepted on 28 October 2026. Both repositories use their own `website-v2` branch. Chunks 1–3 were accepted earlier the same day. Lichess integration (4b) follows.

## Start the preview

From the sibling `swahilichess-api` repository:

```sh
docker compose -p chess-v2 -f compose.ratings.yml up -d --wait
export SW_DB_DSN='postgres://chess:local_review_only@127.0.0.1:55432/chess_ratings?sslmode=disable'
go run ./cmd/fide-refresh
go run ./cmd/api -host 127.0.0.1 -port 8081
```

From this website repository, set `RATINGS_API_URL=http://127.0.0.1:8081` in `.env.local`, then run `pnpm dev`. Go 1.27.3 was used for validation. PostgreSQL runs in the isolated `chess-v2` Compose project on port 55432. Existing local databases are untouched.

Open <http://127.0.0.1:5174/leaderboards?provider=fide&category=standard>.

The first import takes a few minutes. Later runs consult the stored schedule and skip downloads until due. See the API README for the separate `-watch` worker and manual `-force` correction command. No production scheduler or deployment was installed.

## Real data and source

FIDE now reads the saved monthly snapshot through the Go API. Collection uses the [official monthly XML archives](https://ratings.fide.com/download_lists.phtml). Each archive is tied to its rating month and checked through its closing XML root and ZIP checksum. All three categories must complete before replacing the snapshot.

October 2026 import, corrected on 28 October to match FIDE search eligibility:

| Category | Tanzania records | Excluded by FIDE filter | Eligible rated |
| -------- | ---------------: | ----------------------: | -------------: |
| Standard |               85 |                      48 |             37 |
| Rapid    |               47 |                      21 |             26 |
| Blitz    |               19 |                       4 |             15 |

There are 37 distinct eligible players across the three categories. FIDE search with "Exclude Inactive (FIDE rated only)" enabled uses active Standard-rated players for all categories. Their Rapid and Blitz ratings remain eligible even if the separate category archive marks them inactive. Players without a Standard rating are excluded by this search filter. The initial implementation incorrectly applied category inactivity flags separately, producing 13 Rapid and 9 Blitz players. Zero games in a month does not mean inactive. FIDE IDs supply profile links; names are not matched across providers. Only public chess identity and rating fields are retained.

Standard leader: Njau, Albert, 1971. Rapid leader: Njau, Albert, 1870. Blitz leader: Njau, Albert, 1904. An independent Python XML read of the official Standard archive matched every imported ID and rating, including all 48 inactive exclusions. The API stores source URLs, archive checksums and counts for all three lists. Source `inactive` counts are raw archive flags; `excluded` counts represent the website eligibility rule.

The supplied search requests contain `search_inactive=off`, which returns 85 Standard, 47 Rapid and 19 Blitz records. With `on`, the verified search returns 37, 26 and 15. The search was fetched without cookies using Referer and X-Requested-With headers.

The footer separates the verified rating month from the fetch timestamp. A successful import schedules the next source check for 06:00 UTC on the first of the following month. Missing publications and failed downloads retry after 24 hours while preserving the saved snapshot. The next month marks an older snapshot stale even if the worker is stopped. The website's Refresh button only reads saved data.

Lichess, Chess.com and the homepage ranking widget remain fixtures with sample labels. FIDE has no sample badge unless a development fixture is explicitly selected. Pages remain noindex until the remaining sources and content are integrated. No CMS work is included.

## Review in the browser

- Switch between Standard, Rapid and Blitz. Check counts, real profile links and ties.
- Search for `Lusako` in Blitz. His global rank stays 4. Search for an unknown name to see the empty result.
- Open page 2 in Rapid and verify that search preserves the full-list rank.
- Resize to mobile. The table and filters fit; the month and timestamp wrap in the footer.
- Press Refresh. The import timestamp should stay unchanged.
- Switch to Lichess or Chess.com. Their sample label should return.

Development-only fixture controls remain at `?provider=fide&fixture=ready|empty|loading|error|stale`. Each fixture is visibly labeled Sample ratings. They do not run in production. With no API configured, the real FIDE route shows an unavailable state, not fictional data.

## Validation completed

- Go parser, collector and monthly schedule tests; `go vet ./...`. Regression cases cover Standard-active/Rapid-inactive, Standard-inactive/Rapid-active, Standard-unrated and missing-category players.
- After the eligibility correction, every ID and rating in all three saved lists exactly matched FIDE search with `search_inactive=on`: 37 Standard, 26 Rapid and 15 Blitz.
- PostgreSQL persistence tests with the race detector: empty database, atomic save, no repeated monthly collection, failure retention, retry backoff, recovery and month rollover.
- Eleven frontend ranking/query/API boundary tests, Svelte check with no errors or warnings, all three changed Svelte files analyzed without issues, formatting check and production build.
- Desktop and 390px mobile browser review of real Standard/Rapid/Blitz data, pagination and global-rank search. Mobile document width matches its 390px viewport.
- A temporary failed-import flag in the isolated database showed the warning alongside retained real ratings. The flag was restored afterward.
- Stopping the actual local API showed the unavailable state with no fake timestamp or sample players. The API was restarted for review.
- A second worker run reported `updated=false`, confirming it skipped this month's completed import.

No production database, merge or deployment was involved. The existing Lichess handler and auth/bot routes were left in place; live third-party behavior of those unrelated endpoints was not exercised.
