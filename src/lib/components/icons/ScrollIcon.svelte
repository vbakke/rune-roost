<script lang="ts">
	interface Props {
		size?: string;
	}
	let { size = '3rem' }: Props = $props();
</script>

<div class="scroll-emoji" style="font-size: {size}">📜</div>

<style>
	.scroll-emoji {
		font-size: 3rem;
	}
</style>
