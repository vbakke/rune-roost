<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		currentPage?: number;
	}

	let { children, currentPage = $bindable(0) }: Props = $props();

	let isDragging = $state(false);
	let startX = $state(0);
	let currentX = $state(0);
	let dragThreshold = 50;
	
	// Track visible pages using a container element
	let containerDiv: HTMLDivElement;
	let pageCount = $state(0);
	
	// Update page visibility classes
	$effect(() => {
		if (containerDiv) {
			const pages = containerDiv.querySelectorAll('[data-page-marker]');
			pageCount = pages.length;
			
			// Remove all active classes
			pages.forEach((page, index) => {
				page.classList.remove('active-left', 'active-right');
				
				// Add classes for visible pages
				if (index === currentPage) {
					page.classList.add('active-left');
				} else if (index === currentPage + 1) {
					page.classList.add('active-right');
				}
			});
		}
	});

	function nextPage() {
		if (currentPage < pageCount - 1) {
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
				nextPage();
			} else {
				prevPage();
			}
		}
		
		isDragging = false;
	}

	function handleMouseDown(e: MouseEvent) {
		// Ignore if clicking on a button or interactive element
		if ((e.target as HTMLElement).closest('button, input, select, textarea, a')) {
			return;
		}
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
	}
</script>

<div class="book-container">
	<!-- Progress indicator -->
	<div class="page-progress">
		Page {currentPage + 1} of {pageCount}
	</div>

	<!-- Book pages -->
	<div 
		class="book" 
		role="region" 
		aria-label="Book pages"
		on:touchstart={handleTouchStart}
		on:touchmove={handleTouchMove}
		on:touchend={handleTouchEnd}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:mouseleave={handleMouseUp}
	>
		<!-- Pages container - all pages rendered, visibility controlled by CSS -->
		<div bind:this={containerDiv} class="pages-container">
			{@render children()}
		</div>
	</div>

	<!-- Dog-ear navigation overlays -->
	{#if currentPage > 0}
		<button 
			class="dog-ear left" 
			on:click={prevPage}
			aria-label="Previous page"
		>
			<svg viewBox="0 0 30 30" fill="currentColor">
				<path d="M 0,0 L 0,30 L 30,30 Z" />
			</svg>
		</button>
	{/if}
	
	{#if currentPage < pageCount - 1}
		<button 
			class="dog-ear right" 
			on:click={nextPage}
			aria-label="Next page"
		>
			<svg viewBox="0 0 30 30" fill="currentColor">
				<path d="M 30,0 L 0,30 L 30,30 Z" />
			</svg>
		</button>
	{/if}

	<!-- Navigation buttons (mobile-friendly) -->
	<div class="nav-buttons">
		<button 
			on:click={prevPage} 
			disabled={currentPage === 0}
			aria-label="Previous page"
		>
			← Previous
		</button>
		<button 
			on:click={nextPage} 
			disabled={currentPage >= pageCount - 1}
			aria-label="Next page"
		>
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
		max-width: 815px;
		margin: 0 auto;
		position: relative;
	}

	.page-progress {
		text-align: center;
		margin-bottom: 0;
		font-size: 0.9rem;
		font-weight: 500;
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

	.pages-container {
		display: grid;
		grid-template-columns: 400px 400px;
		gap: 5px;
		min-height: 500px;
	}

	/* Hide all pages by default */
	.pages-container :global([data-page-marker]) {
		display: none;
		background: linear-gradient(to bottom, #fefcf5, #f5f3e8);
		padding: 2rem;
		min-height: 500px;
		box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
		overflow-y: auto;
	}

	/* Show current page on left side */
	.pages-container :global([data-page-marker].active-left) {
		display: block;
		grid-column: 1;
		border-right: 1px solid rgba(139, 69, 19, 0.2);
	}

	/* Show next page on right side */
	.pages-container :global([data-page-marker].active-right) {
		display: block;
		grid-column: 2;
		border-left: 1px solid rgba(139, 69, 19, 0.2);
	}

	/* Styling for page content */
	.pages-container :global([data-page-marker]) {
		font-family: 'Georgia', serif;
		color: #333;
		line-height: 1.8;
	}

	.pages-container :global([data-page-marker] h1) {
		font-size: 1.8rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.pages-container :global([data-page-marker] h2) {
		font-size: 1.5rem;
		margin-bottom: 0.8rem;
		color: #333;
	}

	.pages-container :global([data-page-marker] h3) {
		font-size: 1.2rem;
		margin-bottom: 0.6rem;
		color: #333;
	}

	.pages-container :global([data-page-marker] p) {
		margin-bottom: 1rem;
		line-height: 1.4;
		color: #333;
	}

	.pages-container :global([data-page-marker] p.tight-lines) {
		line-height: 1;
	}


	.pages-container :global([data-page-marker] ul),
	.pages-container :global([data-page-marker] ol) {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.pages-container :global([data-page-marker] p:has(+ ul)) {
  		margin-bottom: 0;
	}

	.dog-ear {
		position: absolute;
		width: 50px;
		height: 50px;
		border: none;
		background: transparent;
		cursor: pointer;
		transition: all 0.2s;
		z-index: 10;
	}

	.dog-ear.left {
		bottom: 7rem;
		left: 8px;
		color: #d0c8b0;
	}
	
	.dog-ear.right {
		bottom: 7rem;
		right: 8px;
		color: #d0c8b0;
	}

	.dog-ear:hover {
		color: #b8a080;
		transform: scale(1.2);
	}

	.dog-ear:active {
		transform: scale(1);
	}

	.nav-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
		gap: 1rem;
	}

	.nav-buttons button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border: 2px solid #667eea;
		background: white;
		color: #667eea;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 600;
	}

	.nav-buttons button:hover:not(:disabled) {
		background: #667eea;
		color: white;
	}

	.nav-buttons button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.book {
			padding: 1rem;
		}

		.pages-container {
			grid-template-columns: 400px;
		}

		/* On mobile, only show current page */
		.pages-container :global([data-page-marker].active-right) {
			display: none;
		}

		.dog-ear.right {
			right: 1rem;
		}

		.dog-ear.left {
			left: 1rem;
		}
	}
</style>
