<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import TweenedNumber from './../../../ui/metrics/TweenedNumber.svelte';
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

  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import MetricItem4 from "$lib/components/ui/metrics/MetricItem4.svelte";
  import TweenedNumber from "$lib/components/ui/metrics/TweenedNumber.svelte";
  import Progress from "$lib/components/ui/Progress.svelte";
  import session from "$lib/store/session";

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

  let selectedWallet = "spending";
  $: ({ viewportType } = $session);
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

<div id="dashboard-wallets" class={viewportType}>
  <div class="title">
    <TranslationText fallback="Wallets" text="Wallets" />
  </div>
  <div class="wallets">
    <div
      class="wallet"
      class:selected={selectedWallet === "primary"}
      on:click={() => {
        selectedWallet = "primary";
      }}
    >
      <MetricItem4 text="Primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          slot="icon"
        >
          <path
            d="M5 9.00002V17M9.5 9.00002V17M14.5 9.00002V17M19 9.00002V17M3 18.6L3 19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7952 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7952 20.7951 20.6422 20.891 20.454C21 20.2401 21 19.9601 21 19.4V18.6C21 18.04 21 17.7599 20.891 17.546C20.7951 17.3579 20.6422 17.2049 20.454 17.109C20.2401 17 19.9601 17 19.4 17H4.6C4.03995 17 3.75992 17 3.54601 17.109C3.35785 17.2049 3.20487 17.3579 3.10899 17.546C3 17.7599 3 18.04 3 18.6ZM11.6529 3.07715L4.25291 4.7216C3.80585 4.82094 3.58232 4.87062 3.41546 4.99082C3.26829 5.09685 3.15273 5.24092 3.08115 5.40759C3 5.59654 3 5.82553 3 6.28349L3 7.40002C3 7.96007 3 8.2401 3.10899 8.45401C3.20487 8.64217 3.35785 8.79515 3.54601 8.89103C3.75992 9.00002 4.03995 9.00002 4.6 9.00002H19.4C19.9601 9.00002 20.2401 9.00002 20.454 8.89103C20.6422 8.79515 20.7951 8.64217 20.891 8.45401C21 8.2401 21 7.96007 21 7.40002V6.2835C21 5.82553 21 5.59655 20.9188 5.40759C20.8473 5.24092 20.7317 5.09685 20.5845 4.99082C20.4177 4.87062 20.1942 4.82094 19.7471 4.7216L12.3471 3.07715C12.2176 3.04837 12.1528 3.03398 12.0874 3.02824C12.0292 3.02314 11.9708 3.02314 11.9126 3.02824C11.8472 3.03398 11.7824 3.04837 11.6529 3.07715Z"
            stroke="var(--colors-gray-dark-mode-300, #D2D2D2)"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="balance" slot="number">
          <span class="amount">23 BTA</span>
          <div class="usd">$12</div>
        </div>
      </MetricItem4>
    </div>
    <div
      class="wallet"
      class:selected={selectedWallet === "spending"}
      on:click={() => {
        selectedWallet = "spending";
      }}
    >
      <MetricItem4 text="Spending">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          slot="icon"
        >
          <path
            d="M16.5 14H16.51M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9C21 7.89543 20.1046 7 19 7L5 7C3.89543 7 3 6.10457 3 5ZM3 5C3 3.89543 3.89543 3 5 3H17M17 14C17 14.2761 16.7761 14.5 16.5 14.5C16.2239 14.5 16 14.2761 16 14C16 13.7239 16.2239 13.5 16.5 13.5C16.7761 13.5 17 13.7239 17 14Z"
            stroke="var(--colors-gray-dark-mode-300, #D2D2D2)"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="balance" slot="number">
          <span class="amount">23 BTA</span>
          <div class="usd">$12</div>
        </div>
      </MetricItem4>
    </div>
    <div
      class="wallet rewards"
      class:selected={selectedWallet === "rewards"}
      on:click={() => {
        selectedWallet = "rewards";
      }}
    >
      <MetricItem4 text="Rewards">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          slot="icon"
        >
          <path
            d="M11 5V21M11 5H7.46429C6.94332 5 6.4437 4.78929 6.07533 4.41421C5.70695 4.03914 5.5 3.53043 5.5 3C5.5 2.46957 5.70695 1.96086 6.07533 1.58579C6.4437 1.21071 6.94332 1 7.46429 1C10.2143 1 11 5 11 5ZM11 5H14.5357C15.0567 5 15.5563 4.78929 15.9247 4.41421C16.293 4.03914 16.5 3.53043 16.5 3C16.5 2.46957 16.293 1.96086 15.9247 1.58579C15.5563 1.21071 15.0567 1 14.5357 1C11.7857 1 11 5 11 5ZM19 10V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21L6.2 21C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V10M1 6.6L1 8.4C1 8.96005 1 9.24008 1.10899 9.45399C1.20487 9.64215 1.35785 9.79513 1.54601 9.89101C1.75992 10 2.03995 10 2.6 10L19.4 10C19.9601 10 20.2401 10 20.454 9.89101C20.6422 9.79513 20.7951 9.64215 20.891 9.45399C21 9.24008 21 8.96005 21 8.4V6.6C21 6.03995 21 5.75992 20.891 5.54601C20.7951 5.35785 20.6422 5.20487 20.454 5.10899C20.2401 5 19.9601 5 19.4 5L2.6 5C2.03995 5 1.75992 5 1.54601 5.10899C1.35785 5.20487 1.20487 5.35785 1.10899 5.54601C1 5.75992 1 6.03995 1 6.6Z"
            stroke="var(--colors-gray-dark-mode-300, #D2D2D2)"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="balance" slot="number">
          <span class="amount"><TweenedNumber number={23} /> BTA</span>
          {#if viewportType === "mobile"}
            <div class="usd">$<TweenedNumber number={12} /></div>
          {/if}
        </div>
      </MetricItem4>
      <div class="progress-wrapper">
        <div class="progress-text">
          {#if viewportType === "mobile"}
            <div class="text"><TweenedNumber number={23} /> BTA</div>
            <div class="supporting-text">$50/$500</div>
          {/if}
        </div>
        <Progress value={45} />
        {#if viewportType !== "mobile"}
          <div class="supporting-text">$50/$500</div>
        {/if}
      </div>
      {#if viewportType === "mobile"}
        <Button full={true} type="primary" disabled={true}>Withdraw</Button>
      {/if}
    </div>
  </div>
  {#if viewportType !== "mobile"}
    <Button full={true} type="primary" disabled={true}>Withdraw</Button>
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
  #dashboard-wallets {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex-shrink: 0;

    .title {
      color: var(--colors-text-text-secondary-700, #fbfbfb);

      /* Text lg/Semibold */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-lg, 18px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--line-height-text-lg, 28px); /* 155.556% */
    }

    .wallets {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      align-self: stretch;
      .wallet {
        background: var(--colors-background-bg-primary, #fff);
        width: 100%;
        box-sizing: border-box;
        padding: var(--spacing-2xl, 20px) var(--spacing-xl, 16px);
        border: 1px solid var(--colors-border-border-secondary, #3b3b3b);

        border-radius: var(--radius-xl, 12px);
        box-shadow: 0 1px 2px 0
          var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));

        &.selected {
          border: 1px solid var(--colors-border-border-brand, #f7813f);
        }

        :global(.metric-4) {
          border: none;
          padding: 0;
          box-shadow: none;
        }
      }


      :global(.metric-4 .text-wrapper) {
        gap: 0;
      }
      :global(.change-wrapper) {
        transform: translateY(-9px);
      }

      .balance {
        display: flex;
        align-items: baseline;
        gap: 5px;

        color: var(--colors-text-text-primary-900, #fff);

        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */

        .usd {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text xs/Bold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-xs, 12px);
          font-style: normal;
          font-weight: 700;
          line-height: var(--line-height-text-xs, 18px);
        }
      }
      .rewards {
        border: 1px solid var(--colors-border-border-secondary, #3b3b3b);

        border-radius: var(--radius-xl, 12px);
        box-shadow: 0 1px 2px 0
          var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));

        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl, 16px);

        &.selected {
          border: 1px solid var(--colors-border-border-brand, #f7813f);
        }

        :global(.metric-4) {
          border: none;
          padding: 0;
          box-shadow: none;
        }

        .progress-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          align-self: stretch;

          .progress-text {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            align-self: stretch;

            .text {
              flex: 1 0 0;
              color: var(--colors-text-text-primary-900, #fff);

              /* Text sm/Medium */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 500;
              line-height: var(--line-height-text-sm, 20px); /* 142.857% */
            }
          }
          .supporting-text {
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

    &:not(.mobile) {
      .title {
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-lg, 18px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-lg, 28px); /* 155.556% */
      }
      .wallets {
        flex-direction: row;
        align-items: stretch;
        gap: 12px;
        max-width: 100%;

        .wallet {
          height: 100%;
          width: auto;
          flex: 1 1 0;
          min-width: 0;
        }
        :global(.metric-4) {
          flex-direction: column;
          height: 100%;
          max-width: 100%;
          position: relative;
          gap: 12px;
        }
        .amount {
          font-size: var(--font-size-display-xs, 24px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-display-xs, 32px); /* 133.333% */
        }
        .usd {
          /* Text sm/Bold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 700;
          line-height: var(--line-height-text-sm, 20px);
        }
        :global(.metric-4 .change-wrapper) {
          position: absolute;
          top: var(--spacing-2xl, 20px);
          right: var(--spacing-2xl, 20px);
          transform: translateY(5%);
        }
        :global(.rewards .metric-4 .change-wrapper) {
          position: absolute;
          top: 0;
          right: 0;
          transform: translateY(5%);
        }
      }
    }
  }
</style>
