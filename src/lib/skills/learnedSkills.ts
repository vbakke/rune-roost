import { writable } from 'svelte/store';
import type { SkillId } from './skillTree.data';

const { subscribe, update, set } = writable<Set<SkillId>>(new Set());

const add = (id: SkillId) =>
    update((current) => {
        const next = new Set(current);
        next.add(id);
        return next;
    });

const remove = (id: SkillId) =>
    update((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
    });

const setMany = (ids: SkillId[]) => set(new Set(ids));

const clear = () => set(new Set());

export const learnedSkills = {
    subscribe,
    add,
    remove,
    set: setMany,
    clear
};