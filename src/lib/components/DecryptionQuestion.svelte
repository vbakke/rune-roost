<script lang="ts">
	import { Message } from '$lib/model/Message.svelte';
	import { SymCaesar } from '$lib/model/sym/SymCaesar';
	import { SecretKey } from '$lib/model/sym/SecretKey.svelte';

	interface Props {
		plaintext: string;
		secretKey: SecretKey;
		onCorrectAnswer?: () => void;
	}

	let { plaintext, secretKey, onCorrectAnswer }: Props = $props();

	// Create encryption setup
	let message = $derived(new Message(plaintext));
	let cipher = new SymCaesar();

	// Encrypt the plaintext to show as ciphertext
	let ciphertext = $derived(cipher.encrypt(message, secretKey));

	// User's attempt
	let userAnswer = $state('');
	let feedback = $state<'idle' | 'correct' | 'incorrect'>('idle');
	let feedbackMessage = $state('');

	function handleSubmit() {
		// Trim and uppercase user input
		const cleanAnswer = userAnswer.trim().toUpperCase();

		// Decrypt the ciphertext with the known key to get the correct plaintext
		const decrypted = cipher.decrypt(ciphertext, secretKey);

		// Compare user's answer with the decrypted plaintext
		if (cleanAnswer === decrypted.plain) {
			feedback = 'correct';
			feedbackMessage = `Correct! "${cleanAnswer}" is the right decryption!`;
			onCorrectAnswer?.();
		} else {
			feedback = 'incorrect';
			feedbackMessage = `Not quite. Try again! (Hint: the decryption starts with "${message.plain.charAt(0)}")`;
			// Reset feedback after 2 seconds, but keep the user's input
			setTimeout(() => {
				feedback = 'idle';
			}, 2000);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && userAnswer.trim()) {
			handleSubmit();
		}
	}
</script>

<div class="question-container">
	<h3>Decryption Challenge</h3>

	<div class="exercise-content">
		<p class="instruction">
			You have a ciphertext that was encrypted with a secret key. Can you decrypt it?
		</p>

		<div class="cipher-flow">
			<div class="cipher-item">
				<div class="label">Ciphertext</div>
				<div class="value">{ciphertext.plain}</div>
			</div>

			<div class="arrow"></div>

			<div class="cipher-item">
				<div class="label">Secret Key</div>
				<div class="value key-display">{secretKey.key.plain}</div>
			</div>

			<div class="arrow">⊖</div>

			<div class="cipher-item">
				<div class="label">Plaintext</div>
				<div class="value placeholder">?</div>
			</div>
		</div>

		<div class="input-section">
			<label for="decrypt-input">What is the plaintext?</label>
			<div class="input-wrapper">
				<input
					id="decrypt-input"
					type="text"
					bind:value={userAnswer}
					on:keydown={handleKeydown}
					placeholder="Type your answer here..."
					disabled={feedback === 'correct'}
					class:has-error={feedback === 'incorrect'}
					autocomplete="off"
				/>
				<button
					class="submit-button"
					on:click={handleSubmit}
					disabled={!userAnswer.trim() || feedback === 'correct'}
				>
					Check
				</button>
			</div>

			{#if feedback !== 'idle'}
				<div
					class="feedback"
					class:feedback-correct={feedback === 'correct'}
					class:feedback-incorrect={feedback === 'incorrect'}
				>
					{feedbackMessage}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.question-container {
		padding: 1rem 0;
	}

	h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #333;
		font-size: 1.3rem;
	}

	.exercise-content {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 12px;
		border: 2px solid #e0e0e0;
	}

	.instruction {
		margin: 0 0 1.5rem 0;
		color: #555;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.cipher-flow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.cipher-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		background: white;
		padding: 1rem;
		border-radius: 8px;
		border: 2px solid #d0d0d0;
		min-width: 100px;
	}

	.cipher-item .label {
		font-size: 0.8rem;
		color: #999;
		text-transform: uppercase;
		font-weight: 600;
		letter-spacing: 0.5px;
	}

	.cipher-item .value {
		font-size: 1.4rem;
		font-weight: bold;
		color: #667eea;
		font-family: monospace;
	}

	.cipher-item .placeholder {
		color: #ccc;
		font-size: 1.2rem;
	}

	.cipher-item .key-display {
		background: linear-gradient(135deg, #c09132 0%, #d4a964 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.arrow {
		font-size: 1.2rem;
		color: #999;
		font-weight: bold;
	}

	.input-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.input-section label {
		font-weight: 600;
		color: #555;
		font-size: 0.95rem;
	}

	.input-wrapper {
		display: flex;
		gap: 0.5rem;
	}

	.input-wrapper input {
		flex: 1;
		padding: 0.75rem;
		font-size: 1rem;
		border: 2px solid #d0d0d0;
		border-radius: 8px;
		outline: none;
		transition: all 0.2s;
		text-transform: uppercase;
		font-family: monospace;
		font-weight: 500;
	}

	.input-wrapper input:focus {
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.input-wrapper input:disabled {
		background-color: #f0f0f0;
		cursor: not-allowed;
		color: #999;
	}

	.input-wrapper input.has-error {
		border-color: #dc3545;
		animation: shake 0.3s ease-in-out;
	}

	@keyframes shake {
		0%, 100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(5px);
		}
	}

	.submit-button {
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1rem;
	}

	.submit-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	.submit-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.submit-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.feedback {
		padding: 0.75rem;
		border-radius: 8px;
		font-weight: 500;
		animation: fade-in 0.3s ease-out;
	}

	.feedback-correct {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.feedback-incorrect {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.cipher-flow {
			gap: 0.75rem;
		}

		.cipher-item {
			min-width: 80px;
			padding: 0.75rem;
			font-size: 0.85rem;
		}

		.cipher-item .value {
			font-size: 1.1rem;
		}

		.input-wrapper {
			flex-direction: column;
		}

		.submit-button {
			width: 100%;
		}
	}
</style>
