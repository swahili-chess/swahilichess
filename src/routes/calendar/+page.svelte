<script lang="ts">
	import type { PageProps } from './$types';
	import { Button } from '#lib/components/ui/button/index.js';
	import SiteHeader from '#lib/components/site/SiteHeader.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	import CalendarAgenda from '#lib/components/site/CalendarAgenda.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>Calendar · chess.tz</title><meta
		name="description"
		content="Chess tournaments and events in Tanzania, over the board and online."
	/><meta name="robots" content="noindex, nofollow" /></svelte:head
>
<Button href="#main-content" class="skip-link">Skip to content</Button>
<div class="flex min-h-dvh flex-col">
	<SiteHeader currentPage="calendar" />
	<main id="main-content" tabindex="-1" class="site-container flex-1 py-10 outline-none sm:py-14">
		<div class="mb-8">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Calendar</h1>
			<p class="mt-3 text-sm text-muted-foreground sm:text-base">
				Tournaments and events, over the board and online. Times are in East Africa Time.
			</p>
		</div>
		<CalendarAgenda calendar={data.calendar} onlineState={data.onlineState} now={data.now} />
	</main>
	<SiteFooter />
</div>
