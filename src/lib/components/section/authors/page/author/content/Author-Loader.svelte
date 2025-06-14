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
  import sessionStore from "$lib/store/session.js";

  import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";
  import LoaderAvatarLabel from "$lib/components/ui/loaders/LoaderAvatarLabel.svelte";
  import LoaderBadge from "$lib/components/ui/loaders/LoaderBadge.svelte";
  import ListSportsTackLoader from "$lib/components/ui/composed/sportstack_list/ListSportsTackLoader.svelte";
  import LoaderImage from "$lib/components/ui/loaders/LoaderImage.svelte";

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
    CNAME: string = "author⮕w⮕author-content⮕main";
  $: ({ viewportType } = $sessionStore);
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

<div id={CNAME} data-betarena-zone-id="4" class={viewportType}>
  <div class="article-header">
    <!--
    ╭─────
    │ > article title
    ╰─────
    -->
    <div class="article-title">
      <div class="title">
        <LoaderLine width="70%" height={viewportType === "mobile" ? "25px" : "32px"} />
        <LoaderLine width="100%" height={viewportType === "mobile" ? "25px" : "32px"} />
        <LoaderLine width="80%" height={viewportType === "mobile" ? "25px" : "32px"} />
      </div>

      <div class="user-box">
        <LoaderAvatarLabel size="lg" />
      </div>

      <div class="tags-wrapper">
        {#each Array(3) as _}
          <LoaderBadge />
        {/each}
      </div>
    </div>
  </div>

  <div class="sportstack-box">
    <ListSportsTackLoader size="lg" action_button={true} />
  </div>

  <!--
  ╭─────
  │ > article text
  ╰─────
  -->
  <div id="content" data-betarena-zone-id="2,3">
    <LoaderImage width="100%" />
    <div class="content-loader">
      <div class="section">
        {#each ["30%", "90%", "95%", "80%", "100%", "85%", "90%", "70%", "10%"] as item, index}
          {#if !index}
          <div class="h">
            <LoaderLine width={item} height={"25px"} />
          </div>
          {:else}
            <LoaderLine width={item} height={"16px"} />
          {/if}
        {/each}
      </div>
      <div class="section">
        {#each ["30%", "90%", "95%", "80%", "100%", "85%", "90%", "70%", "10%"] as item, index}
          {#if !index}
          <div class="h">
            <LoaderLine width={item} height={"25px"} />
          </div>
          {:else}
            <LoaderLine width={item} height={"16px"} />
          {/if}
        {/each}
      </div>
    </div>
  </div>
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

  div#author⮕w⮕author-content⮕main {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    max-width: var(--width-xl, 768px);
    margin: auto;
    gap: var(--spacing-7xl, 64px);

    .article-header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4xl, 32px);

      .article-title {
        display: flex;
        max-width: var(--width-xl, 768px);
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-3xl, 24px);
        .title {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
      }
      .tags-wrapper {
        display: flex;
        gap: 10px;
      }
    }
    .sportstack-box {
      width: 100%;
      display: flex;
      justify-content: space-between;

      :global(.list-item) {
        padding: 0;
        border: none;
        width: 100%;
      }
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 30px;

      .h{
        margin-top: 32px;
        margin-bottom: 16px;
      }
    }

    //   /*
    // ╭──────────────────────────────────────────────────────────────────────────────╮
    // │ ⚡️ RESPONSIVNESS                                                              │
    // ╰──────────────────────────────────────────────────────────────────────────────╯
    // */

    &.tablet,
    &.mobile {
      max-width: 100%;

      .article-header {
        .article-title {
          max-width: 100%;
        }
      }
    }

    &.mobile {
      gap: var(--spacing-6xl, 48px);
    }
  }
</style>
