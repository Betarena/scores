<!-- 
=================
    PRE-COMPONENT JS SCRIPT,
    PRE-LOADING CRITICAL COMPONENT DATA,
    #####
    - pre-loading `tournament-page` data;
=================
-->
<script lang="ts" context="module">

  import { removeDiacritics } from '$lib/utils/languages';

	/** 
	 * @type {import('@sveltejs/kit').Load} 
	*/
	export async function load({ 
    url, 
    params, 
    fetch
  }) {

    let { 
      sport,
      country,
      league_name
    } = params

    /**
     * ------------------------
     * GET PRE-LOADED-PAGE-DATA:
     * ------------------------
     * ➤ GET tournaments data;
     * ➤ GET seo_page-response-seo-data;
     * ------------------------
    */

		const response_tournaments: Hasura_Complete_Tournaments_Type = await fetch('/api/tournaments/cache-data.json', {
			method: 'GET'
		}).then((r) => r.json());

		const response_seo_page = await fetch('/api/page_seo/cache-seo.json', {
			method: 'GET'
		}).then((r) => r.json());

    /**
     * URL Handling Decode:
     * ------------------------
     * Incoming URL:
     * => .../football/england/carabao-cup
    */

    league_name = league_name.replace(/-/g, ' ');

    // [ℹ] identify correct tournaments page-info;
    let tournament_visible: boolean = false;
    let tournament_data: Single_Tournament_Data_Type = undefined;
    let tournament_data_translations: Single_Tournament_Data_Type[] = [];
    // [ℹ] iterate over each tournament and identify the matching target-tournament;
    for (const tournament of response_tournaments.scores_tournaments_dev) {
      // [ℹ] tournament existance && visibility validation;
      if (tournament.country.toLowerCase() == country.toLowerCase() &&
          tournament.name.toLowerCase() == league_name.toLowerCase() &&
          tournament.sport.toLowerCase() == sport.toLowerCase() &&
          tournament.lang.toLowerCase() == 'en' &&
          tournament.status.toLowerCase() == "published") {
        // [ℹ] correct tournament found;
        tournament_visible = true;
        tournament_data = tournament;
      }
    }

    // [ℹ] check if tournament has been identified;
    if (tournament_data) {
      // [ℹ] iterate over each tournament and identify the matching target-tournament translations;
      for (const tournament of response_tournaments.scores_tournaments_dev) {
      // [ℹ] tournament existance && visibility validation;
      if (tournament.tournament_id == tournament_data.tournament_id &&
          tournament.status.toLowerCase() == "published") {
        // [ℹ] add-tournaments-translations-to-array;
        tournament_data_translations.push(tournament);
        }
      }
    }

    sport = sport.replace(/\s/g, '-')
    country = country.replace(/\s/g, '-')
    league_name = league_name.replace(/\s/g, '-')

    /**
     * [ℹ] regex-ing SEO content;
    */
    for await (const item of response_seo_page.scores_seo_tournaments_dev) {
      // [ℹ] replace;
      item.main_data = JSON.parse(JSON.stringify(item.main_data).replace(/{lang}/g, 'en'));
      item.main_data = JSON.parse(JSON.stringify(item.main_data).replace(/{sport}/g, sport));
      item.main_data = JSON.parse(JSON.stringify(item.main_data).replace(/{country}/g, country));
      item.main_data = JSON.parse(JSON.stringify(item.main_data).replace(/{name}/g, league_name));

      // [ℹ] canonical exclusive - [EN];
      for (const iterator of tournament_data_translations) {
        if (iterator.lang == 'en') {
          item.main_data.canonical = `https://scores.betarena.com/${iterator.sport.toLowerCase()}/${iterator.country.toLowerCase()}/${iterator.name.replace(/\s/g,'-').toLowerCase()}`
        }
      }

      item.twitter_card = JSON.parse(JSON.stringify(item.twitter_card).replace(/{lang}/g, 'en'));
      item.twitter_card = JSON.parse(JSON.stringify(item.twitter_card).replace(/{sport}/g, sport));
      item.twitter_card = JSON.parse(JSON.stringify(item.twitter_card).replace(/{country}/g, country));
      item.twitter_card = JSON.parse(JSON.stringify(item.twitter_card).replace(/{name}/g, league_name));

      item.opengraph = JSON.parse(JSON.stringify(item.opengraph).replace(/{lang}/g, 'en'));
      item.opengraph = JSON.parse(JSON.stringify(item.opengraph).replace(/{sport}/g, sport));
      item.opengraph = JSON.parse(JSON.stringify(item.opengraph).replace(/{country}/g, country));
      item.opengraph = JSON.parse(JSON.stringify(item.opengraph).replace(/{name}/g, league_name));
    }

    /**
     * [ℹ] RETURN
    */

    // [ℹ] -> response data;
		if (response_tournaments &&
        response_seo_page &&
        tournament_visible) {
      return {
        props: {
          TOURNAMENT_DATA_TRANSLATED_COPIES: tournament_data_translations,
          TOURNAMENT_DATA: tournament_data,
          PAGE_DATA_SEO: response_seo_page
        }
      } 
    }
    // [ℹ] -> (TOURNAMENT == OFF) => ERROR
    else if (response_tournaments &&
             response_seo_page &&
             !tournament_visible) {
      return {
        status: 404,
        error: new Error("Uh-oh! This page does not exist")
      }
    }
    // [ℹ] -> otherwise, total ERROR;
    else {
      return {
        status: 500,
        error: new Error(`Uh-oh! There has been an /{tournaments} page preloading error`)
      };
    }

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

  import SvelteSeo from 'svelte-seo';

  import type { Hasura_Complete_Tournaments_Type, Single_Tournament_Data_Type } from '$lib/models/tournaments/types';
  import type { Hasura_Complete_Pages_SEO } from '$lib/models/page_seo/types';

  import { userBetarenaSettings } from '$lib/store/user-settings';

  export let TOURNAMENT_DATA_TRANSLATED_COPIES: Single_Tournament_Data_Type[];
  export let TOURNAMENT_DATA: Single_Tournament_Data_Type;
  export let PAGE_DATA_SEO: Hasura_Complete_Pages_SEO;

  // TODO: replace into a single __layout.svelte method [?] using page-stores [?]
  // [ℹ] page-language-declaration;
	let server_side_language: string = 'en';

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
    // [ℹ] navigate;
    // invalidate('/api/tournaments/cache-data.json');
    // prefetch(newURL);
    goto(newURL, {replaceState: true})
	}
</script>


<!-- ===================
	SVELTE INJECTION TAGS
=================== -->


<!-- [ℹ] adding SEO-META-TAGS for PAGE 
-->
{#each PAGE_DATA_SEO.scores_seo_tournaments_dev as item}
	{#if item.lang == server_side_language}
		<SvelteSeo
			title={item.main_data.title}
			description={item.main_data.description}
			keywords={item.main_data.keywords}
			noindex={JSON.parse(item.main_data.noindex.toString())}
			nofollow={JSON.parse(item.main_data.nofollow.toString())}
			canonical={item.main_data.canonical}
			twitter={item.twitter_card}
			openGraph={item.opengraph}
		/>
	{/if}
{/each}

<!-- [ℹ] adding HREF-LANG-META-TAGS for (this) PAGE 
-->
<svelte:head>
  <!-- [ℹ] head content
  -->
  {#if PAGE_DATA_SEO}
    <!-- [ℹ] content here
    -->
    {#each PAGE_DATA_SEO.scores_hreflang_dev as item}
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
            href="https://scores.betarena.com/{removeDiacritics(item_.lang.replace(/\s/g,'-').toLowerCase())}/{removeDiacritics(item_.sport.replace(/\s/g,'-').toLowerCase())}/{removeDiacritics(item_.country.replace(/\s/g,'-').toLowerCase())}/{removeDiacritics(item_.name.replace(/\s/g,'-').toLowerCase())}" />
        {/if}
        {#if item.link == null && item_.lang == 'en'}
          <!-- [ℹ] content here
          -->
          <link 
            rel="alternate" 
            hreflang={item.hreflang} 
            href="https://scores.betarena.com/{item_.sport.toLowerCase()}/{item_.country.toLowerCase()}/{item_.name.replace(/\s/g,'-').toLowerCase()}"/>
          <link 
            rel="alternate" 
            hreflang='en' 
            href="https://scores.betarena.com/{item_.sport.toLowerCase()}/{item_.country.toLowerCase()}/{item_.name.replace(/\s/g,'-').toLowerCase()}"/>
        {/if}
      {/each}
    {/each}
  {/if}
</svelte:head>


<!-- ===================
	COMPONENT HTML
=================== -->

<section 
  id='tournaments-page'>

  <!-- [ℹ] breadcrumbs URL -->
  <div
    id='tournaments-page-breadcrumbs'
    class='row-space-start'>

    <a 
      sveltekit:prefetch
      href="/{$page.params.sport}">
      <p
        class='s-14 color-white m-r-10 capitalize cursor-pointer'>
        {$page.params.sport}
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
      href="/{$page.params.sport}/{$page.params.country}">
      <p
        class='s-14 color-white m-r-10 capitalize cursor-pointer'>
        {$page.params.country}
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

  <!-- [ℹ] widgets displayed -->
  <div>
    {TOURNAMENT_DATA.widgets}
  </div>
      
</section>


<!-- ===================
	COMPONENT STYLE
=================== -->


<style>
  section#tournaments-page {
		display: grid;
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