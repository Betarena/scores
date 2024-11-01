import { Actions, fail } from '@sveltejs/kit';
import { entryProfileTabAuthorNewSportstack, entryProfileTabAuthorValidateSportstackUsername } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';

export const actions: Actions = {

  update: async ({ request, locals }) =>
  {
    const data = await request.formData();
    const dataObject = Object.fromEntries(data.entries());

    return { success: true, message: 'Sportstack updated' };
  },

  create: async ({ request, locals }) =>
  {
    const { user } = locals;
    if (!user)
    {
      return fail(401, { error: true, message: 'Unauthorized', reason: 'No user in locals' });
    }
    const uid = JSON.parse(user)['user-uid'];
    if (!uid)
    {
      return fail(401, { error: true, message: 'Unauthorized', reason: 'No uid' });
    }
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


      await entryProfileTabAuthorNewSportstack({
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