<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->

<script lang="ts">
  import { page } from '$app/stores';
	import { browser } from '$app/environment';

  import SvelteSeo from 'svelte-seo';
  import { userBetarenaSettings } from '$lib/store/user-settings';

	import type { 
    REDIS_CACHE_SINGLE_fixtures_page_info_response, 
    REDIS_CACHE_SINGLE_fixtures_seo_response 
  } from '$lib/models/pages_and_seo/types';
	import { goto } from '$app/navigation';

  let PAGE_SEO:                     REDIS_CACHE_SINGLE_fixtures_seo_response
  let FIXTURE_INFO:                 REDIS_CACHE_SINGLE_fixtures_page_info_response

  $: PAGE_SEO                       = $page.data.PAGE_SEO;
  $: FIXTURE_INFO                   = $page.data.FIXTURE_INFO;

  $: country_link =
    FIXTURE_INFO?.data?.country == undefined
      ? undefined
      : FIXTURE_INFO?.data?.country.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')
  ;
  $: league_name_link =
    FIXTURE_INFO?.data?.league_name == undefined
      ? undefined
      : FIXTURE_INFO?.data?.league_name.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')
  ;

  // TODO: FIXME: replace into a single __layout.svelte method [?] using page-stores [?]
  // [ℹ] listen to change in LANG SELECT of `$userBetarenaSettings.lang`
  let current_lang: string = $userBetarenaSettings.lang;
	$: refresh_lang = $userBetarenaSettings.lang;

	// [ℹ] validate LANG change
	$: if (
    current_lang != refresh_lang && 
    browser
  ) {
    current_lang = refresh_lang
    let newURL = FIXTURE_INFO.alternate_data[current_lang]
    newURL = newURL.replace('https://scores.betarena.com', '')

    // [ℹ] navigate [options];
    // invalidate('/api/cache/tournaments/cache-data.json');
    // prefetch(newURL);
    goto(newURL, { replaceState: true })
	}
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- 
[ℹ] adding SEO-META-TAGS for (this) PAGE 
-->
{#if PAGE_SEO}
  <SvelteSeo
    title={PAGE_SEO?.main_data.title}
    description={PAGE_SEO?.main_data.description}
    keywords={PAGE_SEO?.main_data.keywords}
    noindex={JSON.parse(PAGE_SEO?.main_data.noindex.toString())}
    nofollow={JSON.parse(PAGE_SEO?.main_data.nofollow.toString())}
    canonical={PAGE_SEO?.main_data.canonical}
    twitter={PAGE_SEO?.twitter_card}
    openGraph={PAGE_SEO?.opengraph}
  />
{/if}

<!-- 
[ℹ] adding HREF-LANG-META-TAGS for (this) PAGE 
-->
<svelte:head>
  {#if PAGE_SEO}
    {#each PAGE_SEO.hreflang as item}
      {#each Object.entries(FIXTURE_INFO.alternate_data) as [lang, link]}
        {#if item.link == lang}
          <!-- 
            [ℹ] expected alternate example
            <link rel="alternate" hrefLang="en" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="it" href="https://scores.betarena.com/it/calcio/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="es" href="https://scores.betarena.com/es/futbol/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="pt" href="https://scores.betarena.com/pt/futebol/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang=""pt-BR" href="https://scores.betarena.com/br/futebol/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="ro" href="https://scores.betarena.com/ro/fotbal/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="se" href="https://scores.betarena.com/se/fotboll/aston-villa-southampton-50977>
            <link rel="alternate" hrefLang="x-default" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
            <link rel="canonical" href="https://scores.betarena.com/football/aston-villa-southampton-50977>
          -->
          <link 
            rel="alternate" 
            hreflang={item.hreflang} 
            href={link} />
        {/if}
        {#if item.link == null && lang == 'en'}
          <!-- 
            [ℹ] EN here
          -->
          <link 
            rel="alternate" 
            hreflang={item.hreflang} 
            href={link} />
          <link 
            rel="alternate" 
            hreflang='en' 
            href={link} />
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

  <!-- 
  [ℹ] breadcrumbs URL -->
  <div
    id='tournaments-page-breadcrumbs'
    class='row-space-start m-b-20'>

    <!-- 
    [ℹ] sport -->
    <a 
      data-sveltekit-prefetch
      href={
        $page.params.lang != undefined
          ? `/${$page.params.lang}/${$page.params.sport}`
          : `/${$page.params.sport}`
        }
      >
      <p
        class='s-14 color-white m-r-10 capitalize cursor-pointer'>
        {FIXTURE_INFO?.data?.sport}
      </p>
    </a>

    <img 
      src="/assets/svg/tournaments/arrow-right.svg" 
      alt=""
      class="m-r-10"
      width="14px" height="14px"
    />

    <!-- 
    [ℹ] country -->
    <a 
      data-sveltekit-prefetch
      href={
        $page.params.lang != undefined
          ? `/${$page.params.lang}/${$page.params.sport}/${country_link}`
          : `/${$page.params.sport}/${country_link}`
      }
      >
      <p
        class='s-14 color-white m-r-10 capitalize cursor-pointer'>
        {FIXTURE_INFO?.data?.country}
      </p>
    </a>

    <img
      src="/assets/svg/tournaments/arrow-right.svg" 
      alt="" 
      class="m-r-10"
      width="14px" height="14px"
    />

    <!-- 
    [ℹ] league_name -->
    <a 
      data-sveltekit-prefetch
      href={
        $page.params.lang != undefined
          ? `/${$page.params.lang}/${$page.params.sport}/${country_link}/${league_name_link}`
          : `/${$page.params.sport}/${country_link}/${league_name_link}`
      }
      >
      <p
        class='s-14 color-white m-r-10 capitalize cursor-pointer'>
        {FIXTURE_INFO?.data?.league_name}
      </p>
    </a>

    <img
      src="/assets/svg/tournaments/arrow-right.svg" 
      alt="" 
      class="m-r-10"
      width="14px" height="14px"
    />

    <!-- 
    [ℹ] fxiture_name -->
    <p
      class='s-14 color-white m-r-10 capitalize'>
      {FIXTURE_INFO?.data?.home_team_name}
      vs
      {FIXTURE_INFO?.data?.away_team_name}
    </p>

  </div>

</section>


<!-- ===================
	COMPONENT STYLE
=================== -->


<style>

  section#tournaments-page {
		/* display: grid; */
		max-width: 1430px;
		grid-template-columns: 1fr;
    padding-top: 12px !important;
		align-items: start;
	}

  div#tournaments-page-breadcrumbs p.capitalize {
    text-transform: capitalize;
  } div#tournaments-page-breadcrumbs > p {
    color: #8C8C8C !important;
  } div#tournaments-page-breadcrumbs a > p:hover {
    color: #f5620f !important; 
  }

</style>