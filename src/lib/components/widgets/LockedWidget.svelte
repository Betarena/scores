<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { page } from "$app/stores";
  import type { TranslationAwardsDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import TipsModal from "../section/authors/common_ui/articles/TipsModal.svelte";
  import Button from "../ui/Button.svelte";
  import FeaturedIcon from "../ui/FeaturedIcon.svelte";
  import type { IPageAuthorAuthorData } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import TranslationText from "../misc/Translation-Text.svelte";
  import session from "$lib/store/session.js";
  import { onDestroy } from "svelte";

  export let sportstack = {} as IPageAuthorAuthorData;
  export let grantAccess = () => {};

  $: ({ awards_translations } = $page.data as {
    awards_translations: TranslationAwardsDataJSONSchema;
  });
  $: ({ viewportType } = $session);

  let MODAL_HEIGHT = 500;
  const HEADER_VISIBLE = 20 + 32 + 16; // icon + gap + padding

  let lockNode: HTMLDivElement;
  let modalNode;
  let firstRender = true;
  let zIndex = 3000;
  let scrollRAFId: number | null = null;

  $: if (modalNode && firstRender && viewportType) {
    setTimeout(() => {
      firstRender = false;
      const root = document.getElementById("app-root-layout");
      root?.appendChild(modalNode);
      handleScroll();
    }, 200);
  }

  function handleScroll() {
    if (scrollRAFId !== null) {
      cancelAnimationFrame(scrollRAFId);
    }

    scrollRAFId = requestAnimationFrame(() => {
      if (!lockNode || !modalNode) return;

      const scrollY = window.scrollY || window.pageYOffset;
      const lockRect = lockNode.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const SCROLL_OFFSET = 50;
      const rect = modalNode.getBoundingClientRect();
      const documentHeight = document.documentElement.scrollHeight;

      MODAL_HEIGHT = rect.height;

      const threshold = windowHeight - SCROLL_OFFSET - HEADER_VISIBLE;
      const isAtBottom = scrollY + windowHeight >= documentHeight - 10;
      const maxBottom = windowHeight - MODAL_HEIGHT;

      let newModalBottom = (MODAL_HEIGHT - HEADER_VISIBLE) * -1;
      let newZIndex = 3000;

      if (lockRect.bottom < threshold) {
        const progress = threshold - lockRect.bottom;
        newModalBottom = (MODAL_HEIGHT - HEADER_VISIBLE) * -1 + progress;
        newZIndex = 4100;
      }

      if (isAtBottom && newModalBottom < 0) {
        newModalBottom = 0;
        newZIndex = 4100;
      }

      if (maxBottom < newModalBottom) {
        newModalBottom = maxBottom;
      }

      const translateY = -newModalBottom;
      modalNode.style.transform = `translateY(${translateY}px)`;

      if (zIndex !== newZIndex) {
        modalNode.style.zIndex = `${newZIndex}`;
        zIndex = newZIndex;
      }

      scrollRAFId = null;
    });
  }

  onDestroy(() => {
    if (scrollRAFId !== null) {
      cancelAnimationFrame(scrollRAFId);
    }
  });
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

<svelte:window on:scroll|passive={handleScroll} />

<div class="lock-widget-wrapper" bind:this={lockNode}>
  <FeaturedIcon size="md" color="gray" type="modern"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M14.1663 8.33333V6.66667C14.1663 4.36548 12.3009 2.5 9.99967 2.5C7.69849 2.5 5.83301 4.36548 5.83301 6.66667V8.33333M9.99967 12.0833V13.75M7.33301 17.5H12.6663C14.0665 17.5 14.7665 17.5 15.3013 17.2275C15.7717 16.9878 16.1542 16.6054 16.3939 16.135C16.6663 15.6002 16.6663 14.9001 16.6663 13.5V12.3333C16.6663 10.9332 16.6663 10.2331 16.3939 9.69836C16.1542 9.22795 15.7717 8.8455 15.3013 8.60582C14.7665 8.33333 14.0665 8.33333 12.6663 8.33333H7.33301C5.93288 8.33333 5.23281 8.33333 4.69803 8.60582C4.22763 8.8455 3.84517 9.22795 3.60549 9.69836C3.33301 10.2331 3.33301 10.9332 3.33301 12.3333V13.5C3.33301 14.9001 3.33301 15.6002 3.60549 16.135C3.84517 16.6054 4.22763 16.9878 4.69803 17.2275C5.23281 17.5 5.93288 17.5 7.33301 17.5Z"
        stroke="var(--colors-foreground-fg-secondary-700)"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </FeaturedIcon>
  <div class="cta">
    <TranslationText
      text={awards_translations.locked_content}
      fallback="Locked content"
    />
  </div>

  <Button type="secondary-gray" size="sm"
    ><TranslationText text={awards_translations.unlock} fallback="Unlock " /> (1
    BTA)</Button
  >
</div>

<div bind:this={modalNode} class="locked-tips-modal-wrapper">
  <TipsModal type="unlock" {sportstack} {grantAccess} />
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
  .lock-widget-wrapper {
    display: flex;
    width: 100%;
    padding: 16px;
    align-items: center;
    gap: 12px;
    align-self: stretch;

    border-radius: var(--radius-xl, 12px);
    border: 1px solid var(--colors-border-border-secondary, #3b3b3b);
    background: var(--colors-background-bg-primary, #1f1f1f);

    /* Shadows/shadow-xs */
    box-shadow: 0 1px 2px 0
      var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));

    .cta {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: var(--spacing-none, 0);
      flex: 1 0 0;

      color: var(--colors-text-text-secondary-700, #fbfbfb);

      /* Text md/Semibold */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-md, 16px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--line-height-text-md, 24px); /* 150% */
    }
  }

  .locked-tips-modal-wrapper {
    position: fixed;
    z-index: 3000;
    left: 0px;
    right: 0px;
    bottom: 0px;
    will-change: transform;
    transform: translateY(100vh);

    :global(.tips-modal-wrapper) {
      position: static;
    }
  }
</style>
