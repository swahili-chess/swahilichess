<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import EventTag from './EventTag.svelte';
	import EventFacts from './EventFacts.svelte';
	import EventCosts from './EventCosts.svelte';
	import EventDialog from './EventDialog.svelte';
	import EventDateBadge from './EventDateBadge.svelte';
	import { prizeTotal } from '#lib/event-presentation.js';
	import type { CalendarEvent } from '#lib/types/event.js';
	let { event, sample = false }: { event: CalendarEvent; sample?: boolean } = $props();
	const hasCosts = $derived(prizeTotal(event) > 0 || event.entryFee != null);
</script>

<Dialog.Root>
	<Card.Root class="h-full gap-0 py-0">
		<Card.Header class="flex flex-row items-start gap-4 p-5">
			<EventDateBadge {event} />
			<div class="min-w-0 flex-1 space-y-2">
				<EventTag {event} {sample} />
				<h3 class="text-base leading-snug font-semibold tracking-tight [overflow-wrap:anywhere]">
					{event.name}
				</h3>
			</div>
		</Card.Header>
		<Card.Content class="flex flex-1 flex-col gap-4 px-5 pb-5"
			><EventFacts {event} />
			{#if hasCosts}<div class="mt-auto"><EventCosts {event} /></div>{/if}</Card.Content
		>
		<Card.Footer class="border-t bg-muted/15 px-3 py-1.5">
			<Dialog.Trigger
				>{#snippet child({ props })}<Button
						{...props}
						variant="ghost"
						class="min-h-11 w-full justify-between px-2"
						aria-label={`View ${event.name}`}
						>View event<ArrowRight class="size-4" aria-hidden="true" /></Button
					>{/snippet}</Dialog.Trigger
			>
		</Card.Footer>
	</Card.Root>
	<EventDialog {event} {sample} />
</Dialog.Root>
