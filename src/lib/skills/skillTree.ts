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