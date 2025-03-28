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

  import { createEventDispatcher } from "svelte";
  import DefaultAvatar from "./assets/default-avatar.svelte";
  import ImgPlaceholder from "./assets/img-placeholder.svelte";

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
    /**
     * @description
     * avatar size
     */
    size = 48,
    radius = "4px";

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
{#if src}
  <div
    on:click={() => dispatch("click")}
    class="sportstack-image"
    style="background: url({src}) center center / cover no-repeat; width: {size}px; height: {size}px; border-radius: {radius}"
  />
{:else}
  <div
    class="img empty"
    style=" width: {size}px; height: {size}px; border-radius: {radius}"
  >
    <ImgPlaceholder size={size/2} />
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
  .sportstack-image,
  .empty {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    object-fit: contain;
    background-image: url(src);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .empty {
    background-color: var(--colors-background-bg-quaternary, #525252);
    display: flex;
    align-items: center;
    justify-content: center;
    :global(svg path) {
      stroke: var(--colors-foreground-fg-secondary-700) !important;
    }
  }
</style>
