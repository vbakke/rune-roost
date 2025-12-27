export const prerender = true;

export async function GET({ url }) {
	const website = url.origin;
	
	// Page definitions for the sitemap
	const pages = [
		{ url: '', changefreq: 'weekly', priority: '1.0' },
		{ url: 'wīsdōm', changefreq: 'weekly', priority: '0.9' },
		{ url: 'lær', changefreq: 'weekly', priority: '0.9' },
		{ url: 'lær/symmetric', changefreq: 'weekly', priority: '0.8' },
		{ url: 'lær/asymmetric', changefreq: 'weekly', priority: '0.8' },
		{ url: 'lær/hashing', changefreq: 'weekly', priority: '0.8' }
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
