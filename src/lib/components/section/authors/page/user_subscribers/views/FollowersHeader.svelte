<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import BackButton from "$lib/components/ui/BackButton.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import session from "$lib/store/session.js";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";

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

  export let author = { name: "Rodrigo Monteirasso" },
    selection = "subscribers",
    translations: IPageAuthorTranslationDataFinal;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "author-profile⮕followers⮕header";
  $: options = [
    { id: "subscribers", label: "subscribers" },
    { id: "followers", label: "followers" },
    { id: "following", label: "following" },
  ];
  $: select = options.find((o) => o.id === selection);

  $: ({ globalState, viewportType } = $session);
  $: isPWA = globalState.has("IsPWA");
  $: ({ name, username } = author);
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
<div class="wrapper {viewportType}" id={CNAME}>
  <div class="name-block">
    {#if !isPWA}
      <a class="back-button" href="/a/user/{author.usernamePermalink}" aria-label="back to user profiel">
        <BackButton mode="back" custom_handler={true} />
      </a>
    {/if}
    <div class="name">{name || username}</div>
  </div>
  <div class="tabbar-wrapper">
    <Tabbar
      on:select
      data={options}
      selected={select}
      style="gap: {viewportType === 'mobile'
        ? 40
        : 24}px; font-size: var(--text-size-m)"
      {translations}
    />
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
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 32px;
    border-bottom: var(--header-border);

    &.mobile {
      padding-inline: 16px;
      gap: 20px;
      .tabbar-wrapper {
        margin: auto;
      }

      .name-block .name {
        justify-content: center;
        padding-left: 0;
      }
    }

    .name-block {
      display: flex;
      justify-content: start;
      align-items: center;
      position: relative;

      .back-button {
        position: absolute;
        left: 0;
        top: 0;
        transform: translateY(-20%);
      }

      .name {
        display: flex;
        color: var(--text-color);
        justify-self: start;
        padding-left: 48px;
        align-items: center;
        flex-grow: 1;
        font-family: Roboto;
        font-size: var(--text-size-l);
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
      }
    }
  }
</style>
