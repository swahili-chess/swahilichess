# chess.tz contributor instructions

## Start here

Read `docs/website-v2-roadmap.md` before changing scope. Work on `website-v2`. Check Git status and preserve user changes. Keep shared documentation portable: use repository-relative paths and never hardcode a contributor's username or checkout location. This repository is the public website. Related backend services live in separate repositories, conventionally checked out beside it.

Deliver one roadmap chunk at a time. Finish it, provide a working browser preview and a short test checklist, then wait for the user's review before beginning the next chunk. Do not build the entire roadmap in one turn. Keep the roadmap's progress notes current so work can resume after context compaction.

Current checkpoint: chunks 1, 2 and 3 accepted on 28 October 2026; chunk 4a monthly FIDE integration in review. The homepage is `/`; `/preview` is the development-only foundation review, and `/preview/events` is the development-only six-scenario event gallery. Reuse EventCard/EventDialog and their shared EventTag/EventFacts/EventCosts compositions when changing homepage events; keep the gallery in sync. The leaderboard is `/leaderboards`. FIDE reads real monthly snapshots from the Go API; Lichess and Chess.com remain labeled fixtures. See `docs/fide-review.md`. Do not start chunk 4b until this integration is accepted.

## Required skills

Read the relevant installed `SKILL.md` files before their first use in a conversation. Skills supplement these instructions; the user's explicit requests take precedence. Do not assume React examples in general design skills apply literally to Svelte.

- Every Svelte component or Svelte module change: `svelte-code-writer` and `svelte-core-bestpractices`, installed at `~/.codex/skills/svelte-code-writer/SKILL.md` and `~/.codex/skills/svelte-core-bestpractices/SKILL.md`.
- UI design and interactions: `~/.agents/skills/emil-design-eng/SKILL.md` and `~/.agents/skills/frontend-ui-engineering/SKILL.md`.
- Headlines and introductory copy: `~/.agents/skills/copywriting/SKILL.md`.
- Interface copy: `~/.agents/skills/ux-writing/SKILL.md`.
- All writing: `~/.agents/skills/unslop/SKILL.md`.

Skill paths are relative to the current contributor's home directory. If `CODEX_HOME` is configured, look in `$CODEX_HOME/skills` instead of `~/.codex/skills`. Use the session's skill catalog to locate skills by name when paths differ. Use the official Svelte documentation tools when needed and run `svelte-autofixer` before finalizing Svelte changes. Never silently skip a missing required skill; report the limitation.

## Frontend and component rules

- Svelte 5, SvelteKit, strict TypeScript, pnpm 12.3.4, one `pnpm-lock.yaml`. Use `pnpm install --frozen-lockfile` for reproducible installs.
- Use shadcn-svelte for all UI controls. Reusable site components must wrap or compose shadcn-svelte components. Semantic page markup and layout CSS are allowed. Do not hand-build alternative buttons, tabs, dialogs, tables, menus, or form controls.
- Generate upstream components through `pnpm ui:add <components>` with the dev server stopped. This wrapper handles the current SvelteKit 3/shadcn CLI config compatibility issue. Keep generated components in `src/lib/components/ui`; put reusable site compositions in `src/lib/components/site`. Centralize visual tokens in the theme stylesheet.
- Adapt Medusa's neutral colors, fine borders, layered shadows, Inter typography, and control styling. Do not import its React UI library. Preserve notices for copied source.
- Use runes, typed props, keyed lists, and `$derived` for computed state. Avoid synchronization effects and legacy Svelte syntax. Keep request/user state out of shared mutable server modules.
- Controls use Medusa charcoal `#27272A` with white text. The current hero uses Tanzania blue `#00A3DD` with lighter glass highlights; keep charcoal controls and black text. Do not darken the hero below its base blue, to preserve text contrast.
- The current hero review uses edge-to-edge Tanzania blue with a CSS fluted-glass pattern, lightly rounded navigation, and centered Londrina Shadow typography with positive letter spacing. The hero fills at least the viewport height, with no design-preview strip. Keep sample labels on fictional ratings; event sample labels were removed at the user's request. The pawn has been removed per the latest request; do not restore it or Kablammo without new direction. Inter remains the interface font. Chunk 1 and this visual direction were accepted on 28 October 2026. Preserve them in later chunks.
- Hero interactions use translucent dark hover/expanded surfaces; the mobile Sheet uses pale blue. The menu trigger has two unequal strokes and a 44px target. Keep the entire hero wordmark dark, including `.tz`.
- Hero copy: “Chess brings us together.” followed by “A community for everyone who loves the game in Tanzania.” On mobile, center the action group and hide the subtitle and divider. On desktop, keep the subtitle on the left, actions at the far right, and the divider above the footer row.
- Copy should be direct and sparse. The whole site explains the community and its offerings; the hero is a brief introduction, not a feature catalog.
- Keep roadmap and implementation plans out of user-facing UI, including navigation labels, helper text, and tooltips. Do not add redundant explanations such as "Opens our WhatsApp group." Record plans in project docs instead.
- English first, Kiswahili later. Keep copy easy to extract and translate. Use Africa/Dar_es_Salaam for local event display and TZS for shop prices.
- Hero motion: CSS ambient animation: stationary upright glass flutes over a broad gradient highlight that travels from upper right to upper left and back (32s each direction, ease-in-out). Animate the original light/dark distribution, not an added narrow ripple or shimmer band. The arc has its own 14s alternate loop. Never skew or rotate the glass lines. The mobile arc is enlarged with 40% overscan and translates/scales without rotation so no layer edge enters view. Headline lines reveal over 900ms with an 80ms stagger and ease-out; footer enters over 600ms. Keep a shadcn pause/resume button, pause ambient motion offscreen and in hidden tabs, and clean up observers. Reduced motion uses a static background and 140ms text fade. Pointer-only arrow hover uses 160ms/2px; keyboard focus skips the entrance. For motion work use animate, animation-vocabulary, and find-animation-opportunities skills.
- Use short, purposeful transitions with reduced-motion support. Touch and keyboard interactions must work. Maintain visible focus, semantic headings, accessible names, and readable contrast.
- Document fixture data in the review notes and keep development-only review controls out of production routes. The user requested no sample-event badges or fictional-event notes in the event UI; retain the sample data flag to prevent fake registration actions.

## Services and data decisions

- `../swahilichess-api`: existing Go/Echo/PostgreSQL/sqlc backend. Extend it for collection, refresh jobs, and rating snapshots. Preserve existing bot and auth consumers. Use its `website-v2` branch for all upgrade work.
- `../live-ratings-sse`: unfinished streaming prototype. Defer live push updates for the first release.
- `../swahilichess-cms`: planned separate Payload service, created during the CMS chunk. It owns its database/migrations and content/media/product/referral data. Its Next.js admin is separate from the Svelte public website.
- Lichess: maintain the existing player-list approach, refresh ratings with its official API.
- Events support online and OTB locations. Online events have a platform and tournament URL; OTB events have a city, venue, and optional registration URL. Never require a physical venue for online events. Lichess team Arena/Swiss feeds were verified with `nyumbani-mates`; see `docs/lichess-team-events.md`. Scheduled collection is later integration work, not a homepage visitor request.
- Event cards show prize totals; event dialogs have Details and Prize pool tabs with award breakdowns. Derive totals from the awards. Use `OTB · FIDE RATED` or `OTB · UNRATED` tags for physical events, with explicit rating status. Online events use Lichess/Chess.com links, without an Online label or a Play row. Sample platform links lead to the platform homepage, not a fictional tournament. Prize pools and entry fees are optional. Hide the prize field and tab when prizes are omitted, null, empty, or total zero. Without a pool, show details directly without tabs. Hide unspecified entry fees; explicitly zero fees display Free. Never infer free entry from a missing fee. Put the platform/OTB tag above the title. Keep the OTB rating tag text-only. Put time control and start time on separate rows with their own icons; use icons for location, prize pool, and entry fee. Remove sample-event badges and fictional-event notes from both event previews and dialogs.
- Chess.com: official country-player/profile/stats APIs first. Review coverage; do not implement authenticated scraping unless the user revisits that decision.
- FIDE: use dated official monthly XML archives, cross-checked against search requests with Referer/X-Requested-With headers. The Go collector imports Standard/Rapid/Blitz atomically, matches FIDE search with `search_inactive=on` by using active Standard-rated TAN player IDs for all categories. Rapid/Blitz inactivity flags are not additional exclusions. It retains the last good snapshot on failure. Successful imports wait until the next month; failures retry daily. Store rating month separately from fetch time.
- Online categories: Rapid, Blitz, Bullet. FIDE categories: Standard, Rapid, Blitz. Never invent FIDE Bullet or combine provider ratings into one score.
- Read stored snapshots from the website. Do not scrape or refresh providers on visitor requests. Retain the last good snapshot on failures and show its age.
- Never infer cross-platform identity from similar names. Missing ratings are null, not zero.
- Display chess ratings without thousands separators, for example `2248`, not `2,248`. Currency amounts keep their normal formatting.
- Shop payments are deferred. A referral click is not a sale. Never report a paid order or collect card details in the initial version.

## Leaderboard interface

- Provider, category, search, and page are URL state. Use `src/lib/leaderboard.ts` for normalization, ranking, and links. Search preserves global ranks, ties use competition ranks, and missing/zero ratings are excluded.
- Lichess and Chess.com have Rapid/Blitz/Bullet; FIDE has Standard/Rapid/Blitz. Incompatible categories fall back to the provider default.
- Exclude inactive FIDE players before ranking, search, and pagination. Excluded players do not count as unrated. Fixtures retain inactive records to verify this filter, alongside provisional, missing-rating, tied, and long-name cases. Fake player profiles must not link to invented accounts. Show the sample label only for fictional data. Keep noindex while other providers and homepage data remain fixtures.
- `?fixture=ready|empty|loading|error|stale` controls are development-only and documented in `docs/leaderboard-review.md`. No planning copy in the UI.
- Leaderboard copy: show the provider's data-source description directly beneath the rankings title, where the Tanzania subheading previously sat. Omit the standalone Tanzania subheading, provider footer link, and the note about players without ratings. Label the timestamp Last updated.
- Use SvelteKit 3 `src/env.ts` and `$app/env/private` for the server-only `RATINGS_API_URL`. Never fall back silently to fictional FIDE ratings when the API fails.
- Run `node --test tests/*.test.ts` for ranking and query rules.

## Checks and handoff

Use the commands in `README.md`. Run Svelte analysis, type checks, formatting checks, and a production build for frontend changes. Add meaningful tests for parsers and important flows when those features arrive, not tests that merely restate styling.

Inspect the actual browser result on desktop and at mobile widths. Exercise navigation, keyboard focus, empty/error/loading states, and reduced motion. Report what was actually verified and any remaining limits.

At each checkpoint provide the exact preview URL, startup command, routes, sample-data status, and a short click-through checklist. Update the roadmap with completed work and the next review gate. Do not merge or deploy as part of a preview chunk; production release has its own final review.
