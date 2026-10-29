<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import EventTag from './EventTag.svelte';
	import EventFacts from './EventFacts.svelte';
	import EventCosts from './EventCosts.svelte';
	import EventPrizes from './EventPrizes.svelte';
	import { eventSpan } from '#lib/calendar.js';
	import { prizeTotal } from '#lib/event-presentation.js';
	import type { CalendarEvent } from '#lib/types/event.js';
	let {
		event,
		now = null,
		sample = false
	}: { event: CalendarEvent; now?: number | null; sample?: boolean } = $props();
	const hasPrizes = $derived(prizeTotal(event) > 0);
	const url = $derived(
		event.location.kind === 'online' ? event.location.url : event.location.registrationUrl
	);
	const actionable = $derived(Boolean(url && !sample && !event.status));
	/** The dialog renders when opened, so the current time is fresh enough here. */
	const ended = $derived(eventSpan(event).end < (now ?? Date.now()));
	const platform = $derived(
		event.location.kind === 'online' ? (event.location.platform ?? 'the tournament site') : ''
	);
	const action = $derived(
		event.location.kind !== 'online'
			? 'Register'
			: event.expected
				? `View club on ${platform}`
				: ended
					? `View on ${platform}`
					: `Join on ${platform}`
	);
</script>

{#snippet details()}
	<div class="space-y-5"><EventFacts {event} {now} expanded /><EventCosts {event} /></div>
{/snippet}
<Dialog.Content
	aria-describedby={undefined}
	class="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
>
	<Dialog.Header class="shrink-0 gap-3 border-b p-5 pr-12 text-left sm:p-6 sm:pr-14">
		<div><EventTag {event} {sample} /></div>
		<Dialog.Title class="text-xl leading-snug font-semibold tracking-tight [overflow-wrap:anywhere]"
			>{event.name}</Dialog.Title
		>
	</Dialog.Header>
	<div class="min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6">
		{#if hasPrizes}
			<Tabs.Root value="details">
				<Tabs.List class="mb-5 w-full" aria-label="Event information"
					><Tabs.Trigger value="details" class="flex-1">Details</Tabs.Trigger><Tabs.Trigger
						value="prizes"
						class="flex-1">Prize pool</Tabs.Trigger
					></Tabs.List
				>
				<Tabs.Content value="details" class="min-h-72">{@render details()}</Tabs.Content>
				<Tabs.Content value="prizes" class="min-h-72"><EventPrizes {event} /></Tabs.Content>
			</Tabs.Root>
		{:else}{@render details()}{/if}
	</div>
	{#if actionable || sample}
		<Dialog.Footer class="m-0 shrink-0 rounded-none border-t bg-muted/20 p-4 sm:p-5">
			{#if actionable}<Button
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					class="min-h-11 w-full whitespace-normal"
					>{action}<ArrowUpRight class="size-4" aria-hidden="true" /></Button
				>
			{:else}<Button disabled class="min-h-11 w-full whitespace-normal"
					>{event.location.kind === 'online'
						? 'Tournament link unavailable'
						: 'Registration unavailable'}</Button
				>{/if}
		</Dialog.Footer>
	{/if}
</Dialog.Content>
