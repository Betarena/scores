<script lang="ts">
  import { page } from "$app/stores";
  import UsersList from "../authors/common_ui/users_list/UsersList.svelte";
  import NoResults from "./NoResults.svelte";
  import  search_store  from "$lib/store/search_store.js";
  import type { IBetarenaUser } from "@betarena/scores-lib/types/_FIREBASE_.js";

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


  $: users = ($search_store.users.data || new Map()) as Map<string, IBetarenaUser>;
  $: ({ translations } = $page.data);

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
<div class="wrapper">
  {#if users.size || $search_store.users.loading}
    <UsersList includePermalink={true} {users} size="lg" {translations}/>
  {:else}
    <NoResults/>
  {/if}
</div>


<style lang="scss">
  .wrapper {
    flex-grow: 1;
    max-height: 100%;
    min-height: 100%;
    overflow: auto;
    padding-bottom: 100px;
    background: var(--colors-background-bg-main);
  }
</style>