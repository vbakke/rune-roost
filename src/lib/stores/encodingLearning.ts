import { writable } from 'svelte/store';
import type { EncodingType } from './appState';

interface EncodingLearningState {
    newlyLearnedEncoding: EncodingType | null;
    flashEncoding: boolean;
}

function createEncodingLearningStore() {
    const { subscribe, set, update } = writable<EncodingLearningState>({
        newlyLearnedEncoding: null,
        flashEncoding: false
    });

    return {
        subscribe,
        learnEncoding: (encoding: EncodingType) => {
            set({ newlyLearnedEncoding: encoding, flashEncoding: true });
        },
        clear: () => {
            set({ newlyLearnedEncoding: null, flashEncoding: false });
        }
    };
}

export const encodingLearning = createEncodingLearningStore();
