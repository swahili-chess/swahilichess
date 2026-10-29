<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { CalendarEvent } from '#lib/types/event.js';
	let {
		event,
		sample = false,
		linked = true
	}: { event: CalendarEvent; sample?: boolean; linked?: boolean } = $props();
	const platformHome = { Lichess: 'https://lichess.org/', 'Chess.com': 'https://www.chess.com/' };
	const otbLabel = $derived(
		event.location.kind === 'otb' && event.location.fideRated !== undefined
			? `OTB · ${event.location.fideRated ? 'FIDE RATED' : 'UNRATED'}`
			: 'OTB'
	);
</script>

<div class="flex flex-wrap items-center gap-1.5">
	{#if event.location.kind === 'otb'}
		<Badge
			variant="outline"
			class="h-6 max-w-full rounded-md border-border/80 px-2 text-[10px] tracking-wide whitespace-normal"
			>{otbLabel}</Badge
		>
	{:else if event.location.platform && linked}
		<Badge
			variant="outline"
			class="relative h-6 overflow-visible rounded-md border-border/80 px-2 text-xs after:absolute after:inset-x-0 after:-inset-y-2"
			href={!sample && event.location.url
				? event.location.url
				: platformHome[event.location.platform]}
			target="_blank"
			rel="noopener noreferrer"
		>
			{event.location.platform}<ArrowUpRight aria-hidden="true" />
		</Badge>
	{:else}
		<Badge variant="outline" class="h-6 rounded-md border-border/80 px-2 text-xs"
			>{event.location.platform ?? 'Online'}</Badge
		>
	{/if}
	{#if event.expected}
		<Badge variant="secondary" class="h-6 rounded-md px-2 text-[10px] tracking-wide uppercase"
			>Expected</Badge
		>
	{/if}
	{#if event.status}
		<Badge variant="destructive" class="h-6 rounded-md px-2 text-[10px] tracking-wide uppercase"
			>{event.status}</Badge
		>
	{/if}
</div>
