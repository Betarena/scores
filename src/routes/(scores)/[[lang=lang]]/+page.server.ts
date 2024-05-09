// // ╭──────────────────────────────────────────────────────────────────────────────────╮
// // │ 📌 High Order Component Overview                                                 │
// // ┣──────────────────────────────────────────────────────────────────────────────────┫
// // │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// // │ ➤ Status :|: 🔒 LOCKED                                                           │
// // │ ➤ Author(s) :|: @migbash                                                         │
// // ┣──────────────────────────────────────────────────────────────────────────────────┫
// // │ 📝 Description                                                                   │
// // ┣──────────────────────────────────────────────────────────────────────────────────┫
// // │ Main Scores Platform Page Loader ('Client-Side')                                 │
// // ╰──────────────────────────────────────────────────────────────────────────────────╯

// // #region ➤ 📦 Package Imports

// import { ServerLoadEvent, redirect } from '@sveltejs/kit';

// import { main } from '$lib/sveltekit/load/load.lang.js';
// import { dlogv2 } from '$lib/utils/debug.js';
// import { getUserById, userDataFetch } from '$lib/firebase/common.js';

// // #endregion ➤ 📦 Package Imports

// // #region ➤ 🔄 LIFECYCLE [SVELTE]

// // /**
// //  * @type {import('./$types').PageLoad}
// //  */
// export async function load
// (
//   event: ServerLoadEvent
// ): Promise < any >
// {
//   const { langParam } = await event.parent();
//    // [🐞]
//    dlogv2
//    (
//      '🚏 checkpoint ➤ src/routes/(scores)/[[lang=lang]]/+page.server.ts',
//      [
//        `🔹 [var] ➤ langParam :|: ${langParam}`,
//      ],
//      true
//    );
//   const defaultRedirectURL = `${langParam !== "en" ? `/${langParam}` : ""}/scores`;
//   console.log("langParam1  :", langParam);
//   const event_user = await JSON.parse(event.locals.user);
//   const userId = event_user["user-uid"];
//   console.log("COOKIES UID:", userId);

//   const user = userId ?  await getUserById(userId) : null;
//   console.log("USER :", user);
//   if (user)
//   {
//     return {}
//   };
//   console.log("REDIRECTING...", defaultRedirectURL)
//   redirect(300, defaultRedirectURL)



// }

// // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
