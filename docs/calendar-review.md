# Calendar review

Checkpoint 5, ready for review on 28 October 2026. Both repositories use their own `website-v2` branch. Chunks 1–4c are accepted. Stop here for review before the CMS.

## Event sources

| Source             | Where it comes from                                                                                                   | Refresh                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Created events     | The 17 events of the 2026 calendar on the current chess.tz site, in `src/lib/content/events.ts`                       | Edited in code until the CMS checkpoint   |
| Recognized clubs   | Lichess Arena and Swiss feeds of each club in the API's `config/clubs.json`: Nyumbani Mates, Jordan Chess Club        | Every 15 minutes, by `cmd/events-refresh` |
| Official Lichess   | `GET /api/tournament`: standard or Chess960 from 1+0 to 15+10, plus one-off events such as the Titled Arena           | Every 15 minutes, same worker             |
| Weekly club series | Projected on the website from each club's history: same weekday, start time and time control three times in six weeks | On every page load                        |

Clubs create Lichess tournaments shortly before play, sometimes an hour ahead, so the collector checks every 15 minutes. Club tournaments from the last year stay in the past view. Finished official Lichess tournaments are dropped, because hourly arenas would flood the past view. Lichess lists official tournaments only a few hours ahead, so monthly and other long-range events appear when Lichess creates them.

To add a club, add its Lichess team ID and name to `config/clubs.json` in `swahilichess-api` and redeploy. Events never merge by similar names; each keeps its provider and tournament ID. A tournament listed by two clubs appears once, under both clubs.

The created events were migrated as written. Days, venues, times, formats, organizers and rating status that the old calendar did not state stay empty or show "To be announced". Please confirm the list, and correct anything outdated, during review. Online created events have no platform yet, so they show "Online" without a link.

## Weekly club series

Clubs create their weekly tournaments on the day. Jordan Chess Club's numbered Jordan Arena runs on Sundays at 19:40 EAT (10+5), and Nyumbani Mates' Prodigies Sunday Blitz Arena on Sundays at 21:00 EAT (3+1). When a club plays the same weekday, start time and time control at least three times in six weeks, the next four weeks appear as Expected, linking to the club's Lichess page. A real tournament from the club on that date replaces the expected one. Edition numbers such as "XXVIII" are dropped from the series name.

The migrated calendar's five Prodigies online blitz entries were removed; the weekly Prodigies Sunday Blitz Arena from Nyumbani Mates replaces them.

## Styling

Calendar cards and 24/7 blocks share event tones defined in `src/routes/layout.css`: soft three-stop gradients with an accent stripe and an ink color. Over-the-board events are white with a charcoal stripe, club events Tanzania blue, other online events slate. On 24/7, bullet is ember, blitz amber, rapid green and Chess960 violet. Hovering lifts a card and sends one slow sheen across it, events in progress breathe slowly, and both effects stop with reduced motion. The next event's stripe turns red, matching its timeline marker.

## Agenda layout

Each month's events are indented on a vertical timeline with one node per day. Within a day, events starting in the same local hour share an hour heading; events without a time come first. Each card shows its own time and duration, or its date range for multi-day events. Events whose day is not announced form a "Day to be announced" node at the end of their month. The day holding an event in progress, or otherwise the next event, has a red marker. Expected club events have dashed cards, and a day of only expected events has a dashed marker.

On desktop a ruler beside the page works as the page's scrollbar. It starts level with the first month of the agenda and sticks at that position, so it never moves while the page scrolls; it only rises at the end of the content to stay clear of the footer. On short windows, where the agenda starts below 60% of the height, it sticks near the top instead. The frosted lens is the scrollbar thumb: its top is the scroll position and its height the visible share of the page. Dragging it moves the page by the same share, pressing the ruler glides there, arrow keys scroll a quarter screen and Page keys a screen. Marks sit where their content is on the page: month names at each month's heading, blue ticks at event days and a glowing Today marker where upcoming dated events begin, so the lens always covers what is on screen. Fine ticks are evenly spaced decoration. Chevrons step to the previous or next month. On mobile the ruler is hidden and the month filter remains.

## 24/7 chess

`/around-the-clock` shows online tournaments in a timeline from half an hour ago to as far ahead as Lichess lists, at most eight hours. Lanes are Tanzanian clubs, Bullet, Blitz and Rapid; overlapping tournaments stack in rows. A red line marks the current time and moves every 30 seconds. Each block links to its event page. The timeline scrolls horizontally inside its frame, so the page itself never does.

The header now has a Tournaments menu, built with shadcn NavigationMenu, holding 24/7 chess and Calendar. On mobile they appear under a Tournaments label in the sheet.

## Chess.com

Chess.com was dropped from this checkpoint. Its official API has no tournament listing, the public `filter=official` list covers daily tournaments only, and identifying official live tournaments needs a signed-in session behind a CAPTCHA.

## Start the preview

From `swahilichess-api`, with the review database running:

```sh
export SW_DB_DSN='postgres://chess:local_review_only@127.0.0.1:55432/chess_ratings?sslmode=disable'
go run ./cmd/events-refresh -watch
go run ./cmd/api -host 127.0.0.1 -port 8081
```

An existing review database needs `db/migrations/000005_events_snapshot.up.sql` once. Then run `pnpm dev` here and open <http://127.0.0.1:5174/calendar> and <http://127.0.0.1:5174/around-the-clock>.

## Routes

- `/calendar`: Upcoming and Past tabs with month and event type (over the board or online) filters, as URL state. It shows created and club events only; official Lichess tournaments live on 24/7 chess.
- No event pages. Every event on the calendar, 24/7 chess and the homepage opens a dialog with its details. Its button joins the tournament on Lichess (Join on Lichess, or View on Lichess once finished), opens the club page for expected club events, or registers for over-the-board events with a registration link. On 24/7, the blocks share one dialog and return focus to the block on close.
- `/`: the next three upcoming created or club events, linking to the calendar. Official Lichess tournaments stay on the calendar only.
- `/around-the-clock`: the 24/7 chess timeline.
- `/preview/events`: development gallery with eight fictional scenarios, now including an unannounced day and a cancelled event.

## Review in the browser

- Open the Tournaments menu in the header, on the homepage hero and on an inner page, then on mobile.
- On 24/7 chess, scroll the timeline and open a tournament. The red line marks now.
- Filter the calendar to Online. Expected Jordan Arena and Prodigies Sunday Blitz Arena entries follow each Sunday after the real XXVIII Jordan Arena.
- Upcoming starts with the October event whose day is to be announced, then November and December. Jordan Chess Club's XXVIII Jordan Arena appears on 1 November at 19:40 EAT.
- Switch to Past. Club tournaments from the last year appear with the earlier 2026 events.
- Filter December over-the-board events, then an impossible combination to see the empty state and Clear filters.
- Open Tanzania Open Chess Championship 2026: an 11–13 December range with venue to be announced.
- Open XXVIII Jordan Arena from the homepage card's dialog and from the calendar. View on Lichess opens the tournament.
- Resize to mobile. Filters stack and rows wrap without horizontal scrolling.

## Validation completed

- Go collector tests: Arena and Swiss normalization, official filtering by creator and variant, deduplication across clubs, finished-event retention, sorting, invalid IDs, statuses, truncated feeds and failed requests. PostgreSQL persistence test with the race detector. The club list itself is validated.
- Thirty-three frontend tests, covering weekly series projection, timeline lanes, East Africa dates, month-long and multi-day spans, ordering of unannounced days, filters, query bounds and API boundary validation.
- Svelte check, autofixer on every changed component and route, formatting check and production build.
- Browser review of the agenda, filters, empty state, past view, event pages, the 404, the homepage dialog, the event gallery and 375px mobile width. No console errors after fixing a nested link in agenda rows.

No production database, merge or deployment was involved.
