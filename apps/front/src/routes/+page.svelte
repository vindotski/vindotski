<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import Home from '#lib/components/Home.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Teaser from '#lib/components/Teaser.svelte';
	import { isTeaser } from '#lib/env.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { profile, projects } = $derived(data);

	// Profiles elsewhere (LinkedIn, GitHub): web links only, not mailto:.
	const profileUrls = $derived(
		profile.links.map((link) => link.url).filter((url) => /^https?:\/\//.test(url))
	);
</script>

<Seo
	description={profile.headline ?? profile.name}
	path="/"
	type="profile"
	image={profile.avatar?.url}
	jsonLd={{
		'@type': 'Person',
		name: profile.name,
		jobTitle: profile.role ?? undefined,
		description: profile.headline ?? undefined,
		image: profile.avatar?.url,
		url: PUBLIC_SITE_URL,
		sameAs: profileUrls
	}}
/>

{#if isTeaser}
	<Teaser {profile} />
{:else}
	<Home {profile} {projects} />
{/if}
