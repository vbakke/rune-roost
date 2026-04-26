<script lang="ts">
	import type { SecretKey, KdfType, NormForm } from '$lib/model/sym/SecretKey.svelte';

	type KeyMode = 'caesar' | 'aes';
	type AesTab = 'binary' | 'password';

	interface Props {
		/** Caesar key display value; ignored when keyMode='aes'. */
		value?: string;
		type?: 'gold' | 'silver';
		reverse?: boolean;
		onclick?: () => void;
		/** When 'aes', renders AES key management UI instead of the Caesar display. */
		keyMode?: KeyMode;
		/** SecretKey instance; required when keyMode='aes'. */
		secretKey?: SecretKey;
	}

	let { value, type = 'gold', reverse = false, onclick, keyMode = 'caesar', secretKey }: Props = $props();

	// ── AES UI state ──────────────────────────────────────────────────────────
	let aesTab: AesTab = $state('binary');
	let binaryInput = $state('');
	let binaryInputMode: 'hex' | 'base64' = $state('hex');

	let password = $state('');
	let normForm: NormForm = $state('NFC');
	let kdf: KdfType = $state('PBKDF2');
	let saltHex = $state('');
	let argon2Loading = $state(false);
	let kdfError = $state('');

	// Show byte-length differences for each norm form (educational)
	let normPreview = $derived.by(() => {
		if (!password) return null;
		const forms: NormForm[] = ['NFC', 'NFD', 'NFKC', 'NFKD'];
		return forms.map(f => ({
			form: f,
			bytes: new TextEncoder().encode(password.normalize(f)).length
		}));
	});

	function generateSalt() {
		const bytes = crypto.getRandomValues(new Uint8Array(16));
		saltHex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
	}

	async function applyBinaryKey() {
		if (!secretKey) return;
		if (binaryInputMode === 'hex') await secretKey.fromHex(binaryInput);
		else await secretKey.fromBase64(binaryInput);
	}

	async function generateAesKey(bits: 128 | 192 | 256) {
		if (!secretKey) return;
		await secretKey.generateAesKey(bits);
		binaryInput = secretKey.keyBytesDisplay;
	}

	async function deriveFromPassword() {
		if (!secretKey || !password) return;
		kdfError = '';
		if (!saltHex) generateSalt();
		const saltBytes = new Uint8Array(saltHex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
		try {
			if (kdf === 'argon2') argon2Loading = true;
			await secretKey.fromPassword(password, normForm, kdf, saltBytes);
		} catch (e: unknown) {
			kdfError = e instanceof Error ? e.message : String(e);
		} finally {
			argon2Loading = false;
		}
	}
</script>

{#if keyMode === 'caesar'}
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

{:else}
<!-- AES Key UI -->
<div class="aes-key">
	<div class="key-icon gold" style="font-size:2rem;text-align:center;">🔑</div>

	<!-- Tab selector -->
	<div class="tabs">
		<button class="tab" class:active={aesTab === 'binary'} onclick={() => aesTab = 'binary'}>Binary</button>
		<button class="tab" class:active={aesTab === 'password'} onclick={() => aesTab = 'password'}>Password</button>
	</div>

	{#if aesTab === 'binary'}
	<!-- Binary key tab -->
	<div class="tab-body">
		<div class="row">
			<button class="pill" class:active={binaryInputMode === 'hex'} onclick={() => binaryInputMode = 'hex'}>Hex</button>
			<button class="pill" class:active={binaryInputMode === 'base64'} onclick={() => binaryInputMode = 'base64'}>Base64</button>
		</div>
		<textarea
			class="key-input"
			bind:value={binaryInput}
			placeholder="{binaryInputMode === 'hex' ? 'Paste hex key…' : 'Paste base64 key…'}"
			rows="2"
			spellcheck="false"
		></textarea>
		<div class="row gap">
			<button class="action-btn" onclick={applyBinaryKey}>Apply key</button>
			<button class="action-btn" onclick={() => generateAesKey(128)}>Gen 128-bit</button>
			<button class="action-btn" onclick={() => generateAesKey(192)}>Gen 192-bit</button>
			<button class="action-btn" onclick={() => generateAesKey(256)}>Gen 256-bit</button>
		</div>
		{#if secretKey?.keyBytes}
		<div class="row gap">
			<span class="key-meta">{secretKey.aesKeyBits} bit</span>
			<button class="pill" class:active={secretKey.keyDisplayEncoding === 'hex'} onclick={() => { if (secretKey) secretKey.keyDisplayEncoding = 'hex'; }}>Hex</button>
			<button class="pill" class:active={secretKey.keyDisplayEncoding === 'base64'} onclick={() => { if (secretKey) secretKey.keyDisplayEncoding = 'base64'; }}>Base64</button>
		</div>
		<div class="key-display">{secretKey.keyBytesDisplay}</div>
		{/if}
	</div>

	{:else}
	<!-- Password tab -->
	<div class="tab-body">
		<input
			class="pass-input"
			type="text"
			bind:value={password}
			placeholder="Enter password…"
		/>

		{#if normPreview}
		<div class="norm-section">
			<span class="label">Unicode normalisation</span>
			<div class="row gap">
				{#each normPreview as p}
				<button
					class="pill"
					class:active={normForm === p.form}
					onclick={() => normForm = p.form}
					title="{p.bytes} bytes in UTF-8"
				>{p.form} <span class="byte-count">({p.bytes}B)</span></button>
				{/each}
			</div>
		</div>
		{/if}

		<div class="salt-row">
			<span class="label">Salt (hex)</span>
			<input class="salt-input" bind:value={saltHex} placeholder="16-byte hex…" spellcheck="false" />
			<button class="action-btn small" onclick={generateSalt}>Regen</button>
		</div>

		<div class="kdf-row">
			<span class="label">KDF</span>
			<div class="row gap">
				{#each (['PBKDF2', 'bcrypt', 'argon2'] as KdfType[]) as k}
				<button class="pill" class:active={kdf === k} onclick={() => kdf = k}>{k}</button>
				{/each}
			</div>
		</div>

		<button class="action-btn derive-btn" onclick={deriveFromPassword} disabled={!password || argon2Loading}>
			{#if argon2Loading}Loading Argon2…{:else}Derive key{/if}
		</button>
		{#if kdfError}<div class="error">{kdfError}</div>{/if}

		{#if secretKey?.keyBytes}
		<div class="row gap">
			<span class="key-meta">{secretKey.aesKeyBits} bit</span>
			<button class="pill" class:active={secretKey.keyDisplayEncoding === 'hex'} onclick={() => { if (secretKey) secretKey.keyDisplayEncoding = 'hex'; }}>Hex</button>
			<button class="pill" class:active={secretKey.keyDisplayEncoding === 'base64'} onclick={() => { if (secretKey) secretKey.keyDisplayEncoding = 'base64'; }}>Base64</button>
		</div>
		<div class="key-display">{secretKey.keyBytesDisplay}</div>
		{/if}
	</div>
	{/if}
</div>
{/if}


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

	/* ── AES key UI ─────────────────────────────────────────── */

	.aes-key {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		background: rgba(0,0,0,0.25);
		border-radius: 10px;
		padding: 0.75rem 1rem;
		min-width: 260px;
		max-width: 340px;
	}

	.tabs {
		display: flex;
		gap: 0.25rem;
		background: rgba(0,0,0,0.2);
		border-radius: 6px;
		padding: 2px;
	}

	.tab {
		padding: 0.25rem 0.9rem;
		border-radius: 5px;
		border: none;
		background: transparent;
		color: rgba(255,255,255,0.6);
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}

	.tab.active {
		background: rgba(255,255,255,0.85);
		color: #4a2080;
	}

	.tab-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.key-input, .pass-input, .salt-input {
		width: 100%;
		font-size: 0.78rem;
		font-family: monospace;
		padding: 0.4rem 0.5rem;
		border-radius: 6px;
		border: 1px solid rgba(255,255,255,0.25);
		background: rgba(0,0,0,0.3);
		color: #ecdfff;
		resize: vertical;
		box-sizing: border-box;
	}

	.pass-input {
		font-family: inherit;
		font-size: 0.9rem;
	}

	.row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.row.gap { gap: 0.35rem; }

	.pill {
		padding: 0.15rem 0.55rem;
		border-radius: 999px;
		border: 1.5px solid rgba(255,255,255,0.4);
		background: rgba(255,255,255,0.12);
		color: rgba(255,255,255,0.8);
		font-size: 0.7rem;
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

	.action-btn {
		padding: 0.25rem 0.65rem;
		border-radius: 6px;
		border: 1px solid rgba(255,255,255,0.3);
		background: rgba(255,255,255,0.15);
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}

	.action-btn:hover { background: rgba(255,255,255,0.28); }
	.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
	.action-btn.small { padding: 0.15rem 0.5rem; }

	.derive-btn {
		width: 100%;
		padding: 0.4rem;
		font-size: 0.85rem;
	}

	.key-display {
		font-family: monospace;
		font-size: 0.7rem;
		word-break: break-all;
		color: #ecdfff;
		background: rgba(0,0,0,0.3);
		border-radius: 5px;
		padding: 0.35rem 0.5rem;
	}

	.key-meta {
		font-size: 0.72rem;
		color: rgba(255,255,255,0.6);
	}

	.norm-section, .salt-row, .kdf-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.salt-row {
		flex-direction: row;
		align-items: center;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.salt-input { flex: 1; }

	.label {
		font-size: 0.7rem;
		color: rgba(255,255,255,0.6);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.byte-count { font-weight: 400; }

	.error {
		font-size: 0.75rem;
		color: #ff8080;
	}

	@media (max-width: 768px) {
		.key { flex-direction: row; }
	}
</style>