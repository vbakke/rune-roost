<script lang="ts">
	interface Props {
		value: string;
		type?: 'gold' | 'silver';
		reverse?: boolean;
		onclick?: () => void;
	}
	
	let { value, type = 'gold', reverse = false, onclick }: Props = $props();
</script>

<div class="key">
	<div class="key-icon {type} {onclick ? 'clickable' : ''}">
		{#if onclick}
			<button onclick={onclick}>🔑</button>
		{:else}
			🔑
		{/if}
	</div>
	<div class="key-value"><span class="operator" class:gold={reverse}>{reverse ? '⊖' : '⊕'}</span> <span class="digit">{value}</span></div>
</div>

<style>
	.key {
		cursor: default;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.key-icon {
		font-size: 2rem;
		text-shadow: 
			1px 1px 3px rgba(0, 0, 0, 0.6),
			0 0 8px rgba(192, 192, 192, 0.5);
		user-select: none;
	}

	.key-icon.clickable {
		cursor: pointer;
	}
	.key-icon.clickable:hover {
		transform: scale(1.15);
		transition: transform 0.1s ease-in-out;
	}
	
	.key-icon.gold {
		filter: hue-rotate(-15deg) saturate(2) brightness(1.2) contrast(1.2);
	}
	
	.key-icon.silver {
		filter: grayscale(100%) brightness(1.1) contrast(1.3);
	}

	.key-icon button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: inherit;
	}
	
	.key-value {
		display: flex;
		align-items: center;
		font-weight: bold;
		color: #ecdfff;
		padding: 0.25rem 0.75rem;
		border-radius: 8px;
		gap: 4px;
		background: rgba(0, 0, 0, 0.2);
	}

	.digit {
		font-size: 1.6em;
		font-weight: bold;
		color: #ecdfff;
	}

	.operator {
		font-size: 1.2em;
		color: #ecdfff;
		font-weight: bold;
	}
	.operator.gold {
		color: #f5c518;
	}

	@media (max-width: 768px) {
		.key {
			flex-direction: row;
		}
	}
</style>
