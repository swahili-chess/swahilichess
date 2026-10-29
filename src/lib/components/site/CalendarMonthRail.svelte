<script lang="ts">
	import { ChevronDown, ChevronUp } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { localDate, monthLabel } from '#lib/calendar.js';
	let { months, eventDays, now }: { months: string[]; eventDays: Set<string>; now: number } =
		$props();

	/**
	 * A scrollbar for the page. The lens is the thumb: its top is the scroll
	 * position and its height the visible share of the page, both as fractions of
	 * the page height. Marks sit where their content is on the page, so whatever
	 * the lens covers is exactly what is on screen.
	 */
	let page = $state({ start: 0, size: 1 });
	let marks = $state<{
		months: { month: string; at: number }[];
		days: { day: string; at: number; event: boolean }[];
		today: number | null;
	}>({ months: [], days: [], today: null });
	let label = $state('');
	let dragging = $state(false);
	/** Decorative ruler ticks, evenly spaced. */
	const ruler = Array.from({ length: 96 }, (_, index) => index);
	const today = $derived(localDate(now));
	const minimumLens = 0.06;
	const lensSize = $derived(Math.min(1, Math.max(page.size, minimumLens)));
	const lensTop = $derived(Math.min(Math.max(0, page.start), 1 - lensSize));
	const active = $derived.by(() => {
		const centre = lensTop + lensSize / 2;
		return marks.months.findLast((mark) => mark.at <= centre)?.month ?? months[0];
	});
	const rangeFormat = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'UTC',
		day: 'numeric',
		month: 'short'
	});
	const short = (key: string) =>
		key.length === 7
			? monthLabel(key).split(' ')[0]
			: rangeFormat.format(new Date(`${key}T00:00:00Z`));
	const percent = (fraction: number) => `${fraction * 100}%`;

	const scrollable = () => Math.max(1, document.documentElement.scrollHeight);
	function measure() {
		const height = scrollable();
		page = { start: window.scrollY / height, size: window.innerHeight / height };
		const at = (element: Element) =>
			(element.getBoundingClientRect().top + window.scrollY) / height;
		const nodes = [...document.querySelectorAll<HTMLElement>('[data-day]')];
		const days = nodes.map((node) => {
			const day = node.dataset.day!;
			return { day, at: at(node), event: eventDays.has(day) };
		});
		// Today marks where upcoming dated events begin.
		const upcoming = nodes.find(
			(node) => node.dataset.day!.length === 10 && node.dataset.day! >= today
		);
		marks = {
			months: months.flatMap((month) => {
				const section = document.getElementById(`month-${month}`);
				return section ? [{ month, at: at(section) }] : [];
			}),
			days,
			today: upcoming ? at(upcoming) : null
		};
		const visible = nodes.filter((node) => {
			const rect = node.getBoundingClientRect();
			return rect.bottom > 0 && rect.top < window.innerHeight;
		});
		const first = visible[0]?.dataset.day;
		const last = visible.at(-1)?.dataset.day;
		label =
			first && last ? (first === last ? short(first) : `${short(first)} – ${short(last)}`) : '';
	}
	function scrollToFraction(fraction: number, behavior: ScrollBehavior) {
		window.scrollTo({ top: fraction * scrollable(), behavior });
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
		measure();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update, { passive: true });
		// Filters and late fonts change the page height without scrolling.
		const observer = new ResizeObserver(update);
		observer.observe(document.body);
		/** Pressing the ruler outside the lens glides there, centring the lens on the press. */
		const press = (event: PointerEvent) => {
			if (event.button !== 0 || event.target !== node) return;
			const rect = node.getBoundingClientRect();
			scrollToFraction((event.clientY - rect.top) / rect.height - page.size / 2, 'smooth');
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
	 * Drag like a scrollbar thumb: the page moves by the pointer's travel as a
	 * share of the track. Travel is measured from the grab, so the rail settling
	 * into its sticky position cannot feed back into the scroll.
	 */
	function thumb(node: HTMLElement) {
		let startY = 0;
		let startScroll = 0;
		let ratio = 1;
		const down = (event: PointerEvent) => {
			if (event.button !== 0 || !trackElement) return;
			event.preventDefault();
			event.stopPropagation();
			startY = event.clientY;
			startScroll = window.scrollY;
			ratio = scrollable() / trackElement.getBoundingClientRect().height;
			dragging = true;
			node.setPointerCapture(event.pointerId);
		};
		const move = (event: PointerEvent) => {
			if (!dragging) return;
			window.scrollTo({ top: startScroll + (event.clientY - startY) * ratio, behavior: 'instant' });
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
	<div {@attach track} class="relative my-3 flex-1 cursor-pointer touch-none select-none">
		{#each ruler as tick (tick)}
			<span
				class={[
					'pointer-events-none absolute left-1 h-px rounded-full',
					tick % 8 === 0 ? 'w-3.5 bg-foreground/20' : 'w-2.5 bg-foreground/10'
				]}
				style:top={percent(tick / ruler.length)}
				aria-hidden="true"
			></span>
		{/each}
		{#each marks.days as mark (mark.day)}
			{#if mark.event}<span
					class="pointer-events-none absolute left-1 h-0.5 w-4 rounded-full bg-title-blue"
					style:top={percent(mark.at)}
					aria-hidden="true"
				></span>{/if}
		{/each}
		{#if marks.today !== null}
			<span
				class="pointer-events-none absolute left-1 z-10 flex -translate-y-1/2 items-center gap-2"
				style:top={percent(marks.today)}
				><span
					class="h-[3px] w-7 rounded-full bg-[var(--hero-blue)] shadow-[0_0_8px_var(--hero-blue)]"
				></span><span class="text-xs font-semibold text-title-blue">Today</span></span
			>
		{/if}
		{#each marks.months as mark (mark.month)}
			<span
				class="pointer-events-none absolute left-1 h-0.5 w-6 rounded-full bg-foreground/45"
				style:top={percent(mark.at)}
				aria-hidden="true"
			></span>
			<a
				href={`#month-${mark.month}`}
				aria-current={mark.month === active ? 'location' : undefined}
				class={[
					'absolute left-10 -translate-y-1/2 rounded-sm text-sm leading-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-ring',
					mark.month === active
						? 'font-semibold text-foreground'
						: 'text-muted-foreground hover:text-foreground'
				]}
				style:top={percent(
					marks.today !== null && Math.abs(mark.at - marks.today) < 0.03
						? marks.today + 0.03
						: mark.at
				)}>{monthLabel(mark.month).split(' ')[0]}</a
			>
		{/each}
		<div
			{@attach thumb}
			role="scrollbar"
			tabindex="0"
			aria-label="Scroll the calendar"
			aria-orientation="vertical"
			aria-controls="main-content"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(lensTop * 100)}
			aria-valuetext={label}
			class={[
				'absolute -inset-x-2 z-20 flex items-center justify-center rounded-xl border bg-background/30 backdrop-blur-[2px] focus-visible:outline-2 focus-visible:outline-ring',
				dragging
					? 'cursor-grabbing border-title-blue/40 shadow-[0_8px_24px_-6px_rgb(0_118_160/30%),inset_0_1px_0_rgb(255_255_255/80%)]'
					: 'cursor-grab border-white/90 shadow-[0_4px_16px_-4px_rgb(24_24_27/18%),inset_0_1px_0_rgb(255_255_255/80%)]'
			]}
			style:top={percent(lensTop)}
			style:height={percent(lensSize)}
			style:min-height="2.75rem"
		>
			{#if label}<span
					class="rounded-md bg-background/85 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground tabular-nums shadow-sm"
					>{label}</span
				>{/if}
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
