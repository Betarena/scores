<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Add from "./icons/Add.svelte";
  import Arrow from "./icons/Arrow.svelte";
  import B from "./icons/B.svelte";
  import I from "./icons/I.svelte";
  import L from "./icons/L.svelte";
  import List from "./icons/List.svelte";
  import NumList from "./icons/NumList.svelte";
  import Q from "./icons/Q.svelte";
  import H from "./icons/H.svelte";
  import Upload from "./icons/Upload.svelte";
  import session from "$lib/store/session.js";
  import { fly } from "svelte/transition";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import { Editor } from "@tiptap/core";
  import P from "./icons/P.svelte";
  import H2 from "./icons/H2.svelte";
  import H3 from "./icons/H3.svelte";
  import H4 from "./icons/H4.svelte";

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

  export let editor: Editor;
  export let titleInFocus = false;

  let fileInput;
  let view = "full";

  $: ({ viewportType } = $session);

  $: view = viewportType !== "mobile" ? "full" : "first";

  let headings = [
    { id: "text", label: "Normal text", icon: P },
    { id: 2, label: "Heading 2", icon: H2 },
    { id: 3, label: "Heading 3", icon: H3 },
    { id: 4, label: "Heading 4", icon: H4 },
  ];

  $: selectedHedings = editor?.isActive("heading")
    ? getCurrentHeading(editor)
    : headings[0];
  const fullToolbar = [
    {
      icon: H,
      cb: handleHeadings,
      id: "heading",
      options: headings,
    },
    {
      icon: B,
      cb: () => toggle("toggleBold"),
      id: "bold",
    },
    {
      icon: I,
      cb: () => toggle("toggleItalic"),
      id: "italic",
    },
    {
      icon: Q,
      cb: () => toggle("toggleBlockquote"),
      id: "blockquote",
    },
    {
      icon: L,
      cb: linkClick,
      id: "link",
    },
    {
      icon: Upload,
      cb: upload,
      id: "img",
    },
    {
      icon: List,
      cb: () => toggle("toggleBulletList"),
      id: "bulletList",
    },
    {
      icon: NumList,
      cb: () => toggle("toggleOrderedList"),
      id: "orderedList",
    },
    {
      icon: Arrow,
      cb: () => toggle("undo"),
      id: "undo",
    },
  ];

  const firstView = [
    {
      icon: H,
      cb: handleHeadings,
      id: "heading",
      options: headings,
    },
    {
      icon: B,
      cb: () => toggle("toggleBold"),
      id: "bold",
    },
    {
      icon: I,
      cb: () => toggle("toggleItalic"),
      id: "italic",
    },
    {
      icon: Q,
      cb: () => toggle("toggleBlockquote"),
      id: "blockquote",
    },
    {
      icon: L,
      cb: linkClick,
      id: "link",
    },
    {
      icon: NumList,
      cb: () => toggle("toggleOrderedList"),
      id: "orderedList",
    },
    {
      icon: Arrow,
      cb: () => toggle("undo"),
      id: "undo",
    },
  ];

  const secondView = [
    {
      icon: Upload,
      cb: upload,
      id: "img",
    },
    {
      icon: List,
      cb: () => toggle("toggleBulletList"),
      id: "bulletList",
    },
  ];

  const viewMap = {
    full: fullToolbar,
    first: firstView,
    second: secondView,
  };
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

  function getCurrentHeading(editor) {
    const level = editor.getAttributes("heading").level;
    return headings.find((h) => h.id === level) || headings[0];
  }

  function handleHeadings(e) {
    if (titleInFocus || !editor) return;
    const node = e.detail;
    if (node.id === "text") {
      return editor
        .chain()
        .focus()
        .toggleHeading({ level: selectedHedings.id as number })
        .run();
    }
    editor.chain().focus().setHeading({ level: node.id }).run();
    selectedHedings = node;
  }

  function toggle(cb, conf?) {
    if (titleInFocus) return;
    editor.chain().focus()[cb](conf).run();
  }

  function linkClick(e) {
    e.preventDefault();
    e.stopPropagation();
    dispatch("showLinkPopup");
  }

  function upload() {
    fileInput.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.readAsDataURL(file);
    }
  }

  function changeView() {
    if (viewportType !== "mobile") return;
    view = view === "first" ? "second" : "first";
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

{#if editor}
  <div class="toolbar {viewportType}">
    <div
      class="button view-change"
      on:click={changeView}
      class:active={view === "second"}
      class:disabled={titleInFocus}
    >
      <Add />
    </div>
    {#each viewMap[view] as { icon, cb, id, options }}
      {#if id === "heading"}
        <DropDownInput
          {options}
          value={selectedHedings}
          class="dropdown"
          on:change={cb}
        >
          <div slot="option" class="dropdow-item" let:option>
            <svelte:component this={option?.icon} />
          </div>
        </DropDownInput>
      {:else}
        <div
          in:fly={{ x: -100, duration: 200 }}
          out:fly={{ x: 100, duration: 200 }}
          class="button"
          class:disabled={titleInFocus}
          class:active={editor.isActive(id)}
          on:click={cb}
        >
          {#if id === "img"}
            <input
              type="file"
              bind:this={fileInput}
              name=""
              on:change={handleFileChange}
              hidden
              accept="image/*"
              id=""
            />
          {/if}
          <svelte:component this={icon} />
        </div>
      {/if}
    {/each}
    <!-- <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("bold")}
      on:click={() => toggle("toggleBold")}
    >
      <B />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("italic")}
      on:click={() => toggle("toggleItalic")}
    >
      <I />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("heading", { level: 1 })}
      on:click={() => toggle("toggleHeading", { level: 1 })}
    >
      <H />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("blockquote")}
      on:click={() => toggle("toggleBlockquote")}
    >
      <Q />
    </div>
    <div
      on:click|stopPropagation|preventDefault={linkClick}
      class="button link-button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("link")}
    >
      <L />
    </div>
    <div
      class="button"
      class:active={editor.isActive("img")}
      class:disabled={titleInFocus}
      on:click={upload}
    >
      <input
        type="file"
        bind:this={fileInput}
        name=""
        on:change={handleFileChange}
        hidden
        id=""
      />
      <Upload />
    </div>
    <div
      class="button"
      class:active={editor.isActive("bulletList")}
      class:disabled={titleInFocus}
      on:click={() => toggle("toggleBulletList")}
    >
      <List />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      class:active={editor.isActive("orderedList")}
      on:click={() => toggle("toggleOrderedList")}
    >
      <NumList />
    </div>
    <div
      class="button"
      class:disabled={titleInFocus}
      on:click={() => toggle("undo")}
    >
      <Arrow />
    </div> -->
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
  .toolbar {
    width: 100%;
    display: flex;
    padding-inline: var(--spacing-md, 8px);
    gap: var(--spacing-xxs, 2px);
    justify-content: center;
    :global(path) {
      stroke: #8c8c8c !important;
    }
    .button {
      height: max-content;
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
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

    :global(.dropdown) {
      width: 44px !important;
      height: 44px !important;
    }
    // :global(.dropdown-input) {
    // }
    :global(.dropdown .input-element) {
      padding: 0 !important;
      max-width: 100%;
      border: none !important;
      margin-bottom: -5px;
    }

    :global(.dropdown .select-dropdown) {
      border: none !important;
      background: var(--colors-background-bg-active);
      box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
      0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));
    }
    :global(.dropdown .list-item) {
      width: 44px;
      height: 44px;
    }
    :global(.dropdown .list-item:hover) {
      background-color: var(
          --component-colors-components-buttons-primary-button-primary-bg
        ) !important;
    }
    :global(.dropdown .list-item:hover svg path) {
     stroke: var(--colors-base-white) !important;
    }
    :global(.dropdown .list-item.active) {
      background-color: var(
          --component-colors-components-buttons-primary-button-primary-bg
        ) !important;
    }
    :global(.dropdown .list-item.active svg path) {
     stroke: var(--colors-base-white) !important;
    }
    .view-change {
      :global(svg) {
        transition: all 0.3s ease-out;
        transform: rotate(0deg);
      }
      &.active {
        :global(svg) {
          transform: rotate(180deg);
        }
      }
    }

    &.mobile {
      justify-content: flex-start;
    }
  }
</style>
