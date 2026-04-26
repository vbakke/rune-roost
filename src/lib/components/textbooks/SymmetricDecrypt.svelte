<script lang="ts">
    import { Message } from '$lib/model/Message.svelte.ts';
    import type { SecretKey } from '$lib/model/sym/SecretKey.svelte.ts';
	import { SymCaesar } from '$lib/model/sym/SymCaesar';
	import { learnedSkills } from '$lib/skills/learnedSkills';
    import LearnCoin from '../LearnCoin.svelte';
	

	interface Props {
		alphabet: string;
		secretKey: SecretKey;
	}

	const ABBA: Message = new Message('ABBA');
	const BOY: Message = new Message('BOY');
	const A: Message = new Message('A');
	
	let { secretKey, alphabet }: Props = $props();
	
	let symmetricCipher = $derived(new SymCaesar(alphabet));
</script>
<div class="textbook-page">
	<!-- <h2>Symmetric Decryption</h2>
	<p>
		In symmetric encryption, the same key is used for both encryption and decryption. When you encrypt a message
		with a key, you can decrypt it using the <strong>exact same key</strong>.
	</p> -->

				<h3>Encrypt</h3>				
				<p>
					Let's (mis)use the symbol <ref name="circle_plus" class="non-italics">⊕</ref> <em>(a plus inside a circle)</em>
					 to say how far we shift the alphabet. 
					<!-- If we roll past 
					<code>{alphabet.slice(-1)}</code> we continue on <code>{alphabet.slice(0, 1)}</code>. -->
				</p>
				<div class="hbox oops-box">
					<p>Encrypting<br/>{ABBA}: <code>{ABBA} ⊕ {secretKey} = {symmetricCipher.encrypt(ABBA, secretKey)}</code> <br/>
						And {BOY}: <code>{BOY} ⊕ {secretKey} = {symmetricCipher.encrypt(BOY, secretKey)}</code> <br/>
					</p>			
					{#if secretKey.toString() == 'A'}						
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
						So <code>{symmetricCipher.encrypt(A, secretKey)}</code> → <code>A</code>, thus
						<code>{symmetricCipher.encrypt(ABBA, secretKey)} ⊖ {secretKey} = {ABBA}</code> 

					</p>
					<p>
						Use <em>the same</em> secret key.<br/>
						But <em>reverse</em> the <em>operation</em>.<br/>
					</p>
				</div>



	<!-- <h3>How It Works</h3>
	<p>Let's walk through the process step by step:</p>
	<ol>
		<li><strong>Plaintext:</strong> Start with your original message (e.g., "ATTACK")</li>
		<li><strong>Encryption:</strong> Apply a cipher algorithm with your shared key (e.g., Caesar cipher with shift 42)</li>
		<li><strong>Ciphertext:</strong> Get the encrypted, unreadable result (e.g., "IHHIYG")</li>
		<li><strong>Decryption:</strong> Apply the same algorithm in reverse using the same key</li>
		<li><strong>Plaintext (again):</strong> Recover the original message</li>
	</ol>

	<h3>Key Properties</h3>
	<ul>
		<li><strong>Deterministic:</strong> The same plaintext + same key always produces the same ciphertext.</li>
		<li><strong>Reversible:</strong> If you have the key, you can always decrypt.</li>
		<li><strong>Fast:</strong> Symmetric encryption is generally faster than asymmetric encryption.</li>
		<li><strong>Secret sharing required:</strong> Both parties must securely share the key beforehand.</li>
	</ul>

	<h3>The Challenge</h3>
	<p>
		The main challenge with symmetric encryption is <strong>key distribution</strong>. How do you securely share the
		key with someone you've never met? This is where asymmetric encryption comes in—it can be used to securely exchange
		symmetric keys over public channels.
	</p> -->
</div>

<style>
	.textbook-page {
		/* padding: 24px;
		font-family: serif;
		line-height: 1.8;
		color: #333; */
	}

	h2 {
		font-size: 28px;
		margin-bottom: 16px;
		text-align: center;
		color: #1a5f3c;
		border-bottom: 2px solid #d4a574;
		padding-bottom: 12px;
	}

	code {
		font-size: 1.4em;
	}
	/* h3 {
		font-size: 18px;
		margin-top: 20px;
		margin-bottom: 12px;
		color: #2a6b48;
	} */

	p {
		margin-bottom: 12px;
	}

	ol, ul {
		margin: 12px 0 12px 24px;
	}

	li {
		margin-bottom: 8px;
	}

	strong {
		color: #1a5f3c;
	}
</style>
