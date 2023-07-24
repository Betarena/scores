<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

	import { page } from "$app/stores";
	import sessionStore from "$lib/store/session.js";

	import type {
		B_SAP_D1,
		B_SAP_PP_D,
		B_SAP_PP_T
	} from "@betarena/scores-lib/types/seo-pages";

	import BreadcrumbSingle from "./Breadcrumb-Single.svelte";

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // IMPORTANT
  // (this) widget has access to the following PAGE data:
  // [...]
  // $page.data.PAGE_DATA: B_SAP_PP_D
  // $page.data.B_SAP_D1: B_SAP_D1
  // $page.data.PAGE_SEO: B_SAP_PP_T
  // FIXME: remove cosnt data = [...] and fix the types issue with $page.data[...]

  let data: B_SAP_PP_D = $page.data.PAGE_DATA
  let data_0: B_SAP_D1 = $page.data.B_SAP_D1
  let data_1: B_SAP_PP_T = $page.data.PAGE_SEO
  let league_url_split: [
    /** sport target link */
    string,
    /** country target link */
    string,
    /** league target link */
    string
  ]

  $: data = $page.data.PAGE_DATA
  $: data_0 = $page.data.B_SAP_D1
  $: data_1 = $page.data.PAGE_SEO

  $: breadcrumb_lang_prefix =
    $sessionStore?.serverLang == 'en'
      ? `/`
      : `/${$sessionStore?.serverLang}/`
  ;

  $: country = data_0?.translations[$sessionStore?.serverLang];

  // @ts-expect-error - it does return a 3 string array;
  $: league_url_split = data?.alternate_data_2?.[$sessionStore?.serverLang]
    ?.split
    (
      '/'
    )
    ?.filter
    (
      a =>
        // remove {lang} string from URL;
        a.length != 2
    )
  ;

  $: player_breadcrumb = data_1?.main_data?.title
    .replace(/{name}/g, data?.data?.player_name)
    .replace(/{team}/g, data?.data?.team_name)
  ;

  //#endregion ➤ [VARIABLES]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
[ℹ] breadcrumbs component URL
-->
<div
  id="fpp-breadcrumb"
  class="
    row-space-start
    m-b-20
  "
>
  <!--
  [ℹ] sport
  -->
  <!-- TODO: correct transaltion -->
  <BreadcrumbSingle
    href={`${breadcrumb_lang_prefix}${league_url_split[0]}`}
    name={data_1?.football}
  />
  <!--
  [ℹ] country
  -->
  <BreadcrumbSingle
    href={`${breadcrumb_lang_prefix}${league_url_split[0]}/${league_url_split[1]}`}
    name={country}
  />
  <!--
  [ℹ] league_name
  -->
  <BreadcrumbSingle
    href={`${breadcrumb_lang_prefix}${league_url_split[0]}/${league_url_split[1]}/${league_url_split[2]}`}
    name={data?.data?.league_name}
  />
  <!--
  [ℹ] player_name && team_name
  -->
  <BreadcrumbSingle
    name={`${player_breadcrumb}`}
    end={true}
    disable={true}
  />
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  #fpp-breadcrumb {
    overflow: hidden;
  }

</style>