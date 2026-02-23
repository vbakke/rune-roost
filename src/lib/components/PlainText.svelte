<script lang="ts">
	import QuillIcon from './icons/QuillIcon.svelte';
	import EyeIcon from './icons/EyeIcon.svelte';
	
	interface Props {
		value: string;
		onchange?: (value: string) => void;
		icon?: 'quill' | 'eye';
		readonly?: boolean;
	}
	
	let { value = $bindable(), onchange, icon = 'quill', readonly = false }: Props = $props();
</script>

<div class="desk scribe {readonly ? '' : 'clickable'}">
	<input
		class="desk-input"
		bind:value={value}
		size="{value.length || 1}"
		{readonly}
	/>
	<div class="desk-icon">
		{#if icon === 'eye'}
			<EyeIcon />
		{:else}
			<QuillIcon />
		{/if}
	</div>
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

	.desk-input {
		font-size: 2rem;
		font-weight: bold;
		text-align: center;
		min-width: 80px;
		flex: 0 0 auto;
		border: none;
		background: transparent;
		color: #333;
		border-bottom: 2px solid #667eea;
		padding: 0.25rem;
	}

	.desk-input:focus {
		outline: none;
		border-bottom-color: #764ba2;
	}

	.desk.scribe {
		background: rgba(255, 255, 255, 0.7);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.desk.scribe.clickable:hover {
		background: rgba(255, 255, 255, 0.9);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 768px) {
		.desk {
			padding: 1rem;
			width: 100%;
		}

		.desk-icon {
			font-size: 2.5rem;
		}

		.desk-input {
			font-size: 2rem;
			min-width: 100px;
		}
	}
</style>
