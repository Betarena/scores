<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { createEventDispatcher, tick } from "svelte";

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
  interface IOption {
    id?: string | number;
    label: string;
    [key: string]: any;
  }
  export let required: boolean = false;
  export let inputType = "text";
  export let error = false;
  export let placeholder = "";
  export let value: IOption | undefined | null = undefined;
  export let name = "";
  export let label = "";
  export let textKey = "label";
  export let options: IOption[] = [];
  export let checkIcon = true;
  export let infoText = "";
  export let onInputValidation:
    | ((val: string | number) => boolean)
    | undefined = undefined;
  export let onChangeValidation:
    | ((val: string | number) => boolean)
    | undefined = undefined;
  export let searchable: boolean = false;
  export let searchPlaceholder: string = "Search...";
  export let size: "md" | "sm" = "md"

  const dispatch = createEventDispatcher<{ change: IOption }>();

  let modal = false;
  let focus = false;
  let dropDownNode;
  let top = false;
  let searchInput: HTMLInputElement;
  let searchTerm = "";

  $: filteredOptions =
    searchable && searchTerm
      ? options.filter((option) =>
          option[textKey].toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

  $: if (modal && dropDownNode) {
    tick().then(() => {
      adjustDropdownPosition();
    });
  }
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
    value = option;
    dispatch("change", value);
    searchTerm = "";
    hide();
  }

  function hide() {
    modal = false;
    focus = false;
    top = false;
    searchTerm = "";
  }

  function show() {
    modal = true;
    focus = true;
    top = false;
    if (searchable && searchInput) {
      tick().then(() => {
        searchInput.focus();
      });
    }
  }

  function adjustDropdownPosition() {
    const dropdownRect = dropDownNode.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height || window.innerHeight;

    if (dropdownRect.bottom > viewportHeight) {
      top = true;
    } else {
      top = false;
    }
  }

  // #endregion ➤ 🛠️ METHODS
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
<svelte:window on:click={hide} on:resize={adjustDropdownPosition} />
<div class="field dropdown-input {$$restProps.class} {size}">
  <select {name} style="display: none;" bind:value>
    {#each options as option}
      <option value={option}>{option.label}</option>
    {/each}
  </select>
  {#if $$slots.label || required || label}
    <label class="label" for={name}>
      <span class="label-text">
        <slot name="label">{label}</slot>
      </span>
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  <div class="input-wrapper {size}">
    <div
      class="input-element"
      class:focus
      class:error
      on:mousedown|preventDefault
      on:click|stopPropagation={() => {
        if (modal) {
          hide();
        } else {
          show();
        }
      }}
    >
      {#if $$slots.icon}
        <div class="icon">
          <slot name="icon"><!-- optional fallback --></slot>
        </div>
      {/if}
      <div class="text">
        {#if value}
          {#if $$slots["input-option"]}
            <slot name="input-option" option={value}>{value[textKey]}</slot>
          {:else}
            <slot name="option" option={value}>{value[textKey]}</slot>
          {/if}
        {:else}
          <span class="placeholder">
            <slot name="placeholder">{placeholder}</slot>
          </span>
        {/if}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        class="chevrone-icon"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="var(--colors-foreground-fg-quaternary-500)"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div
      class="select-dropdown"
      class:show={modal}
      bind:this={dropDownNode}
      class:top
    >
      <div class="inner-wrapper">
        {#if searchable}
          <div class="search-wrapper">
            <input
              bind:this={searchInput}
              bind:value={searchTerm}
              type="text"
              class="search-input"
              placeholder={searchPlaceholder}
              on:click|stopPropagation
              on:keydown={(e) => {
                if (e.key === "Escape") {
                  hide();
                } else if (
                  e.key === "ArrowDown" &&
                  filteredOptions.length > 0
                ) {
                  e.preventDefault();
                  // Focus on first option or implement keyboard navigation
                } else if (e.key === "Enter" && filteredOptions.length === 1) {
                  e.preventDefault();
                  select(filteredOptions[0]);
                }
              }}
            />
          </div>
        {/if}
        {#if filteredOptions.length === 0 && searchTerm}
          <div class="no-results">
            <span>No results</span>
          </div>
        {/if}
        <div class="list-wrapper">
          {#each filteredOptions as option (option.id)}
            <div class="list-item-wrapper">
              <div
                on:mousedown|preventDefault
                on:click={() => select(option)}
                class="list-item"
                class:active={option.id === value?.id}
              >
                {#if !$$slots["option-list-item"]}
                  <slot name="option" {option}>
                    {option[textKey]}

                    {#if checkIcon && option.id === value?.id}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="var( --colors-foreground-fg-brand-primary)"
                          stroke-width="1.66"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    {/if}
                  </slot>
                {:else}
                  <slot name="option-list-item" {option}>
                    {option[textKey]}
                  </slot>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
  {#if $$slots.error || $$slots.info || infoText}
    <div class="field-info">
      {#if error}
        <span class="error">
          <slot name="error" />
        </span>
      {:else}
        <span class="info">
          <slot name="info">{infoText}</slot>
        </span>
      {/if}
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
  .field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm, 6px);
    align-self: stretch;
    .label {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-xxs, 2px);

      .label-text {
        color: var(--colors-text-text-secondary-700, #fbfbfb);

        /* Text sm/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      .required {
        color: var(--colors-brand-5);
        /* Text sm/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
    }

    .input-wrapper {
      display: flex;
      align-items: flex-start;
      align-self: stretch;
      height: 44px;
      cursor: pointer;
      position: relative;
      background: var(--colors-background-bg-primary, #fff);
      /* Shadows/shadow-xs */
      box-shadow: 0px 1px 2px 0px
        var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
      .icon {
        margin-right: var(--spacing-md, 8px);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .chevrone-icon {
        flex-shrink: 0;
      }
      .text {
        flex-grow: 1;
      }
      .input-element {
        display: flex;
        padding: 10px 14px;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-md, 8px);
        flex: 1 0 0;
        align-self: stretch;
        border-radius: var(--radius-md, 8px);
        border: 1px solid var(--colors-border-border-primary, #6a6a6a);
        color: var(--colors-text-text-primary-900, #fbfbfb);

        text-overflow: ellipsis;
        /* Text md/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 16px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-md, 24px); /* 150% */

        &.focus {
          border: 1px solid var(--colors-border-border-brand, #f5620f);
        }
        &.error {
          border: 1px solid var(--colors-border-border-error_subtle, #f97066);
        }
      }

      .leading-text {
        max-height: 100%;
        display: flex;
        padding: 10px var(--spacing-lg, 12px) 10px 14px;
        align-items: center;
        border: 1px solid var(--colors-border-border-primary, #6a6a6a);
        border-radius: var(--spacing-md, 8px);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
        user-select: none;
        color: var(--colors-foreground-fg-tertiary);

        /* Text md/Regular */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-md, 16px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--Line-height-text-md, 24px); /* 150% */
      }

      &.sm {
        height: 40px;
      }
    }

    .field-info {
      .info {
        color: var(--colors-text-text-tertiary, #8c8c8c);

        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }

      .error {
        color: var(--colors-text-text-error-primary, #f97066);

        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
    }

    .select-dropdown {
      position: absolute;
      top: calc(100% + var(--spacing-xs, 4px));
      left: 50%;
      transform: translateX(-50%);
      min-width: 100%;
      width: 100%;
      width: fit-content;
      border-radius: var(--radius-md);
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.24);
      z-index: 1;
      max-height: 300px;
      overflow-y: auto;
      cursor: default;

      display: none;
      padding: var(--spacing-xs, 4px) var(--spacing-none, 0px);
      // background: var(--colors-background-bg-active);
      background: var(--colors-background-bg-primary, #fff);
      border: 1px solid var(--colors-border-border-primary, #6a6a6a);

      flex-direction: column;
      align-items: flex-start;
      align-self: stretch;

      .inner-wrapper {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: fit-content;
        width: 100%;

        .search-wrapper {
          padding: var(--spacing-sm, 6px);
          border-bottom: 1px solid var(--colors-border-border-primary, #6a6a6a);
          margin-bottom: var(--spacing-xs, 4px);

          .search-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--colors-border-border-primary, #6a6a6a);
            border-radius: var(--radius-sm, 6px);
            background: var(--colors-background-bg-primary, #fff);
            color: var(--colors-text-text-primary-900, #fbfbfb);
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: 16px;
            font-weight: 400;
            line-height: var(--line-height-text-sm, 20px);
            outline: none;

            &:focus {
              border-color: var(--colors-border-border-brand, #f5620f);
            }

            &::placeholder {
              color: var(--colors-text-text-tertiary, #8c8c8c);
            }
          }
        }

        .no-results {
          padding: 12px 16px;
          text-align: center;
          color: var(--colors-text-text-tertiary, #8c8c8c);
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: italic;
          line-height: var(--line-height-text-sm, 20px);
        }
        .list-wrapper {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          width: fit-content;
          width: 100%;
          overflow-y: auto;
          min-height: 0;
        }
      }

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: inherit;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--colors-background-bg-quaternary);
        border-radius: 4px;
      }

      &.show {
        display: flex;
      }
      .list-item-wrapper {
        display: flex;
        padding: 1px var(--spacing-sm, 6px);
        align-items: center;
        align-self: stretch;
        justify-content: space-between;

        color: var(--colors-text-text-secondary_hover, #ededed);

        /* Text sm/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */

        .list-item {
          cursor: pointer;
          display: flex;
          padding: 9px 10px;
          align-items: center;
          justify-content: space-between;
          flex: 1 0 0;

          &:hover,
          &.active {
            border-radius: var(--radius-sm, 6px);
            color: var(--colors-text-text-secondary_hover, #ededed);
            background-color: red;
            background: var(--colors-background-bg-primary_hover, #3b3b3b);
          }
        }
      }

      &.top {
        top: calc(-1 * var(--spacing-xs, 4px));
        transform: translate(-50%, -100%);
      }
    }
  }
</style>
