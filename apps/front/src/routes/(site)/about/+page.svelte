<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { profile } = $derived(data);
</script>

<Seo
	title="About"
	description={profile.bio ?? profile.headline ?? profile.name}
	path="/about"
	image={profile.avatar?.url}
/>

<main class="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-4 p-6">
	<h1 class="font-heading text-3xl font-medium">About</h1>
	{#if profile.bio}<p>{profile.bio}</p>{/if}
	{#if profile.location}<p class="text-muted-foreground">{profile.location}</p>{/if}
	<a class="text-primary underline-offset-4 hover:underline" href="/">Home</a>
</main>
