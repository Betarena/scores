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

  import { getOptimizedImageUrl } from "$lib/utils/image";
  import { createEventDispatcher } from "svelte";
  import DefaultAvatar from "./assets/default-avatar.svelte";
  import LoggedoutAvatar from "./assets/loggedout-avatar.svelte";

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

  export let src: string | null = "",
    isLoogedIn = false,
    /**
     * @description
     * avatar size
     */
    size: number | string = 38;

    let numSize = 38;
  $: styles = `height: ${numSize}px; width: ${numSize}px;`;
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    xxl:64,
  }
  $: if (typeof size === "string") {
    numSize = sizeMap[size] || 38;
  } else {
    numSize = size;
  }

  const dispatch = createEventDispatcher();

  // #endregion ➤ 📌 VARIABLES
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
  class="avatar-wrapper"
  on:click={() => dispatch("click")}
  style="{styles}  {$$restProps.wrapStyle}"
>
  {#if src}
    <div
      class="avatar-circle"
      {...$$restProps}
      class:size
      style="{styles} background-image: url({getOptimizedImageUrl({ strImageUrl: src })}); "
    />
  {:else if isLoogedIn}
    <DefaultAvatar size={numSize} />
  {:else}
    <LoggedoutAvatar size={numSize} />
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
  .avatar-wrapper {
    border-radius: 50%;
    overflow: hidden;
  }
  .avatar-circle {
    width: 38px;
    height: 38px;
    border-radius: 100%;

    // background-image: url(src);
    background-repeat: no-repeat;
    background-size: cover;
    // background: var(--img-url) lightgray 50% / cover no-repeat;
  }
</style>
