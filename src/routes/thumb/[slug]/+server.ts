// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Thumbnail Proxy Route (stable SEO-friendly URL)              │
// │ :|: GET /thumb/{assetId}.jpg → proxy from GCS via firebase       │
// ╰──────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

import { error } from '@sveltejs/kit';
import { entryMediaAssetGetForProxy } from '@betarena/scores-lib/dist/functions/v8/media.main.js';

import type { RequestHandler } from './$types.js';

// #endregion ➤ 📦 Package

const
  FUNCTIONS_ORIGIN = import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN,
  ADMIN_TOKEN = import.meta.env.VITE_FIREBASE_FUNCTIONS_ADMIN_TOKEN
;

export const GET: RequestHandler = async ({ params }) =>
{
  const slug = params.slug;

  // ╭─────
  // │ NOTE: Parse assetId from slug (e.g. "abc-123.jpg").
  // ╰─────
  const lastDot = slug.lastIndexOf('.');

  if (lastDot === -1)
    throw error(400, { message: 'Invalid slug format' } as App.Error);

  const assetId = slug.substring(0, lastDot);

  // ╭─────
  // │ NOTE: Fetch asset metadata.
  // ╰─────
  const asset = await entryMediaAssetGetForProxy(assetId);

  if (!asset || asset.status !== 'ready' || !asset.post_id || !asset.thumb_path)
    throw error(404, { message: 'Not found' } as App.Error);

  // ╭─────
  // │ NOTE: Block paid articles from public proxy.
  // ╰─────
  if (asset.article?.access_type === 'reward_gated')
    throw error(403, { message: 'Paid content' } as App.Error);

  // ╭─────
  // │ NOTE: Proxy thumbnail from firebase-services.
  // ╰─────
  const streamUrl = `${FUNCTIONS_ORIGIN}/streamStorageObject?adminToken=${ADMIN_TOKEN}&path=${encodeURIComponent(asset.thumb_path)}`;

  const upstream = await fetch(streamUrl);

  if (!upstream.ok)
    throw error(upstream.status, { message: 'Upstream error' } as App.Error);

  const responseHeaders = new Headers();

  responseHeaders.set('Content-Type', 'image/jpeg');
  responseHeaders.set('Cache-Control', 'public, max-age=86400');

  if (upstream.headers.get('content-length'))
    responseHeaders.set('Content-Length', upstream.headers.get('content-length')!);

  return new Response
  (
    upstream.body,
    {
      status: 200,
      headers: responseHeaders
    }
  );
};
