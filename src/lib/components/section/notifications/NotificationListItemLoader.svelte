<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import LoaderAvatar from "$lib/components/ui/loaders/LoaderAvatar.svelte";
  import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";

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

  // #endregion ➤ 📦 Package Imports
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

<div class="notification">
  <div class="img">
    <LoaderAvatar size={49} />
  </div>
  <div class="content">
    <div class="text">
      <LoaderLine width="70%" height={10} />
    </div>
    <div class="title">
      <LoaderLine width="50%" height={15} />
    </div>
    <div class="time-ago">
      <LoaderLine width="20%" height={5} />
    </div>
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
  .notification {
    display: flex;
    align-items: start;
    height: 80px;
    justify-content: flex-start;
    gap: var(--spacing-xl);

    .content {
      flex-grow: 1;

      .text {
        color: var(--text-text-secondary, #e6e6e6);
        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px);
      }

      .title,
      .amount {
        color: var(--colors-brand-5);

        /* Text sm/Semibold */
        font-family: var(--font-family-font-family-display);
        font-size: var(--font-size-text-sm);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-sm);
      }

      .time-ago {
        color: var(--text-text-tertiary, #9d9d9d);
        font-size: 10px;
        font-style: normal;
        margin-top: 4px;
        font-weight: 400;
        line-height: 14px;
      }
    }
    .new-icon {
      width: 10px;
      height: 10px;
      background-color: var(--colors-brand-5);
      border-radius: 50%;
    }
  }
</style>
