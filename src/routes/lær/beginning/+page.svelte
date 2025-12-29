<script lang="ts">
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';

	let currentPage = $state(0);
	let userInput = $state(0);
	let secretKey = $state(42);
	let encryptedValueAdd = $derived(userInput + secretKey);
	let encryptedValueAddRound = $derived(userInput - secretKey);
</script>

<svelte:head>
	<title>In the very beginning...</title>
</svelte:head>

<div class="lesson-container">
	<div class="lesson-header">
		<a href="/lær" class="back-link">
			← Back to Learning
		</a>
		<h1>In the very beginning...</h1>
	</div>

	<div class="content-area">
		<BookComponent bind:currentPage>

			<Page>
				<h2>... well a bit later actually,</h2>
				<p>Julius Cæsar, as everyone knows, <em>"encrypted"</em> messages to his generals by 
					<em>rotating</em> the alphabet.</p>
				<p>Since the method  allows for a <ref name="secret-key">secret keys</ref> that, it 
					is possible to define this as encryption, and not just an <ref name="encoding">encoding</ref>.</p>
				
				<p class="tight-lines">
					<code>ABCDEFGHIKLMNOPQRSTVXYZ</code><br/>
					<code>DEFGHIKLMNOPQRSTVXYZABC</code> secret key: <code>D</code>
				</p>
				<br/>
				<todo>Implement interactive Caesar cipher demo here</todo>
				<h4>Computers</h4>
				<p>Computers like to compute numbers, not letters. </p>
			</Page>

			<Page>
				<h3>Encrypt</h3>				
				<p>
					Let's (mis)use <ref name="circle_plus" class="non-italics">⊕</ref> as a 
					<em>rollover addition</em>, when we <em>encrypt</em> using the secret key <code>D</code> or <code>3</code>.
				</p>
				<p>ABBA encrypted is <code>1,2,2,1 ⊕ 3 = 4,5,5,4</code><br/>
					And BOY yields <code>2,14,22 ⊕ 3 = 4,17,2</code><br/>
				</p>
				<p><i>(Julius only had 23 letters in his alphabet).</i></p>
				<h3>Decrypt</h3>
				<p>To decrypt, we just reverse the operation: <code>4,5,5,4 ⊖ 3 = 1,2,2,1</code>, 
					yielding <code>ABBA</code> again.</p>
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
		margin-bottom: 2rem;
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
		margin: 1rem 0;
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

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.interactive-demo {
			padding: 1rem;
		}
	}
</style>
