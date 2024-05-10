<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { page } from "$app/stores";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { generateUrlCompetitions } from "$lib/utils/string.js";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import HeaderNavBtn from "./Header-Nav-Btn.svelte";

  interface INavBtnData {
    key: "scores" | "content" | "competitions";
    url: string | undefined;
    navTxt: string;
    isNew: boolean;
    newTxt: string;
    id: string;
  }

  export let /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [575, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true],
    translationData;


  $: ({ buttons_order } = {
    ...$userBetarenaSettings.user?.scores_user_data,
  });
  $: navButtonOrderList = [
    {
      id: "scores",
      key: "scores",
      url: `${$sessionStore.serverLang !== "en" ? `/${$sessionStore.serverLang}` : ""}/scores`,
      navTxt:
        translationData?.scores_header_translations?.section_links
          ?.scores_title ?? "SCORES",
      isNew: false,
    },
    {
      id: "content",
      key: "content",
      url: translationData?.scores_header_translations?.section_links
        ?.sports_content_url,
      navTxt:
        translationData?.scores_header_translations?.section_links
          ?.sports_content_title ?? "SPORTS CONTENT",
      isNew: false,
      newTxt: "New",
    },
    {
      id: "competitions",
      key: "competitions",
      url: generateUrlCompetitions(
        $sessionStore.serverLang!,
        $page.data.B_SAP_D3_CP_H
      ),
      navTxt:
        translationData?.scores_header_translations?.section_links
          ?.competitions_title ?? "COMPETITIONS",
      isNew: false,
      newTxt: "New",
    },
  ] as INavBtnData[];

  $: if (buttons_order) {
    navButtonOrderList = buttons_order?.map((id) =>
      navButtonOrderList.find((btn) => btn.id === id)
    );
  }
</script>

{#each navButtonOrderList as item}
  <HeaderNavBtn
    navKey={item.key}
    navUrl={item.url}
    navTxt={item.navTxt}
    isNew={item.isNew}
    newTxt={item.newTxt}
    {VIEWPORT_TABLET_INIT}
    {VIEWPORT_MOBILE_INIT}
  />
{/each}
