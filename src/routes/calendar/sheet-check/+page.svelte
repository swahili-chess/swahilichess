<script lang="ts">
	import { CircleAlert, CircleCheck } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import SiteHeader from '#lib/components/site/SiteHeader.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	let { data }: PageProps = $props();
	const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;
</script>

<svelte:head
	><title>Events sheet check · chess.tz</title><meta
		name="robots"
		content="noindex, nofollow"
	/></svelte:head
>
<Button href="#main-content" class="skip-link">Skip to content</Button>
<div class="flex min-h-dvh flex-col">
	<SiteHeader currentPage="calendar" />
	<main id="main-content" tabindex="-1" class="site-container flex-1 py-10 outline-none sm:py-14">
		<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Events sheet check</h1>
		<p class="mt-3 text-sm text-muted-foreground sm:text-base">
			Rows the calendar skipped, and how to fix them. Changes appear within about five minutes.
		</p>
		<div class="mt-8">
			{#if data.state === 'error'}
				<Alert.Root variant="destructive"
					><CircleAlert class="size-4" /><Alert.Title>The sheet couldn't be read</Alert.Title
					><Alert.Description
						>Check that both tabs are published to the web as CSV, then reload this page.</Alert.Description
					></Alert.Root
				>
			{:else}
				<p class="mb-6 text-sm">
					Showing {plural(data.events, 'event')} and prizes for {plural(
						data.prizes,
						'Lichess tournament'
					)}.
				</p>
				{#if data.problems.length}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Tab</Table.Head>
								<Table.Head class="w-20">Row</Table.Head>
								<Table.Head>Problem</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each data.problems as problem (`${problem.tab}-${problem.row}`)}
								<Table.Row>
									<Table.Cell>{problem.tab}</Table.Cell>
									<Table.Cell class="tabular-nums">{problem.row}</Table.Cell>
									<Table.Cell class="whitespace-normal">{problem.message}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{:else}
					<Empty.Root class="border">
						<Empty.Header>
							<Empty.Media variant="icon"><CircleCheck /></Empty.Media>
							<Empty.Title><h2>Every row is on the calendar</h2></Empty.Title>
							<Empty.Description>Rows marked Show: no are left out on purpose.</Empty.Description>
						</Empty.Header>
					</Empty.Root>
				{/if}
			{/if}
		</div>
	</main>
	<SiteFooter />
</div>
