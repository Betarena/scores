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

  import { goto } from "$app/navigation";
  import type { IArticle } from "$lib/components/section/authors/common_ui/helpers.js";
  import ClipboardCheck from "$lib/components/ui/assets/clipboard-check.svelte";
  import ClipboardX from "$lib/components/ui/assets/clipboard-x.svelte";
  import Edit_02 from "$lib/components/ui/assets/edit-02.svelte";
  import Trash_01 from "$lib/components/ui/assets/trash-01.svelte";
  import AvatarLabel from "$lib/components/ui/AvatarLabel.svelte";
  import PopupMenu from "$lib/components/ui/PopupMenu.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";
  import type { TranslationSportstacksSectionDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { createEventDispatcher, onDestroy } from "svelte";
  import DeleteModal from "./DeleteModal.svelte";
  import { deleteArticle, publish } from "./editor/helpers.js";
  import PublicationAvatar from "./PublicationAvatar.svelte";
  import Unpublish from "./Unpublish.svelte";

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

  export let article: IArticle;
  export let translations:
    | TranslationSportstacksSectionDataJSONSchema
    | undefined;

  const dispatch = createEventDispatcher();

  let publishedDate = "";
  let actionMenu = false;

  $: ({ permalink, data, id, seo_details, status, author, views } = article);
  $: ({ title } = data || { title: "" });
  $: ({ twitter_card } = seo_details || { twitter_card: { image: "" } });
  $: articlePreview = twitter_card.image;
  $: profile = $userSettings.user?.scores_user_data;
  $: isPublished = status === "published";
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

  $: if (article.published_date) {
    const date = new Date(article.published_date);
    publishedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  }

  $: options = [
    {
      id: "edit",
      label: translations?.edit || "Edit",
      icon: Edit_02,
    },
    {
      id: isPublished ? "unpublish" : "publish",
      label: isPublished
        ? translations?.unpublish || "Unpublish"
        : translations?.publish || "Publish",
      icon: isPublished ? ClipboardX : ClipboardCheck,
    },
    {
      id: "delete",
      label: translations?.delete || "Delete",
      icon: Trash_01,
    },
  ];

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onDestroy(() => {
    actionMenu = false;
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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

  function click(e: CustomEvent<string>) {
    const action = e.detail;
    actionMenu = false;
    const modalState: any = { modal: true, show: true, props: { id } };
    switch (action) {
      case "edit":
        const isDraft = status === "draft";
        const url = `/u/author/article/${
          isDraft ? "create" : `edit/${permalink}`
        }/${userSettings.extract("lang")}${
          isDraft ? `?sportstack=${author.permalink}&draft=${id}` : ""
        }`;
        goto(url);
        return;
      case "unpublish":
        modalState.component = Unpublish;
        modalState.props = {
          cb: async () => {
            const data = await publish({
              id,
              status: "unpublish",
              sportstack: author,
              translations,
            });
            if (data.success) {
              article.status = "unpublished";
            }
          },
          translations,
        };
        break;
      case "delete":
        modalState.props = {
          cb: async () => {
            const res = await deleteArticle(article, translations);
            if (res.success) {
              dispatch("deleteArticle", article.id);
            }
          },
          translations,
        };
        modalState.component = DeleteModal;
        break;
      case "publish":
        publish({
          id,
          status: "publish",
          sportstack: author,
          translations,
        }).then((d) => {
          if (d.success) {
            article.status = "published";
          }
        });
      default:
        return;
    }
    modalStore.set(modalState);
  }

  function openArticle() {
    if (status !== "published") return;
    window.open(`/a/${permalink}`, "_blank");
  }

  // #endregion ➤ 🛠️ METHODS
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
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="article-wrapper {viewportType}"
  on:click={openArticle}
  id="publication-article"
>
  <div class="content">
    <div class="img-wrapper">

      <PublicationAvatar
      avatar={articlePreview}
      size={viewportType === "mobile" ? "96px" : "104px"}
      />
    </div>

    <div class="info">
      <h2>
        {title}
        {#if status !== "published"}
          <span class="draft">({translations?.drafts})</span>
        {/if}
      </h2>
      <div class="profile-wrapper">
        <AvatarLabel
          avatar={profile?.profile_photo}
          size={viewportType === "mobile" ? "xs" : "sm"}
          name={profile?.name}
          label={publishedDate}
        />
        <span class="views">
          <svg
            class="eye-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M2.01677 10.5942C1.90328 10.4145 1.84654 10.3246 1.81477 10.186C1.79091 10.0819 1.79091 9.91775 1.81477 9.81366C1.84654 9.67507 1.90328 9.58522 2.01677 9.40552C2.95461 7.92054 5.74617 4.1665 10.0003 4.1665C14.2545 4.1665 17.0461 7.92054 17.9839 9.40552C18.0974 9.58522 18.1541 9.67507 18.1859 9.81366C18.2098 9.91775 18.2098 10.0819 18.1859 10.186C18.1541 10.3246 18.0974 10.4145 17.9839 10.5942C17.0461 12.0791 14.2545 15.8332 10.0003 15.8332C5.74617 15.8332 2.95461 12.0791 2.01677 10.5942Z"
              stroke="#6A6A6A"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.0003 12.4998C11.381 12.4998 12.5003 11.3805 12.5003 9.99984C12.5003 8.61913 11.381 7.49984 10.0003 7.49984C8.61962 7.49984 7.50034 8.61913 7.50034 9.99984C7.50034 11.3805 8.61962 12.4998 10.0003 12.4998Z"
              stroke="#6A6A6A"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {views}
        </span>
      </div>
    </div>
  </div>
  <div class="action">
    <span class="views">
      <svg
        class="eye-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M2.01677 10.5942C1.90328 10.4145 1.84654 10.3246 1.81477 10.186C1.79091 10.0819 1.79091 9.91775 1.81477 9.81366C1.84654 9.67507 1.90328 9.58522 2.01677 9.40552C2.95461 7.92054 5.74617 4.1665 10.0003 4.1665C14.2545 4.1665 17.0461 7.92054 17.9839 9.40552C18.0974 9.58522 18.1541 9.67507 18.1859 9.81366C18.2098 9.91775 18.2098 10.0819 18.1859 10.186C18.1541 10.3246 18.0974 10.4145 17.9839 10.5942C17.0461 12.0791 14.2545 15.8332 10.0003 15.8332C5.74617 15.8332 2.95461 12.0791 2.01677 10.5942Z"
          stroke="#6A6A6A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.0003 12.4998C11.381 12.4998 12.5003 11.3805 12.5003 9.99984C12.5003 8.61913 11.381 7.49984 10.0003 7.49984C8.61962 7.49984 7.50034 8.61913 7.50034 9.99984C7.50034 11.3805 8.61962 12.4998 10.0003 12.4998Z"
          stroke="#6A6A6A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {views}
    </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      class="menu-dots"
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
      <PopupMenu bind:show={actionMenu} {options} on:click={click} />
    </svg>
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
  :global(.dark-mode #publication-article:not(.mobile)) {
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
    .views {
      color: var(--colors-text-text-tertiary-600, #8c8c8c);
      display: flex;
      align-items: center;
      gap: 9px;
      /* Text sm/Regular */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-sm, 14px);
      font-style: normal;
      font-weight: 400;
      line-height: var(--line-height-text-sm, 20px); /* 142.857% */
    }
    .profile-wrapper {
      position: relative;
      display: flex;
      .views {
        position: absolute;
        display: flex;
        z-index: 2;
        right: calc(-46px - 82px);
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .content {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-grow: 1;
      overflow: visible;
      .img-wrapper {
        transform: translate(-1px, -1px);
      }
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
        overflow: visible;
        height: 100%;
        gap: var(--spacing-md, 8px);

        h2 {
          margin: 0;
          color: var(--colors-text-text-primary-900, #fbfbfb);
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-lg, 18px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-md, 24px); /* 133.333% */
          max-height: 54px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
    .action {
      height: 100%;
      display: flex;
      position: relative;
      flex-shrink: 0;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: start;
      .views {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);
        display: flex;
        align-items: center;
        gap: 9px;
        display: none;
        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      .menu-dots {
        width: 18px;
        height: 18px;
      }
      path {
        stroke: var(--colors-foreground-fg-quinary-400) !important;
      }
    }

    &.tablet {
      border: 1px solid #e6e6e6;
      border-radius: var(--radius-xl, 12px);
      .content {
        gap: 16;
        .img {
          transform: translate(-1px, -1px);
          height: 104px;
          width: 104px;
        }
        .info {
          // padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
          //   var(--spacing-xl, 16px) var(--spacing-xl, 16px);

          h2 {
            font-size: var(--font-size-text-xl, 20px);
            line-height: var(--line-height-text-xl, 30px); /* 150% */
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
      border: 1px solid #e6e6e6;
      border-radius: var(--radius-xl, 12px);
      .content {
        gap: 16;

        .img {
          transform: translate(-1px, -1px);
          height: 104px;
          width: 104px;
        }
        .info {
          // padding: var(--spacing-md, 8px) var(--spacing-xl, 16px)
          //   var(--spacing-xl, 16px) var(--spacing-xl, 16px);

          h2 {
            font-size: var(--font-size-text-md, 16px);
            line-height: var(--line-height-text-md, 24px); /* 150% */
          }
        }
      }
      .action {
        height: 100%;
        min-width: 141px;
        padding: var(--spacing-xl, 16px) var(--spacing-3xl, 24px);
        display: flex;
        align-items: center;
        .views {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);
          display: flex;
          align-items: center;
          gap: 9px;

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
        .menu-dots {
          position: absolute;
          right: 12px;
          top: 12px;
        }
      }
      .profile-wrapper {
        .views {
          display: none
        }
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

  :global(#publication-article .menu .menu-item .delete) {
    .label {
      color: var(--colors-text-text-error-primary-600, #f97066);
    }
    :global(path) {
      stroke: var(--colors-text-text-error-primary-600, #f97066);
    }
  }
</style>
