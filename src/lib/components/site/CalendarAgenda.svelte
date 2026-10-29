<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { CalendarX, ChevronRight, CircleAlert, Clock, Globe, MapPin } from '@lucide/svelte';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import * as Item from '#lib/components/ui/item/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import EventTag from './EventTag.svelte';
	import EventDialog from './EventDialog.svelte';
	import CalendarMonthRail from './CalendarMonthRail.svelte';
	import { calendarHref, dateLabel, eventSpan, groupByDay, monthLabel } from '#lib/calendar.js';
	import { eventTime } from '#lib/event-presentation.js';
	import type {
		CalendarListing,
		CalendarQuery,
		CalendarType,
		CalendarView
	} from '#lib/calendar.js';
	import type { CalendarEvent } from '#lib/types/event.js';
	let {
		calendar,
		onlineState,
		now
	}: { calendar: CalendarListing; onlineState: 'ready' | 'stale' | 'error'; now: number } =
		$props();
	const query = $derived(calendar.query);
	const types: { value: CalendarType; label: string }[] = [
		{ value: 'all', label: 'All events' },
		{ value: 'otb', label: 'Over the board' },
		{ value: 'online', label: 'Online' }
	];
	function navigate(changes: Partial<CalendarQuery>) {
		void goto(calendarHref(query, changes), { reset: false });
	}
	/** The card's own time: "19:40–21:00 · 1h 20m", or a multi-day range. The day node shows the date. */
	function timing(event: CalendarEvent) {
		if (event.startsAt) {
			const start = eventTime.format(new Date(event.startsAt));
			const end = event.endsAt ? `–${eventTime.format(new Date(event.endsAt))}` : '';
			return [`${start}${end}`, duration(event)].filter(Boolean).join(' · ');
		}
		return duration(event) ? `${dateLabel(event)} · ${duration(event)}` : '';
	}
	function duration(event: CalendarEvent) {
		if (event.startsAt && event.endsAt) {
			const minutes = Math.round((Date.parse(event.endsAt) - Date.parse(event.startsAt)) / 60_000);
			const hours = Math.floor(minutes / 60);
			return [hours && `${hours}h`, minutes % 60 && `${minutes % 60}m`].filter(Boolean).join(' ');
		}
		if ('start' in event.date && event.date.end && event.date.end !== event.date.start) {
			const days = (Date.parse(event.date.end) - Date.parse(event.date.start)) / 86_400_000 + 1;
			return `${days} days`;
		}
		return '';
	}
	const live = (event: CalendarEvent) =>
		Boolean(event.startsAt) && eventSpan(event).start <= now && now < eventSpan(event).end;
	/** The red marker: every event in progress, otherwise the next one. */
	const highlighted = $derived.by(() => {
		if (query.view === 'past') return new Set<string>();
		const events = calendar.groups.flatMap((group) => group.events);
		const ongoing = events.filter(live).map((event) => event.id);
		return new Set(ongoing.length ? ongoing : events.slice(0, 1).map((event) => event.id));
	});
	const eventDays = $derived(
		new Set(
			calendar.groups.flatMap((group) =>
				group.events.flatMap((event) => ('start' in event.date ? [event.date.start] : []))
			)
		)
	);
	function place(event: CalendarEvent) {
		if (event.location.kind === 'online') return event.location.platform ?? 'Online';
		return (
			[event.location.venue, event.location.city].filter(Boolean).join(', ') ||
			'Venue to be announced'
		);
	}
	const tone = (event: CalendarEvent) =>
		event.source === 'club' ? 'club' : event.location.kind === 'otb' ? 'otb' : 'online';
	const plural = (count: number) => `${count} ${count === 1 ? 'event' : 'events'}`;
</script>

{#snippet content(event: CalendarEvent)}
	<Item.Content class="min-w-0 gap-1.5">
		<EventTag {event} linked={false} />
		<Item.Title class="text-base leading-snug font-semibold [overflow-wrap:anywhere]"
			>{event.name}{#if live(event)}<span class="sr-only">, in progress</span>{/if}</Item.Title
		>
		<Item.Description class="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
			{#if timing(event)}<span
					class="tone-ink inline-flex items-center gap-1.5 font-medium tabular-nums"
					><Clock class="size-3.5" aria-hidden="true" />{timing(event)}</span
				>{/if}
			<span class="inline-flex items-center gap-1.5"
				>{#if event.location.kind === 'online'}<Globe
						class="size-3.5"
						aria-hidden="true"
					/>{:else}<MapPin class="size-3.5" aria-hidden="true" />{/if}{place(event)}</span
			>
			{#if event.format || event.timeControl}<span
					>{[event.format, event.timeControl].filter(Boolean).join(' · ')}</span
				>{/if}
		</Item.Description>
	</Item.Content>
	<Item.Actions class="hidden sm:flex"
		><ChevronRight class="size-4 text-muted-foreground" aria-hidden="true" /></Item.Actions
	>
{/snippet}

{#snippet card(event: CalendarEvent)}
	<Dialog.Root>
		<Dialog.Trigger>
			{#snippet child({ props: trigger })}
				<Item.Root
					{...trigger}
					variant="outline"
					class="event-tone w-full p-3 text-left sm:p-4"
					data-tone={tone(event)}
					data-expected={event.expected || undefined}
					data-live={live(event) || undefined}
					data-next={highlighted.has(event.id) || undefined}
				>
					{#snippet child({ props })}
						<button type="button" {...props}>{@render content(event)}</button>
					{/snippet}
				</Item.Root>
			{/snippet}
		</Dialog.Trigger>
		<EventDialog {event} now={null} />
	</Dialog.Root>
{/snippet}

<Tabs.Root
	value={query.view}
	onValueChange={(value) => navigate({ view: value as CalendarView, month: '' })}
>
	<div class="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
		<Tabs.List aria-label="Events" class="h-11 w-full sm:w-auto">
			<Tabs.Trigger value="upcoming" class="px-4 sm:min-w-28">Upcoming</Tabs.Trigger>
			<Tabs.Trigger value="past" class="px-4 sm:min-w-28">Past</Tabs.Trigger>
		</Tabs.List>
		<div class="grid gap-2 sm:grid-cols-2 lg:flex">
			<Select.Root
				type="single"
				value={query.month || 'any'}
				onValueChange={(value) => navigate({ month: value === 'any' ? '' : value })}
			>
				<Select.Trigger aria-label="Month" class="h-11 w-full lg:w-40"
					>{query.month ? monthLabel(query.month) : 'All months'}</Select.Trigger
				>
				<Select.Content>
					<Select.Item value="any" label="All months" />
					{#each calendar.months as month (month)}<Select.Item
							value={month}
							label={monthLabel(month)}
						/>{/each}
				</Select.Content>
			</Select.Root>
			<Select.Root
				type="single"
				value={query.type}
				onValueChange={(value) => navigate({ type: value as CalendarType, month: '' })}
			>
				<Select.Trigger aria-label="Event type" class="h-11 w-full lg:w-40"
					>{types.find((type) => type.value === query.type)?.label}</Select.Trigger
				>
				<Select.Content>
					{#each types as type (type.value)}<Select.Item
							value={type.value}
							label={type.label}
						/>{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
	{#each ['upcoming', 'past'] as view (view)}
		<Tabs.Content value={view} class="m-0" aria-busy={Boolean(navigating.to)}>
			{#if view === query.view}
				{#if onlineState !== 'ready'}
					<Alert.Root class="mb-6"
						><CircleAlert class="size-4" /><Alert.Title
							>{onlineState === 'error'
								? 'Club tournaments are unavailable'
								: 'Club tournaments may be out of date'}</Alert.Title
						><Alert.Description>They will return after the next update.</Alert.Description
						></Alert.Root
					>
				{/if}
				<div
					class={[
						calendar.groups.length > 0 && 'lg:grid lg:grid-cols-[7rem_minmax(0,1fr)] lg:gap-8'
					]}
				>
					{#if calendar.groups.length}<CalendarMonthRail
							months={calendar.groups.map((group) => group.month)}
							{eventDays}
							{now}
						/>{/if}
					<div class="min-w-0">
						{#each calendar.groups as group (group.month)}
							{@const [monthName, year] = monthLabel(group.month).split(' ')}
							<section
								id={`month-${group.month}`}
								aria-labelledby={`month-title-${group.month}`}
								class="mb-12 scroll-mt-6"
							>
								<div class="mb-6 flex items-center gap-3">
									<h2
										id={`month-title-${group.month}`}
										class="flex items-baseline gap-2 text-2xl font-semibold tracking-tight"
									>
										{monthName}<span class="text-base font-medium text-muted-foreground"
											>{year}</span
										>
									</h2>
									<span class="h-px flex-1 bg-gradient-to-r from-title-blue/40 to-transparent"
									></span>
									<span
										class="rounded-full bg-title-blue/10 px-2.5 py-0.5 text-xs font-medium text-title-blue"
										>{plural(group.events.length)}</span
									>
								</div>
								<ol
									class="relative ml-2 space-y-8 border-l-2 border-dashed border-title-blue/20 pl-6 [--indent:1.5rem] sm:pl-9 sm:[--indent:2.25rem]"
								>
									{#each groupByDay(group.events) as day (day.key)}
										{@const marked = day.hours.some((hour) =>
											hour.events.some((event) => highlighted.has(event.id))
										)}
										{@const expected = day.hours.every((hour) =>
											hour.events.every((event) => event.expected)
										)}
										{@const [weekday, ...rest] = day.label.split(', ')}
										<li class="relative scroll-mt-6" data-day={day.key}>
											<span
												class={[
													'absolute top-0.5 left-[calc(-1*var(--indent)-0.5625rem)] grid size-4 place-items-center rounded-full border-2 bg-background',
													marked
														? 'border-destructive'
														: expected
															? 'border-dashed border-title-blue/50'
															: 'border-title-blue'
												]}
												aria-hidden="true"
												><span
													class={[
														'size-1.5 rounded-full',
														marked
															? 'bg-destructive'
															: expected
																? 'bg-transparent'
																: 'bg-title-blue'
													]}
												></span></span
											>
											<h3 class="mb-4 flex items-baseline gap-2">
												{#if rest.length}<span
														class="text-[11px] font-semibold tracking-[0.12em] text-title-blue uppercase"
														>{weekday}</span
													><span class="text-lg font-semibold tracking-tight tabular-nums"
														>{rest.join(', ').replace(/ \d{4}$/, '')}</span
													>{:else}<span class="text-sm font-medium text-muted-foreground italic"
														>{day.label}</span
													>{/if}
											</h3>
											<div class="space-y-5">
												{#each day.hours as hour (hour.hour ?? 'untimed')}
													<div>
														{#if hour.hour}<p
																class="mb-2.5 inline-flex rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-semibold text-background tabular-nums"
															>
																{hour.hour}
															</p>{/if}
														<Item.Group class="gap-2.5">
															{#each hour.events as event (event.id)}
																{@render card(event)}
															{/each}
														</Item.Group>
													</div>
												{/each}
											</div>
										</li>
									{/each}
								</ol>
							</section>
						{:else}
							<Empty.Root class="min-h-80 rounded-xl border bg-card px-6">
								<Empty.Header>
									<Empty.Media variant="icon"><CalendarX aria-hidden="true" /></Empty.Media>
									<Empty.Title
										><h2>
											{query.view === 'past' ? 'No past events' : 'No upcoming events'}
										</h2></Empty.Title
									>
									<Empty.Description>Try another month or event type.</Empty.Description>
								</Empty.Header>
								{#if query.month || query.type !== 'all'}<Empty.Content
										><Button
											href={calendarHref(query, { month: '', type: 'all' })}
											variant="outline"
											class="min-h-11">Clear filters</Button
										></Empty.Content
									>{/if}
							</Empty.Root>
						{/each}
					</div>
				</div>
			{/if}
		</Tabs.Content>
	{/each}
</Tabs.Root>
