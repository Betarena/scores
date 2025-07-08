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

  import { page } from '$app/stores';

  import { routeIdPageProfile, routeIdPageProfileAuthorCreate, routeIdPageProfilePublication } from '$lib/constants/paths.js';
  import sessionStore from '$lib/store/session.js';

  import FooterNavigationBlock from './Child.Navigation.svelte';
  import SocialsBlock from './Child.Social.svelte';
  import BetarenaLogo from './../assets/betarena-logo-full.svg';
  import BegambleawareorgBlack from './../assets/icon_redisign/gamble_aware.svg';
  import Legal18ActionBet from './../assets/icon_redisign/legal-18-action-bet.svelte';

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

  $: ( { viewportType } = $sessionStore );

  $: listStrLinkOrder
    = (viewportType == 'tablet')
      ? ['changelog', 'about', 'roadmap', 'status', 'terms', 'privacy', 'gambleaware']
      : ['changelog', 'status', 'about', 'terms', 'roadmap', 'privacy', 'gambleaware']
  ;

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

<footer
  class="dark-mode"
  class:mobile={viewportType === 'mobile'}
  class:desktop={viewportType === 'desktop'}
  class:border={[routeIdPageProfile, routeIdPageProfileAuthorCreate, routeIdPageProfilePublication].includes($page.route.id || '')}
>

  <div
    class="wrapper"
  >

    {#if viewportType !== 'mobile'}
      <div
        class="first-block"
      >
        <img
          id=""
          src={BetarenaLogo}
          alt="BetarenaLogo"
          title=""
          loading="lazy"
        />
        {#if viewportType === 'desktop'}
          <div
            class="rights-block"
          >
            © 2021 Betarena All rights reserved <br />
            Second Act, 18 Boulevard Montmartre Paris 75009
          </div>
        {/if}
      </div>
    {/if}

    <div
      class="central-block"
    >
      <SocialsBlock />
      <div
        class="nav-wrapper"
      >
        <FooterNavigationBlock
          listStrLinkOrder={listStrLinkOrder}
        />
      </div>
    </div>

    <div
      class="legal-block"
    >

      {#if viewportType !== 'desktop'}
        <div
          class="rights-block"
        >
          © 2021 Betarena All rights reserved <br />
          Second Act, 18 Boulevard Montmartre Paris 75009
        </div>
      {/if}

      <div
        class="legal-images"
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

  footer
  {
    display: flex;
    background-color: var(--colors-background-bg-primary);
    min-width: 100%;
    flex-direction: column;
    color: var(--text-color);

    &.border
    {
      border-top: var(--border);
    }

    .wrapper
    {
      padding: 32px 34px;
      padding-bottom: 128px;
      max-width: 1430px;
      width: 100%;
      gap: 64px;
      display: flex;
      flex-direction: column;
      margin: auto;

      .nav-wrapper {
        margin-top: 34px;
      }
    }

    .legal-block
    {
      display: flex;
      align-items: center;
      gap: 24px;
      justify-content: space-between;

      .legal-images {
        display: flex;
        align-items: center;
        gap: 24px;
      }

      .rights-block {
        color: var(--text-color-second-dark);
        font-size: 12px;
      }
    }

    &.mobile
    {
      padding-bottom: 132px;
      .wrapper {
        padding: 40px 25px;
        gap: 40px;
      }
      .nav-wrapper {
        margin-top: 40px;
      }

      .legal-block {
        flex-direction: column-reverse;
        align-items: flex-start;
        gap: 40px;
      }
    }

    &.desktop
    {
      .wrapper {
        flex-direction: row;
        justify-content: space-between;
        padding: 40px 32px;
        padding-bottom: 85px;

        .first-block {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: var(--text-color-second-dark);
          font-size: 12px;

          img {
            width: 151px;
            height: 32px;
          }
        }

        .legal-block {
          align-items: flex-end;
        }
      }
    }
  }

</style>
