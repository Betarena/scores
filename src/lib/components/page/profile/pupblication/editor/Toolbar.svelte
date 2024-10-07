<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Input from "$lib/components/ui/Input.svelte";
  import Add from "./icons/Add.svelte";
  import Arrow from "./icons/Arrow.svelte";
  import B from "./icons/B.svelte";
  import I from "./icons/I.svelte";
  import L from "./icons/L.svelte";
  import List from "./icons/List.svelte";
  import NumList from "./icons/NumList.svelte";
  import Q from "./icons/Q.svelte";

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

  let linkPopup = false;
  let showLinkText = false;
  let linkText = "";
  let linkHref = "";

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

  function toggle(cb) {
    if (titleInFocus) return;
    editor.chain().focus()[cb]().run();
  }

  function linkClick() {
    if (titleInFocus) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const selectionEmpty = editor.state.selection.empty;
    showLinkText = selectionEmpty;
    linkPopup = true;
  }

  function hideLinkPopup() {
    if (!linkPopup) return;
    linkPopup = false;
    if (linkHref) {
      if (showLinkText) {
        editor
          .chain()
          .focus()
          .setLink({ href: linkHref })
          .insertContent(linkText || linkHref)
          .run();
      } else {
        editor.chain().focus().setLink({ href: linkHref }).run();
      }
      linkHref = "";
      linkText = "";
    }
  }

  function handlePopupFocus(e) {
    const ev = e.detail;
    ev.preventDefault();
    const popup = ev.target.closest(".link-popup");
    ev.target.scrollIntoView(false);
    setTimeout(() => {
      if (popup) {
        e.target.focus();
      }
    }, 300);
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

<svelte:body on:click={hideLinkPopup} />

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
      class:active={editor.isActive("blockquote")}
      on:click={() => toggle("toggleBlockquote")}
    >
      <Q />
    </div>
    <div
      on:click|stopPropagation={linkClick}
      class="button link-button"
      class:disabled={titleInFocus}
      class:active={linkPopup || editor.isActive("link")}
    >
      {#if linkPopup}
        <div class="link-popup">
          {#if showLinkText}
            <Input
              placeholder="Enter text"
              label="Text"
              on:focus={handlePopupFocus}
              bind:value={linkText}
            />
          {/if}
          <Input
            placeholder="Enter URL"
            label="URL"
            on:focus={handlePopupFocus}
            bind:value={linkHref}
          />
        </div>
      {/if}
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

      .link-popup {
        position: absolute;
        top: -10px;
        left: 0;
        width: fit-content;
        height: fit-content;
        z-index: 100;
        transform: translate(-50%, -100%);

        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg, 6px);

        border-radius: var(--radius-md);
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.24);
        z-index: 1;
        padding: var(--spacing-lg) var(--spacing-sm, 6px);
        background: var(--colors-background-bg-active);
      }
    }
  }
</style>
