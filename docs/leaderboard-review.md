> Accepted on 28 October 2026. This records the fixture-based interface review. The current FIDE integration is documented in [fide-review.md](fide-review.md).

# Leaderboard review · chunk 3

The homepage was accepted on 28 October 2026. This checkpoint builds the leaderboard interface. Ratings integrations are separate checkpoints and have not started.

## Run and review

From the repository root, run `pnpm install --frozen-lockfile` and `pnpm dev`. Open <http://127.0.0.1:5174/leaderboards>.

The page uses fictional players and ratings with a sample label and `noindex`. No external feeds or backend are required. The provider's data-source description sits directly beneath the rankings title. The card omits provider website links. Fictional player accounts have no profile links. Refresh reloads the stored fixture, not an external rating service.

## Design and behavior

Keep the accepted Medusa styling and homepage typography. The main task is finding a player and comparing rankings within one provider and time control. Use a single table with right-aligned ratings, a fixed rank column, and wrapping names. Avoid podium cards, combined provider scores, or new hero artwork.

Provider, time control, search, and pagination are URL state. Search submits with Enter or the search button and resets to page 1. Provider/time-control changes also reset the page. Search preserves global ranks. Ties use competition ranks, including across page boundaries. Missing and zero ratings are excluded. Provisional ratings remain ranked. Inactive FIDE players are excluded before ranking, search, and pagination.

- Lichess and Chess.com: Rapid, Blitz, Bullet.
- FIDE: Standard, Rapid, Blitz. Incompatible categories fall back to the provider's first category.
- Ten players per page. Out-of-range pages clamp to the last page.
- Date display uses Africa/Dar_es_Salaam. The Last updated timestamp describes stored data; refreshing does not invent a new timestamp.
- The header and homepage widget link to the leaderboard. Old `/#leaderboard` links still reach the homepage widget.

## Scenarios

All `fixture` parameters below only affect development:

| URL                                                    | Review                                                           |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `/leaderboards`                                        | Lichess Rapid, titles, provisional rating, pagination            |
| `/leaderboards?provider=lichess&category=rapid&page=2` | Rank 10 shared with the last player on page 1                    |
| `/leaderboards?provider=lichess&category=rapid&page=3` | Long name and final-page boundary                                |
| `/leaderboards?provider=fide&category=standard`        | No Bullet category, inactive players excluded, no online handles |
| `/leaderboards?provider=chesscom&category=bullet`      | Separate provider ratings and provisional label                  |
| `/leaderboards?q=hassan`                               | Search result retains rank 7                                     |
| `/leaderboards?q=nobody`                               | Empty search and Clear search action                             |
| `/leaderboards?fixture=empty`                          | No ratings                                                       |
| `/leaderboards?fixture=loading`                        | Skeleton rows                                                    |
| `/leaderboards?fixture=error`                          | Unavailable state and Try again action                           |
| `/leaderboards?fixture=stale`                          | Last saved ratings with update-failure notice                    |

Try again and Refresh clear the development scenario and load the normal fixture. In production, `fixture` is ignored. The route remains sample-backed until the rating integration checkpoints are reviewed.

## Click-through checklist

1. Switch every provider and category. FIDE must never show Bullet.
2. Search for Hassan, a username, and a name that does not exist. Clear the search.
3. Move through all three pages. Compare rank 10 at the page boundary. Refresh the browser and use Back to check URL restoration.
4. Use arrow keys on both tab groups, Tab to search and pagination, and Enter to activate controls.
5. Check 320px, 768px, 1024px, and desktop widths. Open the mobile menu and follow its links. Check the long name on page 3.
6. Review the empty, loading, error, and stale URLs. Try again should restore the table.

## Implementation and checks

`src/lib/leaderboard.ts` owns query normalization, ranking, search, paging, and URL generation. `src/lib/types/leaderboard.ts` defines the frontend contract. `src/lib/fixtures/leaderboard.ts` supplies provider-specific sample records. The route's server load supplies the view to shadcn-based leaderboard compositions.

Run `node --test tests/leaderboard.test.ts`, `pnpm check`, `pnpm format:check`, and `pnpm build`. Run the official Svelte autofixer for changed Svelte files.

The pagination component comes from the official shadcn-svelte registry. Lucide is pinned to 1.62.0 because the prior 1.63.0 release did not meet pnpm's release-age policy. No policy exception was retained.

Browser checks use simulated viewports, not a physical phone. No new content motion was added. Real provider coverage, profile links, and automatic collection remain for integration review.

## Verification · 28 October 2026

- Eight ranking/query tests pass, including tied ranks across pages, missing/zero ratings, case-insensitive search, invalid categories, and page boundaries.
- Browser review covered all nine provider/category combinations, search, empty search, pagination, browser reload/Back, arrow-key tabs, mobile navigation, and error recovery.
- Layouts were inspected at 320px, 768px, 1024px, and 1440px, including the long name on page 3. No console warnings or errors were recorded.
- Type checks, formatting, and the production build passed. Official Svelte analysis found no issues. Generated pagination wrappers retain the upstream bindable DOM refs despite generic suggestions to use attachments.
- The local production build returned the normal leaderboard for every development fixture parameter and normalized invalid FIDE category/page input. Sample labels and noindex remained present.
