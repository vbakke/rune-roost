import { writable } from 'svelte/store';
import type { AlphabetType } from './appState';

interface AlphabetLearningState {
    newlyLearnedAlphabet: AlphabetType | null;
    flashAlphabet: boolean;
}

function createAlphabetLearningStore() {
    const { subscribe, set, update } = writable<AlphabetLearningState>({
        newlyLearnedAlphabet: null,
        flashAlphabet: false
    });

    return {
        subscribe,
        learnAlphabet: (alphabet: AlphabetType) => {
            set({ newlyLearnedAlphabet: alphabet, flashAlphabet: true });
        },
        clearFlash: () => {
            update(state => ({ ...state, flashAlphabet: false }));
        },
        clear: () => {
            set({ newlyLearnedAlphabet: null, flashAlphabet: false });
        }
    };
}

export const alphabetLearning = createAlphabetLearningStore();
