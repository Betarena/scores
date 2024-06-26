<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Authors Article Placeholder                                               │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  import sessionStore from '$lib/store/session.js';
  import { viewportChangeV2 } from '$lib/utils/device';

  import AuthorLoaderMain from './loaders/Author-Loader-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'author⮕w⮕article-loader⮕main'
  ;

  let
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
    */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
    */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  $: ({ windowWidth } = $sessionStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    );
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id="{CNAME}"
>
  <!--
  ╭─────
  │ > article author box loader 📱 MOBILE
  ╰─────
  -->
  {#if VIEWPORT_MOBILE_INIT[1]}
    <AuthorLoaderMain
      option={'ArticleAuthorBlockVariant3'}
      clazz={'m-b-32'}
    />
  {/if}

  <!--
  ╭─────
  │ > top title loader
  ╰─────
  -->
  <div
    id="title-box"
    class=
    "
    m-b-34
    "
  >
    {#each [676, 464, 676] as item}
      <AuthorLoaderMain
        option={'ArticleTitleVariant1'}
        width={item}
      />
    {/each}
  </div>

  <!--
  ╭─────
  │ > badge loader
  ╰─────
  -->
  <div
    id="badge-box"
    class=
    "
    m-b-32
    "
  >
    {#each [68, 104, 87, 68] as item}
      <AuthorLoaderMain
        option={'ArticleBadgeVariant1'}
        width={item}
      />
    {/each}
  </div>

  <!--
  ╭─────
  │ > article author box loader 💻 TABLET + 🖥️ LAPTOP
  ╰─────
  -->
  {#if !VIEWPORT_MOBILE_INIT[1]}
    <AuthorLoaderMain
      option=
      {
        (VIEWPORT_TABLET_INIT[1] ? 'ArticleAuthorBlockVariant2' : 'ArticleAuthorBlockVariant1')
      }
      clazz=
      {
        !VIEWPORT_MOBILE_INIT[1] ? 'm-b-26' : 'm-b-32'
      }
    />
  {/if}

  <!--
  ╭─────
  │ > article preveiw loader
  ╰─────
  -->
  <AuthorLoaderMain
    option={'ArticlePreviewBlock'}
    clazz={'m-b-24'}
  />

  {#each { length: 2 } as _, i}

    {#if i > 0}
      <!--
      ╭─────
      │ > article preveiw text loader
      ╰─────
      -->
      <AuthorLoaderMain
        option={'ArticleSubTitle'}
        clazz={'m-b-16'}
      />
    {/if}

    <!--
    ╭─────
    │ > article preveiw text loader
    ╰─────
    -->
    <AuthorLoaderMain
      option={'ArticlePeviewText'}
      clazz={'m-b-40'}
    />
  {/each}

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#author⮕w⮕article-loader⮕main
  {
    div#title-box
    {
      /* 🎨 style */
      display: grid;
      gap: 16px;
    }

    div#badge-box
    {
      /* 🎨 style */
      display: grid;
      grid-auto-flow: column;
      gap: 6px;
      width: fit-content;
    }

    // IMPORTANT
    :global
    {
      svg#ArticlePreviewBlock
      {
        margin-left: -16px;
        margin-right: -16px;
        width: -webkit-fill-available;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 560px)
  {
    div#author⮕w⮕article-loader⮕main
    {
      // IMPORTANT
      :global
      {
        svg#ArticlePreviewBlock
        {
          margin-left: 0;
          margin-right: 0;
          width: -webkit-fill-available;
        }
      }
    }
  }

</style>
