import { writable } from 'svelte/store';

export type AlphabetType = 'ROMAN' | 'LATIN' | 'ASCII' | 'UNICODE' | 'NUMBERS';
export type EncodingType = 'PLAIN' | 'BASE64' | 'HEX' | 'BINARY';

interface AppState {
    selectedAlphabet: AlphabetType;
    selectedEncoding: EncodingType;
}

const initialState: AppState = {
    selectedAlphabet: 'ROMAN',
    selectedEncoding: 'PLAIN'
};

// Load from localStorage if available (browser only)
const loadFromStorage = (): AppState => {
    if (typeof window === 'undefined') return initialState;
    
    try {
        const stored = localStorage.getItem('appState');
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                selectedAlphabet: parsed.selectedAlphabet || initialState.selectedAlphabet,
                selectedEncoding: parsed.selectedEncoding || initialState.selectedEncoding
            };
        }
    } catch (e) {
        console.warn('Failed to load app state from storage:', e);
    }
    return initialState;
};

// Save to localStorage
const saveToStorage = (state: AppState) => {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.setItem('appState', JSON.stringify(state));
    } catch (e) {
        console.warn('Failed to save app state to storage:', e);
    }
};

function createAppState() {
    const { subscribe, set, update } = writable<AppState>(loadFromStorage());

    return {
        subscribe,
        setAlphabet: (alphabet: AlphabetType) => update(state => {
            const newState = { ...state, selectedAlphabet: alphabet };
            saveToStorage(newState);
            return newState;
        }),
        setEncoding: (encoding: EncodingType) => update(state => {
            const newState = { ...state, selectedEncoding: encoding };
            saveToStorage(newState);
            return newState;
        }),
        reset: () => {
            saveToStorage(initialState);
            set(initialState);
        }
    };
}

export const appState = createAppState();
