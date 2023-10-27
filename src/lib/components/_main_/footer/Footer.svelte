<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import SeoBox from '$lib/components/SEO-Box.svelte';

	import sessionStore from '$lib/store/session.js';

	import { dlog, FT_W_TAG } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions';

	import type { B_FOT_T } from '@betarena/scores-lib/types/footer.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    VIEWPORT_MOBILE_INIT = 710,
    VIEWPORT_TABLET_INIT = 1160
  ;

  let
    // ◼️ IMPORTANT
    isViewMobile: boolean = true,
    isViewTablet: boolean = true,
    // ◼️ IMPORTANT
    B_FOT_T: B_FOT_T = $page.data?.B_FOT_T,
    // ◼️ IMPORTANT
    homepageURL: string,
    logoLink: string,
    begambleawareorg: string,
    logo_full: string,
    legal18icon: string
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

  $: B_FOT_T: B_FOT_T = $page.data?.B_FOT_T,

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description form SUBMIT method to
   * register user on the BETARENA EMAIL LIST
  */
	async function submitEmail
  (
  ): Promise < void >
  {
    // [🐞]
    dlog
    (
      `${FT_W_TAG[0]} subscribing to email newsletter!`
    );

		$sessionStore.newsletterPopUpShow = true;
	}

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

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  onMount
  (
    async () =>
    {
      begambleawareorg = (await import('./assets/begambleawareorg_black.png')).default;
      logo_full = (await import('./assets/betarena-logo-full.svg')).default;
      legal18icon = (await import('./assets/legal-18-action-bet.png')).default;

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

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
FOOTER SEO
-->
<SeoBox>

  <p>{logoLink}</p>

  <!--
  SOCIAL LINKS
  -->
  <p>
    {B_FOT_T?.scores_footer_links?.latest_news}
  </p>
  <p>
    {B_FOT_T?.scores_footer_links?.about_us}
  </p>
  <p>
    {B_FOT_T?.scores_footer_links?.betting_tips}
  </p>
  <p>
    {B_FOT_T?.scores_footer_links?.privacy}
  </p>
  <p>
    {B_FOT_T?.scores_footer_links?.social_networks}
  </p>
  <p>
    {B_FOT_T?.scores_footer_links?.terms}
  </p>

  <!--
  SOCIAL LINKS - 2
  -->
  {#each B_FOT_T?.scores_footer_links?.social_networks ?? [] as social_network}
    <p>
      {social_network[1]}
    </p>
  {/each}

</SeoBox>

<!--
FOOTER COMPONENT
-->
<footer>

  <div
    id="inner-footer"
  >

    <!--
    BETARENA BRAND
    -->
    <div
      id="brand"
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
      id="social-box"
    >

      <p
        class=
        "
        color-white
        s-14
        w-normal
        m-b-20
        "
      >
        {B_FOT_T?.scores_footer_translations?.follow}
      </p>

      <!--
      SOCIAL MEDIA FOLLOWS
      -->
      <div
        id="social-media-box"
        class=
        "
        column-start-grid
        "
      >

        <!--
        LIST OF SOCIAL MEDIA ICONS
        -->
        {#each B_FOT_T?.scores_footer_links?.social_networks ?? [] as social_network}

          <!--
          SOCIAL LINK
          -->
          <a
            rel="external"
            href={social_network[1]}
          >
            <img
              loading="lazy"
              src="/assets/svg/footer/icon/{social_network[0].toString().toLocaleLowerCase()}.svg"
              alt="{social_network[0].toString().toLocaleLowerCase()}-icon"
              title="{social_network[0].toString().toLocaleLowerCase()}-icon"
              width=32
              height=32
            />
          </a>

        {/each}

      </div>

    </div>

    <!--
    SUBSCRIBE TO NEWSLETTER
    -->
    <div
      id="newsletter-box"
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
        text-left
        "
      >
        {B_FOT_T?.scores_footer_translations?.subscribe_newsletter}
      </p>

      <!--
      FORM START
      -->
      <form
        on:submit|preventDefault={() =>	submitEmail()}
        class:row-space-out={!isViewTablet}
      >

        <!--
        INPUT FIELD EMAIL
        -->
        <input
          id=""
          type="email"
          name="type_email"
          placeholder={B_FOT_T?.scores_footer_translations?.type_email}
          class=
          "
          s-14
          w-400
          color-grey
          "
          class:m-b-12={isViewTablet}
          class:m-r-20={!isViewTablet}
        />

        <!--
        SUMIT BUTTON
        -->
        <button
          id="newsletter-subscribe-btn"
          class=
          "
          btn-primary
          "
          type="submit"
        >
          <p
            class=
            "
            color-white
            s-14
            w-500
            "
          >
            {B_FOT_T?.scores_footer_translations?.subscribe_cta}
          </p>
        </button>

      </form>

    </div>

    <!--
    MENU LIST
    -->
    <div
      id="menu-list"
      class:row-space-start={!isViewMobile}
      class:m-t-45={!isViewMobile && isViewTablet}
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
            href={B_FOT_T?.scores_footer_links?.latest_news}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              "
            >
              {B_FOT_T?.scores_footer_translations?.latest_news}
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
        BETTING TIPS
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
            href={B_FOT_T?.scores_footer_links?.betting_tips}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              "
            >
              {B_FOT_T?.scores_footer_translations?.betting_tips}
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
            href={B_FOT_T?.scores_footer_links?.about_us}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              "
            >
              {B_FOT_T?.scores_footer_translations?.about_us}
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
            href={B_FOT_T?.scores_footer_links?.terms}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              "
            >
              {B_FOT_T?.scores_footer_translations?.terms}
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
            href={B_FOT_T?.scores_footer_links?.privacy}
          >
            <p
              class=
              "
              color-white
              s-14
              w-normal
              "
            >
              {B_FOT_T?.scores_footer_translations?.privacy}
            </p>
          </a>
        </li>

      </ul>

    </div>

    <!--
    LEGAL BETTING ICON
    -->
    <div
      id="legal-bet-box"
      class=
      "
      row-space-start
      "
      style="width: auto;"
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
      id="company-box"
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
      </p>

      <p
        class=
        "
        s-14
        w-400
        color-grey
        "
      >
        18 Boulevard Montmartre Paris 75009
      </p>

      <!--
      📱 MOBILE
      -->
      {#if isViewTablet}
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

  </div>

</footer>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	footer
  {
    /* 🎨 style */
		background: #292929;
		height: 645px;
		width: -webkit-fill-available;
		padding: 48px 18px;
		box-shadow: inset 0px 1px 0px #616161;
	}

	footer #inner-footer
  {
    /* 📌 position */
		display: grid;
    gap: 17px 85px;
    grid-template-columns: 1fr;
    align-items: start;
		justify-items: stretch;
    /* 🎨 style */
		max-width: 1378px;
		text-align: center;
	}

  div#brand
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 1;
    /* 🎨 style */
    justify-self: center;
  }
	div#brand img
  {
    /* 🎨 style */
		height: 32px;
		width: 151px;
	}

  div#social-box
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 2;
  }
  div#social-media-box
  {
    /* 🎨 style */
		gap: 16px;
		grid-auto-flow: column;
		width: 100%;
	}

  div#newsletter-box
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 3;
  }
	div#newsletter-box input
  {
    /* 🎨 style */
		background: #4b4b4b;
		border-radius: 8px;
		padding: 12px 20px;
		width: 100%;
	}
	div#newsletter-box button#newsletter-subscribe-btn
  {
    /* 🎨 style */
		height: 44px;
		width: 100%;
		background: #f5620f;
		box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
		border-radius: 8px;
	}

  div#menu-list
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 4;
  }
  div#menu-list ul
  {
    /* 📌 position */
		display: flex;
    /* 🎨 style */
		list-style-type: none;
		/* flex-wrap: wrap; */
		padding: 0;
		margin: 0;
		place-content: center;
	}
	div#menu-list div.menu-separator
  {
    /* 🎨 style */
		width: 1px;
		height: 16px;
		background-color: #4b4b4b;
	}

  div#legal-bet-box
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 5;
    /* 🎨 style */
    justify-content: center;
  }

  div#company-box
  {
    /* 📌 position */
    grid-column: 1;
    grid-row: 6;
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media screen
  and (min-width: 710px)
  {

		footer
    {
			height: 416px;
			padding: 68px 34px;
		}

    footer #inner-footer
    {
      /* 📌 position */
      display: grid;
      grid-template-columns: repeat(2, auto);
      grid-template-rows: repeat(4, auto);
      justify-items: start;
      align-items: initial;
      text-align: initial;
      justify-content: space-between;
		}

    div#brand
    {
      /* 🎨 style */
      justify-self: unset;
    }

    div#social-box
    {
      /* 📌 position */
      grid-column: 1;
      grid-row: 2;
    }

		div#newsletter-box
    {
      /* 📌 position */
      grid-column: 2;
      grid-row: 1 / 3;
      /* 🎨 style */
			width: 340px;
		}

    div#menu-list
    {
      /* 📌 position */
      grid-column: 1 / 3;
      grid-row: 3;
    }
		div#menu-list ul
    {
			place-content: unset;
		}

    div#company-box
    {
      /* 📌 position */
      grid-column: 1;
      grid-row: 4;
    }

    div#legal-bet-box
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

		footer #inner-footer
    {
      /* 📌 position */
			display: grid;
      grid-template-columns: repeat(3, auto);
      grid-template-rows: repeat(2, auto);
			justify-content: space-between;
			justify-items: stretch;
      align-items: end;
		}

    div#menu-list
    {
      /* 📌 position */
      grid-column: 2;
      grid-row: 2;
    }

    div#newsletter-box
    {
      /* 📌 position */
      grid-column: 2;
      grid-row: 1;
      /* 🎨 style */
			width: 100%;
		}
		div#newsletter-box input
    {
      /* 🎨 style */
			width: 100%;
			min-width: 430px;
		}
		div#newsletter-box button#newsletter-subscribe-btn
    {
      /* 🎨 style */
			padding: 11.5px 23.5px;
			width: fit-content;
		}

    div#social-box
    {
      /* 📌 position */
      grid-column: 3;
      grid-row: 1;
    }
    div#social-media-box
    {
      /* 🎨 style */
			justify-content: left;
      gap: 16px;
      grid-auto-flow: column;
      width: 100%;
    }

    div#company-box
    {
      /* 📌 position */
      grid-column: 1;
      grid-row: 2;
    }

    div#legal-bet-box
    {
      /* 📌 position */
      grid-column: 3;
      grid-row: 2;
    }

	}

</style>
