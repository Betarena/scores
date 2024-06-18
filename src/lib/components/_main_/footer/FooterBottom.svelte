<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import BegambleawareorgBlack from './assets/icon_redisign/begambleawareorg_black.svelte';
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  import FooterNavigationBlock from "./FooterNavigationBlock.svelte";
  import SocialsBlock from "./SocialsBlock.svelte";
  import Legal_18ActionBet from "./assets/icon_redisign/legal-18-action-bet.svelte";
  import BegambleawareorgBlack from "./assets/icon_redisign/begambleawareorg_black.png";

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

  export let mobile: boolean, tablet: boolean, translation, links;
  $: linksOrder =
    tablet && !mobile
      ? ["changelog", "about", "roadmap", "status", "terms", "privacy"]
      : ["changelog", "status", "about", "terms", "roadmap", "privacy"];
  // #endregion ➤ 📌 VARIABLES
</script>

<footer class:mobile>
  <div class="wrapper">
    <SocialsBlock {translation} />
    <div class="nav-wrapper">
      <FooterNavigationBlock
        vertlical={tablet && mobile}
        {links}
        order={linksOrder}
      />
    </div>
    <div class="legal-block">
      <div class="rights-block">
        © 2021 Betarena All rights reserved <br />
        Second Act, 18 Boulevard Montmartre Paris 75009
      </div>
      <div class="legal-images">
        <Legal_18ActionBet />
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
  footer {
    border-top: var(--border);
    display: flex;
    min-width: 100%;
    flex-direction: column;
    color: var(--text-color);
    .wrapper {
      padding: 32px 34px;
      padding-bottom: 128px;
      max-width: 1430px;
      width: 100%;
      margin: auto;
    }
    .nav-wrapper {
      padding: 32px 0;
    }

    .legal-block {
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

    &.mobile {
      padding-bottom: 132px;
      .wrapper {
        padding: 40px 25px;

      }
      .nav-wrapper {
        padding: 40px 0;
      }

      .legal-block {
        flex-direction: column-reverse;
        align-items: flex-start;
      }
    }
  }
</style>
