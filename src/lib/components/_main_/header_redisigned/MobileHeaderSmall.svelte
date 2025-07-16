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

  import userBetarenaSettings from "$lib/store/user-settings.js";
  import sessionStore from "$lib/store/session.js";
  import LogoButton from "./LogoButton.svelte";
  import { scoresNavbarStore } from "./_store.js";
  import BackButton from "$lib/components/ui/BackButton.svelte";
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import { createEventDispatcher } from "svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { page } from "$app/stores";

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
  export let mobile, tablet;
  const dispatch = createEventDispatcher();
  $: ({ globalState } = $sessionStore);
  $: ({user} = $userBetarenaSettings);
  $: isAuth = !!user;
  $: ({ profile_photo } = { ...$userBetarenaSettings.user?.scores_user_data });
  $: isPWA = globalState.has("IsPWA");
  $: ({scores_header_translations} = $page.data.B_NAV_T)

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "main⮕header";

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

<svelte:window
  on:click={() => {
    scoresNavbarStore.closeAllDropdowns();
  }}
/>
<div class="wrapper" id={CNAME} class:pwa={isPWA} class:mobile>
  {#if !isPWA}
    <LogoButton {mobile} {tablet} />
  {:else}
    <BackButton />
  {/if}

  <div class="actions">
    <div class="avatar-wrapper" on:click|stopPropagation>
      {#if isAuth}
        <Avatar
          src={profile_photo}
          size={32}
          isLoogedIn={isAuth}
          on:click={() => dispatch("avatarClick")}
        />
      {:else}
          <Button classname="sign-in" on:click={signIn} size="sm">{scores_header_translations.sign_in || "Sign in"}</Button>
      {/if}
    </div>
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
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 12px 34px;
    flex-wrap: wrap;

    &.mobile {
      padding: 10px 14px;
    }

    .logo-full {
      width: 100%;
      margin-bottom: 19px;
    }
    &.pwa {
      flex-wrap: nowrap;
    }

    .actions {
      flex-grow: 1;
      align-items: center;
      justify-content: flex-end;
      display: flex;
    }
    .avatar-wrapper {
      position: relative;
      cursor: pointer;
    }
  }
</style>
