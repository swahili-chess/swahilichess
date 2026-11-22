<script lang="ts">
	import { dateLabel } from '#lib/calendar.js';
	import type { CalendarEvent } from '#lib/types/event.js';
	let { event }: { event: CalendarEvent } = $props();
	const month = $derived('month' in event.date ? event.date.month : event.date.start.slice(0, 7));
	const header = $derived(
		new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'short', year: 'numeric' })
			.format(new Date(`${month}-01T00:00:00Z`))
			.toUpperCase()
	);
	const day = $derived.by(() => {
		if ('month' in event.date) return 'TBA';
		const start = Number(event.date.start.slice(8));
		const end = event.date.end ? Number(event.date.end.slice(8)) : start;
		const sameMonth = !event.date.end || event.date.end.slice(0, 7) === month;
		return end === start ? `${start}` : sameMonth ? `${start}–${end}` : `${start}+`;
	});
	const datetime = $derived('month' in event.date ? event.date.month : event.date.start);
</script>

<time
	{datetime}
	title={dateLabel(event)}
	class="flex w-14 shrink-0 flex-col overflow-hidden rounded-lg border text-center"
>
	<span class="bg-primary px-1 py-1 text-[9px] font-medium tracking-widest text-primary-foreground"
		>{header}</span
	>
	<span
		class={[
			'bg-card py-2 leading-none font-semibold tabular-nums',
			day.length > 3 ? 'text-base' : 'text-2xl'
		]}>{day}</span
	>
</time>
