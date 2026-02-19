// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Video Proxy Route (stable SEO-friendly URL)                  │
// │ :|: GET /video/{assetId}.{ext} → proxy from GCS via firebase     │
// ╰──────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

import { error } from '@sveltejs/kit';
import { entryMediaAssetGetForPlayback } from '@betarena/scores-lib/dist/functions/v8/media.main.js';

import type { RequestHandler } from './$types.js';

// #endregion ➤ 📦 Package

const
  FUNCTIONS_ORIGIN = import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN,
  ADMIN_TOKEN = import.meta.env.VITE_FIREBASE_FUNCTIONS_ADMIN_TOKEN
;

export const GET: RequestHandler = async ({ params, request }) =>
{
  const slug = params.slug;

  // ╭─────
  // │ NOTE: Parse assetId and ext from slug (e.g. "abc-123.mp4").
  // ╰─────
  const lastDot = slug.lastIndexOf('.');

  if (lastDot === -1)
    throw error(400, { message: 'Invalid slug format' } as App.Error);

  const
    assetId = slug.substring(0, lastDot),
    ext = slug.substring(lastDot + 1)
  ;

  // ╭─────
  // │ NOTE: Fetch asset metadata.
  // ╰─────
  const asset = await entryMediaAssetGetForPlayback(assetId);

  if (!asset || asset.status !== 'ready' || !asset.post_id)
    throw error(404, { message: 'Not found' } as App.Error);

  // ╭─────
  // │ NOTE: Block paid articles from public proxy.
  // ╰─────
  if (asset.article?.access_type === 'reward_gated')
    throw error(403, { message: 'Paid content' } as App.Error);

  // ╭─────
  // │ NOTE: Verify ext matches.
  // ╰─────
  const
    storagePath = asset.playback_path ?? asset.original_path,
    storageExt = storagePath?.split('.').pop()?.toLowerCase()
  ;

  if (!storagePath || (ext.toLowerCase() !== storageExt && ext.toLowerCase() !== asset.ext))
    throw error(400, { message: 'Extension mismatch' } as App.Error);

  // ╭─────
  // │ NOTE: Proxy stream from firebase-services.
  // ╰─────
  const
    streamUrl = `${FUNCTIONS_ORIGIN}/streamStorageObject?adminToken=${ADMIN_TOKEN}&path=${encodeURIComponent(storagePath)}`,
    headers: Record<string, string> = {}
  ;

  // ╭─────
  // │ NOTE: Forward Range header for seeking support.
  // ╰─────
  const rangeHeader = request.headers.get('range');

  if (rangeHeader)
    headers['Range'] = rangeHeader;

  const upstream = await fetch(streamUrl, { headers });

  // ╭─────
  // │ NOTE: Build response headers.
  // ╰─────
  const responseHeaders = new Headers();

  responseHeaders.set('Content-Type', upstream.headers.get('content-type') ?? 'video/mp4');
  responseHeaders.set('Accept-Ranges', 'bytes');
  responseHeaders.set('Cache-Control', 'public, max-age=86400');

  if (upstream.headers.get('content-length'))
    responseHeaders.set('Content-Length', upstream.headers.get('content-length')!);

  if (upstream.headers.get('content-range'))
    responseHeaders.set('Content-Range', upstream.headers.get('content-range')!);

  return new Response
  (
    upstream.body,
    {
      status: upstream.status,
      headers: responseHeaders
    }
  );
};
