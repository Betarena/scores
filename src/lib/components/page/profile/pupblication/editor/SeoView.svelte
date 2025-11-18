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
  import XClose from "$lib/components/ui/infomessages/x-close.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import session from "$lib/store/session.js";
  import type { TranslationSportstacksSectionDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { createEventDispatcher, onMount } from "svelte";
  import { create_article_store } from "./create_article.store.js";

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

  let description = "";
  let title = "";

  $: ({ viewportType } = $session);
  $: ({ seo, detectedLang } = $create_article_store);

  $: radioButtons = [
    {
      id: "pt_PT",
      value: "pt",
      label: translations?.pt || "Portuguese Portugal",
    },
    {
      id: "pt_BR",
      value: "br",
      label: translations?.["pt-br"] || "Portuguese Brazil",
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
    $create_article_store.seo = { title, description };
    goBack();
  }

  function checkRadio(radio) {
    $create_article_store.detectedLang = {
      lang: radio.value,
      iso: radio.id,
    };
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
    title = seo.title || "";
    description = seo.description || "";
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
  <div class="content-wrapper">
    <div class="content">
      <div class="content-header-border">
        <Container>
          <div class="header-info">
            <div class="title-wrapper">
              <h2>{translations?.seo || "SEO"}</h2>
              {#if viewportType !== "mobile"}
                <div class="close" on:click={goBack}>
                  <XClose />
                </div>
              {/if}
            </div>
            <div class="info-desc">
              {translations?.seo_changes ||
                `The changes made in the SEO details will affect how the article
              appears in public laces like Betarena homepage and in subscribers’
              inboxes — not the contents of the story itself.`}
            </div>
          </div>
        </Container>
      </div>
      <div class="form-wrapper">
        <Input
          bind:value={title}
          placeholder={translations?.title || "Default title"}
          label={translations?.title || "SEO title"}
        />
        <Input
          inputType="textarea"
          height="176px"
          bind:value={description}
          placeholder={translations?.description_place_holder || "Description"}
          label={translations?.seo_descriptions || "SEO description"}
        />

        {#if ["pt", "br"].includes(detectedLang?.lang || "")}
          <div class="confirm-lang-box">
            <span
              >{translations?.lang_preference ||
                "Confirm the article language:"}
            </span>
            <div class="checkboxes-wrapper">
              {#each radioButtons as radio}
                <div
                  class="radio-button-wrapper"
                  class:active={$create_article_store.detectedLang?.iso ===
                    radio.id}
                  on:click={() => checkRadio(radio)}
                >
                  <div
                    class="radio-input"
                    class:active={$create_article_store.detectedLang?.iso ===
                      radio.id}
                  >
                    <div class="input-inset" />
                  </div>
                  <div class="radio-label">{radio.label}</div>
                </div>
              {/each}
            </div>
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
      padding-bottom: var(--spacing-lg, 12px);
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2xl, 20px);
      flex-grow: 1;
      min-height: 0;
      align-self: stretch;

      .content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl, 16px);
        flex-grow: 1;
        flex-shrink: 1;

        .content-header-border {
          .header-info {
            display: flex;
            padding-top: var(--spacing-2xl, 20px);
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

          .confirm-lang-box {
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

            .checkboxes-wrapper {
              display: flex;
              flex-direction: column;
              gap: var(--spacing-xl, 16px);
              width: 100%;

              .radio-button-wrapper {
                cursor: pointer;
                display: flex;
                width: 100%;
                height: 52px;
                padding: var(--spacing-xl, 16px);
                align-items: flex-start;
                align-self: stretch;
                display: flex;
                align-items: flex-start;
                gap: var(--spacing-lg, 12px);
                flex: 1 0 0;
                border-radius: var(--radius-xl, 12px);
                border-radius: var(--radius-xl, 12px);
                border: 1px solid var(--colors-border-border-secondary, #3b3b3b);
                background: var(--colors-background-bg-primary, #1f1f1f);
                .radio-input {
                  display: flex;
                  width: 16px;
                  height: 16px;
                  padding: 5px;
                  flex-shrink: 0;
                  justify-content: center;
                  align-items: center;
                  border-radius: var(--radius-full, 9999px);
                  border: 1px solid var(--colors-border-border-primary, #6a6a6a);

                  .input-inset {
                    width: 6px;
                    height: 6px;
                    flex-shrink: 0;
                    background-color: inherit;
                    border-radius: var(--radius-full, 9999px);
                  }
                  &.active {
                    background: var(
                      --colors-background-bg-brand-solid,
                      #f5620f
                    );
                    border: 1px solid
                      var(--colors-background-bg-brand-solid, #6a6a6a);

                    .input-inset {
                      background: var(--colors-foreground-fg-white, #fff);
                    }
                  }
                }

                &.active {
                  border: 2px solid var(--colors-border-border-brand, #f5620f);
                }
              }
            }
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
            .confirm-lang-box .checkboxes-wrapper .radio-button-wrapper {
              height: 56px;
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
