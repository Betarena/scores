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

  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import { uploadImage } from "$lib/firebase/common.js";
  import session from "$lib/store/session.js";
  import { Editor } from "@tiptap/core";
  import { TextSelection } from "prosemirror-state";
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import Add from "./icons/Add.svelte";
  import Arrow from "./icons/Arrow.svelte";
  import B from "./icons/B.svelte";
  import H from "./icons/H.svelte";
  import H2 from "./icons/H2.svelte";
  import H3 from "./icons/H3.svelte";
  import H4 from "./icons/H4.svelte";
  import I from "./icons/I.svelte";
  import L from "./icons/L.svelte";
  import List from "./icons/List.svelte";
  import NumList from "./icons/NumList.svelte";
  import P from "./icons/P.svelte";
  import Q from "./icons/Q.svelte";
  import Upload from "./icons/Upload.svelte";

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

  export let editor: Editor;
  export let titleInFocus = false;
  export let uploadUrl = "";

  let fileInput;
  let view = "full";

  const dispatch = createEventDispatcher();

  const headings = [
    { id: "p", label: "Normal text", icon: P },
    { id: 2, label: "Heading 2", icon: H2 },
    { id: 3, label: "Heading 3", icon: H3 },
    { id: 4, label: "Heading 4", icon: H4 },
  ];

  const toolbarButtons = {
    heading: {
      icon: H,
      cb: handleHeadings,
      id: "heading",
      options: headings,
    },
    bold: {
      icon: B,
      cb: () => toggle("toggleBold"),
      id: "bold",
    },
    italic: {
      icon: I,
      cb: () => toggle("toggleItalic"),
      id: "italic",
    },
    blockquote: {
      icon: Q,
      cb: () => toggle("toggleBlockquote"),
      id: "blockquote",
    },
    link: {
      icon: L,
      cb: linkClick,
      id: "link",
    },
    img: {
      icon: Upload,
      cb: upload,
      id: "img",
    },
    bulletList: {
      icon: List,
      cb: () => toggle("toggleBulletList"),
      id: "bulletList",
    },
    orderedList: {
      icon: NumList,
      cb: () => toggle("toggleOrderedList"),
      id: "orderedList",
    },
    undo: {
      icon: Arrow,
      cb: () => toggle("undo"),
      id: "undo",
    },
  };

  let selectedHedings = headings[0];

  let viewMap = {
    full: [
      toolbarButtons.heading,
      toolbarButtons.bold,
      toolbarButtons.italic,
      toolbarButtons.blockquote,
      toolbarButtons.link,
      toolbarButtons.img,
      toolbarButtons.bulletList,
      toolbarButtons.orderedList,
      toolbarButtons.undo,
    ],
    first: [
      toolbarButtons.heading,
      toolbarButtons.bold,
      toolbarButtons.italic,
      toolbarButtons.blockquote,
      toolbarButtons.link,
      toolbarButtons.orderedList,
      toolbarButtons.undo,
    ],
    second: [toolbarButtons.img, toolbarButtons.bulletList],
  };

  $: ({ viewportType } = $session);

  $: view = viewportType !== "mobile" ? "full" : "first";

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

  $: selectedHedings = editor?.isActive("heading")
    ? getCurrentHeading(editor)
    : headings[0];

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
    if (node.id === "p") {
      return editor
        .chain()
        .focus()
        .toggleHeading({ level: selectedHedings.id as any })
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

  function changeView() {
    if (viewportType !== "mobile") return;
    view = view === "first" ? "second" : "first";
  }

  function isActive(editor: Editor, id: string) {
    if (id === "link" && editor.isActive("imageWithPlaceholder")) {
      const state = editor.view.state;
      const { from } = state.selection;
      const positionsToCheck = [from, from - 1];

      for (const pos of positionsToCheck) {
        const node = state.doc.nodeAt(pos);

        return (
          node?.type.name === "imageWithPlaceholder" &&
         node.attrs.link
        );
      }
    }
    return editor.isActive(id);
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    const id = new Date().valueOf();
    const reader = new FileReader();
    editor
      .chain()
      .focus()
      .insertContent({
        type: "imageWithPlaceholder",
        attrs: { id, loading: true, src: "" },
      })
      .command(({ tr, state }) => {
        const { schema } = state;
        let pos: number | null = null;
        let nodeSize = 0;

        tr.doc.descendants((node, offset) => {
          if (
            node.type.name === "imageWithPlaceholder" &&
            node.attrs.id === id
          ) {
            pos = offset;
            nodeSize = node.nodeSize;
            return false;
          }
          return true;
        });

        if (pos === null) {
          return false;
        }

        const docSize = tr.doc.content.size;
        const afterPos = pos + nodeSize;

        if (afterPos < docSize) {
          const resolved = tr.doc.resolve(afterPos);
          tr.setSelection(TextSelection.near(resolved));
        } else {
          const paragraph = schema.nodes.paragraph.createAndFill()!;
          tr.insert(afterPos, paragraph);
          const resolved = tr.doc.resolve(afterPos + 1);
          tr.setSelection(TextSelection.near(resolved));
        }

        return true;
      })
      .run();
    reader.onload = async (e) => {
      const fileContent = (e.target?.result || "") as string;
      const url = await uploadImage(
        fileContent,
        `${uploadUrl}/${new Date().valueOf()}.png`
      );
      editor
        .chain()
        .focus()
        .command(({ tr, state }) => {
          const { schema } = state;
          let foundPos: number | null = null;
          let nodeSize = 0;

          tr.doc.descendants((node, pos) => {
            if (
              node.type.name === "imageWithPlaceholder" &&
              node.attrs.id === id
            ) {
              tr.setNodeMarkup(pos, undefined, {
                id,
                loading: false,
                src: url,
              });

              foundPos = pos;
              nodeSize = node.nodeSize;
              return false;
            }
            return true;
          });

          if (foundPos !== null) {
            const after = foundPos + nodeSize;
            const nextNode = tr.doc.nodeAt(after);

            if (nextNode?.type.name === "paragraph") {
              const resolved = tr.doc.resolve(after + 1);
              tr.setSelection(TextSelection.near(resolved));
            } else {
              const paragraph = schema.nodes.paragraph.createAndFill();
              if (paragraph) {
                tr.insert(after, paragraph);
                const resolved = tr.doc.resolve(after + 1);
                tr.setSelection(TextSelection.near(resolved));
              }
            }
          }

          return true;
        })
        .run();
      editor.commands.focus();
    };
    reader.readAsDataURL(file);
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
    {#if view !== "full"}
      <div
        class="button view-change"
        on:click={changeView}
        class:active={view === "second"}
        class:disabled={titleInFocus}
      >
        <Add />
      </div>
    {/if}

    {#each viewMap[view] as { icon, cb, id, options }}
      {#if id === "heading"}
        <DropDownInput
          {options}
          value={selectedHedings}
          class="dropdown {titleInFocus ? 'disabled' : ''}"
          on:change={cb}
        >
          <div slot="option" class="dropdow-item {id}" let:option>
            <div class="icon-wrapper {option.id?.toString()}">
              <svelte:component this={option?.icon} />
            </div>
          </div>
        </DropDownInput>
      {:else}
        <div
          in:fly={{ x: -100, duration: 200 }}
          class="button"
          class:disabled={titleInFocus}
          class:active={isActive(editor, id)}
          on:mousedown|preventDefault
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
          stroke: var(--colors-base-white) !important;
        }
      }
      &.disabled {
        // background-color: ;
        pointer-events: none;
        background: var(--colors-background-bg-disabled, #f7f7f7);
        :global(path) {
          stroke: var(--colors-foreground-fg-disabled, #8c8c8c) !important;
        }
      }
    }

    :global(.dropdown) {
      width: 44px !important;
      height: 44px !important;
    }

    :global(.dropdown.disabled) {
      background: var(--colors-background-bg-disabled, #f7f7f7);
      width: 65px !important;
      pointer-events: none;
      border-radius: var(--radius-md, 8px);
      cursor: pointer;
    }

    // :global(.dropdown-input) {
    // }
    :global(.dropdown .input-element) {
      padding: 0 !important;
      max-width: 100%;
      border: none !important;
      gap: 2px !important;
      justify-content: center !important;
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
    :global(.dropdown .list-item:hover .icon-wrapper:not(.p) svg path) {
      fill: var(--colors-base-white) !important;
    }
    :global(.dropdown .list-item:hover .icon-wrapper svg path) {
      stroke: var(--colors-base-white) !important;
    }
    :global(.dropdown .list-item.active) {
      background-color: var(
        --component-colors-components-buttons-primary-button-primary-bg
      ) !important;
    }
    :global(.dropdown .icon-wrapper) {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: -2px;
    }

    :global(.dropdown .list-item.active .icon-wrapper:not(.p) svg path) {
      fill: var(--colors-base-white) !important;
    }
    :global(.dropdown .list-item.active .icon-wrapper svg path) {
      stroke: var(--colors-base-white) !important;
    }
    :global(.dropdown.disabled .icon-wrapper:not(.p) path) {
      fill: var(--colors-foreground-fg-disabled, #8c8c8c) !important;
    }
    :global(.dropdown.disabled .icon-wrapper path) {
      stroke: var(--colors-foreground-fg-disabled, #8c8c8c) !important;
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
