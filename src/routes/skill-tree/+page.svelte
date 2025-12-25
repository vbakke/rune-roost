<script lang="ts">
	import '../../app.css';
	import { goto } from '$app/navigation';
	import SEO from '$lib/components/SEO.svelte';

	interface SkillNode {
		id: string;
		title: string;
		description: string;
		color: string;
		locked: boolean;
		position: { x: number; y: number };
	}

	const skills: SkillNode[] = [
		{
			id: 'center',
			title: 'Start',
			description: 'Begin your encryption journey',
			color: '#60a5fa',
			locked: false,
			position: { x: 50, y: 50 }
		},
		{
			id: 'symmetric',
			title: 'Symmetric Encryption',
			description: 'Sharing secret keys',
			color: '#34d399',
			locked: false,
			position: { x: 20, y: 20 }
		},
		{
			id: 'asymmetric',
			title: 'Asymmetric Encryption',
			description: 'Public and private keys',
			color: '#a78bfa',
			locked: false,
			position: { x: 80, y: 20 }
		},
		{
			id: 'hashing',
			title: 'Hashing',
			description: 'Not encryption, but often confused',
			color: '#f472b6',
			locked: false,
			position: { x: 50, y: 85 }
		}
	];

	let selectedSkill: SkillNode | null = null;

	function selectSkill(skill: SkillNode) {
		if (!skill.locked) {
			selectedSkill = skill;
		}
	}

	function startLesson(skillId: string) {
		// TODO: Navigate to lesson page
		console.log('Starting lesson for:', skillId);
	}

	function goBack() {
		goto('/');
	}

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: 'Encryption Learning Paths',
		description: 'Interactive skill tree for learning encryption concepts including symmetric encryption, asymmetric encryption, and hashing',
		provider: {
			'@type': 'Organization',
			name: 'Rune Roost'
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
	url="/skill-tree"
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
		<h1 class="page-title">Choose Your Path</h1>
	</header>

	<div class="skill-tree-container">
		<svg class="connection-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
			<!-- Lines connecting nodes -->
			<line x1="50" y1="50" x2="20" y2="20" stroke="#60a5fa" stroke-width="0.3" opacity="0.5" />
			<line x1="50" y1="50" x2="80" y2="20" stroke="#a78bfa" stroke-width="0.3" opacity="0.5" />
			<line x1="50" y1="50" x2="50" y2="85" stroke="#f472b6" stroke-width="0.3" opacity="0.5" />
		</svg>

		<div class="skill-nodes">
			{#each skills as skill}
				<button
					class="skill-node"
					class:locked={skill.locked}
					class:selected={selectedSkill?.id === skill.id}
					style="left: {skill.position.x}%; top: {skill.position.y}%; --node-color: {skill.color}"
					onclick={() => selectSkill(skill)}
				>
					<div class="node-circle">
						{#if skill.locked}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
								<rect x="7" y="11" width="10" height="9" rx="1" stroke="currentColor" stroke-width="2"/>
								<path d="M9 11V7a3 3 0 0 1 6 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
							</svg>
						{:else if skill.id === 'center'}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="12" r="3" fill="currentColor"/>
							</svg>
						{:else}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
							</svg>
						{/if}
					</div>
					<div class="node-label">{skill.title}</div>
				</button>
			{/each}
		</div>
	</div>

	{#if selectedSkill}
		<div class="skill-detail-panel">
			<div class="panel-content">
				<h2 class="skill-title" style="color: {selectedSkill.color}">{selectedSkill.title}</h2>
				<p class="skill-description">{selectedSkill.description}</p>
				
				{#if selectedSkill.id === 'center'}
					<p class="hint-text">Select a path to begin your learning journey</p>
				{:else}
					<button 
						class="start-lesson-button"
						style="background: linear-gradient(135deg, {selectedSkill.color}, {selectedSkill.color}dd)"
						onclick={() => startLesson(selectedSkill.id)}
					>
						Start Learning
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
							<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
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
		z-index: 20;
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

	.skill-tree-container {
		flex: 1;
		position: relative;
		min-height: 400px;
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
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 5;
	}

	.skill-node {
		position: absolute;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.skill-node:hover:not(.locked) {
		transform: translate(-50%, -50%) scale(1.1);
	}

	.skill-node.selected .node-circle {
		box-shadow: 0 0 30px var(--node-color), 0 0 60px var(--node-color);
		transform: scale(1.2);
	}

	.node-circle {
		width: 80px;
		height: 80px;
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
		animation: pulse-ring 2s ease-out infinite;
	}

	.skill-node:not(.locked):hover .node-circle::before {
		animation: pulse-ring 1s ease-out infinite;
	}

	.skill-node.locked .node-circle {
		border-color: var(--border-color);
		color: var(--border-color);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}

	.node-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
		max-width: 120px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.skill-node.locked .node-label {
		color: var(--text-secondary);
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
