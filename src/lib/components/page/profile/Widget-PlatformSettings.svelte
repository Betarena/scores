<!--===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  import { page } from "$app/stores";
  import { onMount } from "svelte";

  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { viewport_change } from "$lib/utils/platform-functions";

  import type { IProfileTrs } from "@betarena/scores-lib/types/types.profile.js";
  import HeaderCTheme from "$lib/components/_main_/header_redisigned/Header-C-Theme.svelte";
  import SelectButton from "$lib/components/ui/SelectButton.svelte";
  import { selectLanguage } from "$lib/utils/navigation.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const TABLET_VIEW = 768,
    MOBILE_VIEW = 767;
  let mobileExclusive: boolean = false,
    tabletExclusive: boolean = false;
  let profileTrs: B_PROF_T,
    noWidgetData: boolean = false,
    profilePicExists: boolean = false,
    profile_wallet_connected: boolean = false;

  $: profilePicExists =
    $userBetarenaSettings?.user?.scores_user_data?.profile_photo == undefined
      ? false
      : true;
  $: profile_wallet_connected =
    $userBetarenaSettings?.user?.scores_user_data?.web3_wallet_addr == undefined
      ? false
      : true;
  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;
  $: langArray = ($page.data.B_NAV_T?.langArray || []).sort() as string[];
  $: langOptions = langArray.map((lang) => {
    return {
      id: lang,
      label: lang.toUpperCase(),
    };
  });
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS
  // async function save_settings(): Promise<void> {
  // }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  onMount(async () => {
    [tabletExclusive, mobileExclusive] = viewport_change(
      TABLET_VIEW,
      MOBILE_VIEW
    );
    window.addEventListener("resize", function () {
      [tabletExclusive, mobileExclusive] = viewport_change(
        TABLET_VIEW,
        MOBILE_VIEW
      );
    });
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
PLATFORM SETTINGS WIDGET
-->
{#if !noWidgetData}
  <div
    id="platform-settings-widget-box"
    class:dark-background-1={$userBetarenaSettings.theme == "Dark"}
  >
    <!--
    WIDGET TITLE
    -->
    <h2
      class="
        w-500
        s-20
        m-b-24
      "
      style="margin-top: 0px;"
    >
      {profileTrs?.profile?.settings || "Settings"}
    </h2>

    <!--
    [ℹ] second row
    <-contents->
    [ℹ] theme text
    [ℹ] theme update
    -->
    <div
      class="
        m-b-24
      "
    >
      <!--
      <-contents->
      [ℹ] theme text
      [ℹ] theme "required"
      -->
      <div
        class="
          row-space-start
          m-b-16
        "
      >
        <!--
        <-contents->
        [ℹ] theme "head" text
        [ℹ] (theme) text description
        -->
        <div>
          <!--
          <-contents->
          [ℹ] theme "head" text
          [ℹ] theme "required" text
          -->
          <div
            class="
              row-space-start
              m-b-5
            "
          >
            <!--
            [ℹ] theme "head" text
            -->
            <p
              class="
              s-16
              w-500
              m-r-6
              label
            "
            >
              {profileTrs?.profile?.theme || "Theme"}
            </p>
          </div>
          <!--
          [ℹ] (theme) text description
          -->
          <span
            class="
              s-14
              color-grey
              sub-title
            "
          >
            {profileTrs?.profile?.theme_desc ||
              "This will change the current theme for the platform."}
          </span>
        </div>
      </div>

      <HeaderCTheme dark_bg="#29292954" light_bg="#2929291A" />
    </div>
    <!--
    [ℹ] third row
    <-contents->
    [ℹ] language text
    [ℹ] language update
    -->
    <div
      class="
        m-b-24
      "
    >
      <!--
      <-contents->
      [ℹ] language text
      -->
      <div
        class="
          row-space-start
          m-b-16
        "
      >
        <!--
        <-contents->
        [ℹ] language "head" text
        [ℹ] (user) text description
        -->
        <div>
          <!--
          <-contents->
          [ℹ] language "head" text
          -->
          <div
            class="
              row-space-start
              m-b-5
            "
          >
            <!--
            [ℹ] language "head" text
            -->
            <p
              class="
              s-16
              w-500
              m-r-6
              label
            "
            >
              {profileTrs?.profile?.lang || "Language"}
            </p>
          </div>
          <!--
          [ℹ] (language) text description
          -->
          <span
            class="
              s-14
              color-grey
            "
          >
            {profileTrs?.profile?.lang_desc ||
              "Select the language to be displayed"}
          </span>
        </div>
      </div>

      <!--
      [ℹ] language input
      -->
      <SelectButton
        className="language-input"
        dropdownClass="language-dropdown"
        value={$page.data.langParam}
        options={langOptions}
        on:change={(e) => selectLanguage(e.detail.id)}
      />
    </div>

    <!--
    SAVE SETTINGS (BTN)
    -->
    <!-- <button
      class="
        btn-primary-v2
        w-500
        s-14
      "
      on:click={() => save_settings()}
    >
      {profileTrs?.profile?.save}
    </button> -->
  </div>
{/if}

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style lang="scss">
  /*
  profile [settings] widget
  */
  div#platform-settings-widget-box {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 20px;

    h2 {
      color: var(--text-color);
    }
    .label {
      color: var(--text-color);
    }
  }
  :global(#platform-settings-widget-box .language-input button) {
    /* white theme/gray */
    border: 1px solid var(--grey-shade) !important;
    background-color: inherit !important;
    color: var(--text-color);
    display: flex;
    position: relative;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 20px 12px;
    width: 100%;
    height: 44px;
    outline: none;
    font-size: 14px;
    justify-content: space-between;
    position: relative;
  }
  :global(#platform-settings-widget-box .language-dropdown) {
    /* white theme/gray */
    width: 100%;
    max-width: 100%;
  }
  /* :global(#platform-settings-widget-box .language-input) {
    position: relative;
    color: var(--text-color)
  } */

  /*
  =============
  DARK-THEME
  =============
  */

  div#platform-settings-widget-box.dark-background-1 {
    box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
    background-color: var(--dark-theme-1) !important;
  }

  :global(
      div#platform-settings-widget-box.dark-background-1 .language-input button
    ) {
    border: 1px solid var(--dark-theme-1-2-shade) !important;
  }
  :global(
      div#platform-settings-widget-box .language-input button:hover,
      div#platform-settings-widget-box .language-input button:focus
    ) {
    border: 1px solid var(--text-color) !important;
  }
  :global(
      div#platform-settings-widget-box.dark-background-1 .language-input button:hover,
      div#platform-settings-widget-box.dark-background-1 .language-input button:focus
    ) {
    border: 1px solid var(--dark-theme-1-3-shade)!important;
  }
</style>
