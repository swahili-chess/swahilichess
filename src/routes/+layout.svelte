<script lang="ts">
	import './layout.css';
	import type { LayoutProps } from './$types';
	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#fafafa" />
	<link rel="icon" href="/favicon.ico" sizes="32x32 48x48" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

{@render children()}
