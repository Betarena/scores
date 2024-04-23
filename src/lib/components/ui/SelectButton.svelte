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

  import ArrowDown from "./assets/arrow-down.svelte";
import arrowDown from "./assets/arrow-down.svelte"

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

/**
 * @description
 *  📣 Component interface.
 */
  interface IOption {id: string | number, label: string}
;

export let
  /**
   * @description
   *  in case if you want to use this controll in forms
   */
  name = "",
  /**
   * @description
   *  controls dropdown visability
   */
  modal = false,
  /**
   * @description
   *  options for select button
   */
  options: IOption[] = [],
   /**
   * @description
   *  initial value for select button
   */
  value: string | number = "";

  $: currentOption = options.find(o => o.id === value);
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

 function select (option: IOption) {
    value = option.id;
    modal = false;
 }

// #endregion ➤ 🛠️ METHODS

</script>

<svelte:window  on:click={() => modal = false}/>

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


<select hidden {name} bind:value>
  {#each options as item}
    <option value={item.id}></option>
  {/each}
</select>

<div class="select-wrapper">
  <button class="select-button" on:click|stopPropagation={() => modal = !modal} >

    <slot currentValue={currentOption}>{currentOption?.label}</slot>
    <ArrowDown />

  </button>
  <div class="select-dropdown" class:show={modal}>
    <div class="select-dropdown-list">
      {#each options as option (option.id)}
        <div on:click={() => select(option)} class="list-item" class:active={option.id === currentOption?.id}>{option.label}</div>
      {/each}
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

  .select {
    &-wrapper {

      color: var(--colors-brand-color-white, #FFF);
      position: relative;


      .select-button {
        color: var(--colors-brand-color-white, #FFF);
        font-family: Roboto;
        font-size: 16px;
        display: flex;
        gap: 8px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 100% */
        background: transparent !important;
      }
    }

    &-dropdown {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      min-width: 200px;
      width: fit-content;
      border-radius: 4px;
      background: var(--colors-gray1, #313131);
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.24);
      z-index: 1;
      max-height: 300px;
      overflow-y: auto;
      cursor: default;
      display: none;
      flex-direction: column;

      &.show {
        display: flex;
      }

      &-list {
        display: flex;
        flex-direction: column;
        padding: 8px 0px;

        .list-item {
          padding: 11px 12px;
          cursor: pointer;

          &:hover, &.active {
            background: var(--colors-gray2, #4B4B4B);
          }
        }
      }
    }
  }



</style>