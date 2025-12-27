<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import SEO from '$lib/components/SEO.svelte';

	function navigateToSkillTree() {
		goto('/wīsdōm');
	}

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Rune Roost',
		description: 'Learn encryption in a gamified way - for programmers and novices',
		applicationCategory: 'EducationalApplication',
		operatingSystem: 'Web',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		audience: {
			'@type': 'EducationalAudience',
			educationalRole: 'student'
		}
	};
</script>

<SEO
	title="Rune Roost - Learn Encryption in a Gamified Way"
	description="Master encryption concepts through interactive learning. Start your journey with symmetric encryption, asymmetric encryption, and hashing."
	keywords="learn encryption, cryptography tutorial, encryption for beginners, gamified learning, symmetric encryption, asymmetric encryption, hashing"
	{structuredData}
/>

<div class="welcome-container">
	<div class="content">
		<div class="logo-container">
			<div class="logo">
				<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
					<!-- Lock icon with encryption theme -->
					<defs>
						<linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
							<stop offset="50%" style="stop-color:#a78bfa;stop-opacity:1" />
							<stop offset="100%" style="stop-color:#f472b6;stop-opacity:1" />
						</linearGradient>
					</defs>
					<!-- Lock body -->
					<rect x="60" y="90" width="80" height="70" rx="8" fill="url(#lockGrad)" opacity="0.9"/>
					<!-- Shackle -->
					<path d="M 75 90 L 75 65 Q 75 40 100 40 Q 125 40 125 65 L 125 90" 
						  fill="none" stroke="url(#lockGrad)" stroke-width="12" stroke-linecap="round"/>
					<!-- Keyhole -->
					<circle cx="100" cy="115" r="8" fill="#0a0e27"/>
					<rect x="96" y="115" width="8" height="20" fill="#0a0e27"/>
					<!-- Binary decoration -->
					<text x="30" y="40" font-family="monospace" font-size="12" fill="#60a5fa" opacity="0.3">10110</text>
					<text x="140" y="175" font-family="monospace" font-size="12" fill="#a78bfa" opacity="0.3">01101</text>
				</svg>
			</div>
		</div>

		<h1 class="title">Learn Encryptions</h1>
		<h2 class="subtitle">Hows and Whats</h2>
		<p class="tagline">for programmers and other novices</p>

		<button class="start-button" onclick={navigateToSkillTree}>
			<span>Start Your Journey</span>
			<svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	</div>

	<div class="background-decoration">
		<div class="circle circle-1"></div>
		<div class="circle circle-2"></div>
		<div class="circle circle-3"></div>
	</div>
</div>

<style>
	.welcome-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		position: relative;
		overflow: hidden;
	}

	.content {
		z-index: 10;
		text-align: center;
		max-width: 500px;
		width: 100%;
		animation: fadeIn 1s ease-out;
	}

	.logo-container {
		margin-bottom: 2rem;
		animation: float 3s ease-in-out infinite;
	}

	.logo {
		width: 200px;
		height: 200px;
		margin: 0 auto;
		filter: drop-shadow(0 10px 30px rgba(96, 165, 250, 0.3));
	}

	.logo svg {
		width: 100%;
		height: 100%;
	}

	.title {
		font-size: clamp(2rem, 8vw, 3.5rem);
		font-weight: 700;
		background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple), var(--accent-pink));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 0.5rem;
		animation: slideUp 0.8s ease-out 0.2s both;
	}

	.subtitle {
		font-size: clamp(1.2rem, 5vw, 1.8rem);
		color: var(--text-secondary);
		font-weight: 500;
		margin-bottom: 0.5rem;
		animation: slideUp 0.8s ease-out 0.4s both;
	}

	.tagline {
		font-size: clamp(0.9rem, 3vw, 1.1rem);
		color: var(--accent-blue);
		font-style: italic;
		margin-bottom: 3rem;
		animation: slideUp 0.8s ease-out 0.6s both;
	}

	.start-button {
		background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
		color: white;
		padding: 1rem 2.5rem;
		border-radius: 50px;
		font-size: 1.1rem;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 0 10px 30px rgba(96, 165, 250, 0.4);
		animation: slideUp 0.8s ease-out 0.8s both;
	}

	.start-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 15px 40px rgba(96, 165, 250, 0.6);
	}

	.start-button:active {
		transform: translateY(0);
	}

	.arrow {
		transition: transform 0.3s ease;
	}

	.start-button:hover .arrow {
		transform: translateX(5px);
	}

	/* Background decoration */
	.background-decoration {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 1;
	}

	.circle {
		position: absolute;
		border-radius: 50%;
		opacity: 0.1;
		animation: pulse 4s ease-in-out infinite;
	}

	.circle-1 {
		width: 300px;
		height: 300px;
		background: var(--accent-blue);
		top: -150px;
		left: -150px;
	}

	.circle-2 {
		width: 400px;
		height: 400px;
		background: var(--accent-purple);
		bottom: -200px;
		right: -200px;
		animation-delay: 1s;
	}

	.circle-3 {
		width: 200px;
		height: 200px;
		background: var(--accent-pink);
		top: 50%;
		right: -100px;
		animation-delay: 2s;
	}

	/* Animations */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
			opacity: 0.1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.15;
		}
	}

	/* Responsive adjustments */
	@media (max-width: 480px) {
		.welcome-container {
			padding: 1rem;
		}

		.logo {
			width: 150px;
			height: 150px;
		}

		.start-button {
			padding: 0.875rem 2rem;
			font-size: 1rem;
		}
	}
</style>
