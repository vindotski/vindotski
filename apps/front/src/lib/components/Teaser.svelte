<!-- The teaser: what `/` shows while the site is in teaser mode (PUBLIC_TEASER=true). -->
<script lang="ts">
	import { PUBLIC_SITE_NAME } from '$app/env/public';
</script>

<main class="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-4 p-6">
	<h1 class="font-heading text-4xl font-medium">{PUBLIC_SITE_NAME}</h1>
	<p class="text-muted-foreground">Something new is on its way.</p>
</main>
