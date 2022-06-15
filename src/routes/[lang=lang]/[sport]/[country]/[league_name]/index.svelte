<!-- 
=================
    PRE-COMPONENT JS SCRIPT,
    PRE-LOADING CRITICAL COMPONENT DATA,
    #####
    - pre-loading `tournament-page` data;
=================
-->


<script lang="ts" context="module">

  import { removeDiacritics } from '$lib/utils/languages'

	/** 
	 * @type {import('@sveltejs/kit').Load} 
	*/
	export async function load({ 
    url, 
    params, 
    fetch
  }) {

    let { 
      lang,
      sport,
      country,
      league_name
    } = params

    /**
     * [ℹ] Ensure URL Check Existance; 
     * [ℹ] IMPORTANT;
    */

    const response_valid_url = await fetch(`/api/pages_and_seo/cache-seo.json?url=`+url.pathname, {
			method: 'GET'
		}).then((r) => r.json());

    // [ℹ] validate URL existance;
    if (!response_valid_url) {
      // [ℹ] otherwise, ERROR;
      return {
        status: 404,
        error: new Error("Uh-oh! This page does not exist!")
      }
    }

    const urlLang: string = params.lang == undefined ? 'en' : params.lang

    /**
     * [ℹ] Loading of (this) page [tournaments] SEO-READY data; 
    */

    const response_tournaments_seo: Cache_Single_Tournaments_SEO_Translation_Response = await fetch(`/api/pages_and_seo/cache-seo.json?lang=`+urlLang+"&page=tournaments", {
			method: 'GET'
		}).then((r) => r.json());

    const response_tournaments_page_info: Cache_Single_Tournaments_Data_Page_Translation_Response = await fetch(`/api/pages_and_seo/cache-seo.json?url=`+url.pathname+"&page=tournaments", {
			method: 'GET'
		}).then((r) => r.json());

    /**
     * [ℹ] regex-ing SEO content dynamically;
    */

    response_tournaments_seo.main_data = JSON.parse(JSON.stringify(response_tournaments_seo.main_data).replace(/{lang}/g, lang));
    response_tournaments_seo.main_data = JSON.parse(JSON.stringify(response_tournaments_seo.main_data).replace(/{sport}/g, sport));
    response_tournaments_seo.main_data = JSON.parse(JSON.stringify(response_tournaments_seo.main_data).replace(/{country}/g, country));
    response_tournaments_seo.main_data = JSON.parse(JSON.stringify(response_tournaments_seo.main_data).replace(/{name}/g, league_name));

    response_tournaments_seo.twitter_card = JSON.parse(JSON.stringify(response_tournaments_seo.twitter_card).replace(/{lang}/g, lang));
    response_tournaments_seo.twitter_card = JSON.parse(JSON.stringify(response_tournaments_seo.twitter_card).replace(/{sport}/g, sport));
    response_tournaments_seo.twitter_card = JSON.parse(JSON.stringify(response_tournaments_seo.twitter_card).replace(/{country}/g, country));
    response_tournaments_seo.twitter_card = JSON.parse(JSON.stringify(response_tournaments_seo.twitter_card).replace(/{name}/g, league_name));

    response_tournaments_seo.opengraph = JSON.parse(JSON.stringify(response_tournaments_seo.opengraph).replace(/{lang}/g, lang));
    response_tournaments_seo.opengraph = JSON.parse(JSON.stringify(response_tournaments_seo.opengraph).replace(/{sport}/g, sport));
    response_tournaments_seo.opengraph = JSON.parse(JSON.stringify(response_tournaments_seo.opengraph).replace(/{country}/g, country));
    response_tournaments_seo.opengraph = JSON.parse(JSON.stringify(response_tournaments_seo.opengraph).replace(/{name}/g, league_name));

    // [ℹ] canonical exclusive - [EN];
    let enItemAlt = response_tournaments_page_info.alternate_data.find( ({ lang }) => lang === 'en' );
    response_tournaments_seo.main_data.canonical = `https://scores.betarena.com/${enItemAlt.sport.toLowerCase()}/${enItemAlt.country.toLowerCase()}/${enItemAlt.name.replace(/\s/g,'-').toLowerCase()}`

    const response_league_info: Cache_Single_Tournaments_League_Info_Data_Response = await fetch(`/api/tournaments/league_info/cache-data.json?url=`+url.pathname, {
			method: 'GET'
		}).then((r) => r.json());

    /** 
     * =========
     * [ℹ] RETURN
     * ==========
    */

    // [ℹ] page -> response data chceck
		if (response_tournaments_seo &&
        response_tournaments_page_info && 
        response_league_info) {
      return {
        props: {
          PAGE_DATA_SEO: response_tournaments_seo,
          TOURNAMENT_DATA_TRANSLATED_COPIES: response_tournaments_page_info.alternate_data,
          TOURNAMENT_DATA: response_tournaments_page_info.data,
          LEAGUE_INFO_DATA: response_league_info
        }
      } 
    }
  
    // [ℹ] -> otherwise, total ERROR;
    return {
      status: 500,
      error: new Error(`Uh-oh! There has been an /{tournaments} page preloading error`)
    };

  }
</script>


<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->


<script lang="ts">
  import { goto, invalidate, prefetch } from '$app/navigation';
	import { page } from '$app/stores';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';

  import SvelteSeo from 'svelte-seo';

  /*
    [v1] - Testing with Standard Imports (client-side)
  */

  // import LeagueInfoWidget from '$lib/components/tournaments_page/league_info/_LeagueInfo_Widget.svelte';

  /*
    [v2] - Testing with Dynamic Imports (client-side)
  */

  let LeagueInfoWidget;

  onMount(async () => {
		LeagueInfoWidget = (await import('$lib/components/tournaments_page/league_info/_LeagueInfo_Widget.svelte')).default;
	});

  import type { Cache_Single_Tournaments_Data_Page_Translation_Response, 
    Cache_Single_Tournaments_SEO_Translation_Response, 
    Hasura_Complete_Pages_SEO, 
    Single_Tournament_Data_Type } from '$lib/models/pages_and_seo/types';

  import { userBetarenaSettings } from '$lib/store/user-settings';
  import type { Cache_Single_Tournaments_League_Info_Data_Response } from '$lib/models/tournaments/types';

  export let PAGE_DATA_SEO: Cache_Single_Tournaments_SEO_Translation_Response;
  export let TOURNAMENT_DATA_TRANSLATED_COPIES: Single_Tournament_Data_Type[];
  export let TOURNAMENT_DATA: Single_Tournament_Data_Type;
  export let LEAGUE_INFO_DATA: Cache_Single_Tournaments_League_Info_Data_Response;
    
  // TODO: replace into a single __layout.svelte method [?] using page-stores [?]

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
        let name: string = tournament_t.name;
        name = name.replace(/\s+/g, '-');
        
        // [ℹ] URL generation;
        newURL = tournament_t.lang == 'en' 
          ? `/${tournament_t.sport.toLowerCase()}/${tournament_t.country.toLowerCase()}/${name.toLowerCase()}` 
          : `/${removeDiacritics(tournament_t.lang)}/${removeDiacritics(tournament_t.sport.toLowerCase())}/${removeDiacritics(tournament_t.country.toLowerCase())}/${removeDiacritics(name.toLowerCase())}`

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
            href="https://scores.betarena.com/{removeDiacritics(item_.lang.replace(/\s/g, '-').toLowerCase())}/{removeDiacritics(item_.sport.replace(/\s/g, '-').toLowerCase())}/{removeDiacritics(item_.country.replace(/\s/g, '-').toLowerCase())}/{removeDiacritics(item_.name.replace(/\s/g, '-').toLowerCase())}" />
        {/if}
        {#if item.link == null && item_.lang == 'en'}
          <!-- [ℹ] content here
          -->
          <link 
            rel="alternate" 
            hreflang={item.hreflang} 
            href="https://scores.betarena.com/{item_.sport.toLowerCase()}/{item_.country.toLowerCase()}/{item_.name.replace(/\s/g, '-').toLowerCase()}"/>
          <link 
            rel="alternate" 
            hreflang='en' 
            href="https://scores.betarena.com/{item_.sport.toLowerCase()}/{item_.country.toLowerCase()}/{item_.name.replace(/\s/g, '-').toLowerCase()}"/>
        {/if}
      {/each}
    {/each}
  {/if}
</svelte:head>

<!-- [ℹ] SEO-DATA-LOADED 
-->
{#if !browser &&
      PAGE_DATA_SEO && 
      TOURNAMENT_DATA_TRANSLATED_COPIES &&
      TOURNAMENT_DATA && 
      LEAGUE_INFO_DATA}
  
  <div 
    id="seo-widget-container">

    <div 
      id="seo-league-table-site-box">
      <h2>{LEAGUE_INFO_DATA.data.country}</h2>
      <h2>{LEAGUE_INFO_DATA.data.name}</h2>
    </div>

  </div>

{/if}

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
  <!-- <svelte:component this={LeagueInfoWidget} LEAGUE_INFO_SEO_DATA={LEAGUE_INFO_DATA} /> -->

  <!-- [ℹ] widgets displayed -->
  <div>
    {TOURNAMENT_DATA.widgets}
  </div>
      
</section>


<!-- ===================
	COMPONENT STYLE
=================== -->


<style>

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

  div#tournaments-page-breadcrumbs p.capitalize {
    text-transform: capitalize;
  }
  div#tournaments-page-breadcrumbs > p {
    color: #8C8C8C !important;
  }
  div#tournaments-page-breadcrumbs a > p:hover {
    color: #f5620f !important; 
  }
</style>