<script lang="ts">
	import '../../app.css';
	import { goto } from '$app/navigation';
	import SEO from '$lib/components/SEO.svelte';
	import { skills, realmColors, skillLinks, type SkillNode } from '$lib/data/skills';
	import HarvestRune from '$lib/components/runes/HarvestRune.svelte';
	import EarthRune from '$lib/components/runes/EarthRune.svelte';
	import DayRune from '$lib/components/runes/DayRune.svelte';
	import FireRune from '$lib/components/runes/FireRune.svelte';
	import QuillIcon from '$lib/components/icons/QuillIcon.svelte';
	import CannotLearnIcon from '$lib/components/icons/CannotLearnIcon.svelte';

	let selectedSkill: SkillNode | null = null;

	function selectSkill(skill: SkillNode) {
		if (skill.state !== 'INVISIBLE') {
			selectedSkill = skill;
		}
	}

	function startLesson(skillId: string) {
		// Navigate to læran page with realm anchor
		goto(`/lær#${skillId}`);
	}

	function goBack() {
		goto('/');
	}

	function closePanel() {
		selectedSkill = null;
	}

	const positionById = new Map(skills.map((skill) => [skill.id, skill.position]));
	const dependencyLines = skillLinks
		.map((link) => {
			const from = positionById.get(link.fromId);
			const to = positionById.get(link.toId);
			if (!from || !to) {
				return null;
			}

			return {
				x1: from.x,
				y1: from.y,
				x2: to.x,
				y2: to.y,
				color: realmColors[link.realm]
			};
		})
		.filter((line): line is { x1: number; y1: number; x2: number; y2: number; color: string } =>
			line !== null
		);

	const encodingSkills = skills.filter((s) => s.realm === 'ENCODING');
	const mainSkills = skills.filter((s) => s.realm !== 'ENCODING' && s.id !== 'center');

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: 'Encryption Learning Paths',
		description: 'Interactive skill tree for learning encryption concepts including symmetric encryption, asymmetric encryption, and hashing',
		provider: {
			'@type': 'Organization',
			name: 'Which Encrypt',
		},
		educationalLevel: 'Beginner to Intermediate',
		hasCourseInstance: [
			{
				'@type': 'CourseInstance',
				name: 'Symmetric Encryption',
				description: 'Learn about sharing secret keys'
			},
			{
				'@type': 'CourseInstance',
				name: 'Asymmetric Encryption',
				description: 'Understand public and private keys'
			},
			{
				'@type': 'CourseInstance',
				name: 'Hashing',
				description: 'Learn why hashing is not encryption'
			}
		]
	};
</script>

<SEO
	title="Choose Your Encryption Learning Path"
	description="Select your encryption learning journey: symmetric encryption with secret keys, asymmetric encryption with public/private keys, or hashing fundamentals."
	keywords="encryption skill tree, learn symmetric encryption, learn asymmetric encryption, hashing tutorial, cryptography courses"
	url="/wīsdōm"
	{structuredData}
/>

<div class="skill-tree-page">
	<header class="header">
		<button class="back-button" onclick={goBack}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			Back
		</button>
		<h1 class="page-title">Choose Your Path to Wisdom</h1>
	</header>

	<div class="skill-tree-wrapper">
		<!-- Encoding Tree (left on desktop, top on mobile) -->
		<div class="encoding-tree-container">
			<div class="skill-tree-inner">
				<svg class="connection-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
					<!-- Encoding internal dependency lines -->
					{#each dependencyLines as line}
					{@const fromSkill = skills.find((s) => s.position.x === line.x1 && s.position.y === line.y1)}
					{@const toSkill = skills.find((s) => s.position.x === line.x2 && s.position.y === line.y2)}
					{#if fromSkill?.realm === 'ENCODING' && toSkill?.realm === 'ENCODING'}
								y2={line.y2}
								stroke={line.color}
								stroke-width="1.25"
								opacity="0.9"
							/>
						{/if}
					{/each}
				</svg>

				<div class="skill-nodes">
					{#each encodingSkills as skill}
						{#if skill.state !== 'INVISIBLE'}
							<button
								class="skill-node"
								class:learnt={skill.state === 'LEARNT'}
								class:can-learn={skill.state === 'CAN_LEARN'}
								class:cannot-learn={skill.state === 'CANNOT_LEARN'}
								class:selected={selectedSkill?.id === skill.id}
								style="left: {skill.position.x}%; top: {skill.position.y}%; --node-color: {realmColors[skill.realm]}"
								onclick={() => selectSkill(skill)}
							>
								<div class="node-circle">
									{#if skill.state === 'CANNOT_LEARN'}
										<CannotLearnIcon />
									{:else if skill.state === 'LEARNT'}
										<HarvestRune />
									{:else if skill.realm === 'ENCODING'}
										<QuillIcon size="2em" />
									{:else}
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
											<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
										</svg>
									{/if}
								</div>
								<div class="node-label">{skill.title}</div>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>

		<!-- Main Skill Tree (right on desktop, bottom on mobile) -->
		<div class="main-tree-container">
			<div class="skill-tree-inner">
				<svg class="connection-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
					<!-- Lines connecting center to category nodes -->
					<line x1="50" y1="130" x2="50" y2="135" stroke={realmColors.SYMMETRIC} stroke-width="0.3" opacity="0.5" />
					<line x1="50" y1="130" x2="80" y2="135" stroke={realmColors.ASYMMETRIC} stroke-width="0.3" opacity="0.5" />
					<line x1="50" y1="130" x2="20" y2="135" stroke={realmColors.HASHING} stroke-width="0.3" opacity="0.5" />

					<!-- Lines showing dependency paths (excluding encoding cross-links) -->
					{#each dependencyLines as line}
					{@const fromSkill = skills.find((s) => s.position.x === line.x1 && s.position.y === line.y1)}
					{@const toSkill = skills.find((s) => s.position.x === line.x2 && s.position.y === line.y2)}
					{#if fromSkill?.realm !== 'ENCODING' && toSkill?.realm !== 'ENCODING'}
							/>
						{/if}
					{/each}
				</svg>

				<div class="skill-nodes">
					<!-- Center node -->
					{#if skills.find((s) => s.id === 'center')}
						{@const centerSkill = skills.find((s) => s.id === 'center')}
						<button
							class="skill-node"
							class:learnt={centerSkill.state === 'LEARNT'}
							class:selected={selectedSkill?.id === centerSkill.id}
							style="left: {centerSkill.position.x}%; top: {centerSkill.position.y}%; --node-color: {realmColors[centerSkill.realm]}"
							onclick={() => selectSkill(centerSkill)}
						>
							<div class="node-circle">
								<HarvestRune />
							</div>
							<div class="node-label">{centerSkill.title}</div>
						</button>
					{/if}

					<!-- Main tree nodes -->
					{#each mainSkills as skill}
						{#if skill.state !== 'INVISIBLE'}
							<button
								class="skill-node"
								class:learnt={skill.state === 'LEARNT'}
								class:can-learn={skill.state === 'CAN_LEARN'}
								class:cannot-learn={skill.state === 'CANNOT_LEARN'}
								class:selected={selectedSkill?.id === skill.id}
								style="left: {skill.position.x}%; top: {skill.position.y}%; --node-color: {realmColors[skill.realm]}"
								onclick={() => selectSkill(skill)}
							>
								<div class="node-circle">
									{#if skill.state === 'CANNOT_LEARN'}
										<CannotLearnIcon />
									{:else if skill.state === 'LEARNT'}
										<HarvestRune />
									{:else if skill.realm === 'HASHING'}
										<EarthRune />
									{:else if skill.realm === 'SYMMETRIC'}
										<DayRune />
									{:else if skill.realm === 'ASYMMETRIC'}
										<FireRune />
									{:else}
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
											<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
										</svg>
									{/if}
								</div>
								<div class="node-label">{skill.title}</div>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>

	{#if selectedSkill}
    	<button class="panel-backdrop" onclick={closePanel} aria-label="Close panel"></button>
		<div class="skill-detail-panel">
			<div class="panel-content">
				<h2 class="skill-title" style="color: {realmColors[selectedSkill.realm]}">{selectedSkill.title}</h2>
				<p class="skill-description">{selectedSkill.description}</p>
				
				{#if selectedSkill.state === 'CAN_LEARN'}
					<button 
						class="start-lesson-button"
						style="background: linear-gradient(135deg, {realmColors[selectedSkill.realm]}, {realmColors[selectedSkill.realm]}dd)"
						onclick={() => startLesson(selectedSkill.id)}
					>
						Start Learning
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
							<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
                {/if}
				{#if selectedSkill.hint}
					<p class="hint-text">{selectedSkill.hint}</p>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.skill-tree-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		position: relative;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
		position: relative;
		z-index: 30;
	}

	.back-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		background: var(--bg-secondary);
		transition: all 0.3s ease;
	}

	.back-button:hover {
		background: var(--bg-tertiary);
		color: var(--accent-blue);
		transform: translateX(-3px);
	}

	.page-title {
		font-size: clamp(1.5rem, 5vw, 2rem);
		background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.skill-tree-wrapper {
		display: flex;
		gap: 2rem;
		flex: 1;
		max-height: calc(100vh - 260px);
		min-height: 520px;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
	}

	.encoding-tree-container {
		flex: 0 0 20%;
		min-width: 150px;
		max-width: 250px;
	}

	.main-tree-container {
		flex: 1;
		min-width: 250px;
	}

	.skill-tree-inner {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.skill-tree-container {
		flex: 1;
		position: relative;
		max-height: calc(100vh - 300px);
		min-height: 300px;
		max-width: 800px;
		width: 100%;
		margin: 0 auto;
	}

	.connection-lines {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.skill-nodes {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		pointer-events: none;
	}

	.skill-node {
		position: absolute;
		transform: translate(-50%, -40px);
		display: flex;
		flex-direction: column;
		align-items: center;
		/* gap: 0.5rem; */
		transition: all 0.3s ease;
		cursor: pointer;
		pointer-events: auto;
	}

	.skill-node:hover:not(.cannot-learn) {
		transform: translate(-50%, -40px) scale(1.1);
	}

	.skill-node.selected .node-circle {
		box-shadow: 0 0 30px var(--node-color), 0 0 60px var(--node-color);
		transform: scale(1.2);
	}

	.node-circle {
		width: 55px;
		height: 55px;
		border-radius: 50%;
		background: var(--bg-secondary);
		border: 3px solid var(--node-color);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--node-color);
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3), 0 0 20px var(--node-color);
		transition: all 0.3s ease;
		position: relative;
	}

	.node-circle::before {
		content: '';
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		background: var(--node-color);
		opacity: 0;
	}

	/* Only CAN_LEARN nodes glow */
	.skill-node.can-learn .node-circle::before {
		animation: pulse-ring 2s ease-out 6 forwards;
	}

	.skill-node.can-learn:hover .node-circle::before {
		animation: pulse-ring 1s ease-out infinite;
	}

	/* CANNOT_LEARN nodes are dimmed */
	.skill-node.cannot-learn .node-circle {
		border-color: var(--border-color);
		color: var(--border-color);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}

	/* LEARNT nodes have checkmark and subtle styling */
	.skill-node.learnt .node-circle {
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
	}

	.node-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
		max-width: 120px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.skill-node.cannot-learn .node-label {
		color: color-mix(in srgb, var(--text-secondary), 60% black);
		text-shadow: 0px 0px 2px rgb(00,00,00);
	}

	.panel-backdrop {
		position: fixed;
		inset: 0;
		background: transparent;
		z-index: 25;
		cursor: default;
	}

	.skill-detail-panel {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--bg-secondary);
		border-top: 2px solid var(--border-color);
		padding: 1.5rem;
		z-index: 30;
		animation: slideUpPanel 0.3s ease-out;
		box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
	}

	.panel-content {
		max-width: 600px;
		margin: 0 auto;
	}

	.skill-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.skill-description {
		color: var(--text-secondary);
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.hint-text {
		color: var(--accent-blue);
		font-style: italic;
		font-size: 0.9rem;
	}

	.start-lesson-button {
		width: 100%;
		padding: 1rem;
		border-radius: 12px;
		color: white;
		font-weight: 600;
		font-size: 1.1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
		transition: all 0.3s ease;
	}

	.start-lesson-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
	}

	@keyframes slideUpPanel {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes pulse-ring {
		0% {
			opacity: 0.5;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.5);
		}
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.skill-tree-wrapper {
			flex-direction: column;
			gap: 1rem;
			max-height: none;
			min-height: auto;
		}

		.encoding-tree-container {
			flex: 0 0 auto;
			max-width: none;
			height: 200px;
		}

		.main-tree-container {
			flex: 1;
			min-height: 400px;
		}

		.skill-tree-inner {
			height: 100%;
		}

		.node-circle {
			width: 60px;
			height: 60px;
		}

		.node-circle svg {
			width: 20px;
			height: 20px;
		}

		.node-label {
			font-size: 0.8rem;
			max-width: 100px;
		}

		.skill-detail-panel {
			padding: 1rem;
		}

		.skill-title {
			font-size: 1.25rem;
		}

		.start-lesson-button {
			font-size: 1rem;
			padding: 0.875rem;
		}
	}

	@media (max-width: 480px) {
		.page-title {
			font-size: 1.25rem;
		}

		.back-button {
			padding: 0.5rem;
		}

		.back-button span {
			display: none;
		}
	}
</style>
