<script lang="ts">
	import PlainText from '$lib/components/PlainText.svelte';
	import Key from '$lib/components/Key.svelte';
	import CipherText from '$lib/components/CipherText.svelte';
	import DiceIcon from '$lib/components/icons/DiceIcon.svelte';
	import SkillTreeIcon from '$lib/components/icons/SkillTreeIcon.svelte';
	import { Message, type InputEncoding } from '$lib/model/Message.svelte';
	import { SecretKey } from '$lib/model/sym/SecretKey.svelte';
	import { SymCaesar } from '$lib/model/sym/SymCaesar';
	import { SymAes } from '$lib/model/sym/SymAes';
	import type { AesMode } from '$lib/model/sym/AsyncSymmetricEncryption';

	type CipherMode = 'caesar' | AesMode;

	// ── Plain text state ──────────────────────────────────────────────────────
	let userInput = $state('ATTACK');
	let inputEncoding = $state<InputEncoding>('ROMAN');

	/** UTF-8 bytes of the plaintext, respecting selected encoding. */
	let plaintextBytes = $derived.by((): Uint8Array => {
		if (inputEncoding === 'HEX') {
			const clean = userInput.replace(/\s/g, '');
			if (clean.length % 2 !== 0) return new Uint8Array(0);
			return new Uint8Array(clean.match(/.{2}/g)!.map(h => parseInt(h, 16)));
		}
		if (inputEncoding === 'BASE64') {
			try {
				const bin = atob(userInput);
				return new Uint8Array([...bin].map(c => c.charCodeAt(0)));
			} catch { return new Uint8Array(0); }
		}
		return new TextEncoder().encode(userInput);
	});

	// ── Cipher mode ───────────────────────────────────────────────────────────
	let cipherMode: CipherMode = $state('caesar');

	const MODE_LABELS: Record<CipherMode, string> = {
		caesar: 'Caesar', ECB: 'AES-ECB', CBC: 'AES-CBC', CTR: 'AES-CTR', GCM: 'AES-GCM'
	};

	let caesarAllowed = $derived(inputEncoding === 'ROMAN' || inputEncoding === 'LATIN');

	// If encoding changes to non-Caesar, auto-switch away
	$effect(() => {
		if (!caesarAllowed && cipherMode === 'caesar') cipherMode = 'GCM';
	});

	// ── Secret key ────────────────────────────────────────────────────────────
	let alphabet = $derived(
		(inputEncoding as string) === 'LATIN' ? Message.LATIN_ALPHABET : Message.ROMAN_ALPHABET
	);
	let symmetricKey = $derived.by(() => new SecretKey(alphabet));
	let aesKey = $state(new SecretKey(Message.ROMAN_ALPHABET));

	$effect(() => {
		// Auto-generate AES key on first load
		if (!aesKey.keyBytes) {
			aesKey.generateAesKey(256);
		}
	});

	// ── IV / Nonce ────────────────────────────────────────────────────────────
	let autoIv = $state(true);
	let manualIvHex = $state('');

	function regenIv() {
		const len = cipherMode === 'GCM' ? 12 : 16;
		const bytes = crypto.getRandomValues(new Uint8Array(len));
		manualIvHex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
		autoIv = false;
	}

	// ── Encryption (async) ────────────────────────────────────────────────────
	const symAes = new SymAes();
	const symCaesar = $derived(new SymCaesar(alphabet));

	interface EncryptResult {
		cipher: Uint8Array | null;
		cipherText: string;    // Caesar output
		iv: Uint8Array | null;
		error: string | null;
	}

	let encryptResult: EncryptResult = $state({ cipher: null, cipherText: '', iv: null, error: null });

	// Derived after encryptResult so the reference is valid at evaluation time
	let ivDisplay = $derived.by(() => {
		if (!encryptResult.iv) return '';
		return Array.from(encryptResult.iv).map(b => b.toString(16).padStart(2, '0')).join('');
	});

	$effect(() => {
		const mode = cipherMode;
		const input = userInput;
		const bytes = plaintextBytes;
		const key = aesKey;

		if (mode === 'caesar') {
			const msg = new Message(input);
			const enc = symCaesar.encrypt(msg, symmetricKey);
			encryptResult = { cipher: null, cipherText: enc.plain, iv: null, error: null };
			return;
		}

		if (!key.cryptoKey) {
			encryptResult = { cipher: null, cipherText: '', iv: null, error: 'No AES key. Generate or paste one above.' };
			return;
		}

		// Compute IV locally — never write reactive state from inside .then()
		let ivArg: Uint8Array | undefined;
		if (!autoIv && manualIvHex.trim()) {
			const clean = manualIvHex.replace(/\s/g, '');
			if (clean.length % 2 === 0) {
				ivArg = new Uint8Array(clean.match(/.{2}/g)!.map(h => parseInt(h, 16)));
			}
		}
		// When autoIv=true, ivArg stays undefined → SymAes generates a fresh IV internally

		symAes.encrypt(bytes, key.cryptoKey, mode as AesMode, ivArg)
			.then((result: { cipher: Uint8Array; iv: Uint8Array | null }) => {
				encryptResult = { cipher: result.cipher, cipherText: '', iv: result.iv, error: null };
			})
			.catch((e: unknown) => {
				encryptResult = { cipher: null, cipherText: '', iv: null, error: String(e) };
			});
	});

	// ── Decryption (async) ────────────────────────────────────────────────────
	interface DecryptResult {
		plain: string;
		error: string | null;
	}

	let decryptResult: DecryptResult = $state({ plain: '', error: null });

	$effect(() => {
		const mode = cipherMode;
		const result = encryptResult;

		if (mode === 'caesar') {
			const cipherMsg = new Message(result.cipherText);
			const dec = symCaesar.decrypt(cipherMsg, symmetricKey);
			decryptResult = { plain: dec.plain, error: null };
			return;
		}

		if (!result.cipher || !aesKey.cryptoKey) {
			decryptResult = { plain: '', error: null };
			return;
		}

		symAes.decrypt(result.cipher, aesKey.cryptoKey, mode as AesMode, result.iv)
			.then((decBytes: Uint8Array) => {
				decryptResult = { plain: new TextDecoder().decode(decBytes), error: null };
			})
			.catch((e: unknown) => {
				decryptResult = { plain: '', error: String(e) };
			});
	});

	// ── ECB block repeat visualisation ───────────────────────────────────────
	/** Split cipher into 16-byte visual blocks for ECB demonstration */
	let ecbBlocks = $derived.by(() => {
		if (cipherMode !== 'ECB' || !encryptResult.cipher) return [];
		const blocks: string[] = [];
		for (let i = 0; i < encryptResult.cipher.length; i += 16) {
			blocks.push(
				Array.from(encryptResult.cipher.slice(i, i + 16))
					.map(b => b.toString(16).padStart(2, '0'))
					.join('')
			);
		}
		return blocks;
	});

	// ── Output encoding ───────────────────────────────────────────────────────
	let outputEncoding: 'hex' | 'base64' = $state('base64');

	// ── Caesar key dice roll ──────────────────────────────────────────────────
	function rollCaesarKey() {
		let counter = 10;
		const interval = setInterval(() => {
			symmetricKey.generateKey();
			counter--;
			if (counter <= 0) clearInterval(interval);
		}, 150);
	}
</script>

<svelte:head>
	<title>Symmetric Encryption — Training</title>
</svelte:head>

<div class="container">
	<div class="nav-header">
		<a href="/wīsdōm" class="skill-tree-link">
			<SkillTreeIcon />
			Tree of Knowledge
		</a>
		<h1>Symmetric Encryption</h1>
		<a href="/training" class="back-link">← Overview</a>
	</div>

	<!-- ── PLAIN TEXT PANE ─────────────────────────────────────────────────── -->
	<div class="pane" id="plaintext">
		<div class="pane-header">
			<h2>Plain Text</h2>
		</div>
		<div class="work-table">
			<div class="encryption-flow">
				<PlainText
					bind:value={userInput}
					showEncodingPills
					bind:selectedEncoding={inputEncoding}
				/>
			</div>
		</div>
	</div>

	<!-- ── CIPHER MODE PANE ───────────────────────────────────────────────── -->
	<div class="pane" id="mode">
		<div class="pane-header">
			<h2>Cipher Mode</h2>
		</div>
		<div class="mode-pills">
			{#each (Object.keys(MODE_LABELS) as CipherMode[]) as mode}
			<button
				class="mode-pill"
				class:active={cipherMode === mode}
				class:disabled={mode === 'caesar' && !caesarAllowed}
				class:warning={mode === 'ECB'}
				disabled={mode === 'caesar' && !caesarAllowed}
				onclick={() => cipherMode = mode}
			>
				{MODE_LABELS[mode]}
				{#if mode === 'ECB'}<span class="warn-badge" title="ECB is insecure — for educational use only">⚠</span>{/if}
			</button>
			{/each}
		</div>
		{#if cipherMode === 'ECB'}
		<div class="ecb-warning">
			⚠ <strong>AES-ECB is cryptographically insecure.</strong> Identical plaintext blocks
			produce identical ciphertext blocks, leaking structural information.
			This mode is included for educational purposes only.
		</div>
		{/if}
	</div>

	<!-- ── SECRET KEY PANE ────────────────────────────────────────────────── -->
	<div class="pane" id="key">
		<div class="pane-header">
			<h2>Secret Key</h2>
			{#if cipherMode === 'caesar'}
			<button class="dice-button" onclick={rollCaesarKey} title="Random key">
				<DiceIcon />
			</button>
			{/if}
		</div>
		<div class="work-table">
			<div class="encryption-flow">
				{#if cipherMode === 'caesar'}
				<Key
					value={symmetricKey.key.plain}
					type="gold"
					onclick={() => symmetricKey.generateNextSecretKey()}
				/>
				{:else}
				<Key keyMode="aes" value="" secretKey={aesKey} />
				{/if}
			</div>
		</div>
	</div>

	<!-- ── IV / NONCE PANE ───────────────────────────────────────────────── -->
	{#if cipherMode !== 'caesar' && cipherMode !== 'ECB'}
	<div class="pane" id="iv">
		<div class="pane-header">
			<h2>{cipherMode === 'CTR' ? 'Nonce / Counter' : 'IV'}</h2>
		</div>
		<div class="iv-body">
			<div class="iv-toggle">
				<button class="pill" class:active={autoIv} onclick={() => { autoIv = true; manualIvHex = ''; }}>Auto-generate</button>
				<button class="pill" class:active={!autoIv} onclick={() => { autoIv = false; if (!manualIvHex) regenIv(); }}>Manual</button>
			</div>
			{#if autoIv}
				<div class="iv-display">
					<span class="label">Last used {cipherMode === 'CTR' ? 'nonce' : 'IV'} (hex)</span>
					<code>{ivDisplay || '— auto-generated on each encrypt'}</code>
				</div>
			{:else}
				<div class="iv-display">
					<span class="label">Paste {cipherMode === 'CTR' ? 'nonce' : 'IV'} (hex, {cipherMode === 'GCM' ? '12' : '16'} bytes)</span>
					<input class="iv-input" bind:value={manualIvHex} placeholder="hex…" spellcheck="false" />
					<button class="action-btn" onclick={regenIv}>Generate new</button>
				</div>
			{/if}
		</div>
	</div>
	{/if}

	<!-- ── ENCRYPT / CIPHER TEXT PANE ─────────────────────────────────────── -->
	<div class="pane" id="ciphertext">
		<div class="pane-header">
			<h2>Cipher Text</h2>
		</div>
		<div class="work-table">
			{#if encryptResult.error}
			<div class="error">{encryptResult.error}</div>
			{:else if cipherMode === 'caesar'}
			<div class="encryption-flow">
				<PlainText value={userInput} readonly />
				<div class="arrow">→</div>
				<Key value={symmetricKey.key.plain} type="gold" reverse={false} />
				<div class="arrow">→</div>
				<CipherText value={encryptResult.cipherText} />
			</div>
			{:else if encryptResult.cipher}
			<div class="encryption-flow">
				<div class="bytes-badge">{plaintextBytes.length} B plaintext</div>
				<div class="arrow">→</div>
				<div class="algo-badge">{cipherMode}</div>
				<div class="arrow">→</div>
				<CipherText
					value=""
					rawBytes={encryptResult.cipher}
					showEncodingPills
					bind:outputEncoding
				/>
			</div>
			{:else}
			<div class="placeholder">Enter a key and plaintext to see ciphertext here.</div>
			{/if}
		</div>

		<!-- ECB block visualisation -->
		{#if cipherMode === 'ECB' && ecbBlocks.length > 0}
		<div class="ecb-blocks">
			<span class="label">Ciphertext blocks (16 B each) — identical plaintext blocks → identical ciphertext blocks:</span>
			<div class="block-row">
				{#each ecbBlocks as block, i}
				<div class="ecb-block" title="Block {i+1}">{block.slice(0, 8)}…</div>
				{/each}
			</div>
		</div>
		{/if}
	</div>

	<!-- ── DECRYPT / VERIFY PANE ──────────────────────────────────────────── -->
	<div class="pane" id="decrypt">
		<div class="pane-header">
			<h2>Decrypted</h2>
		</div>
		<div class="work-table">
			{#if decryptResult.error}
			<div class="error">{decryptResult.error}</div>
			{:else if cipherMode === 'caesar'}
			<div class="encryption-flow">
				<CipherText value={encryptResult.cipherText} />
				<div class="arrow">→</div>
				<Key value={symmetricKey.key.plain} type="gold" reverse={true} />
				<div class="arrow">→</div>
				<PlainText value={decryptResult.plain} icon="eye" readonly />
			</div>
			{:else if encryptResult.cipher && decryptResult.plain}
			<div class="encryption-flow">
				<div class="bytes-badge">{encryptResult.cipher.length} B ciphertext</div>
				<div class="arrow">→</div>
				<div class="algo-badge">{cipherMode}</div>
				<div class="arrow">→</div>
				<PlainText value={decryptResult.plain} icon="eye" readonly />
			</div>
			{:else}
			<div class="placeholder">Encrypt something above first.</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	.nav-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-tree-link, .back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		transition: background-color 0.2s;
	}

	.skill-tree-link:hover, .back-link:hover {
		background-color: rgba(102, 126, 234, 0.1);
	}

	h1 {
		text-align: center;
		font-size: 1.8rem;
		margin: 0;
	}

	.pane {
		display: grid;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		margin-bottom: 0.75rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		scroll-margin-top: 2rem;
	}

	.pane-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	h2 {
		color: white;
		margin: 0;
		font-size: 1.2rem;
	}

	.work-table {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.encryption-flow {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.arrow {
		font-size: 2.5rem;
		color: white;
		font-weight: bold;
	}

	/* ── Mode pills ── */
	.mode-pills {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 0.25rem;
	}

	.mode-pill {
		padding: 0.4rem 1rem;
		border-radius: 999px;
		border: 2px solid rgba(255,255,255,0.5);
		background: rgba(255,255,255,0.12);
		color: white;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.mode-pill.active {
		background: rgba(255,255,255,0.88);
		color: #4a2080;
		border-color: white;
	}

	.mode-pill.warning.active {
		background: #fff3cd;
		color: #856404;
		border-color: #ffc107;
	}

	.mode-pill.disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.warn-badge {
		font-size: 0.9rem;
	}

	.ecb-warning {
		margin-top: 0.6rem;
		background: rgba(255, 200, 0, 0.15);
		border-left: 3px solid #ffc107;
		border-radius: 4px;
		padding: 0.5rem 0.75rem;
		color: #fff3cd;
		font-size: 0.83rem;
	}

	/* ── IV section ── */
	.iv-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.iv-toggle {
		display: flex;
		gap: 0.35rem;
	}

	.iv-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.iv-input {
		font-family: monospace;
		font-size: 0.8rem;
		padding: 0.3rem 0.5rem;
		border-radius: 6px;
		border: 1px solid rgba(255,255,255,0.3);
		background: rgba(0,0,0,0.3);
		color: #ecdfff;
		flex: 1;
		min-width: 180px;
	}

	.iv-display code {
		font-family: monospace;
		font-size: 0.75rem;
		color: #ecdfff;
		word-break: break-all;
	}

	.label {
		font-size: 0.7rem;
		color: rgba(255,255,255,0.65);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* ── ECB blocks ── */
	.ecb-blocks {
		margin-top: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.block-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.ecb-block {
		font-family: monospace;
		font-size: 0.65rem;
		padding: 0.25rem 0.4rem;
		border-radius: 4px;
		background: rgba(0,0,0,0.35);
		color: #ecdfff;
		cursor: default;
	}

	/* ── Misc ── */
	.bytes-badge, .algo-badge {
		font-size: 0.78rem;
		font-weight: 600;
		color: white;
		background: rgba(0,0,0,0.25);
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
	}

	.placeholder {
		color: rgba(255,255,255,0.55);
		font-size: 0.9rem;
		font-style: italic;
	}

	.error {
		color: #ff8080;
		font-size: 0.85rem;
	}

	.pill {
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		border: 1.5px solid rgba(255,255,255,0.4);
		background: rgba(255,255,255,0.12);
		color: rgba(255,255,255,0.8);
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

	.dice-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.dice-button:hover { transform: scale(1.1); }
	.dice-button:active { transform: scale(0.95); }
	.dice-button :global(svg) { width: 2rem; }

	@media (max-width: 768px) {
		h1 { font-size: 1.4rem; }
		.encryption-flow { gap: 0.75rem; }
		.arrow { font-size: 1.8rem; }
	}
</style>
