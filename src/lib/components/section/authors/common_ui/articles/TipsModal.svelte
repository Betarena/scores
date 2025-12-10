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

  import Button from "$lib/components/ui/Button.svelte";
  import FeaturedIcon from "$lib/components/ui/FeaturedIcon.svelte";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";
  import session from "$lib/store/session";
  import { cubicIn, cubicOut } from "svelte/easing";
  import { fly, scale } from "svelte/transition";
  import bta_icon from "$lib/components/ui/assets/bta_icon.png";
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import userSettings from "$lib/store/user-settings.js";
  import type { IPageAuthorAuthorData } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { onMount } from "svelte";
  import { getRates } from "$lib/utils/web3.js";
  import {
    type DotLottie,
    DotLottieSvelte,
  } from "@lottiefiles/dotlottie-svelte";
  import { modalStore } from "$lib/store/modal.js";
  import { walletStore } from "$lib/store/wallets.js";
  import { showDepositModal } from "$lib/components/page/profile/deposit/showDeposit.js";
  import { infoMessages } from "$lib/components/ui/infomessages/infomessages.js";
  import { page } from "$app/stores";
  import type { TranslationAwardsDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import { gotoSW } from "$lib/utils/sveltekitWrapper.js";
  import AlertCircle from "$lib/components/ui/assets/alert-circle.svelte";
  import Trophy from "$lib/components/ui/assets/trophy.svelte";
  import type { IFirebaseFunctionArticleAccessCheck } from "@betarena/scores-lib/types/firebase/functions.js";
  import { BetarenaUserHelper } from "$lib/firebase/common.js";
  import { invalidate } from "$app/navigation";
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
  export let sportstack = {} as IPageAuthorAuthorData;
  export let type: "tip" | "unlock" = "tip";
  export let article_id: number = 0;
  export let article_access =
    {} as IFirebaseFunctionArticleAccessCheck["response"]["success"]["data"];
  export let grantAccess = () => {};
  let dotLottie: DotLottie;

  $: ({ awards_translations } = $page.data as {
    awards_translations: TranslationAwardsDataJSONSchema;
  });
  $: ({ viewportType } = $session);
  $: ({ scores_user_data, firebase_user_data } = $userSettings.user || {});
  $: user = scores_user_data;
  $: insufficientAmount = user && $walletStore.spending.available < 1;
  $: isRewards = type === "tip";
  $: ({
    amountBta = 0,
    amountUsd = 0,
    split = { author: 0, userCashback: 0 },
  } = article_access.reward || {} as {
    amountBta: number;
    amountUsd: number;
    split: { author: number; userCashback: number };
  });

  let loading = false;
  let step: "info" | "confirm" = "info";
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

  function chooseTransition(node, { easing, out = false }) {
    if (viewportType === "mobile" || type === "unlock") {
      return fly(node, { y: 600, duration: out ? 500 : 300, easing });
    }
    return scale(node, { duration: out ? 200 : 400, easing });
  }

  function convertToUsd(amount: number) {
    return (amount * $session.btaUsdRate).toFixed(2);
  }

  async function confirm() {
    if (!user) {
      gotoSW("/login");
      return;
    }
    if (!isRewards && step === "info") {
      return (step = "confirm");
    }
    loading = true;
    const response = await BetarenaUserHelper.pingArticleUnlockCreate({
      query: {},
      body: {
        strUid: firebase_user_data?.uid ?? "",
        intArticleId: article_id,
      },
    });

    if (response?.success) {

      await invalidate("app:author-article-page");
      if (dotLottie) dotLottie.play();
      infoMessages.add({
        type: "awards",
        title:
          awards_translations.notification_title?.replace(
            "{amount}",
            amountBta.toFixed(2)
          ) || "You shared 1 BTA!",
        text:
          awards_translations.notification_text?.replaceAll(
            "{amount}",
            `+${(amountBta / 2).toFixed(2)} BTA`
          ) || "+0.5 BTA to your Rewards / +0.5 BTA to the author",
      });
      setTimeout(() => {
        $modalStore.show = false;
        if (!isRewards) {
          grantAccess();
        }
      }, 700);
    } else {
      loading = false;
      infoMessages.add({
        type: "error",
        title:
          awards_translations.notification_error_title ||
          "Error while sharing BTA",
      });
    }
  }

  function cancel() {
    if (isRewards) {
      $modalStore.show = false;
      return;
    }
    step = "info";
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
    step = "info";
    getRates(session);
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

<div
  class="tips-modal-wrapper {viewportType} {type}"
  in:chooseTransition={{ easing: cubicOut }}
  out:chooseTransition={{ easing: cubicIn, out: true }}
>
  <div class="tips-body">
    <div class="header">
      <div class="icon-wrapper">
        <FeaturedIcon color="brand" type="gradient" size="lg">
          {#if insufficientAmount}
            <AlertCircle />
          {:else if !isRewards}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M14.1666 8.33333V6.66667C14.1666 4.36548 12.3012 2.5 9.99998 2.5C7.69879 2.5 5.83331 4.36548 5.83331 6.66667V8.33333M9.99998 12.0833V13.75M7.33331 17.5H12.6666C14.0668 17.5 14.7668 17.5 15.3016 17.2275C15.772 16.9878 16.1545 16.6054 16.3942 16.135C16.6666 15.6002 16.6666 14.9001 16.6666 13.5V12.3333C16.6666 10.9332 16.6666 10.2331 16.3942 9.69836C16.1545 9.22795 15.772 8.8455 15.3016 8.60582C14.7668 8.33333 14.0668 8.33333 12.6666 8.33333H7.33331C5.93318 8.33333 5.23312 8.33333 4.69834 8.60582C4.22793 8.8455 3.84548 9.22795 3.6058 9.69836C3.33331 10.2331 3.33331 10.9332 3.33331 12.3333V13.5C3.33331 14.9001 3.33331 15.6002 3.6058 16.135C3.84548 16.6054 4.22793 16.9878 4.69834 17.2275C5.23312 17.5 5.93318 17.5 7.33331 17.5Z"
                stroke="currentColor"
                stroke-width="1.336"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {:else}
            <Trophy />
          {/if}
        </FeaturedIcon>
      </div>
      <div class="text-wrapper">
        <div class="title">
          {#if insufficientAmount}
            <TranslationText
              text={awards_translations.insufficient}
              fallback="Insufficient Balance"
            />
          {:else if isRewards}
            <TranslationText
              text={awards_translations.share}
              fallback={"Give an Award"}
            />
          {:else if step === "info"}
            <TranslationText
              text={awards_translations.rewards_gated}
              fallback={"This article is reward-gated"}
            />
            <span class="title-support">
              <TranslationText
                text={awards_translations.share_to_continue.replace(
                  "{amount}",
                  amountBta.toFixed(2)
                )}
                fallback={"To continue reading, share 1 BTA as a reward to the creator."}
              />
            </span>
          {:else if step === "confirm"}
            <TranslationText
              text={awards_translations.confirm_reward}
              fallback={"Confirm your Reward"}
            />
            <span class="title-support">
              <TranslationText
                text={awards_translations.you_about_sharing.replace(
                  "{amount}",
                  amountBta.toFixed(2)
                )}
                fallback={"You're about to share 1 BTA to unlock this article."}
              />
            </span>
          {/if}
        </div>
        {#if insufficientAmount}
          <div class="warning-text">
            <div class="warning-main">
              <TranslationText
                text={awards_translations.insufficient_main_text?.replace(
                  "{amount}",
                  amountBta.toFixed(2)
                )}
                fallback="You need at least 1 BTA in your Balance wallet to award this post."
              />
            </div>
            <div class="warning-support">
              <TranslationText
                text={awards_translations.insufficient_support_text}
                fallback="You always receive half of the award back to your Rewards wallet."
              />
            </div>
          </div>
        {:else}
          <div class="awards-flow">
            <div class="sportstack-wrapper award-item">
              <div class="avatar-wrapper">
                <SportstackAvatar size="lg" src={sportstack.data?.avatar} />
                <div class="connector-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2"
                    height="67"
                    viewBox="0 0 2 67"
                    fill="none"
                  >
                    <path
                      d="M1 1L1 65.0115"
                      stroke="#525252"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-dasharray="0.1 6"
                    />
                  </svg>
                </div>
              </div>
              <div class="award-content">
                <div class="award-candidate">
                  <div class="name">{sportstack.data?.username}</div>
                  <div class="type">
                    <TranslationText
                      text={awards_translations.sportstack}
                      fallback="Sportstack"
                    />
                  </div>
                </div>
                <div class="amount">
                  <div class="bta-icon">
                    <img src={bta_icon} alt="BTA Icon" width="40" height="40" />
                  </div>
                  <div class="description">
                    <div class="numbers">
                      {split.author.toFixed(2)} BTA
                      {#if $session.btaUsdRate}
                        <span class="usd">{convertToUsd(split.author)}$</span>
                      {/if}
                    </div>
                    <div class="text-secondary">
                      <TranslationText
                        text={awards_translations.goes_to_the_publication}
                        fallback="goes to the publication"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="award-item">
              <Avatar size="lg" src={user?.profile_photo} />
              <div class="award-content">
                <div class="award-candidate">
                  <div class="name">
                    {#if user}
                      {user?.name}
                    {:else}
                      <TranslationText
                        text={awards_translations.betarena_user}
                        fallback="Betarena User"
                      />
                    {/if}
                  </div>
                  <div class="type">
                    {#if user}
                      @{user?.username}
                    {:else}
                      @<TranslationText
                        text={awards_translations.user.toLocaleLowerCase()}
                        fallback="user"
                      />
                    {/if}
                  </div>
                </div>
                <div class="amount">
                  <div class="bta-icon">
                    <img src={bta_icon} alt="BTA Icon" width="40" height="40" />
                  </div>
                  <div class="description">
                    <div class="numbers">
                      {split.userCashback.toFixed(2)} BTA
                      {#if $session.btaUsdRate}
                        <span class="usd"
                          >{convertToUsd(split.userCashback)}$</span
                        >
                      {/if}
                    </div>
                    <div class="text-secondary">
                      <TranslationText
                        text={awards_translations.returns_to_wallet}
                        fallback="returns to your Rewards wallet"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
    <div class="footer">
      {#if insufficientAmount}
        <div class="insufficient-buttons">
          <Button full={true} on:click={showDepositModal}>
            <TranslationText
              text={awards_translations.buy_bta}
              fallback="Buy BTA"
            />
          </Button>
        </div>
      {:else}
        <div class="confetti">
          <DotLottieSvelte
            dotLottieRefCallback={(ref) => (dotLottie = ref)}
            src="/assets/lottie/Confetti.lottie"
          />
        </div>
        {#if loading}
          <Button type="primary" full={true} size="lg" {loading}>
            <TranslationText
              text={awards_translations.processing}
              fallback="Processing"
            />
          </Button>
        {:else if isRewards}
          <Button type="primary" full={true} size="lg" on:click={confirm}>
            <TranslationText
              text={awards_translations.share_bta?.replace("{amount}", "1")}
              fallback="Share 1BTA"
            />

            {#if $session.btaUsdRate}
              <span class="button-usd">({convertToUsd(1)}$)</span>
            {/if}
          </Button>
        {:else}
          <Button
            type="primary"
            full={true}
            size="lg"
            {loading}
            on:click={confirm}
          >
            {#if step === "info"}
              <TranslationText
                text={awards_translations.share_bta?.replace(
                  "{amount}",
                  amountBta.toFixed(2)
                )}
                fallback="Share 1BTA"
              />

              {#if $session.btaUsdRate}
                <span class="button-usd">({amountUsd.toFixed(2)}$)</span>
              {/if}
              <TranslationText
                text={awards_translations.to_unlock}
                fallback="to Unlock"
              />
            {:else}
              <TranslationText
                text={awards_translations.confirm_and_unlock}
                fallback="Confirm & Unlock"
              />
            {/if}
          </Button>

          {#if step === "info"}
            <div class="footer-info-text">
              <TranslationText
                text={awards_translations.rewards_distribution
                  .replace("{author_amount}", split.author.toFixed(2))
                  .replace("{user_amount}", split.userCashback.toFixed(2))}
                fallback="50/50 split — 0.5 BTA to the author, 0.5 BTA back to your Rewards wallet."
              />
            </div>
          {/if}
        {/if}
        {#if isRewards || step === "confirm"}
          <Button type="secondary" full={true} size="lg" on:click={cancel}
            ><TranslationText
              text={awards_translations.cancel}
              fallback="Cancel"
            /></Button
          >
        {/if}
      {/if}
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
  .tips-modal-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    width: 375px;
    max-width: 400px;
    flex-direction: column;
    align-items: center;

    border-radius: var(--radius-2xl, 16px);
    background: var(--colors-background-bg-secondary_alt, #1f1f1f);

    /* Shadows/shadow-xl */
    box-shadow: 0 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
      0 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0)),
      0 3px 3px -1.5px var(--colors-effects-shadows-shadow-xl_03, rgba(255, 255, 255, 0));

    .tips-body {
      width: 100%;
      height: 100%;
    }

    .header {
      display: flex;
      padding: var(--spacing-3xl, 24px) var(--spacing-3xl, 24px) 0
        var(--spacing-3xl, 24px);
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xl, 16px);
      align-self: stretch;

      .text-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xl, 16px);
        align-self: stretch;

        .title {
          color: var(--colors-text-text-primary-900, #fff);
          text-align: center;

          /* Text xl/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-xl, 20px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-xl, 30px); /* 150% */

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm, 6px);
          align-self: stretch;

          .title-support {
            color: var(--colors-text-text-secondary-700, #fbfbfb);

            /* Text sm/Regular */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--line-height-text-sm, 20px); /* 142.857% */
            white-space: nowrap;
          }
        }

        .awards-flow {
          width: 100%;
          color: var(--colors-text-text-secondary-700, #fbfbfb) !important;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-none, 0);

          .award-item {
            display: flex;
            width: 100%;
            padding: 0 var(--spacing-xl, 16px);
            align-items: flex-start;
            gap: var(--spacing-lg, 12px);

            .avatar-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              min-height: 0;

              .connector-wrapper {
                flex-grow: 1;
                width: 100%;
                flex-shrink: 0;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1px;

                transform: translateY(5px);
              }
            }

            .award-content {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: var(--spacing-lg, 12px);
              flex: 1 0 0;

              .award-candidate {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                align-self: stretch;

                .name {
                  color: var(--colors-text-text-secondary-700, #fbfbfb);

                  /* Text sm/Medium */
                  font-family: var(--font-family-font-family-body, Roboto);
                  font-size: var(--font-size-text-sm, 14px);
                  font-style: normal;
                  font-weight: 500;
                  line-height: var(--line-height-text-sm, 20px); /* 142.857% */
                }
                .type {
                  color: var(--colors-text-text-tertiary-600, #8c8c8c);

                  /* Text sm/Regular */
                  font-family: var(--font-family-font-family-body, Roboto);
                  font-size: var(--font-size-text-sm, 14px);
                  font-style: normal;
                  font-weight: 400;
                  line-height: var(--line-height-text-sm, 20px); /* 142.857% */
                }
              }
              .amount {
                display: flex;
                align-items: flex-start;
                gap: var(--spacing-lg, 12px);
                align-self: stretch;

                .bta-icon {
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  img {
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                    flex-shrink: 0;
                  }
                }

                .description {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  flex: 1 0 0;
                  align-self: stretch;

                  .numbers {
                    color: var(--colors-text-text-secondary-700, #fbfbfb);

                    /* Text sm/Medium */
                    font-family: var(--font-family-font-family-body, Roboto);
                    font-size: var(--font-size-text-sm, 14px);
                    font-style: normal;
                    font-weight: 500;
                    line-height: var(
                      --line-height-text-sm,
                      20px
                    ); /* 142.857% */

                    .usd {
                      color: var(--colors-text-text-tertiary-600, #8c8c8c);

                      /* Text xs/Semibold */
                      font-family: var(--font-family-font-family-body, Roboto);
                      font-size: var(--font-size-text-xs, 12px);
                      font-style: normal;
                      font-weight: 600;
                      line-height: var(--line-height-text-xs, 18px);
                    }
                  }
                  .text-secondary {
                    color: var(--colors-text-text-tertiary-600, #8c8c8c);

                    /* Text sm/Regular */
                    font-family: var(--font-family-font-family-body, Roboto);
                    font-size: var(--font-size-text-sm, 14px);
                    font-style: normal;
                    font-weight: 400;
                    line-height: var(
                      --line-height-text-sm,
                      20px
                    ); /* 142.857% */
                  }
                }
              }
            }
            &.sportstack-wrapper .award-content {
              padding-bottom: var(--spacing-4xl, 32px);
            }
          }
          p {
            color: var(--colors-text-text-secondary-700, #fbfbfb) !important;
          }
        }

        .warning-text {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg, 12px);

          p {
            margin: 0;
          }
          .warning-main {
            color: var(--colors-text-text-secondary-700, #fbfbfb);
            overflow: visible;
            white-space: nowrap;

            /* Text sm/Regular */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          }
          .warning-support {
            overflow: visible;
            white-space: nowrap;
            color: var(--colors-text-text-tertiary-600, #8c8c8c);

            /* Text sm/Regular */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--line-height-text-sm, 20px);
          }
        }
      }
    }
    .footer {
      display: flex;
      padding: var(--spacing-3xl, 24px);
      align-items: center;
      flex-direction: column;
      align-items: start;
      justify-content: space-between;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;
      position: relative;

      .checkbox-wrapp {
        flex-shrink: 0;
      }

      .confetti {
        width: 100%;

        position: absolute;
        transform: translate(-5%, -45%) scale(1.5);
        pointer-events: none;
      }

      .button-usd {
        color: var(--colors-Text-text-white, #fff);

        /* Text xs/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-xs, 12px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-xs, 18px);
      }

      .insufficient-buttons {
        width: 100%;
        display: flex;
        gap: var(--spacing-lg, 12px);
      }

      .footer-info-text {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);
        align-self: center;
        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        white-space: nowrap;
      }
    }

    &.mobile {
      bottom: 0;
      top: unset;
      transform: none;
      left: 0;
      width: 100%;
      max-width: 100%;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      .header {
        padding: var(--spacing-2xl, 20px) var(--spacing-xl, 16px) 0
          var(--spacing-xl, 16px);

        .text-wrapper {
          .title {
            white-space: initial !important;

            .title-support {
              white-space: initial;
              text-align: start;
            }
          }
          .warning-text {
            .warning-main {
              color: var(--colors-text-text-secondary-700, #fbfbfb);
              white-space: normal;

              /* Text sm/Regular */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 400;
              line-height: var(--line-height-text-sm, 20px); /* 142.857% */
            }
            .warning-support {
              color: var(--colors-text-text-tertiary-600, #8c8c8c);
              white-space: normal;
              /* Text sm/Regular */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 400;
              line-height: var(--line-height-text-sm, 20px);
            }
          }
        }
      }
      .footer {
        padding: var(--spacing-xl, 16px);
        padding-top: var(--spacing-3xl, 24px);
        flex-direction: column;
        align-items: start;

        .insufficient-buttons {
          flex-direction: column-reverse;
        }
        .footer-info-text {
          align-self: flex-start;
          white-space: initial;
        }
      }
      padding-bottom: var(--spacing-3xl, 24px);
    }
    &.unlock {
      border-radius: var(--radius-none);
      left: 0;
      width: 100vw;
      max-width: 100%;
      background: var(--colors-background-bg-secondary_alt, #1f1f1f);

      /* Shadows/shadow-xl */
      box-shadow: 0 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
        0 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0)),
        0 3px 3px -1.5px var(--colors-effects-shadows-shadow-xl_03, rgba(255, 255, 255, 0));
      top: unset;
      bottom: 0;
      display: flex;
      justify-content: center;
      transform: unset;

      .tips-body {
        width: 375px;
        // max-width: 400px;

        .header {
          .text-wrapper {
            gap: var(--spacing-3xl, 24px);

            .title {
              white-space: nowrap;
            }
          }
        }
      }

      &.mobile {
        max-width: 100%;
        width: 100%;
        .tips-body {
          width: 100%;
        }
      }
    }
  }
</style>
