// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Media Video Playback Endpoint (signed URLs)                  │
// ╰──────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

import { error, json } from '@sveltejs/kit';
import {
  entryMediaAssetGetForPlayback,
  entryMediaAssetCheckEntitlement
} from '@betarena/scores-lib/dist/functions/v8/media.main.js';

import type { RequestHandler } from './$types.js';

// #endregion ➤ 📦 Package

const
  FUNCTIONS_ORIGIN = import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN,
  ADMIN_TOKEN = import.meta.env.VITE_FIREBASE_FUNCTIONS_ADMIN_TOKEN
;

export const GET: RequestHandler = async ({ params, locals }) =>
{
  if (!locals.uid) throw error(401, { message: 'Unauthorized' } as App.Error);

  const { assetId } = params;

  // ╭─────
  // │ NOTE: Fetch asset with article relationship.
  // ╰─────
  const asset = await entryMediaAssetGetForPlayback(assetId);

  if (!asset || asset.status !== 'ready')
    throw error(404, { message: 'Asset not found or not ready' } as App.Error);

  // ╭─────
  // │ NOTE: Check entitlement for paid articles.
  // ╰─────

  const isOwner = asset.author?.uid === locals.uid;

  if (!isOwner && asset.article?.access_type === 'reward_gated' && asset.post_id)
  {
    const entitled = await entryMediaAssetCheckEntitlement(asset.post_id, locals.uid);
    if (!entitled)
      throw error(403, { message: 'Not entitled' } as App.Error);
  }

  // ╭─────
  // │ NOTE: Sign URLs via firebase-services.
  // ╰─────
  const
    pathsToSign: string[] = []
  ;

  if (asset.playback_path)
    pathsToSign.push(asset.playback_path);

  if (asset.thumb_path)
    pathsToSign.push(asset.thumb_path);

  let signedUrls: Record<string, string> = {};

  if (pathsToSign.length > 0)
  {
    const signRes = await fetch
    (
      `${FUNCTIONS_ORIGIN}/signStorageUrls?adminToken=${ADMIN_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: pathsToSign })
      }
    );

    const signRawText = await signRes.text();

    if (signRes.ok)
    {
      try
      {
        const signData = JSON.parse(signRawText);
        signedUrls = signData.success?.data?.urls ?? signData.data?.urls ?? signData.urls ?? {};
      }
      catch (e)
      {
        console.error('SIGN_RES parse error:', e);
      }
    }
  }

  return json
  (
    {
      srcUrl: asset.playback_path ? signedUrls[asset.playback_path] : null,
      posterUrl: asset.thumb_path ? signedUrls[asset.thumb_path] : null,
      mime: asset.mime,
      durationSec: asset.duration_sec,
      width: asset.width,
      height: asset.height
    }
  );
};
