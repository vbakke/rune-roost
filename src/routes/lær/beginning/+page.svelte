<script lang="ts">
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';
	import RavenIcon from '$lib/components/icons/RavenIcon.svelte';
    import { Message } from '$lib/model/Message.ts';

	const ABBA: string = 'ABBA';
	const BOY: string = 'BOY';

	let currentPage = $state(0);
	let secretKey: number = $state(2);
	let alphabet: string = Message.ROMAN_ALPHABET;
	let shiftedAlphabet: string = shifted();

	function onShiftAlphabet(e: Event, direction: number) {
		e.preventDefault();
		e.stopPropagation();
		shift(direction);
	}

	function shift(direction: number) {
		secretKey = (secretKey + direction + alphabet.length) % alphabet.length;
		shiftedAlphabet = shifted();
	}

	function encode(message: string): Number[] {
		let encoded: Number[] = [];
		for (let char of message.toUpperCase()) {
			let index = alphabet.indexOf(char) + 1;
			if (index !== -1) {
				encoded.push(index);
			} else {
				encoded.push('?'); z
			}
		}
		return encoded;
	}

	function decode(encoded: Number[]): string {
		let decoded = '';
		for (let num of encoded) {
			num--;
			if (num >= 0 && num < alphabet.length) {
				decoded += alphabet[num];
			} else {
				decoded += 'x';
			}
		}
		return decoded;
	}

	function encrypt(message: Number[], secretKey: number): Number[] {
		let encrypted: Number[] = [];
		for (let num of message) {
			let index = (num - 1 + secretKey) % alphabet.length;
			encrypted.push(index + 1);
		}
		return encrypted;
	}

	function shifted() {
		return (alphabet + alphabet).substr(secretKey, alphabet.length);
	}

	function secretKeyIdentifier(secretKey: string) {
		return alphabet.substr(secretKey, 1);
	}
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
				<p>Julius Cæsar, as everyone knows, <em>"encrypted"</em> messages to his generals by 
					<em>rotating</em> the alphabet.</p>
				<p class="tight-lines">
					<code>{ alphabet }</code><br/>
					<code>{ shiftedAlphabet }</code> secret key: <code>{ secretKeyIdentifier(secretKey) }</code><br/>
					<button class="book-button" on:click={(e) => { e.preventDefault(); e.stopPropagation(); shift(+1); }}>
						<svg viewBox="0 0 18 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M 6 12 L 12 4 M 6 12 L 12 20" stroke="brown" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<button class="book-button" on:click={(e) => { e.preventDefault(); e.stopPropagation(); shift(-1); }}>
						<svg viewBox="0 0 18 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M 12 12 L 6 4 M 12 12 L 6 20" stroke="brown" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</p>

				<p>
					Since the method  allows for a <ref name="secret-key">secret keys</ref>,
					it is possible to define this as <ref name="encryption">encryption</ref>, and not just an <ref name="encoding">encoding</ref>.
				</p>
				
				{#if alphabet.length == 23}
				<p><i>(Note. Julius had only 23 letters in his alphabet)</i></p>
				{/if}

			</Page>

			<Page>
				<h3>Encrypt</h3>				
				<p>
					Let's (mis)use <ref name="circle_plus" class="non-italics">⊕</ref> as a 
					<em>"rollover addition"</em> to mean if we roll past 
					<code>{alphabet.slice(-1)}</code> we continue on <code>{alphabet.slice(0, 1)}</code>.
				</p>
				<p>Encrypting<br/>{ABBA}: <code>{ABBA} ⊕ {secretKeyIdentifier(secretKey)} = {decode(encrypt(encode(ABBA), secretKey))}</code> <br/>
				    And {BOY}: <code>{BOY} ⊕ {secretKeyIdentifier(secretKey)} = {decode(encrypt(encode(BOY), secretKey))}</code> <br/>
				</p>
				<h3>Decrypt</h3>
				<p>To decrypt, we just reverse the operation:<br/>
					<code>{decode(encrypt(encode(ABBA), secretKey))} ⊖ {secretKeyIdentifier(secretKey)} = {ABBA}</code> 
				</p>
				<p>Reverse <em>the operation</em>.<br/>
					But use <em>the same secret key</em>.
				</p>
			</Page>

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
					<a href="/training" class="lesson-button">
						<RavenIcon />
						<span>Learn</span>
					</a>
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

	.lesson-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgb(226 192 72 / 10%);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		text-decoration: none;
		color: #bea13b;
		font-weight: 600;
		transition: all 0.2s;
		border: 2px solid rgba(226, 192, 72, 0.4);
		max-width: fit-content;
	}

	.lesson-button:hover {
		background: rgb(226 192 72 / 18%);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	svg {
		display: block;
		width: 9px;
		height: 12px;
		fill: #5d3a1a;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.interactive-demo {
			padding: 1rem;
		}
	}
</style>
