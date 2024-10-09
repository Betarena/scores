<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Add from "./icons/Add.svelte";
  import Arrow from "./icons/Arrow.svelte";
  import B from "./icons/B.svelte";
  import I from "./icons/I.svelte";
  import L from "./icons/L.svelte";
  import List from "./icons/List.svelte";
  import NumList from "./icons/NumList.svelte";
  import Q from "./icons/Q.svelte";
  import H from "./icons/H.svelte";

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

  export let editor;
  export let titleInFocus = false;

  const dispatch = createEventDispatcher();
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

  function toggle(cb, conf?) {
    if (titleInFocus) return;
    editor.chain().focus()[cb](conf).run();
  }

  function linkClick(e) {
    e.preventDefault();
    dispatch("showLinkPopup");
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

{#if editor}
  <div class="toolbar">
    <div class="button" class:disabled={titleInFocus}>
      <Add />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("bold")}
      on:click={() => toggle("toggleBold")}
    >
      <B />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("italic")}
      on:click={() => toggle("toggleItalic")}
    >
      <I />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("heading", { level: 1 })}
      on:click={() => toggle("toggleHeading", { level: 1 })}
    >
      <H />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("blockquote")}
      on:click={() => toggle("toggleBlockquote")}
    >
      <Q />
    </div>
    <div
      on:click|stopPropagation|preventDefault={linkClick}
      class="button link-button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("link")}
    >
      <L />
    </div>
    <div
      class="button"
      class:active={editor.isActive("bulletList")}
      class:disabled={titleInFocus}
      on:click={() => toggle("toggleBulletList")}
    >
      <List />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("orderedList")}
      on:click={() => toggle("toggleOrderedList")}
    >
      <NumList />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      on:click={() => toggle("undo")}
    >
      <Arrow />
    </div>
  </div>
{/if}

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
  .toolbar {
    width: 100%;
    display: flex;
    padding-inline: var(--spacing-md, 8px);
    gap: var(--spacing-xxs, 2px);
    justify-content: center;
    .button {
      height: max-content;
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
      height: 44px;
      width: 44px;
      &.active {
        background-color: var(
          --component-colors-components-buttons-primary-button-primary-bg
        );
        :global(path) {
          fill: var(--colors-base-white) !important;
        }
      }
      &.disabled {
        // background-color: ;
        background: var(--colors-background-bg-disabled, #f7f7f7);
        :global(path) {
          fill: var(--colors-foreground-fg-disabled, #8c8c8c) !important;
        }
      }
    }
    .link-button {
      position: relative;
    }
  }
</style>
