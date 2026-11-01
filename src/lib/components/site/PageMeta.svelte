<script lang="ts">
	import { siteUrl } from '#lib/site.js';
	/** Title, description, canonical link and link-preview tags for a public page. */
	let { title, description, path }: { title: string; description: string; path: string } = $props();
	const url = $derived(new URL(path, siteUrl).href);
	const image = new URL('/share.jpg', siteUrl).href;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="chess.tz" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="chess.tz: Chess brings us together." />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
