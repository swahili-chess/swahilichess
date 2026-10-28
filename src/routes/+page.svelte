<script lang="ts">
	import type { PageProps } from './$types';
	import { Button } from '#lib/components/ui/button/index.js';
	import HomeHero from '#lib/components/site/HomeHero.svelte';
	import RankingSummary from '#lib/components/site/RankingSummary.svelte';
	import TournamentSummary from '#lib/components/site/TournamentSummary.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>chess.tz · Chess in Tanzania</title>
	<meta
		name="description"
		content="A community for everyone who loves chess in Tanzania. Find tournaments, follow player rankings, and join the conversation."
	/>
	<!-- Keep this fixture-backed checkpoint out of search indexes. -->
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Button href="#home" class="skip-link">Skip to content</Button>
<main id="main-content" tabindex="-1" class="outline-none">
	<HomeHero />
	<div class="site-container py-12 sm:py-16">
		<div class="grid items-start gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
			<RankingSummary
				players={data.players}
				sample={data.playersSample}
				unavailable={data.playersState === 'error'}
			/>
			<TournamentSummary tournaments={data.tournaments} sample={data.sample} />
		</div>
	</div>
</main>
<SiteFooter />
