<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import AssetBetarenaLogoFull from './assets/asset-betarena-logo-full.svelte';
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
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";

  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import Button from "$lib/components/ui/Button.svelte";
  import { translationObject } from "$lib/utils/translation.js";
  import HeaderCLang from "./Header-C-Lang.svelte";
  import HeaderCTheme from "./Header-C-Theme.svelte";
  import AssetBetarenaLogoFull from "./assets/asset-betarena-logo-full.svelte";
    import Avatar from "$lib/components/ui/Avatar.svelte";

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
  $: ({ currentPageRouteId, globalState, serverLang } = $sessionStore);

  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: homepageURL = serverLang != "en" ? `/${serverLang}` : "/";
  $: logoLink =
    serverLang != "en" ? `${$page.url.origin}/${serverLang}` : $page.url.origin;
  $: ({
    profile_photo,
  } = { ...$userBetarenaSettings.user?.scores_user_data });
  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "<section-scope>⮕<type|w|c>⮕<unique-tag-name>⮕main";

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

  function signIn() {
    $sessionStore.currentActiveModal = "Auth_Modal";
    return;
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<div class="wrapper">
  <div
    id="brand"
    data-testid="header-brand-img"
    aria-label="brand-img"
    class="cursor-pointer"
    on:click={() => {
      if ($page.url.pathname == "/") window.location.reload();
      return;
    }}
  >
    <a href={homepageURL} title={logoLink}>
      <AssetBetarenaLogoFull />
    </a>
  </div>

  <div class="actions">
      <HeaderCLang />
      <HeaderCTheme />
    {#if globalState.has("NotAuthenticated")}
      <Button type="outline" on:click={signIn}>
        <TranslationText
          key={"header-txt-unkown"}
          text={trsanslationData?.scores_header_translations?.sign_in}
          fallback={translationObject.sign_in}
        />
      </Button>
    {:else}
      <Avatar src={profile_photo} size={40}/>
    {/if}
  </div>
</div>

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
  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .actions {
      flex-grow: 1;
      align-items: center;
      justify-content: flex-end;
      display: flex;
    }
  }
</style>