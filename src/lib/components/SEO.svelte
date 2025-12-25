<script lang="ts">
	interface Props {
		title?: string;
		description?: string;
		keywords?: string;
		image?: string;
		url?: string;
		type?: 'website' | 'article';
		structuredData?: object;
	}

	let {
		title = 'Rune Roost - Learn Encryption in a Gamified Way',
		description = 'Master encryption concepts through interactive learning. Explore symmetric encryption, asymmetric encryption, and hashing in a fun, gamified experience designed for programmers and beginners.',
		keywords = 'encryption, cryptography, learn encryption, symmetric encryption, asymmetric encryption, hashing, programming education, gamified learning, cybersecurity',
		image = '/og-image.svg',
		url = '',
		type = 'website',
		structuredData
	}: Props = $props();

	import { page } from '$app/stores';
	import { PUBLIC_SITE_URL } from '$env/static/public';

	const fullTitle = title.includes('Rune Roost') ? title : `${title} | Rune Roost`;
	
	// Build base URL from environment or current page
	const baseUrl = PUBLIC_SITE_URL || $page.url.origin;
	
	// Build full canonical URL
	const canonicalUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : `${baseUrl}${$page.url.pathname}`;
	
	// Build full image URL
	const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={fullImageUrl} />
	<meta property="og:site_name" content="Rune Roost" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonicalUrl} />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={fullImageUrl} />

	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="author" content="Rune Roost" />

	<!-- Structured Data -->
	{#if structuredData}
		{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}<\/script>`}
	{/if}
</svelte:head>
