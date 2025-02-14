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
  import { modalStore } from "$lib/store/modal";
  import { onMount } from "svelte";

  import { browser } from "$app/environment";
  import ModalBackdrop from "../misc/modal/Modal-Backdrop.svelte";
  import session from "$lib/store/session.js";
    import { fly, scale } from "svelte/transition";
    import { cubicOut, cubicIn } from "svelte/easing";

  export let show = false;
  export let modal = true;
  export let bottomOnMobile = false;
  let node;
  // #endregion ➤ 📦 Package Imports
  $: ({ viewportType } = $session);
  $: if (browser && node) {
    const root = document.body.querySelector("#app-root-layout") as HTMLElement;
    root.appendChild(node);
  }
  function chooseTransition(node, { easing, out = false }) {
    if (viewportType === "mobile") {
      return fly(node, { y: 600, duration: out ? 900 : 700, easing });
    }
    return scale(node, { easing });
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

{#if show}
  <div bind:this={node}>
    {#if modal}
       <ModalBackdrop on:closeModal={() => (show = false)} />
      {/if}
    <div in:chooseTransition={{ easing: cubicOut }} out:chooseTransition={{ easing: cubicIn, out: true }} class="modal-body {viewportType}" class:bottomOnMobile style="{$$restProps.style}">
      <slot />
    </div>
  </div>
  <!-- content here -->
  <!-- else content here -->
{/if}
<!-- {#if $modalStore.show && $modalStore.component}
  <div class="modal-content">
    <svelte:component this={$modalStore.component} {...$modalStore.props} />
  </div>
{/if} -->

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
  .modal-body {
    z-index: 4000;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: var(--spacing-xl, 16px);
    background: var(--colors-background-bg-primary, #fff);
    border-radius: var(--radius-xl, 12px);
    background: var(--colors-background-bg-primary, #fff);
    box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
      0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));


    &.mobile.bottomOnMobile {
      top: auto;
      bottom: 0;
      width: 100%;
      transform: translate(-50%, 0);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
</style>
