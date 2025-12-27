<script lang="ts">
	export interface Test {
		id: string;
		type: 'multiple-choice' | 'fill-blank' | 'matching';
		question: string;
		options?: string[];
		correctAnswer: string | string[];
		explanation?: string;
	}

	interface Props {
		tests: Test[];
		onComplete?: (passed: boolean, score: number) => void;
	}

	let { tests = [], onComplete }: Props = $props();

	let answers = $state<Record<string, string>>({});
	let showResults = $state(false);
	let score = $state(0);

	function checkAnswer(testId: string, answer: string) {
		answers[testId] = answer;
	}

	function submitTests() {
		let correct = 0;
		
		tests.forEach(test => {
			const userAnswer = answers[test.id];
			if (Array.isArray(test.correctAnswer)) {
				if (test.correctAnswer.includes(userAnswer)) {
					correct++;
				}
			} else {
				if (userAnswer === test.correctAnswer) {
					correct++;
				}
			}
		});

		score = Math.round((correct / tests.length) * 100);
		showResults = true;
		
		if (onComplete) {
			onComplete(score >= 70, score);
		}
	}

	function resetTests() {
		answers = {};
		showResults = false;
		score = 0;
	}

	function isCorrect(test: Test): boolean {
		const userAnswer = answers[test.id];
		if (Array.isArray(test.correctAnswer)) {
			return test.correctAnswer.includes(userAnswer);
		}
		return userAnswer === test.correctAnswer;
	}
</script>

<div class="test-area">
	<div class="test-header">
		<h2>Test Your Knowledge</h2>
		<p>Complete these tests to prove your mastery of the skill</p>
	</div>

	<div class="tests-container">
		{#each tests as test, index}
			<div class="test-item" class:correct={showResults && isCorrect(test)} class:incorrect={showResults && !isCorrect(test)}>
				<h3>Question {index + 1}</h3>
				<p class="question">{test.question}</p>

				{#if test.type === 'multiple-choice' && test.options}
					<div class="options">
						{#each test.options as option}
							<label class="option">
								<input
									type="radio"
									name={test.id}
									value={option}
									checked={answers[test.id] === option}
									on:change={() => checkAnswer(test.id, option)}
									disabled={showResults}
								/>
								<span>{option}</span>
							</label>
						{/each}
					</div>
				{:else if test.type === 'fill-blank'}
					<input
						type="text"
						class="text-input"
						bind:value={answers[test.id]}
						disabled={showResults}
						placeholder="Type your answer here..."
					/>
				{/if}

				{#if showResults}
					<div class="result">
						{#if isCorrect(test)}
							<div class="result-badge correct-badge">✓ Correct!</div>
						{:else}
							<div class="result-badge incorrect-badge">✗ Incorrect</div>
							<p class="correct-answer">Correct answer: {test.correctAnswer}</p>
						{/if}
						{#if test.explanation}
							<p class="explanation">{test.explanation}</p>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="test-actions">
		{#if !showResults}
			<button class="submit-button" on:click={submitTests} disabled={Object.keys(answers).length < tests.length}>
				Submit Answers
			</button>
		{:else}
			<div class="score-display">
				<h3>Your Score: {score}%</h3>
				{#if score >= 70}
					<p class="pass">🎉 Congratulations! You've passed!</p>
				{:else}
					<p class="fail">Keep studying and try again!</p>
				{/if}
			</div>
			<button class="retry-button" on:click={resetTests}>
				Try Again
			</button>
		{/if}
	</div>
</div>

<style>
	.test-area {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		padding: 2rem;
		margin-top: 2rem;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
	}

	.test-header {
		text-align: center;
		margin-bottom: 2rem;
		color: white;
	}

	.test-header h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.75rem;
	}

	.test-header p {
		margin: 0;
		opacity: 0.9;
	}

	.tests-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.test-item {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		transition: all 0.3s;
	}

	.test-item.correct {
		border: 3px solid #10b981;
		background: #f0fdf4;
	}

	.test-item.incorrect {
		border: 3px solid #ef4444;
		background: #fef2f2;
	}

	.test-item h3 {
		margin: 0 0 0.5rem 0;
		color: #667eea;
		font-size: 1.1rem;
	}

	.question {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		color: #333;
		font-weight: 500;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.option:hover {
		border-color: #667eea;
		background: #f9fafb;
	}

	.option input[type="radio"] {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}

	.option span {
		flex: 1;
		font-size: 1rem;
	}

	.text-input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.text-input:focus {
		outline: none;
		border-color: #667eea;
	}

	.text-input:disabled {
		background: #f9fafb;
	}

	.result {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 2px solid #e5e7eb;
	}

	.result-badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.correct-badge {
		background: #10b981;
		color: white;
	}

	.incorrect-badge {
		background: #ef4444;
		color: white;
	}

	.correct-answer {
		font-weight: 600;
		color: #ef4444;
		margin: 0.5rem 0;
	}

	.explanation {
		color: #6b7280;
		font-style: italic;
		margin: 0.5rem 0 0 0;
	}

	.test-actions {
		margin-top: 2rem;
		text-align: center;
	}

	.submit-button,
	.retry-button {
		background: white;
		color: #667eea;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.submit-button:hover:not(:disabled),
	.retry-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.submit-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.score-display {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1rem;
	}

	.score-display h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.5rem;
	}

	.pass {
		color: #10b981;
		font-weight: 600;
		font-size: 1.2rem;
		margin: 0;
	}

	.fail {
		color: #ef4444;
		font-weight: 600;
		font-size: 1.2rem;
		margin: 0;
	}

	@media (max-width: 768px) {
		.test-area {
			padding: 1rem;
		}

		.test-item {
			padding: 1rem;
		}

		.test-header h2 {
			font-size: 1.5rem;
		}

		.question {
			font-size: 1rem;
		}
	}
</style>
