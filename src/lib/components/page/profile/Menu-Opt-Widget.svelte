<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userBetarenaSettings } from '$lib/store/user-settings';

  
	import profile_avatar from './assets/profile-avatar.svg';
	import MenuOptRow from './Menu-Opt-Row.svelte';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  type PROFILE_OPT = 'Dashboard' | 'Account Settings' | 'Scores' | 'Author'

  const PROFILE_MENU_OPT: PROFILE_OPT[] = ['Dashboard', 'Account Settings', 'Scores', 'Author']
  
  let selectedMenuOpt: PROFILE_OPT = 'Dashboard'

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function update_selected_opt(event) {
    selectedMenuOpt = event?.detail?.opt
    if (selectedMenuOpt == 'Dashboard') goto('/u/dashboard', { replaceState: true })
    if (selectedMenuOpt == 'Account Settings') goto('/u/settings', { replaceState: true })
  }

  $: {
    if ($page?.url?.pathname == '/u/dashboard') selectedMenuOpt = 'Dashboard'
    if ($page?.url?.pathname == '/u/settings') selectedMenuOpt = 'Account Settings'
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

</script>

<!-- ===============
COMPONENT HTML 
=================-->

<div
  id="profile-menu-widget-container">
  <!-- 
  <-contents->
  [ℹ] profile picture
  [ℹ] username
  -->
  <div
    id="profile-main-row"
    class="
      m-b-20
      row-space-start
    ">
    <!-- 
    [ℹ] profile picture
    -->
    <img
      src={$userBetarenaSettings?.user?.scores_user_data?.profile_photo || profile_avatar}
      alt='Profile Icon'
      title='Profile Icon'
      aria-label='Profile Icon'
      class="m-r-16"
      width="64"
      height="64"
    />
    <!-- 
    [ℹ] username
    -->
    <p
      class="
        s-20
        w-500
        color-black-2
      ">
      {$userBetarenaSettings?.user?.scores_user_data?.username}
    </p>
  </div>
  <!-- 
  <-contents->
  [ℹ] profile menu options
  -->
  <div>
    {#each PROFILE_MENU_OPT as item}
      <MenuOptRow 
        MENU_OPT={item}
        SELECTED_OPT={selectedMenuOpt}
        on:select_opt_trigger={(e) => update_selected_opt(e)}
      />
    {/each}
  </div>
</div>

<!-- ===============
COMPONENT STYLE
=================-->

<style>

  div#profile-main-row {
    padding: 20px 20px 0 20px;
  }

  /* profile widget */
  div#profile-menu-widget-container {
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
  }

</style>