import {
	flattenSkillTree,
	skillTree,
	type SkillCategory,
	type SkillId,
	type FlattenedSkillNode,
	type SkillTree
} from '$lib/skills/skillTree.data';

export type SkillState = 'LEARNT' | 'CAN_LEARN' | 'CANNOT_LEARN' | 'INVISIBLE';
export type Realm = 'SYMMETRIC' | 'ASYMMETRIC' | 'HASHING' | 'ENCODING' | 'GENERAL';

export interface SkillNode {
	id: string;
	title: string;
	description: string;
	hint?: string | undefined;
	realm: Realm;
	state: SkillState;
	position: { x: number; y: number };
}

export type SkillLink = {
	fromId: string;
	toId: string;
	realm: Realm;
};

export const realmColors: Record<Realm, string> = {
	GENERAL: '#60a5fa',
	SYMMETRIC: '#34d399',
	ASYMMETRIC: '#a78bfa',
	HASHING: '#f472b6',
	ENCODING: '#fbbf24'
};

type CategoryConfig = {
	id: SkillCategory;
	title: string;
	description: string;
	realm: Realm;
	position: { x: number; y: number };
};

type CategoryConfigWithLayout = CategoryConfig & { isEncoding?: boolean };

const categoryConfig: CategoryConfigWithLayout[] = [
	{
		id: 'encoding',
		title: 'Encoding',
		description: 'Representing text and bytes',
		realm: 'ENCODING',
		position: { x: 65, y: 100 },
		isEncoding: true
	},
	{
		id: 'symmetric',
		title: 'Shared password',
		description: 'Sharing secret keys',
		realm: 'SYMMETRIC',
		position: { x: 20, y: 100 }
	},
	{
		id: 'asymmetric',
		title: 'Private key',
		description: 'Public and private keys',
		realm: 'ASYMMETRIC',
		position: { x: 50, y: 100 }
	},
	{
		id: 'hashing',
		title: 'Hashing',
		description: 'Not encryption, but often confused',
		realm: 'HASHING',
		position: { x: 80, y: 100 }
	}
];

const categoryById = new Map(categoryConfig.map((entry) => [entry.id, entry]));

const buildDepthMap = (nodesById: Map<SkillId, FlattenedSkillNode>): Map<SkillId, number> => {
	const depthById = new Map<SkillId, number>();
	const visiting = new Set<SkillId>();

	const computeDepth = (id: SkillId): number => {
		if (depthById.has(id)) {
			return depthById.get(id) ?? 0;
		}
		if (visiting.has(id)) {
			return 0;
		}
		visiting.add(id);
		const node = nodesById.get(id);
		const depth = node?.dependsOn?.length
			? 1 + Math.max(...node.dependsOn.map((dep) => computeDepth(dep)))
			: 0;
		visiting.delete(id);
		depthById.set(id, depth);
		return depth;
	};

	Array.from(nodesById.keys()).forEach((key) => computeDepth(key));
	return depthById;
};

const hintFor = (
	node: FlattenedSkillNode,
	nodesById: Map<SkillId, FlattenedSkillNode>
): string | undefined => {
	if (!node.dependsOn?.length) {
		return undefined;
	}

	const dependencyLabels = node.dependsOn
		.map((id) => nodesById.get(id)?.label)
		.filter(Boolean)
		.join(', ');

	return dependencyLabels ? `Requires: ${dependencyLabels}` : undefined;
};

const stateFor = (node: FlattenedSkillNode): SkillState =>
	node.dependsOn?.length ? 'CANNOT_LEARN' : 'CAN_LEARN';

const buildCategoryNodes = (): SkillNode[] =>
	categoryConfig
		.filter((category) => !category.isEncoding)
		.map((category) => ({
			id: category.id,
			title: category.title,
			description: category.description,
			realm: category.realm,
			state: 'CAN_LEARN',
			position: category.position
		}));

const buildSkillNodes = (tree: SkillTree): SkillNode[] => {
	const flatSkills = flattenSkillTree(tree);
	const nodesById = new Map<SkillId, FlattenedSkillNode>(
		flatSkills.map((node) => [node.id, node])
	);
	const depthById = buildDepthMap(nodesById);
	const grouped = new Map<SkillCategory, FlattenedSkillNode[]>();

	categoryConfig.forEach((category) => grouped.set(category.id, []));

	flatSkills.forEach((node) => {
		const bucket = grouped.get(node.category);
		if (bucket) {
			bucket.push(node);
		}
	});

	const rowSpacing = 16;
	const columnSpacing = 10;
	const nodes: SkillNode[] = [];

	grouped.forEach((entries, category) => {
		const config = categoryById.get(category);
		if (!config) {
			return;
		}

		const isEncodingCategory = (config as CategoryConfigWithLayout).isEncoding;
		// const direction = isEncodingCategory ? -1 : config.position.y <= 50 ? 1 : -1;
		const direction = -1;
		const ordered = entries
			.slice()
			.sort((a, b) => {
				const depthDiff = (depthById.get(a.id) ?? 0) - (depthById.get(b.id) ?? 0);
				if (depthDiff !== 0) {
					return depthDiff;
				}
				return a.label.localeCompare(b.label);
			});

		const clamp = (value: number, min: number, max: number) =>
			Math.min(max, Math.max(min, value));

		// if (isEncodingCategory) {
			// For encoding, group by depth to create a tree layout
			const byDepth = new Map<number, FlattenedSkillNode[]>();
			ordered.forEach((node) => {
				const depth = depthById.get(node.id) ?? 0;
				if (!byDepth.has(depth)) {
					byDepth.set(depth, []);
				}
				byDepth.get(depth)!.push(node);
			});

			byDepth.forEach((depthNodes) => {
				depthNodes.forEach((node, indexInDepth) => {
					const depth = depthById.get(node.id) ?? 0;
					const positionY = config.position.y + direction * rowSpacing * (depth + 1);
					const horizontalSpacing = node.category === 'encoding' ? 50 : 20;
					const positionX =
						config.position.x +
						(indexInDepth - (depthNodes.length - 1) / 2) * horizontalSpacing;

					nodes.push({
						id: node.id,
						title: node.label,
						description: `${node.description ? node.description : node.label}`,
						hint: hintFor(node, nodesById),
						realm: config.realm,
						state: stateFor(node),
						position: {
							x: clamp(positionX, 6, 94),
							y: positionY
						}
					});
				});
			});
		// } else {
		// 	ordered.forEach((node, index) => {
		// 		const row = Math.floor(index / 2);
		// 		const column = index % 2;
		// 		const offsetX = (column === 0 ? -1 : 1) * columnSpacing;
		// 		const positionX = clamp(config.position.x + offsetX, 6, 94);
		// 		const positionY = config.position.y + direction * rowSpacing * (row + 1);

		// 		nodes.push({
		// 			id: node.id,
		// 			title: node.label,
		// 			description: `Lesson: ${node.label}`,
		// 			hint: hintFor(node, nodesById),		
		// 			realm: config.realm,
		// 			state: stateFor(node),
		// 			position: {
		// 				x: positionX,
		// 				y: positionY
		// 			}
		// 		});
		// 	});
		// }
	});

	return nodes;
}
		
const generatedSkills: SkillNode[] = [
	{
		id: 'center',
		title: 'Choose Your Path',
		description: 'Begin your journey to master encryption',
		hint: 'Select a path to explore.',
		realm: 'GENERAL',
		state: 'LEARNT',
		position: { x: 50, y: 120 }
	},
	...buildCategoryNodes(),
	...buildSkillNodes(skillTree)
];

const buildSkillLinks = (tree: SkillTree, nodes: SkillNode[]): SkillLink[] => {
	const realmById = new Map(nodes.map((node) => [node.id, node.realm]));
	const flatSkills = flattenSkillTree(tree);

	// Loop over all skills and their dependencies
	return flatSkills.flatMap((node) =>
		(node.dependsOn ?? []).map((dependency) => {
			const depRealm = realmById.get(dependency);
			const nodeRealm = realmById.get(node.id);
			
			if (!depRealm) {
				console.warn(`Node ${node.id} has unknown dependency ${dependency}`);
				return null;
			}

			// Skip cross-realm links from encoding to other categories
			if (depRealm === 'ENCODING' || nodeRealm === 'ENCODING') {
				if (depRealm !== nodeRealm) {
					return null;
				}
			}

			return {
				fromId: dependency,
				toId: node.id,
				realm: realmById.get(node.id) ?? 'GENERAL'
			};
		})
		.filter((link): link is SkillLink => link !== null)
	);
};

export const skills = generatedSkills;
export const skillLinks = buildSkillLinks(skillTree, generatedSkills);
