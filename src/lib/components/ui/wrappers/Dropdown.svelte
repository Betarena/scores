<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";

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
  export let show = false;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "dropdown⮕wrapper";
  const dispatch = createEventDispatcher();
  let modalNode: HTMLElement;
  let modalNodeCopy: HTMLElement;
  let positionAdjusted = false;
  let pos: { left: string; top: string; position?: string } = {
    left: "0",
    top: "0",
  };

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

  function showPopup() {
    if (!show) {
      show = true;
      dispatch("show");
    } else {
      hide();
    }
  }

  function hide() {
    if (show) {
      positionAdjusted = false;
      show = false;
      dispatch("hide");
    }
  }

  function addjustPosition() {
    if (modalNodeCopy) {
      let { right, left, bottom, top, width, height } =
        modalNodeCopy.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;
      const viewPortWidth = window.visualViewport?.width || innerWidth;
      const viewPortHeight = window.visualViewport?.height || innerHeight;
      let isChanged = false;
      pos = { left: `0px`, top: `calc(100% + 10px)`, position: "absolute" };
      if (right > viewPortWidth) {
        isChanged = true;
        left = viewPortWidth - width - 10;
      }
      if (left < 0) {
        isChanged = true;
        left = 5;
      }
      if (bottom > viewPortHeight) {
        isChanged = true;
        top = viewPortHeight - height - 10;
      }
      if (top < 0) {
        isChanged = true;
        top = 5;
      }
      if (isChanged) {
        pos = { left: `${left}px`, top: `${top}px`, position: "fixed" };
      }
      positionAdjusted = true;
    }
  }

  // #endregion ➤ 🛠️ METHODS
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

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->
<svelte:body on:click={hide} />
<div
  class="trigger"
  on:click|stopPropagation={showPopup}
  style="position: relative;"
>
  <slot name="trigger" />
  {#if show && positionAdjusted}
    <div
      class="dropdown"
      style="left: {pos.left}; top: {pos.top}; position: {pos.position ||
        'absolute'}; {pos.position === 'fixed' ? 'transform: none; ' : ''}"
      bind:this={modalNode}
      in:scale
      out:scale
      id={CNAME}
    >
      <slot name="content" />
    </div>
  {/if}
  {#if show && !positionAdjusted}
    <div
      class="dropdown copy"
      bind:this={modalNodeCopy}
      on:introend={addjustPosition}
      in:scale={{ duration: 0 }}
      id={`${CNAME}-hidden-copy`}
    >
      <slot name="content" />
    </div>
  {/if}
</div>

<style lang="scss">
  .trigger {
    position: relative;
    overflow: visible;
  }
  .dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    z-index: 1000;

    border-radius: var(--radius-xs);
    background-color: var(--background-bg-primary);
    color: var(--text-text-quarternary);
    padding-block: var(--spacing-xs);
    transform: translateX(-50%);
    --icon-color: var(--text-text-quarternary);
    box-shadow: var(--box-shadow);

    &.copy {
      visibility: hidden;
    }
  }
</style>
