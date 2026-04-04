<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		isOpen?: boolean;
		fadeOnClose?: boolean;
		onClose?: () => void;
		children?: any;
	}

	let { isOpen = false, fadeOnClose = false, onClose, children }: Props = $props();

	let modalElement: HTMLDivElement | undefined = $state();
	let isExiting = $state(false);

	function handleBackdropClick(event: MouseEvent) {
		// Only close if clicking directly on the backdrop, not on modal content
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function closeModal() {
		if (fadeOnClose) {
			isExiting = true;
			setTimeout(() => {
				isExiting = false;
				onClose?.();
			}, 300);
		} else {
			// No fade, just close immediately
			onClose?.();
		}
	}

	onDestroy(() => {
		// Clean up any event listeners
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div
		class="modal-backdrop"
		class:exiting={isExiting}
		role="presentation"
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div
			class="modal-container"
			class:exiting={isExiting}
			role="dialog"
			aria-modal="true"
			bind:this={modalElement}
		>
			<button
				class="modal-close-button"
				title="Close"
				on:click={closeModal}
				aria-label="Close modal"
			>
				✕
			</button>
			<div class="modal-content">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1100;
		animation: fade-in 0.3s ease-out;
	}

	.modal-backdrop.exiting {
		animation: fade-out 0.3s ease-out forwards;
	}

	.modal-container {
		background: white;
		border-radius: 16px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 900px;
		width: 90%;
		max-height: 85vh;
		overflow-y: auto;
		position: relative;
		animation: slide-up 0.3s ease-out;
	}

	.modal-container.exiting {
		animation: slide-down 0.3s ease-out forwards;
	}

	.modal-close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #666;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		transition: all 0.2s;
		z-index: 1101;
	}

	.modal-close-button:hover {
		background-color: #f0f0f0;
		color: #333;
	}

	.modal-content {
		padding: 2rem;
		padding-top: 3rem;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes slide-up {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes slide-down {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(20px);
			opacity: 0;
		}
	}

	@media (max-width: 768px) {
		.modal-container {
			max-width: 95%;
			max-height: 90vh;
			border-radius: 12px;
		}

		.modal-content {
			padding: 1.5rem;
			padding-top: 2.5rem;
		}
	}
</style>
