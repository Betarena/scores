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

  export let alt: string = "";
  export let link: string = "";
  export let editor: Editor;

  let modal;
  let top = `100vh`;

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
    editor
      .chain()
      .focus()
      .command(({ state, tr }) => {
        let foundPos: number | null = null;

        tr.doc.descendants((node, pos) => {
          if (node.type.name === "imageWithPlaceholder") {
            foundPos = pos;
            return false;
          }
          return true;
        });

        if (foundPos === null) return false;

        const oldNode = state.doc.nodeAt(foundPos);
        if (!oldNode) return false;

        const newNode = state.schema.nodes.imageWithPlaceholder.create({
          ...oldNode.attrs,
          alt,
          link: link || null,
        });

        tr.replaceWith(foundPos, foundPos + 1, newNode);

        return true;
      })
      .run();

    hide();
  }

  function hide() {
    $modalStore.show = false;
  }

  function updateViewportHeight() {
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
  <Input bind:value={link} placeholder="Enter url" label="Image link" />
  <Input bind:value={alt} placeholder="Enter alt text" label="Image Alt" />
  <div class="buttons">
    <Button type="secondary-gray" size="sm" on:click={hide}>Cancel</Button>
    <Button size="sm" on:click={save}>Save</Button>
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
