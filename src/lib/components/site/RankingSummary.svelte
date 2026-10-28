<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { RankedPlayer, RatingFormat } from '#lib/types/home.js';

	let { players, sample = false }: { players: RankedPlayer[]; sample?: boolean } = $props();
	let format = $state<RatingFormat>('rapid');
	const formats: { value: RatingFormat; label: string }[] = [
		{ value: 'rapid', label: 'Rapid' },
		{ value: 'blitz', label: 'Blitz' },
		{ value: 'bullet', label: 'Bullet' }
	];
	const ranked = $derived(
		players
			.filter((player) => player.ratings[format] !== null)
			.toSorted(
				(a, b) => (b.ratings[format] ?? 0) - (a.ratings[format] ?? 0) || a.id.localeCompare(b.id)
			)
	);
	const leaders = $derived(
		ranked.slice(0, 5).map((player) => ({
			...player,
			rank: ranked.findIndex((entry) => entry.ratings[format] === player.ratings[format]) + 1
		}))
	);
</script>

<section id="leaderboard" aria-labelledby="home-rankings-title" class="min-w-0">
	<div class="mb-5 flex items-center justify-between gap-3">
		<h2 id="home-rankings-title" class="section-title">Player rankings</h2>
		{#if sample}<Badge variant="outline" class="sample-badge">Sample ratings</Badge>{/if}
	</div>
	<Card.Root class="gap-0 overflow-hidden py-0">
		<Card.Header class="gap-1 border-b px-5 py-5 sm:px-6">
			<Card.Title>Lichess</Card.Title>
			<Card.Description>Tanzania · Top 5</Card.Description>
		</Card.Header>
		<Tabs.Root bind:value={format} class="gap-0">
			<div class="px-5 py-4 sm:px-6">
				<Tabs.List aria-label="Lichess time control" class="w-full sm:w-auto">
					{#each formats as option (option.value)}
						<Tabs.Trigger value={option.value} class="flex-1 px-4">{option.label}</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</div>
			{#each formats as option (option.value)}
				<Tabs.Content value={option.value} class="m-0 min-h-86">
					{#if leaders.length === 0}
						<p
							class="flex min-h-86 items-center justify-center border-t px-6 text-sm text-muted-foreground"
							role="status"
						>
							No {option.label.toLowerCase()} ratings available.
						</p>
					{:else}
						<Table.Root class="table-fixed">
							<Table.Caption class="sr-only"
								>{sample ? 'Fictional' : 'Tanzania'} Lichess {option.label} rankings</Table.Caption
							>
							<Table.Header>
								<Table.Row class="bg-muted/50 hover:bg-muted/50">
									<Table.Head class="w-14 pl-5 text-xs sm:pl-6">Rank</Table.Head>
									<Table.Head class="pl-4 text-xs">Player</Table.Head>
									<Table.Head class="w-20 pr-5 text-right text-xs sm:pr-6">Rating</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each leaders as player (player.id)}
									<Table.Row>
										<Table.Cell class="pl-5 text-muted-foreground tabular-nums sm:pl-6"
											>{player.rank}</Table.Cell
										>
										<Table.Cell class="py-3 pl-4">
											<div class="truncate text-sm font-medium">{player.name}</div>
											<div class="mt-0.5 truncate text-xs text-muted-foreground">
												{player.handle}
											</div>
										</Table.Cell>
										<Table.Cell class="pr-5 text-right font-medium tabular-nums sm:pr-6"
											>{player.ratings[format]}</Table.Cell
										>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					{/if}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</Card.Root>
</section>
