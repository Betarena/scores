<!--===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import AccountSettingsBoard from '$lib/components/page/profile/Widget-AccountSettings.svelte';
	import DashboardWidget from '$lib/components/page/profile/Widget-Dashboard.svelte';
	import UserMenu from '$lib/components/page/profile/Widget-MenuOpt.svelte';
	import WidgetDeposit from '$lib/components/page/profile/deposit/Widget-Deposit.svelte';
	import WidgetTxHist from '$lib/components/page/profile/tx-history/Widget-Tx-Hist.svelte';

  import type { PageData } from '../$types';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

	export let data: PageData;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // TODO: have this check on the navbar directly
  $: if (browser && $userBetarenaSettings != undefined && $userBetarenaSettings?.user == undefined)
  {
    goto
    (
      '/',
      { replaceState: true }
    )
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!--===============
SVELTE INJECT TAGS
=================-->

<svelte:head>
  <title>Betarena User Profile</title>
</svelte:head>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<section
  id="profile-page"
>

  <!--
  MAIN USER / PROFILE CONTAIER
  -->
	<div
    id="widget-grid-display"
  >

    <!--
    USER / PROFILE MENU
    -->
		<div
      id="usermenu-widget"
    >
			<UserMenu />
		</div>

    <!--
    PROFILE UI/UX SWITCHER
    -->
		<div
      id="main-profile-page-widget"
    >
			{#if $page?.url?.pathname.includes('settings')}
				<AccountSettingsBoard	/>
			{:else if $page?.url?.pathname.includes('dashboard')}
				<DashboardWidget />
      {:else if $page?.url?.pathname.includes('deposit')}
        <WidgetDeposit />
      {:else if $page?.url?.pathname.includes('transaction-history')}
        <WidgetTxHist />
			{/if}
		</div>

	</div>

</section>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  section#profile-page
  {
    display: grid;
    max-width: 1430px;
    grid-template-columns: 1fr;
    padding-top: 0 !important;
    padding-bottom: 72px !important;
    align-items: start;
  }

	/*
  page widget layout
  */
	div#widget-grid-display
  {
		display: grid;
		gap: 20px;
		align-items: start;
	}

	/*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 768px)
  {

    section#profile-page
    {
      padding-top: unset !important;
    }
		/* page widget layout */
		div#widget-grid-display
    {
		  margin-top: 24px;
		}

	}

	@media only screen
  and (min-width: 1160px)
  {

		/* page widget layout */
		div#widget-grid-display
    {
			gap: 20px;
			grid-template-columns: minmax(auto, 328px) minmax(auto,	1024px);
		}

	}

  /*
  =============
  DARK-THEME
  =============
  */

</style>