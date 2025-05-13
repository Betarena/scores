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
│ Scores Authors Section Layout                                                    │
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

  import { page } from '$app/stores';

  import sessionStore from '$lib/store/session.js';
  import { viewportChangeV2 } from '$lib/utils/device.js';
  import { tryCatch } from '@betarena/scores-lib/dist/util/common.js';

  import SvelteSeo from 'svelte-seo';
  import ArticleWidget from './articles/Article-Widget.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Edit_05 from '$lib/components/ui/assets/edit-05.svelte';
  import userSettings from '$lib/store/user-settings.js';

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
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'content',
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ],
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  $: pageSeo = $page.data.objAuthorContentHome.seoTamplate;
  $: ({ windowWidth, globalState } = $sessionStore);
  $: isPWA = globalState.has('IsPWA');
  $: [mobile, tablet]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0]
    )
  ;
  $: ({ user } = $userSettings);
  $: isAuth = !!user;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  function createArticle(e)
  {
    if (!isAuth) {
      e.preventDefault();
      $sessionStore.currentActiveModal = "Auth_Modal";
      return;
    }
  }

  // #endregion ➤ 🛠️ METHODS

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

{#if pageSeo}
  <SvelteSeo
    title={pageSeo.main_data.title}
    description={pageSeo.main_data.description}
    keywords={pageSeo.main_data.keywords}
    noindex=
    {
      tryCatch
      (
        () =>
        {
          return JSON.parse(pageSeo.main_data.noindex);
        }
      ) ?? false
    }
    nofollow=
    {
      tryCatch
      (
        () =>
        {
          return JSON.parse(pageSeo.main_data.nofollow);
        }
      ) ?? false
    }
    canonical={`${$page.url.origin}${$page.url.pathname}`}
    twitter={pageSeo.twitter_card}
    openGraph={pageSeo.opengraph}
  />
{/if}

<section
  id={CNAME}
  class:mobile
  class:tablet
  class:pwa={isPWA}
>
  <ArticleWidget />
</section>
<a class="create-article" class:tablet on:click={createArticle} class:mobile href="/u/author/article/create/{$sessionStore.serverLang}">
  <Button size={mobile ? "xl" : "xxl"} type="primary" icon_leading={true}>
    <Edit_05 size={mobile ? "20" : "24"} color="var(--colors-base-white)" />
  </Button>
</a>


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

  :global
  {
    .mobile#header {
      --header-border: none;
    }
    section#content
    {

      position: relative;
      width: fit-content;
      max-width: 100%;
      height: 100% !important;
      min-height: 100% !important;
      background: var(--bg-color);
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin: 0;
      padding: 0;

      --text-size-2xl: 38px;
      --text-size-xl: 24px;
      --text-size-l: 20px;
      --text-size-m: 16px;
      --text-size-s: 14px;
      --text-size-xs: 12px;
      --text-button-size: var(--text-size-m);

      svg
      {
        width: unset;
      }

      .tabbar-wrapper
      {
        width: 100%;
        background-color: var(--bg-color);
        display: flex;
        align-items: start;
        gap: 16px;
        // width: 824px;
        font-size: var(--text-size-m);

        .add-icon
        {
          margin-top: 2px;
        }
      }

      .listArticlesMod
      {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .load-more
      {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 34px 0;
        background: var(--bg-color);
      }

      &.tablet
      {
        padding: 26px 34px;
        padding-top: 32px;
        padding-bottom: 0 !important;
        margin: 0 !important;
        width: 100%;

        &.pwa
        {
          padding-bottom: 128px !important;
        }

        .add-icon
        {
          margin-top: 0;
        }
      }

      &.mobile
      {
        background: var(--layout-bg-color);
        padding: 0 !important;
        padding-bottom: 128px;
        width: 100%;
        gap: 8px;
        --text-size-2xl: 24px;
        --text-size-l: 16px;
        --text-size-m: 14px;
        --text-size-s: 12px;
        --text-size-xs: 10px;

        .tabbar-wrapper {
          padding: 0px 16px;
          padding-bottom: 11px;
        }

        .listArticlesMod {
          margin-top: 0;
          gap: 8px;
        }

        .add-icon {
          margin-top: 0;
        }
      }
    }
  }

  .create-article {
    position: fixed;
    bottom: 34px;
    transform: translateX(1226px);
    &.tablet {
      right: 34px;
      transform: none;
      bottom: 40px;
    }
    &.mobile {
      right: 16px;
      transform: none;
      bottom: 100px;
    }
  }

</style>
