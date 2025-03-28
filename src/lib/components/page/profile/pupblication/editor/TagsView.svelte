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

  import { createEventDispatcher, onMount } from "svelte";
  import { browser } from "$app/environment";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
  import { get } from "$lib/api/utils.js";
  import { create_article_store } from "./create_article.store.js";
  import session from "$lib/store/session.js";
  import BackButton from "$lib/components/ui/BackButton.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import XClose from "$lib/components/ui/infomessages/x-close.svelte";
  import type {
    AuthorsTagsMain,
    TranslationSportstacksSectionDataJSONSchema,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";

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

  let tags: string[] = [];
  let search = "";
  let selectedTags: string[] = [];

  $: ({ viewportType } = $session);

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

  $: if (browser) searchTags(search);

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

  function goBack() {
    dispatch("changeView", "preview");
  }

  function select(tag) {
    if (selectedTags.length === 5) return;
    if (check(tag, selectedTags)) {
      selectedTags = selectedTags.filter((t) => t !== tag);
      return;
    }
    selectedTags = [tag, ...selectedTags];
  }

  function deselect(tag) {
    selectedTags = selectedTags.filter((t) => t !== tag);
  }

  function check(tag, selected) {
    return !!selected.some((t) => t === tag);
  }

  function keyHandler(e) {
    if (e.detail.key === "Enter") {
      const searchedTag =
        tags.find((tag) => tag.toLowerCase() === search.toLowerCase()) ||
        search;
      select(searchedTag);
      search = "";
    }
  }

  function save() {
    $create_article_store.tags = selectedTags;
    goBack();
  }

  async function searchTags(text: string) {
    const res = (await get(
      `/api/data/author/tags?search=${text}`
    )) as AuthorsTagsMain[];
    tags = [...res.map((tag) => tag.name as string)];
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
    selectedTags = $create_article_store.tags;
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
          <div class="content-header">
            <div class="header-info">
              <div class="title-wrapper">
                <h2>{translations?.add_tags || "Add Tags"}</h2>
                {#if viewportType !== "mobile"}
                  <div class="close" on:click={goBack}>
                    <XClose />
                  </div>
                {/if}
              </div>
              <div class="info-desc">
                {translations?.add_tags_description ||
                  `Add or change tags (up to 5) so readers know what your article
                is about and also find it easier.`}
              </div>
            </div>
            <Input
              placeholder="Search for tabs"
              bind:value={search}
              on:keydown={keyHandler}
            />
            {#if selectedTags.length}
              <div class="seleted-tags">
                {#each selectedTags as tag (tag)}
                  <div
                    in:fade={{ delay: 100 }}
                    animate:flip={{
                      duration: 250,
                      easing: cubicInOut,
                    }}
                  >
                    <Badge
                      color="brand"
                      active={true}
                      size="md"
                      on:click={() => deselect(tag)}
                      >{tag}
                      <div class="cross-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M9 3L3 9M3 3L9 9"
                            stroke="#873608"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </Badge>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </Container>
      </div>
      <div class="tags-wrapper">
        <h2>{translations?.choose_tags || "Choose tags"}</h2>
        <div class="tags-to-select">
          {#each tags as tag (tag)}
            {@const isActive = check(tag, selectedTags)}
            <div
              animate:flip={{
                duration: 250,
                easing: cubicInOut,
              }}
            >
              <Badge
                size={viewportType === "mobile" ? "xl" : "xxl"}
                active={isActive}
                color={isActive ? "brand" : "gray"}
                on:click={() => select(tag)}>{tag}</Badge
              >
            </div>
          {/each}
        </div>
      </div>
    </div>
    <Container style="height: unset">
      <div class="buttons-wrapper">
        <Button
          type="secondary-gray"
          full={viewportType !== "mobile"}
          on:click={goBack}>{translations?.go_back || "Go Back"}</Button
        >
        <Button full={viewportType !== "mobile"} on:click={save}
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
    background-color: var(--colors-background-bg-main);
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-bottom: 34px;

    *::-webkit-scrollbar {
      width: 8px;
    }

    *::-webkit-scrollbar-track {
      background: inherit;
    }

    *::-webkit-scrollbar-thumb {
      background: var(--colors-background-bg-quaternary);
      border-radius: 4px;
    }

    :global(.badge) {
      cursor: pointer;
    }

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
      flex: 1 0 0;
      align-self: stretch;

      .content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl, 16px);
        flex-grow: 1;

        .content-header-border {
          border-bottom: 1px solid
            var(--colors-border-border-secondary, #3b3b3b);

          .content-header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-2xl, 20px);
            align-self: stretch;
            padding-bottom: var(--spacing-xl, 16px);

            .header-info {
              display: flex;
              flex-direction: column;
              gap: var(--spacing-md, 8px);
              align-self: stretch;

              h2 {
                color: var(--colors-text-text-primary, #fbfbfb);

                /* Display xs/Semibold */
                font-family: var(--font-family-font-family-display, Roboto);
                font-size: var(--font-size-display-xs, 24px);
                font-style: normal;
                font-weight: 600;
                margin: 0;
                line-height: var(--line-height-display-xs, 32px); /* 133.333% */
              }

              .info-desc {
                color: var(--colors-text-text-quaternary, #8c8c8c);

                /* Text sm/Regular */
                font-family: var(--font-family-font-family-body, Roboto);
                font-size: var(--font-size-text-sm, 14px);
                font-style: normal;
                font-weight: 400;
                line-height: var(--line-height-text-sm, 20px); /* 142.857% */
              }
            }
            .seleted-tags {
              display: flex;
              align-items: flex-start;
              gap: var(--spacing-md, 8px);
              flex-wrap: wrap;

              .cross-icon {
                display: flex;
                width: 16px;
                height: 16px;
                padding: var(--spacing-xxs, 2px);
                flex-direction: column;
                align-items: flex-start;
              }
            }
          }
        }

        .tags-wrapper {
          display: flex;
          padding: var(--spacing-none, 0px) var(--spacing-xl, 16px);
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          flex: 1 0 0;
          align-self: stretch;

          h2 {
            color: var(--colors-text-text-secondary-700, #d2d2d2);
            margin: 0;
            /* Text xl/Medium */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-xl, 20px);
            font-style: normal;
            font-weight: 500;
            line-height: var(--line-height-text-xl, 30px); /* 150% */
          }

          .tags-to-select {
            display: flex;
            align-items: flex-start;
            align-content: flex-start;
            gap: 16px;
            align-self: stretch;
            flex-wrap: wrap;

            :global(.badge:hover) {
              border: 1px solid
                var(--component-colors-utility-brand-utility-brand-500, #ae460b);
              color: var(--colors-text-text-white, #fff);

              background: var(
                --component-colors-utility-brand-utility-brand-500,
                #fef5f0
              );
            }
          }
        }
      }

      .buttons-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        align-self: stretch;

        :global(.button) {
          flex-grow: 1;
          flex-shrink: 0;
          flex-basis: 0;
        }
      }
    }

    &.tablet,
    &.desktop {
      top: 50%;
      width: var(--width-md, 560px);
      left: 50%;
      transform: translate(-50%, -50%);
      padding-bottom: var(--spacing-xl, 16px);
      min-height: 629px;
      border-radius: var(--radius-xl, 12px);
      background: var(--colors-background-bg-primary, #fff);
      height: auto;

      /* Shadows/shadow-xl */
      box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
        0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));

      :global(.container-wrapper) {
        padding-inline: var(--spacing-xl, 16px);
      }

      .content-wrapper {
        gap: var(--spacing-3xl, 24px);
        padding-bottom: 0;

        .content {
          gap: var(--spacing-2xl, 20px);

          .content-header {
            padding-top: var(--spacing-2xl, 20px);
            gap: var(--spacing-xl, 16px) !important;

            .header-info {
              gap: var(--spacing-xs, 4px);

              .title-wrapper {
                display: flex;
                justify-content: space-between;

                .close {
                  cursor: pointer;
                }
              }

              h2 {
                font-size: var(--font-size-text-lg, 18px);
                font-weight: 600;
                line-height: var(--line-height-text-lg, 28px); /* 155.556% */
              }

              .info-desc {
                font-size: var(--font-size-text-sm, 14px);
                font-style: normal;
                font-weight: 400;
                line-height: var(--line-height-text-sm, 20px); /* 142.857% */
              }
            }
          }

          .tags-wrapper {
            flex-shrink: 0;
            max-height: calc(215px + 30px + 12px + 5px);
            overflow-y: auto;
          }
        }

        .buttons-wrapper {
          gap: var(--spacing-lg, 12px);
          flex-direction: column-reverse;
        }
      }
    }

    &.desktop {
      .tags-to-select {
        gap: 16px;
      }
    }
  }
</style>
