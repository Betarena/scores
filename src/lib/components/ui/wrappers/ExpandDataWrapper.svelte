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

  import { onMount, onDestroy } from "svelte";
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
  export let expandOnClick = true;
  let wrapNode: HTMLElement;
  let wrapWidth = 0;
  let expanded = false;
  let prevDataIds = "";

  const visibleData = writable<{
    vd: IPageAuthorTagData[];
    countOfNotVisibleData: number;
  }>({
    vd: [...data],
    countOfNotVisibleData: 0,
  });

  // cache of item widths (+ gap)
  let itemWidths: number[] = [];
  const gap = 4;

  // measured widths for +1 and +11 using same slot
  let widthOne = 0;
  let widthMany = 0;

  let ro: ResizeObserver;
  let resizeTimer: ReturnType<typeof setTimeout>;

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

  /** Measure item widths and count-slot widths for 1 and multi hidden */
  function computeWidths() {
    if (!wrapNode) return;
    const items = Array.from(wrapNode.children).filter(
      (el) => !(el as HTMLElement).classList.contains("measure-container")
    ) as HTMLElement[];
    // take only actual items
    itemWidths = items.slice(0, data.length).map((el) => el.offsetWidth + gap);
    const counts = wrapNode.querySelector(".measure-container");
    if (!counts) return;
    const counts_width = (Array.from(counts.children) as HTMLElement[]).map(
      (el) => el.offsetWidth + gap
    );
    // measure +1 and +11 via slot fallback
    widthOne = counts_width[0];
    widthMany = counts_width[1];
  }

  /** Adjust visible items such that count indicator fully fits */
  async function applyResize() {
    if (expanded) {
      visibleData.set({ vd: data, countOfNotVisibleData: 0 });
      return;
    }
    if (!wrapWidth || !itemWidths.length) return;

    let visibleCount = data.length;
    let total = 0;
    let hidden = 0;

    while (visibleCount > 0) {
      total =
        itemWidths.slice(0, visibleCount).reduce((a, b) => a + b, 0) - gap;
      let indicatorW = 0;
      if (hidden === 1) indicatorW = widthOne + gap;
      else if (hidden > 9) indicatorW = widthMany + gap;
      if (total + indicatorW + gap <= wrapWidth) break;
      visibleCount--;
      hidden++;
    }
    visibleData.set({
      vd: data.slice(0, visibleCount),
      countOfNotVisibleData: data.length - visibleCount,
    });
  }

  function expandTags() {
    if (!expandOnClick) return;
    expanded = true;
    visibleData.set({ vd: data, countOfNotVisibleData: 0 });
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯
  onMount(() => {
    ro = new ResizeObserver((entries) => {
      wrapWidth = entries[0].contentRect.width;
      clearTimeout(resizeTimer);
      computeWidths();
      resizeTimer = setTimeout(applyResize, 50);
    });
    ro.observe(wrapNode);
    return () => ro.disconnect();
  });
  onDestroy(() => ro.disconnect());

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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

  $: {
    const ids = data.map((d) => d.id).join(",");
    if (ids !== prevDataIds) {
      prevDataIds = ids;
      expanded = false;
      visibleData.set({ vd: [...data], countOfNotVisibleData: 0 });
      computeWidths();
      applyResize();
    }
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]
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

<div
  id="ui⮕expand-data-wrapper"
  class="wrapper"
  class:expanded
  bind:this={wrapNode}
>
  {#each $visibleData.vd as item}
    <slot name="item" class="expand-wrapper-item" {item}>{item.title}</slot>
  {/each}

  {#if $visibleData.countOfNotVisibleData > 0}
    <div
      on:click={expandTags}
    >
      <slot name="count" count={$visibleData.countOfNotVisibleData}>
        +{$visibleData.countOfNotVisibleData}
      </slot>
    </div>
  {/if}

  <!-- hidden measure slots: reuse slot count with different count values -->
  <div
    class="measure-container"
    style="visibility:hidden;position:absolute;pointer-events:none;white-space:nowrap;"
  >
    <slot name="count" count={1}>+1</slot>
    <slot name="count" count={11}>+11</slot>
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
  .wrapper {
    display: flex;
    gap: 4px;
    max-width: 100%;
    overflow: hidden;
    row-gap: 7px;
    position: relative;
    &.expanded {
      flex-wrap: wrap;
    }
  }
</style>
