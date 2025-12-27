<script lang="ts">
	// This is just a marker component - doesn't render anything special
	// It's used by the Book component to identify individual pages
	
	import type { Snippet } from 'svelte';
	
	interface Props {
		children: Snippet;
	}
	
	let { children }: Props = $props();
</script>

<div data-page-marker>
	{@render children()}
</div>
