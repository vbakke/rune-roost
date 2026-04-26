<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';
	import LearnCoin from '$lib/components/LearnCoin.svelte';
	import RavenIcon from '$lib/components/icons/RavenIcon.svelte';

	import { learnedSkills } from '$lib/skills/learnedSkills';
	import { alphabetLearning } from '$lib/stores/alphabetLearning';
	import { appState } from '$lib/stores/appState';
    import { Message } from '$lib/model/Message.svelte';
    import { prefNow } from '$lib/utils/utils.ts';
    import ArrowLeftRune from '$lib/components/runes/ArrowLeftRune.svelte';
    import ArrowRightRune from '$lib/components/runes/ArrowRightRune.svelte';
    import SymmetricDecrypt from '$lib/components/textbooks/SymmetricDecrypt.svelte';
    import { SecretKey } from "$lib/model/sym/SecretKey.svelte.js";
    import { CaesarRot } from '$lib/methods/CaesarRot.ts';
    import { SymCaesar } from '$lib/model/sym/SymCaesar.ts';

	const A: Message = new Message('A');
	const ABBA: string = 'ABBA';
	const BOY: string = 'BOY';

	let currentPage = $state(0);
	let secretKey: SecretKey = $state(new SecretKey($appState.selectedAlphabet, new Message('D')));
	let alphabetFlash = $state(false);
	let symmetricCipher = $derived(new SymCaesar());
	let previousSelectedAlphabet = $state($appState.selectedAlphabet);
	
	// Watch for alphabet changes and preserve the key's position
	$effect(() => {
		if (previousSelectedAlphabet !== $appState.selectedAlphabet) {
			secretKey.remapToAlphabet($appState.selectedAlphabet);
		}
	});
	
	// Use selected alphabet from appState, respecting which ones are learned
	let alphabet: string = $derived(
		$appState.selectedAlphabet === 'LATIN' && $learnedSkills.has('encoding.latin')
			? Message.LATIN_ALPHABET 
			: Message.ROMAN_ALPHABET
	);
	
	let shiftedAlphabet: string = $derived(shifted(alphabet));

	// Watch for manual alphabet changes in StatusBar
	$effect(() => {
		if (previousSelectedAlphabet !== $appState.selectedAlphabet) {
			if (previousSelectedAlphabet) {
				console.log(`${prefNow()}: Detected manual alphabet change to ${$appState.selectedAlphabet}, triggering flash`);
				alphabetFlash = true;
				setTimeout(() => {
					console.log(`${prefNow()}: Stopping flash for manual detected ${$appState.selectedAlphabet}`);
					alphabetFlash = false;
				}, 1000);
			}
			previousSelectedAlphabet = $appState.selectedAlphabet;
		}
	});

	function shift(direction: number) {
		// secretKey_OBSOLETE = (secretKey_OBSOLETE + direction + alphabet.length) % alphabet.length;
		shiftedAlphabet = shifted(alphabet);
		secretKey.generateNextSecretKey(direction);
	}

	function encode(message: string): number[] {
		let encoded: number[] = [];
		for (let char of message.toUpperCase()) {
			let index = alphabet.indexOf(char) + 1;
			if (index !== -1) {
				encoded.push(index);
			} else {
				encoded.push(-1);
			}
		}
		return encoded;
	}

	function decode(encoded: number[]): string {
		let decoded = '';
		for (let num of encoded) {
			let index = num - 1;
			if (index >= 0 && index < alphabet.length) {
				decoded += alphabet[index];
			} else {
				decoded += 'x';
			}
		}
		return decoded;
	}

	function encryptStr(message: string, secretKey: number): string {
		return decode(encrypt(encode(message), secretKey));
	}

	function encrypt(message: number[], secretKey: number): number[] {
		let encrypted: number[] = [];
		for (let num of message) {
			let index = (num - 1 + secretKey) % alphabet.length;
			encrypted.push(index + 1);
		}
		return encrypted;
	}

	function shifted(alphabet: string): string {
		return CaesarRot.rotateStringForward(alphabet, secretKey.key.plain, alphabet).plain;
	}

	function handleLearnEvent(event: CustomEvent) {
		const topic = event.detail.topic;
		console.log('Learning topic:', topic);
		
		// Mark the skill as learned
		learnedSkills.add(topic);
		
		// If it's an alphabet skill, trigger the learning animation
		if (topic === 'encoding.latin') {
			alphabetLearning.learnAlphabet('LATIN');
		} else if (topic === 'encoding.ascii') {
			alphabetLearning.learnAlphabet('ASCII');
		} else if (topic === 'encoding.unicode') {
			alphabetLearning.learnAlphabet('UNICODE');
		} else if (topic === 'encoding.decimal') {
			alphabetLearning.learnAlphabet('NUMBERS');
		}
	}

	onMount(() => {
		document.addEventListener('learn', handleLearnEvent as EventListener);
		
		return () => {
			document.removeEventListener('learn', handleLearnEvent as EventListener);
		};
	});
</script>

<svelte:head>
	<title>In the very beginning...</title>
</svelte:head>

<div class="lesson-container">
	<div class="lesson-header">
		<h1>In the very beginning...</h1>
	</div>

	<div class="content-area">
		<BookComponent bind:currentPage>

			<Page>
				<h2>... well a bit later actually,</h2>
				<p>
					Julius Cæsar, as everyone knows, <em>"encrypted"</em> messages to his generals by 
					<em>shifting</em> the letters, <br/>
					i.e. <code>A</code> → <code>{symmetricCipher.encrypt(A, secretKey)}</code>.
				</p>
				<div class="alaphabet-rot">
					<code class:flash-alphabet={alphabetFlash}>{ alphabet }</code>
					<code class:flash-alphabet={alphabetFlash}>{ shiftedAlphabet }</code>
					<span class="secret-key">secret key:<br/><code>{ secretKey }</code></span>
					<div class="buttons">
						<button class="book-button" onclick={(e) => { e.preventDefault(); e.stopPropagation(); shift(+1); }}>
							<ArrowLeftRune />
						</button>
						<button class="book-button" onclick={(e) => { e.preventDefault(); e.stopPropagation(); shift(-1); }}>
							<ArrowRightRune />
						</button>
					</div>
				</div>

				<p> 
					Changing the <ref name="secret-key">secret key</ref> changes the <em>shift</em>, thus changing the encrypted message.
				</p>
				<!-- <p>
					Cæsar could change the <ref name="secret-key">secret key</ref>
				</p>
				<p>
					Since this method  requires a <ref name="secret-key">secret keys</ref>,
					it is possible to define this as <ref name="encryption">encryption</ref>,
					and not just an <ref name="encoding">encoding</ref>.
				</p> -->
				
				{#if alphabet.length == 23}
				<p><i>(Note. Julius had only 23 letters in his alphabet)</i><LearnCoin topic="encoding.latin" /></p>
				{/if}

			</Page>

			<Page>
				<SymmetricDecrypt secretKey={secretKey} />
			</Page>


			<!-- <Page>
				<h3>Encrypt</h3>				
				<p>
					Let's (mis)use the symbol <ref name="circle_plus" class="non-italics">⊕</ref> <em>(a plus inside a circle)</em>
					 to say how far we shift the alphabet. 
				</p>
				<div class="hbox oops-box">
					<p>Encrypting<br/>{ABBA}: <code>{ABBA} ⊕ {secretKeyIdentifier(secretKey_OBSOLETE)} = {encryptStr(ABBA, secretKey_OBSOLETE)}</code> <br/>
						And {BOY}: <code>{BOY} ⊕ {secretKeyIdentifier(secretKey_OBSOLETE)} = {encryptStr(BOY, secretKey_OBSOLETE)}</code> <br/>
					</p>			
					{#if secretKey_OBSOLETE == 0}						
					<span class="oops">
						😱
					</span>
					{/if}		
				</div>

				<LearnCoin topic="sym.decrypt.ceasar" />
				<div 
					class:blur={!$learnedSkills.has('sym.decrypt.ceasar')}
					class="pulsate"
				>
					<h3>Decrypt</h3>
					<p>To decrypt, we  <em>reverse</em> the operation,<br/>
						So <code>{encryptStr('A', secretKey_OBSOLETE)}</code> → <code>A</code>, thus
						<code>{decode(encrypt(encode(ABBA), secretKey_OBSOLETE))} ⊖ {secretKeyIdentifier(secretKey_OBSOLETE)} = {ABBA}</code> 
					</p>
					<p>
						Use <em>the same</em> secret key.<br/>
						But <em>reverse</em> the <em>operation</em>.<br/>
					</p>
				</div>
			</Page> -->

			<Page>
				<h3>Three topics</h3>
				<p>When dealing with encryption, novices are confused by three very different concepts:</p>
				<ul>
					<li>Encoding vs Encryption</li>
					<li>Symmetric vs Asymmetric encryption</li>
					<li>Hashing vs Encryption</li>
				</ul>
				<p>
					Let's dive into the confusion:<br/>
				</p>
				<div class="mid">
					<button class="lesson-button" onclick={() => { goto('/training'); }}>
						<RavenIcon />
						<span>Learn</span>
					</button>
				</div>
			</Page>
		</BookComponent>
	</div>
</div>

<style>
	.lesson-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		min-height: 100vh;
	}

	.lesson-header {
		text-align: center;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		transition: background-color 0.2s;
		margin-bottom: 1rem;
	}

	.back-link:hover {
		background-color: rgba(102, 126, 234, 0.1);
	}

	h1 {
		font-size: 2.5rem;
		/* margin: 1rem 0; */
	}

	.content-area {
		margin-bottom: 2rem;
	}

	.interactive-demo {
		background: #f0f4f8;
		border-radius: 12px;
		padding: 2rem;
		margin: 1.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-group label {
		font-weight: 600;
		color: #555;
	}

	.input-group input {
		padding: 0.75rem;
		font-size: 1.1rem;
		border: 2px solid #667eea;
		border-radius: 8px;
		outline: none;
		transition: border-color 0.2s;
	}

	.input-group input:focus {
		border-color: #5568d3;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.formula-display {
		text-align: center;
		font-size: 2rem;
		color: #667eea;
	}

	.result {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		margin-top: 1rem;
		border-left: 4px solid #10b981;
	}

	.result p {
		margin: 0.5rem 0;
		font-size: 1.1rem;
	}

	.formula {
		color: #667eea;
		font-weight: 600;
	}

	.mid {
		display: flex;
		justify-content: center;
		margin-top: 1.5rem;
	}
	
	.alaphabet-rot {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		justify-items: center;
		margin-bottom: 1rem;
	}

	code {
		font-size: 1.4em;
	}
	
	.flash-alphabet {
		animation: flash-alphabet 1s ease-in-out;
	}
	
	@keyframes flash-alphabet {
		0%, 100% {
			color: inherit;
			text-shadow: none;
		}
		13.333%, 40%, 66.666%, 93.333% {
			color: #ffd700;
			text-shadow: 0 0 15px rgba(255, 215, 0, 0.9);
		}
		26.666%, 53.333%, 80% {
			color: inherit;
			text-shadow: none;
		}
	}
	

	.alaphabet-rot .buttons {
		margin-top: 0.3rem;
	}
	.alaphabet-rot button {
		margin: 0 0.3rem;
	}
	
	.alaphabet-rot .secret-key {
		font-size: 0.8rem;
		grid-column: 2;
		grid-row: 1 / 3;
		align-self: end;
		text-align: center;
		border: #c08132 2px solid;
		border-radius: 17px;
		padding: 4px;
		background-color: #efe6ce;
	}

	.lesson-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgb(226 192 72 / 20%);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		text-decoration: none;
		color: #bea13b;
		font-weight: 600;
		transition: all 0.2s;
		max-width: fit-content;
		border: 2px solid rgba(226, 192, 72, 0.4);
		box-shadow: 1px 2px 1px #ad9530;
	}

	.lesson-button:hover {
		background: rgb(226 192 72 / 18%);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.oops-box {
		justify-content: space-between;
    	align-items: flex-end;
	}

	.oops {
		font-size: 2.3rem;
	}

	:global(.skill-gated-text) {
		display: block;
		padding: 1rem;
		margin-top: 1rem;
		border-left: 4px solid #d4a574;
		background-color: rgba(212, 165, 116, 0.05);
		border-radius: 4px;
	}

	:global(.skill-gated-text) h4 {
		margin-top: 0;
		color: #2a6b48;
	}

	:global(.skill-gated-text) p {
		margin: 0.8rem 0;
	}

	:global(.skill-gated-text) code {
		font-size: 1rem;
	}
		

	.raven-icon {
		width: 24px;
		height: 24px;
		fill: #bea13b;
	}
	svg {
		display: block;
		width: 12px;
		height: 18px;
		fill: #5d3a1a;
	}

	@media (max-width: 768px) {

		h1 {
			font-size: 2rem;
		}

		.interactive-demo {
			padding: 1rem;
		}

		.lesson-container {
			padding: 0.2rem;
		}
		code {
			font-size: 1.2rem;
		}

	}
</style>
	