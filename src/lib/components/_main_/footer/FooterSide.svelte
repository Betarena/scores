<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @izobov                                                         │
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


  import sessionStore from "$lib/store/session.js";

  import SeoBox from "$lib/components/SEO-Box.svelte";

  import WalletBalance from "$lib/components/ui/WalletBalance.svelte";
  import Button from "$lib/components/ui/Button.svelte";

  import Legal_18ActionBet from "./assets/icon_redisign/legal-18-action-bet.svelte";
  import BegambleawareorgBlack from "./assets/icon_redisign/begambleawareorg_black.png";
  import SocialsBlock from "./SocialsBlock.svelte";
  import FooterNavigationBlock from "./FooterNavigationBlock.svelte";

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

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = "global⮕footer⮕w⮕main";

  export let links, buyBTAText, translation;

  $: ({ globalState } = $sessionStore);
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
          {buyBTAText}
        </Button>
      </div>
    {/if}
    <div class="content">
      <SocialsBlock {translation} />
      <div class="nav-block-wrap">
        <FooterNavigationBlock {links} />
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
    width: 280px;
    margin-right: 112px;
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

      .nav-block-wrap {
        padding: 40px 0;
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
