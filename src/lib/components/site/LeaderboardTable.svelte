<script lang="ts">
	import { ArrowUpRight, SearchX, Users } from '@lucide/svelte';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import { categoryLabels, leaderboardHref, providers } from '#lib/leaderboard.js';
	import type { LeaderboardView } from '#lib/types/leaderboard.js';
	let { board, loading = false }: { board: LeaderboardView; loading?: boolean } = $props();
	const source = $derived(providers.find((item) => item.value === board.provider)!);
</script>

{#if loading}
	<div aria-busy="true" aria-label="Loading ratings" class="space-y-6 px-5 py-6 sm:px-6">
		{#each [1, 2, 3, 4, 5, 6] as row (row)}
			<div class="flex items-center gap-5">
				<Skeleton class="size-6 shrink-0" />
				<div class="flex-1 space-y-2">
					<Skeleton class="h-4 w-2/3" /><Skeleton class="h-3 w-1/3" />
				</div>
				<Skeleton class="h-5 w-12" />
			</div>
		{/each}
	</div>
{:else if board.rows.length === 0}
	<Empty.Root role="status" class="min-h-80 rounded-none border-0 px-6">
		<Empty.Header>
			<Empty.Media variant="icon">
				{#if board.q}<SearchX aria-hidden="true" />{:else}<Users aria-hidden="true" />{/if}
			</Empty.Media>
			<Empty.Title><h3>{board.q ? 'No players found' : 'No ratings available'}</h3></Empty.Title>
			<Empty.Description class="[overflow-wrap:anywhere]">
				{board.q
					? `No matches for "${board.q}". Try a name or username.`
					: `There are no ${categoryLabels[board.category].toLowerCase()} ratings to show for ${source.label}.`}
			</Empty.Description>
		</Empty.Header>
		{#if board.q}<Empty.Content
				><Button
					href={leaderboardHref(board, { q: '', page: 1 })}
					variant="outline"
					class="min-h-11">Clear search</Button
				></Empty.Content
			>{/if}
	</Empty.Root>
{:else}
	<Table.Root class="table-fixed">
		<Table.Caption class="sr-only"
			>Tanzania {source.label}
			{categoryLabels[board.category]} rankings. Equal ratings share a rank.</Table.Caption
		>
		<Table.Header
			><Table.Row class="bg-muted/40 hover:bg-muted/40">
				<Table.Head class="w-14 pl-4 text-xs sm:w-20 sm:pl-6">Rank</Table.Head>
				<Table.Head class="text-xs">Player</Table.Head>
				<Table.Head class="w-20 pr-4 text-right text-xs sm:w-28 sm:pr-6">Rating</Table.Head>
			</Table.Row></Table.Header
		>
		<Table.Body>
			{#each board.rows as player (player.id)}
				<Table.Row>
					<Table.Cell class="pl-4 align-top pt-4 text-muted-foreground tabular-nums sm:pl-6"
						>{player.rank}</Table.Cell
					>
					<Table.Cell class="py-3.5 whitespace-normal">
						<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
							{#if player.title}<Badge
									class="rounded-md bg-title-blue px-1.5 text-[10px] text-white"
									>{player.title}</Badge
								>{/if}
							{#if player.profileUrl}<a
									href={player.profileUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex min-w-0 items-center gap-1 rounded-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
									><span class="[overflow-wrap:anywhere]">{player.name}</span><ArrowUpRight
										class="size-3 shrink-0"
										aria-hidden="true"
									/></a
								>{:else}<span class="min-w-0 font-medium [overflow-wrap:anywhere]"
									>{player.name}</span
								>{/if}
						</div>
						{#if player.handle}<p
								class="mt-1 text-xs text-muted-foreground [overflow-wrap:anywhere]"
							>
								{player.handle}
							</p>{/if}
						{#if player.inactive}<Badge variant="secondary" class="mt-1.5 rounded-md text-[10px]"
								>Inactive</Badge
							>{/if}
					</Table.Cell>
					<Table.Cell class="pr-4 text-right align-top pt-4 sm:pr-6"
						><span class="font-semibold tabular-nums">{player.rating.value}</span
						>{#if player.rating.provisional}<span
								class="mt-1 block text-[10px] text-muted-foreground">Provisional</span
							>{/if}</Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
