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
│ Scores Footer Component                                                          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { B_NAV_T } from './../../../../../../scores-lib/types/navbar.d.ts';
	import Linkedin from './assets/icon_redisign/linkedin.svelte';
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
  import { onMount } from "svelte";

  import sessionStore from "$lib/store/session.js";

  import SeoBox from "$lib/components/SEO-Box.svelte";

  import type { B_FOT_T } from "@betarena/scores-lib/types/types.main.footer.js";
  import FooterSide from "./FooterSide.svelte";
  import FooterBottom from "./FooterBottom.svelte";
  import { promiseUrlsPreload } from "$lib/utils/navigation.js";
    import { browser } from "$app/environment";

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

  /**
   * @description
   *  📣 Component `Type`.
   */
  type IDynamicAssetMap =
    | "begambleawareorg"
    | "logoFull"
    | "legal18icon"
    | "discord"
    | "linkedin"
    | "medium"
    | "telegram"
    | "x"
    | "github";

  export let mobile: boolean, tablet: boolean;

  const /**
     * @description
     *  📣 Dynamic import variable condition
     */
    useDynamicImport: boolean = true;

  let /**
     * @description
     *  📣 Holds target `component(s)` of dynamic nature.
     */
    dynamicAssetMap = new Map<IDynamicAssetMap, any>();
  $: ({ globalState } = $sessionStore);

  $: isPWA = globalState.has("IsPWA");

  $: translation = $page.data.B_FOT_T as B_FOT_T;
  $: if (browser) loadTranslations($sessionStore.serverLang);
  $: linksMap = new Map([
    [
      "changelog",
      {
        id: "changelog",
        label: translation.terms.changelog,
        href: translation.links.changelog,
      },
    ],
    [
      "status",
      {
        id: "status",
        label: translation.terms.status,
        href: translation.links.status,
      },
    ],
    [
      "about",
      {
        id: "about",
        label: translation.terms.about_us,
        href: translation.links.about_us,
      },
    ],
    [
      "terms",
      {
        id: "terms",
        label: translation.terms.terms,
        href: translation.links.terms,
      },
    ],
    [
      "roadmap",
      {
        id: "roadmap",
        label: translation.terms.latest_news,
        href: translation.links.latest_news,
      },
    ],
    [
      "privacy",
      {
        id: "privacy",
        label: translation.terms.privacy,
        href: translation.links.privacy,
      },
    ],
  ]);
  $: buyBTAText =
    $page.data.B_NAV_T?.scores_header_translations?.data?.cta_buy ?? "Buy BTA";
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(async () => {
    if (useDynamicImport) {
      dynamicAssetMap.set(
        "begambleawareorg",
        (await import("./assets/begambleawareorg_black.png")).default
      );
      dynamicAssetMap.set(
        "logoFull",
        (await import("./assets/betarena-logo-full.svg")).default
      );
      dynamicAssetMap.set(
        "legal18icon",
        (await import("./assets/legal-18-action-bet.png")).default
      );

      dynamicAssetMap = dynamicAssetMap;
    }

    return;
  });
  let prevLang;
  async function loadTranslations(lang: string | undefined) {
    if (!lang || prevLang === lang) return;
    prevLang = lang;
    const res = await promiseUrlsPreload(
      [
        `/api/data/main/footer?lang=${lang}&decompress`,
        `/api/data/main/navbar?lang=${lang}&decompress`,
      ],
      fetch
    );
    translation = res[0];
    buyBTAText = res[1]?.scores_header_translations?.data?.cta_buy ?? "Buy BTA";
    return res;
  }
  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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

<!--
╭─────
│ > Footer SEO
╰─────
-->
<SeoBox>
  <!--
  ╭─────
  │ > Social Links [1]
  ╰─────
  -->
  <p>{translation.links.latest_news}</p>
  <p>{translation.links.about_us}</p>
  <p>{translation.links.betting_tips}</p>
  <p>{translation.links.privacy}</p>
  <p>{translation.links.social_networks}</p>
  <p>{translation.links.terms}</p>
  <p>{translation.links.status}</p>
  <p>{translation.links.changelog}</p>
  <!--
  ╭─────
  │ > Social Links [2]
  ╰─────
  -->
  {#each Object.keys(translation.links.social_networks) ?? [] as key}
    <p>{translation.links.social_networks[key]}</p>
  {/each}
</SeoBox>

<!--
╭─────
│ > Fotter Container
╰─────
-->

{#if !mobile && !tablet}
  <FooterSide links={linksMap} {buyBTAText} {translation} />
{/if}

{#if !isPWA && (tablet || mobile)}
  <FooterBottom {mobile} {tablet} {translation} links={linksMap} />
{/if}
