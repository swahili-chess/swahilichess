<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Pagination from '#lib/components/ui/pagination/index.js';
	import { leaderboardHref } from '#lib/leaderboard.js';
	import type { LeaderboardView } from '#lib/types/leaderboard.js';
	let { board }: { board: LeaderboardView } = $props();
</script>

<div
	class="flex flex-col items-center justify-between gap-3 border-t px-4 py-4 sm:flex-row sm:px-6"
>
	<p class="shrink-0 text-xs text-muted-foreground" aria-live="polite">
		{(board.page - 1) * board.perPage + 1}–{Math.min(board.page * board.perPage, board.total)} of {board.total}
		players
	</p>
	{#if board.pageCount > 1}
		<Pagination.Root
			count={board.total}
			perPage={board.perPage}
			page={board.page}
			onPageChange={(page) => goto(leaderboardHref(board, { page }), { reset: false })}
			siblingCount={0}
			class="mx-0 w-auto"
			aria-label="Leaderboard pages"
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item
						><Pagination.Previous class="size-11 p-0 sm:w-auto sm:px-3" /></Pagination.Item
					>
					{#each pages as page (page.key)}
						<Pagination.Item
							>{#if page.type === 'ellipsis'}<Pagination.Ellipsis />{:else}<Pagination.Link
									{page}
									isActive={currentPage === page.value}
									class="size-11"
								/>{/if}</Pagination.Item
						>
					{/each}
					<Pagination.Item
						><Pagination.Next class="size-11 p-0 sm:w-auto sm:px-3" /></Pagination.Item
					>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/if}
</div>
