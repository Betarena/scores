/**
 * @description
 *  📝 Purge Cloudflare Worker cache for a list of URLs.
 *  Posts to the Worker's /__purge endpoint which handles cache key reconstruction.
 *  Requires CF_PURGE_SECRET env var (must match Worker's PURGE_SECRET).
 *  Logs errors but never throws.
 * @param baseUrl
 *  Normalized base URL (e.g. `https://betarena.com`).
 * @param urls
 *  Array of absolute URLs to purge.
 */
export async function purgeUrls(baseUrl: string, urls: string[]): Promise<void>
{
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(baseUrl))
    return;

  const purgeSecret = process.env.CF_PURGE_SECRET;

  if (!purgeSecret)
  {
    console.warn('[cf-purge] missing CF_PURGE_SECRET, skipping purge');
    return;
  }

  const uniqueUrls = [...new Set(urls.filter(Boolean))];
  if (uniqueUrls.length === 0) return;

  try
  {
    const res = await fetch(
      `${baseUrl}/__purge`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${purgeSecret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: uniqueUrls })
      }
    );

    if (!res.ok)
    {
      const body = await res.text();
      console.error(`[cf-purge] Worker purge error: status=${res.status} body=${body}`);
    }
  }
  catch (e)
  {
    console.error('[cf-purge] Worker purge request failed', e);
  }
}
