<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
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

  import { viewport_change } from '$lib/utils/platform-functions.js';

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
    */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'author⮕w⮕article-loader⮕main'
  ;

  let
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
    */
    // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

<svelte:window
  on:resize=
  {
    () =>
    {
      [
        VIEWPORT_TABLET_INIT[1]
        , VIEWPORT_MOBILE_INIT[1]
      ] = viewport_change
      (
        VIEWPORT_TABLET_INIT[0]
        , VIEWPORT_MOBILE_INIT[0]
      );
      return;
    }
  }
/>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id="{CNAME}"
>
  <!--
  ▓ NOTE:
  ▓ > article author box loader 📱 MOBILE
  -->
  {#if VIEWPORT_MOBILE_INIT[1]}
    <AuthorLoaderMain
      option={'ArticleAuthorBlockVariant3'}
      clazz={'m-b-32'}
    />
  {/if}

  <!--
  ▓ NOTE:
  ▓ > top title loader
  -->
  <div
    id="title-box"
    class=
    "
    m-b-34
    "
  >
    {#each [676, 464, 676, 577, 676, 577, 293] as item}
      <AuthorLoaderMain
        option={'ArticleTitleVariant1'}
        width={item}
      />
    {/each}
  </div>

  <!--
  ▓ NOTE:
  ▓ > badge loader
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
  ▓ NOTE:
  ▓ > article author box loader 💻 TABLET + 🖥️ LAPTOP
  -->
  {#if !VIEWPORT_TABLET_INIT[1]}
    <AuthorLoaderMain
      option=
      {
        VIEWPORT_TABLET_INIT[1]
          ? (VIEWPORT_MOBILE_INIT[1] ? 'ArticleAuthorBlockVariant3' : 'ArticleAuthorBlockVariant2')
          : 'ArticleAuthorBlockVariant1'
      }
      clazz=
      {
        !VIEWPORT_MOBILE_INIT[1] ? 'm-b-26' : 'm-b-32'
      }
    />
  {/if}

  <!--
  ▓ NOTE:
  ▓ > article preveiw loader
  -->
  <AuthorLoaderMain
    option={'ArticlePreviewBlock'}
    clazz={'m-b-24'}
  />

  {#each { length: 2 } as _, i}

    {#if i > 0}
      <!--
      ▓ NOTE:
      ▓ > article preveiw text loader
      -->
      <AuthorLoaderMain
        option={'ArticleSubTitle'}
        clazz={'m-b-16'}
      />
    {/if}

    <!--
    ▓ NOTE:
    ▓ > article preveiw text loader
    -->
    <AuthorLoaderMain
      option={'ArticlePeviewText'}
      clazz={'m-b-40'}
    />
  {/each}

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

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
