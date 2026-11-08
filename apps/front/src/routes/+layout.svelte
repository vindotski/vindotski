<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import favicon from '#lib/assets/favicon.svg';
	import Wordmark from '#lib/components/Wordmark.svelte';
	import { isPreview } from '#lib/env.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// A hint for the curious, without giving anything away.
	onMount(() => console.log('Some names read both ways. Try knocking three times.'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if isPreview}
		<!-- Error pages and anything without <Seo> are noindex on previews too. -->
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>

<header class="mx-auto flex max-w-2xl p-6">
	<Wordmark />
</header>

{@render children()}
