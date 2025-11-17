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

  import BackButton from "$lib/components/ui/BackButton.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import XClose from "$lib/components/ui/infomessages/x-close.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import session from "$lib/store/session.js";
  import type { TranslationSportstacksSectionDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { createEventDispatcher, onMount } from "svelte";
  import { create_article_store } from "./create_article.store.js";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import RadioGroupItem from "$lib/components/ui/RadioGroupItem.svelte";
  import FeaturedIcon from "$lib/components/ui/FeaturedIcon.svelte";
  import Lock from "$lib/components/ui/assets/lock.svelte";
  import Coins02 from "$lib/components/ui/assets/coins-02.svelte";
  import Trophy  from '$lib/components/ui/assets/trophy.svelte';
  import { getRates } from "../../helpers.js";

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

  export let translations:
    | TranslationSportstacksSectionDataJSONSchema
    | undefined;

  const dispatch = createEventDispatcher();

  $: ({ viewportType, btaUsdRate } = $session);
  $: ({ access, rewards_amount } = $create_article_store);

  $: radioButtons = [
    {
      id: "free",
      text_fallback: "free_access",
      label: translations?.free_access,
      description: translations?.free_access_description,
      description_fallback: "free_access_description",
      selected: access === "free",
      icon: Lock,
    },
    {
      id: "paid",
      text_fallback: "reward_gated_access",
      label: translations?.reward_gated_access,
      description: translations?.reward_gated_access_description,
      description_fallback: "reward_gated_access_description",
      selected: access === "paid",
      icon: Trophy
    },
  ];

  $: rewardsButtons = [
    {
      id: "1",
      value: 1,
    },
    {
      id: "5",
      value: 5,
    },
    {
      id: "10",
      value: 10,
    },
  ];

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
  function goBack() {
    dispatch("changeView", "preview");
  }

  function save() {
    // $create_article_store.seo = { title, description };
    goBack();
  }

  function checkRadio(radio) {
    $create_article_store.access = radio.id;
  }
  function checkAmount(radio) {
    $create_article_store.rewards_amount = radio.value;
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

<div class="page-container {viewportType}">
  {#if viewportType === "mobile"}
    <Container style="height: unset">
      <div class="header">
        <BackButton on:click={goBack} custom_handler={true} />
      </div>
    </Container>
  {/if}
  <div class="content-wrapper">
    <div class="content">
      <div class="content-header-border">
        <Container>
          <div class="header-info">
            <div class="title-wrapper">
              <h2>
                <TranslationText
                  text={translations?.set_access_conditions}
                  fallback="set_access_conditions"
                />
              </h2>
              {#if viewportType !== "mobile"}
                <div class="close" on:click={goBack}>
                  <XClose />
                </div>
              {/if}
            </div>
            <div class="info-desc">
              <TranslationText
                text={translations?.audience_description}
                fallback="audience_description"
              />
            </div>
          </div>
        </Container>
      </div>
      <div class="form-wrapper">
        <span>
          <TranslationText
            text={translations?.access_type}
            fallback="access_type"
          />
        </span>
        {#each radioButtons as radio}
          <RadioGroupItem
            clickHandler={true}
            full={true}
            selected={radio.id === access}
            on:click={() => checkRadio(radio)}
            controlType="radio"
          >
            <svelte:fragment slot="icon">
              <FeaturedIcon><svelte:component this={radio.icon} /></FeaturedIcon>
            </svelte:fragment>
            <div class="radio-text-wrapper" slot="content">
              <span class="title">
                <TranslationText
                  text={radio.label}
                  fallback={radio.text_fallback}
                />
              </span>
              <span class="description">
                <TranslationText
                  text={radio.description}
                  fallback={radio.description_fallback}
                />
              </span>
            </div>
          </RadioGroupItem>
        {/each}
        {#if access === "paid"}
          <div class="access-amount-text">
            <span class="title">
              <TranslationText
                text={translations?.select_rewards_amount}
                fallback="select_rewards_amount"
              />
            </span>
            <span class="supporting-text">
              <TranslationText
                text={translations?.select_rewards_amount_description}
                fallback="select_rewards_amount_description"
              />
            </span>
          </div>

          {#each rewardsButtons as radio}
            <RadioGroupItem
              full={true}
              clickHandler={true}
              selected={rewards_amount === radio.value}
              on:click={() => checkAmount(radio)}
              controlType="radio"
            >
              <svelte:fragment slot="icon">
                <FeaturedIcon color="gray"><Coins02 /></FeaturedIcon>
              </svelte:fragment>
              <div class="radio-text-wrapper" slot="content">
                <span class="title">
                  {radio.value} BTA
                </span>
                <span class="description"> ≈ ${(radio.value * btaUsdRate).toFixed(2)} USD </span>
              </div>
            </RadioGroupItem>
          {/each}
          <div class="rewards-distribution">
            <TranslationText
              text={translations?.rewards_distribution}
              fallback="rewards_distribution"
            />
          </div>
        {/if}
      </div>
    </div>
    <Container style="height: unset">
      <div class="buttons-wrapper">
        <Button full={true} type="secondary" on:click={goBack}
          >{translations?.go_back || "Go Back"}</Button
        >
        <Button full={true} on:click={save}
          >{translations?.save || "Save"}</Button
        >
      </div>
    </Container>
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
  .page-container {
    background: var(--colors-background-bg-secondary_alt, #1f1f1f);
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    width: 100%;
    max-height: 100dvh;
    padding-bottom: 34px;

    .header {
      display: flex;
      height: 64px;
      align-items: center;
      gap: 20px;
      flex-shrink: 0;
      align-self: stretch;
    }

    .content-wrapper {
      display: flex;
      width: 100%;
      padding-bottom: var(--spacing-lg, 12px);
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2xl, 20px);
      flex-grow: 1;
      min-height: 0;
      align-self: stretch;

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl, 16px);
        flex-grow: 1;
        flex-shrink: 1;

        .content-header-border {
          .header-info {
            display: flex;
            flex-direction: column;
            align-self: stretch;
            gap: var(--spacing-xs, 4px);

            h2 {
              margin: 0;
              color: var(--colors-text-text-primary-900, #fbfbfb);

              /* Text lg/Semibold */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-lg, 18px);
              font-style: normal;
              font-weight: 600;
              line-height: var(--line-height-text-lg, 28px); /* 155.556% */
            }

            .info-desc {
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

        .form-wrapper {
          display: flex;
          padding: var(--spacing-none, 0px) var(--spacing-xl, 16px);
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-xl, 16px);
          flex: 1 0 0;
          align-self: stretch;

          display: flex;
          flex-direction: column;
          width: 100%;
          gap: var(--spacing-xl, 16px);
          color: var(--colors-text-text-secondary-700, #d2d2d2);

          /* Text sm/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          .radio-text-wrapper {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xxs, 2px);
            flex: 1 0 0;

            .title {
              color: var(--colors-text-text-secondary-700, #fbfbfb);

              /* Text md/Medium */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 500;
              line-height: var(--line-height-text-sm, 20px);
            }
            .description {
              color: var(--colors-text-text-tertiary-600, #8c8c8c);

              /* Text md/Regular */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 400;
              line-height: var(--line-height-text-sm, 20px);
            }
          }

          .access-amount-text {
            display: flex;
            padding: 0 var(--spacing-none, 0);
            flex-direction: column;
            align-items: start;
            gap: var(--spacing-md, 8px);
            align-self: stretch;

            .title {
              color: var(--colors-text-text-primary-900, #fbfbfb);

              /* Text sm/Medium */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 500;
              line-height: var(--line-height-text-sm, 20px); /* 142.857% */
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
          .rewards-distribution {
            color: var(--colors-text-text-secondary-700, #fbfbfb);
            text-align: center;
            align-self: stretch;
            /* Text sm/Regular */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          }
        }
      }

      .buttons-wrapper {
        display: flex;
        align-items: flex-start;
        flex-direction: column-reverse;
        gap: var(--spacing-lg, 12px);
        align-self: stretch;

        :global(.button) {
          flex-grow: 1;
          flex-shrink: 0;
          flex-basis: 0;
          height: 44px;
        }
      }
    }

    &.tablet,
    &.desktop {
      width: var(--width-md, 560px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: auto;
      padding-bottom: 0;
      border-radius: var(--radius-xl, 12px);

      /* Shadows/shadow-xl */
      box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
        0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));

      :global(.container-wrapper) {
        padding-inline: var(--spacing-xl, 16px);
      }

      .content-wrapper {
        gap: var(--spacing-3xl, 24px);
        padding-bottom: var(--spacing-xl, 16px);

        .content {
          .content-header-border {
            .header-info {
              padding-top: var(--spacing-2xl, 20px);
              gap: var(--spacing-xs, 4px);

              .title-wrapper {
                display: flex;
                justify-content: space-between;
                h2 {
                  color: var(--colors-text-text-primary-900, #fbfbfb);

                  /* Text xl/Semibold */
                  font-family: var(--font-family-font-family-body, Roboto);
                  font-size: var(--font-size-text-xl, 20px);
                  font-style: normal;
                  font-weight: 600;
                  line-height: var(--line-height-text-xl, 30px); /* 150% */
                }

                .close {
                  cursor: pointer;
                }
              }
              .info-desc {
                color: var(--colors-text-text-tertiary-600, #8c8c8c);

                /* Text md/Regular */
                font-family: var(--font-family-font-family-body, Roboto);
                font-size: var(--font-size-text-md, 16px);
                font-style: normal;
                font-weight: 400;
                line-height: var(--line-height-text-md, 24px); /* 150% */
              }
            }
          }
          .form-wrapper {
            .radio-text-wrapper {
              .title,
              .description {
                font-size: var(--font-size-text-md, 16px);
                line-height: var(--line-height-text-md, 24px);
              }
            }
          }
        }
        .buttons-wrapper {
          height: 110px;
          flex-direction: row;
          align-items: end;
          gap: var(--spacing-lg, 12px);
        }
      }
    }
  }
</style>
