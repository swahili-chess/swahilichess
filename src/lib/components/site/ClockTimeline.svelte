<script lang="ts">
	import { onMount } from 'svelte';
	import { Flame, Rabbit, Shuffle, Users, Zap } from '@lucide/svelte';
	import { timeZone } from '#lib/calendar.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import EventDialog from './EventDialog.svelte';
	import type { Timeline, TimelineLane } from '#lib/clock.js';
	import type { CalendarEvent } from '#lib/types/event.js';
	let { timeline, now: initialNow }: { timeline: Timeline; now: number } = $props();

	const pxPerMinute = 8;
	const minute = 60_000;
	let now = $state(0);
	const current = $derived(now || initialNow);
	onMount(() => {
		now = Date.now();
		const interval = window.setInterval(() => (now = Date.now()), 30_000);
		return () => window.clearInterval(interval);
	});
	const x = (time: number) => ((time - timeline.start) / minute) * pxPerMinute;
	const width = $derived(x(timeline.end));
	const ticks = $derived(
		Array.from(
			{ length: Math.floor((timeline.end - timeline.start) / (10 * minute)) + 1 },
			(_, index) => timeline.start + index * 10 * minute
		)
	);
	const clock = new Intl.DateTimeFormat('en-GB', {
		timeZone,
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
	const lanes: Record<TimelineLane['key'], { icon: typeof Zap; tone: string }> = {
		clubs: { icon: Users, tone: 'club' },
		bullet: { icon: Zap, tone: 'bullet' },
		blitz: { icon: Flame, tone: 'blitz' },
		rapid: { icon: Rabbit, tone: 'rapid' }
	};
	/** Chess960 keeps its own tone in any lane. */
	const tone = (event: CalendarEvent, lane: TimelineLane['key']) =>
		lane !== 'clubs' && event.format?.includes('Chess960') ? 'chess960' : lanes[lane].tone;
	const icon = (event: CalendarEvent, lane: TimelineLane['key']) =>
		tone(event, lane) === 'chess960' ? Shuffle : lanes[lane].icon;
	/** One dialog serves every block; focus returns to the block that opened it. */
	let selected = $state<CalendarEvent | null>(null);
	let opener: HTMLElement | null = null;
	function open(event: CalendarEvent, element: HTMLElement) {
		opener = element;
		selected = event;
	}
	/** Start the view half an hour before now; the window already begins there. */
	function scrollToNow(node: HTMLElement) {
		node.scrollLeft = Math.max(0, x(initialNow) - 120);
	}
</script>

<div
	{@attach scrollToNow}
	class="overflow-x-auto overscroll-x-contain rounded-xl border bg-gradient-to-b from-card to-muted/40"
	role="region"
	aria-label="Tournament timeline"
	tabindex="-1"
>
	<div class="relative pb-5" style:width={`${width}px`}>
		<div class="sticky top-0 z-10 h-11 border-b bg-card/90 backdrop-blur-sm" aria-hidden="true">
			{#each ticks as tick (tick)}
				{@const label = clock.format(tick)}
				{@const hour = label.endsWith(':00')}
				<span
					class={[
						'absolute top-1/2 -translate-y-1/2 text-xs tabular-nums',
						hour
							? '-translate-x-1/2 rounded-full bg-foreground px-2 py-0.5 font-semibold text-background'
							: '-translate-x-1/2 text-muted-foreground'
					]}
					style:left={`${x(tick)}px`}>{hour ? label : label.slice(3)}</span
				>
			{/each}
		</div>
		{#each ticks as tick (tick)}
			{#if clock.format(tick).endsWith(':00')}<span
					class="pointer-events-none absolute top-11 bottom-0 border-l-2 border-dashed border-title-blue/15"
					style:left={`${x(tick)}px`}
					aria-hidden="true"
				></span>{/if}
		{/each}
		<div
			class="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-destructive"
			style:left={`${x(current)}px`}
			aria-hidden="true"
		>
			<span
				class="absolute top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase shadow-sm"
				>Now</span
			>
		</div>
		{#each timeline.lanes as lane (lane.key)}
			{@const LaneIcon = lanes[lane.key].icon}
			<section aria-label={lane.label} class="pt-4">
				<h2
					class="sticky left-0 mb-2 inline-flex items-center gap-2 px-4 text-[11px] font-semibold tracking-[0.12em] text-title-blue uppercase"
				>
					<span
						class="event-tone grid size-6 place-items-center rounded-md border"
						data-tone={lanes[lane.key].tone}
						><LaneIcon class="tone-ink size-3.5" aria-hidden="true" /></span
					>{lane.label}
				</h2>
				{#each lane.rows as row, index (index)}
					<ul class="relative h-[4.25rem]">
						{#each row as item (item.event.id)}
							{@const ended = item.end <= current}
							{@const live = item.start <= current && !ended}
							{@const Icon = icon(item.event, lane.key)}
							{@const blockWidth = Math.max(x(item.end) - x(item.start), 56)}
							<li
								class="absolute top-0 h-16 px-0.5"
								style:left={`${x(item.start)}px`}
								style:width={`${blockWidth}px`}
							>
								<button
									type="button"
									onclick={(event) => open(item.event, event.currentTarget)}
									aria-haspopup="dialog"
									aria-label={`${item.event.name}, ${clock.format(item.start)} to ${clock.format(item.end)} EAT${live ? ', in progress' : ended ? ', finished' : ''}`}
									class="event-tone flex h-full w-full min-w-0 items-center gap-2.5 rounded-lg border px-2.5 text-left focus-visible:outline-2 focus-visible:outline-ring"
									data-tone={tone(item.event, lane.key)}
									data-expected={item.event.expected || undefined}
									data-live={live || undefined}
									data-ended={ended || undefined}
								>
									<!-- Details stick to the visible edges, so blocks that start or end off-screen still show them. -->
									<span class="sticky left-3 flex min-w-0 shrink items-center gap-2.5">
										{#if blockWidth >= 240}<span
												class="tone-chip grid size-7 shrink-0 place-items-center rounded-md"
												><Icon class="size-3.5" aria-hidden="true" /></span
											>{/if}
										<span class="flex min-w-0 flex-col">
											<span class="truncate text-sm font-semibold">{item.event.name}</span>
											<span class="truncate text-xs text-muted-foreground tabular-nums"
												>{#if item.event.timeControl}<span class="tone-ink text-[13px] font-bold"
														>{item.event.timeControl}</span
													><span class="mx-1" aria-hidden="true">·</span>{/if}{clock.format(
													item.start
												)}–{clock.format(item.end)}{item.event.expected ? ' · Expected' : ''}</span
											>
										</span>
									</span>
								</button>
							</li>
						{/each}
					</ul>
				{/each}
			</section>
		{/each}
	</div>
</div>

<Dialog.Root
	open={selected !== null}
	onOpenChange={(value) => {
		if (!value) selected = null;
	}}
	onOpenChangeComplete={(value) => {
		if (!value) opener?.focus();
	}}
>
	{#if selected}<EventDialog event={selected} now={current} />{/if}
</Dialog.Root>
