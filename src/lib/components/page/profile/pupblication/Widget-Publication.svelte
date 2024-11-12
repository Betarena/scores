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

  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/publication/[permalink]/[lang=lang]/$types.js";
  import session from "$lib/store/session.js";
  import WidgetMenuOpt from "../Widget-MenuOpt.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import PublicationHome from "./PublicationHome.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import PublicationArticles from "./PublicationArticles.svelte";
  import PublicationSettings from "./PublicationSettings.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import userSettings from "$lib/store/user-settings.js";
  import type { AuthorsAuthorsMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { fetchArticlesBySportstack } from "$lib/components/section/authors/common_ui/helpers.js";
  import { browser } from "$app/environment";
  import {
    type IArticle,
    prepareArticlesMap,
  } from "$lib/components/section/authors/page/helpers.js";
  import { articleFilterStore } from "./editor/helpers.js";

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
  $: ({ translate } = data);
  $: ({ viewportType } = $session);
  $: ({ theme } = { ...$userSettings });
  let selectedSportstack;
  let loadingArticles = false;
  let articles: Map<number, IArticle> = new Map();
  let sportstacks = [] as AuthorsAuthorsMain & { label: string }[];
  $: if (data.sportstack instanceof Promise) {
    console.log("data.sportstack is a promise");
  } else {
    const  sorted = data.sportstacks?.sort((a, b) => {
      return new Date(b.data?.creation_date || "").getTime() - new Date(a.data?.creation_date || "").getTime()
    }) || [];
    sportstacks = sorted.map((s) => {
      const sportstack = { ...s, label: s.data?.username || "" };
      if (sportstack.permalink === $page.params.permalink) {
        selectedSportstack = sportstack;
      }
      return sportstack;
    });
  }
  $: if (selectedSportstack && browser) {
    getArticles();
  }

  // #endregion ➤ 📌 VARIABLES

  const tabs = [
    { id: 1, label: "Home", view: "home" },
    { id: 2, label: "Articles", view: "articles" },
    { id: 3, label: "Settings", view: "settings" },
  ];

  const viewMap = {
    home: PublicationHome,
    articles: PublicationArticles,
    settings: PublicationSettings,
  };

  function change(e) {
    const url = $page.url;
    url.searchParams.set("view", e.detail.view);
    goto(url, { replaceState: true, noScroll: true });
    view = e.detail.view;
  }

  async function selectSportstack(e) {
    const url = $page.url;
    const { permalink } = e.detail as AuthorsAuthorsMain;
    const lang = url.pathname.split("/").at(-1);
    selectedSportstack = e.detail as AuthorsAuthorsMain;
    getArticles();
    goto(`/u/author/publication/${permalink}/${lang}${url.search}`, {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
  }
  $: view = $page.url.searchParams.get("view") || "home";
  $: selected = tabs.find((tab) => tab.view === view) || tabs[0];

  async function getArticles() {
    loadingArticles = true;
    articles = new Map();
    const {status, sortBy} = $articleFilterStore;
    const options = {
      status,
    }
    options[sortBy] = sortBy === "sortTitle" ? "asc" : "desc";
    const data = await fetchArticlesBySportstack({
      permalink: selectedSportstack.permalink,
      options
    });
    loadingArticles = false;
    if (data) {
      articles = prepareArticlesMap(
        new Map(data.mapArticle),
        new Map(data.mapTag),
        new Map(data.mapAuthor)
      );
    } else {
      articles = new Map();
    }
  }

  function deleteArticle(e) {
    const id = e.detail;
    articles.delete(id);
    articles = new Map(articles);
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

<Container hFull={false}>
  <div
    class="publication-widget-wrapper {viewportType}"
    class:light-mode={theme == "Light"}
  >
    {#if viewportType === "desktop"}
      <div class="menu">
        <WidgetMenuOpt />
      </div>
    {/if}
    <div id="publication-home" class="{viewportType} {view}">
      <div class="header-wrapper">
        <div class="header">
          <div class="title-wrapper">
            {#if viewportType === "mobile"}
              <DropDownInput
                checkIcon={true}
                options = {sportstacks}
                on:change={selectSportstack}
                value={selectedSportstack}
              />
            {/if}
            <h2>{translate?.[view] || selected.label}</h2>
            <div class="actions-buttons">
              {#if viewportType !== "mobile"}
                <DropDownInput
                  checkIcon={true}
                  options = {sportstacks}
                  on:change={selectSportstack}
                  value={selectedSportstack}
                />
              {/if}
              {#if viewportType === "desktop"}
                <Button type="terlary-gray" on:click={() => history.back()}>
                  Go Back
                </Button>
                {#if view === "home"}
                  <a
                    href="/a/sportstack/{selectedSportstack?.permalink}"
                    style="margin-left: -10px !important; margin-right: -8px !important"
                  >
                    <Button type="secondary-gray">View sportstack</Button>
                  </a>
                {/if}
                {#if view !== "settings"}
                  <a
                    href="/u/author/article/create/{$userSettings.lang}?sportstack={selectedSportstack?.permalink}"
                  >
                    <Button full={true} type="primary">+ New article</Button>
                  </a>
                {/if}
              {/if}
            </div>
          </div>
          <Tabbar
            on:select={change}
            type="underline"
            size="md"
            data={tabs}
            bind:selected
          />
        </div>
      </div>
      <svelte:component
        this={viewMap[view]}
        {loadingArticles}
        {articles}
        {sportstacks}
        on:reloadArticles={getArticles}
        on:changeView={change}
        on:deleteArticle={deleteArticle}
        {selectedSportstack}
      />
    </div>
  </div>
</Container>

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
  .publication-widget-wrapper {
    margin-top: 24px;
    // overflow: hidden;
    display: flex;
    flex-grow: 1;

    &.light-mode {
      --component-colors-components-buttons-tertiary-button-tertiary-fg: var(
        --colors-gray-400
      );
      .header-wrapper {
        :global(.tabbar) {
          border-bottom: 1px solid #e6e6e6 !important;
        }
      }
    }

    :global(*::-webkit-scrollbar) {
      width: 8px;
    }
    :global(*::-webkit-scrollbar-track) {
      background: inherit;
    }
    :global(*::-webkit-scrollbar-thumb) {
      background: var(--colors-background-bg-quaternary);
      border-radius: 4px;
    }

    #publication-home {
      display: flex;
      padding: var(--spacing-none, 0px);
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-3xl, 24px);
      flex-grow: 1;
      align-self: stretch;
      min-height: calc(100vh - 56px - 22px - 5px);
      padding-bottom: 22px;

      .header-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xl, 16px);
        :global(.tabbar) {
          border-bottom: 1px solid
            var(--colors-border-border-secondary, #3b3b3b);
          width: 100%;
        }

        .header,
        .title-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-xl, 16px);
          align-self: stretch;
          h2 {
            color: var(--colors-text-text-primary-900, #fbfbfb);
            margin: 0;

            /* Display xs/Semibold */
            font-family: var(--font-family-font-family-display, Roboto);
            font-size: var(--font-size-display-xs, 24px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-xs, 32px); /* 133.333% */
          }

          .actions-buttons {
            width: 100%;
          }
        }
        .header {
          gap: 0;
          :global(.field) {
            height: 65px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }
      }
    }

    &.desktop {
      margin-top: 0;
      display: flex;
      align-items: start;
      gap: var(--spacing-2xl, 20px);
      padding-top: var(--spacing-5xl, 40px);
      padding-bottom: 72px;
      min-height: calc(100vh - 128px);

      .menu {
        flex-shrink: 0;
        min-width: 328px;
      }

      #publication-home {
        padding: var(--spacing-2xl, 20px);
        min-height: unset;
        gap: var(--spacing-2xl, 20px);

        .header-wrapper {
          display: flex;
          gap: 24px;
          width: 100%;

          .header {
            width: 100%;
            flex-grow: 1;
            gap: 24px;
            .title-wrapper {
              display: flex;
              justify-content: space-between;
              flex-direction: row;
              align-items: center;

              h2 {
                font-size: var(--font-size-text-xl, 20px);
                font-style: normal;
                font-weight: 600;
                line-height: var(--line-height-text-xl, 30px); /* 150% */
              }

              .actions-buttons {
                display: flex;
                height: 44px;
                justify-content: flex-end;
                align-items: center;
                gap: 20px;

                :global(.field) {
                  min-width: 343px;
                  height: unset;
                }
                .back {
                  display: flex;
                  padding: 10px var(--spacing-xl, 16px);
                  justify-content: center;
                  align-items: center;
                  gap: var(--spacing-sm, 6px);
                  cursor: pointer;

                  color: var(
                    --component-colors-components-buttons-tertiary-button-tertiary-fg,
                    #8c8c8c
                  );

                  /* Text md/Medium */
                  font-family: var(--font-family-font-family-body, Roboto);
                  font-size: var(--font-size-text-md, 16px);
                  font-style: normal;
                  font-weight: 500;
                  line-height: var(--line-height-text-md, 24px); /* 150% */
                }
              }
            }
          }
        }
      }
    }
    &.tablet {
      margin-top: 0;
      display: flex;
      align-items: start;
      gap: var(--spacing-2xl, 20px);
      padding-top: var(--spacing-5xl, 40px);
      padding-bottom: 72px;
      min-height: calc(100vh - 128px);

      #publication-home {
        min-height: unset;
        gap: var(--spacing-2xl, 20px);

        .header-wrapper {
          display: flex;
          gap: 24px;
          width: 100%;

          .header {
            gap: var(--spacing-2xl, 20px);
            :global(.tabbar) {
              border-bottom: 1px solid
                var(--colors-border-border-secondary, #3b3b3b);
            }
            .title-wrapper {
              display: flex;
              justify-content: space-between;
              flex-direction: row;
              align-items: center;

              .actions-buttons {
                display: flex;
                justify-content: flex-end;
              }

              :global(.field) {
                max-width: 351px;
                width: 100%;
                height: unset;
              }
              h2 {
                min-width: 169px;
              }
            }
          }
        }
      }
    }
  }
</style>
