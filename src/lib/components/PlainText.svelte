<script lang="ts">
	import QuillIcon from './icons/QuillIcon.svelte';
	import EyeIcon from './icons/EyeIcon.svelte';
	import { Message, type InputEncoding } from '$lib/model/Message.svelte';

	const ALL_ENCODINGS: InputEncoding[] = ['ROMAN', 'LATIN', 'ASCII', 'UTF8', 'HEX', 'BASE64'];
	const ENCODING_LABELS: Record<InputEncoding, string> = {
		ROMAN: 'Roman', LATIN: 'Latin', ASCII: 'ASCII', UTF8: 'UTF-8', HEX: 'Hex', BASE64: 'Base64'
	};

	interface Props {
		value: string;
		onchange?: (value: string) => void;
		icon?: 'quill' | 'eye';
		readonly?: boolean;
		/** When true, renders an encoding pill row below the input. */
		showEncodingPills?: boolean;
		/** Currently selected encoding; bind for two-way sync. */
		selectedEncoding?: InputEncoding;
		onEncodingChange?: (enc: InputEncoding) => void;
	}

	let {
		value = $bindable(),
		onchange,
		icon = 'quill',
		readonly = false,
		showEncodingPills = false,
		selectedEncoding = $bindable('ASCII'),
		onEncodingChange
	}: Props = $props();

	let validEncodings = $derived(Message.validEncodings(value));

	function selectEncoding(enc: InputEncoding) {
		selectedEncoding = enc;
		onEncodingChange?.(enc);
	}
</script>

<div class="plain-text-wrapper">
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
	{#if showEncodingPills}
	<div class="encoding-pills">
		{#each ALL_ENCODINGS as enc}
			<button
				class="pill"
				class:active={selectedEncoding === enc}
				class:disabled={!validEncodings.includes(enc)}
				disabled={!validEncodings.includes(enc)}
				onclick={() => selectEncoding(enc)}
			>{ENCODING_LABELS[enc]}</button>
		{/each}
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

	.plain-text-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.encoding-pills {
		display: flex;
		gap: 0.3rem;
		flex-wrap: wrap;
		justify-content: center;
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

	.pill.disabled {
		opacity: 0.35;
		cursor: not-allowed;
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
