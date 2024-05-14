<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Footer Component                                                          │
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
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import { viewportChangeV2 } from '$lib/utils/device';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import TranslationText from '$lib/components/misc/Translation-Text.svelte';

	import type { B_H_SFOOTD_Social_Network } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { B_FOT_T } from '@betarena/scores-lib/types/types.main.footer.js';
    import { routeIdContent, routeIdPageTags } from '$lib/constants/paths.js';

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

  /**
   * @description
   *  📣 Component `Type`.
   */
  type IDynamicAssetMap =
    | 'begambleawareorg'
    | 'logoFull'
    | 'legal18icon'
    | 'discord'
    | 'linkedin'
    | 'medium'
    | 'telegram'
    | 'x'
    | 'github'
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = 'global⮕footer⮕w⮕main',
    /**
     * @description
     *  📣 Dynamic import variable condition
     */
    useDynamicImport: boolean = true,
    /**
     * @description
     *  📣 Target social media order.
     */
    socialNetworkOrder: B_H_SFOOTD_Social_Network[]
    = [
      'discord',
      'telegram',
      'x',
      'medium',
      'linkedin',
      'github'
    ]
  ;

  let
    /**
     * @description
     *  📣 Holds target `component(s)` of dynamic nature.
     */
    dynamicAssetMap = new Map< IDynamicAssetMap, any >(),
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 710, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  $: ({ windowWidth } = $sessionStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    );
  $: homepageURL
    = $sessionStore.serverLang != 'en'
      ? `/${$page.params.lang}`
      : '/';
  $: logoLink
    = $sessionStore.serverLang != 'en'
      ? `${$page.url.origin}/${$sessionStore.serverLang}`
      : $page.url.origin;

  $: translation = $page.data.B_FOT_T as B_FOT_T;

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
    async () =>
    {
      if (useDynamicImport)
      {
        dynamicAssetMap.set('begambleawareorg', (await import('./assets/begambleawareorg_black.png')).default);
        dynamicAssetMap.set('logoFull', (await import('./assets/betarena-logo-full.svg')).default);
        dynamicAssetMap.set('legal18icon', (await import('./assets/legal-18-action-bet.png')).default);
        dynamicAssetMap.set('discord', (await import('./assets/icon/discord.svg')).default);
        dynamicAssetMap.set('linkedin', (await import('./assets/icon/linkedin.svg')).default);
        dynamicAssetMap.set('medium', (await import('./assets/icon/medium.svg')).default);
        dynamicAssetMap.set('telegram', (await import('./assets/icon/telegram.svg')).default);
        dynamicAssetMap.set('x', (await import('./assets/icon/x.svg')).default);
        dynamicAssetMap.set('github', (await import('./assets/icon/github.svg')).default);

        dynamicAssetMap = dynamicAssetMap;
      }

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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

<!--
╭─────
│ > Footer SEO
╰─────
-->
<SeoBox>
  <p>{logoLink}</p>
  <!--
  ╭─────
  │ > Social Links [1]
  ╰─────
  -->
  <p>{translation.links.latest_news}</p>
  <p>{translation.links.about_us}</p>
  <p>{translation.links.betting_tips}</p>
  <p>{translation.links.privacy}</p>
  <p>{translation.links.social_networks}</p>
  <p>{translation.links.terms}</p>
  <p>{translation.links.status}</p>
  <p>{translation.links.changelog}</p>
  <!--
  ╭─────
  │ > Social Links [2]
  ╰─────
  -->
  {#each Object.keys(translation.links.social_networks) ?? [] as key}
    <p>{translation.links.social_networks[key]}</p>
  {/each}
</SeoBox>

<!--
╭─────
│ > Fotter Container
╰─────
-->
{#if $page.route.id !== routeIdPageTags && $page.route.id !== routeIdContent || ($page.route.id === routeIdPageTags && !VIEWPORT_TABLET_INIT[1] && !VIEWPORT_MOBILE_INIT[1])}

  <footer>

    <div
      id="{CNAME}⮕inner"
    >

      <!--
      ╭─────
      │ > Betarena Brand
      ╰─────
      -->
      <div
        id="{CNAME}⮕brand"
        on:click=
        {
          () =>
          {
            if ($page.url.pathname.split('/').length - 1 ==	1)
              window.location.reload();
            return;
          }
        }
        on:keypress=
        {
          (e) =>
          {
            if (e.key === 'Enter')
              if ($page.url.pathname.split('/').length - 1 ==	1)
                window.location.reload();
          }
        }
      >

        <a
          href={homepageURL}
          title={logoLink}
          class:m-b-12={!VIEWPORT_TABLET_INIT[1]}
        >
          <img
            loading="lazy"
            src={dynamicAssetMap.get('logoFull')}
            alt="betarena-logo"
            title={logoLink}
          />
        </a>

        <!--
        ╭─────
        │ > 🖥️ LAPTOP
        ╰─────
        -->
        {#if !VIEWPORT_TABLET_INIT[1]}
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
      ╭─────
      │ > Follow Social Media Links
      ╰─────
      -->
      <div
        id="{CNAME}⮕social-box"
      >

        <!--
        ╭─────
        │ > Follow us
        ╰─────
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
          <TranslationText
            key={`${CNAME}/unknown`}
            text={translation.terms.follow}
            fallback={'Follow us'}
          />
        </p>

        <!--
        ╭─────
        │ > Social Media Follows
        ╰─────
        -->
        <div
          id="social-media-box"
          class=
          "
          column-start-grid
          "
        >

          <!--
          ╭─────
          │ > List of social media icons
          ╰─────
          -->
          {#each socialNetworkOrder as key}

            <!--
            ╭─────
            │ > Social Link
            ╰─────
            -->
            <a
              rel="external"
              target="_blank"
              href={translation.links.social_networks[key]}
            >
              <img
                loading="lazy"
                src={dynamicAssetMap.get(key)}
                alt="{key.toLowerCase()}-icon"
                title="{key.toLowerCase()}-icon"
                width=32
                height=32
              />
            </a>

          {/each}

        </div>

      </div>

      <!--
      ╭─────
      │ > Subsribe to Newsletter
      ╰─────
      -->
      <div
        id="{CNAME}⮕newsletter-box"
      >
        <!--
        ╭─────
        │ > Section Title
        ╰─────
        -->
        <p
          class=
          "
          color-white
          s-14
          w-normal
          m-b-8
          {VIEWPORT_MOBILE_INIT[1] ? 'text-center' : 'text-left'}
          "
        >
          <TranslationText
            key={`${CNAME}/newsletter-box`}
            text={translation.terms.subscribe_newsletter}
            fallback={'Subscribe to newsletter'}
          />
        </p>

        <!--
        ╭─────
        │ > Submit Button
        ╰─────
        -->
        <button
          id="newsletter-subscribe-btn"
          class=
          "
          btn-primary-v2
          "
          on:click=
          {
            () =>
            {
              $sessionStore.currentActiveModal = 'Footer_Newsletter_Modal';
              return;
            }
          }
        >
          <p
            class=
            "
            color-white
            s-14
            w-500
            "
          >
            <TranslationText
              key={`${CNAME}/unknown`}
              text={translation.terms.subscribe_cta}
              fallback={'Subsribe'}
            />
          </p>
        </button>

      </div>

      <!--
      ╭─────
      │ > Menu List
      ╰─────
      -->
      <div
        id="{CNAME}⮕menu-list"
        class:row-space-start={!VIEWPORT_MOBILE_INIT[1]}
      >

        <!--
        ╭─────
        │ > 1st List Set
        ╰─────
        -->
        <ul>

          <!--
          ╭─────
          │ > Navigation Link :|: Latest News
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <a
              rel="external"
              href={translation.links.latest_news}
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
                <TranslationText
                  key={`${CNAME}/unknown`}
                  text={translation.terms.latest_news}
                  fallback={'Latest News'}
                />
              </p>
            </a>
          </li>

          <!--
          ╭─────
          │ > Separator
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <div
              class=
              "
              menu-separator
              "
            />
          </li>

          <!--
          ╭─────
          │ > Navigation Link :|: 'About Us'
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <a
              rel="external"
              href={translation.links.about_us}
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
                <TranslationText
                  key={`${CNAME}/unknown`}
                  text={translation.terms.about_us}
                  fallback={'About Us'}
                />
              </p>
            </a>
          </li>

          <!--
          ╭─────
          │ > Separator
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <div
              class=
              "
              menu-separator
              "
            />
          </li>

          <!--
          ╭─────
          │ > Navigation Link :|: 'Terms And Conditions'
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <a
              rel="external"
              href={translation.links.terms}
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
                <TranslationText
                  key={`${CNAME}/unknown`}
                  text={translation.terms.terms}
                  fallback={'Terms & Conditions'}
                />
              </p>
            </a>
          </li>

        </ul>

        <!--
        ╭─────
        │ > 2nd List Set
        ╰─────
        -->
        <ul>

          <!--
          ╭─────
          │ > Separator
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <div
              class=
              "
              menu-separator
              "
            />
          </li>

          <!--
          ╭─────
          │ > Navigation Link :|: 'Privacy And Conditions'
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <a
              rel="external"
              href={translation.links.privacy}
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
                <TranslationText
                  key={`${CNAME}/unknown`}
                  text={translation.terms.privacy}
                  fallback={'Privacy'}
                />
              </p>
            </a>
          </li>

          <!--
          ╭─────
          │ > Separator
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <div
              class=
              "
              menu-separator
              "
            />
          </li>

          <!--
          ╭─────
          │ > Navigation Link :|: 'Status'
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <a
              rel="external"
              href={translation.links.status}
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
                <TranslationText
                  key={`${CNAME}/unknown`}
                  text={translation.terms.status}
                  fallback={'Status'}
                />
              </p>
            </a>
          </li>

          <!--
          ╭─────
          │ > Separator
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <div
              class=
              "
              menu-separator
              "
            />
          </li>

          <!--
          ╭─────
          │ > Navigation Link :|: 'Changelog'
          ╰─────
          -->
          <li
            class=
            "
            m-r-10
            "
            class:m-b-16={VIEWPORT_MOBILE_INIT[1]}
          >
            <a
              rel="external"
              href={translation.links.changelog}
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
                <TranslationText
                  key={`${CNAME}/unknown`}
                  text={translation.terms.changelog}
                  fallback={'Changelog'}
                />
              </p>
            </a>
          </li>

        </ul>

      </div>

      <!--
      ╭─────
      │ > Legal Betting Icon
      ╰─────
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
          src={dynamicAssetMap.get('legal18icon')}
          alt="legal18icon"
          title="legal18icon"
          width="48"
          height="24"
          class=
          "
          m-r-24
          "
        />
        <img
          loading="lazy"
          src={dynamicAssetMap.get('begambleawareorg')}
          alt="begambleawareorg"
          title="begambleawareorg"
          width="130"
          height="16"
        />
      </div>

      <!--
      ╭─────
      │ > Company Details
      ╰─────
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
          {#if !VIEWPORT_TABLET_INIT[1] || VIEWPORT_MOBILE_INIT[1]}
            <br/>
          {/if}

          <span
            class=
            "
            s-14
            w-400
            color-grey
            "
            class:m-l-10={VIEWPORT_TABLET_INIT[1]}
          >
            18 Boulevard Montmartre Paris 75009
          </span>
        </p>

        <!--
        📱 MOBILE + 💻 TABLET
        -->
        {#if VIEWPORT_TABLET_INIT[1]}
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

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	footer
  {
    /* 🎨 style */
		background: #292929;
		width: -webkit-fill-available;
		padding: 48px 18px;

    div#global⮕footer⮕w⮕main
    {

      &⮕inner
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

      &⮕brand
      {
        /* 📌 position */
        grid-column: 1;
        grid-row: 1;
        /* 🎨 style */
        justify-self: center;

        img
        {
          /* 🎨 style */
          height: 32px;
          width: 151px;
        }
      }

      &⮕social-box
      {
        /* 📌 position */
        grid-column: 1;
        grid-row: 2;

        div#social-media-box
        {
          /* 🎨 style */
          gap: 16px;
          grid-auto-flow: column;
          width: 100%;
        }
      }

      &⮕newsletter-box
      {
        /* 📌 position */
        grid-column: 1;
        grid-row: 3;

        button#newsletter-subscribe-btn
        {
          /* 🎨 style */
          height: 44px;
          width: 100%;
        }
      }

      &⮕menu-list
      {
        /* 📌 position */
        grid-column: 1;
        grid-row: 4;

        ul
        {
          /* 📌 position */
          display: flex;
          /* 🎨 style */
          list-style-type: none;
          padding: 0;
          margin: 0;
          place-content: center;
        }

        div.menu-separator
        {
          /* 🎨 style */
          width: 1px;
          height: 16px;
          background-color: #4b4b4b;
        }
      }

      &⮕legal-bet-box
      {
        /* 📌 position */
        grid-column: 1;
        grid-row: 5;
        /* 🎨 style */
        justify-content: center;
      }

      &⮕company-box
      {
        /* 📌 position */
        grid-column: 1;
        grid-row: 6;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	@media screen
  and (min-width: 710px)
  {
		footer
    {
      /* 🎨 style */
			height: 416px;
			padding: 68px 34px;

      div#global⮕footer⮕w⮕main
      {
        &⮕inner
        {
          /* 🛝 layout */
          display: grid;
          gap: 32px 85px;
          grid-template-columns: repeat(2, auto);
          grid-template-rows: repeat(4, auto);
          justify-items: start;
          align-items: initial;
          text-align: initial;
          justify-content: space-between;
        }

        &⮕brand
        {
          /* 🎨 style */
          justify-self: unset;
        }

        &⮕social-box
        {
          /* 📌 position */
          grid-column: 1;
          grid-row: 2;
        }

        &⮕newsletter-box
        {
          /* 📌 position */
          grid-column: 2;
          grid-row: 2;
          /* 🎨 style */
          width: 250px;
          height: fit-content;
        }

        &⮕menu-list
        {
          /* 📌 position */
          grid-column: 1 / 3;
          grid-row: 3;

          ul
          {
            /* 🎨 style */
            place-content: unset;
          }
        }

        &⮕company-box
        {
          /* 📌 position */
          grid-column: 1;
          grid-row: 4;
        }

        &⮕legal-bet-box
        {
          /* 📌 position */
          grid-column: 2;
          grid-row: 4;
          /* 🎨 style */
          justify-self: right;
        }
      }
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

      div#global⮕footer⮕w⮕main
      {
        &⮕inner
        {
          /* 🛝 layout */
          display: grid;
          gap: 17px 85px;
          grid-template-columns: repeat(3, auto);
          grid-template-rows: repeat(2, auto);
          justify-content: space-between;
          justify-items: stretch;
          align-items: end;
        }

        &⮕menu-list
        {
          /* 📌 position */
          grid-column: 2;
          grid-row: 2;
        }

        &⮕newsletter-box
        {
          /* 📌 position */
          grid-column: 3;
          grid-row: 1;
          /* 🎨 style */
          width: 100%;

          button#newsletter-subscribe-btn
          {
            /* 🎨 style */
            padding: 11.5px 23.5px;
            min-width: 328px;
          }
        }

        &⮕social-box
        {
          /* 📌 position */
          grid-column: 2;
          grid-row: 1;

          div#social-media-box
          {
            /* 🎨 style */
            justify-content: left;
            gap: 16px;
            grid-auto-flow: column;
            width: 100%;
          }
        }

        &⮕company-box
        {
          /* 📌 position */
          grid-column: 1;
          grid-row: 2;
        }

        &⮕legal-bet-box
        {
          /* 📌 position */
          grid-column: 3;
          grid-row: 2;
          /* 🎨 style */
          justify-self: left;
        }
      }
    }
	}

</style>
