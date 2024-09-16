<!--===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  import { page } from "$app/stores";
  import Plus from "$lib/components/ui/assets/plus.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";

  import type { IProfileTrs } from "@betarena/scores-lib/types/types.profile.js";
  import PublicationCard from "./PublicationCard.svelte";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  let profileTrs: IProfileTrs,
    noWidgetData: boolean = false;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;


  $: sportstacks = [
    {
      owner: $userSettings.user?.firebase_user_data?.uid,
      title: "This is a sample of a long sportstack title",
      img: "",
    },
    {
      owner: $userSettings.user?.firebase_user_data?.uid,
      title: "This is a sample of a long sportstack title",
      img: "",
    },
    {
      owner: $userSettings.user?.firebase_user_data?.uid,
      title: "This is a sample of a long sportstack title",
      img: "",
    },
  ];

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
  AUTHOR WIDGET
-->
{#if !noWidgetData}
  <div id="account-author-widget-box">
    <!--
    WIDGET TITLE
    -->
    <div class="header">
      <div class="title">
        <h2>
          {profileTrs?.author?.publications || "Publications"}
        </h2>

        <div class="description">
          {profileTrs?.author?.publications_desc ||
            "Lorem ipsum dolor sit amet consectetur. Turpis sed et proin commodo."}
        </div>
      </div>

      <Button full={true}>
        <div class="button-text">
          <Plus />
          New Publication
        </div>
      </Button>
    </div>

    <div class="publications-wrapper">
      {#each sportstacks as sportstack}
        <PublicationCard {sportstack} />
      {/each}
    </div>
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
  div#account-author-widget-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2xl, 20px);
    align-self: stretch;
    height: 100%;

    .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xl, 16px);
      align-self: stretch;
      .title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs, 4px);
        align-self: stretch;

        h2 {
          color: var(--colors-text-text-primary-900, #fbfbfb);
          font-family: var(--Font-family-font-family-display, Roboto);
          font-size: var(--Font-size-display-xs, 24px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--Line-height-display-xs, 32px);
          margin: 0;
        }
        .description {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text md/Regular */
          font-family: var(--Font-family-font-family-body, Roboto);
          font-size: var(--Font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--Line-height-text-md, 24px); /* 150% */
        }
      }

      .button-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-sm, 6px);
        align-self: stretch;

        /* Text md/Medium */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-md, 16px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--Line-height-text-md, 24px); /* 150% */

        :global(svg) {
          width: 20px;
          height: 20px;
        }
      }
    }

    .publications-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xl, 16px);
      flex: 1 0 0;
      align-self: stretch;
    }
  }

  input[type="text"] {
    /* white theme/gray */
    border: 1px solid var(--grey-shade);
    box-sizing: border-box;
    border-radius: 8px;
    padding: 20px 12px;
    width: -webkit-fill-available;
    height: 44px;
    outline: none;
    font-size: 14px;
  }
  input[type="text"]:hover {
    border: 1px solid var(--grey);
  }
  input[type="text"]:focus {
    border: 1px solid var(--dark-theme-1);
  }
  input[type="text"][placeholder] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  input[type="text"].input-error {
    border: 1px solid var(--red-bright) !important;
  }

  button {
    width: -webkit-fill-available;
  }

  div#settings-hr-divider {
    width: 100%;
    height: 1px;
    background-color: var(--grey-color);
  }

  p.required-pill-tag {
    padding: 3px 8px;
    height: 24px;
    background-color: var(--oragne-pale-bg);
    color: var(--primary-fade);
    border-radius: 32px;
  }

  /*
  input - custom file upload
  */
  .custom-file-input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  /*
  =============
  RESPONSIVNESS
  =============
  */

  @media only screen and (min-width: 575px) {
    button {
      width: auto;
    }
  }

  /*
  =============
  DARK-THEME
  =============
  */

  div#account-settings-widget-box.dark-background-1 {
    box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
    background-color: var(--dark-theme-1) !important;
  }

  div#account-settings-widget-box.dark-background-1 input[type="text"] {
    background: var(--dark-theme-1);
    border: 1px solid var(--dark-theme-1-2-shade);
    color: var(--white);
  }

  div#account-settings-widget-box.dark-background-1 div#settings-hr-divider {
    background-color: var(--dark-theme-1-2-shade);
  }

  div#account-settings-widget-box.dark-background-1 p.required-pill-tag {
    color: var(--primary-fade);
  }

  div#account-settings-widget-box.dark-background-1 button.btn-hollow.danger {
    border: 1px solid var(--dark-theme-1-2-shade) !important;
  }
</style>
