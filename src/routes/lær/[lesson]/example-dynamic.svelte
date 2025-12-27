<script lang="ts">
	// Example of how to use the Book component with dynamic content and data binding
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';
	import type { Lesson } from '$lib/data/lessons';

	interface Props {
		data: {
			lesson: Lesson;
		};
	}

	let { data }: Props = $props();
	const lesson = data.lesson;

	// Example reactive state that can be used in pages
	let userInput = $state('');
	let secretKey = $state(42);
	let encryptedValue = $derived(userInput ? parseInt(userInput) + secretKey : 0);
	let currentPage = $state(0);
</script>

<div class="lesson-container">
	<div class="lesson-header">
		<a href="/lær" class="back-link">← Back to Learning</a>
		<h1>{lesson.title}</h1>
	</div>

	<div class="content-area">
		<BookComponent bind:currentPage>
			<Page>
				<!-- Page 1: Interactive encryption demo -->
				<h3>Try It Yourself!</h3>
				<p>Enter a number and see how symmetric encryption works:</p>
				
				<div class="interactive-demo">
					<label>
						Your Number:
						<input type="number" bind:value={userInput} placeholder="Enter a number" />
					</label>
					
					<div class="encryption-step">
						<span>Secret Key: {secretKey}</span>
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
				<!-- Page 2: Static content with formatting -->
				<h3>How Symmetric Encryption Works</h3>
				<p>The process is simple:</p>
				<ul>
					<li><strong>Alice</strong> has a message</li>
					<li><strong>Bob</strong> and Alice share a secret key: <code>{secretKey}</code></li>
					<li>Alice encrypts by adding the key</li>
					<li>Bob decrypts by subtracting the key</li>
				</ul>
			</Page>

			<Page>
				<!-- Page 3: Another interactive component -->
				<h3>Change the Secret Key</h3>
				<p>The security depends on keeping this key secret:</p>
				
				<div class="key-adjuster">
					<label>
						Secret Key:
						<input type="range" bind:value={secretKey} min="1" max="100" />
						<span class="key-value">{secretKey}</span>
					</label>
				</div>
				
				{#if userInput}
					<div class="recalculation">
						<p>With your number <strong>{userInput}</strong>:</p>
						<p>New encrypted value: <strong>{encryptedValue}</strong></p>
					</div>
				{/if}
				
				<p>Notice how the same input produces different encrypted values with different keys!</p>
			</Page>

			<Page>
				<!-- Page 4: You can even include other components -->
				<h3>Real World Example</h3>
				<p>Current page: {currentPage + 1}</p>
				<p>AES (Advanced Encryption Standard) uses this principle but with much more complex mathematics.</p>
				
				<div class="summary-box">
					<h4>What you've learned:</h4>
					<ul>
						<li>Symmetric encryption uses one shared key</li>
						<li>The same key encrypts and decrypts</li>
						<li>Key must be kept secret</li>
						<li>You tried it with key: {secretKey}</li>
					</ul>
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
	}

	.back-link:hover {
		background-color: rgba(102, 126, 234, 0.1);
	}

	h1 {
		font-size: 2.5rem;
		color: #333;
		margin: 1rem 0;
	}

	.interactive-demo {
		background: #f9fafb;
		padding: 1.5rem;
		border-radius: 8px;
		margin: 1rem 0;
		border: 2px solid #e5e7eb;
	}

	.interactive-demo label {
		display: block;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.interactive-demo input[type="number"] {
		width: 100%;
		padding: 0.5rem;
		font-size: 1.1rem;
		border: 2px solid #667eea;
		border-radius: 4px;
		margin-top: 0.5rem;
	}

	.encryption-step {
		text-align: center;
		padding: 1rem;
		background: #667eea;
		color: white;
		border-radius: 4px;
		margin: 1rem 0;
		font-weight: 600;
		font-size: 1.2rem;
	}

	.result {
		background: white;
		padding: 1rem;
		border-radius: 4px;
		border: 2px solid #10b981;
	}

	.result p {
		margin: 0.5rem 0;
	}

	.formula {
		color: #667eea;
		font-weight: 600;
		font-size: 1.1rem;
		text-align: center;
		padding: 0.5rem;
		background: #f9fafb;
		border-radius: 4px;
	}

	.key-adjuster {
		background: #f9fafb;
		padding: 1.5rem;
		border-radius: 8px;
		margin: 1rem 0;
	}

	.key-adjuster label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.key-adjuster input[type="range"] {
		width: 100%;
	}

	.key-value {
		text-align: center;
		font-size: 1.5rem;
		font-weight: 600;
		color: #667eea;
	}

	.recalculation {
		background: #ecfdf5;
		padding: 1rem;
		border-radius: 4px;
		border: 2px solid #10b981;
		margin-top: 1rem;
	}

	.summary-box {
		background: #f9fafb;
		padding: 1.5rem;
		border-radius: 8px;
		border: 2px solid #667eea;
		margin-top: 1rem;
	}

	.summary-box h4 {
		margin-top: 0;
		color: #667eea;
	}

	.summary-box ul {
		margin-bottom: 0;
	}
</style>
