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
│ Scores Authors Article Placeholder                                               │
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
  import LoaderAvatar from '$lib/components/ui/loaders/LoaderAvatar.svelte';
  import LoaderBadge from '$lib/components/ui/loaders/LoaderBadge.svelte';
  import LoaderImage from '$lib/components/ui/loaders/LoaderImage.svelte';
  import LoaderLine from '$lib/components/ui/loaders/LoaderLine.svelte';
  import sessionStore from '$lib/store/session.js';
  import { viewportChangeV2 } from '$lib/utils/device';


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

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'author⮕w⮕tags-loader⮕main'
  ;

  let
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
    */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
    */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  $: ({ windowWidth } = $sessionStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    );
  ;

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
  id="{CNAME}"
>

  <div class="content-box">
     <!--
  ╭─────
  │ > top title loader
  ╰─────
  -->
    <div
      class=
      "
      title-box
      "
    >
    {#if VIEWPORT_TABLET_INIT[1]}
      {#each [240, 279, 107] as width}
        <LoaderLine {width} height={26} />
      {/each}
    {:else}
      {#each [347, 240] as width}
        <LoaderLine {width} height={26} />
      {/each}
    {/if}
    </div>

    <!--
    ╭─────
    │ > article author box loader 💻 TABLET + 🖥️ LAPTOP
    ╰─────
    -->
      <div class="author-box"  class:author-box-center={VIEWPORT_TABLET_INIT[1]}>
        <LoaderAvatar size={34}  />
        <div class="author-box-text">
          <LoaderLine height={15} width={121}/>
          {#if !VIEWPORT_TABLET_INIT[1]}
            <LoaderLine height={15} width={57}/>
          {/if}
        </div>
      </div>


    <!--
    ╭─────
    │ > badge loader
    ╰─────
    -->
    <div
      class="badge-box"
    >
      {#each [68, 60, 59] as width}
        <LoaderBadge {width} />
      {/each}
    </div>
  </div>

  <!--
  ╭─────
  │ > article preveiw loader
  ╰─────
  -->
  <div class="preview-box">
    <LoaderImage width={VIEWPORT_TABLET_INIT[1] ? 332 : 375} height={200}/>
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

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#author⮕w⮕tags-loader⮕main
  {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 100%;
    overflow: hidden;

    .preview-box {
      height: 200px;
      flex-shrink: 0;
    }

    .content-box {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .title-box {
        display: flex;
        gap: 5px;
        flex-direction: column;
      }

      .author-box {
        display: flex;
        gap: 12px;

        &-center {
          align-items: center;
        }
        &-text{
          display: flex;
          flex-direction: column;
          gap: 5px;

        }
      }
      .badge-box {
        display: flex;
        gap: 4px;
      }
    }


  }


</style>
