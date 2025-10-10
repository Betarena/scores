<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import VisaIcon from './../../../ui/assets/VisaIcon.svelte';
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

  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { depositStore } from "./deposit-store";

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
  export let buttonDisabled;
  const buttons = [
    { label: "$9.99", value: 9.99 },
    { label: "$19.99", value: 19.99 },
    { label: "$49.99", value: 49.99 },
    { label: "Custom", value: "" },
  ];

  let inputNode: HTMLInputElement;
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

  $: buttonDisabled = !$depositStore.amount;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

  function click(button: { label: string; value: string | number }) {
    $depositStore.amount = button.value;
    if (button.label === "Custom") {
      inputNode.focus();
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

<div class="deposit-amount-wrapper">
  <div class="header">
    <div class="title">Add Funds</div>
  </div>
  <Input
    label="Choose the amount to add"
    bind:node={inputNode}
    bind:value={$depositStore.amount}
    required={true}
  >
    <span slot="leading-text">$</span>
    <span slot="extra">USD</span>
  </Input>
  <div class="buttons-grid">
    {#each buttons as button}
      <div class="button-wrapper">
        <Button
          type="secondary"
          on:click={() => click(button)}
          full={true}
          size="md"
        >
          {button.label}
        </Button>
      </div>
    {/each}
  </div>
  {#if $depositStore.rate}
    <div class="rate">
      ≈ {$depositStore.rate * (Number($depositStore.amount) || 0)} BTA @ ${(
        1 / $depositStore.rate
      ).toFixed(4)}/BTA : Live rate from Uniswap
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
  .deposit-amount-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-lg, 12px);
    align-self: stretch;
    width: 100%;

    .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      align-self: stretch;

      .title {
        color: var(--colors-text-text-primary-900, #fff);

        /* Text xl/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-xl, 20px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-xl, 30px); /* 150% */
      }
    }
    :global(.leading-text) {
      padding-right: 0 !important;
      transform: translateY(1px);
    }
    :global(.input-input input) {
      padding-left: var(--spacing-md, 8px) !important;
    }
    .buttons-grid {
      display: grid;
      width: 100%;
      gap: var(--spacing-lg, 12px);
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 46px;
    }
    .rate {
      width: 100%;
      text-align: center;
      color: var(--colors-text-text-tertiary-600, #8c8c8c);
      text-align: center;

      /* Text xs/Regular */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-xs, 12px);
      font-style: normal;
      font-weight: 400;
      line-height: var(--line-height-text-xs, 18px); /* 150% */
    }
  }
</style>
