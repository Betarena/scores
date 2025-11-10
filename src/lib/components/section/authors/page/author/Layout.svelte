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

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';

  import SvelteSeo from 'svelte-seo';
  import AuthorWidget from './content/Author-Widget.svelte';

  import { isUserAgentBot } from '$lib/utils/device.js';
  import { tryCatch } from '@betarena/scores-lib/dist/util/common.js';
  import { startArticleViewIncrement } from './_helpers.js';

  import type { IPageAuhtorArticleDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
  import session from '$lib/store/session.js';
  import { helperExpectedCanonicalUrl } from '$lib/utils/string.js';

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
    CNAME: string = 'section⮕g⮕authors⮕main'  ;

  $: pageSeo = $page.data.dataArticle as IPageAuhtorArticleDataFinal;
  $: ({ viewportType } = $session);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    () =>
    {
      // [🐞]
      if (!isUserAgentBot() && browser)
        setTimeout
        (
          () =>
          {
            startArticleViewIncrement();
          },
          10000
        );
      ;

      return;
    }
  );

  onDestroy
  (
    () =>
    {
      // window.removeEventListener('scroll', checkArticleViewIncrement);
      // window.removeEventListener('mousemove', checkArticleViewIncrement);

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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
		title={pageSeo.article.seo_details?.main_data.title}
		description={pageSeo.article.seo_details?.main_data.description}
		keywords={pageSeo.article.seo_details?.main_data.keywords}
		noindex={ tryCatch(() => {return JSON.parse(pageSeo.article.seo_details?.main_data.noindex)}) ?? false }
		nofollow={ tryCatch(() => {return JSON.parse(pageSeo.article.seo_details?.main_data.nofollow)}) ?? false }
		canonical={helperExpectedCanonicalUrl(pageSeo.article.seo_details?.main_data.canonical)}
		twitter={pageSeo.article.seo_details?.twitter_card}
		openGraph={pageSeo.article.seo_details?.opengraph}
	/>
{/if}

<div class="section-wrapper">
  <section class={viewportType} id={CNAME}>
    <AuthorWidget />
  </section>
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

  .section-wrapper {
    width: 100%;
    height: 100%;
    background-color: var(--colors-background-bg-primary);
  }

  section {
    /* 🎨 style */
    margin: auto;
    max-width: var(--container-max-width-desktop);
    padding: 0px var(--container-padding-desktop, 32px);
    padding-top: var(--container-padding-desktop, 32px);

    &.dark-mode,
    body:has(&.dark-mode) {
      /* 🎨 style */
      background-color: var(--dark-theme);
    }

    &.mobile {
      padding: 0px var(--container-padding-mobile, 16px);
      padding-top: var(--container-padding-mobile, 16px);
    }

  }
  :global(section.paid-no-padding) {
    padding-bottom: var(--mt) !important;
    margin-bottom: -40px;
  }

</style>
