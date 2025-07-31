<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { sanitize } from "$lib/utils/purify.js";
  import { createEventDispatcher } from "svelte";

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

  export let required: boolean = false;
  export let inputType: HTMLInputElement["type"] | "textarea" = "text";
  export let error = false;
  export let placeholder = "";
  export let type: "input" | "leading-text" = "input";
  export let value = "";
  export let name = "";
  export let label = "";
  export let height = inputType === "textarea" ? "100px" : "44px";
  export let node: HTMLInputElement | HTMLTextAreaElement | null = null;
  export let onInputValidation:
    | ((val: string | number) => boolean)
    | undefined = undefined;
  export let onChangeValidation:
    | ((val: string | number) => boolean)
    | undefined = undefined;

  const dispatch = createEventDispatcher<
    | { input: HTMLInputElement }
    | { change: HTMLInputElement }
    | { focus: HTMLInputElement }
    | { blur: HTMLInputElement }
    | { keydown: HTMLInputElement }
  >();

  $: focus = false;
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

  function handleEvent(
    e: any,
    type: "input" | "change" | "focus" | "blur" | "keydown"
  ) {
    if (type === "focus") {
      focus = true;
    }
    if (type === "blur") {
      focus = false;
    }
    if (["focus", "blur", "keydown"].includes(type)) {
      return dispatch(type, e);
    }
    value = sanitize(e.currentTarget.value);
    dispatch(type, value);
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
<div class="field">
  {#if $$slots.label || label || required}
    <label class="label" for={name}>
      {#if $$slots.label || label}
        <span class="label-text">
          <slot name="label">{label}</slot>
        </span>
      {/if}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  <div class="input-wrapper" class:focus class:error style="height: {height}">
    {#if type === "leading-text"}
      <div class="leading-text">
        <slot name="leading-text" />
      </div>
    {/if}
    <div
      class="input-element input-{type}"
      style={type === "leading-text" && $$slots["leading-text"]
        ? "border-left: none"
        : ""}
    >
      {#if inputType === "textarea"}
        <textarea
          class=""
          {placeholder}
          bind:value
          {name}
          on:change={(e) => handleEvent(e, "change")}
          on:input={(e) => handleEvent(e, "input")}
        />
      {:else}
        <input
          bind:this={node}
          class=""
          type={inputType}
          {placeholder}
          {value}
          {name}
          on:keydown={(e) => handleEvent(e, "keydown")}
          on:focus={(e) => handleEvent(e, "focus")}
          on:blur={(e) => handleEvent(e, "blur")}
          on:change={(e) => handleEvent(e, "change")}
          on:input={(e) => handleEvent(e, "input")}
        />
      {/if}
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
        color: var(--colors-text-text-secondary-700);

        /* Text sm/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      .required {
        color: var(--colors-text-text-brand-tertiary-600, #d2d2d2);
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

      /* Shadows/shadow-xs */
      box-shadow: 0px 1px 2px 0px
        var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
      border: 1px solid var(--colors-border-border-primary, #6a6a6a);
      border-radius: var(--radius-md, 8px);
      background: var(--colors-background-bg-primary, #fff);
      .input-element {
        display: flex;
        align-items: center;
        gap: var(--spacing-md, 8px);
        flex: 1 0 0;
        align-self: stretch;

        input,
        textarea {
          overflow: hidden;
          color: var(--colors-text-text-primary-900, #fbfbfb);
          text-overflow: ellipsis;
          border: none;
          padding: 0;
          background-color: inherit;
          padding: 10px 14px;
          flex-grow: 1;
          max-height: 100%;
          height: 100%;

          /* Text md/Regular */
          font-family: var(--Font-family-font-family-body, Roboto);
          font-size: var(--Font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--Line-height-text-md, 24px); /* 150% */

          &:-webkit-autofill,
          &:-internal-autofill-selected {
            background-color: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
          }
          &:focus-visible {
            outline: none;
          }
        }

        &.input-textarea {
          height: 100px;
        }
      }

      .leading-text {
        max-height: 100%;
        height: 100%;
        display: flex;
        padding: 10px var(--spacing-lg, 12px) 10px 14px;
        align-items: center;
        // border: 1px solid var(--colors-border-border-primary, #6a6a6a);
        // border-radius: var(--spacing-md, 8px);
        // border-top-right-radius: 0;
        // border-bottom-right-radius: 0;
        // border-right: none;
        user-select: none;
        color: var(--colors-foreground-fg-tertiary-600);

        /* Text md/Regular */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-md, 16px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--Line-height-text-md, 24px); /* 150% */
      }
      &.focus {
        border-color: var(--colors-border-border-brand);
      }
      &.error {
        border: 1px solid var(--colors-border-border-error_subtle, #f97066);
      }
    }

    .field-info {
      .info {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);

        /* Text sm/Regular */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
      }

      .error {
        color: var(--colors-text-text-error-primary-600, #f97066);

        /* Text sm/Regular */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
      }
    }
  }
</style>
