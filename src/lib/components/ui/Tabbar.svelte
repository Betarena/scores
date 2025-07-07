<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import Tabbar from './Tabbar.svelte';
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->
<script lang="ts">
  import type { ITab } from "$lib/types.js";
  import { createEventDispatcher, tick } from "svelte";
  import ScrollDataWrapper from "./wrappers/ScrollDataWrapper.svelte";

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

  export let data = [] as ITab[];
  export let selected = null as ITab | null;
  export let height = 14;
  export let translations: { [key: string]: string } = {};
  export let type:
    | "underline"
    | "button_border"
    | "button_brand"
    | "button_gray" = "underline";
  export let size: "sm" | "md" | undefined = undefined;
  export let fullWidth = false;
  let activeNode: HTMLElement;
  let tabbarNode: HTMLElement;
  const dispatch = createEventDispatcher();
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯
  $: if (!selected && tabbarNode) {
    select(data[0]);
  }
  $: if (selected && tabbarNode && (type !== "underline" || activeNode))
    select(selected);
  $: if (translations && selected && tabbarNode) updateBorder();

  $: if (!data?.includes(selected) && tabbarNode) {
    select(data[0]);
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

  function select(tab: ITab) {
    setBorder(tab);
    if (selected?.id !== tab.id) {
      dispatch("select", tab);
      selected = tab;
    }
  }

  let callCount = 0;
  function setBorder(tab: ITab) {
    if (!activeNode) return;
    const tabNode = tabbarNode.querySelector(
      `[data-tab-id="${tab.id}"]`
    ) as any;
    if (tabNode) {
      setTimeout(() => {
        if (!activeNode) return;
        activeNode.style.width = `${tabNode.offsetWidth}px`;
        activeNode.style.left = `${tabNode.offsetLeft}px`;
      }, 100);
      callCount = 0;
      return;
    }
    if (callCount > 2) return;
    tick().then(() => setBorder(tab));
    callCount++;
  }

  async function updateBorder() {
    if (selected) {
      await tick();
      setBorder(selected);
    }
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<div
  class="tabbar {type} {size}"
  class:full={fullWidth}
  bind:this={tabbarNode}
  {...$$restProps}
>
  <ScrollDataWrapper {data} let:item>
    <div
      class="tab-item"
      style="margin-bottom: {type === 'underline' ? height : 0}px;"
      data-tab-id={item.id}
      class:selected={selected?.id === item.id}
      on:click={(e) => select(item)}
    >
      <slot tab={item}>{item.label}</slot>
    </div>
  </ScrollDataWrapper>
  {#if type === "underline"}
    {#key translations}
      <div class="active" bind:this={activeNode} />
    {/key}
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
  .tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 20px;
    position: relative;
    font-weight: 500;
    color: rgba(0, 0, 0, 0);

    .tab-item {
      position: static;
      color: var(--colors-text-text-quaternary, #727171);

      cursor: pointer;
      &:hover {
        color: var(--text-color);
      }

      &.selected {
        color: var(--colors-text-text-brand-tertiary, #f5620f);
      }
    }

    .selected {
      color: var(--text-color);
      position: relative;
      transition: all 0.3s ease-out;
      bottom: 1px solid var(--colors-foreground-fg-brand-primary, #f5620f);
    }
    .active {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      transition: all 0.5s cubic-bezier(0, 0.14, 0.29, 1.07);
      background: var(--colors-foreground-fg-brand-primary);
    }

    &.button_border {
      display: flex;
      padding: var(--spacing-sm, 6px);
      align-items: center;
      gap: var(--spacing-xs, 4px);

      border-radius: var(--radius-xl, 12px);
      border: 1px solid var(--colors-border-border-secondary, #ededed);
      background: var(--colors-background-bg-secondary_alt, #fbfbfb);

      .tab-item {
        display: flex;
        height: 44px;
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        justify-content: center;
        align-items: center;
        gap: var(--spacing-md, 8px);

        border-radius: var(--radius-sm, 6px);

        color: var(--colors-text-text-quaternary-500, #727171);

        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }

      .selected {
        display: flex;
        height: 44px;
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        justify-content: center;
        align-items: center;
        gap: var(--spacing-md, 8px);

        border-radius: var(--radius-sm, 6px);
        background: var(--colors-background-bg-primary_alt, #fff);

        /* Shadows/shadow-sm */
        box-shadow: 0px 1px 3px 0px
            var(--colors-effects-shadows-shadow-sm_01, rgba(31, 31, 31, 0.1)),
          0px 1px 2px 0px
            var(--colors-effects-shadows-shadow-sm_02, rgba(31, 31, 31, 0.06));

        color: var(--colors-text-text-secondary, #525252);

        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
      &.full {
        .tab-item {
          padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        }
      }
    }

    &.button_gray {
      .tab-item {
        display: flex;
        height: 44px;
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        justify-content: center;
        align-items: center;
        gap: var(--spacing-md, 8px);

        border-radius: var(--radius-sm, 6px);

        color: var(--colors-text-text-quaternary-500, #727171);

        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */

        &:hover {
          background: var(--colors-background-bg-primary_hover, #FBFBFB);
          color: var(--colors-text-text-secondary-700, #525252);
        }
      }

      .selected {
        display: flex;
        height: 44px;
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        justify-content: center;
        align-items: center;
        gap: var(--spacing-md, 8px);

        border-radius: var(--radius-sm, 6px);
        background: var(--colors-background-bg-primary_alt, #fff);

        /* Shadows/shadow-sm */
        box-shadow: 0px 1px 3px 0px
            var(--colors-effects-shadows-shadow-sm_01, rgba(31, 31, 31, 0.1)),
          0px 1px 2px 0px
            var(--colors-effects-shadows-shadow-sm_02, rgba(31, 31, 31, 0.06));

        color: var(--colors-text-text-secondary-700, #525252);

        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }

      &.full {
        .tab-item {
          padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        }
      }
    }

    &.md {
      gap: var(--spacing-lg, 12px);
      .tab-item {
        display: flex;
        height: 36px;
        padding: var(--spacing-none, 0px) var(--spacing-xs, 4px)
          var(--spacing-lg, 12px) var(--spacing-xs, 4px);
        justify-content: center;
        align-items: center;
        margin-bottom: 0 !important;

        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
    &.sm {
      .tab-item {
        display: inline-flex;
        height: 36px;
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        justify-content: center;
        align-items: center;
        gap: var(--spacing-md, 8px);
        flex-shrink: 0;

        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
    }

    &.full {
      gap: var(--spacing-xs, 4px);
      .tab-item {
        flex-grow: 1;
      }
    }
  }
</style>
