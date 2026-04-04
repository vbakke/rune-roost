import BasicKnowledge from '$lib/components/textbooks/BasicKnowledge.svelte';
import SymmetricDecrypt from '$lib/components/textbooks/SymmetricDecrypt.svelte';
import AsymmetricDecrypt from '$lib/components/textbooks/AsymmetricDecrypt.svelte';
import HashingDecrypt from '$lib/components/textbooks/HashingDecrypt.svelte';
import type { SkillId } from '$lib/skills/skillTree.data';

export interface TextbookEntry {
	label: string;
	pages: any[]; // Array of Svelte components
}

export const textbooks: Record<SkillId, TextbookEntry> = {
	'basic.intro': {
		label: 'Basic Knowledge',
		pages: [BasicKnowledge]
	},
	'sym.decrypt': {
		label: 'Symmetric Decryption',
		pages: [SymmetricDecrypt]
	},
	'asym.decrypt': {
		label: 'Asymmetric Decryption',
		pages: [AsymmetricDecrypt]
	},
	'hashing.overview': {
		label: 'Hashing Overview',
		pages: [HashingDecrypt]
	}
} as const satisfies Record<SkillId, TextbookEntry>;

export const getTextbook = (skillId: SkillId): TextbookEntry | undefined => {
	return textbooks[skillId];
};
