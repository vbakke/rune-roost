import { writable } from 'svelte/store';
import type { SkillId } from '$lib/skills/skillTree.data';

export type AlphabetType = 'ROMAN' | 'LATIN' | 'ASCII' | 'UNICODE' | 'NUMBERS';
export type EncodingType = 'PLAIN' | 'BASE64' | 'HEX' | 'BINARY';

interface AppState {
    selectedAlphabet: AlphabetType;
    selectedEncoding: EncodingType;
    learnedSkills: Set<SkillId>;
}

const initialState: AppState = {
    selectedAlphabet: 'ROMAN',
    selectedEncoding: 'PLAIN',
    learnedSkills: new Set(['encoding.roman'])
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
                selectedEncoding: parsed.selectedEncoding || initialState.selectedEncoding,
                learnedSkills: new Set(Array.isArray(parsed.learnedSkills) ? parsed.learnedSkills : [])
            };
        }
        
        // Migration: Check for old learnedSkills key and migrate it
        const oldLearnedSkills = localStorage.getItem('learnedSkills');
        if (oldLearnedSkills) {
            try {
                const parsed = JSON.parse(oldLearnedSkills);
                return {
                    selectedAlphabet: initialState.selectedAlphabet,
                    selectedEncoding: initialState.selectedEncoding,
                    learnedSkills: new Set(Array.isArray(parsed) ? parsed : [])
                };
            } catch (e) {
                console.warn('Failed to migrate learnedSkills:', e);
            }
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
        localStorage.setItem('appState', JSON.stringify({
            selectedAlphabet: state.selectedAlphabet,
            selectedEncoding: state.selectedEncoding,
            learnedSkills: Array.from(state.learnedSkills)
        }));
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
        addLearnedSkill: (skillId: SkillId) => update(state => {
            const newSkills = new Set(state.learnedSkills);
            newSkills.add(skillId);
            const newState = { ...state, learnedSkills: newSkills };
            saveToStorage(newState);
            return newState;
        }),
        removeLearnedSkill: (skillId: SkillId) => update(state => {
            const newSkills = new Set(state.learnedSkills);
            newSkills.delete(skillId);
            const newState = { ...state, learnedSkills: newSkills };
            saveToStorage(newState);
            return newState;
        }),
        isSkillLearned: (skillId: SkillId) => {
            let learned = false;
            const unsubscribe = subscribe(state => {
                learned = state.learnedSkills.has(skillId);
            });
            unsubscribe();
            return learned;
        },
        reset: () => {
            saveToStorage(initialState);
            set(initialState);
        }
    };
}

export const appState = createAppState();
