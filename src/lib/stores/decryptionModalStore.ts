import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export type ModalPhase = 'idle' | 'entering' | 'active' | 'exiting' | 'flying-away' | 'complete';

interface DecryptionModalState {
	isOpen: boolean;
	phase: ModalPhase;
}

function createDecryptionModalStore() {
	const { subscribe, set, update } = writable<DecryptionModalState>({
		isOpen: false,
		phase: 'idle'
	});

	return {
		subscribe,
		open: () => {
			set({ isOpen: true, phase: 'entering' });
			// Transition to 'active' after a brief moment to allow CSS animations to trigger
			setTimeout(() => {
				update(state => ({ ...state, phase: 'active' }));
			}, 50);
		},
		close: () => {
			update(state => ({ ...state, phase: 'exiting' }));
			// Wait for exit animation to complete before fully closing
			setTimeout(() => {
				set({ isOpen: false, phase: 'idle' });
			}, 300);
		},
		markCorrect: () => {
			update(state => ({ ...state, phase: 'flying-away' }));
		},
		markComplete: () => {
			update(state => ({ ...state, phase: 'complete' }));
		}
	};
}

export const decryptionModalStore = createDecryptionModalStore();
