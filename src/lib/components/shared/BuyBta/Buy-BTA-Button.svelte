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
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import Button from "$lib/components/ui/Button.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { modalStore } from "$lib/store/modal.js";
  import BuyBtaPopup from "./Buy-BTA-popup.svelte";
  import { get } from "$lib/api/utils.js";
  import buyOptionsTranslations from "./store"
  import sessionStore  from "$lib/store/session.js";

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

  export let popup = true;

  const dispatch = createEventDispatcher();

  let prevLang = "";

  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: fetchOptions($sessionStore.serverLang)
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

  function click() {
    dispatch("click");
    if (popup) {
      modalStore.update((s) => ({
        show: true,
        modal: true,
        component: BuyBtaPopup as any,
      }));
    }
  }


  async function fetchOptions(lang?: string) {
    if (prevLang === lang || !lang) return;
    prevLang = lang;
    const res = await get(`/api/data/main/userguide?userguideId=3&lang=${lang}`) as any;
    if (res?.content) {
      $buyOptionsTranslations = res.content as any;
    }
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<Button type="primary" on:click={click}>
  {trsanslationData?.scores_header_translations?.data?.cta_buy ?? "Buy BTA"}
</Button>
