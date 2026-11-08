<!-- The teaser: what `/` shows in teaser mode (PUBLIC_TEASER=true). Indexable: name, headline, links. -->
<script lang="ts">
	import type { Profile } from '#lib/cms.js';

	let { profile }: { profile: Profile } = $props();
</script>

<main class="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-4 p-6">
	<h1 class="font-heading text-4xl font-medium">{profile.name}</h1>
	{#if profile.headline}
		<p class="text-muted-foreground text-lg">{profile.headline}</p>
	{/if}
	<p class="text-muted-foreground">Something new is on its way.</p>
	{#if profile.links.length}
		<nav class="flex gap-4">
			{#each profile.links as link (link.url)}
				<a class="text-primary underline-offset-4 hover:underline" href={link.url}>{link.label}</a>
			{/each}
		</nav>
	{/if}
</main>
