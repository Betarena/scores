<!-- ===================
COMPONENT JS - BASIC
=================== -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { listenRealTimeScoreboardAll, onceRealTimeLiveScoreboard } from '$lib/firebase/common';
	import sessionStore from '$lib/store/session.js';
	import { dlog } from '$lib/utils/debug';

  import FeatBetSiteWidget from '$lib/components/page/home/feat-bet-site/FeatBetSite-Widget.svelte';
  import FeatMatchWidget from '$lib/components/page/home/feat-match/FeatMatch-Widget.svelte';
  import LeagueListWidget from '$lib/components/page/home/league-list/LeagueList-Widget.svelte';
  import LeaguesTableWidget from '$lib/components/page/home/leagues-table/Leagues-Table-Widget.svelte';
  import LivescoresWidget from '$lib/components/page/home/livescores-v2/Livescores_Widget.svelte';
  import SeoBlock from '$lib/components/page/home/seo-block/SEO-Block-Widget.svelte';
  import SvelteSeo from 'svelte-seo';
  import TopGoalScorersWidget from './top-goalscorers/TopGoalScorers-Widget.svelte';

  import { viewport_change } from '$lib/utils/platform-functions.js';
  import type { B_SAP_HP_T } from '@betarena/scores-lib/types/seo-pages.js';
  import type { Unsubscribe } from 'firebase/database';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    MOBILE_VIEW = 475,
    TABLET_VIEW = 1160
  ;

	let
    PAGE_DATA_SEO: B_SAP_HP_T,
    FIREBASE_CONNECTIONS_SET: Set<Unsubscribe> = new Set(),
    mobileExclusive: boolean = true,
    tabletExclusive: boolean = true
  ;

	$: PAGE_DATA_SEO = $page.data?.PAGE_DATA_SEO;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description
   * TODO: DOC:
   */
  function resizeInit
  (
  )
  {
    [
      tabletExclusive,
      mobileExclusive
    ] = viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
    window.addEventListener
    (
      'resize',
      function () {
        [
          tabletExclusive,
          mobileExclusive
        ] = viewport_change
        (
          TABLET_VIEW,
          MOBILE_VIEW
        );
      }
    );
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🚏 ONE-OFF CONDITIONS

  if (browser)
  {
    onceRealTimeLiveScoreboard()
  }

  if ($sessionStore.deviceType == 'mobile')
  {
    mobileExclusive = true;
    tabletExclusive = false;
  }
  if ($sessionStore.deviceType == 'tablet')
  {
    mobileExclusive = true;
    tabletExclusive = true;
  }
  if ($sessionStore.deviceType == 'desktop')
  {
    mobileExclusive = false;
    tabletExclusive = false;
  }

  // #endregion ➤ 🚏 ONE-OFF CONDITIONS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  onMount
  (
    async() =>
    {

      // NOTE: causes a potential delay in data retrieval,
      // as waits for onMount of Page & components;
      await onceRealTimeLiveScoreboard()

      let connectionRef = listenRealTimeScoreboardAll();
      FIREBASE_CONNECTIONS_SET.add(connectionRef);

      document.addEventListener
      (
        'visibilitychange',
        async function
        (
        )
        {
          if (!document.hidden) {
            dlog('🔵 user is active', true)
            await onceRealTimeLiveScoreboard()
            let connectionRef = listenRealTimeScoreboardAll()
            FIREBASE_CONNECTIONS_SET.add(connectionRef)
          }
        }
      );

      resizeInit();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<!--
SEO META TAGS
-->
{#if PAGE_DATA_SEO}
	<SvelteSeo
		title={PAGE_DATA_SEO.main_data.title}
		description={PAGE_DATA_SEO.main_data.description}
		keywords={PAGE_DATA_SEO.main_data.keywords}
		noindex={JSON.parse(PAGE_DATA_SEO.main_data.noindex.toString())}
		nofollow={JSON.parse(PAGE_DATA_SEO.main_data.nofollow.toString())}
		canonical={PAGE_DATA_SEO.main_data.canonical}
		twitter={PAGE_DATA_SEO.twitter_card}
		openGraph={PAGE_DATA_SEO.opengraph}
	/>
{/if}

<!--
HREFLANG TAGS
-->
<svelte:head>
  {#each PAGE_DATA_SEO?.hreflang ?? [] as item}
    {#if item.link == null}
      <link
        rel="alternate"
        hreflang={item.hreflang}
        href="https://scores.betarena.com/"
      />
    {:else}
      <link
        rel="alternate"
        hreflang={item.hreflang}
        href="https://scores.betarena.com/{item.link}"
      />
    {/if}
  {/each}
</svelte:head>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<section
  id="home-page"
>

	<!--
  🖥️ LAPTOP 💻 TABLET
  -->
	{#if !tabletExclusive && !mobileExclusive}

		<!--
    1st COLUMN
    -->
		<div>
			<LeagueListWidget />
		</div>

		<!--
    2nd COLUMN
    -->
		<div
      class=
      "
      grid-display-column
      "
    >
      <LivescoresWidget />
			<SeoBlock />
		</div>

		<!--
    3rd COLUMN
    -->
		<div
      class=
      "
      grid-display-column
      "
    >
			<FeatMatchWidget />
			<FeatBetSiteWidget />
			<TopGoalScorersWidget />
			<LeaguesTableWidget />
		</div>

  <!--
  📱 MOBILE
  -->
	{:else}

		<div
      class=
      "
      grid-display-column
      "
    >
      <LivescoresWidget />
			<FeatBetSiteWidget />
			<FeatMatchWidget />
			<TopGoalScorersWidget />

			{#if tabletExclusive && !mobileExclusive}
				<LeaguesTableWidget />
			{/if}

			<SeoBlock />
		</div>

	{/if}

</section>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	section#home-page
  {
		display: grid;
		max-width: 1430px;
		grid-template-columns: 1fr;
		align-items: start;
	}

	div.grid-display-column
  {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	/*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 768px)
  {

		section#home-page
    {
			grid-template-columns: 1fr;
		}

	}

	@media only screen
  and (min-width: 1160px)
  {

		section#home-page
    {
			gap: 20px;
			grid-template-columns:
				minmax(auto, 275px)
        minmax(auto, 502px)
				minmax(auto, 502px)
      ;
		}

	}

  @media screen
  and (min-width: 560px)
  {
    :root
    {
      --homepage-layout-is-mobile: true;
    }
  }

	@media only screen
  and (min-width: 1320px)
  {
		section#home-page
    {
			gap: 20px;
			grid-template-columns:
				minmax(auto, 328px)
        minmax(502px, 502px)
				minmax(auto, 502px)
      ;
		}
	}

</style>
