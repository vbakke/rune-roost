<script lang="ts">
	import { page } from '$app/stores';
	import { learnedSkills } from '$lib/skills/learnedSkills';
	import { calculateSkillStats, getCategoryIcon, getCategoryColor, getCategoryLabel } from '$lib/skills/skillStats';
	import { appState, type AlphabetType, type EncodingType } from '$lib/stores/appState';
	import { alphabetLearning } from '$lib/stores/alphabetLearning';
	import type { SkillId } from '$lib/skills/skillTree.data';
	import SkillTreeIcon from './icons/SkillTreeIcon.svelte';
	import BookIcon from './icons/BookIcon.svelte';
	import RavenIcon from './icons/RavenIcon.svelte';
	import DiceIcon from './icons/DiceIcon.svelte';
    import { prefNow } from '$lib/utils/utils.ts';

	let stats = $derived(calculateSkillStats($learnedSkills));
	let isLearningPage = $derived($page.url.pathname.startsWith('/lær'));
	let flashAlphabet = $state(false);
	
	const allAlphabets: { value: AlphabetType; label: string; skillId: SkillId }[] = [
		{ value: 'ROMAN', label: 'Roman', skillId: 'encoding.roman' },
		{ value: 'LATIN', label: 'Latin', skillId: 'encoding.latin' },
		{ value: 'ASCII', label: 'ASCII', skillId: 'encoding.ascii' },
		{ value: 'UNICODE', label: 'Unicode', skillId: 'encoding.unicode' },
		{ value: 'NUMBERS', label: 'Numbers', skillId: 'encoding.decimal' }
	];
	
	// Filter alphabets to only show learned ones
	const alphabets = $derived(
		allAlphabets.filter(alphabet => $learnedSkills.has(alphabet.skillId))
	);
	
	const allEncodings: { value: EncodingType; label: string; skillId?: SkillId }[] = [
		{ value: 'PLAIN', label: 'Plain' }, // Always available
		{ value: 'BASE64', label: 'Base64', skillId: 'encoding.base64' },
		{ value: 'HEX', label: 'Hex', skillId: 'encoding.hex' },
		{ value: 'BINARY', label: 'Binary', skillId: 'encoding.bytes' }
	];
	
	// Filter encodings to only show learned ones (PLAIN is always available)
	const encodings = $derived(
		allEncodings.filter(encoding => !encoding.skillId || $learnedSkills.has(encoding.skillId))
	);

	// Watch for newly learned alphabets
	$effect(() => {
		if ($alphabetLearning.newlyLearnedAlphabet && $alphabetLearning.flashAlphabet) {
			// Flash the dropdown for 1 second (3 flashes)
			console.log(`${prefNow()}: Detected newly learned alphabet ${$alphabetLearning.newlyLearnedAlphabet}, triggering flash`);	
			flashAlphabet = true;
			
			// Stop flashing and switch to newly learned alphabet after 1 second
			const flashTimer = setTimeout(() => {
				console.log(`${prefNow()}: Flash complete, switching to ${$alphabetLearning.newlyLearnedAlphabet}`);
				flashAlphabet = false;
				alphabetLearning.clearFlash();
				
				if ($alphabetLearning.newlyLearnedAlphabet) {
					console.log(`${prefNow()}: Setting alphabet to newly learned ${$alphabetLearning.newlyLearnedAlphabet}`);
					appState.setAlphabet($alphabetLearning.newlyLearnedAlphabet);
				}
			}, 1000);
			
			// Clear the learning state 300ms after flash ends (total 1300ms)
			const clearTimer = setTimeout(() => {
				console.log(`${prefNow()}: Clearing newly learned alphabet state for ${$alphabetLearning.newlyLearnedAlphabet}`);
				alphabetLearning.clear();
			}, 1300);
			
			// Cleanup timers if effect re-runs or component unmounts
			return () => {
				clearTimeout(flashTimer);
				clearTimeout(clearTimer);
			};
		}
	});
</script>

<div class="status-bar">
	<div class="status-bar-content">
		<!-- Left section: Navigation links -->
		<div class="nav-links">
			<a href="/wīsdōm" class="nav-link" title="Tree of Knowledge">
				<SkillTreeIcon />
				<span class="nav-label">Skills</span>
			</a>
			
			<a href="/training" class="nav-link" title="Training">
				<DiceIcon />
				<span class="nav-label">Training</span>
			</a>
			
			<a href="/lær/beginning" class="nav-link book-link" title="Books of Learning" data-testid="learn-button">
				<BookIcon open={isLearningPage} />
				<span class="nav-label">Learn</span>
			</a>
		</div>

		<!-- Center section: Stats -->
		<!-- <div class="stats">
			<div class="stat-item overall">
				<span class="stat-icon">🏆</span>
				<div class="stat-content">
					<span class="stat-value">{stats.totalLearned}/{stats.totalSkills}</span>
					<span class="stat-label">{stats.overallPercentage}% Complete</span>
				</div>
			</div>
			
			<div class="category-stats">
				{#each stats.categories as category}
					<div class="category-stat" title="{getCategoryLabel(category.category)}: {category.learned}/{category.total}">
						<span class="category-icon">{getCategoryIcon(category.category)}</span>
						<div class="progress-bar">
							<div 
								class="progress-fill" 
								style="width: {category.percentage}%; background-color: {getCategoryColor(category.category)}"
							></div>
						</div>
						<span class="category-count">{category.learned}/{category.total}</span>
					</div>
				{/each}
			</div>
		</div> -->

		<!-- Right section: Alphabet and Encoding selectors -->
		<div class="controls">
			<div class="control-group">
				<label for="alphabet-select">Alphabet:</label>
				<select 
					id="alphabet-select" 
					class:flash={flashAlphabet}
					disabled={alphabets.length <= 1}
					bind:value={$appState.selectedAlphabet}
					on:change={(e) => appState.setAlphabet(e.currentTarget.value as AlphabetType)}
				>
					{#each alphabets as alphabet}
						<option value={alphabet.value}>{alphabet.label}</option>
					{/each}
				</select>
			</div>

			<div class="control-group">
				<label for="encoding-select">Encoding:</label>
				<select 
					id="encoding-select"
					disabled={encodings.length <= 1}
					bind:value={$appState.selectedEncoding}
					on:change={(e) => appState.setEncoding(e.currentTarget.value as EncodingType)}
				>
					{#each encodings as encoding}
						<option value={encoding.value}>{encoding.label}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
</div>

<style>
	.status-bar {
		position: sticky;
		top: 0;
		z-index: 1000;
		background: linear-gradient(135deg, #2e3a70 0%, #3b2453 100%);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		border-bottom: 2px solid rgba(255, 255, 255, 0.2);
	}

	.status-bar-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0.75rem 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
	}

	.nav-links {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 0.75rem;
		color: white;
		text-decoration: none;
		border-radius: 8px;
		transition: all 0.2s;
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid transparent;
	}

	.nav-link:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.nav-link :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.nav-label {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.book-link :global(svg) {
		color: #ffd700;
	}

	.stats {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		flex: 1;
		justify-content: center;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.15);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		color: white;
	}

	.stat-item.overall {
		border: 2px solid rgba(255, 215, 0, 0.4);
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.stat-icon {
		font-size: 1.25rem;
	}

	.stat-value {
		font-size: 1.1rem;
		font-weight: bold;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.7rem;
		opacity: 0.9;
		line-height: 1;
	}

	.category-stats {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.category-stat {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: rgba(0, 0, 0, 0.2);
		padding: 0.4rem 0.6rem;
		border-radius: 6px;
	}

	.category-icon {
		font-size: 1rem;
	}

	.progress-bar {
		width: 60px;
		height: 8px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		transition: width 0.3s ease;
		border-radius: 4px;
	}

	.category-count {
		font-size: 0.75rem;
		font-weight: 600;
		min-width: 2.5rem;
		text-align: center;
	}

	.controls {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: white;
		font-size: 0.85rem;
	}

	.control-group label {
		font-weight: 600;
		white-space: nowrap;
	}

	.control-group select {
		padding: 0.4rem 0.6rem;
		border-radius: 6px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.9);
		color: #333;
		font-weight: 600;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.control-group select:hover {
		background: white;
		border-color: rgba(255, 255, 255, 0.5);
	}

	.control-group select:focus {
		outline: none;
		border-color: #ffd700;
		box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
	}

	.control-group select:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: rgba(200, 200, 200, 0.5);
	}

	.control-group select.flash {
		animation: flash-select 1s ease-in-out;
	}

	@keyframes flash-select {
		0%, 100% {
			background: rgba(255, 255, 255, 0.9);
			border-color: rgba(255, 255, 255, 0.3);
		}
		16.666%, 50%, 83.333% {
			background: rgba(255, 237, 78, 1);
			border-color: #ffd700;
			box-shadow: 0 0 0 5px rgba(255, 215, 0, 0.6);
		}
		33.333%, 66.666% {
			background: rgba(255, 255, 255, 0.9);
			border-color: rgba(255, 255, 255, 0.3);
		}
	}

	@media (max-width: 968px) {
		.status-bar-content {
			flex-wrap: wrap;
			justify-content: center;
		}

		.nav-links {
			order: 1;
			flex: 1;
			justify-content: center;
		}

		.stats {
			order: 3;
			flex: 1 100%;
			justify-content: center;
		}

		.controls {
			order: 2;
			flex: 1;
			justify-content: center;
			flex-wrap: wrap;
		}
	}

	@media (max-width: 768px) {
		.category-stats {
			display: none;
		}
	}

	@media (max-width: 640px) {
		.nav-label {
			display: none;
		}

		.nav-link {
			padding: 0.5rem;
		}

		.control-group label {
			display: none;
		}

		.controls {
			gap: 0.5rem;
		}

		.stat-label {
			font-size: 0.65rem;
		}
	}
</style>
