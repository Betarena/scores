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
│ Scores Platform Header Navigation Button Component (Child)                       │
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
  import { page } from "$app/stores";

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

  import sessionStore from "$lib/store/session.js";
  import { cleanUrl } from "$lib/utils/string.js";

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
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true],
    /**
     * @description
     *  📣 navigation target default key name
     */
    navKey: string[],
    /**
     * @description
     *  📣 navigation target `url`
     */
    navUrl: string,
    /**
     * @description
     *  📣 **translation** of target `navigation` text
     */
    navTxt: string,
    /**
     * @description
     *  📣 **translation** of target `soon` text
     */
    soonTxt: string = "soon",
    /**
     * @description
     *  📣 **translation** of target `new` text
     */
    newTxt: string = "new",
    /**
     * @description
     *  📣 wether target navigation is `BETA` and/or coming soon
     */
    isSoon: boolean = false,
    /**
     * @description
     *  📣 wether target navigation is `NEW`
     */
    isNew: boolean = false,
    /**
     * @description
     * TODO: DOC:
     */
    disableAnchor: boolean = false;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME = "<section-scope>⮕<type|w|c>⮕<unique-tag-name>⮕main";
  $: ({ currentPageRouteId } = { ...$sessionStore });

  // #endregion ➤ 📌 VARIABLES

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

  $: if_R_0 =
    (navKey[0] == "scores" && !currentPageRouteId) ||
    (navKey[0] == "competitions" && currentPageRouteId == "CompetitionPage");

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
  id={navKey[0]}
  class="
  nav-box
  cursor-pointer
  "
  class:active={navKey.some((nav) => $page.route.id?.startsWith(nav))}
  class:disable-anchor={disableAnchor}
>
  <a
    href={navKey[0] == "content" ? navUrl : cleanUrl(navUrl)}
    target={navKey[0] == "content" ? "_blank" : "_self"}
  >
    <span
      class="
      s-14
      w-500
      uppercase
      no-wrap
      "
    >
      {navTxt}

      <!--
      ╭─────
      │ > 'soon' text info
      ╰─────
      -->
      {#if isSoon}
        <span
          class="
          color-white
          s-12
          m-l-10
          pill
          lowercase
          "
        >
          {soonTxt}
        </span>
      {/if}

      <!--
      ╭─────
      │ > 'new' text info
      ╰─────
      -->
      {#if isNew}
        <span
          class="
          color-white
          s-12
          m-l-10
          lowercase
          pill
          new
          "
        >
          {newTxt}
        </span>
      {/if}
    </span>
  </a>
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
  div.nav-box {
    /* 📌 position */
    position: relative;
    color: var(--grey);

    &.active {
      /* 🎨 style */
      color: var(--primary);
    }
    &:hover {
      /* 🎨 style */
      color: var(--text-color);
    }
  }
  :global([nav-dragged="true"]) {
    div.nav-box:hover {
      color: var(--grey) !important;
    }
  }

  .pill {
    /* 🎨 style */
    height: 24px;
    padding: 3px 8px;
    background-color: var(--dark-theme-1);
    border-radius: 20px;

    &.new {
      /* 🎨 style */
      background-color: var(--primary);
    }
  }
</style>
