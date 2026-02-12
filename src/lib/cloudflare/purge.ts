/**
 * @description
 *  📝 Purge Cloudflare cache for a list of URLs.
 *  Requires VITE_CLOUDFLARE_ZONE_ID and VITE_CLOUDFLARE_API_TOKEN env vars.
 *  Logs errors but never throws.
 */
export async function purgeUrls(urls: string[]): Promise<void>
{
  const zoneId = process.env.VITE_CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.VITE_CLOUDFLARE_API_TOKEN;

  if (!zoneId || !apiToken)
  {
    console.warn('[cf-purge] missing VITE_CLOUDFLARE_ZONE_ID or VITE_CLOUDFLARE_API_TOKEN, skipping purge');
    return;
  }

  const uniqueUrls = [...new Set(urls.filter(Boolean))];
  if (uniqueUrls.length === 0) return;

  try
  {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: uniqueUrls })
      }
    );

    if (!res.ok)
    {
      const body = await res.text();
      console.error(`[cf-purge] Cloudflare API error: status=${res.status} body=${body}`);
    }
  }
  catch (e)
  {
    console.error('[cf-purge] Cloudflare purge request failed', e);
  }
}
