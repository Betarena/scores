/**
 * @description
 *  📝 Build the list of URLs to purge from Cloudflare cache after an article mutation.
 * @param baseUrl
 *  Normalized base URL (e.g. `https://betarena.com`).
 * @param permalink
 *  Article permalink (e.g. `my-article-title`).
 * @returns
 *  Deduplicated array of absolute URLs.
 */
export function buildPurgeUrls(baseUrl: string, permalink: string): string[]
{
  const LOCALE_ROOTS = ['en', 'br', 'pt', 'es', 'it', 'ro', 'se', 'fr'];

  const urls = [
    `${baseUrl}/a/${permalink}`,
    `${baseUrl}/a/${permalink}/__data.json`,
    `${baseUrl}/`,
    ...LOCALE_ROOTS.map((locale) => `${baseUrl}/${locale}`)
  ];

  return [...new Set(urls.filter(Boolean))];
}
