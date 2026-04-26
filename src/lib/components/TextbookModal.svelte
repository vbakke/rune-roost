<script lang="ts">
	import BookPageModal from './BookPageModal.svelte';
	import BookComponent from './BookComponent.svelte';
	import Page from './Page.svelte';
	import { appState } from '$lib/stores/appState';
	import { getTextbook } from '$lib/data/textbooks';
	import type { SkillId } from '$lib/skills/skillTree.data';
    import type { SecretKey } from '$lib/model/sym/SecretKey.svelte.ts';

	interface Props {
		isOpen: boolean;
		skillId: SkillId;
		secretKey?: SecretKey;
		onClose?: () => void;
	}

	let { isOpen, skillId, secretKey, onClose }: Props = $props();

	let currentPage = $state(0);

	const textbook = $derived(getTextbook(skillId));

	function handleClose() {
		// Mark the skill as learned when modal closes
		appState.addLearnedSkill(skillId);
		currentPage = 0;
		onClose?.();
	}
</script>

<BookPageModal isOpen={isOpen} onClose={handleClose} fadeOnClose={false}>
	{#if textbook}
		<div class="textbook-container">
			<BookComponent bind:currentPage>
				{#each textbook.pages as PageComponent, index}
					<Page data-page-marker={`page-${index}`}>
						<svelte:component this={PageComponent} {secretKey} />
					</Page>
				{/each}
			</BookComponent>
			<div class="page-indicator">
				{currentPage + 1} / {textbook.pages.length}
			</div>
		</div>
	{/if}
</BookPageModal>

<style>
	.textbook-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.page-indicator {
		position: absolute;
		bottom: 16px;
		right: 24px;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.5);
		font-family: monospace;
		z-index: 10;
	}
</style>
