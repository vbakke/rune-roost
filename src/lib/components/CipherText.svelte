<script lang="ts">
	import ScrollIcon from './icons/ScrollIcon.svelte';

	type OutputEncoding = 'hex' | 'base64';

	interface Props {
		value: string;
		/** Raw binary ciphertext; when provided, overrides `value` for display. */
		rawBytes?: Uint8Array | null;
		/** When true, renders hex/base64 pill selector below the output. */
		showEncodingPills?: boolean;
		/** Currently selected output encoding; bind for two-way sync. */
		outputEncoding?: OutputEncoding;
		onOutputEncodingChange?: (enc: OutputEncoding) => void;
	}

	let {
		value,
		rawBytes = null,
		showEncodingPills = false,
		outputEncoding = $bindable('base64'),
		onOutputEncodingChange
	}: Props = $props();

	let displayed = $derived.by(() => {
		if (!rawBytes) return value;
		if (outputEncoding === 'hex') {
			return Array.from(rawBytes).map(b => b.toString(16).padStart(2, '0')).join('');
		}
		return btoa(String.fromCharCode(...rawBytes));
	});

	function selectEncoding(enc: OutputEncoding) {
		outputEncoding = enc;
		onOutputEncodingChange?.(enc);
	}
</script>

<div class="cipher-wrapper">
	<div class="desk scroll">
		<div class="desk-output">{displayed}</div>
		<div class="desk-icon"><ScrollIcon /></div>
	</div>
	{#if showEncodingPills}
	<div class="encoding-pills">
		<button
			class="pill"
			class:active={outputEncoding === 'hex'}
			onclick={() => selectEncoding('hex')}
		>Hex</button>
		<button
			class="pill"
			class:active={outputEncoding === 'base64'}
			onclick={() => selectEncoding('base64')}
		>Base64</button>
	</div>
	{/if}
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

	.cipher-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.encoding-pills {
		display: flex;
		gap: 0.3rem;
	}

	.pill {
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		border: 1.5px solid rgba(255,255,255,0.5);
		background: rgba(255,255,255,0.15);
		color: white;
		font-size: 0.72rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.pill.active {
		background: rgba(255,255,255,0.85);
		color: #4a2080;
		border-color: white;
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
