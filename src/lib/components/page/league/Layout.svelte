<!-- ===================
	COMPONENT JS - BASIC
    [TypeScript Written]
=================== -->

<script lang="ts">

  // #region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { listenRealTimeScoreboardAll, onceRealTimeLiveScoreboard } from '$lib/firebase/common.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug.js';
	import { removeDiacritics } from '$lib/utils/languages';
	import { viewport_change } from '$lib/utils/platform-functions';

	import AboutBlock from '$lib/components/page/league/about_block/_About_Block.svelte';
	import LeagueInfoWidget from '$lib/components/page/league/league-info/LeagueInfo-Widget.svelte';
	import LeagueInfoWidget2 from '$lib/components/page/league/league_info_2/_LeagueInfo_Widget_2.svelte';
	import StandingsWidget from '$lib/components/page/league/standings/_Standings_Widget.svelte';
	import TopPlayersWidget from '$lib/components/page/league/top-players/TopPlayers-Widget.svelte';
	import SvelteSeo from 'svelte-seo';
	import Breadcrumb from './Breadcrumb.svelte';
	import FixtureOddsWidget from './fixture-odds/FixtureOdds-Widget.svelte';

  
  // #endregion ➤ [MAIN] Package Imports

  // #region ➤ [VARIABLES]

	let PAGE_DATA_SEO: Cache_Single_Tournaments_SEO_Translation_Response;
	let TOURNAMENT_DATA_TRANSLATED_COPIES: BETARENA_HASURA_scores_tournaments[];
	let TOURNAMENT_DATA: BETARENA_HASURA_scores_tournaments;
	let LEAGUE_INFO_DATA: Cache_Single_Tournaments_League_Info_Data_Response;
	let STANDINGS_T: REDIS_CACHE_SINGLE_tournament_standings_translation;
	let STANDINGS_DATA: REDIS_CACHE_SINGLE_tournament_standings_data;

	$: PAGE_DATA_SEO = $page.data.PAGE_DATA_SEO;
	$: TOURNAMENT_DATA_TRANSLATED_COPIES = $page.data.TOURNAMENT_DATA_TRANSLATED_COPIES;
	$: TOURNAMENT_DATA = $page.data.TOURNAMENT_DATA;
	$: LEAGUE_INFO_DATA =	$page.data.LEAGUE_INFO_DATA;
	$: STANDINGS_T = $page.data.STANDINGS_T;
	$: STANDINGS_DATA = $page.data.STANDINGS_DATA;

	// TODO: FIXME: replace into a single __layout.svelte method [?] using page-stores [?]

	// [ℹ] listen to change in LANG SELECT of `$userBetarenaSettings.lang`
	let current_lang: string = $sessionStore?.serverLang;
	$: refresh_lang = $userBetarenaSettings.lang;

  // #endregion ➤ [VARIABLES]

  //#region ➤ [REACTIVIY] [METHODS]

	// [ℹ] validate LANG change
	$: if (
		current_lang != refresh_lang &&
		browser
	) {
		let newURL: string;

		// [ℹ] identify new transaltion change;
    newURL = TOURNAMENT_DATA?.urls[refresh_lang]?.replace('https://scores.betarena.com', '')
    current_lang = refresh_lang;

		// [ℹ] navigate [alternatives];
		// invalidate('/api/cache/tournaments/cache-data.json');
		// prefetch(newURL);
		goto(newURL, { replaceState: true });
	}

  // #endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

  onMount
  (
    async() =>
    {

      // NOTE: causes a potential delay in data retrieval,
      // as waits for onMount of Page & components;
      await onceRealTimeLiveScoreboard()

      let connectionRef = listenRealTimeScoreboardAll()
      // FIREBASE_CONNECTIONS_SET.add(connectionRef)

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
            // FIREBASE_CONNECTIONS_SET.add(connectionRef)
          }
        }
      );
    }
  );

</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!--
[ℹ] adding SEO-META-TAGS for (this) PAGE
-->
{#if PAGE_DATA_SEO}
	<SvelteSeo
		title={PAGE_DATA_SEO?.main_data?.title}
		description={PAGE_DATA_SEO?.main_data?.description}
		keywords={PAGE_DATA_SEO?.main_data?.keywords}
		noindex={JSON.parse(PAGE_DATA_SEO?.main_data?.noindex?.toString())}
		nofollow={JSON.parse(PAGE_DATA_SEO?.main_data?.nofollow?.toString())}
		canonical={PAGE_DATA_SEO?.main_data?.canonical}
		twitter={PAGE_DATA_SEO?.twitter_card}
		openGraph={PAGE_DATA_SEO?.opengraph}
	/>
{/if}

<!--
[ℹ] adding HREF-LANG-META-TAGS for (this) PAGE
-->
<svelte:head>
	{#if PAGE_DATA_SEO}
		{#each PAGE_DATA_SEO?.hreflang || [] as item}
			{#each TOURNAMENT_DATA_TRANSLATED_COPIES as item_}
				{#if item.link == item_.lang}
					<!-- [ℹ] content here
            <link rel="alternate" hrefLang="it" href="https://scores.betarena.com/it/calcio/inghilterra/premier-league/>
            <link rel="alternate" hrefLang="es" href="https://scores.betarena.com/es/futbol/inglaterra/premier-league/>
            <link rel="alternate" hrefLang="pt" href="https://scores.betarena.com/pt/futebol/inglaterra/premier-league/>
            <link rel="alternate" hrefLang=""pt-BR" href="https://scores.betarena.com/pt/futebol/inglaterra/premier-league/>
            <link rel="alternate" hrefLang="ro" href="https://scores.betarena.com/ro/fotbal/anglia/premier-league/>
          -->
					<link
						rel="alternate"
						hreflang={item.hreflang}
						href="https://scores.betarena.com/{removeDiacritics(
							item_.lang
								.replace(/\s/g, '-')
								.replace(/\./g, '')
								.toLowerCase()
						)}/{removeDiacritics(
							item_.sport
								.replace(/\s/g, '-')
								.replace(/\./g, '')
								.toLowerCase()
						)}/{removeDiacritics(
							item_.country
								.replace(/\s/g, '-')
								.replace(/\./g, '')
								.toLowerCase()
						)}/{removeDiacritics(
							item_.name
								.replace(/\s/g, '-')
								.replace(/\./g, '')
								.toLowerCase()
						)}"
					/>
				{/if}
				{#if item.link == null && item_.lang == 'en'}
					<!-- [ℹ] content here
          -->
					<!-- <link
						rel="alternate"
						hreflang={item.hreflang}
						href="https://scores.betarena.com/{item_.sport
							.toLowerCase()
							.replace(/\s/g, '-')
							.replace(/\./g, '')}/{item_.country
							.toLowerCase()
							.replace(/\s/g, '-')
							.replace(/\./g, '')}/{item_.name
							.replace(/\s/g, '-')
							.replace(/\./g, '')
							.toLowerCase()}"
					/> -->
					<link
						rel="alternate"
						hreflang="en"
						href="https://scores.betarena.com/{item_.sport
							.toLowerCase()
							.replace(/\s/g, '-')
							.replace(/\./g, '')}/{item_.country
							.toLowerCase()
							.replace(/\s/g, '-')
							.replace(/\./g, '')}/{item_.name
							.replace(/\s/g, '-')
							.replace(/\./g, '')
							.toLowerCase()}"
					/>
				{/if}
			{/each}
		{/each}
	{/if}
</svelte:head>

<!-- ===================
	COMPONENT HTML
  TODO:
    -> missing use of the WIDGET-LIST to HIDE/SHOW widgets
=================== -->

<section
  id="tournaments-page"
>

  <Breadcrumb
    sportT={TOURNAMENT_DATA.sport}
    countryT={TOURNAMENT_DATA.country}
    leagueNameT={TOURNAMENT_DATA.name}
  />

	{#if !tabletExclusive && !mobileExclusive}
		<!-- <LeagueInfoWidget LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA} /> -->
		<svelte:component
			this={LeagueInfoWidget}
		/>

		<div id="widget-grid-display">
			<div class="grid-display-column">
				<svelte:component
					this={StandingsWidget}
					{STANDINGS_T}
					{STANDINGS_DATA}
				/>
				<svelte:component
					this={FixtureOddsWidget}
				/>
				<svelte:component
					this={AboutBlock}
					LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA}
				/>
			</div>

			<div class="grid-display-column">
				<svelte:component
					this={TopPlayersWidget}
				/>
				<svelte:component
					this={LeagueInfoWidget2}
					LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA}
				/>
			</div>
		</div>
	{:else}
		<!-- <LeagueInfoWidget LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA} /> -->
		<svelte:component
			this={LeagueInfoWidget}
		/>

		<div id="widget-grid-display">
			<div class="grid-display-column">
				<svelte:component
					this={StandingsWidget}
					{STANDINGS_T}
					{STANDINGS_DATA}
				/>
				<svelte:component
					this={FixtureOddsWidget}
				/>
				<svelte:component
					this={TopPlayersWidget}
				/>
				<svelte:component
					this={LeagueInfoWidget2}
					LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA}
				/>
				<svelte:component
					this={AboutBlock}
					LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA}
				/>
			</div>
		</div>
	{/if}

</section>

<!-- ===================
	COMPONENT STYLE
=================== -->

<style>

	section#tournaments-page
  {
		/* display: grid; */
		max-width: 1430px;
		grid-template-columns: 1fr;
		padding-top: 12px !important;
		align-items: start;
	}

	div#widget-grid-display
  {
		display: grid;
		margin-top: 24px;
		align-items: start;
	}

	div.grid-display-column
  {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	/*
  RESPONSIVE FOR TABLET (&+) [768px] */
	@media only screen and (min-width: 768px) {
		div#widget-grid-display {
			grid-template-columns: 1fr;
		}
	}

	/*
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1160px) {
		div#widget-grid-display {
			gap: 20px;
			grid-template-columns: minmax(auto, 850px) minmax(
					auto,
					502px
				);
		}
	}

	/*
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1320px) {
		div#widget-grid-display {
			gap: 20px;
			grid-template-columns: minmax(auto, 850px) minmax(
					auto,
					502px
				);
		}
	}
</style>
