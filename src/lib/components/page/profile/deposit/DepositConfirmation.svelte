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
  import StepBase from "$lib/components/ui/StepBase.svelte";
  import { DotLottieSvelte } from "@lottiefiles/dotlottie-svelte";
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

<div class="deposit-confirmation-wrapper">
  <div class="header">
    <div class="animation">
      <DotLottieSvelte src="/assets/lottie/Waiting.lottie" loop autoplay />
    </div>
    <div class="title">Transaction in Progress</div>
  </div>
  <div class="steps-wrapper"> 
    <StepBase includeConnector={true} type="circle" color="success" checked={true} title="Payment Received" available={true}/>
    <StepBase includeConnector={true} type="circle" color="success" checked={true} title="Awaiting Confirmation" available={true}/>
    <StepBase includeConnector={true} type="circle" color="success" checked={false} title="Funds will appear in your wallet soon" available={false}/>
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
  .deposit-confirmation-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-lg, 12px);
    align-self: stretch;
    width: 100%;

    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
      .animation {
        width: 137px;
        height: 137px;
        aspect-ratio: 1/1;
      }

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
    .steps-wrapper {
      display: flex;
      padding-bottom: 16px;
      align-items: flex-start;
      align-content: flex-start;
      gap: 24px var(--spacing-lg, 12px);
      align-self: stretch;
      flex-wrap: wrap;
      width: 100%;
      :global(.step-base) {
       height: 32px;
      }
      
    }
  }
</style>
