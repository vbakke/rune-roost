import { flattenSkillTree, skillTree, type SkillId, type SkillCategory } from './skillTree.data';

export interface CategoryStats {
    category: SkillCategory;
    learned: number;
    total: number;
    percentage: number;
}

export interface SkillStats {
    totalLearned: number;
    totalSkills: number;
    overallPercentage: number;
    categories: CategoryStats[];
}

const flatSkills = flattenSkillTree(skillTree);

export function calculateSkillStats(learnedSkills: Set<SkillId>): SkillStats {
    const totalSkills = flatSkills.length;
    const totalLearned = learnedSkills.size;
    
    // Calculate category stats
    const categoryMap = new Map<SkillCategory, { learned: number; total: number }>();
    
    flatSkills.forEach((skill: { id: SkillId; category: SkillCategory }) => {
        if (!categoryMap.has(skill.category)) {
            categoryMap.set(skill.category, { learned: 0, total: 0 });
        }
        const stats = categoryMap.get(skill.category)!;
        stats.total++;
        if (learnedSkills.has(skill.id)) {
            stats.learned++;
        }
    });
    
    const categories: CategoryStats[] = Array.from(categoryMap.entries()).map(([category, stats]) => ({
        category,
        learned: stats.learned,
        total: stats.total,
        percentage: stats.total > 0 ? Math.round((stats.learned / stats.total) * 100) : 0
    }));
    
    return {
        totalLearned,
        totalSkills,
        overallPercentage: totalSkills > 0 ? Math.round((totalLearned / totalSkills) * 100) : 0,
        categories
    };
}

export function getCategoryIcon(category: SkillCategory): string {
    switch (category) {
        case 'encoding':
            return '📝';
        case 'symmetric':
            return '🔐';
        case 'asymmetric':
            return '🔑';
        case 'hashing':
            return '🔨';
        default:
            return '📚';
    }
}

export function getCategoryColor(category: SkillCategory): string {
    switch (category) {
        case 'encoding':
            return '#fbbf24'; // amber
        case 'symmetric':
            return '#34d399'; // emerald
        case 'asymmetric':
            return '#a78bfa'; // purple
        case 'hashing':
            return '#f472b6'; // pink
        default:
            return '#60a5fa'; // blue
    }
}

export function getCategoryLabel(category: SkillCategory): string {
    switch (category) {
        case 'encoding':
            return 'Encoding';
        case 'symmetric':
            return 'Symmetric';
        case 'asymmetric':
            return 'Asymmetric';
        case 'hashing':
            return 'Hashing';
        default:
            return category;
    }
}
