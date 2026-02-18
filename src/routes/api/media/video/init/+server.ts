// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Media Video Init Endpoint                                    │
// ╰──────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

import { error, json } from '@sveltejs/kit';
import { entryMediaAssetInit } from '@betarena/scores-lib/dist/functions/v8/media.main.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import {
  TableAuthorAuthorQuery0,
  type ITableAuthorAuthorQuery0Var,
  type ITableAuthorAuthorQuery0Out
} from '@betarena/scores-lib/dist/graphql/v8/table.authors.authors.js';

import type { RequestHandler } from './$types.js';

// #endregion ➤ 📦 Package

const
  ALLOWED_EXTS = new Set(['mp4', 'mov', 'webm']),
  MAX_BYTES = 6 * 1024 * 1024 * 1024 // 6GB
;

export const POST: RequestHandler = async ({ request, locals }) =>
{
  if (!locals.uid) throw error(401, { message: 'Unauthorized' } as App.Error);

  const body = await request.json();
  const { authorId, ext, mime, bytes, articleId } = body as { authorId: number; ext: string; mime: string; bytes: number; articleId: number };

  // ╭─────
  // │ NOTE: Validate inputs.
  // ╰─────
  if (!authorId || !ext || !mime || !bytes || !articleId)
    return json({ success: false, message: 'Missing required fields' });

  if (!ALLOWED_EXTS.has(ext.toLowerCase()))
    return json({ success: false, message: `Invalid extension: ${ext}` });

  if (bytes > MAX_BYTES)
    return json({ success: false, message: `File too large: ${bytes} bytes exceeds ${MAX_BYTES}` });

  // ╭─────
  // │ NOTE: Verify author ownership.
  // ╰─────
  const
    [authorData] = await new _GraphQL().wrapQuery
    <
      ITableAuthorAuthorQuery0Var,
      ITableAuthorAuthorQuery0Out
    >
    (
      TableAuthorAuthorQuery0,
      { authorIds: [authorId] }
    )
  ;
    
  const author = authorData.authors_authors?.[0];

  if (!author || author.uid !== locals.uid)
    return json({ success: false, message: 'Not an owner' });

  // ╭─────
  // │ NOTE: Create asset record.
  // ╰─────
  const
    assetId = crypto.randomUUID(),
    storagePath = `Betarena_Media/authors/authors_list/${authorId}/media/videos/${assetId}/original.${ext.toLowerCase()}`
  ;
  console.log("UPLOAD_INIT: ", { assetId, authorId, storagePath });

  await entryMediaAssetInit
  (
    {
      id: assetId,
      author_id: authorId,
      type: 'video',
      original_path: storagePath,
      mime,
      ext: ext.toLowerCase(),
      bytes,
      post_id: articleId
    }
  );
console.log("UPLOAD_INIT SUCCESS: ", )
  return json
  (
    {
      success: true,
      assetId,
      storagePath
    }
  );
};
