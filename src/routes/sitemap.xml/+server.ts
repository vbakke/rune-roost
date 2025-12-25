import { PUBLIC_SITE_URL } from '$env/static/public';

export const prerender = true;

export async function GET({ url }) {
	const website = PUBLIC_SITE_URL || url.origin || 'http://localhost:5173';
	
	// Page definitions for the sitemap
	const pages = [
		{ url: '', changefreq: 'weekly', priority: '1.0' },
		{ url: 'skill-tree', changefreq: 'weekly', priority: '0.9' }
		// Add more pages as you create them:
		// { url: 'lessons/symmetric', changefreq: 'weekly', priority: '0.8' },
		// { url: 'lessons/asymmetric', changefreq: 'weekly', priority: '0.8' },
		// { url: 'lessons/hashing', changefreq: 'weekly', priority: '0.8' },
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `
	<url>
		<loc>${website}/${page.url}</loc>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>`
	)
	.join('')}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
