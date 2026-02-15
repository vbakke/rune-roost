<script lang="ts">
	import ScrollIcon from './icons/ScrollIcon.svelte';
	
	interface Props {
		value: string;
	}
	
	let { value }: Props = $props();
</script>

<div class="desk scroll">
	<div class="desk-output">{value}</div>
	<div class="desk-icon"><ScrollIcon /></div>
</div>

<style>
	.desk {
		display: flex;		
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
	}

	.desk-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
	}

	.desk-output {
		font-size: 2rem;
		font-weight: bold;
		text-align: center;
		min-width: 80px;
		flex: 0 0 auto;
		border: none;
		background: transparent;
		color: #333;
	}

	.desk.scroll {
		cursor: default;
		background-color: #8574e3;
	}

	@media (max-width: 768px) {
		.desk {
			padding: 1rem;
			width: 100%;
		}

		.desk-icon {
			font-size: 2.5rem;
		}

		.desk-output {
			font-size: 2rem;
			min-width: 100px;
		}
	}
</style>
