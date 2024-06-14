<!-- ===================
	COMPONENT JS - BASIC
=================== -->

<script lang="ts">

	import { page } from "$app/stores";

	import type { REDIS_CACHE_SINGLE_fixtures_page_info_response } from "$lib/models/_main_/pages_and_seo/types";
    import type {B_NAV_T} from "@betarena/scores-lib/types/navbar";

  export let FIXTURE_INFO: REDIS_CACHE_SINGLE_fixtures_page_info_response;
  export let B_NAV_T_2:B_NAV_T;
  export let country_link: string;
  export let league_name_link: string;

</script>

<!-- ===================
	COMPONENT HTML
=================== -->

<!--
[ℹ] breadcrumbs URL
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

    href={$page.params.lang != undefined
      ? `/${$page.params.lang}/scores`
      : `/scores`}
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
      {$page.data?.B_NAV_T?.scores_header_translations?.sports_v2?.[FIXTURE_INFO?.data?.sport]}
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

    href={$page.params.lang != undefined
      ? `/${$page.params.lang}/${$page.params.sport}/${country_link}`
      : `/${$page.params.sport}/${country_link}`}
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
      {FIXTURE_INFO?.data?.country}
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

    href={$page.params.lang != undefined
      ? `/${$page.params.lang}/${$page.params.sport}/${country_link}/${league_name_link}`
      : `/${$page.params.sport}/${country_link}/${league_name_link}`}
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
      {FIXTURE_INFO?.data?.league_name}
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
  [ℹ] fxiture_name
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
    {FIXTURE_INFO?.data?.home_team_name}
    vs
    {FIXTURE_INFO?.data?.away_team_name}
  </p>
</div>
