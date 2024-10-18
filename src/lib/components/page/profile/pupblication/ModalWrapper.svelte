<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import XClose from "$lib/components/ui/assets/x-close.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";
  import { scale } from "svelte/transition";

  export let title = "Title";
  export let text = "";
  export let actionButton = "Action Button";
  export let cancel = "Cancel";

  $: ({ viewportType } = $session);
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

<div class="modal" in:scale out:scale>
  <div class="top-block">
    <div class="header">
      <slot name="header-icon" />
      <div class="close" on:click={() => ($modalStore.show = false)}>
        <XClose />
      </div>
    </div>

    {#if text || title}
      <div class="content">
        {#if title}
          <div class="title">
            <slot name="title">{title}</slot>
          </div>
        {/if}
        {#if text || $$slots.text}
          <div class="text"><slot name="text">{text}</slot></div>
        {/if}
      </div>
    {/if}
  </div>
  <div class="buttons">
    <slot name="action-button"
      ><Button full={true}>{actionButton}</Button></slot
    >
    <slot name="cancel-button"
      ><Button
        type="secondary-gray"
        on:click={() => ($modalStore.show = false)}
        full={true}>{cancel}</Button
      ></slot
    >
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
  .modal {
    display: inline-flex;
    flex-direction: column;
    width: 418px;
    max-width: 90vw;
    gap: var(--spacing-3xl, 24px);
    align-items: center;
    border-radius: var(--radius-xl, 12px);
    background: var(--colors-background-bg-primary, #fff);

    padding: var(--spacing-xl, 16px);
    padding-top: var(--spacing-2xl, 20px);

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* Shadows/shadow-xl */
    box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
      0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));

    .top-block {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl, 16px);;
    }

    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      /* Text lg/Semibold */

      .close {
        cursor: pointer;
        &:hover {
          :global(path) {
            stroke: var(--colors-foreground-fg-quinary_hover);
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xs, 4px);
      align-self: stretch;
      .title {
        color: var(--colors-text-text-primary, #fbfbfb) !important;
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-lg, 18px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-lg, 28px); /* 155.556% */
      }

      .text {
        color: var(--colors-text-text-tertiary, #8c8c8c) !important;

        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
    }

    .buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;
    }
  }
</style>
