<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { createEventDispatcher, type EventDispatcher } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';
	import check from './assets/icon-check.svg';
	import icon_calendar from './assets/menu-opt/calendar.svg';
	import icon_competition_select from './assets/menu-opt/competition-selected.svg';
	import icon_competition from './assets/menu-opt/competition.svg';
	import icon_deposit_select from './assets/menu-opt/deposit-selected.svg';
	import icon_deposit from './assets/menu-opt/deposit.svg';
	import icon_edit from './assets/menu-opt/edit.svg';
	import icon_home_select from './assets/menu-opt/home-select.svg';
	import icon_home from './assets/menu-opt/home.svg';
	import icon_settings_select from './assets/menu-opt/settings-select.svg';
	import icon_settings from './assets/menu-opt/settings.svg';
	import icon_tx_hist_select from './assets/menu-opt/tx-hist-selected.svg';
	import icon_tx_hist from './assets/menu-opt/tx-hist.svg';
	import icon_withdraw_select from './assets/menu-opt/withdraw-selected.svg';
	import icon_withdraw from './assets/menu-opt/withdraw.svg';

	import type { PROFILE_OPT } from '$lib/types/types.scores.js';
	import type { B_PROF_T } from '@betarena/scores-lib/types/profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

	const dispatch: EventDispatcher < any > = createEventDispatcher();

  export let
    VIEW_OPT: 1 | 2,
    MENU_OPT: PROFILE_OPT,
    SELECTED_OPT: PROFILE_OPT,
    mobileExclusive: boolean,
    tabletExclusive: boolean,
    showDropdown: boolean = false
  ;

  let
    RESPONSE_PROFILE_DATA: B_PROF_T,
    selectedMenuOptIcon: string = undefined,
    isHoverMenuOptItem: boolean = false,
    hoverMenuOptIconAlt: string = undefined
  ;

  $: tabletExclusive = tabletExclusive;
	$: mobileExclusive = mobileExclusive;
  $: RESPONSE_PROFILE_DATA = $page.data.RESPONSE_PROFILE_DATA;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

	/**
	 * @description
   * Updates the selected option trigger.
   * Omits for non-valid menu-opt
	 */
	function update_selected_opt
  (
  ): void
  {
    const if_M_0: boolean =
      ['Scores', 'Author'].includes(MENU_OPT)
    ;
		if (if_M_0) return;

		dispatch
    (
      'select_opt_trigger',
      {
        opt: MENU_OPT
      }
    );
	}

	/**
	 * @description
   * bubbles up to parent event to show dropdown.
	 */
	function toggle_dropdown
  (
  ): void
  {
		dispatch('toggle_dropdown');
	}

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  $: if (MENU_OPT == 'Dashboard')
  {
    hoverMenuOptIconAlt = icon_home_select;
    selectedMenuOptIcon =
      SELECTED_OPT == MENU_OPT
        ? icon_home_select
        : icon_home
    ;
  }

	$: if (MENU_OPT == 'Account Settings')
  {
    hoverMenuOptIconAlt = icon_settings_select;
    selectedMenuOptIcon =
      SELECTED_OPT == MENU_OPT
        ? icon_settings_select
        : icon_settings
    ;
  }

  $: if (MENU_OPT == 'Deposit')
  {
    hoverMenuOptIconAlt = icon_deposit_select;
    selectedMenuOptIcon =
      SELECTED_OPT == MENU_OPT
        ? icon_deposit_select
        : icon_deposit
    ;
  }

  $: if (MENU_OPT == 'Withdraw')
  {
    hoverMenuOptIconAlt = icon_withdraw_select;
    selectedMenuOptIcon =
      SELECTED_OPT == MENU_OPT
        ? icon_withdraw_select
        : icon_withdraw
    ;
  }

  $: if (MENU_OPT == 'Transaction History')
  {
    hoverMenuOptIconAlt = icon_tx_hist_select;
    selectedMenuOptIcon =
      SELECTED_OPT == MENU_OPT
        ? icon_tx_hist_select
        : icon_tx_hist
    ;
  }

  $: if (MENU_OPT == 'Competitions History')
  {
    hoverMenuOptIconAlt = icon_competition_select;
    selectedMenuOptIcon =
      SELECTED_OPT == MENU_OPT
        ? icon_competition_select
        : icon_competition
    ;
  }

	$: if (MENU_OPT == 'Scores') selectedMenuOptIcon = icon_calendar;
	$: if (MENU_OPT == 'Author') selectedMenuOptIcon = icon_edit;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
VIEW DESIGN - 1
-->
{#if VIEW_OPT == 1}

	<div
		class=
    "
    row-space-out
    mobile-select-menu-opt-box
    cursor-pointer
    "
		on:click={() => toggle_dropdown()}
	>

		<div
			class=
      "
      row-space-start
      m-r-32
      "
		>

			<img
				src={selectedMenuOptIcon}
				alt="default alt text"
				width=20
				height=20
				class="m-r-12"
			/>

      <!--
      MENU OPTION TEXT
      -->
			<p
				class=
        "
        w-500
        s-16
        color-black-2
        no-wrap
        "
			>
        {#if MENU_OPT == 'Account Settings'}
          {RESPONSE_PROFILE_DATA?.profile?.acc_settings ?? 'Account Settings'}
        {:else if MENU_OPT == 'Dashboard' ?? 'Dashboard'}
          {RESPONSE_PROFILE_DATA?.profile?.dashboard}
        {:else if MENU_OPT == 'Author'}
          {RESPONSE_PROFILE_DATA?.profile?.author ?? 'Author'}
        {:else if MENU_OPT == 'Scores'}
          {RESPONSE_PROFILE_DATA?.profile?.scores ?? 'Scores'}
        {:else if MENU_OPT == 'Withdraw'}
          {'Withdraw'}
        {:else if MENU_OPT == 'Deposit'}
          {'Deposit'}
        {:else if MENU_OPT == 'Transaction History'}
          {'Transaction History'}
        {:else if MENU_OPT == 'Competitions History'}
          {'Competitions History'}
        {/if}
			</p>

		</div>

		<img
			src={showDropdown ? arrow_up : arrow_down}
			alt={showDropdown	? 'arrow_up' : 'arrow_down'}
			width=20
			height=20
		/>

	</div>

{/if}

<!--
VIEW DESIGN - 2
-->
{#if VIEW_OPT == 2}

	<div
    data-testid="profile/menu-widget/inner/main-row/ui-2"
		class=
    "
    row-space-out
    profile-menu-opt
    "
		on:click={() => update_selected_opt()}
		class:selected-opt-active={SELECTED_OPT == MENU_OPT && !tabletExclusive}
		class:cursor-pointer=
    {
      !
      [
        'Scores',
        'Author'
      ]
      .includes(MENU_OPT)
    }
		class:cursor-not-allowed=
    {
      [
        'Scores',
        'Author'
      ]
      .includes(MENU_OPT)
    }
		on:mouseenter={() => (isHoverMenuOptItem = true)}
		on:mouseleave={() => (isHoverMenuOptItem = false)}
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

		<!--
    [ℹ] menu opt row
    <-contents->
    [ℹ] menu option icon
    [ℹ] menu option text
    <-conditional-txt->
    [ℹ] menu option (not yet avaialble)
    -->
		<div
      class=
      "
      row-space-start
      "
    >

			<!--
      MENU OPTION ICON
      -->
			<img
				src=
        {
          (!isHoverMenuOptItem || ['Scores', 'Author'].includes(MENU_OPT))
            ? selectedMenuOptIcon
            : hoverMenuOptIconAlt
        }
				alt="{MENU_OPT} Icon"
				aria-label="{MENU_OPT} Icon"
				height=20
				width=20
				class=
        "
          m-r-12
          menu-opt-icon
        "
			/>

			<!--
      MENU OPTION TEXT
      -->
			<p
				class=
        "
        w-500
        s-16
        "
				class:color-grey={SELECTED_OPT != MENU_OPT}
				class:color-black-2={SELECTED_OPT == MENU_OPT}
				class:color-grey-shade=
        {
          [
            'Scores',
            'Author'
				  ].includes(MENU_OPT)
        }
				class:menu-opt-text=
        {
          !
          [
            'Scores',
            'Author'
          ].includes(MENU_OPT)
        }
			>
        {#if MENU_OPT == 'Account Settings'}
          {RESPONSE_PROFILE_DATA?.profile?.acc_settings ?? 'Account Settings'}
        {:else if MENU_OPT == 'Dashboard'}
          {RESPONSE_PROFILE_DATA?.profile?.dashboard ?? 'Dashboard'}
        {:else if MENU_OPT == 'Author'}
          {RESPONSE_PROFILE_DATA?.profile?.author ?? 'Author'}
        {:else if MENU_OPT == 'Scores'}
          {RESPONSE_PROFILE_DATA?.profile?.scores ?? 'Scores'}
        {:else if MENU_OPT == 'Withdraw'}
          {'Withdraw'}
        {:else if MENU_OPT == 'Deposit'}
          {'Deposit'}
        {:else if MENU_OPT == 'Transaction History'}
          {'Transaction History'}
        {:else if MENU_OPT == 'Competitions History'}
          {'Competitions History'}
        {/if}
			</p>

		</div>

		<!--
    MENU OPTION (selected) ICON
    -->
		{#if SELECTED_OPT == MENU_OPT && tabletExclusive}
			<img
				src={check}
				alt="default alt text"
				width=20
				height=20
				class:display-none={SELECTED_OPT !=	MENU_OPT}
			/>
		{/if}

		<!--
    MENU OPTION (not yet avaialble)
    -->
		{#if ['Scores', 'Author'].includes(MENU_OPT)}
			<p
				class=
        "
        menu-opt-not-available
        no-wrap
        color-grey
        s-12
        "
			>
				{RESPONSE_PROFILE_DATA?.profile?.soon ?? 'Soon'}
			</p>
		{/if}

	</div>

{/if}

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/*
  view (#1)
  */
	div.mobile-select-menu-opt-box
  {
		padding: 0 12px 16px 12px;
	}

	/*
  view (#2); profile menu option row
  */
	div.profile-menu-opt
  {
		padding: 12px 24px;
	}

	div.profile-menu-opt.selected-opt-active
  {
		border-right: 4px solid var(--primary);
		background: rgba(245, 98, 15, 0.1);
	}
	div.profile-menu-opt p.menu-opt-not-available
  {
		padding: 3px 8px;
		background-color: var(--whitev2);
		border-radius: 20px;
	}
	div.profile-menu-opt:hover p.menu-opt-text
  {
		color: var(--dark-theme) !important;
	}

	/*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 725px)
  {
		div.mobile-select-menu-opt-box
    {
			padding: 0 20px 0 0;
		}
	}

  /*
  =============
  🌒 DARK-THEME
  =============
  */

  div.profile-menu-opt.dark-background-1.selected-opt-active
  {
    background: unset;
		background: rgba(245, 98, 15, 0.1) !important;
  }

  div.profile-menu-opt.dark-background-1 p.menu-opt-not-available
  {
		background-color: var(--dark-theme-1-shade) !important;
	}

  div.profile-menu-opt.dark-background-1:hover p.menu-opt-text
  {
    color: var(--white) !important;
	}

</style>
