<!-- ===================
	COMPONENT JS - BASIC 
=================== -->
<script lang="ts">

	import { page } from "$app/stores";
	import { platfrom_lang_ssr } from "$lib/utils/platform-functions";

	import type { B_SAP_PP_D } from "@betarena/scores-lib/types/seo-pages";

  // IMPORTANT
  // (this) widget has access to the following PAGE data:
  // [...]
  // $page.data.PAGE_DATA: B_SAP_PP_D
  // FIXME: remove cosnt data = [...] and fix the types issue with $page.data[...]

  let data: B_SAP_PP_D = $page.data.PAGE_DATA
  $: data = $page.data.PAGE_DATA

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);
  $: breadcrumb_lang_prefix = 
    server_side_language == 'en'
      ? `/`
      : `/${server_side_language}/`
  ;

</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<!-- 
[ℹ] breadcrumbs component URL
-->
<div
  id="fixture-page-breadcrumbs"
  class="
    row-space-start 
    m-b-20
  "
>
  <!-- 
  [ℹ] sport
  -->
  <a
    href={`${breadcrumb_lang_prefix}${data?.data?.sport_typ}`}
  >
    <p
      class="
        s-14 
        color-white 
        m-r-10 
        capitalize 
        cursor-pointer 
        no-wrap
      "
    >
      {data?.data?.sport_typ}
    </p>
  </a>

  <img
    src="/assets/svg/tournaments/arrow-right.svg"
    alt="Arrow Right Icon"
    class="m-r-10"
    width="14"
    height="14"
  />

  <!-- 
  [ℹ] country 
  -->
  <a
    href={`${breadcrumb_lang_prefix}${data?.data?.country_id}`}
  >
    <p
      class="
        s-14 
        color-white 
        m-r-10 
        capitalize 
        cursor-pointer 
        no-wrap
      "
    >
      {data?.data?.country_id}
    </p>
  </a>

  <img
    src="/assets/svg/tournaments/arrow-right.svg"
    alt="Arrow Right Icon"
    class="m-r-10"
    width="14"
    height="14"
  />

  <!-- 
  [ℹ] league_name 
  -->
  <a
    href={`${breadcrumb_lang_prefix}${data?.data?.league_name}`}
  >
    <p
      class="
        s-14 
        color-white
        m-r-10 
        capitalize 
        cursor-pointer 
        no-wrap
      "
    >
      {data?.data?.league_name}
    </p>
  </a>

  <img
    src="/assets/svg/tournaments/arrow-right.svg"
    alt="Arrow Right Icon"
    class="m-r-10"
    width="14"
    height="14"
  />

  <!-- 
  [ℹ] player_name && team_name 
  -->
  <p
    class="
      s-14 
      color-white 
      m-r-10 
      capitalize 
      fixture-name
    "
  >
    {data?.data?.player_name}
    {data?.data?.team_name}
    videos, transfer history and stats
  </p>
</div>