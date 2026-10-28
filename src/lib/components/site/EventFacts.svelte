<script lang="ts">
	import { CalendarDays, Clock, Timer, MapPin, Building2 } from '@lucide/svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { eventCountdown } from '#lib/event-countdown.js';
	import { eventDate, eventTime } from '#lib/event-presentation.js';
	import type { Tournament } from '#lib/types/home.js';
	let {
		event,
		now,
		expanded = false
	}: { event: Tournament; now: number | null; expanded?: boolean } = $props();
	const remaining = $derived(eventCountdown(event.startsAt, now));
	const rows = $derived([
		...(expanded
			? [{ label: 'Date', icon: CalendarDays, value: eventDate.format(new Date(event.startsAt)) }]
			: []),
		{ label: 'Time control', icon: Timer, value: `${event.format} · ${event.timeControl}` },
		{ label: 'Starts', icon: Clock, value: `${eventTime.format(new Date(event.startsAt))} EAT` },
		...(event.location.kind === 'otb'
			? [
					{ label: 'Location', icon: MapPin, value: event.location.city },
					...(expanded ? [{ label: 'Venue', icon: Building2, value: event.location.venue }] : [])
				]
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
