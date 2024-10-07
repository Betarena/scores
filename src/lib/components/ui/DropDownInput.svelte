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
  import ArrowDown from "./assets/arrow-down.svelte";

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
  export let requred: boolean = false;
  export let inputType = "text";
  export let error = false;
  export let placeholder = "";
  export let value: IOption | undefined = undefined;
  export let name = "";
  export let textKey = "label";
  export let options: IOption[] = [];
  export let checkIcon = false;
  export let onInputValidation:
    | ((val: string | number) => boolean)
    | undefined = undefined;
  export let onChangeValidation:
    | ((val: string | number) => boolean)
    | undefined = undefined;

  const dispatch = createEventDispatcher<{ change: IOption }>();

  let modal = false;
  let focus = false;
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
    modal = false;
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
<svelte:window
  on:click={() => {
    modal = false;
    focus = false;
  }}
/>
<div class="field">
  <select {name} style="display: none;" bind:value>
    {#each options as option}
      <option value={option}>{option.label}</option>
    {/each}
  </select>
  {#if $$slots.label || requred}
    <label class="label" for={name}>
      <span class="label-text">
        <slot name="label" />
      </span>
      {#if requred}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  <div class="input-wrapper">
    <div
      class="input-element"
      class:focus
      class:error
      on:click|stopPropagation={() => {
        modal = !modal;
        focus = true;
      }}
    >
      {#if value}
        <slot name="option" option={value}>{value[textKey]}</slot>
      {:else}
        <slot name="placeholder" />
      {/if}
      <span class="arrow-image" class:opend={modal}>
        <ArrowDown color="var(--colors-foreground-fg-quaternary-500)" />
      </span>
    </div>
    <div class="select-dropdown" class:show={modal}>
        {#each options as option (option.id)}
          <div class="list-item-wrapper">
            <div
              on:click={() => select(option)}
              class="list-item"
              class:active={option.id === value?.id}
            >
              <slot name="option">
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
            </div>
          </div>
        {/each}
    </div>
  </div>
  {#if $$slots.error || $$slots.info}
    <div class="field-info">
      {#if error}
        <span class="error">
          <slot name="error" />
        </span>
      {:else}
        <span class="info">
          <slot name="info" />
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
        color: var(--colors-text-text-secondary);

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
      position: relative;
      /* Shadows/shadow-xs */
      box-shadow: 0px 1px 2px 0px
        var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));

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
      background: var(--colors-background-bg-active);

      flex-direction: column;
      align-items: flex-start;
      align-self: stretch;

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
            flex: 1 0 0;

            &:hover,
            &.active {
              border-radius: var(--radius-sm, 6px);
              color: var(--colors-text-text-secondary_hover, #EDEDED);

              background: var(--colors-background-bg-primary_hover, #3b3b3b);
            }
          }
        }

    }
  }
</style>
