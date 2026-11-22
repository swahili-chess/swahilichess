<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { ArrowRight } from '@lucide/svelte';
	import type { RankedPlayer, RatingFormat } from '#lib/types/home.js';

	let { players, unavailable = false }: { players: RankedPlayer[]; unavailable?: boolean } =
		$props();
	const limit = 15;
	let format = $state<RatingFormat>('standard');
	const formats: { value: RatingFormat; label: string }[] = [
		{ value: 'standard', label: 'Standard' },
		{ value: 'rapid', label: 'Rapid' },
		{ value: 'blitz', label: 'Blitz' }
	];
	const ranked = $derived(
		players
			.filter((player) => player.ratings[format] !== null)
			.toSorted(
				(a, b) => (b.ratings[format] ?? 0) - (a.ratings[format] ?? 0) || a.id.localeCompare(b.id)
			)
	);
	const leaders = $derived(
		ranked.slice(0, limit).map((player) => ({
			...player,
			rank: ranked.findIndex((entry) => entry.ratings[format] === player.ratings[format]) + 1
		}))
	);
</script>

<section id="leaderboard" aria-labelledby="home-rankings-title" class="min-w-0">
	<div class="mb-5 flex items-center justify-between gap-3">
		<h2 id="home-rankings-title" class="section-title">Player rankings</h2>
	</div>
	<Card.Root class="gap-0 overflow-hidden py-0">
		<Card.Header class="gap-1 border-b px-5 py-5 sm:px-6">
			<Card.Title>FIDE</Card.Title>
			<Card.Description>Tanzania · Top {limit}</Card.Description>
		</Card.Header>
		<Tabs.Root bind:value={format} class="gap-0">
			<div class="px-5 py-4 sm:px-6">
				<Tabs.List aria-label="FIDE time control" class="w-full sm:w-auto">
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
							{unavailable
								? 'Ratings are unavailable right now.'
								: `No ${option.label.toLowerCase()} ratings available.`}
						</p>
					{:else}
						<Table.Root class="table-fixed">
							<Table.Caption class="sr-only">Tanzania FIDE {option.label} rankings</Table.Caption>
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
											<div class="flex min-w-0 items-center gap-2">
												{#if player.title}<Badge
														class="shrink-0 rounded-md bg-title-blue px-1.5 text-[10px] text-white"
														>{player.title}</Badge
													>{/if}
												{#if player.profileUrl}<a
														href={player.profileUrl}
														target="_blank"
														rel="noopener noreferrer"
														class="block min-w-0 truncate rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
														>{player.name}</a
													>{:else}<div class="truncate text-sm font-medium">{player.name}</div>{/if}
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
		<Card.Footer class="border-t px-4 py-2 sm:px-5"
			><Button
				variant="ghost"
				href={`/leaderboards?provider=fide&category=${format}`}
				class="min-h-11 w-full justify-between"
				>View leaderboard<ArrowRight class="size-4" aria-hidden="true" /></Button
			></Card.Footer
		>
	</Card.Root>
</section>
