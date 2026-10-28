<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { Search, RefreshCw, CircleAlert } from '@lucide/svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import LeaderboardTable from './LeaderboardTable.svelte';
	import LeaderboardPagination from './LeaderboardPagination.svelte';
	import { providers, categoriesFor, categoryLabels, leaderboardHref } from '#lib/leaderboard.js';
	import type {
		LeaderboardView,
		LeaderboardState,
		RatingProvider,
		RatingCategory
	} from '#lib/types/leaderboard.js';
	let {
		board,
		state,
		snapshotAt,
		sample = true,
		ratingMonth = null
	}: {
		board: LeaderboardView;
		state: LeaderboardState;
		snapshotAt: string | null;
		sample?: boolean;
		ratingMonth?: string | null;
	} = $props();
	const source = $derived(providers.find((item) => item.value === board.provider)!);
	const categories = $derived(categoriesFor(board.provider));
	const coverageLink = $derived('coverageLink' in source ? source.coverageLink : null);
	const coverageParts = $derived(
		coverageLink ? source.coverage.split(coverageLink.text) : [source.coverage]
	);
	const busy = $derived(Boolean(navigating.to) || state === 'loading');
	const search = $derived(board.q);
	const snapshot = $derived(
		snapshotAt
			? new Intl.DateTimeFormat('en-TZ', {
					dateStyle: 'medium',
					timeStyle: 'short',
					timeZone: 'Africa/Dar_es_Salaam',
					hour12: false
				}).format(new Date(snapshotAt))
			: null
	);
	const period = $derived(
		ratingMonth
			? new Intl.DateTimeFormat('en-TZ', {
					month: 'long',
					year: 'numeric',
					timeZone: 'UTC'
				}).format(new Date(`${ratingMonth}-01T00:00:00Z`))
			: null
	);
	function navigate(changes: { provider?: RatingProvider; category?: RatingCategory }) {
		void goto(leaderboardHref(board, { ...changes, page: 1 }), { reset: false });
	}
	function retry() {
		return goto(leaderboardHref(board), { reset: false, refreshAll: true });
	}
</script>

<Tabs.Root
	value={board.provider}
	onValueChange={(value) => navigate({ provider: value as RatingProvider })}
>
	<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
		<Tabs.List aria-label="Rating provider" class="h-11 w-full sm:w-auto">
			{#each providers as provider (provider.value)}<Tabs.Trigger
					value={provider.value}
					class="px-4 sm:min-w-28">{provider.label}</Tabs.Trigger
				>{/each}
		</Tabs.List>
		{#if sample}<Badge variant="outline" class="sample-badge">Sample ratings</Badge>{/if}
	</div>
	{#each providers as provider (provider.value)}
		<Tabs.Content value={provider.value} class="m-0">
			{#if board.provider === provider.value}
				<Card.Root class="gap-0 overflow-hidden py-0" aria-busy={Boolean(navigating.to)}>
					<Card.Header class="gap-4 border-b p-5 sm:p-6">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<div class="min-w-0 flex-1">
								<h2 class="text-lg font-semibold tracking-tight">{source.label} rankings</h2>
								<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
									{#if coverageLink && coverageParts.length === 2}{coverageParts[0]}<a
											href={coverageLink.href}
											target="_blank"
											rel="noopener noreferrer"
											class="rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
											>{coverageLink.text}</a
										>{coverageParts[1]}{:else}{source.coverage}{/if}
								</p>
							</div>
							<Button
								variant="outline"
								onclick={() => void retry()}
								disabled={busy}
								class="min-h-11"><RefreshCw class="size-3.5" aria-hidden="true" />Refresh</Button
							>
						</div>
					</Card.Header>
					<Tabs.Root
						value={board.category}
						onValueChange={(value) => navigate({ category: value as RatingCategory })}
						class="gap-0"
					>
						<div
							class="flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center sm:px-6"
						>
							<Tabs.List aria-label="Time control" class="h-11 w-full sm:w-auto"
								>{#each categories as category (category)}<Tabs.Trigger
										value={category}
										class="px-3">{categoryLabels[category]}</Tabs.Trigger
									>{/each}</Tabs.List
							>
							<form
								method="GET"
								action="/leaderboards"
								role="search"
								class="flex w-full gap-2 sm:max-w-sm"
								onsubmit={(event) => {
									event.preventDefault();
									const form = new FormData(event.currentTarget);
									void goto(
										leaderboardHref(board, { q: String(form.get('q') ?? '').trim(), page: 1 }),
										{ reset: false }
									);
								}}
							>
								<input type="hidden" name="provider" value={board.provider} /><input
									type="hidden"
									name="category"
									value={board.category}
								/>
								<Input
									type="search"
									name="q"
									value={search}
									placeholder="Search players"
									aria-label="Search players"
									maxlength={100}
									class="h-11 bg-background"
								/>
								<Button
									type="submit"
									variant="outline"
									size="icon"
									class="size-11 shrink-0"
									aria-label="Search"><Search class="size-4" aria-hidden="true" /></Button
								>
							</form>
						</div>
						{#each categories as category (category)}
							<Tabs.Content value={category} class="m-0">
								{#if state === 'error'}
									<Empty.Root role="status" class="min-h-80 rounded-none border-0 px-6">
										<Empty.Header>
											<Empty.Media variant="icon"><CircleAlert aria-hidden="true" /></Empty.Media>
											<Empty.Title><h3>Ratings are unavailable</h3></Empty.Title>
											<Empty.Description
												>Try again, or choose another rating provider.</Empty.Description
											>
										</Empty.Header>
										<Empty.Content
											><Button
												variant="outline"
												href={leaderboardHref(board)}
												onclick={(event) => {
													event.preventDefault();
													void retry();
												}}
												disabled={busy}
												class="min-h-11"
												><RefreshCw class="size-3.5" aria-hidden="true" />Try again</Button
											></Empty.Content
										>
									</Empty.Root>
								{:else}
									{#if state === 'stale'}<div class="px-5 pt-5 sm:px-6">
											<Alert.Root
												><CircleAlert class="size-4" /><Alert.Title
													>Showing the last saved ratings</Alert.Title
												><Alert.Description
													>A newer update is unavailable. You can still browse these ratings.</Alert.Description
												></Alert.Root
											>
										</div>{/if}
									<LeaderboardTable {board} {sample} loading={state === 'loading'} />
									{#if board.total > 0 && state !== 'loading'}<LeaderboardPagination {board} />{/if}
								{/if}
							</Tabs.Content>
						{/each}
					</Tabs.Root>
					<Card.Footer
						class="flex flex-wrap justify-between gap-3 border-t bg-muted/20 px-5 py-4 text-xs text-muted-foreground sm:px-6"
					>
						{#if state === 'error' || !snapshotAt}
							<span>Last update unavailable</span>
						{:else}
							<p class="flex flex-wrap gap-x-1">
								<span>Last updated ·</span><time datetime={snapshotAt}>{snapshot} EAT</time>
							</p>
						{/if}
						{#if period}<span>{period} ratings</span>{/if}
					</Card.Footer>
				</Card.Root>
			{/if}
		</Tabs.Content>
	{/each}
</Tabs.Root>
