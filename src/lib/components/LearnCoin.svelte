<script lang="ts">
	import { learnedSkills } from '$lib/skills/learnedSkills';
	import { flattenSkillTree, skillTree, type SkillId } from '$lib/skills/skillTree.data';
	import RavenHead from './icons/RavenHead.svelte';
	import RavenHeadBowed from './icons/RavenHeadBowed.svelte';
	import RavenHeadCrow from './icons/RavenHeadCrow.svelte';

	interface Props {
		topic: SkillId;
	}

	let { topic }: Props = $props();

	// Get all skills to check dependencies
	const allSkills = flattenSkillTree(skillTree);
	const skillNode = $derived(allSkills.find((s: any) => s.id === topic));

	// Determine skill state
	const isLearned = $derived($learnedSkills.has(topic));
	const canLearn = $derived.by(() => {
		if (!skillNode) return false;
		if (!skillNode.dependsOn || skillNode.dependsOn.length === 0) return true;
		return skillNode.dependsOn.every((dep: SkillId) => $learnedSkills.has(dep));
	});

	// Hovering state for animation
	let isHovering = $state(false);

	// Compute tooltip title
	const tooltipTitle = $derived.by(() => {
		if (!skillNode) return '';
		
		if (canLearn) {
			return `Learn about ${skillNode.label}`;
		} else {
			// Get the labels of dependencies
			const depLabels = skillNode.dependsOn
				?.map((depId: SkillId) => {
					const depNode = allSkills.find((s: any) => s.id === depId);
					return depNode?.label || depId;
				})
				.join(', ') || '';
				
			return `You must first learn ${depLabels}`;
		}
	});

	function handleClick() {
		if (!isLearned && canLearn) {
			// Dispatch custom event to parent
			const event = new CustomEvent('learn', { 
				detail: { topic },
				bubbles: true 
			});
			document.dispatchEvent(event);
		}
	}
</script>

{#if !isLearned}
	<button 
		class="learn-coin"
		class:can-learn={canLearn}
		class:cannot-learn={!canLearn}
		onclick={handleClick}
		onmouseenter={() => isHovering = true}
		onmouseleave={() => isHovering = false}
		disabled={!canLearn}
		title={tooltipTitle}
	>
		{#if !canLearn}
			<RavenHeadBowed />
		{:else if isHovering}
			<RavenHeadCrow />
		{:else}
			<RavenHead />
		{/if}
	</button>
{/if}

<style>
	.learn-coin {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.8em;
		height: 1.8em;
		border-radius: 50%;
		border: 2px solid;
		background: transparent;
		padding: 0.2em;
		cursor: pointer;
		vertical-align: middle;
		margin: 0 0.2em;
		position: relative;
		top: 0.3em;
		transition: all 0.2s ease;
	}

	.learn-coin :global(.raven-icon) {
		width: 100%;
		height: 100%;
	}

	.learn-coin.can-learn {
		border-color: #bea13b;
		background: rgb(226 192 72 / 10%);
	}

	.learn-coin.can-learn:hover {
		border-color: #e2c048;
		background: rgb(226 192 72 / 20%);
		transform: scale(1.1);
		box-shadow: 0 2px 8px rgba(190, 161, 59, 0.3);
	}

	.learn-coin.cannot-learn {
		border-color: #999;
		background: rgb(150 150 150 / 5%);
		cursor: not-allowed;
		opacity: 0.5;
	}

	.learn-coin.cannot-learn:hover {
		transform: none;
	}
</style>
