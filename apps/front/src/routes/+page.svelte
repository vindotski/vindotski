<script lang="ts">
	import { PUBLIC_SITE_NAME, PUBLIC_SITE_URL } from '$app/env/public';
	import Seo from '#lib/components/Seo.svelte';
</script>

<Seo
	description="{PUBLIC_SITE_NAME}: software engineer."
	path="/"
	type="profile"
	jsonLd={{ '@type': 'Person', name: PUBLIC_SITE_NAME, url: PUBLIC_SITE_URL }}
/>

<main class="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-4 p-6">
	<h1 class="font-heading text-4xl font-medium">{PUBLIC_SITE_NAME}</h1>
	<p class="text-muted-foreground">Coming together.</p>
</main>
