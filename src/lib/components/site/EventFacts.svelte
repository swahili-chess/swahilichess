<script lang="ts">
	import { onMount } from 'svelte';
	import { CalendarDays, Clock, Timer, MapPin, Building2, Users, Globe } from '@lucide/svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { dateLabel } from '#lib/calendar.js';
	import { eventCountdown } from '#lib/event-countdown.js';
	import { eventTime } from '#lib/event-presentation.js';
	import type { CalendarEvent } from '#lib/types/event.js';
	let {
		event,
		now = null,
		expanded = false
	}: { event: CalendarEvent; now?: number | null; expanded?: boolean } = $props();
	/** A live clock while these facts are on screen, so the countdown ticks every second. */
	let tick = $state<number | null>(null);
	onMount(() => {
		if (!event.startsAt) return;
		tick = Date.now();
		const interval = window.setInterval(() => (tick = Date.now()), 1_000);
		return () => window.clearInterval(interval);
	});
	const remaining = $derived(event.startsAt ? eventCountdown(event.startsAt, tick ?? now) : null);
	const announced = 'To be announced';
	const rows = $derived([
		...(expanded || !('start' in event.date)
			? [{ label: 'Date', icon: CalendarDays, value: dateLabel(event) }]
			: []),
		...(event.format || event.timeControl
			? [
					{
						label: 'Time control',
						icon: Timer,
						value: [event.format, event.timeControl].filter(Boolean).join(' · ')
					}
				]
			: []),
		...(event.startsAt
			? [
					{
						label: 'Starts',
						icon: Clock,
						value: `${eventTime.format(new Date(event.startsAt))} EAT`
					}
				]
			: []),
		...(event.location.kind === 'otb'
			? [
					{ label: 'Location', icon: MapPin, value: event.location.city ?? announced },
					...(expanded || !event.location.city
						? [{ label: 'Venue', icon: Building2, value: event.location.venue ?? announced }]
						: [])
				]
			: []),
		...(expanded && event.location.kind === 'online'
			? [{ label: 'Where', icon: Globe, value: event.location.platform ?? 'Online' }]
			: []),
		...(event.clubs?.length
			? [{ label: 'Club', icon: Users, value: event.clubs.map((club) => club.name).join(', ') }]
			: [])
	]);
</script>

<Card.Content class="p-0">
	<dl class="space-y-3 text-sm">
		{#each rows as row (row.label)}
			{@const Icon = row.icon}
			<div class="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4">
				<dt class="inline-flex items-center gap-2 leading-5 text-muted-foreground">
					<Icon class="size-3.5 shrink-0" aria-hidden="true" />{row.label}
				</dt>
				<dd class="min-w-0 text-right leading-5 [overflow-wrap:anywhere]">
					{#if row.label === 'Starts'}
						<div class="flex flex-wrap items-center justify-end gap-2">
							<time datetime={event.startsAt} class="tabular-nums">{row.value}</time
							>{#if remaining}<Badge
									variant="secondary"
									class="h-5 rounded-md text-[10px] tabular-nums">Starts in {remaining}</Badge
								>{/if}
						</div>
					{:else}{row.value}{/if}
				</dd>
			</div>
		{/each}
	</dl>
</Card.Content>
