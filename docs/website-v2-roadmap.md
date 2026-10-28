# chess.tz website v2 roadmap

Updated 28 October 2026. Status: chunk 1 accepted; chunk 2 implemented and in browser review. Branch: `website-v2`.

## Current checkpoint

Chunk 1 was accepted on 28 October 2026. Chunk 2 is the homepage at <http://127.0.0.1:5174/>. Run `pnpm install --frozen-lockfile` and `pnpm dev` from the repository root. See `docs/homepage-review.md` for the review checklist.

The homepage preserves the accepted hero, adds compact Lichess rankings and tournament summaries using labeled fixtures, and reuses the navigation and footer. The original foundation and state controls remain at `/preview`, available only in development. The development-only `/preview/events` gallery demonstrates six event scenarios with shared card/dialog styling, optional amounts, countdowns, and long content. Full leaderboard and calendar pages remain separate roadmap chunks; current navigation links scroll to the homepage widgets.

The current checkpoint does not connect real rating feeds or create the CMS. Do not start chunk 3 until the user accepts the homepage. The original React implementation remains in Git history; the deployment workflow uses pnpm, while the hosting migration remains a later checkpoint.

## Decisions so far

- Build the public website with Svelte 5, SvelteKit, and TypeScript in this repository.
- Use shadcn-svelte for UI controls and components. Reusable site components may only compose or wrap shadcn-svelte. Semantic page markup and layout CSS are still necessary; do not build replacement buttons, tabs, menus, dialogs, or tables.
- Adapt Medusa's design tokens and styling to shadcn-svelte. Use its React components as visual references, not dependencies in the Svelte website.
- Apply UX Writing and Emil Design Engineering guidance. The official `svelte-code-writer` and `svelte-core-bestpractices` skills are installed.
- Launch in English. Keep copy and content fields ready for a later Kiswahili release.
- Cover Tanzanian players across the three rating sources. Maintain the existing player-list approach for Lichess; automatically collect FIDE and Chess.com data where practical.
- Use the official Chess.com API for the initial release. Review its coverage in the browser; keep it if the results meet the community's needs. Authenticated scraping is outside the initial scope.
- Set up Payload as a separate sibling service at `../swahilichess-cms` during the CMS chunk, with a small working integration review.
- Shop scope includes books, boards, equipment, and possible merchandise. Payment processing is deferred.
- Deliver one reviewable chunk at a time. Finish browser review and resolve feedback before proceeding to the next chunk.

## Existing project and migration

The original frontend used React 18 with Vite and npm; chunk 1 replaces it with SvelteKit on `website-v2`. Its original homepage included a WhatsApp invitation, a Lichess leaderboard, and a hardcoded 2026 events calendar. Preserve useful content and the invitation URL, subject to a validity check.

The sibling `swahilichess-api` Go repository already exposes `/lichess/leaderboard`, reads stored team-member IDs, and caches results for three minutes. It uses Echo, PostgreSQL, and sqlc, and also serves authentication and bot endpoints. Extend this service for rating providers and persistent snapshots while preserving those existing consumers. The current cache refresh happens during a request; scheduled collection and persistent snapshots are new work.

The separate `live-ratings-sse` repository contains an unfinished streaming prototype. Its current entry point has placeholder database synchronization branches and repeatedly broadcasts a sample message. Keep it separate and defer live push updates; ordinary snapshot reads meet the website's initial requirements. This is a source inspection, not a claim about what is deployed.

Backend changes should use their own reviewable branch in that repository. Keep frontend and backend changes coordinated by explicit API contracts and linked review checkpoints, without combining the repositories.

The existing deployment workflow runs on `main` and builds files behind Nginx. SvelteKit server rendering and Payload need explicit runtime/deployment work. Keep `website-v2` local or in staging until that work and launch review are complete.

Use pnpm 12.3.4, pinned in `package.json`, with `pnpm-lock.yaml` as the only package lockfile. Migrate the frontend in place on this branch; Git retains the React version. Record old hash links such as `#leaderboard` and `#calendar` and preserve their destinations through a deliberate compatibility mapping.

## Visual direction to review first

Start with a light, restrained design: neutral backgrounds, charcoal text, fine borders, subtle layered shadows, compact controls, and generous space around content. Use Inter for the main typeface, following Medusa's font setup. Make ratings easy to scan with aligned numeric columns. Use Medusa charcoal for controls. The latest hero review uses edge-to-edge Tanzania blue with a CSS fluted-glass pattern, lightly rounded navigation, and centered Londrina Shadow typography. The pawn has been removed. This supersedes the earlier blue primary.

Map Medusa's background, foreground, border, button, focus, and elevation tokens into the site's shadcn theme. Keep this mapping in one place. Preserve applicable license notices when copying source values. Avoid importing an entire second component library.

The first browser review includes the header, mobile navigation, a sample leaderboard, event card, buttons, and their focus/disabled/loading states. This establishes typography, density, spacing, and color before full pages multiply those choices.

The hero uses animated glass, light, and arc layers with a staggered headline reveal, a pause control, and reduced-motion support. Elsewhere, use brief motion where it explains a state change. Menus and sheets should be interruptible, respect reduced motion, and respond immediately to keyboard input. Keep hover behavior appropriate for touch devices.

The revised hero reads "Chess brings us together." with "A community for everyone who loves the game in Tanzania." and a blue fluted-glass background. Primary action: "Join us on WhatsApp". Keep the hero brief; the whole website communicates the community and its offerings through its sections. Remove decorative slogans and redundant labels.

## Routes and content

| Route                             | First-release scope                                                         | shadcn-svelte building blocks                           |
| --------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| `/`                               | Welcome, WhatsApp CTA, leaderboard preview, upcoming tournaments            | Button, Card, Table, Tabs, Badge                        |
| `/leaderboards`                   | Platform and time-control filters, search, ranking, source links, freshness | Tabs, Select, Input, Table, Pagination, Alert, Skeleton |
| `/calendar`                       | Upcoming/past events, month filter, online/in-person filter                 | Select, Tabs, Card or Item, Badge, Empty                |
| `/calendar/[slug]`                | Schedule, venue or online location, organizer, registration link            | Card, Badge, Button, Separator                          |
| `/blog` and `/blog/[slug]`        | News, analysis, educational articles, authors and categories                | Card, Badge, Pagination, Typography styling             |
| `/shop` and `/shop/[slug]`        | Catalog, filters, seller, availability, price in TZS, product details       | Card, Select, Badge, Button, Input                      |
| `/shop/cart` and `/shop/checkout` | Basket and review flow; payment unavailable                                 | Table, Input, Button, Alert, Separator                  |
| `/taca`                           | About and current leadership                                                | Card, Avatar, Separator                                 |
| `/taca/documents`                 | Constitution and joining form, each with view and download actions          | Card or Item, Button                                    |

Calendar starts with a readable agenda and month filter. A shadcn date picker can support date selection if useful. A custom full scheduling grid is outside this first release. Article analysis initially supports text, images, and links; an interactive chessboard needs a separate scope decision because it is not supplied by shadcn-svelte.

Events explicitly support OTB city/venue details and online platform/tournament links. The official Lichess team Arena and Swiss feeds were tested successfully with `nyumbani-mates`. Add a separate team-event integration checkpoint after the calendar interface review, with scheduled collection in the Go service and stored reads in the website. See `docs/lichess-team-events.md` for verified endpoints, response differences, and integration requirements. The homepage still uses one OTB and one online fixture.

## Ratings collection

Keep player discovery separate from rating refresh. Each provider gets an adapter and stored snapshots. Requests from website visitors read stored data; they do not trigger scraping.

| Source    | Discovery and collection                                                                                                               | Known limits and validation                                                                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lichess   | Maintain the existing player list and refresh ratings through the official API.                                                        | List maintenance is intentional. Include accounts outside existing teams when verified. Check available fields for closed, provisional, and unrated accounts.                                                                                |
| FIDE      | Parse the user-provided `incl_search_l.php` search with `search_country=TAN`. Retain the official rating-list downloads as a fallback. | The supplied query worked without cookies on 28 October. It returned 431 distinct IDs across nine tables: 85 Standard ratings, 47 Rapid, and 19 Blitz. These counts reflect that query's filters, not a guarantee of every Tanzanian player. |
| Chess.com | Use the official country-player, player-profile, and player-stats APIs in `swahilichess-api`.                                          | Country discovery covers recently active self-identified Tanzania accounts, not a complete historical roster. Review actual coverage and displayed rankings before deciding whether anything else is needed.                                 |

Chess.com reference pages for optional manual comparison, not collection dependencies:

- Rapid: <https://www.chess.com/leaderboard/live/rapid?country=TZ>
- Blitz: <https://www.chess.com/leaderboard/live?country=TZ>
- Bullet: <https://www.chess.com/leaderboard/live/bullet?country=TZ>

The initial collector discovers accounts through `/pub/country/TZ/players`, checks `/pub/player/{username}` for stable player ID, country, and account status, and reads `/pub/player/{username}/stats` for current Rapid, Blitz, and Bullet ratings. Accumulate discovered accounts over time and recheck their country and status. The API does not offer a complete historical country roster, and its population may differ from the website leaderboard. Review sample players, total coverage, and missing ratings in the browser. If these results are sufficient, retain this approach.

No Chess.com login, browser session, or HTML scraper is needed for this initial implementation. The earlier direct-page test returned HTTP 403; that does not block the official API approach. On API failure, preserve the last successful snapshot and report its age. Revisit discovery only if the browser review identifies a concrete coverage problem.

FIDE has Standard, Rapid, and Blitz categories. Lichess and Chess.com have Rapid, Blitz, and Bullet. Never combine ratings across providers into a single score. Federation affiliation and an online country flag are different signals; explain the inclusion rule per provider. Do not infer that two accounts belong to one person from similar names alone.

Initial refresh proposal: Lichess hourly, Chess.com daily with API caching respected, FIDE daily to detect published changes. Confirm intervals after observing source behavior and collection cost. Use serialized requests where required, timeouts, retry backoff, stable IDs, and duplicate protection. Keep the last successful dataset when a refresh fails. Distinguish collection time from the rating's effective date.

Parse every FIDE table and compare parsed IDs with the reported record count. Blank ratings stay null and do not appear as zero-rated ranked players. Test malformed markup, missing rows, closed accounts, duplicate IDs, ties, provisional ratings, and partial fetches. Publish a complete snapshot atomically. Explain source freshness and coverage on the leaderboard.

## CMS and service boundaries

Use a separate Payload service, with its own Next.js admin runtime, and a SvelteKit public frontend consuming its API. The public website stays Svelte. Payload's built-in admin UI is a separate application; the shadcn-svelte requirement applies to the public site.

| Sibling directory   | Responsibility in v2                                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `swahilichess/`     | SvelteKit website, shadcn-svelte UI, server-side reads from the ratings API and CMS.                                                               |
| `swahilichess-api/` | Maintained Lichess list, FIDE import, official Chess.com API integration, rating snapshots and refresh jobs. Preserve existing bot/auth endpoints. |
| `live-ratings-sse/` | Existing streaming prototype, deferred until a reviewed feature requires live updates.                                                             |
| `swahilichess-cms/` | New standalone Payload service for editorial content, media, TACA documents, products, sellers, and referral records.                              |

Propose PostgreSQL and object storage for uploaded images and documents. Give Payload its own database and migration ownership; it can share a PostgreSQL server without sharing the Go service's tables. Each service owns its environment configuration and deployment. Confirm hosting before choosing production adapters. Keep ratings refresh logic in the Go backend, outside CMS content hooks and website request handlers.

Provide local startup instructions and environment examples for each service as it is introduced. The website must remain reviewable with fixtures while backend or CMS services are unavailable. Define typed frontend response contracts for source, time control, player IDs, rating, snapshot time, effective date where available, and refresh status. Test changes against the existing API consumers before replacing any endpoint behavior.

Build CMS collections only when their feature needs them:

| Content                              | Fields and behavior to support                                                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Site settings                        | Welcome copy, WhatsApp URL, navigation, contact links                                                                  |
| Posts, categories, authors, media    | Slug, content, images and alt text, author, category, publication date, drafts, preview, SEO                           |
| Events                               | Start/end, all-day or date-to-be-confirmed, timezone, venue, online link, organizer, registration URL, status          |
| TACA information, leaders, documents | Approved about text, roles and terms, portraits, PDF type/version/date, view/download file                             |
| Sellers, products, categories        | Seller relationship, images, TZS prices, availability, book/equipment/merchandise categories, optional variants        |
| Referrals                            | Product and seller IDs, referral reference, creation time, reconciliation status; commission terms restricted to staff |

Only published content should be publicly readable. Restrict writes and previews to appropriate roles. Editors manage inventory initially; seller portals are a later option. CMS review must demonstrate that drafts stay private and publishing updates the website.

For the shop, track a referral separately from a confirmed sale. A seller contact link may carry a reference, but a click does not prove a purchase or commission. Review the contact channel and seller reconciliation process before implementing referrals. Checkout must clearly say payment is unavailable and must never report a paid or confirmed order. Do not collect card details. Split seller-specific referrals when a basket contains products from both sellers.

## Reviewable implementation chunks

Each row is a separate handoff. Keep diffs focused; create a commit or review checkpoint after acceptance. Do not continue through multiple rows without the user's review.

| Chunk                                 | Work                                                                                                                                 | Browser review and exit criteria                                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0. Planning, accepted                 | Branch, installed skills, source checks, this roadmap                                                                                | Review scope, visual direction, source strategy, and sequence. Planning accepted; foundation implementation follows below.                                                      |
| 1. Svelte foundation, accepted        | SvelteKit/TypeScript, shadcn, Medusa theme mapping, header/footer/mobile menu, development-only UI sample                            | Run locally and inspect desktop/mobile styles. Test menu, focus, table readability, and loading/empty/error examples. Approve the visual direction.                             |
| 2. Homepage, in review                | Welcome, WhatsApp CTA, leaderboard and tournament previews using clearly labeled fixtures                                            | Test the invitation destination, widget links, content hierarchy, and narrow screens. No dependency on a running CMS.                                                           |
| 3. Leaderboard interface              | All provider/time-control selections, search, pagination, source/freshness copy, fixtures                                            | Test every valid combination, refresh/back links, long names, ties, empty results, and unavailable data. No FIDE Bullet option.                                                 |
| 4a. FIDE integration                  | Parser, stored snapshot, server read path in `swahilichess-api`                                                                      | Compare source IDs and sample ratings; browse all three categories. Failed or malformed refresh keeps the previous snapshot and shows its age.                                  |
| 4b. Lichess integration               | Connect the maintained list and API refresh through the existing Go service                                                          | Add/remove a test player in a local dataset and verify the result. Missing ratings and unavailable accounts behave correctly; existing bot consumers still work.                |
| 4c. Chess.com API integration         | Country discovery, profile/status checks, rating refresh, and snapshots in `swahilichess-api`                                        | Review real player counts and sample profiles, all three categories, site pagination, missing ratings, and API failure states. Keep the official API if coverage is sufficient. |
| 5. Calendar                           | Agenda, filters, event detail, upcoming/past handling using fixtures                                                                 | Test multi-day events, TBA dates, cancellations, online links, and Africa/Dar_es_Salaam display. Confirm current event content before migration.                                |
| 6. Payload setup and event publishing | Create sibling `swahilichess-cms`, independent database/configuration, authentication, media, event collection, frontend integration | Start CMS and website locally. Create a draft event, preview it privately, publish it, edit it, and unpublish it. Verify calendar and homepage update.                          |
| 7. Blog                               | Post/category/author collections, listing and article routes                                                                         | Draft and publish a real sample article; check images, long text, category filtering, mobile reading, and unpublished/unknown slugs.                                            |
| 8. TACA                               | About, leadership, approved PDF uploads, view/download actions                                                                       | Verify names and roles, read both documents, and download each file on desktop and mobile. Provide an open-file fallback where inline PDF viewing fails.                        |
| 9. Shop catalog                       | Sellers/products in CMS, category filters, product details                                                                           | Publish one book, one board, and optional merchandise. Test missing images, variants if needed, and unavailable stock.                                                          |
| 10. Basket and referral flow          | Basket, checkout review without payment, agreed seller contact/referral tracking                                                     | Test quantities, reload persistence, mixed sellers, unavailable products, reference recording, and clear unpaid status. Verify no click is treated as a completed sale.         |
| 11. Content and release review        | Replace fixtures, complete content migration, accessibility/SEO checks, staging deployment and rollback instructions                 | Test key journeys on a real phone and desktop. Confirm source refreshes and CMS edits in staging. Production release is a separate final action after acceptance.               |

## What every handoff includes

- Exact working directory, install/run commands, local URL, and routes to review. Keep `pnpm dev` consistent from chunk 1 onward.
- A short click-through checklist, what changed, what remains mocked, and any known limitation.
- Working fixture mode for frontend review without external services, with obvious sample-data labels. Fixture controls must not ship publicly.
- Relevant Svelte autofixer checks, type checks, and a production build. Add meaningful parser/data tests and critical browser-flow tests as those behaviors arrive.
- Desktop and mobile-width checks, keyboard navigation, focus visibility, reduced-motion behavior, readable contrast, and no unexplained console or hydration errors.

Use Svelte 5 runes for new code, derived state instead of synchronization effects, keyed lists, and typed component props. Load data through appropriate SvelteKit server routes/load functions, keep credentials server-only, and avoid shared mutable per-user server state. Validate external responses at the boundary. Pin compatible versions when creating the foundation.

## Inputs needed when their chunk begins

The first visual review does not need these to be complete:

- Confirm the current WhatsApp invitation and preferred logo/brand treatment before accepting the homepage.
- Confirm leaderboard eligibility for provisional/inactive accounts and review official Chess.com API coverage during the ratings chunks.
- Provide current event details and a content editor for the CMS trial.
- Provide approved TACA copy, leadership details, constitution, and joining-form PDFs before publishing TACA pages.
- Ask the two sellers for inventory, product photos, prices, availability, contact details, and the referral/commission reconciliation arrangement before accepting shop behavior.
- Confirm hosting/runtime access, database/storage, and a staging address before deployment. Keep Kiswahili translation, payments, seller dashboards, and interactive chess analysis in later releases unless separately prioritized.

## Reference material

- [Official Svelte skills](https://svelte.dev/docs/ai/skills) and [skill source](https://github.com/sveltejs/ai-tools/tree/main/tools/skills).
- [shadcn-svelte SvelteKit setup](https://www.shadcn-svelte.com/docs/installation/sveltekit).
- [Medusa design system](https://github.com/medusajs/medusa/tree/develop/packages/design-system), including [color tokens](https://github.com/medusajs/medusa/blob/develop/packages/design-system/ui-preset/src/theme/tokens/colors.ts), [effects](https://github.com/medusajs/medusa/blob/develop/packages/design-system/ui-preset/src/theme/tokens/effects.ts), and [button styling](https://github.com/medusajs/medusa/blob/develop/packages/design-system/ui/src/components/button/button.tsx).
- [Payload architecture](https://payloadcms.com/docs/getting-started/what-is-payload).
- [FIDE official rating lists](https://ratings.fide.com/download_lists.phtml) and [advanced search](https://ratings.fide.com/advanced_search.phtml). The user's full search query was tested with its original filters and no cookies; implementation must confirm each filter's meaning before changing it.
- [Chess.com Published Data API](https://www.chess.com/news/view/published-data-api), especially Country Players, Player Stats, and caching rules.
- [Lichess API](https://lichess.org/api), [batch user lookup](https://github.com/lichess-org/api/blob/master/doc/specs/tags/users/api-users.yaml), and [team-member lookup](https://github.com/lichess-org/api/blob/master/doc/specs/tags/teams/api-team-teamId-users.yaml).
