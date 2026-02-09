<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
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

  import ArrowDown from "./assets/chevron-down.svelte";

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
  interface IOption {
    id: string | number;
    label: string;
    [key: string]: any;
  }
  export let /**
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
    value: string | number = "",
    className = "",
    dropdownClass= ""
    ;
  const dispatch = createEventDispatcher();
  $: currentOption = options.find((o) => o.id === value);
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

  function select(option: IOption) {
    value = option.id;
    dispatch("change", option);
    modal = false;

  }

  // #endregion ➤ 🛠️ METHODS
</script>

<svelte:window on:click={() => (modal = false)} />

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
    <option value={item.id} />
  {/each}
</select>

<div class="select-wrapper {className}" {...$$restProps}>
  <button
    class="select-button"
    on:click|stopPropagation={() => (modal = !modal)}
  >
    <slot currentValue={currentOption}><span>{currentOption?.label}</span></slot>
    <span class="arrow-image" class:opend={modal}>
      <ArrowDown />
    </span>
  </button>
  <div class="select-dropdown {dropdownClass}" class:show={modal}>
    <div class="select-dropdown-list">
      {#each options as option (option.id)}
        <div
          on:click={() => select(option)}
          class="list-item"
          class:active={option.id === currentOption?.id}
        >
          {option.label}
        </div>
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
      color: var(--text-color);
      position: relative;

      .select-button {
        color: var(--text-color);
        font-family: Roboto;
        display: flex;
        padding: 0;
        font-size: var(--text-button-size);
        gap: 8px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 100% */
        background: transparent !important;

        .arrow-image {
          transition: transform;
          transition-duration: 0.7s;
          width: fit-content;
          height: fit-content;
          display: flex;
          align-items: center;
          transform: rotate(0deg);
          &.opend {
            transform: rotate(-180deg);
          }
          path {
            stroke: var(--text-color);
          }
        }
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
      background: var(--bg-color-second);
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

          &:hover,
          &.active {
            background: var(--bg-hover-color);
          }
        }
      }
    }
  }
</style>
