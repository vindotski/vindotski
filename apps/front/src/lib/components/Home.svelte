<!-- The full home page: what `/` shows outside teaser mode. -->
<script lang="ts">
	import type { Profile, Project } from '#lib/cms.js';

	let { profile, projects }: { profile: Profile; projects: Project[] } = $props();
</script>

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

	<nav class="flex gap-4">
		<a class="text-primary underline-offset-4 hover:underline" href="/about">About</a>
		{#each profile.links as link (link.url)}
			<a class="text-primary underline-offset-4 hover:underline" href={link.url}>{link.label}</a>
		{/each}
	</nav>
</main>
