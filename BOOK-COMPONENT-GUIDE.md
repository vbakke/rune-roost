# Interactive Book Component Guide

This guide explains how to use the new `BookComponent` for creating interactive, paginated content with full reactivity in Svelte 5.

## Why a New Component?

The original `BookWithSnippets` component attempted to store Svelte snippets in an array and render them dynamically, but **Svelte 5 snippets have limitations**:

1. **Snippets cannot be stored in arrays** and called dynamically (e.g., `{@render pages[index]()}` fails)
2. **Each snippet must have a unique compile-time name** (duplicate `{#snippet page()}` declarations fail)
3. **Snippets are not like Angular's content projection** - they're more restrictive

## The Solution: CSS-Based Page Visibility

The `BookComponent` uses a clever CSS-based approach:

1. **All pages are rendered in the DOM** (preserving reactivity and bindings)
2. **CSS controls which pages are visible** based on `currentPage` state
3. **No innerHTML or DOM manipulation** - pure Svelte reactivity

## Usage

### Basic Example

```svelte
<script lang="ts">
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';

	let currentPage = $state(0);
</script>

<BookComponent bind:currentPage>
	<Page>
		<h3>Page 1</h3>
		<p>Static content on the first page.</p>
	</Page>

	<Page>
		<h3>Page 2</h3>
		<p>More content on the second page.</p>
	</Page>
</BookComponent>
```

### Interactive Example with Data Binding

```svelte
<script lang="ts">
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';

	let currentPage = $state(0);
	let userInput = $state(0);
	let secretKey = $state(42);
	let result = $derived(userInput + secretKey);
</script>

<BookComponent bind:currentPage>
	<Page>
		<h3>Try It Yourself!</h3>
		<p>Enter a number:</p>
		<input type="number" bind:value={userInput} min="0" />
		
		<p>Secret Key:</p>
		<input type="number" bind:value={secretKey} min="0" />
		
		{#if userInput}
			<div class="result">
				<p><strong>Result:</strong> {result}</p>
			</div>
		{/if}
	</Page>

	<Page>
		<h3>Explanation</h3>
		<p>The formula used was: {userInput} + {secretKey} = {result}</p>
	</Page>
</BookComponent>
```

## Key Features

### ✅ Full Reactivity
All Svelte features work perfectly:
- `bind:value` on inputs
- `$derived` reactive declarations
- `{#if}` conditional rendering
- Component instances
- Event handlers

### ✅ Responsive Design
- **Desktop:** Two-page spread (left and right pages visible)
- **Mobile:** Single page view

### ✅ Multiple Navigation Methods
1. **Dog-ear corners** (click top corners to turn pages)
2. **Navigation buttons** (← Previous / Next → at bottom)
3. **Touch gestures** (swipe left/right on mobile)
4. **Mouse drag** (click and drag to turn pages on desktop)

### ✅ Accessibility
- ARIA labels on all interactive elements
- Keyboard-accessible navigation buttons
- Screen-reader friendly structure

## How It Works Internally

### 1. Page Component
The `Page` component is a simple wrapper that adds a `data-page-marker` attribute:

```svelte
<div data-page-marker>
	{@render children()}
</div>
```

### 2. CSS Visibility Control
The `BookComponent` uses CSS custom properties and nth-child selectors:

```css
.pages-container {
	--current-page: 0; /* Updated via inline style */
}

/* Hide all pages by default */
.pages-container :global([data-page-marker]) {
	display: none;
}

/* Show current page on left side */
.pages-container :global([data-page-marker]:nth-child(calc(var(--current-page) + 1))) {
	display: block;
	grid-column: 1;
}

/* Show next page on right side */
.pages-container :global([data-page-marker]:nth-child(calc(var(--current-page) + 2))) {
	display: block;
	grid-column: 2;
}
```

### 3. Page Counting
The component counts pages by querying the DOM:

```typescript
$effect(() => {
	if (containerDiv) {
		const pages = containerDiv.querySelectorAll('[data-page-marker]');
		pageCount = pages.length;
	}
});
```

## Comparison with Other Approaches

### ❌ BookWithSnippets (Attempted)
```svelte
<!-- This DOES NOT WORK in Svelte 5 -->
<BookWithSnippets pages={[page1, page2, page3]} />
<!-- Runtime error: "pages[currentPage] is not a function" -->
```

**Problem:** Svelte 5 snippets cannot be stored in arrays or called dynamically.

### ❌ innerHTML Approach (BookPages/BookInteractive)
```svelte
<!-- This loses reactivity -->
{@html allPages[currentPage].innerHTML}
```

**Problem:** Using `innerHTML` breaks reactive bindings like `bind:value`.

### ✅ BookComponent (CSS-Based)
```svelte
<!-- This works perfectly! -->
<BookComponent>
	<Page>Interactive content with full reactivity!</Page>
	<Page>All bindings and state work correctly!</Page>
</BookComponent>
```

**Solution:** All pages rendered in DOM, visibility controlled by CSS = full reactivity!

## Styling Pages

You can style page content using global CSS selectors:

```svelte
<BookComponent>
	<Page>
		<div class="custom-page-content">
			<h3>Styled Page</h3>
			<p>Custom styles work great!</p>
		</div>
	</Page>
</BookComponent>

<style>
	.custom-page-content {
		padding: 2rem;
		background: linear-gradient(135deg, #667eea, #764ba2);
		color: white;
		border-radius: 8px;
	}
</style>
```

## Advanced: Accessing Current Page

The `currentPage` binding allows parent components to react to page changes:

```svelte
<script lang="ts">
	let currentPage = $state(0);
	let totalPages = 3;
	
	$effect(() => {
		console.log(`User is on page ${currentPage + 1} of ${totalPages}`);
		
		// Show quiz when user reaches last page
		if (currentPage === totalPages - 1) {
			showQuiz = true;
		}
	});
</script>

<BookComponent bind:currentPage>
	<!-- Pages here -->
</BookComponent>

{#if showQuiz}
	<QuizComponent />
{/if}
```

## Migration Guide

If you have existing code using `BookWithSnippets`:

### Before (broken)
```svelte
<script>
	import BookWithSnippets from '$lib/components/BookWithSnippets.svelte';
	
	{#snippet page1()}
		<p>Page 1</p>
	{/snippet}
	
	{#snippet page2()}
		<p>Page 2</p>
	{/snippet}
</script>

<BookWithSnippets pages={[page1, page2]} />
```

### After (working)
```svelte
<script>
	import BookComponent from '$lib/components/BookComponent.svelte';
	import Page from '$lib/components/Page.svelte';
</script>

<BookComponent>
	<Page>
		<p>Page 1</p>
	</Page>
	
	<Page>
		<p>Page 2</p>
	</Page>
</BookComponent>
```

## Performance Notes

**Q: Doesn't rendering all pages hurt performance?**

A: Not significantly, because:
1. Pages use `display: none` (not removed from DOM)
2. Modern browsers optimize hidden elements
3. Svelte's reactive system is very efficient
4. Most lessons have 2-5 pages max

**Q: What if I have 100+ pages?**

A: For very large books, consider:
- Lazy loading pages as components
- Using virtual scrolling
- Splitting into chapters
- Using the original string-based `Book` component for static content

## Best Practices

### ✅ DO
- Use `<Page>` as the direct child of `<BookComponent>`
- Keep pages focused and concise (users swipe through them quickly)
- Use `bind:currentPage` to integrate with other UI elements
- Leverage Svelte's reactivity for interactive demos

### ❌ DON'T
- Don't wrap `<Page>` in other elements (breaks CSS selectors)
- Don't put too much content on one page (use multiple pages instead)
- Don't use `@html` or `innerHTML` (breaks reactivity)
- Don't try to dynamically generate pages with `{#each}` (render them statically)

## Limitations

1. **Pages must be statically defined** - you can't use `{#each}` to generate pages
2. **Direct children must be `<Page>` components** - no other wrapper elements
3. **Page count is determined at render time** - can't add/remove pages dynamically

For dynamic page generation, use the original string-based `Book` component.

## Complete Working Example

See [src/routes/lær/sym/encrypt/+page.svelte](src/routes/lær/sym/encrypt/+page.svelte) for a full example with:
- Interactive input fields
- Reactive calculations
- Multiple pages
- Custom styling
- Integration with the lesson system

## Troubleshooting

### Pages not showing?
- Ensure you're using `<Page>` component (not `<div>`)
- Check that `<Page>` is a direct child of `<BookComponent>`
- Verify `data-page-marker` attribute exists in rendered HTML

### Bindings not working?
- **You're probably using the wrong component!** Use `BookComponent`, not `BookPages` or `BookInteractive`
- Check browser console for errors
- Ensure you're using Svelte 5.46+ (runes required)

### Styling not applying?
- Use `:global()` in your `<style>` blocks
- Target elements inside `[data-page-marker]`
- Check browser DevTools to see applied styles

## Summary

**BookComponent + Page = Angular-style component composition with full Svelte reactivity! 🎉**

Use this pattern when you need:
- Interactive content with data binding
- Multiple related pages in a book format
- Full access to Svelte's reactive features
- Professional page-turning UX

For simple static content, the original `Book` component (string-based) still works great!
