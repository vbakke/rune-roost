export type SkillState = 'LEARNT' | 'CAN_LEARN' | 'CANNOT_LEARN' | 'INVISIBLE';
export type Realm = 'SYMMETRIC' | 'ASYMMETRIC' | 'HASHING' | 'GENERAL';

export interface SkillNode {
	id: string;
	title: string;
	description: string;
	hint?: string | undefined;
	realm: Realm;
	state: SkillState;
	position: { x: number; y: number };
}

export const realmColors: Record<Realm, string> = {
	GENERAL: '#60a5fa',
	SYMMETRIC: '#34d399',
	ASYMMETRIC: '#a78bfa',
	HASHING: '#f472b6'
};

export const skills: SkillNode[] = [
	{
		id: 'center',
		title: '',
		description: 'Begin your journey to master encryption',
		hint: 'Select your realm the want to dvelve into',
		realm: 'GENERAL',
		state: 'LEARNT',
		position: { x: 50, y: 45 }
	},
	{
		id: 'symmetric',
		title: 'Shared password',
		description: 'Sharing secret keys',
		realm: 'SYMMETRIC',
		state: 'CAN_LEARN',
		position: { x: 15, y: 15 }
	},
	{
		id: 'asymmetric',
		title: 'Private key',
		description: 'Public and private keys',
		realm: 'ASYMMETRIC',
		state: 'CAN_LEARN',
		position: { x: 85, y: 15 }
	},
	{
		id: 'hashing',
		title: 'Hashing',
		description: 'Not encryption, but often confused',
		realm: 'HASHING',
		state: 'CAN_LEARN',
		position: { x: 50, y: 85 }
	}
];
