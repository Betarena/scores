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
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";

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
    label?: string;
    [key: string]: any;
  }

  interface ITabWithNode extends ITab {
    node?: HTMLElement;
  }
  export let data = [] as ITab[];
  export let selected = null as ITab | null;
  export let height = 14;
  let activeNode: HTMLElement;
  const nodeStore = writable<ITabWithNode[]>([]);
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

  $: if (!selected && $nodeStore[0]?.node) {
    select($nodeStore[0])
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

  function select(item: ITabWithNode) {
    dispatch("select", item);
    const {node,...tab} = item;
    selected = tab;
    activeNode.style.width = `${node?.offsetWidth}px`;
    activeNode.style.left = `${node?.offsetLeft}px`;

  }


  $: if (data) {
    nodeStore.set(data.map((item) => ({ ...item })));
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<div class="tabbar">
  {#each data as item, i}
    <div class="tab-item" style="margin-bottom: {height}px;" bind:this={$nodeStore[i].node} class:selected={selected?.id === item.id} on:click={(e) => select($nodeStore[i])}>
      <slot tab={item}>{item.name || item.label}</slot>
    </div>
  {/each}
  <div class="active" bind:this = {activeNode} />
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

    .tab-item {
      position: static;
      color: var(--text-color-second-dark);
      cursor: pointer;
    }

    .selected {
      color: var(--text-color);
      position: relative;
      transition: all 0.3s ease-in-out;
    }
    .active {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      transition: all 0.3s ease-in-out;
      background: var(--primary);
    }
  }
</style>
