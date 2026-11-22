# Old Domain Redirect — `ahmedlotfy.site` → `alotfy.site`

The old domain `ahmedlotfy.site` currently has no DNS. This must be configured at the **DNS/hosting level**, not in the Next.js codebase.

## Required Steps

1. **Confirm ownership** of `ahmedlotfy.site` at the registrar (where the domain was purchased).

2. **Point its DNS** at the current hosting provider (Vercel), or use the registrar's **HTTP forwarding / URL redirect** service.

3. **Configure a permanent 301 redirect** from **every** `ahmedlotfy.site` URL (including `www.ahmedlotfy.site`) to the matching `alotfy.site` URL, preserving the full path and query string.

   Examples:
   - `https://ahmedlotfy.site/` → `https://alotfy.site/`
   - `https://ahmedlotfy.site/en/projects` → `https://alotfy.site/en/projects`
   - `https://www.ahmedlotfy.site/ar/about` → `https://alotfy.site/ar/about`
   - `https://ahmedlotfy.site/BingSiteAuth.xml` → `https://alotfy.site/BingSiteAuth.xml`

4. **Keep the HTTPS certificate valid** on the old domain so the redirect works over HTTPS (not just HTTP). If using Vercel, add `ahmedlotfy.site` and `www.ahmedlotfy.site` as domains in the Vercel project settings and let Vercel provision the certs.

## Notes

- Do **not** implement this redirect in `next.config.ts` or middleware — it must happen before the request reaches the Next.js app, at the edge/CDN level.
- Once the 301 is live, verify with `curl -I https://ahmedlotfy.site/en/projects` (should return `301` with `location: https://alotfy.site/en/projects`).
- After the redirect is confirmed, you can request removal of old `ahmedlotfy.site` URLs from Google Search Console (Removals tool) and Bing Webmaster Tools.