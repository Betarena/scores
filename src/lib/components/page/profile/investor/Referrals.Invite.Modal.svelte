<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
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
  import { onDestroy, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';

  import asset_invite_investor from '../assets/investor/asset-invite-investor.png';
  import icon_betarena_brand from '../assets/investor/icon-betarena-brand.svg';
// import icon_social_download_hover from '../assets/investor/icon-social-download-hover.svg';
  import icon_social_download_dark from '../assets/investor/icon-social-download-dark.svg';
  import icon_social_download from '../assets/investor/icon-social-download.svg';
  import icon_social_facebook_dark from '../assets/investor/icon-social-facebook-dark.svg';
  import icon_social_facebook_hover from '../assets/investor/icon-social-facebook-hover.svg';
  import icon_social_facebook from '../assets/investor/icon-social-facebook.svg';
// import icon_social_link_hover from '../assets/investor/icon-social-link-hover.svg';
  import icon_close from '../assets/investor/icon-close-btn.svg';
  import icon_close_dark from '../assets/investor/icon-close-dark-btn.svg';
  import icon_social_link_dark from '../assets/investor/icon-social-link-dark.svg';
  import icon_social_link from '../assets/investor/icon-social-link.svg';
  import icon_social_reddit_dark from '../assets/investor/icon-social-reddit-dark.svg';
  import icon_social_reddit_hover from '../assets/investor/icon-social-reddit-hover.svg';
  import icon_social_reddit from '../assets/investor/icon-social-reddit.svg';
  import icon_social_telegram_dark from '../assets/investor/icon-social-telegram-dark.svg';
  import icon_social_telegram_hover from '../assets/investor/icon-social-telegram-hover.svg';
  import icon_social_telegram from '../assets/investor/icon-social-telegram.svg';
  import icon_social_twitter_dark from '../assets/investor/icon-social-twitter-dark.svg';
  import icon_social_twitter_hover from '../assets/investor/icon-social-twitter-hover.svg';
  import icon_social_twitter from '../assets/investor/icon-social-twitter.svg';
  import icon_social_whatsapp_dark from '../assets/investor/icon-social-whatsapp-dark.svg';
  import icon_social_whatsapp_hover from '../assets/investor/icon-social-whatsapp-hover.svg';
  import icon_social_whatsapp from '../assets/investor/icon-social-whatsapp.svg';
  import ModalBackdrop from '$lib/components/misc/Modal-Backdrop.svelte';

  import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

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
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕referral-invite-modal⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /**
     * @description
     *  📣 Dynamic list of **social assets** used by widget.
    */
    assetList:
    {
      name: string
      , asset: string
      , asset_hover: string
      , asset_dark: string
    }[]
    = [
      {
        name: 'twitter'
        , asset: icon_social_twitter
        , asset_hover: icon_social_twitter_hover
        , asset_dark: icon_social_twitter_dark
      }
      , {
        name: 'reddit'
        , asset: icon_social_reddit
        , asset_hover: icon_social_reddit_hover
        , asset_dark: icon_social_reddit_dark
      }
      , {
        name: 'facebook'
        , asset: icon_social_facebook
        , asset_hover: icon_social_facebook_hover
        , asset_dark: icon_social_facebook_dark
      }
      , {
        name: 'telegram'
        , asset: icon_social_telegram
        , asset_hover: icon_social_telegram_hover
        , asset_dark: icon_social_telegram_dark
      }
      , {
        name: 'whatsapp'
        , asset: icon_social_whatsapp
        , asset_hover: icon_social_whatsapp_hover
        , asset_dark: icon_social_whatsapp_dark
      }
    ]
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    () =>
    {
      document.body.classList.add
      (
        'disable-scroll'
      );
      return;
    }
  );

  onDestroy
  (
    () =>
    {
      document.body.classList.remove
      (
        'disable-scroll'
      );
      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<ModalBackdrop
  on:closeModal=
  {
    () =>
    {
      $sessionStore.currentActiveModal = null;
      return;
    }
  }
/>

<!--
▓ NOTE:
▓ > (box) main modal
-->
<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  in:fly={{ y: 500, duration: 500 }}
  out:fly={{ y: 500, duration: 500 }}
>

  <!--
  ▓ NOTE:
  ▓ > (box) modal top row
  -->
  <div
    id="top-row"
    class=
    "
    row-space-out
    "
  >

    <!--
    ▓ NOTE:
    ▓ > (text) modal
    -->
    <p
      class=
      "
      s-20
      w-500
      color-black-2
      "
    >
      {
        profileTrs.investor?.referral.links.cta_title
        ?? 'Invite Investors'
      }
    </p>

    <!--
    ▓ NOTE:
    ▓ > (asset) close icon.
    -->
    <img
      id='close-vector'
      class=
      '
      cursor-pointer
      '
      style=
      '
      {VIEWPORT_TABLET_INIT[1] ? 'top: 16px; right: 16px;' : ''}
      '
      src={$userBetarenaSettings.theme == 'Dark' ? icon_close : icon_close_dark}
      alt='close-svg'
      on:click=
      {
        () =>
        {
          $sessionStore.currentActiveModal = null;
          return;
        }
      }
      width=18
      height=18
    />

  </div>

  <!--
  ▓ NOTE:
  ▓ > (box) modal middle section
  -->
  <div
    id="middle-box"
  >

    <!--
    ▓ NOTE:
    ▓ > (text) main description
    -->
    <div
      id="text-box"
      class=
      "
      text-left
      "
    >
      <!--
      ▓ NOTE:
      ▓ > (text) modal title
      -->
      <p
        class=
        "
        s-32
        w-700
        color-white
        capitalize
        text-left
        m-b-55
        "
        style=
        "
        line-height: 120%; /* 35.7px */
        "
      >
        {
          profileTrs.investor?.referral.ref_pop.title_1
          ?? 'Looking to be part of the future of sports content?'
        }
      </p>

      <!--
      ▓ NOTE:
      ▓ > (asset) betarena brand asset
      -->
      <img
        id=''
        src={icon_betarena_brand}
        alt=''
        title=''
        loading='lazy'
        height=18
        class=
        "
        m-b-24
        "
      />

      <!--
      ▓ NOTE:
      ▓ > (text) modal description
      -->
      <p
        class=
        "
        s-14
        color-white
        text-left
        "
      >
        {
          profileTrs.investor?.referral.ref_pop.description
          ?? 'Join the Betarena Presale and Be Part of the Future of Sports Content. Join Now for Exclusive Rewards!'
        }
      </p>
    </div>

    <!--
    ▓ NOTE:
    ▓ > (asset) modal image
    -->
    <img
      id='background-asset'
      title=''
      alt=''
      src={asset_invite_investor}
      loading='lazy'
      width=48
      height=48
    />

  </div>

  <!--
  ▓ NOTE:
  ▓ > (box) modal bottom row
  -->
  <div
    id="bottom-box"
    class=
    "
    row-space-out
    "
  >

    <!--
    ▓ NOTE:
    ▓ > 1st social box
    -->
    <div
      id="first-box"
      class=
      "
      row-space-start
      width-auto
      "
    >

      {#each assetList as item}
        <div
          class=
          "
          cursor-pointer
          <!---->
          social-btn
          "
          on:mouseover={(e) => {return e.currentTarget.children[0].src = item.asset_hover}}
          on:mouseleave={(e) => {return e.currentTarget.children[0].src = ($userBetarenaSettings.theme == 'Dark' ? item.asset_dark : item.asset)}}
        >
          <img
            id=''
            src={$userBetarenaSettings.theme == 'Dark' ? item.asset_dark : item.asset}
            alt=''
            title=''
            loading='lazy'
          />
        </div>
      {/each}

    </div>

    <!--
    ▓ NOTE:
    ▓ > 2nd social box
    -->
    <div
      class=
      "
      row-space-start
      width-auto
      "
    >

      <div
        class=
        "
        m-r-10
        <!---->
        cursor-pointer
        social-btn
        "
      >
        <img
          id=''
          src={$userBetarenaSettings.theme == 'Dark' ? icon_social_download_dark : icon_social_download}
          alt=''
          title=''
          loading='lazy'
        />
      </div>

      <div
        class=
        "
        <!---->
        social-btn
        cursor-pointer
        "
      >
        <img
          id=''
          src={$userBetarenaSettings.theme == 'Dark' ? icon_social_link_dark : icon_social_link}
          alt=''
          title=''
          loading='lazy'
        />
      </div>

    </div>

  </div>

</div>

<!--
▓ NOTE:
▓ > (box) modal background filter
-->
<div
  id='{CNAME}⮕blur'
	in:fade
  on:click={() => {return $sessionStore.showReferralInviteModal = false}}
/>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

	div#profile⮕w⮕referral-invite-modal⮕main
  {
		/* 📌 position */
		position: fixed;
    z-index: 10000;
    height: fit-content;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
		/* 🎨 style */
    background-color: var(--white) !important;
		border-radius: 12px 12px 0 0;
		text-align: -webkit-center;
		text-align: -moz-center;
		overflow: hidden;

    div#top-row
    {
      /* 🎨 style */
      padding: 12px 20px;

      img#close-vector
      {
        /* 📌 position */
        position: absolute;
        top: 24px;
        right: 24px;
        z-index: 400000002;
      }
    }

    div#middle-box
    {
      /* 📌 position */
      position: relative;
      /* 🎨 style */
      height: 402px;
      background-color: var(--dark-theme);
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      padding: 48px;
      overflow: hidden;

      div#text-box
      {
        /* 📌 position */
        position: relative;
        z-index: 1;
        float: left;
        /* 🎨 style */
        width: 246px;
      }

      img#background-asset
      {
        /* 📌 position */
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: auto;
        height: 100%;
        z-index: 0;
      }
    }

    div#bottom-box
    {
      /* 🎨 style */
      padding: 12px 20px ;

      div.social-btn
      {
        /* 🎨 style */
        width: 40px;
        height: 40px;
        border: 0.833px solid var(--grey-color);
        border-radius: 50%;
        padding: 10px;

        &:hover
        {
          /* 🎨 style */
          border-color: var(--primary);
        }
      }

      div#first-box
      {
        /* 🎨 style */
        display: grid;
        grid-auto-flow: column;
        gap: 8px;
      }
    }
	}

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	@media only screen
  and (min-width: 575px)
  {
		div#profile⮕w⮕referral-invite-modal⮕main
    {
      /* 📌 position */
      position: fixed;
      z-index: 10000;
      margin: auto;
      width: fit-content;
      width: 92%;
      height: 520px;
      max-height: 520px;
      min-height: 520px;
      right: 0;
      left: 0;
      bottom: 0;
      top: 0;
      /* 🎨 style */
      width: 502px;
      border-radius: 12px;
    }
	}

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕referral-invite-modal⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1) !important;
		}

    &.dark-background-1
    {
      div#bottom-box
      {
        /* 🎨 style */
        padding: 12px 20px;

        div.social-btn
        {
          /* 🎨 style */
          border: 0.833px solid var(--grey);
        }
      }
    }
	}

</style>
