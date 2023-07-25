<!--
◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️
This is an example .svelte component file, to give                  ◾️
guidance on the structure that is employed across the project       ◾️
and how it should be layed-out.                                     ◾️
<COPY-THIS-FILE-INTO-YOUR-NEXT-COMPONENT>                           ◾️
◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️
<❗️ REMOVE (THIS) COMMENT IN PRODUCTION>                            ◾️
◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️◾️
-->

<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### NOTE:
  // ### Please add inside 'this' region the 'imports' that are required
  // ### by 'this' .svelte file is ran.
  // ### IMPORTANT
  // ### Please, structure the imports as follows:
  // ### 1. svelte/sveltekit imports
  // ### 2. project-internal files and logic
  // ### 3. component import(s)
  // ### 4. assets import(s)
  // ### 5. type(s) imports(s)

	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	import SeoBox from '$lib/components/SEO-Box.svelte';

	import profile_avatar from './assets/profile-avatar.svg';

	import type { B_H_AT } from '@betarena/scores-lib/types/_HASURA_.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### NOTE:
  // ### Please add inside 'this' region the 'variables' that are 'to be'
  // ### and 'expected' to be used by 'this' .svelte file is ran.

  export const
    EXAMPLE_IMPORT_CONST_1: B_H_AT = null,
    EXAMPLE_IMPORT_CONST_2: any = undefined
  ;

  const
    EXAMPLE_CONST_VALUE: any = undefined,
    exampleConstValue: any = null
  ;

  let
    exampleLetValue: any
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  function do_something
  (
    // args
  )
  {
    // logic
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🚏 ONE-OFF CONDITIONS

  // ### NOTE:
  // ### Please add inside 'this' region the 'logic' that should run
  // ### immediately, as soon as 'this' .svelte file is ran.

  if (true)
  {
    // do something
  }

  // #endregion ➤ 🚏 ONE-OFF CONDITIONS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### NOTE:
  // ### Please add inside 'this' region the 'logic' that should run
  // ### immediately and reactively, as soon as 'this' .svelte file is ran.

  if (browser)
  {
    // do something
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### NOTE:
  // ### Please add inside 'this' region the 'logic' that should run
  // ### immediately and as part of the 'lifecycle' of svelteJs,
  // ### as soon as 'this' .svelte file is ran.

  onMount
  (
    () =>
    {
      // do something
    }
  )

  onDestroy
  (
    () =>
    {
      // do something
    }
  )

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<SeoBox>
  <!--
  SEO CONTENT GOES HERE
  -->
</SeoBox>

<!--
IMAGE AVATAR
-->
<img
  src={profile_avatar}
  alt='profile_avatar_icon'
  title='Profile Avatar Icon'
/>

<div
  id="example⮕widget⮕main"
  class=
  "
  m-b-12
  "
>
  <p
    id="text"
  >
    Hello!
  </p>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#example⮕widget⮕main
  {
    color: var(--dark-theme);
  }
  div#example⮕widget⮕main > p#text
  {
    color: var(--dark-theme);
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

  @media only screen
  and (min-width: 726px)
  and (max-width: 1000px)
  {
  }

  /*
  =============
  🌒 DARK-THEME
  =============
  */

</style>
