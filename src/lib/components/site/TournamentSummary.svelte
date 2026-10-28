<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import EventCard from './EventCard.svelte';
	import type { Tournament } from '#lib/types/home.js';
	let { tournaments, sample = false }: { tournaments: Tournament[]; sample?: boolean } = $props();
	const upcoming = $derived(
		tournaments.toSorted((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt)).slice(0, 2)
	);
</script>

<section id="calendar" aria-labelledby="home-events-title" class="min-w-0">
	<h2 id="home-events-title" class="section-title mb-5">Upcoming tournaments</h2>
	<div class="grid gap-4">
		{#each upcoming as event (event.id)}<EventCard {event} {sample} />
		{:else}<Card.Root
				><Card.Content class="py-5 text-sm text-muted-foreground"
					>No tournaments scheduled.</Card.Content
				></Card.Root
			>{/each}
	</div>
</section>
