# Lichess team events

Verified 28 October 2026 against the official API and the public `nyumbani-mates` team. No scraping, token, or team membership is needed to read these feeds.

## Endpoints

- Arena: `GET https://lichess.org/api/team/nyumbani-mates/arena`
- Swiss: `GET https://lichess.org/api/team/nyumbani-mates/swiss`

Both return newline-delimited JSON, newest start date first. Both accept `max` (default 100), `status` (`created`, `started`, `finished`), `createdBy`, and `name`. Arena returns tournaments relevant to a team, which may include team battles, rather than only events organized by that team.

The live check with `max=2` returned two Arena and two Swiss records. The latest returned Arena was Prodigies Sunday Blitz Arena (`4Nx9QCpX`); the latest returned Swiss was Ghala June Chess TRN (`C3u9YJKO`). Both were finished. Separate requests with `status=created&max=100` returned empty feeds for both types. These are observations at the check time, not a permanent absence of upcoming events.

## Integration plan

Keep this homepage checkpoint on clearly labeled fixtures. Implement team-event collection as a separate calendar integration checkpoint through the sibling Go service.

- Maintain an explicit list of team IDs, starting with `nyumbani-mates`.
- Fetch Arena and Swiss feeds sequentially on a schedule. Handle rate limits and retain the last good snapshot on failures.
- Validate each NDJSON record. Arena uses `fullName`, millisecond `startsAt`, and numeric status; Swiss uses `name`, ISO `startsAt`, and string status. Normalize both into one event contract. Clock limits are seconds; increments are seconds per move.
- Keep upcoming, ongoing, and finished states distinct. Sort upcoming events by nearest start after collection, since the feeds return reverse chronological order. Account for truncation when setting `max`.
- Deduplicate by provider, tournament system, and tournament ID when multiple teams share a tournament.
- Map location to online / Lichess. Link Arena events to `https://lichess.org/tournament/{id}` and Swiss events to `https://lichess.org/swiss/{id}`. Display dates in Africa/Dar_es_Salaam.
- Let Lichess handle entry eligibility and joining. A public feed does not imply that every visitor can enter. Viewing a tournament must never automatically join it.
- Merge imported events with CMS-managed OTB and other online events through explicit source IDs. Do not infer duplicates from names alone. Validate external URLs before rendering them.

## Official references

- [Arena team feed](https://lichess.org/api#tag/Teams/operation/apiTeamArena)
- [Swiss team feed](https://lichess.org/api#tag/Teams/operation/apiTeamSwiss)
- [Arena endpoint specification](https://github.com/lichess-org/api/blob/master/doc/specs/tags/teams/api-team-teamId-arena.yaml)
- [Swiss endpoint specification](https://github.com/lichess-org/api/blob/master/doc/specs/tags/teams/api-team-teamId-swiss.yaml)
- [API usage guidance](https://lichess.org/page/api-tips)
