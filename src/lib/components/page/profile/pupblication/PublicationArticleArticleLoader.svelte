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
<div class="article-wrapper {viewportType}">
  <div class="content">
    <LoaderImage width={imageSize} height={imageSize} borderRadius={6} />
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
  .article-wrapper {
    display: flex;
    padding: var(--spacing-none, 0px);
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-xl, 16px);
    align-self: stretch;
    max-width: 100%;
    overflow: hidden;
    height: max-content;
    max-height: 104px;
    .content {
      display: flex;
      align-items: center;
      gap: 16px;

      :global(.sportstack-image) {
      }

      .img {
        flex-shrink: 0;
        object-fit: contain;
        background-repeat: no-repeat;
        background-size: cover;
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

        h2 {
          margin: 0;
          color: var(--colors-text-text-primary-900, #fbfbfb);
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-lg, 18px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-md, 24px); /* 133.333% */
          max-height: 48px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
    .action {
      display: flex;
      align-items: start;
      position: relative;
      flex-shrink: 0;
      svg {
        cursor: pointer;
      }
      path {
        stroke: var(--colors-foreground-fg-quinary-400) !important;
      }

      .menu {
        position: absolute;
        border-radius: var(--radius-md, 8px);
        border: 1px solid var(--colors-border-border-primary, #6a6a6a);
        background: var(--colors-background-bg-quaternary, #525252);
        top: 100%;
        z-index: 1;
        transform: translate(-90%, 8px);
        /* Shadows/shadow-lg */
        box-shadow: 0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg_01, rgba(255, 255, 255, 0)),
          0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg_02, rgba(255, 255, 255, 0));

        .menu-item {
          display: flex;
          padding: 1px 6px;
          align-items: start;
          align-self: stretch;
          cursor: pointer;
          .content {
            padding: 9px 10px;
            width: 100%;
            display: flex;
            gap: var(--spacing-md, 8px);
          }
          .label {
            color: var(--colors-text-text-secondary-700, #d2d2d2);

            /* Text sm/Medium */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 500;
            line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          }
          &:hover {
            .content {
              border-radius: var(--radius-sm, 6px);
              background: var(--colors-background-bg-primary_hover, #3b3b3b);

              .label {
                color: var(--colors-text-text-secondary_hover, #ededed);
              }
              :global(path) {
                stroke: var(--colors-text-text-secondary_hover, #ededed);
              }
            }
          }

          &.delete,
          &.delete:hover {
            .label {
              color: var(--colors-text-text-error-primary-600, #f97066);
            }
            :global(path) {
              stroke: var(--colors-text-text-error-primary-600, #f97066);
            }
          }
        }
      }
    }

    &.tablet {
      border: 1px solid #3b3b3b;
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

          h2 {
            font-size: var(--font-size-text-xl, 20px);
            line-height: var(--line-height-text-xl, 30px); /* 150% */
            white-space: nowrap;
          }
        }
      }
      .action {
        padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
          var(--spacing-xl, 16px) var(--spacing-xl, 16px);
        padding-left: 0;
      }
    }

    &.desktop {
      border: 1px solid var(--colors-border-border-secondary);
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

          h2 {
            font-size: var(--font-size-text-md, 16px);
            line-height: var(--line-height-text-md, 24px); /* 150% */
          }
        }
      }
      .action {
        padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
          var(--spacing-xl, 16px) var(--spacing-xl, 16px);
        padding-left: 0;
      }
    }
  }
</style>
