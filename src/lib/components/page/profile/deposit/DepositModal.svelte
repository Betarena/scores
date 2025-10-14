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

  import ArrowLeftIcon from "$lib/components/ui/assets/ArrowLeftIcon.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Progress from "$lib/components/ui/Progress.svelte";
  import { BetarenaUserHelper } from "$lib/firebase/common";
  import { subscribeRevolutTransactionListen } from "$lib/graphql/graphql.common";
  import { modalStore } from "$lib/store/modal";
  import session from "$lib/store/session";
  import userSettings from "$lib/store/user-settings";
  import { onMount } from "svelte";
  import { depositStore } from "./deposit-store";
  import DepositAmount from "./DepositAmount.svelte";
  import DepositConfirmation from "./DepositConfirmation.svelte";
  import DepositFailed from "./DepositFailed.svelte";
  import DepositOptions from "./DepositOptions.svelte";
  import DepositRevolut from "./DepositRevolut.svelte";
  import DepositSuccess from "./DepositSuccess.svelte";

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

  const steps = [
    {
      id: "options",
      component: DepositOptions,
      buttonText: "Continue",
      buttonSupportText: "Funds will be added after confirmation.",
    },
    {
      id: "amount",
      component: DepositAmount,
      buttonText: "Continue",
      buttonSupportText: "Funds appear after confirmation",
    },
    {
      id: "proceed",
      component: DepositRevolut,
      buttonText: "Proceed to Payment",
      buttonSupportText: "Redirecting to Revolut secure checkout",
    },
    {
      id: "confirmation",
      component: DepositConfirmation,
      buttonText: "Go to Dashboard",
      buttonSupportText: "",
    },
    {
      id: "success",
      component: DepositSuccess,
      buttonText: "Go to Dashboard",
      buttonSupportText: "",
    },
  ];
  let unsubscribe: (() => void) | null = null;
  let buttonDisabled = false;

  $: ({ user } = $userSettings);
  $: ({ viewportType } = $session);
  $: lastStep = currentStep === steps.length - 1;
  $: progress = ((currentStep + 1) / steps.length) * 100;
  $: ({ rate, amount, revolut, status } = $depositStore);
  $: failed = ["failed", "declined"].includes(status || "");
  let currentStep = $depositStore.revolut.checkoutUrl
    ? steps.findIndex((step) => step.id === "confirmation")
    : 0;
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
  $: if (["completed", "approved", "captured"].includes(status || "")) {
    const successStep = steps.findIndex((step) => step.id === "success");
    currentStep = successStep;
  }

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

  async function handleContinueClick() {
    if (lastStep) {
      $modalStore.show = false;
      return;
    }
    const stepId = steps[currentStep].id;
    if (stepId === "proceed") {
      if (!amount || !user?.firebase_user_data) {
        currentStep -= 1;
        return;
      }
      if (revolut.checkoutUrl) {
        window.open(revolut.checkoutUrl, "_blank");
        return;
      }
      let popup: Window | null = null;
      try {
        popup = window.open("", "_blank");
      } catch (e) {
        popup = null;
      }
      const { uid, email } = user.firebase_user_data;
      currentStep = currentStep + 1;
      const res = await BetarenaUserHelper.getRevolutCheckoutUrl({
        query: {},
        body: {
          intFiatAmount: Number(amount),
          intFiatCurrency: "USD",
          strUid: uid,
          email: email || undefined,
        },
      });
      if (res?.success) {
        const orderId = (res.success.data as any).orderId;
        const checkoutUrl = res.success.data.checkoutUrl;
        $depositStore.revolut = {
          orderId,
          checkoutUrl,
        };
        if (popup && !popup.closed) {
          try {
            popup.location.href = checkoutUrl;
          } catch (err) {
            popup = window.open(checkoutUrl, "_blank");
          }
        } else {
          window.open(checkoutUrl, "_blank");
        }
        unsubscribe = subscribeRevolutTransactionListen(
          orderId,
          depositStore
        ).unsubscribe;
      }
      return
    }
    if (stepId === "confirmation" || stepId === "success") {
      $modalStore.show = false;
      return;
    }
    currentStep = currentStep + 1;
  }

  function back() {
    if (!currentStep) {
      $modalStore.show = false;
      return;
    }
    currentStep = currentStep - 1;
  }

  function retry(retryPayment = true) {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    const proceedIndex = steps.findIndex(
      (step) => step.id === (retryPayment ? "proceed" : "options")
    );
    currentStep = proceedIndex;
    $depositStore.status = "";
    $depositStore.revolut = {};
    buttonDisabled = false;
  }

  async function getRates() {
    if (rate) return;
    const res = await BetarenaUserHelper.getBtaTokenPriceQuote({
      query: { strAmount: "1", strCurrency: "USD" },
      body: {},
    });
    if (res?.success) {
      $depositStore.rate = res.success.data.intBtaEstimate;
    }
  }
  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    document.body.classList.add("disable-scroll");
     const
      /**
       * @description
       * 📝 HTLMElement instance of 'Intercom'
       */
      instanceIntercom = document.getElementsByClassName('intercom-lightweight-app')[0] as unknown as HTMLElement
    ;
    const prevIntercomState = instanceIntercom?.style.display;
    if (instanceIntercom)
      instanceIntercom.style.display = 'none';
    ;
    getRates();
    const { orderId } = $depositStore.revolut || {};
    if (orderId && !unsubscribe) {
      unsubscribe = subscribeRevolutTransactionListen(
        orderId,
        depositStore
      ).unsubscribe;
    }

    return () => {
      document.body.classList.remove("disable-scroll");
      instanceIntercom.style.display = prevIntercomState || "unset";
      if (unsubscribe) unsubscribe();
    };
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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
<svelte:body class="disable-scroll" />
<div id="deposit-modal" class={viewportType}>
  {#if !failed}
    <div class="header-wrapper">
      <div class="header">
        {#if !["success", "confirmation"].includes(steps[currentStep].id || "")}
          <div class="icon" on:click={back}>
            <ArrowLeftIcon />
          </div>
        {/if}
        {#if !lastStep}
          <div class="steps">
            Step {currentStep + 1} of {steps.length}
          </div>
        {:else}
          <div class="add-funds">Add Funds</div>
        {/if}
      </div>
      {#if !lastStep}
        <Progress animation={true} value={progress} />
      {/if}
    </div>
  {:else}
    <div class="header-empty" />
  {/if}

  <div class="section-wrapper">
    {#if failed}
      <DepositFailed />
    {:else if steps[currentStep]}
      <svelte:component
        this={steps[currentStep].component}
        bind:buttonDisabled
      />
    {/if}
  </div>
  <div class="footer">
    {#if failed}
      <Button
        type="primary"
        on:click={() => retry(true)}
        destructive={true}
        full={true}>Retry Payment</Button
      >
      <!-- <Button type="secondary" on:click={chooseAnotherMethod} destructive={true} full={true}>Choose Another Method</Button> -->
    {:else}
      <Button
        full={true}
        on:click={handleContinueClick}
        disabled={buttonDisabled}>{steps[currentStep].buttonText}</Button
      >
      {#if steps[currentStep].id === "success"}
        <Button
          full={true}
          type="secondary"
          on:click={() => retry(false)}
          disabled={buttonDisabled}>Add More Funds</Button
        >
      {/if}
      {#if steps[currentStep].buttonSupportText}
        <span class="footer-text">{steps[currentStep].buttonSupportText}</span>
      {/if}
    {/if}
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
  #deposit-modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    width: 100dvw;
    height: 100dvh;
    padding: 0 var(--spacing-xl, 16px) var(--spacing-xl, 16px)
      var(--spacing-xl, 16px);
    padding-bottom: var(--spacing-4xl, 32px);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3xl, 24px);
    flex-shrink: 0;

    background: var(--colors-background-bg-primary, #1f1f1f);
    .header-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .header {
      display: flex;
      padding: 18px 4px;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;

      &-empty {
        height: 60px;
      }

      .icon {
        color: var(--colors-foreground-fg-primary-900);
        cursor: pointer;
      }
      .steps {
        flex-grow: 1;
        color: var(--colors-text-text-tertiary-600, #8c8c8c);
        text-align: center;

        /* Text md/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
      .add-funds {
        color: var(--colors-text-text-primary-900, #fff);
        text-align: center;
        flex-grow: 1;

        /* Text md/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
    .section-wrapper {
      width: 100%;
    }

    .footer {
      width: 100%;
      display: flex;
      padding: 0 0 var(--spacing-none, 0) 0;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      gap: 16px;
      flex: 1 0 0;
      align-self: stretch;

      .footer-text {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);
        text-align: center;

        /* Text sm/Medium */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
      }
    }

    &:not(.mobile) {
      top: 50%;
      left: 50%;
      width: 100%;
      height: 558px;
      max-width: 565px;
      bottom: unset;
      transform: translate(-50%, -50%);
      border-radius: var(--radius-xl, 12px);
      background: var(--colors-background-bg-secondary, #232323);
      padding: 0 var(--spacing-xl, 16px) var(--spacing-xl, 16px)
        var(--spacing-xl, 16px);

      /* Shadows/shadow-xl */
      box-shadow: 0 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
        0 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));
    }
  }
</style>
