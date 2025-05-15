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
  import LoaderButton from "$lib/components/ui/loaders/LoaderButton.svelte";
  import LoaderAvatar from "$lib/components/ui/loaders/LoaderAvatar.svelte";
  import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";
  import session from "$lib/store/session.js";
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
  export let size: number | string = 40;
  export let action_button = true;
  export let includePermalink = false;
  let numSize = 40;
  $: ({ viewportType } = $session);
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    xxl: 64,
  };
  $: if (typeof size === "string") {
    numSize = sizeMap[size] || 38;
  } else {
    numSize = size;
  }
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

<div class="list-item {viewportType}">
  <div class="user-info">
    <LoaderAvatar size={numSize} />
    <div class="name-wrapp">
      <LoaderLine width={70} height={10} />
      {#if includePermalink}
        <div class="permalink">
          <LoaderLine width={35} height={10} />
        </div>
      {/if}
    </div>
  </div>
  {#if action_button}
    <LoaderButton width={75} height={32} />
  {/if}
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
  .list-item {
    display: flex;
    padding-block: 16px;
    border-bottom: var(--header-border);
    justify-content: space-between;
    gap: 20px;
    align-items: center;

    .user-info {
      display: flex;
      justify-content: start;
      flex-grow: 1;
      align-items: center;
      gap: 12px;
      color: var(--text-color);
      font-family: Roboto;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */

      &:hover {
        color: var(--primary);
      }

      .name-wrapp {
        display: flex;
        flex-direction: column;
        gap: 1px;
        .permalink {
          height: 10px;
        }
      }
    }

    &.mobile {
      padding: 16px;
      padding-block: 8px;
      border-bottom: none;
    }
  }
</style>
