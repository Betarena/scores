<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/article/edit/[...permalink]/[lang=lang]/$types.js";
  import Editor from "./Editor.svelte";
  import XClose from "$lib/components/ui/assets/x-close.svelte";
  import BackButton from "$lib/components/ui/BackButton.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import type { AuthorsAuthorsMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import session from "$lib/store/session.js";
  import ModalArticleSeo from "./ModalArticleSEO.svelte";
  import Unpublish from "../Unpublish.svelte";
  import DeleteModal from "../DeleteModal.svelte";
  import component from "svelte-seo";
  export let data: PageData;

  $: ({ article = { data: {} } } = data);
  $: ({ title, content, featured_image, id } = article.data);

  $: if (featured_image) {
    content = `<img src="${featured_image}" alt="${title}" />${content}`;
  }

  let options: (AuthorsAuthorsMain & { label: string })[] = [];
  let selectedSportstack;
  let editor;
  $: if (data.sportstack instanceof Promise) {
    console.log("data.sportstack is a promise");
  } else {
    options = data.sportstacks.map((s) => {
      const sportstack = { ...s, label: s.data?.username || "" };
      if (sportstack.permalink === $page.url.searchParams.get("sportstack")) {
        selectedSportstack = sportstack;
      }
      return sportstack;
    });
    if (!selectedSportstack && browser) {
      selectedSportstack = options[0];
      const { url } = $page;
      url.searchParams.set("sportstack", selectedSportstack.permalink);
      goto(url, { replaceState: true, noScroll: true, keepFocus: true });
    }
  }

  $: ({ viewportType } = $session);

  function back() {
    history.back();
  }

  function selectSportstack(e) {
    const url = $page.url;
    const { permalink } = e.detail as AuthorsAuthorsMain;
    selectedSportstack = e.detail as AuthorsAuthorsMain;
    url.searchParams.set("sportstack", permalink);
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }

  function showModal(action: "unpublish" | "delete") {
    const modalState: any = {
      modal: true,
      show: true,
      props: { id },
      component: action === "delete" ? DeleteModal : Unpublish,
    };
    modalStore.set(modalState);
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
<div class="edit-article-wrapper">
  <Container hFull={false} clazz="sticky">
    <div class="header {viewportType}">
      <div on:click={back}>
        {#if viewportType === "mobile"}
          <XClose />
        {:else}
          <BackButton custom_handler={true} />
        {/if}
      </div>
      {#if viewportType === "desktop"}
        <DropDownInput
          {options}
          value={selectedSportstack}
          on:change={selectSportstack}
        />
      {/if}

      <div class="actions">
        <Button
          type="tertiary"
          destructive={true}
          on:click={() => showModal("delete")}>Delete Article</Button
        >
        <Button type="terlary-gray" on:click={() => showModal("unpublish")}
          >Unpublish</Button
        >
        {#if viewportType === "desktop"}
          <Button
            type="primary"
            disabled={!title ||
              editor?.getText().trim().split(/\s+/).length < 50}
            on:click={() => {
              $modalStore.component = ModalArticleSeo;
              $modalStore.modal = true;
              $modalStore.show = true;
            }}>Update & Publish</Button
          >
        {/if}
      </div>
    </div>
  </Container>
  <Editor {data} bind:editor {title} {content} />
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
  .edit-article-wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    height: 100vh;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: inherit;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--colors-background-bg-quaternary);
      border-radius: 4px;
    }
    :global(.sticky) {
      position: sticky !important;
      top: 0;
      z-index: 10000;
      background-color: var(--colors-background-bg-main);
    }
    .header {
      display: flex;
      height: 64px;
      align-items: center;
      gap: 20px;
      width: 100%;
      flex-shrink: 0;
      z-index: 1;
      align-self: stretch;
      justify-content: space-between;

      :global(.field) {
        flex-grow: 1;
        align-items: center;
        justify-content: center;
      }
      .actions {
        display: flex;

        justify-content: space-between;
        gap: var(--spacing-lg, 12px);
      }
      &.tablet {
        :global(.field .input-wrapper) {
          width: 100%;
          max-width: 343px;
          margin: 0 auto;
        }
      }

      &.desktop {
        gap: var(--spacing-3xl, 24px);
        margin-top: var(--spacing-2xl, 20px);
        padding-block: var(--spacing-2xl, 20px);
        height: 84px;
        :global(.field) {
          max-width: 343px;
        }

        .actions {
          flex-grow: 1;
          justify-content: flex-end;
          gap: var(--spacing-lg, 12px);
        }
      }
    }
    .editor-wrapper {
      flex-grow: 1; // Эта часть будет прокручиваться
    }
  }
</style>
