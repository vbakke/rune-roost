<script lang="ts">
	import Book from '$lib/components/Book.svelte';
	import TestArea from '$lib/components/TestArea.svelte';
	import type { Lesson } from '$lib/data/lessons';

	interface Props {
		data: {
			lesson: Lesson;
		};
	}

	let { data }: Props = $props();
	const lesson = data.lesson;

	let currentPage = $state(0);
	let showTests = $derived(currentPage >= lesson.pages.length - 1);
	let testsPassed = $state(false);
	let testScore = $state(0);

	function handleTestComplete(passed: boolean, score: number) {
		testsPassed = passed;
		testScore = score;
	}
</script>

<svelte:head>
	<title>{lesson.title} - Learn Encryption</title>
</svelte:head>

<div class="lesson-container">
	<div class="lesson-header">
		<a href="/lær" class="back-link">
			← Back to Learning
		</a>
		<h1>{lesson.title}</h1>
	</div>

	<div class="content-area">
		<Book pages={lesson.pages} bind:currentPage />
	</div>

	{#if showTests}
		<div class="test-section">
			<TestArea tests={lesson.tests} onComplete={handleTestComplete} />
			
			{#if testsPassed}
				<div class="completion-banner">
					<h2>🎓 Skill Mastered!</h2>
					<p>You've completed this lesson with a score of {testScore}%</p>
					<a href="/wīsdōm" class="return-link">Return to Knowledge Tree</a>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.lesson-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		min-height: 100vh;
	}

	.lesson-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		transition: background-color 0.2s;
		margin-bottom: 1rem;
	}

	.back-link:hover {
		background-color: rgba(102, 126, 234, 0.1);
	}

	h1 {
		font-size: 2.5rem;
		margin: 1rem 0;
	}

	.content-area {
		margin-bottom: 2rem;
	}

	.test-section {
		margin-top: 2rem;
	}

	.completion-banner {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		padding: 2rem;
		border-radius: 12px;
		text-align: center;
		margin-top: 2rem;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
	}

	.completion-banner h2 {
		margin: 0 0 1rem 0;
		font-size: 2rem;
	}

	.completion-banner p {
		margin: 0 0 1.5rem 0;
		font-size: 1.2rem;
	}

	.return-link {
		display: inline-block;
		background: white;
		color: #10b981;
		padding: 0.75rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s;
	}

	.return-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.completion-banner h2 {
			font-size: 1.5rem;
		}

		.completion-banner p {
			font-size: 1rem;
		}
	}
</style>
