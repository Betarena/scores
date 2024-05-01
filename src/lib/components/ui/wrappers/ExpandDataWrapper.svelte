<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
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
  export let data = [] as any[];
  let /**
     * @description variables to controll tags visability
     */
    wrapWidth,
    wrapNode,
    prevWidth = 0,
    countOfNotVisibleData = 0,
    expanded = false;
  $: visibleData = [...data] as any[];

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "ui⮕expand-data-wrapper";
  $: resize(wrapWidth, wrapNode, data);

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
  // #endregion ➤ 🛠️ METHODS
  let debounds;

  function resize(width: number, node: HTMLDivElement, data: any[]) {
    if (!width || !node) return;
    const scrollWidth = node.scrollWidth;
    if (width < scrollWidth) {
      visibleData.pop();
      visibleData = [...visibleData];
    } else if (width > prevWidth) {
      const lastVisible = visibleData.at(-1);
      const i = data.indexOf(lastVisible);
      const addData = data[i + 1];
      if (addData && !visibleData?.find((t) => t.id === addData.id))
        visibleData = [...data, addData];
    }

    prevWidth = width;
    countOfNotVisibleData = data.length - visibleData.length;
    if (countOfNotVisibleData < 0) countOfNotVisibleData = 0;
    if (debounds) clearTimeout(debounds);

    setTimeout(() => {
      debounds = null;
      if (width === wrapWidth && width < node.scrollWidth)
        resize(width, node, data);
    }, 50);
  }

  function expandTags() {
    expanded = true;
    countOfNotVisibleData = 0;
    visibleData = [...data];
  }

  // #endregion ➤ 📌 VARIABLES
</script>

<div
  id={CNAME}
  class="wrapper"
  class:expanded
  bind:clientWidth={wrapWidth}
  bind:this={wrapNode}
>
  {#each visibleData as item}
    <slot name="item" {item}>{item.title}</slot>
  {/each}
  {#if countOfNotVisibleData}
    <div on:click={expandTags}>
      <slot name="count" count={countOfNotVisibleData}
        >+{countOfNotVisibleData}</slot
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
