<script lang="ts">
	import { appState } from '$lib/stores/appState';
	import { getSkillState, getMissingDependencies } from '$lib/skills/skillTree';
	import { textbooks } from '$lib/data/textbooks';
	import TextbookModal from '$lib/components/TextbookModal.svelte';
	import BookIcon from '$lib/components/icons/BookIcon.svelte';
	import type { SkillId } from '$lib/skills/skillTree.data';

	// Track which textbooks are visible in the library
	let selectedTextbook: SkillId | null = $state(null);
	let showTextbookModal = $state(false);

	// Available textbooks to display
	const availableTextbooks: SkillId[] = ['basic.intro', 'sym.decrypt.ceasar', 'asym.decrypt.ceasar', 'hashing.overview'];

	function openTextbook(skillId: SkillId) {
		selectedTextbook = skillId;
		showTextbookModal = true;
	}

	function getStatusBadge(skillId: SkillId) {
		const state = getSkillState(skillId, $appState.learnedSkills);
		return state;
	}

	function getMissingDepsForDisplay(skillId: SkillId): string {
		const missing = getMissingDependencies(skillId, $appState.learnedSkills);
		if (missing.length === 0) return '';
		return missing.join(', ');
	}
</script>

<svelte:head>
	<title>Library of Learning</title>
</svelte:head>

<div class="library-container">
	<div class="library-header">
		<h1>📚 Library of Learning</h1>
		<p>
			Expand your knowledge by reading our carefully curated textbooks about encryption, encoding, and hashing.
		</p>
	</div>

	<div class="textbooks-grid">
		{#each availableTextbooks as skillId}
			{@const textbook = textbooks[skillId]}
			{@const status = getStatusBadge(skillId)}
			{@const missingDeps = getMissingDepsForDisplay(skillId)}
			<div class="textbook-card" class:locked={status === 'NOT_READY'}>
				<div class="card-header">
					<div class="icon-section">
						<BookIcon />
					</div>
					<div class="status-badge" class:learned={status === 'LEARNT'} class:ready={status === 'CAN_LEARN'} class:locked={status === 'NOT_READY'}>
						{#if status === 'LEARNT'}
							✓ Learned
						{:else if status === 'CAN_LEARN'}
							➡️ Ready to Learn
						{:else}
							🔒 Locked
						{/if}
					</div>
				</div>

				<h3>{textbook.label}</h3>

				{#if missingDeps}
					<p class="missing-deps">Requires: {missingDeps}</p>
				{/if}

				<button
					class="read-button"
					disabled={status === 'NOT_READY'}
					onclick={() => openTextbook(skillId)}
				>
					{status === 'LEARNT' ? 'Review' : 'Read'}
				</button>
			</div>
		{/each}
	</div>

	<div class="info-section">
		<h2>How to Use This Library</h2>
		<ul>
			<li><strong>✓ Learned:</strong> You have completed this textbook and earned the skill.</li>
			<li><strong>➡️ Ready to Learn:</strong> All prerequisites are met. Click to read and earn the skill.</li>
			<li><strong>🔒 Locked:</strong> You need to learn other textbooks first. See requirements above.</li>
		</ul>
	</div>
</div>

{#if selectedTextbook}
	<TextbookModal isOpen={showTextbookModal} skillId={selectedTextbook} onClose={() => { showTextbookModal = false; }} />
{/if}

<style>
	.library-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 2rem;
		min-height: 100vh;
	}

	.library-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.library-header h1 {
		font-size: 3rem;
		margin: 0 0 1rem 0;
		color: #1a5f3c;
	}

	.library-header p {
		font-size: 1.1rem;
		color: #555;
		max-width: 600px;
		margin: 0 auto;
	}

	.textbooks-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.textbook-card {
		background: white;
		border: 2px solid #d4a574;
		border-radius: 12px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.textbook-card:not(.locked):hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		border-color: #c08132;
	}

	.textbook-card.locked {
		opacity: 0.7;
		border-color: #ccc;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.icon-section {
		width: 60px;
		height: 60px;
		background: rgba(212, 165, 116, 0.1);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.status-badge {
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 600;
		text-align: center;
		white-space: nowrap;
	}

	.status-badge.learned {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.status-badge.ready {
		background: #fff3cd;
		color: #856404;
		border: 1px solid #ffeaa7;
	}

	.status-badge.locked {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.textbook-card h3 {
		margin: 0;
		color: #1a5f3c;
		font-size: 1.3rem;
	}

	.missing-deps {
		font-size: 0.9rem;
		color: #d9534f;
		margin: 0;
		font-style: italic;
	}

	.read-button {
		background: linear-gradient(135deg, #1a5f3c 0%, #2a6b48 100%);
		color: white;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 1rem;
		margin-top: auto;
	}

	.read-button:not(:disabled):hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(26, 95, 60, 0.3);
	}

	.read-button:disabled {
		background: #ccc;
		cursor: not-allowed;
		color: #666;
	}

	.info-section {
		background: rgba(212, 165, 116, 0.1);
		border-left: 4px solid #d4a574;
		padding: 2rem;
		border-radius: 8px;
		margin-top: 2rem;
	}

	.info-section h2 {
		margin-top: 0;
		color: #1a5f3c;
	}

	.info-section ul {
		margin: 0;
		padding-left: 2rem;
	}

	.info-section li {
		margin: 0.8rem 0;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.library-container {
			padding: 2rem 1rem;
		}

		.library-header h1 {
			font-size: 2rem;
		}

		.textbooks-grid {
			grid-template-columns: 1fr;
		}

		.card-header {
			flex-direction: column;
		}

		.status-badge {
			align-self: flex-start;
		}
	}
</style>

