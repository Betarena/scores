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
  import { page } from "$app/stores";
  import { fetchArticlesBySportstack } from "$lib/components/section/authors/common_ui/helpers.js";
  import {
    type IArticle,
    prepareArticlesMap,
  } from "$lib/components/section/authors/page/helpers.js";
  import Button from "$lib/components/ui/Button.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/publication/[permalink]/[lang=lang]/$types.js";
  import type {
    AuthorsAuthorsMain,
    TranslationSportstacksSectionDataJSONSchema,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { writable } from "svelte/store";
  import WidgetMenuOpt from "../Widget-MenuOpt.svelte";
  import { articleFilterStore, type IArticleFilter } from "./editor/helpers.js";
  import PublicationArticles from "./PublicationArticles.svelte";
  import PublicationHome from "./PublicationHome.svelte";
  import PublicationSettings from "./PublicationSettings.svelte";
  import PublicationSubscribers from "./PublicationSubscribers.svelte";

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

  const viewMap = {
    home: PublicationHome,
    articles: PublicationArticles,
    subscribers: PublicationSubscribers,
    settings: PublicationSettings,
  };

  let selectedSportstack = writable(
    {} as AuthorsAuthorsMain & { label: string }
  );
  let loadingArticles = false;
  let articles: Map<number, IArticle> = new Map();
  let recentArticles: Map<number, IArticle> = new Map();
  let recentLoading = false;
  let sportstacks = [] as( AuthorsAuthorsMain & { label: string })[];
  let nextPage = 0;
  let totalPageCount = 1;

  $: ({ viewportType } = $session);
  $: ({ theme } = { ...$userSettings });
  $: translations = (data as any).RESPONSE_PROFILE_DATA
    .sportstack2 as TranslationSportstacksSectionDataJSONSchema;

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

  $: if (data.sportstack instanceof Promise) {
    console.log("data.sportstack is a promise");
  } else {
    const sorted =
      data.sportstacks?.sort((a, b) => {
        return (
          new Date(b.data?.creation_date || "").getTime() -
          new Date(a.data?.creation_date || "").getTime()
        );
      }) || [];
    sportstacks = sorted.map((s) => {
      const sportstack = { ...s, label: s.data?.username || "" };
      if (sportstack.permalink === $page.params.permalink) {
        $selectedSportstack = sportstack;
      }
      return sportstack;
    });
  }

  $: tabs = [
    { id: 1, label: translations?.home || "Home", view: "home" },
    { id: 2, label: translations?.articles || "Articles", view: "articles" },
    { id: 3, label: translations?.subscribers || "Subscribers", view: "subscribers" },
    { id: 4, label: translations?.settings || "Settings", view: "settings" },
  ];

  $: view = $page.url.searchParams.get("view") || "home";
  $: selected = tabs.find((tab) => tab.view === view) || tabs[0];

  $: sportstacks = sportstacks.map((s) => {
    if (s.id === $selectedSportstack.id) return {...$selectedSportstack, label: $selectedSportstack.data?.username || ""};
    return { ...s, label: s.data?.username || "" };
  });

  let previousSportstack

  $: if ($selectedSportstack && $selectedSportstack?.permalink !== previousSportstack?.permalink) {
    previousSportstack = $selectedSportstack;
    getResentArticles();
    updateArticles();
  }

  $: if ($articleFilterStore.status && $articleFilterStore.sortBy) {
    filterArticles($articleFilterStore);
  }

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

  function updateArticles() {
    filterArticles($articleFilterStore);
  }

  function change(e) {
    const url = $page.url;
    url.searchParams.set("view", e.detail.view);
    goto(url, { replaceState: true, noScroll: true });
    view = e.detail.view;
  }

  function deleteArticle(e) {
    const id = e.detail;
    articles.delete(id);
    articles = new Map(articles);
    recentArticles.delete(id);
    recentArticles = new Map(recentArticles);
  }

  async function selectSportstack(e) {
    const url = $page.url;
    const { permalink } = e.detail as AuthorsAuthorsMain;
    const lang = url.pathname.split("/").at(-1);

    await goto(`/u/author/publication/${permalink}/${lang}${url.search}`, {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
    $selectedSportstack = e.detail as AuthorsAuthorsMain & { label: string };
  }


  async function getArticles(page: number, filter: IArticleFilter) {
    const { status, sortBy } = filter;
    const options = {
      status,
    };
    options[sortBy] = sortBy === "sortTitle" ? "asc" : "desc";
    const data = await fetchArticlesBySportstack({
      permalink: $selectedSportstack.permalink,
      page,
      options,
    });
    let nextArticles = new Map();
    if (data) {
      nextArticles = prepareArticlesMap(
        new Map(data.mapArticle),
        new Map(data.mapTag),
        new Map(data.mapAuthor)
      );
    }
    return { data, nextArticles };
  }

  async function filterArticles(filter: IArticleFilter) {
    loadingArticles = true;
    articles = new Map();
    try {
      const { data, nextArticles } = await getArticles(0, filter);
      totalPageCount = data.totalPageCount;
      articles = nextArticles;
      nextPage = 0;
      loadingArticles = false;
    } catch (e) {
      loadingArticles = false;
    }
  }

  async function loadMore() {
    if (nextPage < totalPageCount - 1) {
      loadingArticles = true;
      nextPage++;
      const { data, nextArticles } = await getArticles(
        nextPage,
        $articleFilterStore
      );
      if (data) {
        totalPageCount = data.totalPageCount;
        articles = new Map([...articles, ...nextArticles]);
      }
      loadingArticles = false;
    }
  }

  async function getResentArticles() {
    recentLoading = true;
    recentArticles = new Map();
    const { data, nextArticles } = await getArticles(0, {
      status: "published",
      sortBy: "sortPublishDate",
    });
    if (data) {
      recentArticles = nextArticles;
    } else {
      recentArticles = new Map();
    }
    recentLoading = false;
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
    <div id="publication-home" class="{viewportType} {view} view-wrapper">
      <div class="header-wrapper">
        <div class="header">
          <div class="title-wrapper">
            {#if viewportType === "mobile"}
              <DropDownInput
                checkIcon={true}
                options={sportstacks}
                on:change={selectSportstack}
                value={$selectedSportstack}
              />
            {/if}
            <h2>{translations?.[view] || selected.label}</h2>
            <div class="actions-buttons">
              {#if viewportType !== "mobile"}
                <DropDownInput
                  checkIcon={true}
                  options={sportstacks}
                  on:change={selectSportstack}
                  value={$selectedSportstack}
                  size="sm"
                />
              {/if}
              {#if viewportType === "desktop"}
                <a href="/u/author/{$page.params.lang}">
                  <Button type="terlary-gray" size="sm">{translations?.go_back}</Button>
                </a>
                {#if view === "home"}
                  <a
                    href="/a/sportstack/{$selectedSportstack?.permalink}"
                    style="margin-left: -10px !important; margin-right: -8px !important"
                  >
                    <Button type="secondary-gray" size="sm"
                      >{translations?.view_sportstacks}</Button
                    >
                  </a>
                {/if}
                {#if view !== "settings"}
                  <a
                    href="/u/author/article/create/{$userSettings.lang}?sportstack={$selectedSportstack?.permalink}"
                  >
                    <Button full={true} type="primary" size="sm"
                      >+ {translations?.new_article}</Button
                    >
                  </a>
                {/if}
              {/if}
            </div>
          </div>
          <Tabbar
            on:select={change}
            type="button_brand"
            size={viewportType === "mobile" ? "sm" : "md"}
            data={tabs}
            bind:selected
          />
        </div>
      </div>
      <svelte:component
        this={viewMap[view]}
        loadingArticles={view === "home" ? recentLoading : loadingArticles}
        articles={view === "home" ? recentArticles : articles}
        {sportstacks}
        {translations}
        showLoadButton={nextPage < totalPageCount - 1}
        on:loadMore={loadMore}
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

    }

    .view-wrapper {
      max-width: 100%;
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
      min-height: calc(var(--vh, 1vh) * 100 - 56px - 22px - 5px);
      padding-bottom: 22px;

      .header-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xl, 16px);
        :global(.tabbar) {
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
      min-height: calc(var(--vh, 1vh) * 100 - 128px);

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
      min-height: calc(var(--vh, 1vh) * 100 - 128px);

      #publication-home {
        min-height: unset;
        gap: var(--spacing-2xl, 20px);

        .header-wrapper {
          display: flex;
          gap: 24px;
          width: 100%;

          .header {
            gap: var(--spacing-2xl, 20px);

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
