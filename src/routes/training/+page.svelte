<script lang="ts">
	import { goto } from '$app/navigation';
	import RavenIcon from '$lib/components/icons/RavenIcon.svelte';
	import PlainText from '$lib/components/PlainText.svelte';
	import Key from '$lib/components/Key.svelte';
    import SkillTreeIcon from '$lib/components/icons/SkillTreeIcon.svelte';
    import DiceIcon from '$lib/components/icons/DiceIcon.svelte';
	import CipherText from '$lib/components/CipherText.svelte';
	import DecryptLessonModal from '$lib/components/DecryptLessonModal.svelte';
	import { Message } from '$lib/model/Message.svelte';
	import type { SymmetricEncryption } from '$lib/model/sym/SymmetricEncryption';
	import type { AsymmetricEncryption } from '$lib/model/asym/AsymmetricCertificate';
	import { AsymCaesarRot } from '$lib/model/asym/AsymCaesarRot';
	import { AsymCaesarRotCertificate } from '$lib/model/asym/AesCaesarRotCertificate.svelte';
	import { SymCaesar } from '$lib/model/sym/SymCaesar';
	import { SecretKey } from '$lib/model/sym/SecretKey.svelte';
    
	import { learnedSkills } from '$lib/skills/learnedSkills';
    import { CaesarHash } from '$lib/model/hash/CaesarHash';
 
	import { canAccess } from '$lib/skills/skillTree';
    import { decryptionModalStore } from '$lib/stores/decryptionModalStore';
    import { prefNow } from '$lib/utils/utils.ts';
	import { appState } from '$lib/stores/appState';

	let showSymmetricDecrypt = $derived(
		$learnedSkills.has('sym.decrypt')
	);

	let showAsymmetricDecrypt = $derived(
		$learnedSkills.has('asym.decrypt')
	);

	// Get alphabet from global appState (reactive to changes in StatusBar)
	let alphabet = $derived(
		$appState.selectedAlphabet === 'LATIN' 
			? Message.LATIN_ALPHABET 
			: Message.ROMAN_ALPHABET
	);

	// 2. Simple reactive state for user text input
	let userInput = $state("ATTACK");

	// 3. Derived MessageModel (auto-creates when userInput changes)
	let message = $derived(new Message(userInput));

	// 4. Keys are now reactive to alphabet changes
	let symmetricKey = $derived.by(() => {
		const key = new SecretKey(alphabet);
		let asymCert = new AsymCaesarRotCertificate(alphabet);
		while (key.key.plain === asymCert.publicKey.plain) {
			key.generateKey();
		}
		return key;
	});

	let asymmetricCert = $derived.by(() => {
		return new AsymCaesarRotCertificate(alphabet);
	});

	// 5. Encryption algorithms (recreate when alphabet changes to use correct alphabet)
	let symmetricCipher = $derived.by(() => new SymCaesar());
	let asymmetricCipher = $derived.by(() => new AsymCaesarRot(alphabet));
	
	// 6. Derived encrypted results (auto-update when message changes)
	let symmetricEncrypted = $derived(symmetricCipher.encrypt(message, symmetricKey));
	let asymmetricEncrypted = $derived(
		asymmetricCipher.encrypt(message, asymmetricCert.publicKey)
	);

	// 7. Decrypt state
	let symmetricDecrypted = $derived(symmetricCipher.decrypt(symmetricEncrypted, symmetricKey));
	let asymmetricDecrypted = $derived(asymmetricCipher.decrypt(asymmetricEncrypted, asymmetricCert.privateKey));

	function regenerateSymmetricKey() {
		regenerateKeysOnDiceRoll(() => {
			console.log(`${(performance.now()/1000).toFixed(3)}s: Generating new symmetric key`);
			symmetricKey.generateKey();
		});
	}
	function regenerateAsymmetricKey() {
		regenerateKeysOnDiceRoll(() => {
			// console.log(`${(performance.now()/1000).toFixed(3)}s: Generating new asymmetric key`);
			asymmetricCert.generateKeyPair();
		});
	}
	function regenerateKeysOnDiceRoll(func: () => void) {
		func();
		let counter = 10;
		const interval = setInterval(() => {
			counter--;
			if (counter <= 0) {
				func();
				console.log(`${(performance.now()/1000).toFixed(3)}s: Final: ${asymmetricCert.publicKey}`);
				clearInterval(interval);
			}
			else if (counter > 2) {
				func();
				console.log(`${(performance.now()/1000).toFixed(3)}s: Generated key: ${asymmetricCert.publicKey}`);
			}
		}, 150);
	}


	// ---- Hashing section ----
	let sharedNumber: number = $state(Math.floor(Math.random() * 90) + 10);
	let digits = $derived(String(message.plain).split(''));
	let checksum = $derived(digits.reduce((sum, digit) => sum + parseInt(digit), 0));
	let hashLeft = $derived(message.plain.substring(0, message.plain.length / 2 + 0.5));
	let hashRight = $derived(message.plain.substring(hashLeft.length));
	let hash = $derived(CaesarHash.hash(message, alphabet));
</script>

<div class="container">
	<div class="nav-header">
		<a href="/wīsdōm" class="skill-tree-link">
			<SkillTreeIcon />
			Tree of Knowledge
		</a>
		<h1>Læran - Encryption Concepts</h1>
		<div></div>
	</div>

	<!-- Symmetric Pane -->
	<div id="symmetric" class="pane">
		<div class="pane-header">
			<h2>Symmetric</h2>
		</div>
		<div class="work-table">
			<div class="encryption-flow">
				<PlainText bind:value={userInput} />

				<div class="arrow">→</div>

				<Key 
					value={symmetricKey.key.plain} 
					type="gold" 
					onclick={() => symmetricKey.generateNextSecretKey()} 
				/>

				<div class="arrow">→</div>

				<CipherText value={symmetricEncrypted.plain} />
			</div>

			{#if showSymmetricDecrypt}
			<div class="encryption-flow">
				<CipherText value={symmetricEncrypted.plain} />

				<div class="arrow">→</div>

				<Key 
					value={symmetricKey.key.plain} 
					type="gold" 
					reverse={true}
					onclick={() => symmetricKey.generateNextSecretKey()} 
				/>

				<div class="arrow">→</div>

				<PlainText value={symmetricDecrypted.plain} icon="eye" readonly={true} />
			</div>
			{/if}

			<div class="spacer"></div>
		</div>

		<div class="lesson">			
			<button class="dice-button" onclick={regenerateSymmetricKey} title="Generate new key">
				<DiceIcon />
			</button>

			<button
				class="lesson-button"
				onclick={() => {
					console.log(`${prefNow()} Opening decrypt lesson modal`);
					decryptionModalStore.open();
				}}
			>
				<RavenIcon />
				<div class="key">
					<div class="key-icon gold">🔑</div>
					<div class="key-value">{symmetricKey.key.plain}</div>
				</div>
				<span>{showSymmetricDecrypt ? 'Test' : 'Decrypt'}</span>
			</button>
		</div>

	</div>

	<!-- Asymmetric Pane -->
	<div id="asymmetric" class="pane">
		<div class="pane-header">
			<h2>Asymmetric</h2>
		</div>
		<div class="work-table">
			<div class="encryption-flow">
				<PlainText bind:value={userInput} />

				<div class="arrow">→</div>

				<Key value={asymmetricCert.publicKey.plain} type="silver"
					onclick={() => asymmetricCert.generateNextPublicKey()}  />

				<div class="arrow">→</div>

				<CipherText value={asymmetricEncrypted} />

			</div>
			{#if showAsymmetricDecrypt}
			<div class="encryption-flow">
				<CipherText value={asymmetricEncrypted} />

				<div class="arrow">→</div>

				<Key 
					value={asymmetricCert.privateKey.plain} 
					type="gold" 
					reverse={false}
					onclick={() => asymmetricCert.generateNextPrivateKey()} 
				/>

				<div class="arrow">→</div>

				<PlainText value={asymmetricDecrypted.plain} icon="eye" readonly={true} />
			
			</div>
			{/if}

			<div class="spacer"></div>
		</div>

		<div class="lesson">
			<button class="dice-button" onclick={regenerateAsymmetricKey} title="Generate new key">
				<DiceIcon />
			</button>

			<a href="/lær/asymmetric" class="lesson-button">
				<RavenIcon />
				<div class="key">
					<div class="key-icon silver">🔑</div>
					<div class="key-value">{asymmetricCert.publicKey.plain}</div>
				</div>
				<div class="key">
					<div class="key-icon gold">🔑</div>
					<div class="key-value">{asymmetricCert.privateKey.plain}</div>
				</div>
				<span>{showAsymmetricDecrypt ? 'Test' : 'Decrypt'}</span>				
			</a>
		</div>
	</div>

	<!-- Hashing Pane -->
	<div id="hashing" class="pane">
		<div class="pane-header">
			<h2>Hashing</h2>
		</div>
		<div class="encryption-flow">
			<PlainText bind:value={userInput} />

			<div class="desk hash-function">
				{#each digits as digit, i}
					<span class="digit">{digit}</span>
					{#if i < digits.length - 1}
					<span class="plus">⊕</span>
					{/if}
				{/each}
			</div>

			<div class="arrow">→</div>

			<CipherText value={hash.plain} />
			
			<div class="spacer"></div>
			<a href="/lær/hashing" class="lesson-button">
				<RavenIcon />
				<span>Decrypt</span>
			</a>
		</div>
	</div>
</div>

<!-- Decryption Lesson Modal -->
<DecryptLessonModal />

<style>
	.spacer {
		flex-grow: 1;
	}
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
	}

	.skill-tree-link {
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

	.skill-tree-link:hover {
		background-color: rgba(102, 126, 234, 0.1);
	}

	h1 {
		text-align: center;
		margin-bottom: 1rem;
		font-size: 2rem;
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

	h2 {
		color: white;
		margin-top: 0;
		margin-bottom: 0.75rem;
		font-size: 1.3rem;
		display: inline-block;
		margin-right: 1rem;
		width: 120px;
		text-align: left;
	}

	.pane-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0;
	}

	.encryption-flow {
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.hash-function {
		display: flex;		
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		gap: 4px;
		/* background-color: #5654a4; */
		background: rgba(0, 0, 0, 0.2);
	}

	.hash-function .digit {
		font-size: 1.6em;
		font-weight: bold;
		color: #ecdfff;
	}

	.hash-function .plus {
		font-size: 0.7em;
		color: #ecdfff;
		font-weight: bold;
	}

	.lesson {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		grid-area: 1 / 2 / 3 / 3;
	}

	.lesson :global(svg) {
		width: 2rem;
		margin-bottom: 0.1rem;
	}

	.lesson :global(svg):hover {
		transform: translateY(-1px) scale(1.05);
		filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.5));
	}

	.dice-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.dice-button:hover {
		transform: scale(1.1);
	}

	.dice-button:active {
		transform: scale(0.95);
	}

	.lesson-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.2);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		text-decoration: none;
		color: white;
		font-weight: 600;
		transition: all 0.2s;
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	.lesson-button:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.lesson-button .key-icon {
		font-size: 0.8rem;
	}
	.key-icon.silver {
		filter: grayscale(100%) brightness(1.1) contrast(1.3);
	}
	
	.arrow {
		font-size: 2.5rem;
		color: white;
		font-weight: bold;
	}

	@media (max-width: 768px) {
		h2 {
			display: block;
			font-size: 1.5rem;
			margin-bottom: 1rem;
		}

		.encryption-flow {
			display: flex;
			justify-content: center;			
			gap: 1rem;
		}

		.key {
			flex-direction: row;
		}

		.arrow {
			transform: rotate(90deg);
		}

		h1 {
			font-size: 2rem;
		}
	}
</style>
