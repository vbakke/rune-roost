<script lang="ts">
	import { onMount } from 'svelte';
	import QuillIcon from '$lib/components/icons/QuillIcon.svelte';
	import ScrollIcon from '$lib/components/icons/ScrollIcon.svelte';
	import RavenIcon from '$lib/components/icons/RavenIcon.svelte';

	// Shared random number between 10-99
	let sharedNumber = $state(Math.floor(Math.random() * 90) + 10);

	// Keys for symmetric and asymmetric encryption
	const symmetricKey = 42;
	const asymmetricKey = 17;

	// Computed encrypted values
	let symmetricEncrypted = $derived(sharedNumber + symmetricKey);
	let asymmetricEncrypted = $derived(sharedNumber * asymmetricKey);

	// Hashing: split digits and calculate cross sum
	let digits = $derived(String(sharedNumber).split(''));
	let crossSum = $derived(digits.reduce((sum, digit) => sum + parseInt(digit), 0));
</script>

<div class="container">
	<div class="nav-header">
		<a href="/wīsdōm" class="skill-tree-link">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="3"></circle>
				<path d="M12 1v6m0 6v6m6.66-13.66l-4.24 4.24m0 6.84l4.24 4.24M1 12h6m6 0h6M5.34 5.34l4.24 4.24m0 6.84l-4.24 4.24"></path>
			</svg>
			Knowledge Tree
		</a>
	</div>
	<h1>Læran - Encryption Concepts</h1>

	<!-- Symmetric Pane -->
	<div id="symmetric" class="pane">
		<div class="pane-header">
			<h2>Symmetric</h2>
			<a href="/lær/symmetric" class="lesson-button">
				<RavenIcon />
				<span>Learn</span>
			</a>
		</div>
		<div class="encryption-flow">
			<div class="desk scribe">
				<input
					type="number"
					bind:value={sharedNumber}
					min="10"
					max="99"
					class="desk-input"
				/>
				<div class="desk-icon">
                    <QuillIcon />
				</div>
			</div>

			<div class="key">
				<div class="key-icon">🔑</div>
				<div class="key-value">{symmetricKey}</div>
			</div>

			<div class="arrow">→</div>

			<div class="desk scroll">
				<div class="desk-icon"><ScrollIcon /></div>
				<div class="desk-output">{symmetricEncrypted}</div>
			</div>
		</div>
	</div>

	<!-- Asymmetric Pane -->
	<div id="asymmetric" class="pane">
		<div class="pane-header">
			<h2>Asymmetric</h2>
			<a href="/lær/asymmetric" class="lesson-button">
				<RavenIcon />
				<span>Learn</span>
			</a>
		</div>
		<div class="encryption-flow">
			<div class="desk scribe">
				<input
					type="number"
					bind:value={sharedNumber}
					min="10"
					max="99"
					class="desk-input"
				/>
				<div class="desk-icon">
					<QuillIcon />
				</div>
			</div>

			<div class="key">
				<div class="key-icon">🔑</div>
				<div class="key-value">{asymmetricKey}</div>
			</div>

			<div class="arrow">→</div>

			<div class="desk scroll">
				<div class="desk-icon"><ScrollIcon /></div>
				<div class="desk-output">{asymmetricEncrypted}</div>
			</div>
		</div>
	</div>

	<!-- Hashing Pane -->
	<div id="hashing" class="pane">
		<div class="pane-header">
			<h2>Hashing</h2>
			<a href="/lær/hashing" class="lesson-button">
				<RavenIcon />
				<span>Learn</span>
			</a>
		</div>
		<div class="encryption-flow">
			<div class="desk scribe">
				<input
					type="number"
					bind:value={sharedNumber}
					min="10"
					max="99"
					class="desk-input"
				/>
				<div class="desk-icon">
					<QuillIcon />
				</div>
			</div>

			<div class="desk hash-function">
				{#each digits as digit, i}
					<span class="digit">{digit}</span>
					{#if i < digits.length - 1}
						<span class="plus">+</span>
					{/if}
				{/each}
			</div>

			<div class="arrow">→</div>

			<div class="desk scroll">
				<div class="desk-icon"><ScrollIcon /></div>
				<div class="desk-output">{crossSum}</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	.nav-header {
		margin-bottom: 1rem;
	}

	.skill-tree-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		transition: background-color 0.2s;
	}

	.skill-tree-link:hover {
		background-color: rgba(102, 126, 234, 0.1);
	}

	h1 {
		text-align: center;
		margin-bottom: 1rem;
		font-size: 2rem;
	}

	.pane {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		margin-bottom: 0.75rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		scroll-margin-top: 2rem;
	}

	h2 {
		color: white;
		margin-top: 0;
		margin-bottom: 0.75rem;
		font-size: 1.3rem;
		display: inline-block;
		margin-right: 1rem;
		width: 120px;
		text-align: left;
	}

	.pane-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.lesson-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.2);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		text-decoration: none;
		color: white;
		font-weight: 600;
		transition: all 0.2s;
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	.lesson-button:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.encryption-flow {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.desk {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
		background: rgba(255, 255, 255, 0.9);
		padding: 0.75rem 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.desk-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
	}

	.desk-input,
	.desk-output {
		font-size: 2rem;
		font-weight: bold;
		text-align: center;
		min-width: 80px;
		border: none;
		background: transparent;
		color: #333;
	}

	.desk-input {
		border-bottom: 2px solid #667eea;
		padding: 0.25rem;
	}

	.desk-input:focus {
		outline: none;
		border-bottom-color: #764ba2;
	}

	.desk.scroll {
		background-color: #8574e3;
	}

	.key {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.key-icon {
		font-size: 2rem;
	}

	.key-value {
		font-size: 1.4rem;
		font-weight: bold;
		color: #ecdfff;
		background: rgba(0, 0, 0, 0.2);
		padding: 0.25rem 0.75rem;
		border-radius: 8px;
	}

	.arrow {
		font-size: 2.5rem;
		color: white;
		font-weight: bold;
	}

	.desk.hash-function {
		background-color: #5654a4;
	}

	.digit {
		font-size: 1.75rem;
		font-weight: bold;
		color: #ecdfff;
	}

	.plus {
		font-size: 1.25rem;
		color: #ecdfff;
		font-weight: bold;
	}

	@media (max-width: 768px) {
		h2 {
			display: block;
			font-size: 1.5rem;
			margin-bottom: 1rem;
		}

		.encryption-flow {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.desk {
			flex-direction: column;
			padding: 1rem;
		}

		.desk-icon {
			font-size: 2.5rem;
		}

		.desk-input,
		.desk-output {
			font-size: 2rem;
			min-width: 100px;
		}

		.arrow {
			transform: rotate(90deg);
		}

		h1 {
			font-size: 2rem;
		}
	}
</style>
