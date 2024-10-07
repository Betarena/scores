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

  import { onMount } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  import Link from "@tiptap/extension-link";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import XClose from "$lib/components/ui/infomessages/x-close.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Add from "./icons/Add.svelte";
  import B from "./icons/B.svelte";
  import I from "./icons/I.svelte";
  import Q from "./icons/Q.svelte";
  import L from "./icons/L.svelte";
  import List from "./icons/List.svelte";
  import NumList from "./icons/NumList.svelte";
  import Arrow from "./icons/Arrow.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";
  import BackButton from "$lib/components/ui/BackButton.svelte";
  import ModalArticleSeo from "./ModalArticleSEO.svelte";
  import Toolbar from "./Toolbar.svelte";

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

  let element;
  let editor;
  let title = "";
  let titleInFocus = false;
  let editorInFocus = false;
  let vh = "1vh";
  let isKeyboardOpen = false;
  let keyBoardHeight = `calc(34px + 40px)`;
  const options = [
    { id: 1, label: "Sportstack 1" },
    { id: 2, label: "Sportstack 2" },
    { id: 3, label: "Sportstack 3" },
  ];

  $: ({ viewportType } = $session);

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

  function updateViewportHeight() {
    vh = `${(window.visualViewport?.height || 0) * 0.01}px`;
    isKeyboardOpen = (window.visualViewport?.height || 0) < window.innerHeight;
    if (isKeyboardOpen) {
      const keyboardHeight = window.innerHeight - window.visualViewport.height;
      keyBoardHeight = `${keyboardHeight}px`;
    } else {
      keyBoardHeight = `calc(34px + 40px)`;
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      editor.chain().focus().run();
    }
  }

  function back() {
    history.back();
  }

  function resizeTextarea(
    e: Event & { currentTarget: EventTarget & HTMLTextAreaElement }
  ) {
    const textarea = e.currentTarget;
    textarea.style.height = "32px";
    let height = textarea.scrollHeight;
    textarea.style.height = height + "px";
  }

  function updateToolbarPosition() {
    if (isKeyboardOpen) {
      const scrollTop = window.scrollY;
      keyBoardHeight = `${
        scrollTop +
        (window.visualViewport?.height || 0) -
        editor.getBoundingClientRect().bottom
      }px`;
    }
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
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          linkOnPaste: true,
        }),
        Placeholder.configure({
          placeholder: "Create your sports content",
        }),
      ],
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
      onFocus: () => {
        titleInFocus = false;
        editorInFocus = true;
      },

      onBlur: () => {
        editorInFocus = false;
      },
    });
    // Update the viewport height on mount
    updateViewportHeight();

    // Listen for viewport changes (e.g., when the keyboard appears)
    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("scroll", updateViewportHeight);
    window.addEventListener("scroll", updateToolbarPosition);
    return () => {
      editor?.destroy();
      // Clean up the event listener
      window.visualViewport?.removeEventListener(
        "resize",
        updateViewportHeight
      );
      window.addEventListener("scroll", updateToolbarPosition);
      window.visualViewport?.removeEventListener(
        "scroll",
        updateViewportHeight
      );
    };
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

<div
  id="create-article"
  class="create-article {viewportType}"
  style="--vh: {vh}; --h:{isKeyboardOpen ? '0px' : `calc(-34px - 40px)`}"
>
  <Container style="display: flex; flex-direction: column; flex-grow: 1">
    <div class="header">
      <div on:click={back}>
        {#if viewportType === "mobile"}
          <XClose />
        {:else}
          <BackButton custom_handler={true} />
        {/if}
      </div>

      <DropDownInput {options} />
      {#if viewportType === "desktop"}
        <div class="actions">
          <Button
            type="primary"
            disabled = {!title || editor?.getText().trim().split(/\s+/).length < 50}
            on:click={() => {
              $modalStore.component = ModalArticleSeo;
              $modalStore.modal = true;
              $modalStore.show = true;
            }}>Publish</Button
          >
        </div>
      {/if}
    </div>
    {#if viewportType === "desktop"}
      <div class="toolbar-wrapper">
        <Toolbar {editor} bind:titleInFocus />
      </div>
    {/if}
    <div class="editor-wrapper">
      <textarea
        class="title"
        bind:value={title}
        placeholder="Title (required)"
        on:keydown={handleKeyDown}
        on:input={resizeTextarea}
        on:focus={() => (titleInFocus = true)}
      />
      <div
        class="editor"
        bind:this={element}
        on:focus={() => (titleInFocus = false)}
      />
    </div>
  </Container>

  {#if editor && viewportType !== "desktop"}
    <div class="toolbar-wrapper" style="bottom: {keyBoardHeight};">
      <Toolbar {editor} bind:titleInFocus />
    </div>
  {/if}
  {#if viewportType !== "desktop"}
    <div class="button-container" style={isKeyboardOpen ? "bottom: -50vh" : ""}>
      <Container>
        <Button
          type="primary"

          full={viewportType === "mobile"}
          on:click={() => {
            $modalStore.component = ModalArticleSeo;
            $modalStore.modal = true;
            $modalStore.show = true;
          }}>Publish</Button
        >
      </Container>
    </div>
  {/if}
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
  .create-article {
    height: 100vh;
    max-height: calc(100vh - 34px - 40px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overscroll-behavior: contain;

    .header {
      display: flex;
      height: 64px;
      align-items: center;
      gap: 20px;
      width: 100%;
      flex-shrink: 0;
      align-self: stretch;

      :global(.field) {
        flex-grow: 1;
        align-items: center;
        justify-content: center;
      }
    }

    .editor-wrapper {
      display: flex;
      flex-direction: column;
      padding-top: var(--spacing-xl, 16px);
      flex-grow: 1;
      max-height: 100%;
      overflow: hidden;
      flex-shrink: 1;
      gap: var(--spacing-lg, 12px);
      justify-content: flex-end;

      .title {
        border: none;
        background: inherit;
        padding: 0;
        flex-shrink: 0;
        height: 32px;
        overflow-y: hidden;
        resize: none;

        color: var(--colors-text-text-primary, #fbfbfb);

        /* Display xs/Regular */
        font-family: var(--font-family-font-family-display, Roboto);
        font-size: var(--font-size-display-xs, 24px);
        font-style: normal;
        font-weight: 400;
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
        color: var(--colors-text-text-primary) !important;
        font-family: var(--font-family-font-family-display, Roboto);
        overflow: auto;
        font-size: var(--font-size-text-md, 16px);

        :global(p) {
          color: var(--colors-text-text-primary) !important;
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-text-md, 16px) !important;
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

        :global(blockquote) {
          border-left: 4px solid var(--component-colors-alpha-alpha-black-40);
          padding-left: var(--spacing-lg, 12px);
        }

        :global(a) {
          text-decoration: underline !important;
          display: initial;
          color: var( --colors-text-text-brand-tertiary) !important;
        }
      }
    }

    .toolbar-wrapper {
      width: 100%;
      display: flex;
      position: fixed;
      padding: var(--spacing-lg, 12px) var(--spacing-none, 0px);
      flex-direction: column;
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
    .button-container {
      display: flex;
      width: 100%;
      position: fixed;
      justify-content: center;
      bottom: 36px;
    }

    &.tablet {
      .header {
        :global(.field .input-wrapper) {
          width: 100%;
          max-width: 343px;
          margin: 0 auto;
        }
      }

      .button-container {
        :global(.container-wrapper) {
          display: flex;
          justify-content: center;
        }
      }
    }

    &.desktop {
      .header {
        gap: var(--spacing-3xl, 24px);
        margin-top: var(--spacing-2xl, 20px);
        padding-block: var(--spacing-2xl, 20px);
        height: 84px;
        :global(.field) {
          max-width: 343px;
        }

        .actions {
          flex-grow: 1;
          display: flex;
          justify-content: flex-end;
        }
      }
      .toolbar-wrapper {
        position: static;
        padding: var(--spacing-lg, 12px) var(--spacing-none, 0px);
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        align-self: stretch;
        border-bottom: 1px solid var(--colors-border-border-secondary, #3B3B3B);

        :global(.toolbar) {
          justify-content: start;
        }
      }
      .editor-wrapper {
        padding-top: var(--spacing-lg, 12px);
      }
    }
  }
</style>
