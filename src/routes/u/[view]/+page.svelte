<!--===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { page } from '$app/stores';
	import AccountSettingsBoard from '$lib/components/page/profile/Account-Widget.svelte';
	import DashboardWidget from '$lib/components/page/profile/Dashboard-Widget.svelte';
	import UserMenu from '$lib/components/page/profile/Menu-Opt-Widget.svelte';
	import Navbar from '$lib/components/page/profile/Navbar.svelte';
	import { dlogv2 } from '$lib/utils/debug';
	import type { PageData } from './$types';

  // ~~~~~~~~~~~~~~~~~~~~~
  // COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let data: PageData
  dlogv2("Profile Page", [data], true, 'background: black; color: #fffff')

  const VALID_PAGE_URL: string[] = ['dashboard', 'settings']
  // VALID_PAGE_URL.includes($page?.url?.pathname.split('/')[1])

  // ~~~~~~~~~~~~~~~~~~~~~
  // COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function do_something() {}

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

</script>

<!--===============
COMPONENT HTML
=================-->

<Navbar />
<section>
  <div
    id="widget-grid-display">
    <div 
      class='grid-display-column'>
      <UserMenu />
    </div>
    <!-- 
    [ℹ] account settings widget
    <-conditional->
    -->
      <div
        class='grid-display-column'>
        {#if $page?.url?.pathname.includes('settings')}
          <AccountSettingsBoard 
            RESPONSE_PROFILE_DATA={data?.RESPONSE_PROFILE_DATA}
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

  /* page widget layout */
  div#widget-grid-display {
		display: grid;
    margin-top: 24px;
    align-items: start;
  }

  /* widget layout-inner */
  div.grid-display-column {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
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
      grid-template-columns: minmax(auto, 328px) minmax(auto, 1024px);
		}
	}

</style>