<!-- ===================
	COMPONENT JS - BASIC
=================== -->
<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { get } from '$lib/api/utils';
	import { listenRealTimeScoreboardAll, onceRealTimeLiveScoreboard } from '$lib/firebase/common';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions';

  import SvelteSeo from 'svelte-seo';

  import type { Cache_Single_Homepage_SEO_Translation_Response } from '$lib/models/_main_/pages_and_seo/types';
  import type { REDIS_CACHE_SINGLE_league_list_seo_t_response } from '$lib/models/home/league_list/types';
  import type { Cache_Single_Lang_Leagues_Table_Translation_Response } from '$lib/models/home/leagues_table/types';
  import type { Cache_Single_Homepage_SEO_Block_Translation_Response } from '$lib/models/home/seo_block/types';
  import type { B_SPT_D } from '@betarena/scores-lib/types/sportbook.js';
  import type { Unsubscribe } from 'firebase/database';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	let PAGE_DATA_SEO: Cache_Single_Homepage_SEO_Translation_Response;
	let LEAGUE_LIST_WIDGET_DATA_SEO: REDIS_CACHE_SINGLE_league_list_seo_t_response;
	let LEAGUES_TABLE_SCORES_SEO_DATA: Cache_Single_Lang_Leagues_Table_Translation_Response;
	let SEO_BLOCK_DATA: Cache_Single_Homepage_SEO_Block_Translation_Response;

  let FIREBASE_CONNECTIONS_SET: Set<Unsubscribe> = new Set()

  let
    FeatBetSiteWidget: any,
    FeatMatchWidget: any,
    LeagueListWidget: any,
    LeaguesTableWidget: any,
    LivescoresWidget: any,
    SeoBlock: any,
    TopGoalScorersWidget: any
  ;

	$: PAGE_DATA_SEO = $page.data?.PAGE_DATA_SEO;
	$: LEAGUE_LIST_WIDGET_DATA_SEO = $page.data?.LEAGUE_LIST_WIDGET_DATA_SEO;
	$: LEAGUES_TABLE_SCORES_SEO_DATA = $page.data?.LEAGUES_TABLE_SCORES_SEO_DATA;
	$: SEO_BLOCK_DATA = $page.data?.SEO_BLOCK_DATA;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  /**
   * @description obtains the target sportbook data
   * information based on users geo-location;
   * data gathered at page-level and set to svelte-stores
   * to be used by (this) page components;
   * NOTE: (*) best approach
   * TODO: can be moved to a layout-level [?]
   * TODO: can be moved to a header-level [?]
   * TODO: can be moved to a +server-level [⚠️]
   * @returns {Promise<void>} void
   */
  async function sportbookIdentify
  (
  ): Promise < void >
  {
    if (!$userBetarenaSettings.country_bookmaker) return;
    const userGeo = $userBetarenaSettings?.country_bookmaker.toLowerCase()
    $sessionStore.sportbook_main = await get(`/api/data/main/sportbook?geoPos=${userGeo}`) as B_SPT_D;
    $sessionStore.sportbook_list = await get(`/api/data/main/sportbook?all=true&geoPos=${userGeo}`) as B_SPT_D[];
    $sessionStore.sportbook_list = $sessionStore.sportbook_list
    .sort
    (
			(
        a,
        b
      ) =>
      parseInt(a.position) - parseInt(b.position)
		);
  }

  //#endregion ➤ [MAIN-METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  if (browser) {
    onceRealTimeLiveScoreboard()
  }

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  $: if ($userBetarenaSettings.country_bookmaker) {
    sportbookIdentify()
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  onMount
  (
    async() =>
    {

      // NOTE: causes a potential delay in data retrieval,
      // as waits for onMount of Page & components;
      await onceRealTimeLiveScoreboard()

      let connectionRef = listenRealTimeScoreboardAll()
      FIREBASE_CONNECTIONS_SET.add(connectionRef)
      sportbookIdentify()

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
    }
  );

  // CRITICAL
	// onDestroy
  // (
  //   async () =>
  //   {
  //     const logsMsg: string[] = []
  //     for (const connection of [...FIREBASE_CONNECTIONS_SET])
  //     {
  //       logsMsg.push('🔥 closing connection')
  //       connection();
  //     }
  //     dlogv2
  //     (
  //       `closing firebase connections`,
  //       logsMsg,
  //       true,
  //       'background: red; color: black;'
  //     )
  //   }
  // );

  onMount
  (
    async () =>
    {
      FeatBetSiteWidget = (await import('$lib/components/page/home/feat-bet-site/FeatBetSite-Widget.svelte')).default;
      FeatMatchWidget = (await import('$lib/components/page/home/feat-match/FeatMatch-Widget.svelte')).default;
      LeagueListWidget = (await import('$lib/components/page/home/league_list/_LeagueList_Widget.svelte')).default;
      LeaguesTableWidget = (await import('$lib/components/page/home/leagues_table/_Leagues_Table_Widget.svelte')).default;
      LivescoresWidget = (await import('$lib/components/page/home/livescores-v2/Livescores_Widget.svelte')).default;
      SeoBlock = (await import('$lib/components/page/home/seo_block_homepage/_SEO_Block.svelte')).default;
      TopGoalScorersWidget = (await import('./top-goalscorers/TopGoalScorers-Widget.svelte')).default;
    }
  );

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const MOBILE_VIEW = 475;
	const TABLET_VIEW = 1160;
	let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount
  (
    async () =>
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
  );

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!--
[ℹ] adding SEO-META-TAGS for (this) PAGE
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
[ℹ] adding HREFLANG-TAGS for (this) PAGE
-->
<svelte:head>
	{#if PAGE_DATA_SEO}
		{#each PAGE_DATA_SEO?.hreflang || [] as item}
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
	{/if}
</svelte:head>

<!-- ===================
	COMPONENT HTML
=================== -->

<section
  id="home-page"
>
	<!--
  🖥️ LAPTOP 💻 TABLET
  -->
	{#if !tabletExclusive && !mobileExclusive}
		<!--
    [ℹ] 1st COLUMN
    -->
		<div>
      <svelte:component this={LeagueListWidget} {LEAGUE_LIST_WIDGET_DATA_SEO}></svelte:component>
			<!-- <LeagueListWidget
				{LEAGUE_LIST_WIDGET_DATA_SEO}
			/> -->
		</div>
		<!--
    [ℹ] 2nd COLUMN
    -->
		<div class="grid-display-column">
      <svelte:component this={LivescoresWidget}></svelte:component>
      <svelte:component this={SeoBlock} {SEO_BLOCK_DATA}></svelte:component>
      <!-- <LivescoresWidget /> -->
			<!-- <SeoBlock {SEO_BLOCK_DATA} /> -->
		</div>
		<!--
    [ℹ] 3rd COLUMN
    -->
		<div class="grid-display-column">
      <svelte:component this={FeatMatchWidget}></svelte:component>
      <svelte:component this={FeatBetSiteWidget}></svelte:component>
      <svelte:component this={TopGoalScorersWidget}></svelte:component>
      <svelte:component this={LeaguesTableWidget} {LEAGUES_TABLE_SCORES_SEO_DATA}></svelte:component>
      <svelte:component this={FeatMatchWidget}></svelte:component>
			<!-- <FeatMatchWidget /> -->
			<!-- <FeatBetSiteWidget />
			<TopGoalScorersWidget />
			<LeaguesTableWidget
				{LEAGUES_TABLE_SCORES_SEO_DATA}
			/> -->
		</div>
  <!--
  📱 MOBILE
  -->
	{:else}
		<div
      class="grid-display-column"
    >
      <svelte:component this={LivescoresWidget}></svelte:component>
      <svelte:component this={FeatBetSiteWidget}></svelte:component>
      <svelte:component this={FeatMatchWidget}></svelte:component>
      <svelte:component this={TopGoalScorersWidget}></svelte:component>
      <svelte:component this={FeatMatchWidget}></svelte:component>

      <!-- <LivescoresWidget />
			<FeatBetSiteWidget />
			<FeatMatchWidget />
			<TopGoalScorersWidget /> -->
			{#if tabletExclusive && !mobileExclusive}
        <svelte:component this={LeaguesTableWidget} {LEAGUES_TABLE_SCORES_SEO_DATA}></svelte:component>
				<!-- <LeaguesTableWidget
					{LEAGUES_TABLE_SCORES_SEO_DATA}
				/> -->
			{/if}
      <svelte:component this={SeoBlock} {SEO_BLOCK_DATA}></svelte:component>
      <SeoBlock {SEO_BLOCK_DATA} />
		</div>
	{/if}
</section>

<!-- ===================
	COMPONENT STYLE
=================== -->

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

	/* ====================
    RESPONSIVNESS
  ==================== */

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
				minmax(auto, 275px) minmax(auto, 502px)
				minmax(auto, 502px);
		}
	}

	@media only screen
    and (min-width: 1320px)
  {
		section#home-page
    {
			gap: 20px;
			grid-template-columns:
				minmax(auto, 328px) minmax(502px, 502px)
				minmax(auto, 502px);
		}
	}
</style>
