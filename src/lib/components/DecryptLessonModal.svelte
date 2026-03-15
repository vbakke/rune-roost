<script lang="ts">
	import { onMount } from 'svelte';
	import BookPageModal from './BookPageModal.svelte';
	import DecryptionQuestion from './DecryptionQuestion.svelte';
	import { decryptionModalStore } from '$lib/stores/decryptionModalStore';
	import { learnedSkills } from '$lib/skills/learnedSkills';
	import { Message } from '$lib/model/Message.svelte';
	import { SecretKey } from '$lib/model/sym/SecretKey.svelte';
	import { appState } from '$lib/stores/appState';
	import { prefNow } from '$lib/utils/utils';

	let isOpen = $derived($decryptionModalStore.isOpen);
	let isBlurred = $state(false);
	let isFlying = $state(false);
	let isSuccessClose = $state(false);
	let learnButtonRect: DOMRect | null = null;
	let isFirstOpen = $state(true);

	// Get the selected alphabet from appState
	let alphabet = $derived(
		$appState.selectedAlphabet === 'LATIN' && $learnedSkills.has('encoding.latin')
			? Message.LATIN_ALPHABET
			: Message.ROMAN_ALPHABET
	);

	// Generate a random secret key for the challenge
	let secretKey = $state<SecretKey>(new SecretKey(alphabet));

	onMount(() => {
		// Find the Learn button in StatusBar
		const learnButton = document.querySelector('[data-testid="learn-button"]');
		if (learnButton) {
			learnButtonRect = learnButton.getBoundingClientRect();
		}
	});

	// Watch for modal opening
	$effect(() => {
		if (isOpen) {
			if (isFirstOpen) {
				// First time: start blurred, then unblur
				isBlurred = true;
				setTimeout(() => {
					isBlurred = false;
				}, 300);
				isFirstOpen = false;
			} else {
				// Subsequent times: not blurred
				isBlurred = false;
			}
		}
	});

	function handleCorrectAnswer() {
		console.log(`${prefNow()} Decryption correct! Starting fly-away animation`);
		isFlying = true;
		isSuccessClose = true;

		// Give the animation time to complete before marking as learned
		setTimeout(() => {
			console.log(`${prefNow()} Marking sym.decrypt as learned`);
			learnedSkills.add('sym.decrypt');

			// Close the modal after the animation completes
			setTimeout(() => {
				isFlying = false;
				decryptionModalStore.close();
			}, 300);
		}, 500);
	}

	function handleModalClose() {
		console.log(`${prefNow()} Modal closed without correct answer`);
		// Reset animation states
		isBlurred = false;
		isFlying = false;
		isSuccessClose = false;
		// Close the modal in the store
		decryptionModalStore.close();
		// Don't mark skill as learned
	}
</script>

<BookPageModal
	isOpen={isOpen}
	fadeOnClose={isSuccessClose}
	onClose={handleModalClose}
>
	<div
		class="decrypt-lesson-modal"
		class:blurred={isBlurred}
		class:flying={isFlying}
		style={isFlying && learnButtonRect
			? `--target-x: ${learnButtonRect.left - window.innerWidth / 2}px; --target-y: ${learnButtonRect.top - window.innerHeight / 2}px;`
			: ''}
	>
		<h2>Decrypt</h2>

		<div class="decrypt-content">
			<h3>How to Decrypt</h3>

			<p>
				To decrypt, we just reverse the operation:
			</p>

			<div class="formula">
				<code>ENCRYPTED ⊖ SECRET_KEY = PLAINTEXT</code>
			</div>

			<p>
				Reverse <em>the operation</em>.
				<br />
				But use <em>the same secret key</em>.
			</p>

			<p>
				Let's practice! Decrypt the following message using the provided key:
			</p>
		</div>

		<div class="question-wrapper">
			<DecryptionQuestion
				plaintext="BABA"
				secretKey={secretKey}
				onCorrectAnswer={handleCorrectAnswer}
			/>
		</div>
	</div>
</BookPageModal>

<style>
	.decrypt-lesson-modal {
		transition: filter 1.5s ease-in-out;
	}

	.decrypt-lesson-modal.blurred {
		filter: blur(6px);
		pointer-events: none;
		user-select: none;
	}

	.decrypt-lesson-modal:not(.blurred) {
		filter: blur(0);
		pointer-events: auto;
		user-select: auto;
	}

	.decrypt-lesson-modal.flying {
		animation: fly-to-button 0.6s ease-in-out forwards;
	}

	@keyframes fly-to-button {
		0% {
			transform: translate(0, 0);
			opacity: 1;
		}
		100% {
			transform: translate(var(--target-x, 0), var(--target-y, 0)) scale(0.1);
			opacity: 0;
		}
	}

	h2 {
		margin-top: 0;
		color: #333;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.decrypt-content {
		margin-bottom: 2rem;
	}

	.decrypt-content h3 {
		margin-top: 0;
		color: #555;
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	.decrypt-content p {
		color: #666;
		line-height: 1.6;
		margin-bottom: 0.75rem;
	}

	.decrypt-content em {
		font-style: italic;
		color: #667eea;
		font-weight: 500;
	}

	.formula {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1rem;
		border-radius: 8px;
		margin: 1rem 0;
		text-align: center;
	}

	.formula code {
		font-family: monospace;
		font-weight: bold;
		font-size: 1.1rem;
	}

	.question-wrapper {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 2px solid #e0e0e0;
	}

	@media (max-width: 768px) {
		h2 {
			font-size: 1.3rem;
		}

		.decrypt-content h3 {
			font-size: 1rem;
		}

		.formula {
			padding: 0.75rem;
		}

		.formula code {
			font-size: 0.9rem;
		}
	}
</style>
