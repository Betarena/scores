<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { createEventDispatcher } from "svelte";
  import ArrowLeftIcon from "./assets/arrow-left.svelte";
  import ArrowRight from "./assets/arrow-right.svelte";

  // #region ➤ 📌 VARIABLES

  export let currentPage: number = 1;
  export let totalPages: number = 10;
  export let maxVisiblePages: number = 7;
  export let classname: string = "";

  const dispatch = createEventDispatcher();

  let visiblePages: (number | string)[] = [];

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  function calculateVisiblePages() {
    const pages: (number | string)[] = [];
    const halfWindow = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - halfWindow);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust startPage if we're near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      // Add first page if not showing it
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add last page if not showing it
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    visiblePages = pages;
  }

  function handlePageClick(page: number | string) {
    if (typeof page === "number" && page !== currentPage) {
      currentPage = page;
      dispatch("pagechange", { page: currentPage });
    }
  }

  function handlePrevious() {
    if (currentPage > 1) {
      currentPage--;
      dispatch("pagechange", { page: currentPage });
    }
  }

  function handleNext() {
    if (currentPage < totalPages) {
      currentPage++;
      dispatch("pagechange", { page: currentPage });
    }
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 REACTIVE

  $: if (currentPage || totalPages) {
    calculateVisiblePages();
  }

  // #endregion ➤ 🔄 REACTIVE
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!-- Desktop Layout -->
<div class="pagination pagination-desktop {classname}">
  <!-- Previous Button -->
  <div class="pagination-button-wrap pagination-button-prev">
    <Button
      type="secondary"
      size="sm"
      icon_leading
      disabled={currentPage === 1}
      on:click={handlePrevious}
    >
        <div class="icon">
            <ArrowLeftIcon />
        </div>
      Previous
    </Button>
  </div>

  <!-- Page Numbers -->
  <div class="pagination-numbers">
    {#each visiblePages as page (page)}
      {#if page === "..."}
        <div class="pagination-ellipsis">...</div>
      {:else}
        <button
          class="pagination-number"
          class:active={page === currentPage}
          on:click={() => handlePageClick(page)}
          type="button"
        >
          {page}
        </button>
      {/if}
    {/each}
  </div>

  <!-- Next Button -->
  <div class="pagination-button-wrap pagination-button-next">
    <Button
      type="secondary"
      size="sm"
      icon_leading
      disabled={currentPage === totalPages}
      on:click={handleNext}
    >

        Next
        <div class="icon">
            <ArrowRight />
        </div>
    </Button>
  </div>
</div>

<!-- Mobile Layout -->
<div class="pagination pagination-mobile {classname}">
  <!-- Previous Button -->
  <div class="pagination-mobile-button">
    <Button
      type="secondary"
      size="sm"
      icon_only
      disabled={currentPage === 1}
      on:click={handlePrevious}
    >
      <div class="icon">
        <ArrowLeftIcon />
      </div>
    </Button>
  </div>

  <!-- Page Info -->
  <div class="pagination-mobile-info">
    Page {currentPage} of {totalPages}
  </div>

  <!-- Next Button -->
  <div class="pagination-mobile-button">
    <Button
      type="secondary"
      size="sm"
      icon_only
      disabled={currentPage === totalPages}
      on:click={handleNext}
    >
      <div class="icon">
        <ArrowRight />
      </div>
    </Button>
  </div>
</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">
  .pagination {
    display: flex;
    gap: var(--spacing-lg, 12px);
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: var(--spacing-lg, 12px) var(--spacing-3xl, 24px);
    border-top: 1px solid var(--colors-border-border-secondary, #3b3b3b);
  }

  // Desktop Layout
  .pagination-desktop {
    display: flex;

    @media (max-width: 768px) {
      display: none;
    }
  }

  // Mobile Layout
  .pagination-mobile {
    display: none;
    flex: 1;
    gap: var(--spacing-md, 8px);
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
    border-top: 1px solid var(--colors-border-border-secondary, #ededed);

    @media (max-width: 768px) {
      display: flex;
    }
  }

  .pagination-mobile-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pagination-mobile-info {
    flex: 1;
    text-align: center;
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-sm, 14px);
    font-weight: 500;
    line-height: var(--line-height-text-sm, 20px);
    color: var(--colors-text-text-secondary-700, #525252);
  }

  .icon {
    width: 20px;
    height: 20px;
    color: var(--colors-foreground-fg-quaternary-400)
  }

  .pagination-button-wrap {
    display: flex;
    flex: 1 0 0;
    align-items: center;
    justify-content: center;
    height: 36px;

    &.pagination-button-prev {
      justify-content: flex-start;
    }

    &.pagination-button-next {
      justify-content: flex-end;
    }
  }

  .pagination-numbers {
    display: flex;
    gap: var(--spacing-xxs, 2px);
    align-items: center;
    justify-content: center;
  }

  .pagination-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: var(--spacing-md, 8px);
    border-radius: var(--radius-md, 8px);
    border: none;
    background-color: transparent;
    color: var(--colors-text-text-quaternary-500, #8c8c8c);
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-sm, 14px);
    font-weight: 500;
    line-height: var(--line-height-text-sm, 20px);
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover:not(.active) {
      background-color: var(--colors-background-bg-primary_hover, #3b3b3b);
      color: var(--colors-text-text-secondary-700, #fbfbfb);
    }

    &.active {
      background-color: var(--colors-background-bg-primary_hover, #3b3b3b);
      color: var(--colors-text-text-secondary-700, #fbfbfb);
      font-weight: 600;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--colors-background-bg-primary, #1f1f1f),
        0 0 0 4px var(--colors-effects-focus-rings-focus-ring, #f5620f);
    }
  }

  .pagination-ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: var(--colors-text-text-quaternary-500, #8c8c8c);
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-sm, 14px);
    font-weight: 500;
    line-height: var(--line-height-text-sm, 20px);
    text-align: center;
    user-select: none;
  }

  .pagination-icon {
    width: 24px;
    height: 24px;
    color: inherit;
  }
</style>
