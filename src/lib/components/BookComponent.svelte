<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		children: Snippet;
		currentPage?: number;
	}

	let { children, currentPage = $bindable(0) }: Props = $props();

	let isDragging = $state(false);
	let startX = $state(0);
	let currentX = $state(0);
	let dragThreshold = 50;
	let isBumping = $state(false);
	
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
				
				// Add page number as data attribute
				(page as HTMLElement).dataset.pageNumber = String(index + 1);
				
				// Add classes for visible pages
				if (index === currentPage - 1) {
					page.classList.add('active-left');
				} else if (index === currentPage) {
					page.classList.add('active-right');
				}
			});
		}
	});

	function nextPage() {
		if (currentPage < pageCount - 1) {
			currentPage++;
		} else {
			bumpPage();
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		} else {
			bumpPage();	
		}
	}

	function bumpPage() {
		// Simple visual feedback for trying to go past first/last page
		isBumping = true;
		setTimeout(() => {
			isBumping = false;
		}, 300);
	}

	function handleTouchStart(e: TouchEvent) {
		isDragging = false;
		startX = e.touches[0].clientX;
		console.log(`touchStart: startX=${startX} (currentX=${currentX})`);
	}

	function handleTouchMove(e: TouchEvent) {
		isDragging = true;
		currentX = e.touches[0].clientX;
		console.log(`touchMove: (startX=${startX}) currentX=${currentX}`);
	}

	function handleTouchEnd() {
		if (isDragging) {	
			const diff = startX - currentX;
			console.log(`touchEnd: startX=${startX} currentX=${currentX} = diff=${diff}`);
			if (Math.abs(diff) > dragThreshold) {
				if (diff > 0) {
					nextPage();
				} else {
					prevPage();
				}
			}
		}
		
		isDragging = false;
		startX = 0;
		currentX = 0;
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

	function pageFromHash(): number {
	    const hash = window.location.hash;
	    if (hash && /^#p\d+$/.test(hash)) {
	        const n = parseInt(hash.slice(2), 10);
	        return isNaN(n) ? 0 : Math.max(0, n - 1);
	    }
	    return 0;
	}

	function updateHash(page: number) {
	    window.location.hash = page > 0 ? `#p${page + 1}` : '';
	}

	// Sync page with hash on mount and hashchange
	onMount(() => {
	    currentPage = pageFromHash();

	    const onHashChange = () => {
	        const newPage = pageFromHash();
	        if (newPage !== currentPage) {
	            currentPage = newPage;
	        }
	    };
	    window.addEventListener('hashchange', onHashChange);

	    return () => {
	        window.removeEventListener('hashchange', onHashChange);
	    };
	});

	// Update hash when page changes
	$effect(() => {
	    updateHash(currentPage);
	});
</script>

<div class="book-container">

	<!-- Book pages -->
	<div 
		class="book" 
		role="button"
		tabindex="0"
		aria-label="Book pages"
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseUp}
	>
		<!-- Pages container - all pages rendered, visibility controlled by CSS -->
		<div bind:this={containerDiv} class="pages-container" class:bump={isBumping}>
			{@render children()}
		</div>

		<!-- Dog-ear navigation overlays -->
		<button 
		class="dog-ear left" 		
			onclick={prevPage}
			aria-label="Previous page"
		>
			<svg class="{(currentPage <= 0) ? 'hidden' : ''}" viewBox="0 0 30 30" fill="currentColor">
				<path d="M 0,0 L 0,30 L 30,30 Z M 4,23 l 6,-3 l 0,2 l 4,0 l 0,2 l -4,0 l 0,2 Z" />
			</svg>
		</button>
		<button 
			class="dog-ear right" 
			onclick={nextPage}
			aria-label="Next page"
		>
			<svg class="{(currentPage >= pageCount - 1) ? 'hidden' : ''}" viewBox="0 0 30 30" fill="currentColor">
				<path d="M 30,30 L 0,30 L 30,0 Z  M 26,23 l -6,-3 l 0,2 l -4,0 l 0,2 l 4,0 l 0,2 Z" />
			</svg>
		</button>
	</div>

	<!-- Navigation buttons (mobile-friendly)
	<div class="nav-buttons">
		<button 
			onclick={prevPage} 
			disabled={currentPage === 0}
			aria-label="Previous page"
		>
			← Previous
		</button>
		<!-- Progress indicator - ->
		<div class="page-progress">
			Page {currentPage + 1} of {pageCount}
		</div>
		<button 
			onclick={nextPage} 
			disabled={currentPage >= pageCount - 1}
			aria-label="Next page"
		>
			Next →
		</button>
	</div> -->
</div>

<style>
	:root {
		--book-margin: 0.5rem;
	}
	.book-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: var(--book-margin);
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
		/* background: linear-gradient(to bottom, #8b4513, #654321); */
		background: linear-gradient(to right, #4f2c02 0%, transparent 1%, transparent 99%, #4f2c02), linear-gradient(to bottom, #4f2c02, transparent 1%, transparent 99%, #4f2c02), linear-gradient(to bottom, #8b4513, #654321);
		padding: var(--book-margin);
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
		background: linear-gradient(to right, rgb(229 225 206) 0%, #00000000 3%, #00000000 93%, #00000011 96%, #00000033), linear-gradient(to bottom, #fefcf5, #f5f3e8);
	}

	/* Show next page on right side */
	.pages-container :global([data-page-marker].active-right) {
		display: block;
		grid-column: 2;
		background: linear-gradient(to left, rgb(229 225 206) 0%, #00000000 3%, #00000000 93%, #00000011 96%, #00000033), linear-gradient(to bottom, #fefcf5, #f5f3e8);
	}

	/* Styling for page content */
	.pages-container :global([data-page-marker]) {
		font-family: 'Georgia', serif;
		color: #333;
		line-height: 1.8;
		position: relative;
	}

	/* Page number at bottom of each page */
	.pages-container :global([data-page-marker]::after) {
		content: "~ " attr(data-page-number) " ~";
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		font-size: 0.6em;
		color: #8b4513;
		font-family: 'Georgia', serif;
	}

	/* Left page number on left */
	.pages-container :global([data-page-marker].active-left::after) {
		/* left: 2rem; */
	}

	/* Right page number on right */
	.pages-container :global([data-page-marker].active-right::after) {
		/* right: 2rem; */
	}

	.pages-container :global([data-page-marker] h1) {
		font-size: 1.8rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.pages-container :global([data-page-marker] h2) {
		font-size: 1.5rem;
		margin-bottom: 0.6rem;
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

	.pages-container :global([data-page-marker] button.book-button) {
		background: linear-gradient(135deg, #deb887 0%, #d2a679 50%, #c49a6c 100%);
		border: 2px solid #8b4513;
		border-radius: 4px;
		box-shadow: 
			0 2px 4px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2);
		cursor: pointer;
		padding: 0.1rem 0.1rem;
		transition: all 0.2s;
		position: relative;
	}

	.pages-container :global([data-page-marker] button.book-button:hover) {
		background: linear-gradient(135deg, #e6c9a0 0%, #dbb588 50%, #d0a67b 100%);
		transform: translateY(-1px);
		box-shadow: 
			0 3px 6px rgba(0, 0, 0, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.4),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2);
	}

	.pages-container :global([data-page-marker] button.book-button:active) {
		transform: translateY(1px);
		box-shadow: 
			0 1px 2px rgba(0, 0, 0, 0.3),
			inset 0 1px 2px rgba(0, 0, 0, 0.2);
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
		bottom: var(--book-margin);
		left: var(--book-margin);
		color: #d0c8b0;
	}
	
	.dog-ear.right {
		bottom: var(--book-margin);
		right: var(--book-margin);
		color: #d0c8b0;
	}

	.dog-ear:hover {
		color: #b8a080;
		transform: scale(1.2);
	}

	.dog-ear:active {
		transform: scale(1);
	}

	.dog-ear .hidden {
		fill: transparent;
		pointer-events: all;
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

	.pages-container.bump {
		animation: bump 0.3s ease-out;
	}

	@keyframes bump {
		0%, 100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(0.3rem);
		}
		50% {
			transform: translateX(-0.3rem);
		}
		75% {
			transform: translateX(0.1rem);
		}
		100% {
			transform: translateX(0);
		}
	}
	
	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.book-container {
			padding: 0.5rem;
		}

		.pages-container {
			grid-template-columns: 1fr;
			min-height: 400px;
		}

		/* On mobile, only show current page */
		.pages-container :global([data-page-marker].active-left) {
			display: none;
		}

		.pages-container :global([data-page-marker].active-right) {
			grid-column: 1;
		}

		.pages-container :global([data-page-marker]) {
			padding: 1.5rem;
		}

		/* .dog-ear.right {
			right: 1rem;
			bottom: 1rem;
		}

		.dog-ear.left {
			left: 1rem;
			bottom: 1rem;
		} */
	}
</style>
