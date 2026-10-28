<script lang="ts">
	import './layout.css';
	import type { LayoutProps } from './$types';
	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#fafafa" />
	<link rel="icon" type="image/png" href="/logo.png" />
</svelte:head>

{@render children()}
