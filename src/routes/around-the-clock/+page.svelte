<script lang="ts">
	import type { PageProps } from './$types';
	import { CircleAlert, CalendarX } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import SiteHeader from '#lib/components/site/SiteHeader.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	import ClockTimeline from '#lib/components/site/ClockTimeline.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>24/7 chess · chess.tz</title><meta
		name="description"
		content="Lichess tournaments and Tanzanian club tournaments, available around the clock."
	/><meta name="robots" content="noindex, nofollow" /></svelte:head
>
<Button href="#main-content" class="skip-link">Skip to content</Button>
<div class="flex min-h-dvh flex-col">
	<SiteHeader currentPage="around-the-clock" />
	<main id="main-content" tabindex="-1" class="site-container flex-1 py-10 outline-none sm:py-14">
		<div class="mb-8">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">24/7 chess</h1>
			<p class="mt-3 text-sm text-muted-foreground sm:text-base">
				Lichess tournaments and Tanzanian club tournaments, available around the clock. Times are in
				East Africa Time.
			</p>
		</div>
		{#if data.onlineState !== 'ready'}
			<Alert.Root class="mb-6"
				><CircleAlert class="size-4" /><Alert.Title
					>{data.onlineState === 'error'
						? 'Tournaments are unavailable'
						: 'Tournaments may be out of date'}</Alert.Title
				><Alert.Description>They will return after the next update.</Alert.Description></Alert.Root
			>
		{/if}
		{#if data.timeline.lanes.length}
			<ClockTimeline timeline={data.timeline} now={data.now} />
			<p class="mt-3 text-xs text-muted-foreground">
				Lichess lists its tournaments a few hours ahead. Dashed entries are weekly club tournaments
				that are not created yet.
			</p>
		{:else if data.onlineState !== 'error'}
			<Empty.Root class="min-h-80 rounded-xl border bg-card px-6">
				<Empty.Header>
					<Empty.Media variant="icon"><CalendarX aria-hidden="true" /></Empty.Media>
					<Empty.Title><h2>No tournaments in the next few hours</h2></Empty.Title>
					<Empty.Description>See the calendar for events further ahead.</Empty.Description>
				</Empty.Header>
				<Empty.Content
					><Button href="/calendar" variant="outline" class="min-h-11">Calendar</Button
					></Empty.Content
				>
			</Empty.Root>
		{/if}
	</main>
	<SiteFooter />
</div>
