<!-- ===================
	COMPONENT JS - BASIC
=================== -->

<script lang="ts">

	import { page } from "$app/stores";

  export let sportT: string;
  export let countryT: string;
  export let leagueNameT: string;

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
BREADCRUMBS
-->
<div
  id="tournaments-page-breadcrumbs"
  class=
  "
    row-space-start
    m-b-20
  "
>

  <a
    href=
    {
      $page.params.lang != undefined
        ? `/${$page.params.lang}/${$page.params.sport}`
        : `/${$page.params.sport}`
    }
  >
    <p
      class=
      "
        s-14
        color-white
        m-r-10
        capitalize
        cursor-pointer
      "
    >
      {sportT}
    </p>
  </a>

  <img
    src="/assets/svg/tournaments/arrow-right.svg"
    alt="default alt text"
    class="m-r-10"
    width="14px"
    height="14px"
  />

  <a
    href=
    {
      $page.params.lang != undefined
        ? `/${$page.params.lang}/${$page.params.sport}/${$page.params.country}`
        : `/${$page.params.sport}/${$page.params.country}`
    }
  >
    <p
      class=
      "
        s-14
        color-white
        m-r-10
        capitalize
        cursor-pointer
      "
    >
      {countryT}
    </p>
  </a>

  <img
    src="/assets/svg/tournaments/arrow-right.svg"
    alt="default alt text"
    class="m-r-10"
    width="14px"
    height="14px"
  />

  <p
    class=
    "
      s-14
      color-white
      m-r-10
      capitalize
    "
  >
    {leagueNameT}
  </p>

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#tournaments-page-breadcrumbs > p
  {
    color: #8c8c8c !important;
  }
  div#tournaments-page-breadcrumbs a > p:hover
  {
    color: #f5620f !important;
  }

</style>