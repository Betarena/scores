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
  import { page } from "$app/stores";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import VisaIcon from "$lib/components/ui/assets/VisaIcon.svelte";
  import RadioGroupItem from "$lib/components/ui/RadioGroupItem.svelte";

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

  let checked = true;
  $: buttonDisabled = !checked;
  $: if (!checked) {
    checked = true;
  }
  $: ({ deposit_translations = {} } = $page.data);

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

<div class="deposit-options-wrapper">
  <div class="header">
    <div class="title">
      <TranslationText
        fallback="Add Funds to Your Spending Wallet"
        text={deposit_translations.add_funds_to_spending_wallet}
      />
    </div>
    <div class="description">
      <TranslationText
        fallback="Choose how you want to buy BTA"
        text={deposit_translations.choose_how}
      />
    </div>
  </div>
  <div class="options">
    <RadioGroupItem bind:selected={checked}>
      <div slot="icon"><VisaIcon /></div>
      <div slot="content" class="option-content">
        <div class="option-title">
          <TranslationText
            fallback="Credit Card (Revolut)"
            text={deposit_translations.credit_card_revolut}
          />
        </div>
        <div class="option-description">
          <TranslationText
            fallback="Instant purchase with Visa/Master"
            text={deposit_translations.instant_purchase_visa_master}
          />
        </div>
      </div>
    </RadioGroupItem>
    <!-- <RadioGroupItem disabled={true}>
      <div slot="icon"><BitcoinCardIcon /></div>
      <div slot="content" class="option-content">
        <div class="option-title">Crypto Transfer</div>
        <div class="option-description">Send USDT, USDC, or POL</div>
      </div>
    </RadioGroupItem> -->
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
  .deposit-options-wrapper {
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

      .description {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);

        /* Text md/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
    .options {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;
      width: 100%;

      :global(.radio-group-item) {
        max-width: 100%;
      }
      .option-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;

        .option-title {
          color: var(--colors-text-text-secondary-700, #fbfbfb);

          /* Text sm/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }

        .option-description {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }
  }
</style>
