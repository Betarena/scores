<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import type { IArticle } from "$lib/components/section/authors/common_ui/helpers.js";
  import ClipboardX from "$lib/components/ui/assets/clipboard-x.svelte";
  import Edit_02 from "$lib/components/ui/assets/edit-02.svelte";
  import Trash_01 from "$lib/components/ui/assets/trash-01.svelte";
  import AvatarLabel from "$lib/components/ui/AvatarLabel.svelte";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";
  import session from "$lib/store/session.js";

  export let article: IArticle;

  $: ({
    permalink,
    data: { title },
    author,
    seo_details: { twitter_card = {} },
  } = article);
  $: avatar = twitter_card.image;
  let publishedDate = "";
  $: if (article.published_date) {
    const date = new Date(article.published_date);
    publishedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  }
  let actionMenu = false;

  $: ({ viewportType } = $session);
  $: options = [
    {
      id: "edit",
      label: "Edit",
      icon: Edit_02,
    },
    {
      id: "unpublish",
      label: "Unpublish",
      icon: ClipboardX,
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash_01,
    },
  ];

  function click(id) {
    console.log("Clicked", id);
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
<svelte:body on:click={() => (actionMenu = false)} />
<div class="article-wrapper {viewportType}">
  <div class="content">
    <SportstackAvatar
      src={avatar}
      size={viewportType === "mobile" ? 96 : 104}
      radius="var(--radius-sm, 6px)"
    />
    <div class="info">
      <h2>{title}</h2>
      <AvatarLabel
        avatar={author.data?.avatar}
        size={viewportType === "mobile" ? "xs" : "sm"}
        name={author.data?.username}
        label={publishedDate}
      />
    </div>
  </div>
  <div class="action">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      on:click|stopPropagation={() => (actionMenu = !actionMenu)}
    >
      <path
        d="M9.99996 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 9.99992C10.8333 9.53968 10.4602 9.16659 9.99996 9.16659C9.53972 9.16659 9.16663 9.53968 9.16663 9.99992C9.16663 10.4602 9.53972 10.8333 9.99996 10.8333Z"
        stroke="#727171"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99996 4.99992C10.4602 4.99992 10.8333 4.62682 10.8333 4.16659C10.8333 3.70635 10.4602 3.33325 9.99996 3.33325C9.53972 3.33325 9.16663 3.70635 9.16663 4.16659C9.16663 4.62682 9.53972 4.99992 9.99996 4.99992Z"
        stroke="#727171"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.99996 16.6666C10.4602 16.6666 10.8333 16.2935 10.8333 15.8333C10.8333 15.373 10.4602 14.9999 9.99996 14.9999C9.53972 14.9999 9.16663 15.373 9.16663 15.8333C9.16663 16.2935 9.53972 16.6666 9.99996 16.6666Z"
        stroke="#727171"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    {#if actionMenu}
      <div class="menu" on:click|stopPropagation>
        {#each options as item}
          <div class="menu-item {item.id}" on:click={() => click(item.id)}>
            <div class="content">
              <div class="icon"><svelte:component this={item.icon} /></div>
              <div class="label">{item.label}</div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
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
    gap: var(--spacing-xl, 16px);
    align-self: stretch;
    .content {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1 0 0;

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: var(--spacing-md, 8px);
        flex: 1 0 0;

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
        }
      }
    }
    .action {
      display: flex;
      align-items: start;
      position: relative;
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
      border: 1px solid #3b3b3b;
      border-radius: var(--radius-xl, 12px);
      .content {
        gap: 0;
        .info {
          padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
            var(--spacing-xl, 16px) var(--spacing-xl, 16px);

          h2 {
            font-size: var(--font-size-text-md, 16px);
            line-height: var(--line-height-text-md, 24px); /* 150% */
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
  }
</style>
