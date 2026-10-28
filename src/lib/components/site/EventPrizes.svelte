<script lang="ts">
	import { Trophy } from '@lucide/svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import { money, prizeTotal } from '#lib/event-presentation.js';
	import type { Tournament } from '#lib/types/home.js';
	let { event }: { event: Tournament } = $props();
</script>

{#if event.prizes && prizeTotal(event) > 0}
	<Card.Content class="overflow-hidden rounded-lg border border-border/60 bg-muted/30 p-0">
		<div class="flex items-center gap-3 border-b border-border/60 p-4">
			<div class="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card">
				<Trophy class="size-4 text-muted-foreground" aria-hidden="true" />
			</div>
			<div class="min-w-0">
				<p class="text-xs text-muted-foreground">Total prize pool</p>
				<p class="mt-1 text-xl font-semibold tracking-tight tabular-nums">
					{money(prizeTotal(event), event.prizes.currency)}
				</p>
			</div>
		</div>
		<dl class="divide-y divide-border/60 px-4 text-sm">
			{#each event.prizes.awards as award (award.category)}<div
					class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-3.5"
				>
					<dt class="min-w-0 [overflow-wrap:anywhere]">{award.category}</dt>
					<dd class="font-medium tabular-nums">{money(award.amount, event.prizes.currency)}</dd>
				</div>{/each}
		</dl>
	</Card.Content>
{/if}
