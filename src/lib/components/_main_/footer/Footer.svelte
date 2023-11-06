<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import { viewport_change } from '$lib/utils/platform-functions';

  import SeoBox from '$lib/components/SEO-Box.svelte';

	import type { B_H_SFOOTD_Social_Network } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { B_FOT_T } from '@betarena/scores-lib/types/types.main.footer.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. export const / let [..]                                       ◼️
  // ### 2. const [..]                                                    ◼️
  // ### 3. let [..]                                                      ◼️
  // ### 4. $: [..]                                                       ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'global⮕footer⮕w⮕main',
    /** @description 📱 MOBILE */
    VIEWPORT_MOBILE_INIT = 710,
    /** @description 💻 TABLET */
    VIEWPORT_TABLET_INIT = 1160
  ;

  let
    isViewMobile: boolean = true,
    isViewTablet: boolean = true,
    B_FOT_T: B_FOT_T = $page.data?.B_FOT_T,
    homepageURL: string,
    logoLink: string,
    begambleawareorg: string,
    logo_full: string,
    legal18icon: string,
    icon_discord: string,
    icon_linkedin: string,
    icon_medium: string,
    icon_telegram: string,
    icon_x: string,
    icon_github: string,
    socialNetworkOrder: B_H_SFOOTD_Social_Network[] =
    [
      'discord',
      'telegram',
      'x',
      'medium',
      'linkedin',
      'github'
    ]
  ;

  $: homepageURL =
    $sessionStore?.serverLang != 'en'
      ? `/${$page.params.lang}`
      : `/`
  ;
  $: logoLink =
    $sessionStore?.serverLang != 'en'
      ? `${$page.url.origin}/${$sessionStore?.serverLang}`
      : $page.url.origin
  ;
  $: B_FOT_T: B_FOT_T = $page.data?.B_FOT_T;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'methods' that are to be     ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. function (..)                                                 ◼️
  // ### 2. async function (..)                                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	/**
	 * @description reload current page;
	 */
	function reloadPage
  (
  )
  {
		if ($page.url.pathname.split('/').length - 1 ==	1)
    {
			window.location.reload();
		}
	}

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📌 Obtain target `social` icon, depending on `target`.
   * @param { B_H_SFOOTD_Social_Network } name
   *  Target `social media` name.
   * @returns
   *  Target `social media` icon.
   */
  function getSocialIcon
  (
    name: B_H_SFOOTD_Social_Network
  ): string
  {
    if (name == 'discord')
      return icon_discord;
    else if (name == 'linkedin')
      return icon_linkedin;
    else if (name == 'github')
      return icon_github;
    else if (name == 'x')
      return icon_x;
    else if (name == 'telegram')
      return icon_telegram;
    else if (name == 'medium')
      return icon_medium;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    async () =>
    {
      begambleawareorg = (await import('./assets/begambleawareorg_black.png')).default;
      logo_full = (await import('./assets/betarena-logo-full.svg')).default;
      legal18icon = (await import('./assets/legal-18-action-bet.png')).default;
      icon_discord = (await import('./assets/icon/discord.svg')).default;
      icon_linkedin = (await import('./assets/icon/linkedin.svg')).default;
      icon_medium = (await import('./assets/icon/medium.svg')).default;
      icon_telegram = (await import('./assets/icon/telegram.svg')).default;
      icon_x = (await import('./assets/icon/twitter.svg')).default;
      icon_github = (await import('./assets/icon/github.svg')).default;

      [
        isViewTablet,
        isViewMobile
      ] = viewport_change
      (
        VIEWPORT_TABLET_INIT,
        VIEWPORT_MOBILE_INIT
      );
      window.addEventListener
      (
        'resize',
        function ()
        {
          [
            isViewTablet,
            isViewMobile
          ] =
          viewport_change
          (
            VIEWPORT_TABLET_INIT,
            VIEWPORT_MOBILE_INIT
          );
        }
      );
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class=styles                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
FOOTER | SEO
-->
<SeoBox>

  <p>{logoLink}</p>

  <!--
  SOCIAL LINKS
  -->
  <p>
    {B_FOT_T?.links?.latest_news}
  </p>
  <p>
    {B_FOT_T?.links?.about_us}
  </p>
  <p>
    {B_FOT_T?.links?.betting_tips}
  </p>
  <p>
    {B_FOT_T?.links?.privacy}
  </p>
  <p>
    {B_FOT_T?.links?.social_networks}
  </p>
  <p>
    {B_FOT_T?.links?.terms}
  </p>
  <p>
    {B_FOT_T?.links?.status}
  </p>
  <p>
    {B_FOT_T?.links?.changelog}
  </p>


  <!--
  SOCIAL LINKS - 2
  -->
  {#each Object.keys(B_FOT_T?.links?.social_networks) ?? [] as key}
    <p>
      {B_FOT_T?.links?.social_networks?.[key]}
    </p>
  {/each}

</SeoBox>

<!--
FOOTER | Main Component
-->
<footer>

  <div
    id="{CNAME}⮕inner"
  >

    <!--
    BETARENA BRAND
    -->
    <div
      id="{CNAME}⮕brand"
      on:click={() => reloadPage()}
      on:keypress={(e) => { if (e.key === 'Enter') reloadPage() }}
    >

      <a
        href={homepageURL}
        title={logoLink}
        class:m-b-12={!isViewTablet}
      >
        <img
          loading="lazy"
          src={logo_full}
          alt="betarena-logo"
          title={logoLink}
        />
      </a>

      <!--
      🖥️ LAPTOP
      -->
      {#if !isViewTablet}
        <p
          class=
          "
          s-14
          w-400
          color-grey
          "
        >
          © 2021 Betarena All rights reserved
        </p>
      {/if}

    </div>

    <!--
    FOLLOW SOCIAL MEDIA LINKS
    -->
    <div
      id="{CNAME}⮕social-box"
    >

      <!--
      FOLLOW US (text)
      -->
      <p
        class=
        "
        color-white
        s-14
        w-normal
        m-b-20
        "
      >
        {B_FOT_T?.terms?.follow ?? 'Follow us'}
      </p>

      <!--
      SOCIAL MEDIA FOLLOWS
      -->
      <div
        id="{CNAME}⮕social-media-box"
        class=
        "
        column-start-grid
        "
      >

        <!--
        LIST OF SOCIAL MEDIA ICONS
        -->
        {#each socialNetworkOrder ?? [] as key}

          <!--
          SOCIAL LINK
          -->
          <a
            rel="external"
            href={B_FOT_T?.links?.social_networks?.[key]}
          >
            {#if icon_github}
              <img
                loading="lazy"
                src={getSocialIcon(key)}
                alt="{key?.toLowerCase()}-icon"
                title="{key?.toLowerCase()}-icon"
                width=32
                height=32
              />
            {/if}
          </a>

        {/each}

      </div>

    </div>

    <!--
    SUBSCRIBE TO NEWSLETTER
    -->
    <div
      id="{CNAME}⮕newsletter-box"
    >

      <!--
      SECTION TITLE
      -->
      <p
        class=
        "
        color-white
        s-14
        w-normal
        m-b-8
        {isViewMobile ? 'text-center' : 'text-left'}
        "
      >
        {B_FOT_T?.terms?.subscribe_newsletter ?? 'Subscribe to newsletter'}
      </p>

      <!--
      SUMIT BUTTON
      -->
      <button
        id="newsletter-subscribe-btn"
        class=
        "
        btn-primary-v2
        "
        on:click={() => $sessionStore.newsletterPopUpShow = true}
      >
        <p
          class=
          "
          color-white
          s-14
          w-500
          "
        >
          {B_FOT_T?.terms?.subscribe_cta}
        </p>
      </button>

    </div>

    <!--
    MENU LIST
    -->
    <div
      id="{CNAME}⮕menu-list"
      class:row-space-start={!isViewMobile}
    >

      <ul>

        <!--
        LATEST NEWS
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <a
            rel="external"
            href={B_FOT_T?.links?.latest_news}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              hover-color-primary
              "
            >
              {B_FOT_T?.terms?.latest_news}
            </p>
          </a>
        </li>

        <!--
        SEPARATOR
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <div
            class="menu-separator"
          />
        </li>

        <!--
        ABOUT US LINK
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <a
            rel="external"
            href={B_FOT_T?.links?.about_us}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              hover-color-primary
              "
            >
              {B_FOT_T?.terms?.about_us}
            </p>
          </a>
        </li>

        <!--
        SEPARATOR
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <div
            class="menu-separator"
          />
        </li>

        <!--
        TERMS AND CONDITIONS
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <a
            rel="external"
            href={B_FOT_T?.links?.terms}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              hover-color-primary
              "
            >
              {B_FOT_T?.terms?.terms}
            </p>
          </a>
        </li>

      </ul>

      <ul>

        <!--
        SEPARATOR
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <div
            class="menu-separator"
          />
        </li>

        <!--
        PRIVACY AND CONDITIONS
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <a
            rel="external"
            href={B_FOT_T?.links?.privacy}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              hover-color-primary
              "
            >
              {B_FOT_T?.terms?.privacy}
            </p>
          </a>
        </li>

        <!--
        SEPARATOR
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <div
            class="menu-separator"
          />
        </li>

        <!--
        STATUS
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <a
            rel="external"
            href={B_FOT_T?.links?.status}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              hover-color-primary
              "
            >
              {B_FOT_T?.terms?.status}
            </p>
          </a>
        </li>

        <!--
        SEPARATOR
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <div
            class="menu-separator"
          />
        </li>

        <!--
        CHANGELOG
        -->
        <li
          class=
          "
          m-r-10
          "
          class:m-b-16={isViewMobile}
        >
          <a
            rel="external"
            href={B_FOT_T?.links?.changelog}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              hover-color-primary
              "
            >
              {B_FOT_T?.terms?.changelog}
            </p>
          </a>
        </li>

      </ul>

    </div>

    <!--
    LEGAL BETTING ICON
    -->
    <div
      id="{CNAME}⮕legal-bet-box"
      class=
      "
      row-space-start
      width-auto
      "
    >
      <img
        loading="lazy"
        src={legal18icon}
        alt="legal18icon"
        title="legal18icon"
        width="48px"
        height="24px"
        class="m-r-24"
      />
      <img
        loading="lazy"
        src={begambleawareorg}
        alt="begambleawareorg"
        title="begambleawareorg"
        width="130px"
        height="16px"
      />
    </div>

    <!--
    COMPANY DETAILS
    -->
    <div
      id="{CNAME}⮕company-box"
    >

      <p
        class=
        "
        s-14
        w-500
        color-grey
        "
      >
        Second Act

        <!--
        🖥️ LAPTOP
        -->
        {#if !isViewTablet || isViewMobile}
          <br/>
        {/if}

        <span
          class=
          "
          s-14
          w-400
          color-grey
          "
          class:m-l-10={isViewTablet}
        >
          18 Boulevard Montmartre Paris 75009
        </span>
      </p>

      <!--
      📱 MOBILE + 💻 TABLET
      -->
      {#if isViewTablet}
        <p
          class=
          "
          s-14
          w-400
          color-grey
          m-t-8
          "
        >
          © 2021 Betarena All rights reserved
        </p>
      {/if}

    </div>

  </div>

</footer>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>

	footer
  {
    /* 🎨 style */
		background: #292929;
		width: -webkit-fill-available;
		padding: 48px 18px;
		box-shadow: inset 0px 1px 0px #616161;
	}

	div#global⮕footer⮕w⮕main⮕inner
  {
    /* 📌 position */
		display: grid;
    gap: 32px 85px;
    grid-template-columns: 1fr;
    align-items: start;
		justify-items: stretch;
    /* 🎨 style */
		max-width: 1378px;
		text-align: center;
	}

  div#global⮕footer⮕w⮕main⮕brand
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 1;
    /* 🎨 style */
    justify-self: center;
  }
	div#global⮕footer⮕w⮕main⮕brand img
  {
    /* 🎨 style */
		height: 32px;
		width: 151px;
	}

  div#global⮕footer⮕w⮕main⮕social-box
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 2;
  }
  div#global⮕footer⮕w⮕main⮕social-media-box
  {
    /* 🎨 style */
		gap: 16px;
		grid-auto-flow: column;
		width: 100%;
	}

  div#global⮕footer⮕w⮕main⮕newsletter-box
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 3;
  }
	div#global⮕footer⮕w⮕main⮕newsletter-box button#newsletter-subscribe-btn
  {
    /* 🎨 style */
		height: 44px;
		width: 100%;
	}

  div#global⮕footer⮕w⮕main⮕menu-list
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 4;
  }
  div#global⮕footer⮕w⮕main⮕menu-list ul
  {
    /* 📌 position */
		display: flex;
    /* 🎨 style */
		list-style-type: none;
		padding: 0;
		margin: 0;
		place-content: center;
	}
	div#global⮕footer⮕w⮕main⮕menu-list div.menu-separator
  {
    /* 🎨 style */
		width: 1px;
		height: 16px;
		background-color: #4b4b4b;
	}

  div#global⮕footer⮕w⮕main⮕legal-bet-box
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 5;
    /* 🎨 style */
    justify-content: center;
  }

  div#global⮕footer⮕w⮕main⮕company-box
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 6;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

	@media screen
  and (min-width: 710px)
  {

		footer
    {
			height: 416px;
			padding: 68px 34px;
		}

    div#global⮕footer⮕w⮕main⮕inner
    {
      /* 📌 position */
      display: grid;
      gap: 32px 85px;
      grid-template-columns: repeat(2, auto);
      grid-template-rows: repeat(4, auto);
      justify-items: start;
      align-items: initial;
      text-align: initial;
      justify-content: space-between;
		}

    div#global⮕footer⮕w⮕main⮕brand
    {
      /* 🎨 style */
      justify-self: unset;
    }

    div#global⮕footer⮕w⮕main⮕social-box
    {
      /* 📌 position */
      grid-column: 1;
      grid-row: 2;
    }

		div#global⮕footer⮕w⮕main⮕newsletter-box
    {
      /* 📌 position */
      grid-column: 2;
      grid-row: 2;
      /* 🎨 style */
			width: 250px;
      height: fit-content;
		}

    div#global⮕footer⮕w⮕main⮕menu-list
    {
      /* 📌 position */
      grid-column: 1 / 3;
      grid-row: 3;
    }
		div#global⮕footer⮕w⮕main⮕menu-list ul
    {
			place-content: unset;
		}

    div#global⮕footer⮕w⮕main⮕company-box
    {
      /* 📌 position */
      grid-column: 1;
      grid-row: 4;
    }

    div#global⮕footer⮕w⮕main⮕legal-bet-box
    {
      /* 📌 position */
      grid-column: 2;
      grid-row: 4;
      /* 🎨 style */
      justify-self: right;
    }

	}

	@media screen
  and (min-width: 1160px)
  {

		footer
    {
      /* 🎨 style */
			height: 246px;
			padding: 56px 34px;
			text-align: center;
			text-align: -webkit-center;
			text-align: -moz-center;
		}

		/*
    ▓▓ inner container */
    div#global⮕footer⮕w⮕main⮕inner
    {
      /* 📌 position */
			display: grid;
      gap: 17px 85px;
      grid-template-columns: repeat(3, auto);
      grid-template-rows: repeat(2, auto);
			justify-content: space-between;
			justify-items: stretch;
      align-items: end;
		}

    /*
    ▓▓ platform menu list */
    div#global⮕footer⮕w⮕main⮕menu-list
    {
      /* 📌 position */
      grid-column: 2;
      grid-row: 2;
    }

    /*
    ▓▓ newsletter box */
    div#global⮕footer⮕w⮕main⮕newsletter-box
    {
      /* 📌 position */
      grid-column: 3;
      grid-row: 1;
      /* 🎨 style */
			width: 100%;
		}
		div#global⮕footer⮕w⮕main⮕newsletter-box button#newsletter-subscribe-btn
    {
      /* 🎨 style */
			padding: 11.5px 23.5px;
      min-width: 328px;
		}

    /*
    ▓▓ social box */
    div#global⮕footer⮕w⮕main⮕social-box
    {
      /* 📌 position */
      grid-column: 2;
      grid-row: 1;
    }
    div#global⮕footer⮕w⮕main⮕social-media-box
    {
      /* 🎨 style */
			justify-content: left;
      gap: 16px;
      grid-auto-flow: column;
      width: 100%;
    }

    /*
    ▓▓ company box */
    div#global⮕footer⮕w⮕main⮕company-box
    {
      /* 📌 position */
      grid-column: 1;
      grid-row: 2;
    }

    /*
    ▓▓ legal bet box */
    div#global⮕footer⮕w⮕main⮕legal-bet-box
    {
      /* 📌 position */
      grid-column: 3;
      grid-row: 2;
      /* 🎨 style */
      justify-self: left;
    }

	}

</style>
