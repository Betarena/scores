// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Media Video Complete Endpoint                                │
// ╰──────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

import { error, json } from '@sveltejs/kit';
import {
  entryMediaAssetVerifyOwner,
  entryMediaAssetComplete
} from '@betarena/scores-lib/dist/functions/v8/media.main.js';

import type { RequestHandler } from './$types.js';

// #endregion ➤ 📦 Package

export const POST: RequestHandler = async ({ request, locals }) =>
{
  if (!locals.uid) throw error(401, { message: 'Unauthorized' } as App.Error);

  const body = await request.json();
  const { assetId, durationSec } = body as { assetId: string; durationSec: number };

  if (!assetId)
    return json({ success: false, message: 'Missing assetId' });

  // ╭─────
  // │ NOTE: Verify ownership.
  // ╰─────
  const isOwner = await entryMediaAssetVerifyOwner(assetId, locals.uid);

  if (!isOwner)
    return json({ success: false, message: 'Not an owner' }, { status: 403 });

  // ╭─────
  // │ NOTE: Mark as uploaded.
  // ╰─────
  await entryMediaAssetComplete(assetId, durationSec ?? 0);

  return json({ success: true });
};
