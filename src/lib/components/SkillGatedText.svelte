<script lang="ts">
	import { onDestroy } from 'svelte';
	import { appState } from '$lib/stores/appState';
	import { learnedSkills } from '$lib/skills/learnedSkills';
	import { getSkillState, getMissingDependencies, type SkillState } from '$lib/skills/skillTree';
	import type { SkillId } from '$lib/skills/skillTree.data';

	interface Props {
		skillId: SkillId;
		children?: any;
	}

	let { skillId, children }: Props = $props();

	let skillState = $derived.by(() => {
		return getSkillState(skillId, $appState.learnedSkills);
	});

	let missingDeps = $derived.by(() => {
		return getMissingDependencies(skillId, $appState.learnedSkills);
	});

	let showNotReadyMessage = $state(false);
	let notReadyTimeout: ReturnType<typeof setTimeout>;

	function handleClick() {
		if (skillState === 'CAN_LEARN') {
			appState.addLearnedSkill(skillId);
		} else if (skillState === 'NOT_READY') {
			showNotReadyMessage = true;
			clearTimeout(notReadyTimeout);
			notReadyTimeout = setTimeout(() => {
				showNotReadyMessage = false;
			}, 5000);
		}
	}

	onDestroy(() => {
		clearTimeout(notReadyTimeout);
	});
</script>

<div class="skill-gated-text" class:blurred={skillState !== 'LEARNT'} class:interactive={skillState !== 'LEARNT'} class:shiver={skillState === 'CAN_LEARN'} onclick={handleClick}>
	{@render children?.()}

	{#if skillState === 'NOT_READY' && showNotReadyMessage}
		<div class="not-ready-message">
			<div class="message-content">
				<p><strong>You are not ready yet.</strong></p>
				<p class="missing-deps">Learn first: {missingDeps.join(', ')}</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.skill-gated-text {
		display: inline-block;
		position: relative;
		width: 100%;
	}

	.skill-gated-text.blurred {
		filter: blur(5px);
		cursor: pointer;
	}

	.skill-gated-text.shiver {
		animation: shiver 0.6s ease-in-out infinite;
		cursor: pointer;
	}

	@keyframes shiver {
		0% {
			transform: translateX(0) translateY(0);
			opacity: 1;
		}
		25% {
			transform: translateX(-2px) translateY(-1px);
			opacity: 0.95;
		}
		50% {
			transform: translateX(2px) translateY(1px);
			opacity: 1;
		}
		75% {
			transform: translateX(-1px) translateY(0);
			opacity: 0.95;
		}
		100% {
			transform: translateX(0) translateY(0);
			opacity: 1;
		}
	}

	.not-ready-message {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.9);
		color: white;
		padding: 16px 24px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 100;
		animation: slideUp 0.3s ease-out;
		max-width: 90%;
		text-align: center;
	}

	.message-content {
		font-size: 14px;
		line-height: 1.5;
	}

	.message-content p {
		margin: 0;
	}

	.message-content p:first-child {
		margin-bottom: 8px;
	}

	.missing-deps {
		font-size: 12px;
		opacity: 0.85;
		font-style: italic;
	}

	@keyframes slideUp {
		from {
			transform: translateX(-50%) translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateX(-50%) translateY(0);
			opacity: 1;
		}
	}
</style>


