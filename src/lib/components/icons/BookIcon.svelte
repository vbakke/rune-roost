<script lang="ts">
	interface Props {
		open?: boolean;
	}
	
	let { open = false }: Props = $props();
</script>

{#if open}
	<!-- Open Book Icon -->
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M12 6.5C10.5 4.5 8.5 3.5 6 3.5C4.5 3.5 3 4 2 5V18.5C3 17.5 4.5 17 6 17C8.5 17 10.5 18 12 20C13.5 18 15.5 17 18 17C19.5 17 21 17.5 22 18.5V5C21 4 19.5 3.5 18 3.5C15.5 3.5 13.5 4.5 12 6.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M12 6.5V20" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M6 7.5C7 7.5 8 7.8 9 8.5" stroke="white" stroke-width="1" stroke-linecap="round"/>
		<path d="M6 10.5C7 10.5 8 10.8 9 11.5" stroke="white" stroke-width="1" stroke-linecap="round"/>
		<path d="M6 13.5C7 13.5 8 13.8 9 14.5" stroke="white" stroke-width="1" stroke-linecap="round"/>
		<path d="M18 7.5C17 7.5 16 7.8 15 8.5" stroke="white" stroke-width="1" stroke-linecap="round"/>
		<path d="M18 10.5C17 10.5 16 10.8 15 11.5" stroke="white" stroke-width="1" stroke-linecap="round"/>
		<path d="M18 13.5C17 13.5 16 13.8 15 14.5" stroke="white" stroke-width="1" stroke-linecap="round"/>
	</svg>
{:else}
	<!-- Closed Book Icon -->
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M6.5 3H20V21H6.5C5.83696 21 5.20107 20.7366 4.73223 20.2678C4.26339 19.7989 4 19.163 4 18.5V5.5C4 4.83696 4.26339 4.20107 4.73223 3.73223C5.20107 3.26339 5.83696 3 6.5 3Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M8 7H16" stroke="white" stroke-width="1" stroke-linecap="round"/>
		<path d="M8 10H16" stroke="white" stroke-width="1" stroke-linecap="round"/>
		<path d="M8 13H13" stroke="white" stroke-width="1" stroke-linecap="round"/>
	</svg>
{/if}

<style>
	svg {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
