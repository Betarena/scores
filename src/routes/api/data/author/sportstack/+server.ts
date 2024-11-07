// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Article Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

// ╭──────────────────────────────────────────────────────────────────╮
// │ NOTE:                                                            │
// │ Please add inside 'this' region the 'imports' that are required  │
// │ by 'this' .svelte file is ran.                                   │
// │ IMPORTANT                                                        │
// │ Please, structure the imports as follows:                        │
// │ 1. svelte/sveltekit, external imports                            │
// │ 2. project-internal files and logic                              │
// │ 5. type(s) imports(s)                                            │
// ╰──────────────────────────────────────────────────────────────────╯

import dotenv from 'dotenv';

import { main, updateSubscribers } from '$lib/sveltekit/endpoint/sportstack.js';
import { error, json } from '@sveltejs/kit';
import { entryProfileTabAuthorSportstackDelete } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';

// #endregion ➤ 📦 Package

// ╭─────
// │ IMPORTANT
// │ Loads environment secrets
// ╰─────
dotenv.config();

export async function GET
  (
    request
  )
{
  return await main
    (
      request
    ) as Promise<Response>;
}


export async function POST
  (
    request
  )
{

  return await updateSubscribers(request)
}

export async function DELETE
  (
    { request, locals }
  )
{
  if (!locals.uid) return json({ success: false, message: "Unauthorized" });
  const body = await request.json();
  const { id, uid } = body;
  if (!id || !uid) return json({ success: false, message: "Bad request" });
  if (locals.uid !== uid) return json({ success: false, message: "Not an owner" });
  try
  {
    await entryProfileTabAuthorSportstackDelete(id);
    return json({ success: true });

  } catch (e)
  {
    throw error(500, { message: 'Internal server error' } as App.Error);
  }

}