# Foundation review

This is roadmap chunk 1. Review the visual language and reusable UI before building the homepage and feature pages.

## Design contract

The screen should make Tanzanian chess feel welcoming and organized. Use a quiet neutral canvas, fine borders, Inter typography, aligned ratings, and Medusa charcoal controls. Medusa's button, color, and elevation source files are the styling references. shadcn-svelte supplies all controls and reusable UI foundations.

Keep the main content within a readable desktop width. On phones, navigation moves into a sheet and the ranking/event layout becomes a single column. The sample table must remain readable at 320px without forcing the whole page sideways. Touch targets should be comfortable even when the visual controls look compact.

The primary site action is joining the WhatsApp community. The development preview's separate review controls let us inspect loaded, loading, empty, and error states. Label fictional rankings and events as sample data. Do not imply they are current results or confirmed tournaments.

Use the latest requested fluted-glass CSS background and Freckle Face hero heading. Avoid unrelated illustrations, animated page entrances, and custom replacements for shadcn controls. The visual sample should establish the direction without implementing the remaining roadmap.

## Browser checklist

1. Open the preview at desktop width and at 320px, 390px, and 768px.
2. Review text sizes, table density, borders, shadows, and the yellow hero and black controls.
3. Open the mobile menu, follow a section link, and confirm the menu closes. Reopen it and close it with Escape. Check focus returns to the trigger.
4. Switch sample time controls and inspect the ranking. Try the loading, empty, and error states, then restore sample data.
5. Tab through navigation and controls. Check the skip link and visible focus rings.
6. Inspect the event detail dialog and its close behavior.
7. Enable reduced motion and check that controls remain understandable without movement.

The complete homepage, real ratings, full calendar, CMS, blog, shop, and TACA pages are later review chunks.

## Verification record — 28 October 2026

- `pnpm check`: zero errors and zero warnings. Formatting, production build, and `git diff --check` passed.
- Svelte autofixer reported no issues in the site compositions, pages, and edited UI components. Its generic `bind:this` suggestions in the generated Button were reviewed; the upstream bindable ref API was retained.
- Browser checks covered 320px, 390px, 768px, 1024px, and 1440px widths without page overflow. The ranking table and event dialog fit at 320px; mobile tabs and menu/event triggers have 44px minimum heights.
- Verified all three rating tabs, search and no-match recovery, loading/empty/error states, retry, save/reset feedback, mobile section navigation, menu/dialog closing, Escape focus return, and the keyboard skip link.
- A clean browser session had no console warnings or errors. Production HTTP checks returned 200 for `/` and 404 for `/preview`.
- Reduced-motion CSS disables animations/transitions and press scaling. OS-level reduced-motion behavior and a physical phone have not yet been tested.

Two tooling notes remain: bulk formatting/config changes caused temporary Vite hot-reload errors during development; restarting `pnpm dev` restored a clean preview. Stop the dev server before bulk formatting or build/config work. The earlier npm audit reported seven low-severity entries tracing to one `deepmerge` prototype-poisoning advisory through the Vite/Svelte tooling graph ([GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)); its suggested fixes downgrade framework packages, so no forced downgrade was applied. Recheck before release.

## First review revision

Applied the user's requested `#00A3DD` primary color, restored the original Tanzania pawn image, and shortened the copy. The hero introduces the community; the sections explain what is available. Removed decorative slogans, repeated sample notices, and redundant descriptions. Kept the preview banner and fixture badges so the fictional data stays clear. Dark text on blue buttons preserves contrast.

Revision checks passed: Svelte autofixer on all four edited components, type checking, formatting, and production build. Browser checks confirmed the original image loads, the primary button background is exactly RGB 0/163/221, the text contrast is 4.81:1, and there is no horizontal overflow at 320px, 768px, 1024px, or 1440px. The event link/dialog and Escape focus return work; the browser reported no console errors or warnings.

## Second review revision

Restored Medusa charcoal controls. The hero now explores a solid yellow panel with larger black type and the user-supplied transparent pawn in a 1:1 image area. This replaces the blue-primary version and the grey image background. The yellow direction remains open for visual review.

## Hero composition revision

The initial yellow card did not reflect the supplied references closely enough. Reworked it around the Marc reference: a charcoal frame, yellow panel, integrated outlined navigation, oversized headline, prominent transparent pawn, and supporting copy/actions below a dividing line. The pawn retains a square display area. The hero remains a brief introduction; the rest of the site explains the community's offerings.

Svelte autofixer found no issues in the two edited components. Type checking returned zero errors and warnings, and the production build passed. Browser checks covered 320px, 768px, 1024px, and 1440px without horizontal overflow. Mobile section navigation closes the menu, Escape restores trigger focus, and the skip link focuses the hero. Browser logs contained no warnings or errors. Visual acceptance is still pending; remain in chunk 1.

## Centered hero revision

Removed the black presentation frame: yellow now fills the hero edge to edge. Navigation uses an 8px radius consistent with the other controls. Centered the heading and pawn, placing “Chess in” behind the pawn and “Tanzania” in front while retaining one accessible heading. Applied CSS saturation, contrast, and brightness filters to the original transparent asset. The layered composition remains on mobile.

## Pawn and Kablammo revision

Replaced the pawn with the supplied higher-resolution Tanzania Flag Chess Pawn PNG, tilted it 15 degrees clockwise, and reduced the colour filters to suit the richer source image. The hero heading now uses self-hosted Kablammo with 0.065em letter spacing. Inter remains the interface font. This remains a visual experiment in chunk 1.

## Freckle Face and glass revision

Removed the pawn and its layered heading treatment. The hero now uses centered Freckle Face with the existing wider letter spacing. A static CSS background combines vertical fluted-glass ribs with curved yellow/gold highlights, following the supplied reference while retaining the yellow palette. Navigation, copy, and controls remain above the texture. Kablammo is no longer a dependency.

## Full-viewport Londrina Shadow revision

Switched the hero heading to Londrina Shadow and removed the design-preview strip at the user's request. The yellow glass hero now fills at least the viewport height, with navigation at the top, a centered heading, and copy/actions at the bottom. Short screens may scroll to keep content readable. Fictional rankings and events retain their sample badges.

## Tanzania blue revision

Increased the Londrina Shadow heading size and changed the full-viewport glass hero to Tanzania blue `#00A3DD`. Highlights and rib overlays only lighten the base colour, retaining contrast with black text and charcoal controls. The earlier yellow treatment is superseded.

## Hero controls revision

Hero hover and expanded states now use translucent dark surfaces, with dark focus rings. The mobile trigger is a shadcn ghost Button with two unequal strokes and a 44px target; the shadcn Sheet uses pale blue instead of white. The hero wordmark uses the same dark colour for “chess” and “.tz”. Controls outside the hero keep the neutral theme.

## Community headline revision

Applied the supplied headline, “Chess brings us together.”, and subtitle, “A community for everyone who loves the game in Tanzania.” The subtitle sits directly under the centered heading, and actions remain below the divider, including on mobile.

The subtitle-under-heading layout applies only below 768px. Desktop retains the subtitle at the bottom left and actions at the bottom right, beneath the divider.

## Mobile subtitle placement revision

Moved the subtitle back below the divider on mobile, above the actions. It now uses the full available content width with normal line wrapping, rather than a narrow or balanced text block. Desktop retains subtitle left and actions right.

## Hero motion and centered actions

Centered the action group on mobile, where the subtitle and divider are hidden. Desktop retains the subtitle at left and actions at the far right. Added a CSS starting-style entrance: heading and footer fade/rise over 240ms with an 8px offset, 60ms stagger, and the existing ease-out curve. Precise-pointer arrow hover moves 2px over 160ms. Reduced motion uses a 140ms fade with no movement; keyboard focus cancels decorative transitions. The background remains static.

## Animated hero revision

Replaced the brief whole-heading fade with three masked lines that rise into place over 900ms, staggered by 80ms. The footer follows over 600ms. Split the glass texture, light gradient, and lower-left arc into independently animated CSS layers using transform and opacity. Their 22s, 18s, and 14s alternate loops start at different phases. A shadcn pause/resume control freezes the background in place; ambient motion also pauses when the hero leaves view or the tab is hidden. Reduced motion keeps the background static and uses a 140ms text fade. Desktop actions remain far right; mobile actions remain centered without the subtitle or divider.

The glass revision keeps the flutes upright and moves a soft light band and finer refracted highlights left to right over 32s, then back over 32s. The ripple was slowed to one quarter of its original speed after review. Mobile uses a larger arc with 40% overscan and translation/scale instead of rotation to keep its painted bounds outside the viewport. Pause and reduced-motion rules include the new ripple layers.

## Broad gradient motion clarification

The intended ripple is the original broad light/dark gradient moving across the hero. Removed the added narrow ripple and refraction bands. The original-style highlight now travels from upper right to upper left and back over 32s each way, behind stationary upright glass lines. The blue base remains unchanged; the enlarged mobile arc, entrance, pause, and reduced-motion behavior remain.

## pnpm migration

The website now pins pnpm 12.3.4 and uses `pnpm-lock.yaml`. Imported application dependency versions match the previous npm lockfile. Setup commands, the shadcn wrapper, contributor instructions, and deployment install/build commands now use pnpm. The deployment host must have Node.js 24+ and pnpm 12.3.4; the separate Node-adapter hosting migration is still pending.

pnpm reports an existing peer mismatch: `runed@0.35.1`, used through Bits UI, declares optional SvelteKit `^2.21.0` while this project uses Kit 3.1.0. Keep this visible rather than suppressing peer checks; verify again before release.

Verified a fresh `pnpm install --frozen-lockfile --offline`, `pnpm check`, `pnpm format:check`, `pnpm build`, and `pnpm ui:add --help`. The wrapper restores the original TypeScript config. No dependency build-script exceptions were needed.
