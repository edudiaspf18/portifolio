export const siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    '[site] NEXT_PUBLIC_SITE_URL is not set: canonical, hreflang, og:image, sitemap, robots and JSON-LD will use http://localhost:3000.',
  );
}
