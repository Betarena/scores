<script lang="ts">


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
  import SeoBox from "$lib/components/SEO-Box.svelte";
  import sessionStore from "$lib/store/session.js";
  import { viewportChangeV2 } from "$lib/utils/device";
  import MobileHeader from "./MobileHeader.svelte";
  import Header from "./Header.svelte";
  import { page } from "$app/stores";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";

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

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "header",
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true];

  $: ({ windowWidth } = $sessionStore);
  $: [mobile, tablet] = viewportChangeV2(
    windowWidth,
    VIEWPORT_MOBILE_INIT[0],
    VIEWPORT_TABLET_INIT[0]
  );
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;

  // #endregion ➤ 📌 VARIABLES
</script>

<SeoBox>
  <!--
  ╭─────
  │ > homepage links
  ╰─────
  -->
  {#each trsanslationData?.langArray || [] as item}
    {#if item != "en"}
      <a href={$page.url.origin + "/" + item}>
        {$page.url.origin + "/" + item}
      </a>
    {:else}
      <a href={$page.url.origin}>
        {$page.url.origin}
      </a>
    {/if}
  {/each}

  <!--
  ╭─────
  │ > other urls
  ╰─────
  -->
  <a
    href={trsanslationData?.scores_header_translations?.section_links
      ?.scores_url}
  >
    {trsanslationData?.scores_header_translations?.section_links?.scores_title}
  </a>
  <a
    href={trsanslationData?.scores_header_translations?.section_links
      ?.competitions_url}
  >
    {trsanslationData?.scores_header_translations?.section_links
      ?.competitions_title}
  </a>
  <a
    href={trsanslationData?.scores_header_translations?.section_links
      ?.sports_content_url}
  >
    {trsanslationData?.scores_header_translations?.section_links
      ?.sports_content_title}
  </a>
</SeoBox>

<header class:mobile>
  {#if mobile || tablet}
    <MobileHeader {mobile} {tablet} />
  {:else}
    <Header />
  {/if}
</header>

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
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-color);
    border-bottom: var(--header-border);

    &.mobile {
      border-bottom: none;
    }
  }
</style>
