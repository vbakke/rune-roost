import { writable } from 'svelte/store';
import type { SkillId } from './skillTree.data';

// Load from localStorage if available (browser only)
const loadFromStorage = (): Set<SkillId> => {
    if (typeof window === 'undefined') return new Set();
    
    try {
        const stored = localStorage.getItem('learnedSkills');
        if (stored) {
            const parsed = JSON.parse(stored);
            return new Set(Array.isArray(parsed) ? parsed : []);
        }
    } catch (e) {
        console.warn('Failed to load learned skills from storage:', e);
    }
    return new Set();
};

// Save to localStorage
const saveToStorage = (skills: Set<SkillId>) => {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.setItem('learnedSkills', JSON.stringify(Array.from(skills)));
    } catch (e) {
        console.warn('Failed to save learned skills to storage:', e);
    }
};

const { subscribe, update, set } = writable<Set<SkillId>>(loadFromStorage());

const add = (id: SkillId) =>
    update((current) => {
        const next = new Set(current);
        next.add(id);
        saveToStorage(next);
        return next;
    });

const remove = (id: SkillId) =>
    update((current) => {
        const next = new Set(current);
        next.delete(id);
        saveToStorage(next);
        return next;
    });

const setMany = (ids: SkillId[]) => {
    const newSet = new Set(ids);
    saveToStorage(newSet);
    set(newSet);
};

const clear = () => {
    saveToStorage(new Set());
    set(new Set());
};

export const learnedSkills = {
    subscribe,
    add,
    remove,
    set: setMany,
    clear
};