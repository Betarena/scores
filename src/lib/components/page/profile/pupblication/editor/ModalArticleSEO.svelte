<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { getContext } from "svelte";
  import { create_article_store } from "./create_article.store.js";
  import { fade, fly, scale } from "svelte/transition";
  import { cubicIn, cubicOut } from "svelte/easing";
  import Button from "$lib/components/ui/Button.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import TagsView from "./TagsView.svelte";
  import SeoView from "./SeoView.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";

  $: ({ seo, tags } = $create_article_store);

  $: ({ viewportType } = $session);

  const viewMap = {
    tags: TagsView,
    seo: SeoView,
  };

  function changeView(view: string) {
    $modalStore.modal = true;
    $modalStore.component = viewMap[view];
  }

  function chooseTransition(node, { easing, out = false }) {
    if (viewportType === "mobile") {
      return fly(node, { y: 600, duration: out ? 900 : 700, easing });
    }
    return scale(node, { duration: out ? 400 : 700, easing });
  }
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
  id="article-seo-modal"
  class="seo-modal {viewportType}"
  in:chooseTransition={{ easing: cubicOut }}
  out:chooseTransition={{ easing: cubicIn, out: true }}
>
  <div class="option-wrapper" on:click={() => changeView("tags")}>
    <div class="info">
      <h3>Tags</h3>
      {#if tags.length}
        <div class="tags-wrapper">
          {#each tags as tag (tag.id)}
            <Badge active={true} color="brand" size="sm">{tag.label}</Badge>
          {/each}
        </div>
      {:else}
        <div class="info-message">No tags added</div>
      {/if}
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
    >
      <path
        d="M8.35254 15L13.4115 10L8.35254 5"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
  <div class="separator" />
  <div class="option-wrapper" on:click={() => changeView("seo")}>
    <div class="info">
      <h3>SEO</h3>
      {#if seo.title || seo.description}
        <!-- content here -->
      {:else}
        <div class="info-message">Add a title and description to SEO</div>
      {/if}
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
    >
      <path
        d="M8.35254 15L13.4115 10L8.35254 5"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
  <Button full={true}>Publish now</Button>
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
  .seo-modal {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    bottom: 0;
    width: 100%;
    position: absolute;
    // transform: translateY(-100%);

    padding: 24px 16px calc(var(--spacing-lg, 12px) + 34px) 16px;

    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: var(--radius-2xl, 16px) var(--radius-2xl, 16px)
      var(--radius-none, 0px) var(--radius-none, 0px);
    background: var(--colors-background-bg-primary, #fff);

    .separator {
      height: 1px;
      align-self: stretch;
      background: #3e3e3e;
    }
    .option-wrapper {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      .info {
        display: flex;
        flex-direction: column;

        h3 {
          color: var(--colors-text-text-primary, #fbfbfb);

          /* nav/16px */
          font-family: Roboto;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 150%; /* 24px */
          margin: 0;
        }
        .info-message {
          color: var(--colors-text-text-tertiary, #8c8c8c);

          /* body/14px */
          font-family: Roboto;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%; /* 21px */
        }

        .tags-wrapper {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm, 6px);
          align-self: stretch;
          flex-wrap: wrap;
        }
      }
    }

    &.tablet,
    &.desktop {
      width: 375px;
      padding: 24px 16px var(--spacing-3xl, 24px) 16px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: var(--radius-2xl, 16px);

      bottom: unset;
    }
  }
</style>
