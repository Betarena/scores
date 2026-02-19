import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';

// #region ➤ 📌 VARIABLES

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedBaseUrl: string | null = null;
let cachedAt = 0;

const CONFIG_QUERY = `query { config(limit: 1) { url } }`;

// #endregion ➤ 📌 VARIABLES

/**
 * @description
 *  📝 Normalize a URL string: trim, remove trailing slash, prepend https:// if missing.
 */
export function normalizeBaseUrl(raw: string): string
{
  let url = raw.trim();
  url = url.replace(/\/+$/, '');
  if (url && !/^https?:\/\//i.test(url))
    url = `https://${url}`;
  return url;
}

/**
 * @description
 *  📝 Fetch base URL from Hasura `public.config` table (single row).
 *  Caches in memory with 5-minute TTL.
 *  Falls back to `VITE_BASE_URL` env var if Hasura fails.
 *  Returns `null` if neither source is available (purge will be skipped).
 */
export async function getBaseUrl(): Promise<string | null>
{
  if (cachedBaseUrl && (Date.now() - cachedAt) < CACHE_TTL_MS)
    return cachedBaseUrl;

  try
  {
    const [data] = await new _GraphQL().wrapQuery<null, { config: { url: string }[] }>(
      CONFIG_QUERY,
      null
    );
    const url = data?.config?.[0]?.url;
    if (url)
    {
      cachedBaseUrl = normalizeBaseUrl(url);
      cachedAt = Date.now();
      return cachedBaseUrl;
    }
  }
  catch (e)
  {
    console.error('[cf-purge] failed to fetch base URL from Hasura', e);
  }

  // Fallback to env var
  const envUrl = process.env.VITE_BASE_URL;
  if (envUrl)
  {
    cachedBaseUrl = normalizeBaseUrl(envUrl);
    cachedAt = Date.now();
    return cachedBaseUrl;
  }

  console.error('[cf-purge] no base URL available (Hasura + env fallback failed), skipping purge');
  return null;
}
