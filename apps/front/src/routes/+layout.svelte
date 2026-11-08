<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { isPreview } from '#lib/env.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if isPreview}
		<!-- Error pages and anything without <Seo> are noindex on previews too. -->
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>

{@render children()}
