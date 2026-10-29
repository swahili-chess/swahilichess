<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import EventCard from './EventCard.svelte';
	import type { CalendarEvent } from '#lib/types/event.js';
	let { events }: { events: CalendarEvent[] } = $props();
</script>

<section id="calendar" aria-labelledby="home-events-title" class="min-w-0">
	<div class="mb-5 flex items-center justify-between gap-3">
		<h2 id="home-events-title" class="section-title">Upcoming tournaments</h2>
		<Button href="/calendar" variant="ghost" size="sm" class="min-h-11"
			>Calendar<ArrowRight class="size-4" aria-hidden="true" /></Button
		>
	</div>
	<div class="grid gap-4">
		{#each events as event (event.id)}<EventCard {event} />
		{:else}<Card.Root
				><Card.Content class="py-5 text-sm text-muted-foreground"
					>No tournaments scheduled.</Card.Content
				></Card.Root
			>{/each}
	</div>
</section>
