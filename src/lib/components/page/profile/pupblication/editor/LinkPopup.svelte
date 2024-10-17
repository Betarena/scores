<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Editor } from "@tiptap/core";
  import Input from "$lib/components/ui/Input.svelte";
  import Button from "$lib/components/ui/Button.svelte";

  export let editor: Editor;
  export let linkState: { url: string; text: string };
  export let mode: "info" | "edit";
  export let show = false;

  $: linkState.url = linkState.url.toLowerCase();

  const dispatch = createEventDispatcher();

  function hide() {
    if (!show) return;
    dispatch("hide");
  }

  function save() {
    const {url, text} = linkState
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .deleteSelection()
      .setLink({ href: url  })
      .insertContent(text || url)
      .run();

    hide();
  }

  function remove() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    hide();
  }

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
<svelte:body on:click={hide} />

<div class="link-popup {mode}" on:click|stopPropagation>
  {#if mode === "info"}
    <div class="url">
      {linkState.url}
    </div>
    <div class="buttons">
      <svg
        on:click={() => {mode = "edit"; show = true}}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M18 10L14 6M2.49997 21.5L5.88434 21.124C6.29783 21.078 6.50457 21.055 6.69782 20.9925C6.86926 20.937 7.03242 20.8586 7.18286 20.7594C7.35242 20.6475 7.49951 20.5005 7.7937 20.2063L21 7C22.1046 5.89543 22.1046 4.10457 21 3C19.8954 1.89543 18.1046 1.89543 17 3L3.7937 16.2063C3.49952 16.5005 3.35242 16.6475 3.24061 16.8171C3.1414 16.9676 3.06298 17.1307 3.00748 17.3022C2.94493 17.4954 2.92195 17.7021 2.87601 18.1156L2.49997 21.5Z"
          stroke-width="1.66"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        on:click={remove}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M7 1H13M1 4H19M17 4L16.2987 14.5193C16.1935 16.0975 16.1409 16.8867 15.8 17.485C15.4999 18.0118 15.0472 18.4353 14.5017 18.6997C13.882 19 13.0911 19 11.5093 19H8.49065C6.90891 19 6.11803 19 5.49834 18.6997C4.95276 18.4353 4.50009 18.0118 4.19998 17.485C3.85911 16.8867 3.8065 16.0975 3.70129 14.5193L3 4M8 8.5V13.5M12 8.5V13.5"
          stroke-width="1.66"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  {:else}
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
  .link-popup {
    display: flex;
    z-index: 2 !important;
    background: var(--colors-background-bg-active);
    padding: var(--spacing-lg) var(--spacing-sm, 6px);
    gap: var(--spacing-lg, 6px);
    border-radius: var(--radius-md);
    box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
      0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));

    .buttons {
      display: flex;
      gap: var(--spacing-sm, 6px);
      justify-content: flex-end;
    }
    &.edit {
      padding:  var( --spacing-xl);
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
    &.info {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-lg) var( --spacing-xl);
      .url {
        gap: var(--spacing-xs, 4px);
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--colors-text-text-primary, #fbfbfb);
      }
      svg {
        cursor: pointer;
        path {
          stroke: var(--colors-text-text-primary, #fbfbfb);
        }

        &:hover path {
          stroke:  var(--colors-text-text-brand-tertiary) ;
        }
      }

      .buttons {
        gap: var(--spacing-xl, 16px);
      }
    }
  }
</style>
