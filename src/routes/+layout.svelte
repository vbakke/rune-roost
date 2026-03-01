<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { learnedSkills } from '$lib/skills/learnedSkills';
	import StatusBar from '$lib/components/StatusBar.svelte';

	let { children } = $props();
	
	// Show status bar only when user has learned something and not on welcome page
	let showStatusBar = $derived($learnedSkills.size > 0 && $page.url.pathname !== '/');
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

{#if showStatusBar}
	<StatusBar />
{/if}

{@render children()}
