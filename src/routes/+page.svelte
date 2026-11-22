<script lang="ts">
	import PageMeta from '#lib/components/site/PageMeta.svelte';
	import type { PageProps } from './$types';
	import { Button } from '#lib/components/ui/button/index.js';
	import HomeHero from '#lib/components/site/HomeHero.svelte';
	import RankingSummary from '#lib/components/site/RankingSummary.svelte';
	import TournamentSummary from '#lib/components/site/TournamentSummary.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	let { data }: PageProps = $props();
</script>

<PageMeta
	title="chess.tz · Chess in Tanzania"
	description="A community for everyone who loves chess in Tanzania. Find tournaments, check player rankings and join us on WhatsApp."
	path="/"
/>

<Button href="#home" class="skip-link">Skip to content</Button>
<main id="main-content" tabindex="-1" class="outline-none">
	<HomeHero />
	<div class="site-container py-12 sm:py-16">
		<div class="grid items-start gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
			<RankingSummary players={data.players} unavailable={data.playersState === 'error'} />
			<TournamentSummary events={data.events} />
		</div>
	</div>
</main>
<SiteFooter />
