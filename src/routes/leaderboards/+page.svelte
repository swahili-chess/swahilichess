<script lang="ts">
	import type { PageProps } from './$types';
	import { Button } from '#lib/components/ui/button/index.js';
	import SiteHeader from '#lib/components/site/SiteHeader.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	import Leaderboard from '#lib/components/site/Leaderboard.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>Leaderboards · chess.tz</title><meta
		name="description"
		content="Tanzanian chess player rankings on Lichess, Chess.com, and FIDE."
	/><meta name="robots" content="noindex, nofollow" /></svelte:head
>
<Button href="#main-content" class="skip-link">Skip to content</Button>
<div class="flex min-h-dvh flex-col">
	<SiteHeader currentPage="leaderboards" />
	<main id="main-content" tabindex="-1" class="site-container flex-1 py-10 outline-none sm:py-14">
		<div class="mb-8">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Leaderboards</h1>
			<p class="mt-3 text-sm text-muted-foreground sm:text-base">
				Tanzanian players, ranked by rating.
			</p>
		</div>
		<Leaderboard
			board={data.board}
			state={data.state}
			snapshotAt={data.snapshotAt}
			ratingMonth={data.ratingMonth}
		/>
	</main>
	<SiteFooter />
</div>
