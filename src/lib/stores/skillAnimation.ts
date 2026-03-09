import { writable } from 'svelte/store';
import type { SkillId } from '$lib/skills/skillTree.data';

export type AnimationPhase = 'idle' | 'reveal-statusbar' | 'flash-badge' | 'fly-to-target' | 'apply-change' | 'flash-result' | 'complete';

export interface SkillAnimation {
    skillId: SkillId;
    label: string;
    startX: number;
    startY: number;
    targetElement: 'alphabet' | 'encoding' | 'general';
    phase: AnimationPhase;
}

interface SkillAnimationState {
    currentAnimation: SkillAnimation | null;
    revealStatusBar: boolean;
}

function createSkillAnimationStore() {
    const { subscribe, set, update } = writable<SkillAnimationState>({
        currentAnimation: null,
        revealStatusBar: false
    });

    return {
        subscribe,
        startAnimation: (animation: Omit<SkillAnimation, 'phase'>) => {
            set({ 
                currentAnimation: { ...animation, phase: 'reveal-statusbar' },
                revealStatusBar: true
            });
        },
        updatePhase: (phase: AnimationPhase) => {
            update(state => {
                if (state.currentAnimation) {
                    return {
                        ...state,
                        currentAnimation: { ...state.currentAnimation, phase }
                    };
                }
                return state;
            });
        },
        clearAnimation: () => {
            set({ currentAnimation: null, revealStatusBar: false });
        }
    };
}

export const skillAnimation = createSkillAnimationStore();
