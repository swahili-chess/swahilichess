# Homepage review · chunk 2

> **Later change, 28 October 2026:** the rankings widget now shows the real FIDE top 15 for Standard, Rapid and Blitz, read from the Go API. It has no fictional players or sample label. `?fixture=empty` shows the widget without players, and `?fixture=countdown` keeps real rankings. Tournaments remain fictional. The notes below describe the accepted chunk 2 review.

Chunks 1 and 2 were accepted on 28 October 2026. This checkpoint builds the homepage only; full leaderboards, calendar pages, API collection, and CMS integration remain later chunks.

## Run and review

From the repository root, run `pnpm install --frozen-lockfile` and `pnpm dev`.

- `/`: homepage with the accepted animated hero, WhatsApp action, Lichess top-five widget, two tournament cards, and developer-credit footer.
- `/?fixture=empty`: development-only empty widget scenario.
- `/?fixture=countdown#calendar`: development-only scenario with both sample events starting in 45 minutes. Cards and dialogs show a ticking countdown beside the EAT start time during the final hour. It disappears at the scheduled start. Reloading this scenario resets its sample times.
- `/preview/events`: development-only gallery of six event scenarios using the same cards and dialogs as the homepage.
- `/preview`: the existing foundation review and its loading, empty, and error controls. It remains unavailable in production.

Homepage player ratings and tournament details are fictional. Ratings retain a sample label; the user requested removal of event sample badges and fictional-event notes. Registration is disabled. The page stays `noindex` until real content is integrated. No backend or CMS is required. Navigation currently targets homepage sections; full ranking and calendar routes are not part of this chunk.

## Event scenarios

| Event                                                | Scenario                                                  |
| ---------------------------------------------------- | --------------------------------------------------------- |
| Dar es Salaam Open                                   | Rated OTB, paid entry, three prizes                       |
| Saturday Club Rapid                                  | Unrated OTB, free entry, no prizes                        |
| Community Blitz                                      | Lichess, starts in 45 minutes, no fee or prizes specified |
| Sunday Bullet Cup                                    | Chess.com, free entry, four prizes                        |
| Tanzania Schools and Universities Rapid Championship | Long title and venue, six prizes, fee unspecified         |
| Mwanza Weekend Blitz                                 | Unrated OTB, paid entry, empty prize list                 |

Reloading the gallery resets the countdown fixture. Open each card to compare its details and, where present, its prize breakdown. All six events are fictional and registration actions remain disabled.

## Browser checklist

1. Use the hero and navigation links to reach rankings and tournaments. On mobile, selecting a menu link should close the sidebar.
2. Switch Rapid, Blitz, and Bullet. Rapid leads with Amani, Blitz with Neema, and Bullet with Zawadi. Each list contains five players sorted by its own ratings.
3. Open both tournament cards. Dar es Salaam Open has an `OTB · FIDE RATED` tag, city, and venue. Unrated OTB events use `OTB · UNRATED`. Community Blitz uses a Lichess link without an Online label or physical venue. Check the Details and Prize pool tabs with mouse and keyboard. Dar's fictional awards total TZS 1,000,000 and its entry fee is TZS 20,000. Community Blitz omits both fields: its card has neither row and its dialog shows details directly with no prize tab. Card totals must match the breakdowns. Check EAT times and disabled registration. Event tags sit above titles, with no icon in the OTB tag. Time control and start time each have their own row and icon. Optional prizes and fees have their own icons. Escape should close the dialog and return focus. Sample platform links open the platform homepage; real online events link to their tournament.
4. Check the homepage at 320px, 390px, and desktop widths. The approved hero, stationary glass lines, slow gradient, and mobile action placement should remain intact.
5. Visit the empty scenario. It should show "No rapid ratings available." and "No tournaments scheduled." without broken controls.
6. Verify the WhatsApp invitation destination. Checking a link does not join the group or confirm membership access.

## Implementation

The approved hero is shared by the homepage and foundation review. The WhatsApp URL lives in `src/lib/site.ts`. Typed fixture data enters through the homepage server load; ranking and tournament summaries accept data as props and compose shadcn-svelte controls. Ratings exclude missing values, preserve equal ranks for ties, and limit the widget to five entries. Dates explicitly use `Africa/Dar_es_Salaam`.

EventCard and EventDialog share EventTag, EventFacts, and EventCosts. Both use aligned icon/label/value rows; optional amounts sit in a tinted panel. EventPrizes supplies the award breakdown. Long dialog bodies scroll while the title, close control, and action remain visible. Formatting and amount rules live in `src/lib/event-presentation.ts`. The gallery fixtures live in `src/lib/fixtures/event-scenarios.ts`.

The standalone foundation data controls remain off the homepage. No additional marketing copy, roadmap explanations, or invented live activity counts were added.

## Verification · 28 October 2026

- Svelte autofixer passed for the shared event components and gallery. `pnpm check`, `pnpm format:check`, and `pnpm build` passed.
- Browser review covered the event gallery at 320px, 768px, 1024px, and desktop widths, including long titles, optional amounts, the countdown, and scrolling six-award dialogs. Earlier homepage review passed at 320px, 390px, and desktop widths: rating order and keyboard tabs, both event dialogs, Escape and focus return, mobile navigation, and empty widgets. No browser console warnings or errors were recorded.
- The local production build served the homepage with sample labels and `noindex`, returned 404 for `/preview` and `/preview/events`, and ignored the development-only empty-fixture query.
- The WhatsApp URL opened a group invitation page. The page did not expose the group name; group identity and membership access remain unverified. No group was joined.
- Focused checks passed for missing/null/empty/zero prize pools, prize totals, unspecified/free/paid entry fees, and EAT formatting.
- Responsive checks used browser viewports, not a physical phone. Existing reduced-motion styles were preserved; the operating-system reduced-motion preference was not exercised in this checkpoint.
