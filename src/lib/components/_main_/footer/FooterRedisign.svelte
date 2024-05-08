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
  import { viewportChangeV2 } from "$lib/utils/device";

  import SeoBox from "$lib/components/SEO-Box.svelte";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";

  import type { B_H_SFOOTD_Social_Network } from "@betarena/scores-lib/types/_HASURA_.js";
  import type { B_FOT_T } from "@betarena/scores-lib/types/types.main.footer.js";
  import { routeIdContent, routeIdPageTags } from "$lib/constants/paths.js";
  import WalletBalance from "$lib/components/ui/WalletBalance.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import Discord from "./assets/icon_redisign/discord.svelte";
  import Linkedin from "./assets/icon_redisign/linkedin.svelte";
  import Medium from "./assets/icon_redisign/medium.svelte";
  import Telegram from "./assets/icon_redisign/telegram.svelte";
  import X from "./assets/icon_redisign/x.svelte";
  import Github from "./assets/icon_redisign/github.svelte";
  import Legal_18ActionBet from "./assets/icon_redisign/legal-18-action-bet.svelte";
  import BegambleawareorgBlack from "./assets/icon_redisign/begambleawareorg_black.png";

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

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = "global⮕footer⮕w⮕main",
    /**
     * @description
     *  📣 Dynamic import variable condition
     */
    useDynamicImport: boolean = true,
    /**
     * @description
     *  📣 Target social media order.
     */
    socialNetworkOrder: B_H_SFOOTD_Social_Network[] = [
      "x",
      "telegram",
      "discord",
      "medium",
      "linkedin",
      "github",
    ];
  let /**
     * @description
     *  📣 Holds target `component(s)` of dynamic nature.
     */
    dynamicAssetMap = new Map<IDynamicAssetMap, any>(),
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [number, boolean] = [710, true],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [number, boolean] = [1160, true];
  $: ({ windowWidth, globalState } = $sessionStore);
  $: [VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1]] = viewportChangeV2(
    windowWidth,
    VIEWPORT_MOBILE_INIT[0],
    VIEWPORT_TABLET_INIT[0]
  );

  $: translation = $page.data.B_FOT_T as B_FOT_T;
  $: console.log("Page Data: ", $page);
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: links = [
    {
      id: "changelog",
      label: translation.terms.changelog,
      href: translation.links.changelog,
    },
    {
      id: "status",
      label: translation.terms.status,
      href: translation.links.status,
    },
    {
      id: "about",
      label: translation.terms.about_us,
      href: translation.links.about_us,
    },
    {
      id: "terms",
      label: translation.terms.terms,
      href: translation.links.terms,
    },
    {
      id: "roadmap",
      label: translation.terms.latest_news,
      href: translation.links.latest_news,
    },
    {
      id: "privacy",
      label: translation.terms.privacy,
      href: translation.links.privacy,
    },
  ];
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
      dynamicAssetMap.set("discord", Discord);
      dynamicAssetMap.set("linkedin", Linkedin);
      dynamicAssetMap.set("medium", Medium);
      dynamicAssetMap.set("telegram", Telegram);
      dynamicAssetMap.set("x", X);
      dynamicAssetMap.set("github", Github);

      dynamicAssetMap = dynamicAssetMap;
    }

    return;
  });

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

<footer>
  <div id="{CNAME}⮕inner">
    {#if !globalState.has("NotAuthenticated")}
      <div class="wallet">
        <WalletBalance />
        <Button type="primary">
          {trsanslationData?.scores_header_translations?.data?.cta_buy ??
            "Buy BTA"}
        </Button>
      </div>
    {/if}
    <div class="content">
      <div class="follow-block">
        <span class="follow-text">
          <TranslationText
            key={`${CNAME}/unknown`}
            text={translation.terms.follow}
            fallback={"Follow us"}
          />
        </span>
        <div class="socials-wrapper">
          {#each socialNetworkOrder as key}
            <a
              class="social-icon"
              rel="external"
              target="_blank"
              href={translation.links.social_networks[key]}
            >
              <svelte:component this={dynamicAssetMap.get(key)} />
            </a>
          {/each}
        </div>
      </div>
      <div class="navigation-block">
        {#each links as item}
          {#if item}
            <a href={item?.href} rel="external">
              <TranslationText key={`${CNAME}/unknown`} text={item.label} />
            </a>
          {/if}
        {/each}
      </div>
      <div class="legal-block">
        <Legal_18ActionBet />
        <img
          id=""
          src={BegambleawareorgBlack}
          alt="BegambleawareorgBlack"
          title=""
          loading="lazy"
        />
      </div>
      <div class="rights-block">
        © 2021 Betarena All rights reserved <br />
        Second Act, 18 Boulevard Montmartre Paris 75009
      </div>
    </div>
  </div>
</footer>

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
  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  footer {
    /* 🎨 style */
    // background: #292929;
    padding: 0px 120px;
    position: relative;
    color: var(--text-color);
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    height: fit-content;

    .wallet {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 32px 0;
      border-bottom: var(--border);
    }
    .content {
      padding: 32px 0;

      .follow-block {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .follow-text {
          font-size: 14px;
          font-weight: 500;
        }

        .socials-wrapper {
          display: flex;
          gap: 8px;

          .social-icon {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            border: var(--border);
            transition: all 0.3s ease-in-out;

            &:hover {
              border: 1px solid var(--primary);
              --icon-color: var(--text-color);
            }
          }
        }
      }

      .navigation-block {
        padding: 40px 0;
        display: grid;
        row-gap: 8px;
        grid-template-columns: repeat(2, minmax(140px, 1fr));
        font-weight: 500;

        a:hover {
          color: var(--primary);
        }
      }
      .legal-block {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-bottom: 24px;
      }
      .rights-block {
        color: var(--text-color-second-dark);
        font-size: 12px;
      }
    }
  }
</style>
