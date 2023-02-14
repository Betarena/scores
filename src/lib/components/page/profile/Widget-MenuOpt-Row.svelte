<!-- ===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { createEventDispatcher } from 'svelte';

	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';
	import calendar from './assets/calendar.svg';
	import edit from './assets/edit.svg';
	import home_select from './assets/home-select.svg';
	import home from './assets/home.svg';
	import check from './assets/icon-check.svg';
	import settings_select from './assets/settings-select.svg';
	import settings from './assets/settings.svg';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	type PROFILE_OPT =
		| 'Dashboard'
		| 'Account Settings'
		| 'Scores'
		| 'Author';

	const dispatch = createEventDispatcher();

	export let VIEW_OPT: 1 | 2;
	export let MENU_OPT: PROFILE_OPT;
	export let SELECTED_OPT: PROFILE_OPT;
	export let mobileExclusive: boolean;
	export let tabletExclusive: boolean;
	export let showDropdown: boolean = false;

	let selectedMenuOptIcon: string = undefined;
	let isHoverMenuOptItem: boolean = false;
	let hoverMenuOptIconAlt: string = undefined;

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	/**
	 * @description updates the selected option
	 * trigger. Omits for non-valid menu-opt
	 */
	function update_selected_opt() {
		if (['Scores', 'Author'].includes(MENU_OPT))
			return;
		dispatch('select_opt_trigger', {
			opt: MENU_OPT
		});
	}

	/**
	 * @description bubbles up to parent event
	 * to show dropdown
	 */
	function toggle_dropdown() {
		dispatch('toggle_dropdown');
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS [REACTIVE]
	// ~~~~~~~~~~~~~~~~~~~~~

	$: if (
		MENU_OPT == 'Dashboard' &&
		SELECTED_OPT != MENU_OPT
	)
		selectedMenuOptIcon = home;
	$: if (MENU_OPT == 'Dashboard')
		hoverMenuOptIconAlt = home_select;
	$: if (
		MENU_OPT == 'Dashboard' &&
		SELECTED_OPT == MENU_OPT
	)
		selectedMenuOptIcon = home_select;
	$: if (
		MENU_OPT == 'Account Settings' &&
		SELECTED_OPT != MENU_OPT
	)
		selectedMenuOptIcon = settings;
	$: if (MENU_OPT == 'Account Settings')
		hoverMenuOptIconAlt = settings_select;
	$: if (
		MENU_OPT == 'Account Settings' &&
		SELECTED_OPT == MENU_OPT
	)
		selectedMenuOptIcon = settings_select;
	$: if (MENU_OPT == 'Scores')
		selectedMenuOptIcon = calendar;
	$: if (MENU_OPT == 'Author')
		selectedMenuOptIcon = edit;

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	$: tabletExclusive = tabletExclusive;
	$: mobileExclusive = mobileExclusive;
</script>

<!-- ===============
COMPONENT HTML 
=================-->

<!-- 
[ℹ] option view (#1)
<-conditional->
[ℹ] used by MOBILE & TABLET
[ℹ] simple icon + text + dropdown icon
-->
{#if VIEW_OPT == 1}
	<div
		class="
      row-space-out
      mobile-select-menu-opt-box
      cursor-pointer
    "
		on:click={() => toggle_dropdown()}
	>
		<div
			class="
        row-space-start
        m-r-32
      "
		>
			<img
				src={selectedMenuOptIcon}
				alt=""
				width="20"
				height="20"
				class="m-r-12"
			/>
			<p
				class="
          w-500
          s-16
          color-black-2
          no-wrap
        "
			>
				{MENU_OPT}
			</p>
		</div>
		<img
			src={showDropdown ? arrow_up : arrow_down}
			alt={showDropdown
				? 'arrow_up'
				: 'arrow_down'}
			width="20"
			height="20"
		/>
	</div>
{/if}

<!-- 
[ℹ] option view (#2)
<-conditional->
[ℹ] used by MOBILE & TABLET & DESKTOP
-->
{#if VIEW_OPT == 2}
	<div
		class="
      row-space-out
      profile-menu-opt
    "
		on:click={() => update_selected_opt()}
		class:selected-opt-active={SELECTED_OPT ==
			MENU_OPT && !tabletExclusive}
		class:cursor-pointer={![
			'Scores',
			'Author'
		].includes(MENU_OPT)}
		class:cursor-not-allowed={[
			'Scores',
			'Author'
		].includes(MENU_OPT)}
		on:mouseenter={() =>
			(isHoverMenuOptItem = true)}
		on:mouseleave={() =>
			(isHoverMenuOptItem = false)}
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
		<div class="row-space-start">
			<!-- 
      [ℹ] menu option icon
      -->
			<img
				src={!isHoverMenuOptItem ||
				['Scores', 'Author'].includes(MENU_OPT)
					? selectedMenuOptIcon
					: hoverMenuOptIconAlt}
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
        "
				class:color-grey={SELECTED_OPT !=
					MENU_OPT}
				class:color-black-2={SELECTED_OPT ==
					MENU_OPT}
				class:color-grey-shade={[
					'Scores',
					'Author'
				].includes(MENU_OPT)}
				class:menu-opt-text={![
					'Scores',
					'Author'
				].includes(MENU_OPT)}
			>
				{MENU_OPT}
			</p>
		</div>
		<!-- 
    [ℹ] menu option (selected) icon
    -->
		{#if SELECTED_OPT == MENU_OPT && tabletExclusive}
			<img
				src={check}
				alt=""
				width="20"
				height="20"
				class:display-none={SELECTED_OPT !=
					MENU_OPT}
			/>
		{/if}
		<!-- 
    [ℹ] menu option (not yet avaialble)
    <-conditional->
    -->
		{#if ['Scores', 'Author'].includes(MENU_OPT)}
			<p
				class="
          menu-opt-not-available
          no-wrap
          color-grey
        "
			>
				Available Soon
			</p>
		{/if}
	</div>
{/if}

<!-- ===============
COMPONENT STYLE
=================-->
<style>
	/* view (#1) */
	div.mobile-select-menu-opt-box {
		padding: 0 12px 16px 12px;
	}

	/* view (#2); profile menu option row */
	div.profile-menu-opt {
		padding: 12px 24px;
	}
	div.profile-menu-opt img.menu-opt-icon {
		/* in-line defined [global] class */
	}
	div.profile-menu-opt.selected-opt-active {
		border-right: 4px solid var(--primary);
		background: rgba(245, 98, 15, 0.1);
	}
	div.profile-menu-opt p.menu-opt-not-available {
		padding: 3px 8px;
		background-color: var(--whitev2);
		border-radius: 20px;
	}
	div.profile-menu-opt:hover p.menu-opt-text {
		color: var(--dark-theme);
	}

	/* -----------------
    RESPONSIVNESS
  ----------------- */

	@media only screen and (min-width: 725px) {
		div.mobile-select-menu-opt-box {
			padding: 0 20px 0 0;
		}
	}

  /* -----------------
    WIDGET DARK THEME 
  ----------------- */

  div.profile-menu-opt.dark-background-1.selected-opt-active {
    background: unset;
		background: rgba(245, 98, 15, 0.1) !important;
  }

  div.profile-menu-opt.dark-background-1 p.menu-opt-not-available {
		background-color: var(--dark-theme-1-shade) !important;
	}

</style>
