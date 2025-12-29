<script lang="ts">
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';

	let currentPage = $state(0);
	let userInput = $state(0);
	let secretKey = $state(42);
	let encryptedValueAdd = $derived(userInput + secretKey);
	let encryptedValueAddRound = $derived(userInput - secretKey);
</script>

<svelte:head>
	<title>In the very beginning...</title>
</svelte:head>

<div class="lesson-container">
	<div class="lesson-header">
		<a href="/lær" class="back-link">
			← Back to Learning
		</a>
		<h1>In the very beginning...</h1>
	</div>

	<div class="content-area">
		<BookComponent bind:currentPage>

			<Page>
				<h2>... well a bit later actually</h2>
				<p>As everyone knows, <ref name="caesar">Cæsar wrote messages</ref> in code. To read the message it had to be <em>decoded</em>.</p>
				<p>The message was <em>encoded</em>, not <em>encrypted</em>.</p>
				<p>Writing <code>"ABBA"</code> as <code>1,2,2,1</code>, <code>NOON</code> or <code>QUJCQQ==</code> is <em>not</em> encryption. </p>
				<p>The last is easily spotted as <ref name="base64">base64 encoding</ref> by the trailing equal signs. And easily decoded, without a secret key.</p>
				
			</Page>

			<Page>
				<h3>Encryption</h3>
				<p>Encryption requires something secret, known only to the sender and receiver, called a <ref name="secret-key">secret key</ref>.</p>
				<p>Repeat after me</p>
					<ul>
						<li><i>base64 is not encryption</i></li>
						<li><i>base64 is not encryption</i></li>
						<li><i>base64 is not encryption</i></li>
					</ul>
				<p><todo>"decode" b64 QkFCQQ== to BABA to gain first Skill</todo></p>
			</Page>

		</BookComponent>
	</div>
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

	.interactive-demo {
		background: #f0f4f8;
		border-radius: 12px;
		padding: 2rem;
		margin: 1.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-group label {
		font-weight: 600;
		color: #555;
	}

	.input-group input {
		padding: 0.75rem;
		font-size: 1.1rem;
		border: 2px solid #667eea;
		border-radius: 8px;
		outline: none;
		transition: border-color 0.2s;
	}

	.input-group input:focus {
		border-color: #5568d3;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.formula-display {
		text-align: center;
		font-size: 2rem;
		color: #667eea;
	}

	.result {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		margin-top: 1rem;
		border-left: 4px solid #10b981;
	}

	.result p {
		margin: 0.5rem 0;
		font-size: 1.1rem;
	}

	.formula {
		color: #667eea;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.interactive-demo {
			padding: 1rem;
		}
	}
</style>
