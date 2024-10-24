<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import LoaderAvatarLabel from "$lib/components/ui/loaders/LoaderAvatarLabel.svelte";
  import LoaderImage from "$lib/components/ui/loaders/LoaderImage.svelte";
  import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";
  import session from "$lib/store/session.js";

  $: ({ viewportType } = $session);
  $: imageSize = viewportType === "mobile" ? 96 : 104;
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
<div class="article-wrapper {viewportType}" id="publication-article-loader">
  <div class="content">
    <div style="margin-top: -1px; margin-left: -1px">

      <LoaderImage width={imageSize} height={imageSize} borderRadius={6} />
    </div>
    <div class="info">
      <LoaderLine width="100%" height={20} />
      <LoaderAvatarLabel size={viewportType === "mobile" ? "xs" : "sm"} />
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
  :global(.dark-mode #publication-article-loader:not(.mobile)) {
    border: 1px solid #3b3b3b;
  }
  .article-wrapper {
    display: flex;
    padding: var(--spacing-none, 0px);
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-xl, 16px);
    align-self: stretch;
    max-width: 100%;
    max-height: 104px;
    &:hover {
      background: var(--colors-background-bg-secondary, #1f1f1f);
      cursor: pointer;
    }
    .content {
      display: flex;
      align-items: center;
      gap: 16px;

      .img {
        flex-shrink: 0;
        object-fit: contain;
        background-repeat: no-repeat;
        background-size: contain;
        border-radius: var(--radius-sm, 6px);
        width: 96px;
        height: 96px;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        flex-grow: 1;
        overflow: hidden;
        gap: var(--spacing-md, 8px);


      }
    }
    .action {
      display: flex;
      align-items: start;
      position: relative;
      flex-shrink: 0;
      z-index: 1;
      svg {
        cursor: pointer;
      }
      path {
        stroke: var(--colors-foreground-fg-quinary-400) !important;
      }
    }

    &.tablet {
      border: 1px solid #e6e6e6;
      border-radius: var(--radius-xl, 12px);
      .content {
        gap: 0;
        .img {
          height: 104px;
          width: 104px;
        }
        .info {
          padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
            var(--spacing-xl, 16px) var(--spacing-xl, 16px);


        }
      }
      .action {
        padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
          var(--spacing-xl, 16px) var(--spacing-xl, 16px);
        padding-left: 0;
      }
    }

    &.desktop {
      border: 1px solid #e6e6e6;
      border-radius: var(--radius-xl, 12px);
      .content {
        gap: 0;

        .img {
          height: 104px;
          width: 104px;
        }
        .info {
          padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
            var(--spacing-xl, 16px) var(--spacing-xl, 16px);
        }
      }
      .action {
        padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
          var(--spacing-xl, 16px) var(--spacing-xl, 16px);
        padding-left: 0;
      }
    }

    &.mobile {
      padding-right: var(--spacing-xs, 4px);
      border-radius: var(--radius-md, 8px);
      .action {
        padding-top: var(--spacing-xs, 4px);
      }
    }
  }


</style>
