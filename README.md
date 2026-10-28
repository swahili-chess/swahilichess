# chess.tz

The public website for Tanzania's chess community. The `website-v2` branch is being rebuilt in small browser-review checkpoints with SvelteKit, Svelte 5, TypeScript, and shadcn-svelte.

## Run the foundation preview

Use Node.js 24 or later and pnpm 12.3.4 (pinned in `package.json`). Run these commands from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://127.0.0.1:5174/preview>. Port 5174 is fixed; the command fails if another process is already using it. No environment variables, backend, database, or CMS are needed for this checkpoint.

The preview contains fictional players, ratings, and an event. It demonstrates the theme, mobile menu, rating tabs, search, dialog, and loading/empty/error states. Blog, Shop, TACA, registration, and the full leaderboard are deliberately unavailable. The WhatsApp link is preserved from the original website and still needs community confirmation.

In development, `/` redirects to `/preview`. In production, `/preview` returns 404 and `/` is a temporary holding page. This branch is not ready to deploy.

## Check changes

```sh
pnpm check
pnpm format:check
pnpm build
pnpm exec svelte-mcp svelte-autofixer src/routes/preview/+page.svelte --svelte-version 5.57.3
```

Run the autofixer for every changed Svelte component. Use `pnpm format` to format source and documentation. Follow the [browser review checklist](docs/foundation-review.md) before handing off a checkpoint.

Stop the dev server before bulk formatting, config changes, or production builds, then restart it afterward. This avoids stale module state during the current toolchain's hot reload.

To inspect the production build locally:

```sh
HOST=127.0.0.1 PORT=4174 ORIGIN=http://127.0.0.1:4174 pnpm start
```

The build uses `@sveltejs/adapter-node`. The existing main-branch workflow now uses pnpm and requires Node.js 24+ and pnpm 12.3.4 on the server. Its Nginx hosting setup still needs migration for the Node adapter; deployment is a separate roadmap chunk.

## Add UI components

All reusable UI must compose shadcn-svelte. Stop the dev server, then run:

```sh
pnpm ui:add button card
```

The wrapper temporarily resolves SvelteKit 3's `$app/tsconfig` alias for shadcn-svelte 1.7.1's config reader and restores the original file afterward. Theme tokens live in `src/routes/layout.css`; site compositions live in `src/lib/components/site`.

## Continue the project

Read [AGENTS.md](AGENTS.md) for required skills and conventions, and the [roadmap](docs/website-v2-roadmap.md) for scope and review gates. The sibling Go API will own ratings collection. A separate Payload service is planned for the CMS checkpoint. Neither service is changed by the foundation preview.

Styling references and licenses are recorded in [third-party notices](docs/third-party-notices.md).
