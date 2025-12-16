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

  import { page } from "$app/stores";
  import { get } from "$lib/api/utils";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import bta_icon from "$lib/components/ui/assets/bta_icon.png";
  import Trophy from "$lib/components/ui/assets/trophy.svelte";
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import FeaturedIcon from "$lib/components/ui/FeaturedIcon.svelte";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";
  import session from "$lib/store/session";
  import userSettings from "$lib/store/user-settings.js";
  import { gotoSW } from "$lib/utils/sveltekitWrapper.js";
  import { getRates } from "$lib/utils/web3.js";
  import type { IFirebaseFunctionArticleAccessCheck } from "@betarena/scores-lib/types/firebase/functions.js";
  import type { TranslationAwardsDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import type { BtaRewardTiersMain } from "@betarena/scores-lib/types/v8/_HASURA-1_.js";
  import type { IPageAuthorAuthorData } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { onMount } from "svelte";
  import { cubicIn, cubicOut } from "svelte/easing";
  import { fly, scale } from "svelte/transition";
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
  export let article_access =
    {} as IFirebaseFunctionArticleAccessCheck["response"]["success"]["data"];
  export let tier_id: number = 0;

  let award_tier_info: null | BtaRewardTiersMain = null;
  $: ({ awards_translations } = $page.data as {
    awards_translations: TranslationAwardsDataJSONSchema;
  });
  $: ({ viewportType } = $session);
  $: ({ scores_user_data } = $userSettings.user || {});
  $: user = scores_user_data;

  $: ({ usd_value: amountUsd = 0 } = award_tier_info || { usd_value: 0 });
  $: amountBta = (amountUsd || 0) / $session.btaUsdRate;

  let loading = false;
  let step: "info" | "confirm" = "info";
  // #endregion ➤ 📌 VARIABLES
  $: if (tier_id && !award_tier_info) {
    getRewardsTier(tier_id);
  }
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
    gotoSW("/login");
    return;
  }

  async function getRewardsTier(tier_id: number) {
    const res = await get<{ rewards_tiers: BtaRewardTiersMain[] }>(
      `/api/data/rewards_tiers?id=${tier_id}`
    );
    if (res) {
      const { rewards_tiers } = res;
      award_tier_info = rewards_tiers[0];
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
          <Trophy />
        </FeaturedIcon>
      </div>
      <div class="text-wrapper">
        <div class="title">
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
        </div>

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
                    {(amountBta / 2).toFixed(2)} BTA
                    {#if $session.btaUsdRate}
                      <span class="usd">{(amountUsd / 2).toFixed(2)}$</span>
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
                  <TranslationText
                    text={awards_translations.betarena_user}
                    fallback="Betarena User"
                  />
                </div>
                <div class="type">
                  @<TranslationText
                    text={awards_translations.user.toLocaleLowerCase()}
                    fallback="user"
                  />
                </div>
              </div>
              <div class="amount">
                <div class="bta-icon">
                  <img src={bta_icon} alt="BTA Icon" width="40" height="40" />
                </div>
                <div class="description">
                  <div class="numbers">
                     {( amountBta / 2 ).toFixed(2)} BTA
                    {#if $session.btaUsdRate}
                      <span class="usd"
                        >{(amountUsd / 2).toFixed(2)}$</span
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
      </div>
    </div>
    <div class="footer">
      <Button type="primary" full={true} size="lg" {loading} on:click={confirm}>
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
      </Button>

      <div class="footer-info-text">
        <TranslationText
          text={awards_translations.rewards_distribution
            .replace("{amount}", (amountBta / 2).toFixed(2))
            .replace("{amount}", (amountBta / 2).toFixed(2))}
          fallback="50/50 split — 0.5 BTA to the author, 0.5 BTA back to your Rewards wallet."
        />
      </div>
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
