<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Clock from '@lucide/svelte/icons/clock-3';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
</script>

<section id="calendar" aria-labelledby="events-heading" class="scroll-mt-6">
	<div class="mb-5">
		<h2 id="events-heading" class="text-xl font-semibold tracking-tight">Upcoming events</h2>
	</div>
	<Card.Root class="gap-5 [--card-spacing:--spacing(5)]">
		<Card.Header>
			<div class="mb-6 flex items-start justify-between gap-3">
				<time
					datetime="2026-11-14"
					class="flex w-16 flex-col overflow-hidden rounded-lg border text-center"
				>
					<span
						class="bg-primary px-2 py-1 text-[10px] font-semibold tracking-widest text-primary-foreground"
						>NOV 2026</span
					>
					<span class="py-2 text-2xl leading-none font-semibold tabular-nums">14</span>
				</time>
				<Badge variant="outline" class="text-muted-foreground">Sample event</Badge>
			</div>
			<Card.Title
				><h3 class="text-lg font-semibold tracking-tight">Dar es Salaam Open</h3></Card.Title
			>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-col gap-3 text-sm text-muted-foreground">
				<p class="flex items-center gap-2">
					<MapPin class="size-4" aria-hidden="true" />Dar es Salaam
				</p>
				<p class="flex items-center gap-2">
					<Clock class="size-4" aria-hidden="true" />Rapid · 15+10
				</p>
			</div>
		</Card.Content>
		<Card.Footer class="bg-background">
			<Dialog.Root>
				<Dialog.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="w-full justify-between">
							View event <ArrowUpRight class="size-3.5" aria-hidden="true" />
						</Button>
					{/snippet}
				</Dialog.Trigger>
				<Dialog.Content class="gap-5 p-6 sm:max-w-md">
					<Dialog.Header class="gap-2 text-left">
						<Badge variant="outline" class="mb-2">Sample event</Badge>
						<Dialog.Title>Dar es Salaam Open</Dialog.Title>
						<Dialog.Description>This event is fictional.</Dialog.Description>
					</Dialog.Header>
					<dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-y py-5 text-sm">
						<dt class="text-muted-foreground">Date</dt>
						<dd>14 November 2026</dd>
						<dt class="text-muted-foreground">Location</dt>
						<dd>Dar es Salaam</dd>
						<dt class="text-muted-foreground">Format</dt>
						<dd>Rapid · 15 minutes + 10 seconds</dd>
					</dl>
					<Dialog.Footer class="m-0 border-0 bg-transparent p-0">
						<Button disabled class="h-auto min-h-11 w-full py-2 whitespace-normal"
							>Registration unavailable</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</Card.Footer>
	</Card.Root>
</section>
