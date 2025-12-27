<script lang="ts">
	interface Props {
		pages: string[];
		currentPage?: number;
	}

	let { pages = [], currentPage = $bindable(0) }: Props = $props();

	let isDragging = $state(false);
	let startX = $state(0);
	let currentX = $state(0);
	let dragThreshold = 50; // pixels to drag before page turn

	function nextPage() {
		if (currentPage < pages.length - 1) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function handleTouchStart(e: TouchEvent) {
		isDragging = true;
		startX = e.touches[0].clientX;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging) return;
		currentX = e.touches[0].clientX;
	}

	function handleTouchEnd() {
		if (!isDragging) return;
		
		const diff = startX - currentX;
		if (Math.abs(diff) > dragThreshold) {
			if (diff > 0) {
				nextPage(); // Swipe left
			} else {
				prevPage(); // Swipe right
			}
		}
		
		isDragging = false;
		startX = 0;
		currentX = 0;
	}

	function handleMouseDown(e: MouseEvent) {
		isDragging = true;
		startX = e.clientX;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		currentX = e.clientX;
	}

	function handleMouseUp() {
		if (!isDragging) return;
		
		const diff = startX - currentX;
		if (Math.abs(diff) > dragThreshold) {
			if (diff > 0) {
				nextPage();
			} else {
				prevPage();
			}
		}
		
		isDragging = false;
		startX = 0;
		currentX = 0;
	}
</script>

<div class="book-container">
	<div class="book"
		on:touchstart={handleTouchStart}
		on:touchmove={handleTouchMove}
		on:touchend={handleTouchEnd}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:mouseleave={handleMouseUp}
		role="button"
		tabindex="0"
		aria-label="Book page {currentPage + 1} of {pages.length}">
		
		<div class="page left-page">
			{#if currentPage > 0}
				<div class="page-content">
					<div class="page-number">{currentPage}</div>
					{@html pages[currentPage - 1]}
				</div>
			{:else}
				<div class="page-content cover">
					<h2>Begin Your Lesson</h2>
				</div>
			{/if}
		</div>

		<div class="book-spine"></div>

		<div class="page right-page">
			<div class="page-content">
				<div class="page-number">{currentPage + 1}</div>
				{@html pages[currentPage]}
			</div>
			
			{#if currentPage < pages.length - 1}
				<button class="dog-ear" on:click={nextPage} aria-label="Next page">
					<svg width="40" height="40" viewBox="0 0 40 40">
						<path d="M40 0 L40 40 L0 40 Z" fill="rgba(139, 69, 19, 0.3)" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<div class="navigation">
		<button on:click={prevPage} disabled={currentPage === 0} aria-label="Previous page">
			← Previous
		</button>
		<span class="page-indicator">Page {currentPage + 1} of {pages.length}</span>
		<button on:click={nextPage} disabled={currentPage >= pages.length - 1} aria-label="Next page">
			Next →
		</button>
	</div>
</div>

<style>
	.book-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.book {
		display: flex;
		background: linear-gradient(to bottom, #8b4513, #654321);
		border-radius: 8px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		position: relative;
		cursor: grab;
		user-select: none;
	}

	.book:active {
		cursor: grabbing;
	}

	.book-spine {
		width: 40px;
		background: linear-gradient(to right, #654321, #8b4513, #654321);
		box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
	}

	.page {
		width: 400px;
		min-height: 500px;
		background: linear-gradient(to bottom, #fefcf5, #f5f3e8);
		position: relative;
		padding: 2rem;
		box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
	}

	.left-page {
		border-right: 1px solid rgba(139, 69, 19, 0.2);
	}

	.right-page {
		border-left: 1px solid rgba(139, 69, 19, 0.2);
	}

	.page-content {
		height: 100%;
		overflow-y: auto;
		font-family: 'Georgia', serif;
		color: #333;
		line-height: 1.8;
	}

	.page-content.cover {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.page-content h2 {
		color: #654321;
		margin-bottom: 1rem;
	}

	.page-content :global(p) {
		margin-bottom: 1rem;
	}

	.page-content :global(h3) {
		color: #8b4513;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.page-number {
		position: absolute;
		bottom: 1rem;
		font-size: 0.875rem;
		color: #8b4513;
	}

	.left-page .page-number {
		left: 2rem;
	}

	.right-page .page-number {
		right: 2rem;
	}

	.dog-ear {
		position: absolute;
		top: 0;
		right: 0;
		width: 40px;
		height: 40px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: transform 0.2s;
		z-index: 10;
	}

	.dog-ear:hover {
		transform: scale(1.1);
	}

	.dog-ear svg {
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.navigation {
		display: flex;
		gap: 2rem;
		align-items: center;
		justify-content: center;
	}

	.navigation button {
		background: #667eea;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.navigation button:hover:not(:disabled) {
		background: #764ba2;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.navigation button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.page-indicator {
		font-weight: 600;
		color: #333;
		min-width: 120px;
		text-align: center;
	}

	@media (max-width: 900px) {
		.book {
			flex-direction: column;
		}

		.book-spine {
			width: 100%;
			height: 20px;
		}

		.page {
			width: 100%;
			max-width: 500px;
			min-height: 400px;
		}

		.left-page {
			display: none;
		}

		.right-page {
			border-left: none;
		}
	}

	@media (max-width: 600px) {
		.page {
			padding: 1rem;
			min-height: 350px;
		}

		.navigation {
			flex-direction: column;
			gap: 1rem;
		}

		.navigation button {
			width: 100%;
		}
	}
</style>
