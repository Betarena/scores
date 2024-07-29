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

  import { onMount, afterUpdate, tick } from "svelte";
  import { writable } from "svelte/store";
  import type { IPageAuthorTagData } from "@betarena/scores-lib/types/v8/preload.authors.js";

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
  export let data = [] as IPageAuthorTagData[];
  let /**
     * @description variables to controll tags visability
     */
    wrapWidth,
    wrapNode,
    countOfNotVisibleData = 0,
    expanded = false,
    prevDataIds = ""
    ;
  $: reset(data);
  const visibleData = writable({
    vd: [...data] as any[],
    countOfNotVisibleData: 0,
  });

  const breakpointsMap = new Map<number, any>();

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "ui⮕expand-data-wrapper";
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
  // ╰───

  function reset(data) {
    if (data.map((d) => d.id).join(",") === prevDataIds) return;
    prevDataIds = data.map((d) => d.id).join(",");
    visibleData.set({ vd: [...data], countOfNotVisibleData: 0 });
    requestAnimationFrame(() => {
      calculateBreakpoints(wrapNode, data);
      resize();
    })
  }
  function resize() {
    if (!wrapNode || !wrapWidth || expanded || !breakpointsMap.set) return;
    const breakpoints = Array.from(breakpointsMap.keys());
    const closestBreakpoint = breakpoints.find((bp, i) => wrapWidth >= bp && (i + 1 === breakpoints.length || wrapWidth < breakpoints[i + 1]));
    if (!closestBreakpoint || !breakpointsMap.has(closestBreakpoint)) {
      return;
    }
    const index = breakpointsMap.get(closestBreakpoint);
    if (index === $visibleData.vd.length) return;
    const vd = data.slice(0, index);
    const countOfNotVisibleData = data.length - vd.length;
    visibleData.set({ vd, countOfNotVisibleData });
  }


  function getItemWidth(node, index) {
    const item = node.children[index];
    return item ? item.offsetWidth : 0;
  }

  function expandTags() {
    expanded = true;
    visibleData.set({ vd: data, countOfNotVisibleData: 0 });
  }

  function calculateBreakpoints(node, data) {
    let totalWidth = 0;
    let maxVisibleItems = 0;
    const extraSpace = 50;
    const gap = 4;

    for (let i = 0; i < data.length; i++) {
      const itemWidth = getItemWidth(node, i);
      const nextItemWidth = totalWidth + itemWidth + extraSpace;
      totalWidth += itemWidth + gap;
      breakpointsMap.set(nextItemWidth,  i);
    }
    return maxVisibleItems;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  afterUpdate(() => {
    resize();
  });
  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
</script>

<div
  id={CNAME}
  class="wrapper"
  class:expanded
  bind:clientWidth={wrapWidth}
  bind:this={wrapNode}
>
  {#if countOfNotVisibleData}
    <div on:click={expandTags}>
      <slot id="expand-wrapper-count" name="count" count={countOfNotVisibleData}
        >+{countOfNotVisibleData}</slot
      >
    </div>
  {/if}
  {#each $visibleData.vd as item}
    <slot name="item" class="expand-wrapper-item" {item}>{item.title}</slot>
  {/each}
  {#if $visibleData.countOfNotVisibleData > 0}
    <div on:click={expandTags}>
      <slot
        id="expand-wrapper-count"
        name="count"
        count={$visibleData.countOfNotVisibleData}
        >+{$visibleData.countOfNotVisibleData}</slot
      >
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
  .wrapper {
    display: flex;
    gap: 4px;
    max-width: 100%;
    overflow: hidden;
    row-gap: 7px;

    &.expanded {
      flex-wrap: wrap;
    }
  }
</style>
