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
  import { activePopup } from "./stores/menu-popup.js";
    import { scale } from "svelte/transition";
  import { articleFilterStore } from "../page/profile/pupblication/editor/helpers.js";

  export let show = false;
  export let options: { id: string; icon?: any; label: string }[] = [];

  let menuNode: HTMLElement;
  let root: HTMLElement;

  const dispatch = createEventDispatcher();

  function click(id: string) {
    dispatch("click", id);
    show = false;
  }

  function adjustMenuPosition() {
    if (menuNode) {
      const parentElement = menuNode.parentElement;
      if (!parentElement) return;

      const parentRect = parentElement.getBoundingClientRect();
      const rect = menuNode.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.offsetHeight;
      let left = parentRect.left + parentRect.width / 2 - rect.width / 2;
      let top = parentRect.bottom + 5 + window.scrollY;

      if (left + rect.width > viewportWidth) {
        left = viewportWidth - rect.width - 5;
      }
      if (left < 0) {
        left = 5;
      }
      if (top + rect.height > viewportHeight) {
        top = parentRect.top - rect.height - 5 + window.scrollY;  }

      menuNode.style.left = `${left}px`;
      menuNode.style.top = `${top}px`;
      root.appendChild(menuNode);
      activePopup.subscribe((node) => {
        if (node !== menuNode) {
          show = false;
        }
      });
    }
  }

  $: if (show && menuNode) {
    activePopup.set(menuNode);
  }


  $: if (menuNode && show && root) {
    adjustMenuPosition();
  }

  onMount(() => {
    root = document.body.querySelector("#app-root-layout") as HTMLElement;
  });
</script>

<svelte:window on:resize={adjustMenuPosition} />
<svelte:body on:click={() => (show = false)} />
{#if show}
  <div class="menu"  out:scale on:click|stopPropagation bind:this={menuNode}>
    {#each options as item}
      <div class="menu-item {item.id}" class:active={$articleFilterStore.sortBy === item.id} on:click={() => click(item.id)}>
        <div class="content">
          <div class="icon"><svelte:component this={item.icon} /></div>
          <div class="label">{item.label}</div>
        </div>
      </div>
    {/each}
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
  .menu {
    position: absolute;
    border-radius: var(--radius-md, 8px);
    border: 1px solid var(--colors-border-border-primary, #6a6a6a);
    background: var(--colors-background-bg-quaternary, #525252);
    top: 100%;
    left: 50%;
    z-index: 100;
    width: max-content;
    // transform: translate(-50%, 8px);
    /* Shadows/shadow-lg */
    box-shadow: 0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg_01, rgba(255, 255, 255, 0)),
      0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg_02, rgba(255, 255, 255, 0));

    .menu-item {
      display: flex;
      padding: 1px 6px;
      align-items: start;
      align-self: stretch;
      cursor: pointer;
      .content {
        padding: 9px 10px;
        width: 100%;
        display: flex;
        gap: var(--spacing-md, 8px);
      }
      .label {
        color: var(--colors-text-text-secondary-700, #d2d2d2);

        /* Text sm/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      &:hover, &.active {
        .content {
          border-radius: var(--radius-sm, 6px);
          background: var(--colors-background-bg-primary_hover, #3b3b3b);

          .label {
            color: var(--colors-text-text-secondary_hover, #ededed);
          }
          :global(path) {
            stroke: var(--colors-text-text-secondary_hover, #ededed);
          }
        }
      }

      &.delete,
      &.delete:hover {
        .label {
          color: var(--colors-text-text-error-primary-600, #f97066);
        }
        :global(path) {
          stroke: var(--colors-text-text-error-primary-600, #f97066);
        }
      }
    }
  }
</style>
