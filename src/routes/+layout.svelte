<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Preconnect to improve performance -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	
	<!-- Viewport for mobile -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<style>
	:global(.blur) {
		filter: blur(6px);
		pointer-events: none;
		user-select: none;
	}
	:global(.unblur) {
		filter: blur(0);
		pointer-events: auto;
		user-select: auto;
		transition: filter 0.6s ease-in-out;
	}
</style>
{@render children()}
