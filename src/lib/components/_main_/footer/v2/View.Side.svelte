<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Overview                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Code Format   // V.8.0                                                         │
│ ➤ Status        // 🔒 LOCKED                                                     │
│ ➤ Author(s)     // @izobov                                                       │
│ ➤ Maintainer(s) // @izobov @migbash                                              │
│ ➤ Created on    // <date-created>                                                │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ BETARENA (Module)                                                                │
│ |: Scores Footer Sub-Component (v2)
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

  import userBetarenaSettings from '$lib/store/user-settings.js';

  import BuyBtaButton from '$lib/components/shared/BuyBta/Buy-BTA-Button.svelte';
  import WalletBalance from '$lib/components/ui/WalletBalance.svelte';
  import BegambleawareorgBlack from './../assets/icon_redisign/begambleawareorg_black.png';
  import Legal18ActionBet from './../assets/icon_redisign/legal-18-action-bet.svelte';
  import FooterNavigationBlock from './Child.Navigation.svelte';
  import SocialsBlock from './Child.Social.svelte';

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

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = 'global⮕footer⮕w⮕main'
  ;

  $: ({ user } = $userBetarenaSettings);
  $: isAuth = !!user;

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
│ > Fotter Container
╰─────
-->

<footer>

  <div
    id="{CNAME}⮕inner"
  >

    {#if isAuth}
      <div class="wallet">
        <WalletBalance />
        <BuyBtaButton popup={true} />
      </div>
    {/if}

    <div
      class="content"
    >
      <SocialsBlock />

      <div
        class="nav-block-wrap"
      >
        <FooterNavigationBlock
          isArticleContentPage={true}
        />
      </div>

      <div
        class="legal-block"
      >
        <Legal18ActionBet />
        <img
          id=""
          src={BegambleawareorgBlack}
          alt="BegambleawareorgBlack"
          title=""
          loading="lazy"
        />
      </div>

      <div
        class="rights-block"
      >
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

  footer
  {
    /* 🎨 style */
    position: relative;
    color: var(--text-color);
    position: sticky;
    position: -webkit-sticky;
    top: 32px;
    height: fit-content;

    .wallet
    {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-bottom: 32px;
      margin-bottom: 32px;
      border-bottom: var(--border);
    }

    .content
    {
      padding-bottom: 32px;

      .nav-block-wrap
      {
        padding: 40px 0;
      }

      .legal-block
      {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-bottom: 24px;
      }
      .rights-block
      {
        color: var(--text-color-second-dark);
        font-size: 12px;
      }
    }
  }

</style>
