<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import Home from '#lib/components/Home.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Teaser from '#lib/components/Teaser.svelte';
	import { isTeaser } from '#lib/env.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { profile, projects } = $derived(data);
</script>

<Seo
	description={profile.headline ?? profile.name}
	path="/"
	type="profile"
	jsonLd={{
		'@type': 'Person',
		name: profile.name,
		jobTitle: profile.headline ?? undefined,
		url: PUBLIC_SITE_URL,
		sameAs: profile.links.map((link) => link.url)
	}}
/>

{#if isTeaser}
	<Teaser {profile} />
{:else}
	<Home {profile} {projects} />
{/if}
