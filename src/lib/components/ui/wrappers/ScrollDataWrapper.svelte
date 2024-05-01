<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Authors Article Main                                                      │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

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

  import { onMount } from "svelte";

  import ArrowLeft from "../assets/arrow-left.svelte";
  import ArrowRight from "../assets/arrow-right.svelte";

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

  export let /**
     * @augments any[]
     */
    data = [] as any[];

  /**
   * @description
   *  📣 Component interface.
   */
  type IWidgetState = "PrevButtonShow" | "NextButtonShow";

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "ui⮕scroll-data-wrapper";
  let /**
     * @description
     *  📣 Target `HTMLELement` for **Article Tags**.
     */
    htmlElementScrollBox: HTMLElement,
    /**
     * @description
     *  📣 **Local** component state
     */
    componentLocalState = new Set<IWidgetState>();

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

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Scrolls `tags` in a target `direction`.
   * @param { -1 | 1 | 0 } direction
   *  💠 **[required]** Target `direction` to _scroll_.
   * @return { void }
   */
  function scrollData(direction: -1 | 1 | 0): void {
    if (direction == -1)
      htmlElementScrollBox.scrollBy({ behavior: "smooth", left: 250, top: 0 });
    else if (direction == 1)
      htmlElementScrollBox.scrollBy({ behavior: "smooth", left: -250, top: 0 });
    // [🐞]
    // console.log('htmlElementScrollBox.scrollLeft', htmlElementScrollBox.scrollLeft);
    // console.log('htmlElementScrollBox.offsetWidth', htmlElementScrollBox.offsetWidth);
    // console.log('htmlElementScrollBox.scrollWidth', htmlElementScrollBox.scrollWidth);

    if (htmlElementScrollBox.scrollLeft == 0)
      componentLocalState.delete("PrevButtonShow");
    else componentLocalState.add("PrevButtonShow");
    if (
      htmlElementScrollBox.scrollLeft + htmlElementScrollBox.offsetWidth + 5 >
      htmlElementScrollBox.scrollWidth
    )
      componentLocalState.delete("NextButtonShow");
    else componentLocalState.add("NextButtonShow");
    componentLocalState = componentLocalState;

    return;
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
    scrollData(0);
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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

<div id={CNAME} class="tags-box">
  <!--
    ╭─────
    │ > previous (button)
    ╰─────
    -->
  {#if componentLocalState.has("PrevButtonShow")}
    <div
      id="tagScrollPrev"
      class="
        tagScrollButton
        "
      on:click={() => {
        scrollData(1);
        return;
      }}
    >
      <ArrowLeft />
    </div>
  {/if}

  <!--
    ╭─────
    │ > article tags (inner)
    ╰─────
    -->
  <div
    id="tags-box-scroll"
    bind:this={htmlElementScrollBox}
    on:scroll={() => {
      scrollData(0);
      return;
    }}
  >
    {#each data as item}
      <slot {item}>use ScrollDataWrapper let:item</slot>
    {/each}
  </div>

  <!--
    ╭─────
    │ > next (button)
    ╰─────
    -->
  {#if componentLocalState.has("NextButtonShow")}
    <div
      id="tagScrollNext"
      class="
        tagScrollButton
        "
      on:click={() => {
        scrollData(-1);
        return;
      }}
    >
      <ArrowRight />
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
  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  .tags-box {
    /* 🎨 style */
    overflow: hidden;
    position: relative;

    div#tags-box-scroll {
      /* 🎨 style */
      overflow-x: scroll;
      overflow-y: hidden;
      display: flex;
      gap: 10px;
      /* Hide scrollbar for IE, Edge and Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      &::-webkit-scrollbar {
        /* Hide scrollbar for Chrome, Safari and Opera */
        display: none;
      }
    }

    div.tagScrollButton {
      /* 🎨 style */
      position: absolute;
      display: flex;
      align-items: center;
      height: 100%;
      width: 50px;
      z-index: 5;
      bottom: 0;
      top: 0;
      margin: auto;
      cursor: pointer;

      &#tagScrollPrev {
        /* 🎨 style */
        justify-content: start;
        left: -1px;
        padding-left: -5px;
        background: linear-gradient(
          90deg,
         var(--gradient-color-light) 25.69%,
          var(--gradient-color-medium) 70%,
          var(--gradient-color-dark) 100%
        );

        :global(svg) {
          position: absolute;
          left: 5px;
        }
      }

      &#tagScrollNext {
        /* 🎨 style */
        right: -1px;
        justify-content: end;
        padding-right: 5px;
        background: linear-gradient(
          90deg,
          var(--gradient-color-light) 25.69%,
          var(--gradient-color-medium) 70%,
          var(--gradient-color-dark) 100%
        );
      }

      // img {
      //   /* 🎨 style */
      //   position: absolute;
      //   z-index: 5;
      //   bottom: 0;
      //   top: 0;
      //   margin: auto;
      // }
    }
  }
</style>
