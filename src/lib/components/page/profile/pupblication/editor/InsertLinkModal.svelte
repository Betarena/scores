<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import { Editor } from "@tiptap/core";
    import { onMount } from "svelte";
  import { scale } from "svelte/transition";

  export let linkState: { url: string; text: string };
  export let editor: Editor;
  $: linkState.url = linkState.url.toLowerCase();

  let top = `100vh`;

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
      top = `${window.visualViewport.height / 2}px`;
    } else {
      top = `50vh`;
    }
  }

  onMount(() => {
    updateViewportHeight();
    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("scroll", updateViewportHeight);

    return () => {
      // Clean up the event listener
      window.visualViewport?.removeEventListener(
        "resize",
        updateViewportHeight
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        updateViewportHeight
      );
    };
  });
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
<div class="link-popup" style="top: {top}" in:scale out:scale>
  <Input
    bind:value={linkState.text}
    placeholder="Enter link text"
    label="Text"
  />
  <Input bind:value={linkState.url} placeholder="Enter url" label="URL" />
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
