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
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { modalStore } from "$lib/store/modal.js";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { Editor } from "@tiptap/core";
  import type { TranslationSportstacksSectionDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";

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

  export let linkState: { url: string; text: string };
  export let editor: Editor;
  export let translations: TranslationSportstacksSectionDataJSONSchema;

  let modal;
  let top = `100vh`;

  $: linkState.url = linkState?.url.toLowerCase();
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

  function save() {
    const { url, text } = linkState;
    if (!url) return hide();
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .deleteSelection()
      .setLink({ href: url })
      .insertContent(text || url)
      .run();

    hide();
  }

  function hide() {
    $modalStore.show = false;
  }

  function updateViewportHeight() {
    // toogleLinkPopup(false)
    const isKeyboardOpen =
      (window.visualViewport?.height || 0) < window.innerHeight;
    if (isKeyboardOpen) {
      top = `${(window.visualViewport?.height || 0) / 2}px`;
    } else {
      top = `50vh`;
    }
  }
  function updateModalPosition() {
    const scrollTop = window.scrollY;
    top = `${(window.visualViewport?.height || 0) / 2 + scrollTop}px`;
  }

  // #endregion ➤ 🛠️ METHODS

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

  onMount(() => {
    updateModalPosition();
    window?.getSelection()?.removeAllRanges();
  });

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
<svelte:window
  on:resize={updateViewportHeight}
  on:scroll={updateModalPosition}
/>
<div bind:this={modal} class="link-popup" style="top: {top}" in:scale out:scale>
  <Input
    bind:value={linkState.text}
    placeholder={translations.enter_link_text || "Enter link text"}
    label={translations.text || "Text"}
  />
  <Input
    bind:value={linkState.url}
    placeholder={translations.enter_url || "Enter url"}
    label={translations.url || "URL"}
  />
  <div class="buttons">
    <Button type="secondary-gray" size="sm" on:click={hide}
      >{translations.cancel || "Cancel"}</Button
    >
    <Button size="sm" on:click={save}>{translations.save || "Save"}</Button>
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
  .link-popup {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--colors-background-bg-active);
    padding: var(--spacing-lg) var(--spacing-sm, 6px);
    gap: var(--spacing-lg, 6px);
    border-radius: var(--radius-md);
    background: var(--colors-background-bg-primary, #fff);
    box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
      0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));

    .buttons {
      display: flex;
      gap: var(--spacing-sm, 6px);
      justify-content: flex-end;
    }
    padding: var(--spacing-xl);
    flex-direction: column;
    .buttons {
      justify-content: flex-start;
      width: 100%;
      :global(.button) {
        flex-grow: 1;
        flex-basis: 0;
      }
    }
  }
</style>
