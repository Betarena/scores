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

    import Button from "$lib/components/ui/Button.svelte";
    import SelectButton from "$lib/components/ui/SelectButton.svelte";

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

export let tag: {name: string, folowers: number, description: string, count: number};
export let mobile = false;

const
  /**
   * @description
   *  📣 `this` component **main** `id` and `data-testid` prefix.
   */ // eslint-disable-next-line no-unused-vars
  CNAME: string = '<author⮕w⮕tags-content⮕header';

 const options = [
   {id: "all", label: "All"},
  {id: "en", label: "English"},
  {id: "es", label: "Espanõl"},
  {id: "pt", label: "Português"},
  {id: "pt-pt", label: "Português-PT"},
]

// #endregion ➤ 📌 VARIABLES


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

<div class="tags-header-wrapper" class:mobile>
  <div class="header-buttons">
    <div class="tag-info-wrapper">
      <h1>{tag.name}</h1>
      <div class="tag-info">
        <span>{tag.folowers || 0} followers</span>
        <div class="tag-info-splitter"></div>
        <span>{tag.count || 0} articles</span>
      </div>
    </div>
    <div class="action-buttons">
      {#if !mobile}
        <SelectButton value="all" {options} let:currentValue> Language: {currentValue?.label} </SelectButton>
      {/if}

      <Button>
        + Follow
      </Button>
    </div>
  </div>
  <div class="header-description">
       {#if tag.description}
      <span>{tag.description}</span>
      {/if}
      <span>ssafsadafasdf</span>
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
  .tags-header-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--colors-gray4, #CCC);;

    &.mobile {
      padding: 0 24px;
    }

    .header-buttons {
      width: 100%;
      display: flex;
      justify-content: space-between;
      display: flex;
      align-items: center;
      align-self: stretch;

      .tag-info-wrapper {
        display: flex;
        flex-direction: column;

        h1 {
          color: var(--white, #FFF);
          font-family: Inter;
          font-size: 38px;
          margin: 0;
          font-style: normal;
          font-weight: 600;
          line-height: 54px; /* 142.105% */
        }

        .tag-info {
          display: flex;
          gap: 5px;
          align-items: center;
          color: var(--colors-gray4, #CCC);
          font-family: Roboto;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px; /* 150% */

          &-splitter {
            width: 2px;
            height: 2px;
            background-color: var(--colors-gray4, #CCC);
            border-radius: 100%;
          }
        }
      }

      .action-buttons {
        display: flex;
        gap: 24px;
        align-items: center;
      }
    }

    .header-description {
      display: flex;
      flex-direction: column;
      gap: 6px
    }
  }
</style>