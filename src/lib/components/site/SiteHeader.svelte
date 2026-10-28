<script lang="ts">
	import ChessKnight from '@lucide/svelte/icons/chess-knight';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { communityUrl } from '#lib/site.js';

	let {
		embedded = false,
		homePath = '/',
		currentPage
	}: { embedded?: boolean; homePath?: string; currentPage?: 'leaderboards' } = $props();

	const links = $derived([
		{ label: 'Home', href: `${homePath}#home` },
		{ label: 'Leaderboards', href: '/leaderboards' },
		{ label: 'Calendar', href: `${homePath}#calendar` }
	]);
	const planned = ['Blog', 'Shop', 'TACA'];
	let menuOpen = $state(false);
</script>

<header class={embedded ? 'hero-header' : 'border-b bg-background'}>
	<div
		class={[
			'flex items-center justify-between gap-4',
			embedded ? 'hero-header-inner' : 'site-container h-18'
		]}
	>
		<a
			href={`${homePath}#home`}
			class="flex shrink-0 items-center gap-2 rounded-md text-xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
			aria-label="chess.tz home"
		>
			<ChessKnight class="size-7" strokeWidth={1.6} aria-hidden="true" />
			<span>chess<span class={embedded ? 'text-inherit' : 'text-muted-foreground'}>.tz</span></span>
		</a>

		<nav aria-label="Main navigation" class="hidden items-center gap-0.5 lg:flex">
			{#each links as link (link.label)}
				<Button
					variant="ghost"
					href={link.href}
					aria-current={currentPage === 'leaderboards' && link.href === '/leaderboards'
						? 'page'
						: undefined}
					class={embedded ? 'text-foreground' : 'text-muted-foreground'}>{link.label}</Button
				>
			{/each}
			{#each planned as label (label)}
				<Button variant="ghost" disabled>{label}</Button>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<Button
				href={communityUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="hidden sm:inline-flex"
			>
				Join community <ArrowUpRight class="size-3.5" aria-hidden="true" />
			</Button>
			<Sheet.Root bind:open={menuOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon"
							class="size-11 lg:hidden"
							aria-label="Open navigation"
						>
							<svg
								class="size-6"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								aria-hidden="true"
							>
								<path d="M3 8h18M10 16h11" />
							</svg>
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content
					class={['overflow-y-auto', embedded && 'hero-menu-surface']}
					aria-describedby={undefined}
				>
					<Sheet.Header class="px-5 pt-6">
						<Sheet.Title class="flex items-center gap-2 pr-10 text-xl tracking-tight">
							<ChessKnight class="size-7" strokeWidth={1.6} aria-hidden="true" />
							chess.tz
						</Sheet.Title>
					</Sheet.Header>
					<nav aria-label="Mobile navigation" class="flex flex-col gap-1 px-4">
						{#each links as link (link.label)}
							<Button
								variant="ghost"
								href={link.href}
								aria-current={currentPage === 'leaderboards' && link.href === '/leaderboards'
									? 'page'
									: undefined}
								class="h-11 justify-start"
								onclick={() => (menuOpen = false)}
							>
								{link.label}
							</Button>
						{/each}
						{#each planned as label (label)}
							<Button variant="ghost" disabled class="h-11 justify-start">{label}</Button>
						{/each}
					</nav>
					<Sheet.Footer class="px-5 pb-6">
						<Button href={communityUrl} target="_blank" rel="noopener noreferrer">
							Join community <ArrowUpRight class="size-3.5" aria-hidden="true" />
						</Button>
					</Sheet.Footer>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</header>
