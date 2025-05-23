import { getSportstackByPermalink } from '$lib/sveltekit/endpoint/sportstack.js';
import { entryProfileTabAuthorSportstackUpsert, entryProfileTabAuthorValidateSportstackUsername } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';
import type { AuthorsAuthorsMain } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import { Actions, fail } from '@sveltejs/kit';

export const actions: Actions = {

  update: async ({ request, locals }) =>
  {
    const
      // ╭─────
      // │ NOTE:
      // │ |: Destruct `object`.
      // ╰─────
      {
        user:
        {
          uid
        }
      } = locals
    ;

    if (!uid)
      return fail(401, { error: true, message: 'Unauthorized', reason: 'No uid' });
    ;

    try
    {

      const formData = await request.formData();
      const dataObject = Object.fromEntries(formData.entries());
      const { id, username, about, permalink, avatar } = dataObject as { id: number } & AuthorsAuthorsMain["data"];
      const isSportstackExist = await getSportstackByPermalink(permalink);
      if (!isSportstackExist)
      {
        return fail(400, { error: true, message: "Sportstack dosen't exists" });
      }
      const { sportstacks } = isSportstackExist;
      await entryProfileTabAuthorSportstackUpsert({
        id,
        uid,
        data: {
          badges: [],
          location: "",
          ...sportstacks.data,
          creation_date: new Date(sportstacks.data.creation_date),
          about,
          avatar,
          username,
        }
      });
      return { success: true, message: 'Sportstack created' };
    } catch (e)
    {
      console.log("error: ", e);
      return fail(500, { error: true, message: 'Internal server error' });
    }
  },

  create: async ({ request, locals }) =>
  {
    const
      // ╭─────
      // │ NOTE:
      // │ |: Destruct `object`.
      // ╰─────
      {
        user:
        {
          uid
        }
      } = locals
    ;

    if (!uid)
      return fail(401, { error: true, message: 'Unauthorized', reason: 'No uid' });
    ;

    const data = await request.formData();
    const name = data.get('name') as string;
    if (!name)
    {
      return fail(400, { error: true, message: 'Name is required' });
    }
    const isMatched = await entryProfileTabAuthorValidateSportstackUsername({ username: name });
    if (isMatched)
    {
      return fail(400, { error: true, message: 'Name is already taken' });
    }
    try
    {


      await entryProfileTabAuthorSportstackUpsert({
        uid,
        data: {
          about: "",
          avatar: "",
          badges: [],
          username: name,
          creation_date: new Date(),
          location: ""
        }
      });
      return { success: true, message: 'Sportstack created' };
    } catch (e)
    {
      return fail(500, { error: true, message: 'Internal server error' });
    }
  }
};
