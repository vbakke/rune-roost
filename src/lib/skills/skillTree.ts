import { flattenSkillTree, skillTree, type SkillId, type UiGate } from './skillTree.data';

export type SkillRef = SkillId | UiGate;

const flatSkills = flattenSkillTree(skillTree);

const skillByGate = (gate: UiGate): SkillId[] =>
    flatSkills
        .filter((s) => s.uiGates?.includes(gate))
        .map((s) => s.id);

export const isGateRef = (ref: SkillRef): ref is UiGate => ref.startsWith('gate:');

export const canAccess = (refs: SkillRef[], learned: Set<SkillId>): boolean => {
    const requiredSkills = refs.flatMap((ref) =>
        isGateRef(ref) ? skillByGate(ref) : [ref]
    );

    return requiredSkills.every((id) => learned.has(id));
};

export type SkillState = 'LEARNT' | 'CAN_LEARN' | 'NOT_READY';

/**
 * Get the skill from the flattened tree
 */
const getSkill = (skillId: SkillId) => flatSkills.find((s) => s.id === skillId);

/**
 * Check if all dependencies of a skill have been learned
 */
export const canLearnSkill = (skillId: SkillId, learned: Set<SkillId>): boolean => {
    const skill = getSkill(skillId);
    if (!skill) return false;
    
    if (!skill.dependsOn || skill.dependsOn.length === 0) {
        return true;
    }
    
    return skill.dependsOn.every((dep) => learned.has(dep));
};

/**
 * Get the current state of a skill: LEARNT, CAN_LEARN, or NOT_READY
 */
export const getSkillState = (skillId: SkillId, learned: Set<SkillId>): SkillState => {
    if (learned.has(skillId)) {
        return 'LEARNT';
    }
    
    if (canLearnSkill(skillId, learned)) {
        return 'CAN_LEARN';
    }
    
    return 'NOT_READY';
};

/**
 * Get the dependencies that are not yet learned for a skill
 */
export const getMissingDependencies = (skillId: SkillId, learned: Set<SkillId>): SkillId[] => {
    const skill = getSkill(skillId);
    if (!skill || !skill.dependsOn) return [];
    
    return skill.dependsOn.filter((dep) => !learned.has(dep));
};