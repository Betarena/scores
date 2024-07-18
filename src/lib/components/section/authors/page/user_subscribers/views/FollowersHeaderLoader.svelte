<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import LoaderAvatar from "$lib/components/ui/loaders/LoaderAvatar.svelte";
  import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";
  import session from "$lib/store/session.js";

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
    CNAME: string = "author-profile⮕followers⮕header-loader";

  $: ({ globalState, viewportType } = $session);
  $: isPWA = globalState.has("IsPWA");
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
      <div class="back-button">
        <LoaderAvatar size={32} />
      </div>
    {/if}
    <div class="name"><LoaderLine height={20} width={100} /></div>
  </div>
  <div class="tabbar-wrapper">
    <LoaderLine height={12} width={50} />
    <LoaderLine height={12} width={50} />
    <LoaderLine height={12} width={50} />
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
    .tabbar-wrapper {
      display: flex;
      gap: 24px;
      padding-bottom: 14px;
    }
  }
</style>
