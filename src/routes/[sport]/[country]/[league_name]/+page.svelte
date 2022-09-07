<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->


<script lang="ts">

  import { goto, invalidate, prefetch } from '$app/navigation';
	import { page } from '$app/stores';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  import { userBetarenaSettings } from '$lib/store/user-settings';
  import SvelteSeo from 'svelte-seo';
  import { removeDiacritics } from '$lib/utils/languages';

	export let data: PageData;

  /*
    [v1]
    Standard Imports (client-side)
  */

  import LeagueInfoWidget from '$lib/components/tournaments_page/league_info/_LeagueInfo_Widget.svelte';
  import StandingsWidget from '$lib/components/tournaments_page/standings/_Standings_Widget.svelte';
  import TopPlayersWidget from '$lib/components/tournaments_page/top_players/_Top_Players_Widget.svelte';
  import FixtureOddsWidget from '$lib/components/tournaments_page/fixtures_odds/_Fixture_Odds_Widget.svelte';

  /*
    [v2]
    Dynamic Imports (client-side)
  */

  /*

    let LeagueInfoWidget;

    onMount(async () => {
      LeagueInfoWidget = (await import('$lib/components/tournaments_page/league_info/_LeagueInfo_Widget.svelte')).default;
    });

  */
 
  import type { 
    Cache_Single_Tournaments_Data_Page_Translation_Response, 
    Cache_Single_Tournaments_SEO_Translation_Response, 
    Hasura_Complete_Pages_SEO, 
    Single_Tournament_Data_Type 
  } from '$lib/models/pages_and_seo/types';

  import type { 
    Cache_Single_Tournaments_League_Info_Data_Response
  } from '$lib/models/tournaments/league-info/types';

  import type { 
    Cache_Single_Tournaments_League_Standings_Info_Data_Response, 
    Cache_Single_Tournaments_League_Standings_Translation_Data_Response 
  } from '$lib/models/tournaments/standings/types';

  import type { 
    REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response, 
    REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response 
  } from '$lib/models/tournaments/top_players/types';

  import type { 
    REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response, 
    REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response 
  } from '$lib/models/tournaments/fixtures_odds/types';

  let PAGE_DATA_SEO:                     Cache_Single_Tournaments_SEO_Translation_Response                         = data.PAGE_DATA_SEO;
  let TOURNAMENT_DATA_TRANSLATED_COPIES: Single_Tournament_Data_Type[]                                             = data.TOURNAMENT_DATA_TRANSLATED_COPIES;
  let TOURNAMENT_DATA:                   Single_Tournament_Data_Type                                               = data.TOURNAMENT_DATA;
  let LEAGUE_INFO_DATA:                  Cache_Single_Tournaments_League_Info_Data_Response                        = data.LEAGUE_INFO_DATA;
  let STANDINGS_T:                       Cache_Single_Tournaments_League_Standings_Translation_Data_Response       = data.STANDINGS_T;
  let STANDINGS_DATA:                    Cache_Single_Tournaments_League_Standings_Info_Data_Response              = data.STANDINGS_DATA;
  let TOP_PLAYERS_T:                     REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response          = data.TOP_PLAYERS_T;
  let TOP_PLAYERS_DATA:                  REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response            = data.TOP_PLAYERS_DATA;
  let FIXTURES_ODDS_T:                   REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response       = data.FIXTURES_ODDS_T;
  let FIXTURES_ODDS_DATA:                REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response         = data.FIXTURES_ODDS_DATA;

  // TODO: FIXME: replace into a single __layout.svelte method [?] using page-stores [?]

  // [ℹ] listen to change in LANG SELECT of `$userBetarenaSettings.lang`
  let current_lang: string = $userBetarenaSettings.lang;
	$: refresh_lang = $userBetarenaSettings.lang;

	// [ℹ] validate LANG change
	$: if (current_lang != refresh_lang && 
         browser) {

    let newURL: string

    // [ℹ] identify new transaltion change;
    for (const tournament_t of TOURNAMENT_DATA_TRANSLATED_COPIES) {
      if (tournament_t.lang == $userBetarenaSettings.lang) {

        // [ℹ] formatting;
        let lang: string = removeDiacritics(tournament_t.lang.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''));
        let sport: string = removeDiacritics(tournament_t.sport.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''));
        let country: string = removeDiacritics(tournament_t.country.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''));
        let name: string = removeDiacritics(tournament_t.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''));
        
        // [ℹ] URL generation;
        newURL = tournament_t.lang == 'en' 
          ? `/${sport}/${country}/${name}`
          : `/${lang}/${sport}/${country}/${name}`

        // [ℹ] update lang;
        current_lang = refresh_lang
      }
    }

    // [ℹ] navigate [options];
    // invalidate('/api/tournaments/cache-data.json');
    // prefetch(newURL);
    goto(newURL, { replaceState: true })
	}

</script>


<!-- ===================
	SVELTE INJECTION TAGS
=================== -->


<!-- [ℹ] adding SEO-META-TAGS for (this) PAGE 
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

<!-- [ℹ] adding HREF-LANG-META-TAGS for (this) PAGE 
-->
<svelte:head>
  <!-- [ℹ] head content
  -->
  {#if PAGE_DATA_SEO}
    <!-- [ℹ] content here
    -->
    {#each PAGE_DATA_SEO.hreflang as item}
      <!-- [ℹ] content here
      -->
      {#each TOURNAMENT_DATA_TRANSLATED_COPIES as item_}
        <!-- [ℹ] content here 
        -->
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
            href="https://scores.betarena.com/{removeDiacritics(item_.lang.replace(/\s/g, '-').replace(/\./g, '').toLowerCase())}/{removeDiacritics(item_.sport.replace(/\s/g, '-').replace(/\./g, '').toLowerCase())}/{removeDiacritics(item_.country.replace(/\s/g, '-').replace(/\./g, '').toLowerCase())}/{removeDiacritics(item_.name.replace(/\s/g, '-').replace(/\./g, '').toLowerCase())}" />
        {/if}
        {#if item.link == null && item_.lang == 'en'}
          <!-- [ℹ] content here
          -->
          <link 
            rel="alternate" 
            hreflang={item.hreflang} 
            href="https://scores.betarena.com/{item_.sport.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')}/{item_.country.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')}/{item_.name.replace(/\s/g, '-').replace(/\./g, '').toLowerCase()}"/>
          <link 
            rel="alternate" 
            hreflang='en' 
            href="https://scores.betarena.com/{item_.sport.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')}/{item_.country.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')}/{item_.name.replace(/\s/g, '-').replace(/\./g, '').toLowerCase()}"/>
        {/if}
      {/each}
    {/each}
  {/if}
</svelte:head>

<!-- [ℹ] SEO-DATA-LOADED [ALTERNATIVE]
{#if !browser}
  
  <div 
    id="seo-widget-container">

    <div 
      id="seo-league-table-site-box">
      <h2>{LEAGUE_INFO_DATA.data.country}</h2>
      <h2>{LEAGUE_INFO_DATA.data.name}</h2>
    </div>

  </div>

{/if}
-->

<!-- ===================
	COMPONENT HTML
=================== -->


<section 
  id='tournaments-page'>

  <!-- [ℹ] breadcrumbs URL -->
  <div
    id='tournaments-page-breadcrumbs'
    class='row-space-start m-b-20'>

    <a 
      sveltekit:prefetch
      href="/{$page.params.lang}/{$page.params.sport}">
      <p
        class='s-14 color-white m-r-10 capitalize cursor-pointer'>
        {TOURNAMENT_DATA.sport}
      </p>
    </a>

    <img 
      src="/assets/svg/tournaments/arrow-right.svg" 
      alt=""
      class="m-r-10"
      width="14px" height="14px"
    />

    <a 
      sveltekit:prefetch
      href="/{$page.params.lang}/{$page.params.sport}/{$page.params.country}">
      <p
        class='s-14 color-white m-r-10 capitalize cursor-pointer'>
        {TOURNAMENT_DATA.country}
      </p>
    </a>

    <img
      src="/assets/svg/tournaments/arrow-right.svg" 
      alt="" 
      class="m-r-10"
      width="14px" height="14px"
    />

    <p
      class='s-14 color-white m-r-10 capitalize'>
      {TOURNAMENT_DATA.name}
    </p>

  </div>

  <!-- <LeagueInfoWidget LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA} /> -->
  <svelte:component this={LeagueInfoWidget} LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA} />

  <div
    id="widget-grid-display">

    <div 
      class='grid-display-column'>
      <svelte:component this={StandingsWidget} {STANDINGS_T} {STANDINGS_DATA} />
      <svelte:component this={FixtureOddsWidget} {FIXTURES_ODDS_T} {FIXTURES_ODDS_DATA} />
    </div>

    <div 
      class='grid-display-column'>
      <svelte:component this={TopPlayersWidget} {TOP_PLAYERS_T} {TOP_PLAYERS_DATA} />
    </div>

  </div>


  <!-- [ℹ] widgets displayed -->
  <!-- <div> -->
    <!-- {TOURNAMENT_DATA.widgets} -->
  <!-- </div> -->
      
</section>


<!-- ===================
	COMPONENT STYLE
=================== -->


<style>

  /* SEO ALT. WIDGET PAGE */
  #seo-widget-container {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  section#tournaments-page {
		/* display: grid; */
		max-width: 1430px;
		grid-template-columns: 1fr;
    padding-top: 12px !important;
		align-items: start;
	}

  div#widget-grid-display {
		display: grid;
    margin-top: 24px;
  }

  div.grid-display-column {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

  div#tournaments-page-breadcrumbs p.capitalize {
    text-transform: capitalize;
  } div#tournaments-page-breadcrumbs > p {
    color: #8C8C8C !important;
  } div#tournaments-page-breadcrumbs a > p:hover {
    color: #f5620f !important; 
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
      grid-template-columns: minmax(auto, 850px) minmax(auto, 502px);
		}
	}

  /* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1320px) {
		div#widget-grid-display {
			gap: 20px;
      grid-template-columns: minmax(auto, 850px) minmax(auto, 502px);
		}
	}
</style>