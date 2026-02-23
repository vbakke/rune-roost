<script lang="ts">
	interface Props {
		size?: string;
	}
	let { size = '3rem' }: Props = $props();
</script>

<svg style="width: {size}; height: {size}"
	xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
>
	<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
	<circle fill="black" cx="12" cy="12" r="3"></circle>
</svg>
