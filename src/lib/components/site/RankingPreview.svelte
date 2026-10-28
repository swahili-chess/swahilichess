<script lang="ts">
	import { ArrowUpRight, CircleAlert, Search, Trophy } from '@lucide/svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import { samplePlayers, timeControls, type PreviewState } from '#lib/fixtures/foundation.js';

	let { displayState = 'ready', onReset }: { displayState?: PreviewState; onReset: () => void } =
		$props();
	let control = $state('rapid');
	let query = $state('');
	let players = $derived(
		samplePlayers.filter((player) =>
			`${player.name} ${player.handle}`.toLowerCase().includes(query.trim().toLowerCase())
		)
	);
</script>

<Card.Root class="gap-0 overflow-hidden py-0">
	<Card.Header class="gap-4 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
		<div class="flex items-start justify-between gap-3">
			<div>
				<h2 class="section-title" id="rankings-title">Player rankings</h2>
			</div>
			<Badge variant="outline" class="sample-badge">Sample</Badge>
		</div>
	</Card.Header>
	<Tabs.Root bind:value={control} class="gap-0">
		<div class="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 sm:px-6">
			<Tabs.List aria-label="Sample rating time control" class="h-10">
				{#each timeControls as format (format.value)}
					<Tabs.Trigger value={format.value} class="px-3">{format.label}</Tabs.Trigger>
				{/each}
			</Tabs.List>
			<div class="relative w-full min-[440px]:w-40">
				<Search
					class="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground"
					aria-hidden="true"
				/>
				<Input
					bind:value={query}
					aria-label="Find a sample player"
					placeholder="Find a player"
					class="h-10 pl-9"
					type="search"
				/>
			</div>
		</div>
		{#each timeControls as format (format.value)}
			<Tabs.Content value={format.value} class="m-0 min-h-86">
				{#if displayState === 'loading'}
					<div
						class="space-y-5 border-t px-6 py-6"
						role="status"
						aria-label="Loading sample rankings"
						aria-busy="true"
					>
						{#each [1, 2, 3, 4, 5] as row (row)}
							<div class="flex items-center gap-4">
								<Skeleton class="size-9 rounded-md" /><Skeleton class="h-4 w-1/2" /><Skeleton
									class="ml-auto h-4 w-12"
								/>
							</div>
						{/each}
					</div>
				{:else if displayState === 'error'}
					<div class="border-t p-6" role="status">
						<Alert.Root>
							<CircleAlert class="size-4" />
							<Alert.Title>Rankings couldn't be loaded</Alert.Title>
							<Alert.Description>Try again to reload the sample rankings.</Alert.Description>
						</Alert.Root>
						<Button variant="outline" class="mt-4" onclick={onReset}>Try again</Button>
					</div>
				{:else if displayState === 'empty' || players.length === 0}
					<div
						class="flex min-h-86 flex-col items-center justify-center border-t px-6 py-10 text-center"
						role="status"
					>
						<Trophy class="mb-4 size-6 text-muted-foreground" aria-hidden="true" />
						<h3 class="font-medium">
							{displayState === 'empty' ? 'No rankings yet' : 'No players found'}
						</h3>
						<p class="mt-2 max-w-64 text-sm text-muted-foreground">
							{displayState === 'empty'
								? 'Player ratings will appear here after the first update.'
								: 'Try another name or clear your search.'}
						</p>
						<Button
							variant="outline"
							class="mt-5"
							onclick={() => {
								query = '';
								onReset();
							}}>Restore sample players</Button
						>
					</div>
				{:else}
					<Table.Root class="table-fixed">
						<Table.Caption class="sr-only"
							>Fictional {format.label} rankings for the design preview</Table.Caption
						>
						<Table.Header>
							<Table.Row class="bg-muted/50 hover:bg-muted/50">
								<Table.Head class="w-14 pl-5 text-xs sm:pl-6">Rank</Table.Head>
								<Table.Head class="pl-4 text-xs">Player</Table.Head>
								<Table.Head class="w-20 pr-5 text-right text-xs sm:pr-6">Rating</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each [...players].sort((a, b) => b.ratings[format.value] - a.ratings[format.value]) as player (player.id)}
								<Table.Row>
									<Table.Cell class="pl-5 text-muted-foreground tabular-nums sm:pl-6"
										>{[...samplePlayers]
											.sort((a, b) => b.ratings[format.value] - a.ratings[format.value])
											.findIndex((p) => p.id === player.id) + 1}</Table.Cell
									>
									<Table.Cell class="py-3 pl-4">
										<div class="truncate text-sm font-medium">{player.name}</div>
										<div class="mt-0.5 truncate text-xs text-muted-foreground">{player.handle}</div>
									</Table.Cell>
									<Table.Cell class="pr-5 text-right font-medium tabular-nums sm:pr-6"
										>{player.ratings[format.value]}</Table.Cell
									>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/if}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
	<Card.Footer class="flex flex-wrap justify-end gap-2 border-t bg-muted/30 px-5 py-3 sm:px-6">
		<Button variant="ghost" size="sm" disabled
			>Full leaderboard <ArrowUpRight class="size-3.5" /></Button
		>
	</Card.Footer>
</Card.Root>
