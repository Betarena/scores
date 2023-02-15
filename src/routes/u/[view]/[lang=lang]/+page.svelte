<!--===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { page } from '$app/stores';
	import AccountSettingsBoard from '$lib/components/page/profile/Widget-AccountSettings.svelte';
	import DashboardWidget from '$lib/components/page/profile/Widget-Dashboard.svelte';
	import UserMenu from '$lib/components/page/profile/Widget-MenuOpt.svelte';
	import type { REDIS_CACHE_SINGLE_profile_translation } from '$lib/models/profile/account-setting/types';
	import { dlogv2, PR_P_STY, PR_P_TAG, PR_P_TOG } from '$lib/utils/debug';
	import type { PageData } from '../$types';

	// ~~~~~~~~~~~~~~~~~~~~~
	// COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	export let data: PageData;

  let RESPONSE_PROFILE_DATA: REDIS_CACHE_SINGLE_profile_translation

  RESPONSE_PROFILE_DATA = $page.data.RESPONSE_PROFILE_DATA;

	dlogv2(
		PR_P_TAG,
		[data],
		PR_P_TOG,
		PR_P_STY
	);

	const VALID_PAGE_URL: string[] = [
		'dashboard',
		'settings'
	];
	// VALID_PAGE_URL.includes($page?.url?.pathname.split('/')[1])

	// ~~~~~~~~~~~~~~~~~~~~~
	// COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	// TODO: have this check on the navbar directly
	// $: if ($userBetarenaSettings?.user == undefined) {
	//   goto('/')
	// }

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~
</script>

<!--===============
SVELTE INJECT TAGS
=================-->

<svelte:head>
  <title>Betarena User Profile</title>
</svelte:head>

<!--===============
COMPONENT HTML
=================-->

<section id="profile-page">
	<div id="widget-grid-display">
		<div id="usermenu-widget">
			<UserMenu />
		</div>
		<!-- 
    [ℹ] account settings widget
    <-conditional->
    -->
		<div id="main-profile-page-widget">
			{#if $page?.url?.pathname.includes('settings')}
				<AccountSettingsBoard
					RESPONSE_PROFILE_DATA={RESPONSE_PROFILE_DATA}
				/>
			{:else if $page?.url?.pathname.includes('dashboard')}
				<DashboardWidget />
			{/if}
		</div>
	</div>
</section>

<!--===============
COMPONENT STYLE
=================-->
<style>

  section#profile-page {
    display: grid;
    max-width: 1430px;
    grid-template-columns: 1fr;
    align-items: start;
  }

	/* page widget layout */
	div#widget-grid-display {
		display: grid;
		margin-top: 24px;
		gap: 20px;
		align-items: start;
	}

	/* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] 
  */
	@media only screen and (min-width: 1160px) {
		/* page widget layout */
		div#widget-grid-display {
			gap: 20px;
			grid-template-columns: minmax(auto, 328px) minmax(
					auto,
					1024px
				);
		}
	}
</style>
