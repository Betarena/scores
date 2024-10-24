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

  import LoaderBadge from "$lib/components/ui/loaders/LoaderBadge.svelte";
  import LoaderImage from "$lib/components/ui/loaders/LoaderImage.svelte";
  import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";
  import session from "$lib/store/session.js";

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

  const imgSize = {
    desktop: "104px",
    tablet: "128px",
    mobile: "74px",
  };
  const borderRadius = {
    desktop: "12px",
    tablet: "12px",
    mobile: "6px",
  };
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

<div class="publication-card {$session.viewportType}"  id="publication-card-loader">
  <LoaderImage
    clazz="img"
    borderRadius={borderRadius[$session.viewportType || "mobile"]}
    height={imgSize[$session.viewportType || "mobile"]}
    width={imgSize[$session.viewportType || "mobile"]}
  />
  <div class="info">
    <LoaderBadge width={52} height={24} />
    <LoaderLine />
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
  :global(.dark-mode #publication-card-loader:not(.mobile)) {
    border: 1px solid #3b3b3b;
  }
  .publication-card {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1 0 0;
    width: 100%;

    &:hover {
      background: var(--colors-background-bg-secondary, #1f1f1f);
      cursor: pointer;
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xs, 4px);
      align-self: stretch;
    }

    &.tablet,
    &.desktop {
      border-radius: var(--radius-xl, 12px);
      width: 100%;
      border: 1px solid #e6e6e6;
      height: 104px;
      .img {
        width: 128px;
        height: 128px;
        //  transform: translate(-1px, -1px);
      }
      .info {
        flex-direction: column-reverse;
        justify-content: center;

      }
    }

    &.desktop {
      .img {
        width: 104px;
        height: 104px;
      }
      .info {
        gap: var(--spacing-md, 8px);
        justify-content: start;
        padding-top: 12px;

      }
    }
  }
</style>
