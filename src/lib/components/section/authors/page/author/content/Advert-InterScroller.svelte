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
│ Betarena Ad-Engine Component - Interscroller                                     │
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

  import { onMount } from 'svelte';

  // import { betarenaEndpoint } from './constants/instance.js';
  // import { storeAdmin } from './store/admin.js';
  // import { postMod } from './utils/fetch.js';

  import type { AdsCreativeMain } from '@betarena/scores-lib/types/_AUTO-HASURA_.js';

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

  export let
    /**
     * @description
     * 📝
     */
    listStrInsertAfter: [number, string] | undefined = [-1, 'p'],
    /**
     * @augments AdsCreativeMain
     */
    objectAdverData: AdsCreativeMain | undefined= {},
    /**
     * @description
     * 📝
     */
    instanceNode: Element
  ;

  let
    /**
     * @description
     * 📝
     */
    instanceAdvertInterscroller: HTMLDivElement
  ;

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
   *  @ivanzob
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Inject Advert data
   * @return { void }
   */
  function injectBetarenaInterscrollerAd
  (
  ): void
  {
    if (!instanceNode) return;

    const
      // ╭─────
      // │ NOTE: |:| Destructuring listStrInsertAfter
      // ╰─────
      [
        count,
        n
      ] = listStrInsertAfter ?? [-1, 'p'],
      /**
       * @description
       * 📝
       */
      insertAfterNodes
        = instanceNode.querySelectorAll(n)
    ;

    if (!insertAfterNodes.length)
      return;
    ;

    let
      /**
       * @description
       */
      afterNode
    ;

    if (count >= 0)
      afterNode = insertAfterNodes[count];
    else if (count === -1)
      if (insertAfterNodes.length > 2)
        afterNode
          = insertAfterNodes
            [
              Math.floor
              (
                Math.random() * (insertAfterNodes.length - 2)
              ) + 1
            ]
        ;
      else
        afterNode = insertAfterNodes[0];
    ;

    if (!afterNode) return;

    const
      /**
       * @description
       * 📝
       */
      pos
        = instanceNode.getBoundingClientRect()
    ;

    instanceAdvertInterscroller.style.display = 'flex';
    instanceAdvertInterscroller.style.left = `${-pos.left}px`;

    afterNode.insertAdjacentElement
    (
      'afterend',
      instanceAdvertInterscroller
    );

    setTimeout
    (
      () =>
      {
        window.addEventListener('scroll', handleScroll);
        return;
      },
      1000
    );

    return;
  }

  /**
   * @author
   *  @ivanzob
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Handle Scroll Listener
   * @returns { void }
   */
  function handleScroll
  (
  ): void
  {
    if (!instanceAdvertInterscroller) return;

    if (instanceAdvertInterscroller.getBoundingClientRect().bottom < 0)
    {
      instanceAdvertInterscroller.style.display = 'none';
      window.removeEventListener
      (
        'scroll',
        handleScroll
      );
    }

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

  onMount
  (
    () =>
    {
      injectBetarenaInterscrollerAd();

      // storeAdmin.updateData
      // (
      //   [
      //     ['numberOfAdvertsActive', null]
      //   ]
      // );

      return;
    }
  );

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

<div
  id="inter-outer"
  bind:this={instanceAdvertInterscroller}
  class="interscroller-wrapper"
  style=
  "
  display: none;
  height: 100vh;
  right: 0px;
  width: 100vw;
  "
>
  <h2 class="info-box">
    Advertisement
  </h2>

  <div
    id="intscdiv"
    class="interscroller-bg-wrapper"
    style="height: 100%; right: 0px;  clip-path: inset(0 0 0 0); width: 100vw;"
  >
    <div
      id="nxtads"
      class=
      "
      interscroller-bg
      "
      style=
      "
      height: 100%;
      width: 100%;
      padding: 0px;
      overflow: hidden;
      text-align: center;
      "
    >
      <div
        style=
        "
        margin: 0px auto;
        width: 100%;
        height: 100%;
        "
      >
        <a
          target="_blank"
          on:click=
          {
            () =>
            {
              // postMod
              // (
              //   `${betarenaEndpoint}/ad/update/click`,
              //   {
              //     creativeId: objectAdverData.id
              //   }
              // );
            }
          }
          href={objectAdverData?.data?.cta_link}
        >
          <img
            alt="ad_image"
            class="ad_image"
            src={objectAdverData?.data?.media ||"https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/Betarena_Media%2Fads%2F0x1510ea733e1e81f9bcfcc4eabb5a2226d1a9f9ea18da9aea119ba28b8ed6be81%2FBRBet365ADInterscroller.png?alt=media&token=4b1ef015-2643-4834-9081-f2c763531a21"}
            width="100%"
            height="100%"
          />
        </a>
      </div>
    </div>
  </div>

  <h2 class="info-box">
    Scroll to continue
  </h2>
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

  .info-box
  {
    color: var(--colors-text-text-primary-900, #fbfbfb);
    text-align: center;
    font-family: Roboto;
    font-size: 12px !important;
    font-style: normal;
    font-weight: 700 !important;
    line-height: 38px !important; /* 190% */
    text-transform: uppercase;
    width: 100%;
    margin: 0 !important;
    z-index: 1;
    background: var(--colors-background-bg-secondary, #313131);
  }

  .interscroller-wrapper
  {
    position: relative !important;
    cursor: pointer !important;
    background: #ffffff !important;
    z-index: 10000000 !important;
    flex-direction: column;
    justify-content: space-between;
  }

  .interscroller-bg-wrapper
  {
    position: absolute !important;
    width: 100% !important;
    left: 0 !important;
  }

  .interscroller-bg
  {
    will-change: transform, clip-path;
    position: fixed !important;
    height: 100% !important;
    top: 0;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    border: 0 !important;
  }

  .ad_image
  {
    width: 100% !important;
    height: 100% !important;
    max-width: 100vw !important;
    max-height: 100% !important;
    touch-action: manipulation;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media (min-width: 768px)
  {
    .info-box
    {
      font-size: 20px !important;
    }
  }

</style>