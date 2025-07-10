<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import session from "$lib/store/session.js";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";
  import SeoBox from "$lib/components/SEO-Box.svelte";
  import { page } from "$app/stores";
  import ListSportsTackItem from "./ListSportsTackItem.svelte";
  import ListSportsTackLoader from "./ListSportsTackLoader.svelte";
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

  export let sportstacks = new Map(),
    translations: IPageAuthorTranslationDataFinal,
    loading = false,
    size: number | string = 40,
    limit = 10,
    action_button = true,
    includePermalink = false,
    emptyMessage = "";

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "author⮕followers⮕list";

  $: ({ viewportType } = $session);

  // #endregion ➤ 📌 VARIABLES
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
  {#each [...sportstacks] as [uid, user] (uid) }
    <h2>{user?.name || user.username}</h2>
    <a href={`${$page.url.origin}/a/user/${user?.usernamePermalink}`}
      >{user.usernamePermalink}</a
    >
  {/each}
</SeoBox>

<div class="wrapper {viewportType}" id={CNAME}>
  {#if !sportstacks.size && emptyMessage && !loading}
    <div class="empty">
      {emptyMessage}
    </div>
  {:else}
    <div class="list-wrapper">
      {#each [...sportstacks] as [uid, user] (uid)}
        <ListSportsTackItem {includePermalink} {user} {size} {translations} {action_button}/>
      {/each}
    </div>
  {/if}
  {#if loading}
    <div class="list-wrapper">
      {#each new Array(limit) as _item}
        <ListSportsTackLoader {includePermalink} {size} {action_button} />
      {/each}
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
  .wrapper {
    display: flex;
    padding-block: 8px;

    flex-direction: column;
    background-color: var(--colors-background-bg-primary);

    .list-wrapper {
      display: flex;
      flex-direction: column;
    }

    .empty {
      flex-grow: 1;
      width: 100%;
      height: 100%;
      background-color: var(--colors-background-bg-primary);
      font-weight: 600;
      color: var(--text-color-second);
      font-size: var(--text-size-2xl);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }
  }
</style>
