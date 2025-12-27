<script lang="ts">
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';

	let currentPage = $state(0);
	let userInput = $state(0);
	let secretKey = $state(42);
	let encryptedValue = $derived(userInput + secretKey);
</script>

<svelte:head>
	<title>Learn Symmetric Encryption</title>
</svelte:head>

<div class="lesson-container">
	<div class="lesson-header">
		<a href="/lær" class="back-link">
			← Back to Learning
		</a>
		<h1>Symmetric Encryption</h1>
	</div>

	<div class="content-area">
		<BookComponent bind:currentPage>
			<Page>
				<h3>Try It Yourself!</h3>
				<p>Enter a number and see how symmetric encryption works:</p>
				
				<div class="interactive-demo">
					<div class="input-group">
						<label for="userNumber">Your Number:</label>
						<input 
							id="userNumber"
							type="number" 
							bind:value={userInput}
							min="0"
						/>
					</div>
					
					<div class="formula-display">
						<span class="operator">+</span>
					</div>
					
					<div class="input-group">
						<label for="secretKey">Secret Key:</label>
						<input 
							id="secretKey"
							type="number" 
							bind:value={secretKey}
							min="0"
						/>
					</div>
					
					{#if userInput}
						<div class="result">
							<p><strong>Original:</strong> {userInput}</p>
							<p><strong>Encrypted:</strong> {encryptedValue}</p>
							<p class="formula">{userInput} + {secretKey} = {encryptedValue}</p>
						</div>
					{/if}
				</div>
				
				<p>Try changing the number and see how the encrypted value changes!</p>
			</Page>

			<Page>
				<h3>How Symmetric Encryption Works</h3>
				<p>Symmetric encryption is a method of encryption where the same key is used for both encrypting and decrypting data. This means that both the sender and receiver must have access to the same secret key.</p>
				<p>Here's a simple example to illustrate the concept:</p>
				<ul>
					<li><strong>Original Number:</strong> 25</li>
					<li><strong>Secret Key:</strong> 42</li>
					<li><strong>Encryption Process:</strong> 25 + 42 = 67 (Encrypted Number)</li>
					<li><strong>Decryption Process:</strong> 67 - 42 = 25 (Original Number)</li>
				</ul>
				<p>In this example, both parties use the same secret key (42) to encrypt and decrypt the number. The security of symmetric encryption relies on keeping the secret key confidential between the communicating parties.</p>
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
		color: #333;
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
