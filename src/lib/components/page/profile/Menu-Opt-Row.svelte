<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import calendar from './assets/calendar.svg';
  import edit from './assets/edit.svg';
  import home_select from './assets/home-select.svg';
  import home from './assets/home.svg';
  import settings_select from './assets/settings-select.svg';
  import settings from './assets/settings.svg';
  
  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~
  type PROFILE_OPT = 'Dashboard' | 'Account Settings' | 'Scores' | 'Author';

  const dispatch = createEventDispatcher();

  export let MENU_OPT: PROFILE_OPT;
  export let SELECTED_OPT: PROFILE_OPT;

  let selectedMenuOptIcon: string = undefined;

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function update_selected_opt () {
		dispatch('select_opt_trigger', {
			opt: MENU_OPT
		});
	}

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS [REACTIVE]
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (MENU_OPT == 'Dashboard' && SELECTED_OPT != MENU_OPT) selectedMenuOptIcon = home
  $: if (MENU_OPT == 'Dashboard' && SELECTED_OPT == MENU_OPT) selectedMenuOptIcon = home_select
  $: if (MENU_OPT == 'Account Settings' && SELECTED_OPT != MENU_OPT) selectedMenuOptIcon = settings
  $: if (MENU_OPT == 'Account Settings' && SELECTED_OPT == MENU_OPT) selectedMenuOptIcon = settings_select
  $: if (MENU_OPT == 'Scores') selectedMenuOptIcon = calendar
  $: if (MENU_OPT == 'Author') selectedMenuOptIcon = edit

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

</script>

<!-- ===============
COMPONENT HTML 
=================-->

<div
  class="
    row-space-out
    profile-menu-opt
  "
  on:click={() => update_selected_opt()}
  class:selected-opt-active={SELECTED_OPT == MENU_OPT}>
  <!-- 
  [ℹ] menu opt row
  <-contents->
  [ℹ] menu option icon
  [ℹ] menu option text
  <-conditional-txt->
  [ℹ] menu option (not yet avaialble)
  -->
  <div
    class="row-space-start">
    <!-- 
    [ℹ] menu option icon
    -->
    <img
      src={selectedMenuOptIcon}
      alt="{MENU_OPT} Icon"
      aria-label="{MENU_OPT} Icon"
      height="20"
      width="20"
      class="
        m-r-12
        menu-opt-icon
      "
    />
    <!-- 
    [ℹ] menu option text
    -->
    <p
      class="
        w-500
      ">
      {MENU_OPT}
    </p>
  </div>
  <!-- 
  [ℹ] menu option (not yet avaialble)
  <-conditional->
  -->
  {#if ['Scores','Author'].includes(MENU_OPT)}
    <p
      class="
        menu-opt-not-available
        no-wrap
      ">
      Available Soon
    </p>
  {/if}
</div>

<!-- ===============
COMPONENT STYLE
=================-->

<style>
  /* profile menu option row */
  div.profile-menu-opt {
    padding: 20px 12px;
  } div.profile-menu-opt img.menu-opt-icon {
    /* in-line defined [global] class */
  } div.profile-menu-opt.selected-opt-active {
    border-right: 4px solid var(--primary);
    background: rgba(245, 98, 15, 0.1);
  } div.profile-menu-opt.selected-opt-active p {
    color: var(--dark-theme);
  } div.profile-menu-opt p.menu-opt-not-available {
    padding: 3px 8px;
    background-color: var(--whitev2);
    border-radius: 20px;
  }
</style>