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
  import { createEventDispatcher, onMount, tick } from "svelte";
  import TranslationText from "../misc/Translation-Text.svelte";
  import session from "$lib/store/session.js";

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
  interface ITab {
    id: string;
    name?: string;
    label: string;
    [key: string]: any;
  }

  export let data = [] as ITab[];
  export let selected = null as ITab | null;
  export let height = 14;
  export let translations: { [key: string]: string } = {};
  export let bottom_border = false;
  let activeNode: HTMLElement;
  let tabbarNode: HTMLElement;
  const dispatch = createEventDispatcher();
  $: ({ viewportType } = $session);
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
  $: if (viewportType) updateBorder();
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
    const tabNode = tabbarNode.querySelector(
      `[data-tab-id="${tab.id}"]`
    ) as any;
    if (tabNode) {
      activeNode.style.width = `${tabNode.offsetWidth}px`;
      activeNode.style.left = `${tabNode.offsetLeft}px`;
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
  {...$$restProps}
  class="tabbar {$$restProps.class || ''}"
  bind:this={tabbarNode}
  style="{bottom_border
    ? 'border-bottom: 1px solid var(--Border-border-tertiary);'
    : ''} {$$restProps.style || ''}"
>
  {#each data as item, i (item.id)}
    <div
      class="tab-item"
      style="margin-bottom: {height}px;"
      data-tab-id={item.id}
      class:selected={selected?.id === item.id}
      on:click={(e) => select(item)}
    >
      <slot tab={item}
        ><TranslationText
          text={translations[item.label] || translations[item?.name || ""]}
          fallback={item.name || item.label}
        />
      </slot>
    </div>
  {/each}
  <div class="active" bind:this={activeNode} />
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
    gap: var(--spacing-lg);
    position: relative;
    font-weight: 500;
    overflow-x: auto;

    .tab-item {
      position: static;
      color: var(--text-text-quarternary);
      user-select: none;
      cursor: pointer;
      flex-shrink: 0;
      &:hover {
        color: var(--text-text-primary);
      }
      &.selected {
        position: relative;
        transition: all 0.3s ease-out;
        bottom: 1px solid var(--foreground-fg-brand-primary);
        color: var(--text-text-brand-primary);
      }
    }

    .active {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      transition: all 0.5s cubic-bezier(0, 0.14, 0.29, 1.07);
      background: var(--text-text-brand-secondary);
    }
  }
</style>
