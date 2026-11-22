<script lang="ts">
	import { Trophy, Ticket } from '@lucide/svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import { money, prizeTotal, entryFeeLabel } from '#lib/event-presentation.js';
	import type { CalendarEvent } from '#lib/types/event.js';
	let { event }: { event: CalendarEvent } = $props();
	const total = $derived(prizeTotal(event));
	const fee = $derived(entryFeeLabel(event));
</script>

{#if total > 0 || fee !== null}
	<Card.Content class="rounded-lg border border-border/50 bg-muted/40 px-3.5 py-3">
		<dl class="space-y-3 text-sm">
			{#if total > 0 && event.prizes}<div
					class="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3"
				>
					<dt class="inline-flex items-center gap-2 text-muted-foreground">
						<Trophy class="size-3.5 shrink-0" aria-hidden="true" />Prize pool
					</dt>
					<dd class="text-right font-semibold tabular-nums">
						{money(total, event.prizes.currency)}
					</dd>
				</div>{/if}
			{#if fee !== null}<div class="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3">
					<dt class="inline-flex items-center gap-2 text-muted-foreground">
						<Ticket class="size-3.5 shrink-0" aria-hidden="true" />Entry fee
					</dt>
					<dd class="text-right font-medium tabular-nums">{fee}</dd>
				</div>{/if}
		</dl>
	</Card.Content>
{/if}
