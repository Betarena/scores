<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Main Scores Homepage Page Layout                                                 │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { sessionStore } from '$lib/store/session.js';
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
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import sessionStore from "$lib/store/session.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { generateUrlCompetitions } from "$lib/utils/string.js";
  import { browser } from "$app/environment";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";

  $: ({ serverLang } = $sessionStore);
  $: [preferedPage] = $userBetarenaSettings.user?.scores_user_data
    ?.buttons_order || ["scores"];
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: {
    let url = $page.url.pathname;
    switch (preferedPage) {
      case "competitions":
        url = generateUrlCompetitions(
          serverLang || "",
          $page.data.B_SAP_D3_CP_H
        );
        break;
      case "content":
        url =
          trsanslationData?.scores_header_translations?.section_links
            ?.sports_content_url;
        break;
      case "scores":
      default:
        url = `/${serverLang === "en" ? "" : `${serverLang}/`}scores`;
    }
    if (browser) {
      goto(url);
    }
  }
  // #endregion ➤ 📦 Package Imports
</script>

<section />

<style>
  section {
    height: 100%;
  }
</style>
