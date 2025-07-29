<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { ScrollIntoView } from '@tiptap/extension-scroll-into-view';

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
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  import BubbleMenu from "@tiptap/extension-bubble-menu";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";
  import Toolbar from "./Toolbar.svelte";
  import LinkPopup from "./LinkPopup.svelte";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/article/create/[lang=lang]/$types.js";
  import InsertLinkModal from "./InsertLinkModal.svelte";
  import PublishModal from "./PublishModal.svelte";
  import type { TranslationSportstacksSectionDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { Tweet, ImageWithPlaceholder, YouTube, SafeLink } from "./editor_nodes.js";
  import ImageAltModal from "./ImageAltModal.svelte";

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
  export let data: PageData;
  export let contentEditor: Editor;
  export let title = "";
  export let content: string | undefined;
  export let uploadUrl: string = "";
  export let publishClick: () => void;
  export let translations:
    | TranslationSportstacksSectionDataJSONSchema
    | undefined;

  let element;
  let titleInFocus = false;
  let vh = "1vh";
  let isKeyboardOpen = false;
  let keyBoardHeight = `80px`;
  let linkInsertModal;
  let bmenu;
  let linkState = { url: "", text: "" };
  let textareaNode;
  let editor;

  $: if ($modalStore.show) {
    linkInsertModal = false;
  }
  $: ({ viewportType } = $session);
  $: if (textareaNode && viewportType) {
    setTimeout(() => {
      resizeTextarea(title);
    });
  }

  const dispatch = createEventDispatcher();

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

  async function updateViewportHeight() {
    // toogleLinkPopup(false)
    vh = `${(window.visualViewport?.height || 0) * 0.01}px`;
    isKeyboardOpen = (window.visualViewport?.height || 0) < window.innerHeight;
    if (isKeyboardOpen) {
      const keyboardHeight =
        window.innerHeight - (window.visualViewport?.height || 0);
      keyBoardHeight = `${keyboardHeight}px`;
    } else {
      keyBoardHeight = `80px`;
    }
  }

  async function handleResize() {
    updateViewportHeight();
    editor.commands.scrollIntoView();
    window.scrollTo(0, 0);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      editor.chain().focus().run();
    }
  }

  function resizeTextarea(_title: string) {
    const textarea = textareaNode as HTMLTextAreaElement;
    textarea.style.height = viewportType === "mobile" ? "36px" : "54px";
    let height = textarea.scrollHeight;
    textarea.style.height = height + "px";
  }

  function updateToolbarPosition() {
    if (isKeyboardOpen) {
      const scrollTop = window.scrollY;
      keyBoardHeight = `${
        scrollTop +
        (window.visualViewport?.height || 0) -
        editor.getBoundingClientRect().bottom -
        2
      }px`;
      editor.commands.blur();
    }
  }
  function toogleLinkPopup(show?: boolean) {
    if (show !== undefined && show === linkInsertModal) return;
    linkInsertModal = show ?? !linkInsertModal;
    editor.view.updateState(editor.view.state);
    editor.commands.focus();
    shouldShow();
  }

  function shouldShow() {
    const isLink = editor.isActive("link");

    if (!linkInsertModal && !isLink) return false;
    let url = "";
    let text = "";
    if (isLink) {
      const linkAttrs = editor.getAttributes("link");
      url = linkAttrs.href;
      const { from } = editor.view.state.selection;
      let linkNode = editor.state.doc.nodeAt(from);
      if (
        !linkNode ||
        !linkNode.marks.some((mark) => mark.type.name === "link")
      ) {
        linkNode = editor.state.doc.nodeAt(from - 1);
      }

      text = linkNode?.textContent || "";
    } else {
      const { from, to } = editor.state.selection;
      text = editor.state.doc.textBetween(from, to, " ");
    }
    linkState = { url, text };
    if (!isLink) {
      const modal = {
        show: true,
        component: InsertLinkModal,
        modal: true,
        props: { linkState, editor, translations },
      };
      modalStore.set(modal);

      return false;
    }
    return isLink;
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
    editor = new Editor({
      element: element,
      content: content || "",
      extensions: [
        YouTube,
        Tweet,
        StarterKit,
        Placeholder.configure({
          placeholder:
            translations?.create_sports_content || "Create your sports content",
        }),
        ImageWithPlaceholder.configure({
          base64: true,
          inline: true,
        }),
        SafeLink.configure({
          openOnClick: false,
          linkOnPaste: true,
        }),
        BubbleMenu.configure({
          element: bmenu,

          tippyOptions: {
            popperOptions: {
              modifiers: [
                {
                  name: "preventOverflow",
                  options: {
                    boundaryElement: document.querySelector(".editor-wrapper"),
                  },
                  enabled: true,
                },
              ],
            },
            appendTo: document.querySelector(".editor-wrapper") as Element,
          },
          shouldShow: ({ editor, state }) => {
            const isLink = editor.isActive("link");
            const { from } = state.selection;
            const positionsToCheck = [from, from - 1];

            for (const pos of positionsToCheck) {
                const domNode = editor.view.nodeDOM(pos);
                const node = state.doc.nodeAt(pos);

                if (node?.type.name === "imageWithPlaceholder" &&
                (domNode?.parentElement?.tagName !== "A" ||
                domNode?.parentElement?.getAttribute("data-image-placeholder") === "true")) {
                const { alt = "", link = "" } = node.attrs;
                const modal = {
                  show: true,
                  component: ImageAltModal,
                  modal: true,
                  props: { alt, link, pos, node, editor, translations },
                };
                modalStore.set(modal);
                return false;
              }
            }
            if (!linkInsertModal && !isLink) return false;
            let url = "";
            let text = "";
            if (isLink) {
              const linkAttrs = editor.getAttributes("link");
              url = linkAttrs.href;
              const { from } = editor.view.state.selection;
              let linkNode = editor.state.doc.nodeAt(from);
              if (
                !linkNode ||
                !linkNode.marks.some((mark) => mark.type.name === "link")
              ) {
                linkNode = editor.state.doc.nodeAt(from - 1);
              }

              text = linkNode?.textContent || "";
            } else {
              const { from, to } = editor.state.selection;
              text = editor.state.doc.textBetween(from, to, " ");
            }
            linkState = { url, text };

            if (!isLink) {
              const modal = {
                show: true,
                component: InsertLinkModal,
                modal: true,
                props: { linkState, editor, translations },
              };
              modalStore.set(modal);

              return false;
            }
            return isLink;
          },
        }),
      ],
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
      onFocus: () => {
        titleInFocus = false;
      },
      onUpdate: ({ editor }) => {
        dispatch("update", { editor, title });
      },
      onSelectionUpdate: ({ editor }) => {
        editor.commands.scrollIntoView();
      },
    });
    contentEditor = editor;

    // Update the viewport height on mount
    updateViewportHeight();

    // Listen for viewport changes (e.g., when the keyboard appears)
    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", updateViewportHeight);
    window.addEventListener("scroll", updateToolbarPosition);
    return () => {
      editor?.destroy();
      // Clean up the event listener
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateToolbarPosition);
      window.visualViewport?.removeEventListener(
        "scroll",
        updateViewportHeight
      );
    };
  });

  function showInsertLinkModal() {
    linkInsertModal = true;
    const modal = {
      show: true,
      component: InsertLinkModal,
      modal: true,
      props: { linkState, editor, translations },
    };
    modalStore.set(modal);
  }

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

<svelte:head>
  <script
    async
    src="https://platform.twitter.com/widgets.js"
    charset="utf-8"
  ></script>
</svelte:head>

{#if viewportType === "desktop"}
  <Container clazz="sticky-toolbar " hFull={false}>
    <div class="toolbar-wrapper desktop-toolbar">
      <Toolbar
        {uploadUrl}
        {editor}
        bind:titleInFocus
        on:showLinkPopup={() => toogleLinkPopup(true)}
      />
    </div>
  </Container>
{/if}

<div bind:this={bmenu} class="link-popup" style="z-index: 3!important;">
  <LinkPopup
    {editor}
    show={linkInsertModal}
    {linkState}
    on:edit={showInsertLinkModal}
    on:hide={() => toogleLinkPopup(false)}
  />
</div>
<div class="bg" />
<div
  id="editor"
  class="editor {viewportType}"
  style="--vh: {vh}; --h:{isKeyboardOpen ? '0px' : `calc(-34px - 40px)`}"
>
  <Container
    style="display: flex; flex-direction: column; flex-grow: 1; max-height: 100%; height: 100%"
  >
    <div class="editor-wrapper" id="parent">
      <textarea
        on:input={(e) => dispatch("update", { editor, title: e.target?.value })}
        bind:this={textareaNode}
        class="title"
        bind:value={title}
        placeholder={translations?.title_required || "Title (required)"}
        on:keydown={handleKeyDown}
        on:focus={() => (titleInFocus = true)}
      />
      <div
        class="editor"
        bind:this={element}
        on:focus={() => (titleInFocus = false)}
      />
    </div>
  </Container>
</div>
{#if editor && viewportType !== "desktop"}
  <div class="toolbar-wrapper">
    <Toolbar
      {editor}
      {uploadUrl}
      bind:titleInFocus
      on:showLinkPopup={() => toogleLinkPopup(true)}
    />
  </div>
{/if}
{#if viewportType !== "desktop" && !isKeyboardOpen}
  <div class="button-container">
    <Container>
      <Button
        type="primary"
        full={true}
        disabled={!title || editor?.getText().trim().split(/\s+/).length < 50}
        on:click={() => {
          $modalStore.component = PublishModal;
          $modalStore.modal = true;
          $modalStore.show = true;
          $modalStore.props = { cb: publishClick, translations };
        }}>{translations?.publish || "Publish"}</Button
      >
    </Container>
  </div>
{/if}

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
  .bg {
    z-index: -1;
    background-color: var(--colors-background-bg-main);
    height: 100vh;
    width: 100vh;
    position: fixed;
  }
  .link-popup {
    z-index: 2 !important;
  }
  .editor {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overscroll-behavior: contain;
    overflow: auto;
    flex-grow: 1;

    :global(.tippy-tooltip[data-out-of-boundaries]) {
      display: none;
    }

    .editor-wrapper {
      display: flex;
      flex-direction: column;
      padding-top: var(--spacing-xl, 16px);
      flex-grow: 1;
      flex-shrink: 1;
      max-width: 676px;
      margin: 0 auto;
      width: 100%;
      gap: var(--spacing-lg, 12px);
      justify-content: flex-end;
      padding-bottom: 16px; // button height + padding + toolbar height

      .title {
        border: none;
        background: inherit;
        padding: 0;
        flex-shrink: 0;
        height: 32px;
        overflow-y: hidden;
        resize: none;
        font-weight: 500;

        color: var(--colors-text-text-primary, #fbfbfb);

        /* Display xs/Regular */
        font-family: var(--font-family-font-family-display, Roboto);
        font-size: var(--font-size-display-xs, 24px);
        font-style: normal;
        line-height: var(--line-height-display-xs, 32px); /* 133.333% */

        &:focus-visible {
          outline: none;
        }
        &::placeholder {
          color: var(--colors-text-text-placeholder, #727171);
        }
      }

      .editor {
        flex-grow: 1;
        z-index: 0;
        color: var(--colors-text-text-primary) !important;
        font-family: var(--font-family-font-family-display, Roboto);

        // font-size: var(--font-size-text-md, 16px);

        font-size: 18px;
        line-height: 32px;
        font-weight: 300;

        :global(p) {
          font-size: 18px;
          line-height: 32px;
          font-weight: 300;
          color: var(--colors-text-text-primary) !important;
          // font-family: var(--font-family-font-family-display, Roboto);
          // font-size: var(--font-size-text-md, 16px) !important;
        }
        :global(p.is-editor-empty:first-child::before) {
          color: var(--colors-text-text-placeholder, #727171);
          content: attr(data-placeholder);
          font-family: var(--font-family-font-family-display, Roboto);
          float: left;
          height: 0;
          pointer-events: none;
        }
        :global(.ProseMirror-focused) {
          border: 0;
        }
        :global([contenteditable]) {
          outline: none !important;
        }

        :global(blockquote:not(.twitter-tweet)) {
          border-left: 4px solid var(--component-colors-alpha-alpha-black-40);
          padding-left: var(--spacing-lg, 12px);
        }

        :global(.twitter-tweet),
        :global(.embed) {
          margin-top: 40px !important;
          margin-bottom: 40px !important;
          margin-inline: auto !important;
          padding-left: 0;
        }
        :global(.youtube-shorts) {
          display: flex;
          justify-content: center;
        }
        :global(.embed iframe) {
          width: 100%;
          aspect-ratio: 16/9;
        }

        :global(.youtube-shorts iframe) {
          width: 50%;
          aspect-ratio: 9/16;
        }

        :global(a) {
          text-decoration: underline !important;
          display: initial;
          color: var(--colors-text-text-brand-tertiary) !important;
        }

        :global(h2) {
          line-height: 32px;
          font-weight: 700;
          margin: 40px 0 16px;
          font-size: 24px;
        }
        :global(h2:first-of-type) {
          margin-top: 0;
        }

        :global(h3) {
          line-height: 32px;
          font-weight: 700;
          margin: 40px 0 16px;
          font-size: 20px;
        }
        :global(h3:first-of-type) {
          margin-top: 0;
        }
        :global(img) {
          max-width: 100%;
          width: 100%;
          height: auto;
        }
        &::selection {
          z-index: 0;
        }
      }
    }

    .button-container {
      display: flex;
      width: 100%;
      position: fixed;
      justify-content: center;
      bottom: 0;
      background-color: var(--colors-background-bg-main);
      padding-bottom: 36px;
      z-index: 10000;
    }

    &.tablet {
      .button-container {
        :global(.container-wrapper) {
          display: flex;
          justify-content: center;
        }
      }
    }

    &.desktop {
      overflow: unset;
      height: 100%;
      flex-grow: unset;
      // max-height: 95vh;

      .toolbar-wrapper {
      }
      .editor-wrapper {
        padding-top: var(--spacing-lg, 12px);
        // margin-top: 70px;
        .title {
          font-size: 38px;
          line-height: 54px;
          letter-spacing: -0.72px;
          height: 54px;
        }
      }
      :global(.twitter-tweet),
      :global(.embed) {
        margin-top: 48px !important;
        margin-bottom: 48px !important;
        margin-inline: auto !important;
        padding-left: 0;
      }

      :global([data-placeholder-image]) {
        width: 100%;
        height: 400px !important;
      }
    }
    &.mobile {
      .editor-wrapper {
        .title {
          line-height: 36px;
          font-size: 24px;
        }
        :global(.youtube-shorts iframe) {
          width: 100%;
        }
      }
    }
  }
  .toolbar-wrapper {
    width: 100%;
    display: flex;
    // position: fixed;
    z-index: 100;
    padding: var(--spacing-lg, 12px) var(--spacing-none, 0px);
    flex-direction: column;
    background-color: var(--colors-background-bg-primary);
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    border-top: 1px solid var(--colors-border-border-secondary, #3b3b3b);
    .toolbar {
      width: 100%;
      display: flex;
      padding-inline: var(--spacing-md, 8px);
      gap: var(--spacing-xxs, 2px);
      justify-content: center;
      .button {
        height: max-content;
        border-radius: var(--radius-md, 8px);
        height: 44px;
        width: 44px;
        &.active {
          background-color: var(
            --component-colors-components-buttons-primary-button-primary-bg
          );
          :global(path) {
            fill: var(--colors-base-white) !important;
          }
        }
        &.disabled {
          // background-color: ;
          background: var(--colors-background-bg-disabled, #f7f7f7);
          :global(path) {
            fill: var(--colors-foreground-fg-disabled, #8c8c8c) !important;
          }
        }
      }
      .link-button {
        position: relative;

        .link-popup {
          position: absolute;
          top: -10px;
          left: 0;
          width: fit-content;
          height: fit-content;
          z-index: 100;
          transform: translate(-50%, -100%);

          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg, 6px);

          border-radius: var(--radius-md);
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.24);
          z-index: 1;
          padding: var(--spacing-lg) var(--spacing-sm, 6px);
          background: var(--colors-background-bg-active);
        }
      }
    }
  }
  :global(.sticky-toolbar) {
    position: sticky;
    top: 104px;
    z-index: 10000;
  }
  .desktop-toolbar {
    background-color: var(--colors-background-bg-primary);
    padding: var(--spacing-lg, 12px) var(--spacing-none, 0px);
    flex-direction: column;
    align-items: flex-start;
    position: static;
    gap: 10px;
    z-index: 1000;
    align-self: stretch;
    border-bottom: 1px solid var(--colors-border-border-secondary, #3b3b3b);
  }
</style>
