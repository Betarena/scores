import { getSportstackByPermalink } from '$lib/sveltekit/endpoint/sportstack.js';
import { entryProfileTabAuthorSportstackUpsert, entryProfileTabAuthorValidateSportstackUsername } from '@betarena/scores-lib/dist/functions/v8/profile.main';
import type { AuthorsAuthorsMain } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import { Actions, fail } from '@sveltejs/kit';

export const actions: Actions = {

  update: async ({ request, locals }) => {
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

    try {

      const formData = await request.formData();
      const dataObject = Object.fromEntries(formData.entries());
      const {username, about, permalink, avatar } = dataObject as { id: number } & AuthorsAuthorsMain["data"];
      const isSportstackExist = await getSportstackByPermalink(permalink);
      if (!isSportstackExist) {
        return fail(400, { error: true, message: "Sportstack dosen't exists" });
      }
      const { sportstacks } = isSportstackExist;
      const updated_sportstack = {
        id: sportstacks.id,
        uid,
        data: {
          badges: [],
          location: "",
          ...sportstacks.data,
          creation_date: new Date(sportstacks.data?.creation_date || new Date()),
          about: about ?? sportstacks.data?.about ?? "",
          avatar: avatar ?? sportstacks.data?.avatar ?? "",
          username: username ?? sportstacks.data?.username ?? sportstacks.permalink ?? "",
        }
      }
      const data = await entryProfileTabAuthorSportstackUpsert(updated_sportstack);
      return { success: true, message: 'Sportstack created', data };
    } catch (e) {
      console.log("error: ", e);
      return fail(500, { error: true, message: 'Internal server error' });
    }
  },

  create: async ({ request, locals }) => {
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
    if (!name) {
      return fail(400, { error: true, message: 'Name is required' });
    }
    const isMatched = await entryProfileTabAuthorValidateSportstackUsername({ username: name });
    if (isMatched) {
      return fail(400, { error: true, message: 'Name is already taken' });
    }
    try {


      const data = await entryProfileTabAuthorSportstackUpsert({
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
      return { success: true, message: 'Sportstack created', data };
    } catch (e) {
      return fail(500, { error: true, message: 'Internal server error' });
    }
  }
};
