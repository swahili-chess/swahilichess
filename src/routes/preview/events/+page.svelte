<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import EventCard from '#lib/components/site/EventCard.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>Event cards · chess.tz</title><meta
		name="robots"
		content="noindex, nofollow"
	/></svelte:head
>
<main class="site-container py-8 sm:py-12">
	<header class="mb-8 flex items-center justify-between gap-4">
		<h1 class="text-2xl font-semibold tracking-tight">Event cards</h1>
		<Button href="/#calendar" variant="outline"
			><ArrowLeft class="size-4" aria-hidden="true" />Homepage</Button
		>
	</header>
	<h2 class="sr-only">Event scenarios</h2>
	<div class="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
		{#each data.events as event (event.id)}<EventCard {event} sample />{/each}
	</div>
</main>
