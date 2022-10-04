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

  // TODO: FIXME: replace into a single __layout.svelte method [?] using page-stores [?]

  // [ℹ] listen to change in LANG SELECT of `$userBetarenaSettings.lang`
  let current_lang: string = $userBetarenaSettings.lang;
	$: refresh_lang = $userBetarenaSettings.lang;

	// [ℹ] validate LANG change
	$: if (
    current_lang != refresh_lang && 
    browser
  ) {
    // [ℹ] update lang;
    current_lang = refresh_lang
    console.log("current_lang", current_lang)
    let newURL = FIXTURE_INFO.alternate_data[current_lang]
    console.log("newURL", newURL)
    newURL = newURL.replace('https://scores.betarena.com', '')
    console.log("newURL", newURL)

    // [ℹ] navigate [options];
    // invalidate('/api/cache/tournaments/cache-data.json');
    // prefetch(newURL);
    goto(newURL, { replaceState: true })
	}
</script>

<!-- ===================
	SVELTE INJECTION TAGS
=================== -->

<!-- [ℹ] adding SEO-META-TAGS for (this) PAGE 
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

    <a 
      data-sveltekit-prefetch
      href={
        $page.params.lang != undefined
          ? `/${$page.params.lang}/${$page.params.sport}/${$page.params.country}`
          : `/${$page.params.sport}/${$page.params.country}`
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

    <p
      class='s-14 color-white m-r-10 capitalize'>
      {FIXTURE_INFO?.data?.league_name}
    </p>

  </div>

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

  div#tournaments-page-breadcrumbs p.capitalize {
    text-transform: capitalize;
  } div#tournaments-page-breadcrumbs > p {
    color: #8C8C8C !important;
  } div#tournaments-page-breadcrumbs a > p:hover {
    color: #f5620f !important; 
  }

</style>