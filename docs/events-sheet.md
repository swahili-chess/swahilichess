# Events sheet

Our own events, and prizes for Lichess tournaments, come from one Google Sheet. Club and official Lichess tournaments themselves still come from the Go API automatically. The website reads the sheet server-side, shares one copy between all visitors for a minute, and keeps the last good copy for a day if Google is unavailable.

## Set it up

1. Create a Google Sheet with two tabs named **Events** and **Lichess prizes**.
2. Import `docs/sheet-templates/events.csv` into Events and `docs/sheet-templates/lichess-prizes.csv` into Lichess prizes (File → Import → Upload → Replace current sheet). The events template holds the 2026 calendar.
3. Select the **Date** and **Last day** columns and choose Format → Number → Plain text, so Sheets keeps dates as you type them.
4. File → Share → Publish to web. Publish the **Events** tab as **Comma-separated values (.csv)** and copy the link. Do the same for **Lichess prizes**.
5. On the server, set `EVENTS_SHEET_URL` and `PRIZES_SHEET_URL` to those two links and restart the website.

Share the sheet for editing only with the people who maintain events. Publishing makes the two tabs readable by anyone with the links, which is fine: everything in them is shown on the website anyway.

## Events tab

One row per event. Column names must stay as they are; their order does not matter.

| Column            | What to write                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Show              | `no` hides the row while you prepare it. Anything else shows it.                         |
| Name              | Required.                                                                                |
| Date              | `2026-11-01` or `1 Nov 2026`. Only the month known: `2026-12` or `Dec 2026`.             |
| Last day          | For events over several days.                                                            |
| Start time        | 24-hour East Africa Time, such as `09:30`. `7:30 PM` also works.                         |
| End time          | Needs a start time.                                                                      |
| Type              | `OTB` or `Online`. Required.                                                             |
| Venue, City       | OTB only. Empty shows "To be announced".                                                 |
| FIDE rated        | `yes`, `no`, or empty when not published.                                                |
| Registration link | OTB only. Must start with `https://`.                                                    |
| Platform          | Online only: `Lichess` or `Chess.com`.                                                   |
| Tournament link   | Online only. Must start with `https://`.                                                 |
| Status            | Empty, `Postponed` or `Cancelled`.                                                       |
| Format            | Such as `Swiss, 7 rounds`.                                                               |
| Time control      | Such as `15+10`.                                                                         |
| Prizes            | `1st place: 50,000; 2nd place: 30,000`, or one award per line. Empty when not published. |
| Entry fee         | A number, or `0` or `Free`. Empty when not published.                                    |
| Currency          | `TZS` (the default) or `USD`, for both prizes and the entry fee.                         |

Leave unknown details empty rather than guessing. Slashed dates such as `11/01/2026` are rejected, because they read differently in different countries.

## Lichess prizes tab

Adds prizes and an entry fee to any Lichess tournament the website already shows, from a recognized club or official.

| Column          | What to write                                                                            |
| --------------- | ---------------------------------------------------------------------------------------- |
| Tournament link | The Lichess link, such as `https://lichess.org/tournament/pU7LJr6J` or a `/swiss/` link. |
| Prizes          | As in the Events tab.                                                                    |
| Entry fee       | As in the Events tab.                                                                    |
| Currency        | As in the Events tab.                                                                    |
| Note            | Anything, for example the tournament's name. Not shown.                                  |

The tournament's name, time and link always come from Lichess.

## Check your changes

Google takes up to five minutes to republish a sheet, and the website refreshes its copy every minute. Open `/calendar/sheet-check` to see how many events and prizes the website read, and which rows it skipped with the reason and row number. Skipped rows don't affect the others.

## Local development

`.env.example` points both addresses at the templates, which the development server serves from `/preview/sheet/events.csv` and `/preview/sheet/lichess-prizes.csv`. Edit the templates to try changes locally. Those routes return 404 in production.
