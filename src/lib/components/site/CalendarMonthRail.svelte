<script lang="ts">
	import { untrack } from 'svelte';
	import { ChevronDown, ChevronUp } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { localDate, monthLabel } from '#lib/calendar.js';
	let { months, eventDays, now }: { months: string[]; eventDays: Set<string>; now: number } =
		$props();

	/**
	 * A scrollbar for the page drawn as a calendar ruler: one tick per day, the
	 * same spacing everywhere, with event days in blue. Every month gets the
	 * same height, so a weekly event shows as an even rhythm. The lens is mapped
	 * through the days on the page, so whatever it covers is what is on screen.
	 * When the months are taller than the rail, the rail scrolls along.
	 */
	const daySpacing = 5;
	/** A month tick, then up to 31 day ticks, then the next month tick. */
	const monthHeight = 32 * daySpacing;
	const contentHeight = $derived(months.length * monthHeight);
	/** Where each month's section starts and ends on the page, in pixels. */
	let spans = $state<{ month: string; start: number; end: number }[]>([]);
	/** Page positions paired with rail positions, in order down both. */
	let anchors = $state<[page: number, rail: number][]>([]);
	/** The past view lists newest first, so its days run backwards down the rail. */
	let descending = $state(false);
	const daysIn = (month: string) => {
		const [year, number] = month.split('-').map(Number);
		return new Date(Date.UTC(year, number, 0)).getUTCDate();
	};
	const dayRail = (index: number, month: string, day: number) =>
		index * monthHeight + (descending ? daysIn(month) - day + 1 : day) * daySpacing;
	const ticks = $derived(
		months.flatMap((month, index) =>
			Array.from({ length: daysIn(month) }, (_, offset) => {
				const day = offset + 1;
				const key = `${month}-${String(day).padStart(2, '0')}`;
				return { key, at: dayRail(index, month, day), event: eventDays.has(key) };
			})
		)
	);
	let todayAt = $state<number | null>(null);
	let view = $state({ top: 0, bottom: 0 });
	let offset = $state(0);
	let trackHeight = $state(0);
	let label = $state('');
	let dragging = $state(false);
	const today = $derived(localDate(now));
	const minimumLens = 44;
	/** Room above the first month and below the last, so their names are not clipped. */
	const pad = 12;

	/** Straight-line steps between anchors, from one axis to the other. */
	function between(value: number, from: 0 | 1) {
		const to = from === 0 ? 1 : 0;
		if (!anchors.length) return 0;
		if (value <= anchors[0][from]) return anchors[0][to];
		for (let index = 1; index < anchors.length; index++) {
			const [a, b] = [anchors[index - 1], anchors[index]];
			if (value < b[from])
				return a[to] + ((value - a[from]) / Math.max(1, b[from] - a[from])) * (b[to] - a[to]);
		}
		return anchors.at(-1)![to];
	}
	const toRail = (y: number) => between(y, 0);
	const toPage = (railY: number) => between(railY, 1);

	const lensTop = $derived(toRail(view.top));
	const lensHeight = $derived(Math.max(minimumLens, toRail(view.bottom) - lensTop));
	const active = $derived(
		spans.findLast((span) => span.start <= (view.top + view.bottom) / 2)?.month ?? months[0]
	);

	const rangeFormat = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'UTC',
		day: 'numeric',
		month: 'short'
	});
	const short = (key: string) =>
		key.length === 7
			? monthLabel(key).split(' ')[0]
			: rangeFormat.format(new Date(`${key}T00:00:00Z`));
	/** Earlier date first, whichever way the list runs: "4 – 18 Oct", "28 Sept – 4 Oct". */
	const range = (a: string, b: string) => {
		const [from, to] = [a, b].sort();
		if (from === to) return short(from);
		const sameMonth = from.length === 10 && to.length === 10 && from.slice(0, 7) === to.slice(0, 7);
		return `${sameMonth ? Number(from.slice(8)) : short(from)} – ${short(to)}`;
	};
	/** The year only appears for months outside the current one, such as December 2025. */
	const monthName = (month: string) => {
		const [name, year] = monthLabel(month).split(' ');
		return year === today.slice(0, 4) ? name : `${name} ${year}`;
	};

	/** Scroll the rail only when the lens nears an edge, so a drag tracks the pointer. */
	function follow() {
		// Keep the lens in the middle band, with neighbouring months in view on both sides.
		const margin = Math.max(48, trackHeight * 0.3);
		const max = Math.max(0, contentHeight + 2 * pad - trackHeight);
		const top = lensTop + pad;
		const bottom = top + lensHeight;
		let next = offset;
		if (top - next < margin) next = top - margin;
		if (bottom - next > trackHeight - margin) next = bottom - trackHeight + margin;
		offset = Math.min(max, Math.max(0, next));
	}

	function measure() {
		const at = (element: Element) => element.getBoundingClientRect().top + window.scrollY;
		spans = months.flatMap((month) => {
			const section = document.getElementById(`month-${month}`);
			if (!section) return [];
			const rect = section.getBoundingClientRect();
			return [{ month, start: rect.top + window.scrollY, end: rect.bottom + window.scrollY }];
		});
		const nodes = [...document.querySelectorAll<HTMLElement>('[data-day]')];
		const dated = nodes.filter((node) => node.dataset.day!.length === 10);
		descending =
			dated.length > 1
				? dated[0].dataset.day! > dated[1].dataset.day!
				: months.length > 1 && months[0] > months[1];
		// Each month's top, each listed day and the end of the list pin the page to the rail.
		const pins: [number, number][] = [];
		for (const [index, span] of spans.entries()) {
			const position = months.indexOf(span.month);
			pins.push([span.start, position * monthHeight]);
			for (const node of dated) {
				const day = node.dataset.day!;
				if (!day.startsWith(span.month)) continue;
				const rail = dayRail(position, span.month, Number(day.slice(8)));
				const last = pins.at(-1)!;
				const top = at(node);
				if (rail > last[1] && top > last[0]) pins.push([top, rail]);
			}
			if (index === spans.length - 1) pins.push([span.end, (position + 1) * monthHeight]);
		}
		anchors = pins;
		// Today marks where upcoming dated events begin.
		const upcoming = nodes.find(
			(node) => node.dataset.day!.length === 10 && node.dataset.day! >= today
		);
		todayAt = upcoming ? at(upcoming) : null;
		view = { top: window.scrollY, bottom: window.scrollY + window.innerHeight };
		trackHeight = trackElement?.clientHeight ?? 0;
		follow();
		const visible = nodes
			.filter((node) => {
				const rect = node.getBoundingClientRect();
				return rect.bottom > 0 && rect.top < window.innerHeight;
			})
			.map((node) => node.dataset.day!);
		// Prefer real dates over month-only entries for the range.
		const visibleDates = visible.filter((day) => day.length === 10);
		const shown = visibleDates.length ? visibleDates : visible;
		label = shown.length ? range(shown[0], shown.at(-1)!) : '';
	}
	function stepMonth(direction: 1 | -1) {
		const next = months[months.indexOf(active) + direction];
		if (next)
			document
				.getElementById(`month-${next}`)
				?.scrollIntoView({ block: 'start', behavior: 'smooth' });
	}

	let trackElement: HTMLElement | undefined;
	let navElement: HTMLElement | undefined;
	/**
	 * The rail sticks at its own starting position, so it never moves while the
	 * page scrolls, like a scrollbar. Its height fills the window below that.
	 */
	let stickyTop = $state<number | null>(null);
	let railHeight = $state(0);
	function sizeRail() {
		if (!navElement) return;
		if (stickyTop === null) {
			// Measured before any sticky offset applies, so this is the natural position.
			const natural = Math.round(navElement.getBoundingClientRect().top + window.scrollY);
			// Stay level with the events; on short windows fall back to near the top.
			stickyTop = natural <= window.innerHeight * 0.6 ? natural : 24;
		}
		railHeight = Math.max(240, window.innerHeight - stickyTop - 24);
	}

	/** Child attachments run first, so the rail measures itself in its own attachment. */
	function rail(node: HTMLElement) {
		navElement = node;
		sizeRail();
		const resize = () => sizeRail();
		window.addEventListener('resize', resize, { passive: true });
		return () => window.removeEventListener('resize', resize);
	}

	function track(node: HTMLElement) {
		trackElement = node;
		let frame = 0;
		const update = () => {
			if (!frame)
				frame = requestAnimationFrame(() => {
					frame = 0;
					measure();
				});
		};
		// measure() reads state it also writes, so the attachment must not track it.
		untrack(measure);
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update, { passive: true });
		// Filters and late fonts change the page height without scrolling.
		const observer = new ResizeObserver(update);
		observer.observe(document.body);
		observer.observe(node);
		/** Pressing the ruler outside the lens glides there, centring the lens on the press. */
		const press = (event: PointerEvent) => {
			if (event.button !== 0 || (event.target as HTMLElement).closest('a, [role="scrollbar"]'))
				return;
			const railY = event.clientY - node.getBoundingClientRect().top + offset - pad;
			window.scrollTo({ top: toPage(railY) - window.innerHeight / 2, behavior: 'smooth' });
		};
		node.addEventListener('pointerdown', press);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
			node.removeEventListener('pointerdown', press);
		};
	}

	/**
	 * Drag like a scrollbar thumb: the lens follows the pointer's travel along
	 * the rail, measured from the grab, and the page scrolls to match.
	 */
	function thumb(node: HTMLElement) {
		let startY = 0;
		let startRail = 0;
		let startOffset = 0;
		const down = (event: PointerEvent) => {
			if (event.button !== 0) return;
			event.preventDefault();
			event.stopPropagation();
			startY = event.clientY;
			startRail = lensTop;
			startOffset = offset;
			dragging = true;
			node.setPointerCapture(event.pointerId);
		};
		const move = (event: PointerEvent) => {
			if (!dragging) return;
			// The rail may have scrolled since the grab; count that as travel too.
			const railY = startRail + event.clientY - startY + (offset - startOffset);
			window.scrollTo({ top: toPage(railY), behavior: 'instant' });
		};
		const up = (event: PointerEvent) => {
			if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
			dragging = false;
		};
		/** Keyboard: arrows scroll a quarter screen, Page keys a whole screen. */
		const key = (event: KeyboardEvent) => {
			const step = { ArrowDown: 0.25, ArrowUp: -0.25, PageDown: 0.9, PageUp: -0.9 }[event.key];
			if (!step) return;
			event.preventDefault();
			window.scrollBy({ top: step * window.innerHeight, behavior: 'smooth' });
		};
		node.addEventListener('pointerdown', down);
		node.addEventListener('pointermove', move);
		node.addEventListener('pointerup', up);
		node.addEventListener('pointercancel', up);
		node.addEventListener('keydown', key);
		return () => {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', up);
			node.removeEventListener('keydown', key);
		};
	}

	const px = (value: number) => `${value}px`;
	const todayRail = $derived(todayAt === null ? null : toRail(todayAt));
	/** Today's label steps clear of a month name it would sit on. */
	const todayLabel = $derived.by(() => {
		if (todayRail === null) return null;
		const near = Math.abs(todayRail - Math.round(todayRail / monthHeight) * monthHeight) < 18;
		return near ? todayRail + 18 : todayRail;
	});
</script>

<nav
	{@attach rail}
	aria-label="Months"
	class="sticky hidden flex-col self-start lg:flex"
	style:top={stickyTop === null ? undefined : `${stickyTop}px`}
	style:height={railHeight ? `${railHeight}px` : 'calc(100dvh - 9rem)'}
>
	<Button
		variant="ghost"
		size="icon"
		class="size-8 self-start"
		aria-label="Previous month"
		disabled={months.indexOf(active) <= 0}
		onclick={() => stepMonth(-1)}><ChevronUp class="size-4" aria-hidden="true" /></Button
	>
	<div
		{@attach track}
		class="relative -mx-2 my-3 flex-1 cursor-pointer touch-none overflow-hidden px-2 select-none"
		style:mask-image={contentHeight + 2 * pad > trackHeight
			? `linear-gradient(to bottom, ${offset > 0 ? 'transparent, black 2rem' : 'black'}, black calc(100% - 2rem), ${offset < contentHeight + 2 * pad - trackHeight ? 'transparent' : 'black'})`
			: undefined}
	>
		<div
			class={['relative', !dragging && 'transition-transform duration-200 ease-out']}
			style:height={px(contentHeight)}
			style:transform={`translateY(${pad - offset}px)`}
		>
			{#each ticks as tick (tick.key)}
				<span
					class={[
						'pointer-events-none absolute left-1 -translate-y-1/2 rounded-full',
						tick.event ? 'h-0.5 w-4 bg-title-blue' : 'h-px w-2.5 bg-foreground/15'
					]}
					style:top={px(tick.at)}
					aria-hidden="true"
				></span>
			{/each}
			{#each months as month, index (month)}
				<span
					class="pointer-events-none absolute left-1 h-0.5 w-6 -translate-y-1/2 rounded-full bg-foreground/45"
					style:top={px(index * monthHeight)}
					aria-hidden="true"
				></span>
				<a
					href={`#month-${month}`}
					aria-current={month === active ? 'location' : undefined}
					class={[
						'absolute left-10 -translate-y-1/2 rounded-sm text-sm leading-none whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-ring',
						month === active
							? 'font-semibold text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					]}
					style:top={px(index * monthHeight + 1)}>{monthName(month)}</a
				>
			{/each}
			{#if todayRail !== null && todayLabel !== null}
				<span
					class="pointer-events-none absolute left-1 z-10 h-[3px] w-7 -translate-y-1/2 rounded-full bg-[var(--hero-blue)] shadow-[0_0_8px_var(--hero-blue)]"
					style:top={px(todayRail)}
					aria-hidden="true"
				></span>
				<span
					class="pointer-events-none absolute left-10 z-10 -translate-y-1/2 text-xs leading-none font-semibold text-title-blue"
					style:top={px(todayLabel)}>Today</span
				>
			{/if}
			<div
				{@attach thumb}
				role="scrollbar"
				tabindex="0"
				aria-label="Scroll the calendar"
				aria-orientation="vertical"
				aria-controls="main-content"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round((lensTop / Math.max(1, contentHeight)) * 100)}
				aria-valuetext={label}
				class={[
					'absolute -inset-x-2 z-20 flex items-center justify-center rounded-xl border bg-background/30 backdrop-blur-[2px] focus-visible:outline-2 focus-visible:outline-ring',
					dragging
						? 'cursor-grabbing border-title-blue/40 shadow-[0_8px_24px_-6px_rgb(0_118_160/30%),inset_0_1px_0_rgb(255_255_255/80%)]'
						: 'cursor-grab border-white/90 shadow-[0_4px_16px_-4px_rgb(24_24_27/18%),inset_0_1px_0_rgb(255_255_255/80%)]'
				]}
				style:top={px(Math.min(lensTop, contentHeight - lensHeight))}
				style:height={px(lensHeight)}
			>
				{#if label}<span
						class="rounded-md bg-background/85 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground tabular-nums shadow-sm"
						>{label}</span
					>{/if}
			</div>
		</div>
	</div>
	<Button
		variant="ghost"
		size="icon"
		class="size-8 self-start"
		aria-label="Next month"
		disabled={months.indexOf(active) >= months.length - 1}
		onclick={() => stepMonth(1)}><ChevronDown class="size-4" aria-hidden="true" /></Button
	>
</nav>
