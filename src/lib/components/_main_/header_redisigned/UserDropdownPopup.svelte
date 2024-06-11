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
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import { logoutUser } from "$lib/utils/user";
  import { fly } from "svelte/transition";
  import { scoresNavbarStore } from "./_store";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
 // #endregion ➤ 📦 Package Imports
  $: translationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
</script>

{#if $scoresNavbarStore.globalState.has("UserDropdownActive")}
  <div id="user-profile-dropdown" transition:fly>
    <!--
    ╭─────
    │ > Profile Navigation Button
    ╰─────
    -->
    <a href="/u/dashboard/{$userBetarenaSettings.lang}">
      <div
        class="
        theme-opt-box
        cursor-pointer
        "
        style="width: 100%;"
        on:click={() => {
          scoresNavbarStore.closeAllDropdowns();
          return;
        }}
      >
        <p
          class="
          color-white
          s-14
          "
        >
          <TranslationText
            key={"header-txt-unkown"}
            text={translationData?.scores_header_translations?.data?.profile}
            fallback={"Profile"}
          />
        </p>
      </div>
    </a>

    <!--
    ╭─────
    │ > Profile Logout
    ╰─────
    -->
    <div
      class="
      theme-opt-box
      cursor-pointer
      "
      on:click={() => {
        logoutUser();
        return;
      }}
    >
      <p
        class="
        color-white
        s-14
        "
      >
        <TranslationText
          key={"header-txt-unkown"}
          text={translationData?.scores_header_translations?.data?.logout}
          fallback={"Logout"}
        />
      </p>
    </div>
  </div>
{/if}

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
  #user-profile-dropdown {
    /* 🎨 style */
    position: absolute;
    top: 100%;
    right: 0;
    left: unset;
    z-index: 2000;
    /* 🎨 style */
    margin-top: 5px;
    background: #292929;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    overflow: hidden;
    width: 168px;

    .theme-opt-box {
      padding: 9.5px 16px;
      box-shadow: inset 0px -1px 0px #3c3c3c;
      background: #4b4b4b;
      height: 40px;

      &:hover {
        /* 🎨 style */
        background: var(--dark-theme);
        box-shadow: inset 0px -1px 0px #3c3c3c;
      }
    }
  }
</style>
