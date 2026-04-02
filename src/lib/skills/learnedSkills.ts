import { derived } from 'svelte/store';
import { appState } from '$lib/stores/appState';
import type { SkillId } from './skillTree.data';

/**
 * DEPRECATED: Use appState directly instead.
 * This is a derived store created for backward compatibility.
 * It automatically syncs with appState.learnedSkills.
 * 
 * For new code:
 * - Subscribe to skills: $appState.learnedSkills
 * - Add skill: appState.addLearnedSkill(skillId)
 * - Remove skill: appState.removeLearnedSkill(skillId)
 */
const derivedStore = derived(
    appState,
    $appState => $appState.learnedSkills
);

export const learnedSkills = {
    subscribe: derivedStore.subscribe,
    add: (id: SkillId) => {
        appState.addLearnedSkill(id);
    },
    remove: (id: SkillId) => {
        appState.removeLearnedSkill(id);
    },
    clear: () => {
        // Reset appState to clear learned skills
        appState.reset();
    }
};