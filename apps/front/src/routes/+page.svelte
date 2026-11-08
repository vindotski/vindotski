<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import Seo from '#lib/components/Seo.svelte';
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

<main class="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-8 p-6">
	<header class="flex flex-col gap-2">
		<h1 class="font-heading text-4xl font-medium">{profile.name}</h1>
		{#if profile.headline}
			<p class="text-muted-foreground text-lg">{profile.headline}</p>
		{/if}
	</header>

	{#if projects.length}
		<section class="flex flex-col gap-3">
			<h2 class="font-heading text-xl font-medium">Projects</h2>
			<ul class="flex flex-col gap-2">
				{#each projects as project (project.documentId)}
					<li>
						<span class="font-medium">{project.title}</span>
						{#if project.summary}<span class="text-muted-foreground"> · {project.summary}</span>{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if profile.links.length}
		<nav class="flex gap-4">
			{#each profile.links as link (link.url)}
				<a class="text-primary underline-offset-4 hover:underline" href={link.url}>{link.label}</a>
			{/each}
		</nav>
	{/if}
</main>
