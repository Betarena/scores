import { getHrefLang } from '@betarena/scores-lib/dist/graphql/v8/table.public.hreflang.js';

/**
 * @description
 *  📝 Build the list of URLs to purge from Cloudflare cache after an article mutation.
 *  Fetches supported locales from Hasura `scores_hreflang` table via scores-lib.
 * @param baseUrl
 *  Normalized base URL (e.g. `https://betarena.com`).
 * @param permalink
 *  Article permalink (e.g. `sports-hub/my-article-title-123456`).
 * @returns
 *  Deduplicated array of absolute URLs.
 */
export async function buildPurgeUrls(baseUrl: string, permalink: string): Promise<string[]>
{
  const [locales] = await getHrefLang();

  const urls = [
    `${baseUrl}/a/${permalink}`,
    `${baseUrl}/a/${permalink}/__data.json`,
    `${baseUrl}/`,
    `${baseUrl}/__data.json`,
    ...locales.flatMap((locale) => [
      `${baseUrl}/${locale}`,
      `${baseUrl}/${locale}/__data.json`
    ])
  ];

  return [...new Set(urls.filter(Boolean))];
}
