<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
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

  let element;
  let editor;
  let title = "";
  let linkPopup = false;
  let showLinkText = false;
  let linkText = "";
  let linkHref = "";
  const options = [
    { id: 1, label: "Sportstack 1" },
    { id: 2, label: "Sportstack 2" },
    { id: 3, label: "Sportstack 3" },
  ];

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
    });
    // Update the viewport height on mount
    updateViewportHeight();

    // Listen for viewport changes (e.g., when the keyboard appears)
    window.visualViewport?.addEventListener('resize', updateViewportHeight);

    return () => {
      editor?.destroy();
       // Clean up the event listener
       window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    };
  });

  function updateViewportHeight() {
    const vh = (window.visualViewport?.height || 0) * 0.01;
    if (vh) {
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }

  function toggle(cb) {
    editor.chain().focus()[cb]().run();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      editor.chain().focus().run();
    }
  }

  function linkClick() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const selectionEmpty = editor.state.selection.empty;
    showLinkText = selectionEmpty;
    linkPopup = true;
  }

  function hideLinkPopup() {
    if (!linkPopup) return;
    linkPopup = false;
    if (linkHref) {
      if (showLinkText) {
        editor
          .chain()
          .focus()
          .setLink({ href: linkHref })
          .insertContent(linkText || linkHref)
          .run();
      } else {
        editor.chain().focus().setLink({ href: linkHref }).run();
      }
      linkHref = "";
      linkText = "";
    }
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
<svelte:body on:click={hideLinkPopup} />

<div id="create-article" class="create-article">
  <Container style="display: flex; flex-direction: column; flex-grow: 1">
    <div class="header">
      <XClose />
      <DropDownInput {options} />
    </div>
    <div class="editor-wrapper">
      <input
        type="text"
        class="title"
        bind:value={title}
        placeholder="Title (required)"
        on:keydown={handleKeyDown}
      />
      <div class="editor" bind:this={element} />
    </div>
  </Container>

  {#if editor}
    <div class="toolbar-wrapper">
      <Container>
        <div class="toolbar">
          <div>
            <Add />
          </div>
          <div
            class="button"
            class:active={editor.isActive("bold")}
            on:click={() => toggle("toggleBold")}
          >
            <B />
          </div>
          <div
            class="button"
            class:active={editor.isActive("italic")}
            on:click={() => toggle("toggleItalic")}
          >
            <I />
          </div>
          <div
            class="button"
            class:active={editor.isActive("blockquote")}
            on:click={() => toggle("toggleBlockquote")}
          >
            <Q />
          </div>
          <div
            on:click|stopPropagation={linkClick}
            class="button link-button"
            class:active={linkPopup || editor.isActive("link")}
          >
            {#if linkPopup}
              <div class="link-popup">
                {#if showLinkText}
                  <Input
                    placeholder="Enter text"
                    label="Text"
                    bind:value={linkText}
                  />
                {/if}
                <Input
                  placeholder="Enter URL"
                  label="URL"
                  bind:value={linkHref}
                />
              </div>
            {/if}
            <L />
          </div>
          <div
            class="button"
            class:active={editor.isActive("bulletList")}
            on:click={() => toggle("toggleBulletList")}
          >
            <List />
          </div>
          <div
            class="button"
            class:active={editor.isActive("orderedList")}
            on:click={() => toggle("toggleOrderedList")}
          >
            <NumList />
          </div>
          <div on:click={() => toggle("undo")}>
            <Arrow />
          </div>
        </div>
        <Button type="primary" full={true}>Publish</Button>
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
    height: calc(var(--vh, 1vh) * 100 - 34px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

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
      flex-shrink: 1;
      gap: var(--spacing-lg, 12px);
      justify-content: flex-end;

      .title {
        border: none;
        background: inherit;
        padding: 0;

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
        font-size: var(--font-size-text-md, 16px) !important;

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
        :global(.ProseMirror) {
          height: 100%;
        }
        :global(.ProseMirror-focused) {
          height: 100%;
          border: 0;
        }
        :global([contenteditable]) {
          outline: none !important;
        }

        :global(blockquote) {
          border-left: 4px solid var(--component-colors-alpha-alpha-black-40);
          padding-left: var(--spacing-lg, 12px);
        }
        :global(ul) {
          color: var(
            --colors-text-text-primary
          ) !important; /* Цвет маркеров и чисел */
        }
        :global(ol) {
          color: var(
            --colors-text-text-primary
          ) !important; /* Цвет маркеров и чисел */
        }

        :global(a) {
          text-decoration: underline !important;
        }
      }
    }

    .toolbar-wrapper {
      display: flex;
      padding: var(--spacing-lg, 12px) var(--spacing-none, 0px);
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      align-self: stretch;
      .toolbar {
        width: 100%;
        display: flex;
        gap: var(--spacing-xxs, 2px);
        justify-content: space-between;
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
              fill: var(--colors-base-white);
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
  }
</style>
