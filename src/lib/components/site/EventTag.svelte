<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { Tournament } from '#lib/types/home.js';
	let { event, sample = false }: { event: Tournament; sample?: boolean } = $props();
</script>

{#if event.location.kind === 'otb'}
	<Badge
		variant="outline"
		class="h-6 max-w-full rounded-md border-border/80 px-2 text-[10px] tracking-wide whitespace-normal"
		>OTB · {event.location.fideRated ? 'FIDE RATED' : 'UNRATED'}</Badge
	>
{:else}
	<Badge
		variant="outline"
		class="relative h-6 overflow-visible rounded-md border-border/80 px-2 text-xs after:absolute after:inset-x-0 after:-inset-y-2"
		href={!sample && event.location.tournamentUrl
			? event.location.tournamentUrl
			: event.location.platform === 'Lichess'
				? 'https://lichess.org/'
				: 'https://www.chess.com/'}
		target="_blank"
		rel="noopener noreferrer"
	>
		{event.location.platform}<ArrowUpRight aria-hidden="true" />
	</Badge>
{/if}
