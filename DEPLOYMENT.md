# Cloudflare Pages Deployment Guide

## Environment Variables Setup

When deploying to Cloudflare Pages, you need to set the following environment variable:

### Required Variables

- `PUBLIC_SITE_URL` - Your production domain (e.g., `https://your-project.pages.dev` or `https://yourdomain.com`)

### How to Set Variables in Cloudflare Pages

1. Go to your Cloudflare Pages project dashboard
2. Navigate to **Settings** → **Environment variables**
3. Add the variable:
   - **Variable name**: `PUBLIC_SITE_URL`
   - **Value**: Your full domain URL (with https://)
   - **Environment**: Production (and optionally Preview)
4. Click **Save**
5. Redeploy your site for changes to take effect

### Build Settings

Use these settings for Cloudflare Pages:

- **Framework preset**: SvelteKit
- **Build command**: `npm run build` or `pnpm build`
- **Build output directory**: `.svelte-kit/cloudflare`
- **Root directory**: `/` (default)
- **Node version**: 18 or higher

### Custom Domain

After setting up a custom domain in Cloudflare Pages:

1. Update the `PUBLIC_SITE_URL` environment variable to your custom domain
2. Update `static/robots.txt` sitemap URL to your custom domain
3. Redeploy

### Development

For local development, the app will automatically use `localhost:5173` if no environment variable is set.

If you want to test with a specific URL locally:
```bash
# Create a .env file (already gitignored)
echo "PUBLIC_SITE_URL=http://localhost:5173" > .env
```

## Other Deployment Platforms

The app will work on any platform that supports SvelteKit:

- **Vercel**: Use the SvelteKit adapter and set env vars in project settings
- **Netlify**: Use `@sveltejs/adapter-netlify` and set env vars in site settings  
- **Node.js**: Use `@sveltejs/adapter-node` for traditional hosting

Just remember to set `PUBLIC_SITE_URL` in your platform's environment variables!
