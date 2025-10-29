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
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import FeaturedIcon from "$lib/components/ui/FeaturedIcon.svelte";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";
  import session from "$lib/store/session";
  import { cubicIn, cubicOut } from "svelte/easing";
  import { fly, scale } from "svelte/transition";
  import bta_icon from "$lib/components/ui/assets/bta_icon.png"
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import userSettings from "$lib/store/user-settings.js";
  import type { IPageAuthorAuthorData } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { onMount } from "svelte";
  import { getRates } from "$lib/utils/web3.js";
  import { DotLottieSvelte } from "@lottiefiles/dotlottie-svelte";
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
  $: ({ viewportType } = $session);
  $: user = $userSettings.user?.scores_user_data;
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
    if (viewportType === "mobile") {
      return fly(node, { y: 600, duration: out ? 900 : 700, easing });
    }
    return scale(node, { duration: out ? 400 : 700, easing });
  }

  function convertToUsd(amount: number) {
    return (amount / $session.btaUsdRate).toFixed(2)
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
    getRates(session);
  })

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
  class="tips-modal-wrapper {viewportType}"
  in:chooseTransition={{ easing: cubicOut }}
  out:chooseTransition={{ easing: cubicIn, out: true }}
>
  <div class="header">
    <div class="icon-wrapper">
      <FeaturedIcon color="brand" type="gradient" size="lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M9.99984 12.5C7.23841 12.5 4.99984 10.2614 4.99984 7.50001V2.87038C4.99984 2.5255 4.99984 2.35307 5.05009 2.21499C5.13434 1.98352 5.31668 1.80118 5.54815 1.71693C5.68623 1.66667 5.85867 1.66667 6.20354 1.66667H13.7961C14.141 1.66667 14.3134 1.66667 14.4515 1.71693C14.683 1.80118 14.8653 1.98352 14.9496 2.21499C14.9998 2.35307 14.9998 2.5255 14.9998 2.87038V7.50001C14.9998 10.2614 12.7613 12.5 9.99984 12.5ZM9.99984 12.5V15M14.9998 3.33334H17.0832C17.4715 3.33334 17.6656 3.33334 17.8187 3.39677C18.0229 3.48135 18.1852 3.64358 18.2697 3.84777C18.3332 4.00091 18.3332 4.19505 18.3332 4.58334V5.00001C18.3332 5.77498 18.3332 6.16247 18.248 6.48039C18.0168 7.34312 17.3429 8.01699 16.4802 8.24815C16.1623 8.33334 15.7748 8.33334 14.9998 8.33334M4.99984 3.33334H2.9165C2.52822 3.33334 2.33408 3.33334 2.18093 3.39677C1.97674 3.48135 1.81452 3.64358 1.72994 3.84777C1.6665 4.00091 1.6665 4.19505 1.6665 4.58334V5.00001C1.6665 5.77498 1.6665 6.16247 1.75169 6.48039C1.98286 7.34312 2.65673 8.01699 3.51946 8.24815C3.83737 8.33334 4.22486 8.33334 4.99984 8.33334M6.20354 18.3333H13.7961C14.0007 18.3333 14.1665 18.1675 14.1665 17.963C14.1665 16.3266 12.8399 15 11.2035 15H8.79613C7.15973 15 5.83317 16.3266 5.83317 17.963C5.83317 18.1675 5.99899 18.3333 6.20354 18.3333Z"
            stroke="currentColor"
            stroke-width="1.336"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </FeaturedIcon>
    </div>
    <div class="text-wrapper">
      <div class="title">SHARE 1 BTA</div>
      <div class="awards-flow">
          <div class="sportstack-wrapper award-item">
            <div class="avatar-wrapper">

              <SportstackAvatar size="lg" src={sportstack.data?.avatar}/>
              <div class="connector-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="67" viewBox="0 0 2 67" fill="none">
                  <path d="M1 1L1 65.0115" stroke="#525252" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 6"/>
                </svg>
              </div>
            </div>
            <div class="award-content">
              <div class="award-candidate">
                <div class="name">{sportstack.data?.username}</div>
                <div class="type">Sportstack</div>
              </div>
              <div class="amount">
                <div class="bta-icon">
                  <img src={bta_icon} alt="BTA Icon" width="40" height="40"/>
                </div>
                <div class="description">
                  <div class="numbers">0.5 BTA
                    {#if $session.btaUsdRate}
                    <span class="usd">{convertToUsd(0.5)}$</span>
                    {/if}
                  </div>
                  <div class="text-secondary">
                    goes to the publication
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="award-item">
            <Avatar size="lg" src={user?.profile_photo}/>
            <div class="award-content">
              <div class="award-candidate">
                <div class="name">{user?.name}</div>
                <div class="type">@{user?.username}</div>
              </div>
              <div class="amount">
                <div class="bta-icon">
                  <img src={bta_icon} alt="BTA Icon" width="40" height="40"/>
                </div>
                <div class="description">
                  <div class="numbers">0.5 BTA
                    {#if $session.btaUsdRate}
                       <span class="usd">{convertToUsd(0.5)}$</span>
                      {/if}
                  </div>
                  <div class="text-secondary">
                    returns to your Rewards wallet
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="confetti">
      <DotLottieSvelte  src="/assets/lottie/Confetti.lottie"   />
    </div>
    <Button type="primary" full={true} size="lg">Confirm</Button>
    <Button type="secondary" full={true} size="lg">Cancel</Button>
    <div class="checkbox-wrapp">
      <Checkbox title="Don't show again" />
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
    background: var(--colors-background-bg-primary, #1f1f1f);

    /* Shadows/shadow-xl */
    box-shadow: 0 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
      0 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0)),
      0 3px 3px -1.5px var(--colors-effects-shadows-shadow-xl_03, rgba(255, 255, 255, 0));

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
        gap: var(--spacing-lg, 12px);
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

              .connector-wrapper{
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
                  color: var(--colors-text-text-secondary-700, #FBFBFB);

                  /* Text sm/Medium */
                  font-family: var(--font-family-font-family-body, Roboto);
                  font-size: var(--font-size-text-sm, 14px);
                  font-style: normal;
                  font-weight: 500;
                  line-height: var(--line-height-text-sm, 20px); /* 142.857% */
                }
                .type {
                  color: var(--colors-text-text-tertiary-600, #8C8C8C);

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
                }

                .description {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  flex: 1 0 0;
                  align-self: stretch;

                  .numbers {
                    color: var(--colors-text-text-secondary-700, #FBFBFB);

                    /* Text sm/Medium */
                    font-family: var(--font-family-font-family-body, Roboto);
                    font-size: var(--font-size-text-sm, 14px);
                    font-style: normal;
                    font-weight: 500;
                    line-height: var(--line-height-text-sm, 20px); /* 142.857% */

                    .usd {
                      color: var(--colors-text-text-tertiary-600, #8C8C8C);

                      /* Text xs/Semibold */
                      font-family: var(--font-family-font-family-body, Roboto);
                      font-size: var(--font-size-text-xs, 12px);
                      font-style: normal;
                      font-weight: 600;
                      line-height: var(--line-height-text-xs, 18px);
                    }
                  }
                  .text-secondary {
                    color: var(--colors-text-text-tertiary-600, #8C8C8C);

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
            &.sportstack-wrapper .award-content  {
              padding-bottom: var(--spacing-4xl, 32px);
            }
          }
          p {
            color: var(--colors-text-text-secondary-700, #fbfbfb) !important;
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
        transform: translate(-5%, -40%);
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
      }
      .footer {
        padding: var(--spacing-xl, 16px);
        padding-top: var(--spacing-3xl, 24px);
        flex-direction: column;
        align-items: start;
      }
      padding-bottom: var(--spacing-3xl, 24px);
    }
  }
</style>
