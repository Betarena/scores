<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format |:| V.8.0                                          │
│ ➤ Status |:| 🔒 LOCKED                                                           │
│ ➤ Author(s) |:| @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Betarena (Component) || Authors Content Main                                     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

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

  import { browser } from "$app/environment";
  import { page } from "$app/stores";

  import { get } from "$lib/api/utils.js";
  import sessionStore from "$lib/store/session.js";
  import { dlogv2 } from "$lib/utils/debug.js";
  import { mutateStringToPermalink } from "@betarena/scores-lib/dist/util/language.js";
  import userSettings from "$lib/store/user-settings.js";
  import { Betarena_User_Class } from "@betarena/scores-lib/dist/classes/class.betarena-user.js";

  import Button from "$lib/components/ui/Button.svelte";
  import { type ITagsWidgetData, type IArticle, prepareArticlesMap } from "../../helpers.js";
  import AuthorProfileHeader from "./AuthorProfileHeader.svelte";
  import ArticlesList from "../../../common_ui/articles/ArticlesList.svelte";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import AuthorProfileHeaderLoader from "./AuthorProfileHeaderLoader.svelte";
  import SeoBox from "$lib/components/SEO-Box.svelte";

  import type { BetarenaUser } from "$lib/types/types.user-settings.js";

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
  export let author, widgetData, translations, highlited_sportstack;
  $: ({ globalState, viewportType } = $sessionStore);
  $: ({ user } = $userSettings);
  $: isPWA = globalState.has("IsPWA");

  const BetarenaUsers = new Betarena_User_Class();
  let currentPage = 0;
  let isLoadingSubscribers = false;
  let author_subscribers_profiles: BetarenaUser[] = [];
  let prevAuthorId = "";
    /**
   * @description
   * 📝 Interecpted data for `map` instance of `author(s)`.
   */
  let mapAuthors = new Map();
   /**
   * @description
   * 📝 Interecpted data for `map` instance of `tag(s)`.
   */
  let mapTags = new Map();
   /**
   * @description
   * 📝 Interecpted data for `map` instance of `article(s)`.
   */
  let mapArticles = new Map();

  // $: isOwner = author?.uid === user?.firebase_user_data.uid;

    /**
   * @description
   * 📝 Update data only when the URL has changed.
   */



  $: isOwner = author?.uid === user?.firebase_user_data.uid;


  $: if (browser && author?.uid && prevAuthorId !== author?.uid) {
    prevAuthorId = author?.uid;
    updateData(widgetData ?? ({} as ITagsWidgetData), true);
    getSubscribers(author.subscribed_by);
  }

  $: noArticles =
    !mapArticles.size && !isLoadingArticles && !isLoadingSubscribers;

  let /**
     * @description
     * 📝 State UI for `Loading Articles`.
     */
    isLoadingArticles = false,
    /**
     * @description
     * 📝 `Map` data for `article(s)`, ready for frontend consumption.
     */
    mapArticlesMod = new Map<number, IArticle>();
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

  /**
   * @author
   *  izobov
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Get first 3 subscribers profiles
   * @param { string[] } subscribers_arr
   *  💠 **REQUIRED** New data instance.
   * @returns { void }
   */

  async function getSubscribers(subscribers_arr = []) {
    author_subscribers_profiles = [];
    if (!subscribers_arr.length) return;
    isLoadingSubscribers = true;
    const ids = subscribers_arr.slice(-3);
    const res = (await BetarenaUsers.obtainPublicInformationTargetUsers({query: {}, body:{user_uids: ids}}))?.success;
    if(res) {
      author_subscribers_profiles = [...res.data] as BetarenaUser[];
    }
    isLoadingSubscribers = false;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Update data for 'content' page.
   * @param { ITagsWidgetData } dataNew
   *  💠 **REQUIRED** New data instance.
   * @returns { void }
   */
  function updateData(dataNew: ITagsWidgetData, reset: boolean = false): void {
    // [🐞]
    dlogv2(
      "updateData(..) // START",
      [`🔹 [var] ➤ dataNew :|: ${dataNew}`],
      true
    );
    if (reset) {
      mapArticles = new Map();
      mapAuthors = new Map();
      mapTags = new Map();
      mapArticlesMod = new Map();
    }

    mapArticles = new Map([...mapArticles, ...dataNew.mapArticle]);
    mapAuthors = new Map([...mapAuthors, ...dataNew.mapAuthor]);
    mapTags = new Map([...mapTags, ...dataNew.mapTag]);

    const /**
       * @description
       * 📝 `Map` article generated from NEW data.
       */
      mapNewArticlesMod = prepareArticlesMap(
        new Map(dataNew.mapArticle),
        new Map(dataNew.mapTag),
        new Map(dataNew.mapAuthor)
      );
    mapArticlesMod = new Map([...mapArticlesMod, ...mapNewArticlesMod]);

    isLoadingArticles = false;

    // [🐞]
    dlogv2("updateData(..) // END", [], true);

    return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Custom handler for scroll logic.
   * @return { void }
   */
  function scrollHandler(): void {
    if (!isPWA) return;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5)
      loadMore();
    return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Check for instance of loading more articles.
   * @return { Promise < void > }
   */
  async function loadMore(): Promise<void> {
    // [🐞]
    dlogv2("loadMore(..)", [], true);
    isLoadingArticles = true;
    const /**
       * @description
       * 📝 Article length.
       */
      length = mapArticlesMod.size || 0;
    if (length >= widgetData.totalArticlesCount) return;

    loadTagArticles(currentPage + 1);

    return;
  }

  /**
   * @author
   *  <-insert-author->
   * @summary
   *  🟦 HELPER
   * @description
   *  📝 Load tag articles.
   * @param { number } [page=0]
   *  💠 **REQUIRED** Number page to request.
   * @return { Promise < void > }
   */
  async function loadTagArticles(page: number = 0): Promise<void> {
    // [🐞]
    dlogv2(
      "loadTagArticles(..) // START",
      [`🔹 [var] ➤ page |:| ${page}`],
      true
    );
    isLoadingArticles = true;
    const /**
       * @description
       * 📝 URL to be requested.
       */
      url = `/api/data/author/profile?uid=${author.uid}&page=${page}`;
    const /**
       * @description
       * 📝 Data Response (0).
       */
      dataRes0 = (await get(url)) as ITagsWidgetData;
    isLoadingArticles = false;
    updateData(dataRes0);
    currentPage = page;

    // [🐞]
    dlogv2("loadTagArticles(..) // END", [`🔹 [var] ➤ page |:| ${page}`], true);
    if (!dataRes0) return;
    return;
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

<SeoBox>
  <h1>{author.name || author.username}</h1>
  <b>{author?.about}</b>
  <a href={`${$page.url.origin}/a/user/${author.usernameLower}/subscribers`}>
    subscribers
  </a>
  <a href={`${$page.url.origin}/a/user/${author.usernameLower}/followers`}>
    followers
  </a>
  <a href={`${$page.url.origin}/a/user/${author.usernameLower}/following`}>
    following
  </a>
  {#each widgetData.mapArticle ?? [] as [_id, article]}
    <h2>{article?.data?.title}</h2>
    <a href={`${$page.url.origin}/a/${article?.permalink}`}
      >{article?.data?.title}</a
    >
  {/each}
  {#each author_subscribers_profiles as profile}
    <h3>{profile?.name || profile?.username}</h3>
    <a href="/a/user/${mutateStringToPermalink(profile?.usernameLower)}" />
  {/each}
</SeoBox>
<svelte:window on:scroll={scrollHandler} />

<!--
╭─────
│ > User profile info
╰─────
-->

{#if isLoadingSubscribers}
  <AuthorProfileHeaderLoader />
{:else}
  <AuthorProfileHeader
    {author}
    {highlited_sportstack}
    {translations}
    subscribers_profiles={author_subscribers_profiles}
  />
{/if}
<!--
╭─────
│ > User articles
╰─────
-->
{#if noArticles}
  <div class="no-articles {viewportType}">
    <div class="text">
      <TranslationText
        text={translations.no_articles}
        fallback="No articles at this moment.Come back later"
      />
    </div>
    <!-- [TODO] Uncomment when creation logic is implemented -->
    <!-- {#if isOwner}
      <Button type="primary">Create new article</Button>
    {/if} -->
  </div>
{:else}
  <div class="content {viewportType}" class:empty={noArticles}>
    {#if noArticles}{:else}
      <ArticlesList
        articles={isLoadingSubscribers ? [] : mapArticlesMod}
        {translations}
        isLoadingArticles={isLoadingArticles || isLoadingSubscribers}
      />
    {/if}

    {#if !isPWA && mapArticlesMod.size < widgetData?.totalArticlesCount && !isLoadingArticles && !isLoadingSubscribers}
      <div class="load-more">
        <Button type="outline" on:click={loadMore}>
          <TranslationText text={translations.view_more} fallback="View More" />
        </Button>
      </div>
    {/if}
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
  .content {
    max-width: 1265px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-top: 28px;

    &.mobile {
      margin-top: 0;
    }
  }

  .no-articles {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background: var(--bg-color);
    margin-top: 44px;
    flex-grow: 1;
    padding-top: 80px;
    border-top: var(--header-border);

    .text {
      color: var(--text-color);
      opacity: 0.8;
      max-width: 179px;
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }

    &.mobile {
      margin-top: -8px;
      border: none;
      padding-top: 52px;
    }
  }

  .load-more {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 34px 0;
    background: var(--bg-color);
  }

  .content {
    &.tablet {
      padding: 26px 34px;
      padding-top: 32px;
      padding-inline: 0;
      padding-bottom: 0 !important;
      margin: 0 !important;
      width: 100%;

      &.pwa {
        padding-bottom: 128px !important;
      }

      .add-icon {
        margin-top: 0;
      }
    }

    &.mobile {
      background: var(--layout-bg-color);
      padding: 0 !important;
      padding-bottom: 128px;
      width: 100%;
      gap: 8px;
      --text-size-2xl: 24px;
      --text-size-l: 16px;
      --text-size-m: 14px;
      --text-size-s: 12px;
      --text-size-xs: 10px;

      .tabbar-wrapper {
        padding: 0px 16px;
      }

      .add-icon {
        margin-top: 0;
      }
    }
  }
</style>
