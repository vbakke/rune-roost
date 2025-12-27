<script lang="ts">
	// SIMPLE EXAMPLE: Interactive Symmetric Encryption Lesson
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';

	// Reactive state - accessible from all pages
	let originalMessage = $state(15);
	let secretKey = $state(42);
	let encryptedMessage = $derived(originalMessage + secretKey);
	let currentPage = $state(0);
</script>

<div class="container">
	<h1>Interactive Symmetric Encryption</h1>

	<BookComponent bind:currentPage>
		<Page>
			<h3>Welcome!</h3>
			<p>In this lesson, you'll learn about symmetric encryption by actually using it.</p>
			<p>We're currently on page {currentPage + 1}.</p>
			<p>Turn the page to start encrypting!</p>
		</Page>

		<Page>
			<h3>Let's Encrypt a Number</h3>
			
			<div class="demo-box">
				<label>
					Your Secret Number:
					<input type="number" bind:value={originalMessage} />
				</label>

				<div class="key-box">
					🔑 Secret Key: <strong>{secretKey}</strong>
				</div>

				<div class="result-box">
					{originalMessage} + {secretKey} = <strong>{encryptedMessage}</strong>
				</div>
			</div>

			<p>Try changing your number and see how the encrypted value changes!</p>
		</Page>

		<Page>
			<h3>Change the Secret Key</h3>
			
			<div class="demo-box">
				<p>Your original number is still: <strong>{originalMessage}</strong></p>
				
				<label>
					Adjust the Secret Key:
					<input type="range" bind:value={secretKey} min="1" max="100" />
					<span class="key-display">{secretKey}</span>
				</label>

				<div class="result-box">
					New encrypted value: <strong>{encryptedMessage}</strong>
				</div>
			</div>

			<p>Notice how different keys produce different encrypted values from the same input!</p>
		</Page>

		<Page>
			<h3>What You Learned</h3>
			
			<ul>
				<li>Your number: <strong>{originalMessage}</strong></li>
				<li>Secret key: <strong>{secretKey}</strong></li>
				<li>Encrypted result: <strong>{encryptedMessage}</strong></li>
			</ul>

			<div class="important">
				<p><strong>Key Takeaway:</strong></p>
				<p>Both you and your friend need the same secret key ({secretKey}) to encrypt and decrypt messages!</p>
			</div>
		</Page>
	</BookComponent>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		text-align: center;
		color: #333;
		margin-bottom: 2rem;
	}

	.demo-box {
		background: #f0f9ff;
		border: 2px solid #3b82f6;
		border-radius: 8px;
		padding: 1.5rem;
		margin: 1rem 0;
	}

	.demo-box label {
		display: block;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.demo-box input[type="number"],
	.demo-box input[type="range"] {
		width: 100%;
		padding: 0.5rem;
		font-size: 1.1rem;
		margin-top: 0.5rem;
		border: 2px solid #3b82f6;
		border-radius: 4px;
	}

	.key-box {
		text-align: center;
		padding: 1rem;
		background: #fef3c7;
		border-radius: 4px;
		margin: 1rem 0;
		font-size: 1.2rem;
	}

	.result-box {
		text-align: center;
		padding: 1rem;
		background: #d1fae5;
		border: 2px solid #10b981;
		border-radius: 4px;
		margin: 1rem 0;
		font-size: 1.3rem;
	}

	.key-display {
		display: block;
		text-align: center;
		font-size: 2rem;
		font-weight: bold;
		color: #3b82f6;
		margin-top: 0.5rem;
	}

	.important {
		background: #fef3c7;
		border-left: 4px solid #f59e0b;
		padding: 1rem;
		margin-top: 1rem;
	}

	.important p {
		margin: 0.5rem 0;
	}
</style>
