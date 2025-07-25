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
  import { page } from "$app/stores";
  import Badge from "$lib/components/ui/Badge.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import SportsTackList from "$lib/components/ui/composed/sportstack_list/SportsTackList.svelte";
  import session from "$lib/store/session.js";
  import { createEventDispatcher } from "svelte";
  import ArticleCard from "../authors/common_ui/articles/Article-Card.svelte";
  import UsersList from "../authors/common_ui/users_list/UsersList.svelte";
  import search_store from "$lib/store/search_store.js";
  import type { IBetarenaUser } from "@betarena/scores-lib/types/_FIREBASE_.js";
  import ArticleLoader from "../authors/common_ui/articles/Article-Loader.svelte";
  import LoaderBadge from "$lib/components/ui/loaders/LoaderBadge.svelte";
  import NoResults from "./NoResults.svelte";

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
  const dispatch = createEventDispatcher();
  $: ({ viewportType } = $session);
  $: articles = $search_store.articles.data || new Map();
  $: users = ($search_store.users.data || new Map()) as Map<
    string,
    IBetarenaUser
  >;
  $: sportstacks = $search_store.sportstacks.data || new Map();
  $: firstThreeUsers = new Map(Array.from(users.entries()).slice(0, 3));
  $: firstThreeArticles = new Map(Array.from(articles.entries()).slice(0, 3));
  $: firstThreeSportstacks = new Map(
    Array.from(sportstacks.entries()).slice(0, 3)
  );
  $: mobile = viewportType === "mobile";
  $: tablet = viewportType === "tablet";
  $: ({ translations } = $page.data);
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

  function viewMore(id: string) {
    dispatch("changeTab", { id });
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
<div class="wrapper {viewportType}">
  {#if !users.size && !$search_store.users.loading && !articles.size && !$search_store.articles.loading && !sportstacks.size && !$search_store.sportstacks.loading && !$search_store.tags.data.size && !$search_store.tags.loading}
    <div class="section">
      <NoResults />
    </div>
  {:else}
    {#if users.size || $search_store.users.loading}
      <div class="section">
        <UsersList
          users={firstThreeUsers}
          limit={3}
          size="lg"
          {translations}
          loading={$search_store.users.loading && !firstThreeUsers.size}
          includePermalink={true}
        />
        {#if users.size > 3}
          <div class="button-wrapp">
            <Button
              size="md"
              full={true}
              type="secondary"
              on:click={() => viewMore("users")}>{translations?.view_more || "View more" }</Button
            >
          </div>
        {/if}
      </div>
    {/if}
    {#if sportstacks.size || $search_store.sportstacks.loading}
      <div class="section">
        <SportsTackList
          size="lg"
          limit={3}
          loading={$search_store.sportstacks.loading &&
            !firstThreeSportstacks.size}
          sportstacks={firstThreeSportstacks}
          {translations}
          includePermalink={true}
        />
        {#if sportstacks.size > 3}
          <div class="button-wrapp">
            <Button
              size="md"
              full={true}
              type="secondary"
              on:click={() => viewMore("sportstacks")}>{translations?.view_more || "View more" }</Button
            >
          </div>
        {/if}
      </div>
    {/if}
    {#if $search_store.tags.data.size || $search_store.tags.loading}
      <div class="section">
        <div class="tags_wrapper">
          {#if $search_store.tags.loading && !$search_store.tags.data.size}
            {#each Array(10) as _item}
              <LoaderBadge />
            {/each}
          {:else}
            {#each [...$search_store.tags.data.entries()] as [id, tag] (id)}
                <Badge link="a/tag/{tag.permalink}">{tag.name}</Badge>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
    {#if articles.size || $search_store.articles.loading}
      <div class="section">
        <div class="articles-wrapper">
          {#each [...firstThreeArticles.entries()] as [id, article] (id)}
            <ArticleCard {mobile} {article} {tablet} />
          {/each}
          {#if articles.size > 3}
            <div class="button-wrapp">
              <Button
                size="md"
                full={true}
                type="secondary"
                on:click={() => viewMore("posts")}>{translations?.view_more || "View more" }</Button
              >
            </div>
          {/if}
          {#if !firstThreeArticles.size && $search_store.articles.loading}
            {#each Array(10) as _item}
              <ArticleLoader {mobile} {tablet} />
            {/each}
          {/if}
        </div>
      </div>
    {/if}
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
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 100%;
    max-height: 100%;
    overflow: auto;

    .section {
      display: flex;
      flex-direction: column;
      background: transparent;
      width: 100%;
      .button-wrapp {
        width: 100%;
        display: flex;
        padding-bottom: 16px;
        padding-inline: 16px;
      }
      &:last-of-type {
        padding-bottom: 84px;
        flex-grow: 1;
      }
    }

    .tags_wrapper {
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      background:transparent;
      gap: 16px 10px;
      overflow: hidden;
      max-height: calc((26px + 16px) * 3 + 16px) ;
    }
    .articles-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 16px;
      background: transparent
    }
    &.mobile {
      :global(.card-wrapper) {
        padding-block: 0;
      }
      .section {
        background: var(--colors-background-bg-secondary);
        :global(.wrapper) {
          background: var(--colors-background-bg-secondary);
        }
        :global(.card-wrapper) {
          background: var(--colors-background-bg-secondary);
        }

      }
      .tags_wrapper {
        background: var(--colors-background-bg-secondary);
      }
      .articles-wrapper {
        background: var(--colors-background-bg-secondary);
      }
      .tags-wrapper {
        background: var(--colors-background-bg-secondary);
      }
    }
    &:not(.mobile) {
      .button-wrapp {
        padding-inline: 0;
      }
      gap: 21px;
      :global(.list-wrapper) {
        gap: 21px;
      }
      :global(.list-item) {
        padding-block: 0;
      }
      .section {
        padding-block: 0;
        gap: 21px;

        .button-wrapp {
          padding-bottom: 0;
        }
        :global(.wrapper) {
          padding-block: 0;
        }
      }
      .tags_wrapper  {
        padding-inline: 0;
      }
      .articles-wrapper {
        gap: 21px;
        padding-top: 0;
      }
    }
  }
</style>
