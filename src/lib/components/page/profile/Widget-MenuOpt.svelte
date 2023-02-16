<!-- ===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { viewport_change } from '$lib/utils/platform-functions';
	import profile_avatar from './assets/profile-avatar.svg';
	import MenuOptRow from './Widget-MenuOpt-Row.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	type PROFILE_OPT =
		| 'Dashboard'
		| 'Account Settings'
		| 'Scores'
		| 'Author';

	const PROFILE_MENU_OPT: PROFILE_OPT[] = [
		'Dashboard',
		'Account Settings',
		'Scores',
		'Author'
	];

	let selectedMenuOpt: PROFILE_OPT = 'Dashboard';
	let showDropdown: boolean = false;

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	function update_selected_opt(event) {
		selectedMenuOpt = event?.detail?.opt || event;
		showDropdown = false;
		if (selectedMenuOpt == 'Dashboard')
			goto(`/u/dashboard/${$userBetarenaSettings.lang}`, {
				replaceState: true
			});
		if (selectedMenuOpt == 'Account Settings')
			goto(`/u/settings/${$userBetarenaSettings.lang}`, { replaceState: true });
	}

	function closeAllDropdowns(): void {
		showDropdown = false;
	}

	$: {
		if ($page?.url?.pathname.includes('dashboard'))
			selectedMenuOpt = 'Dashboard';
		if ($page?.url?.pathname.includes('settings'))
			selectedMenuOpt = 'Account Settings';
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 725;
	let mobileExclusive,
		tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});
</script>

<!-- ===============
COMPONENT HTML 
=================-->

{#if !mobileExclusive && showDropdown}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<div
	id="profile-menu-widget-container"
	class:row-space-out={tabletExclusive &&
		!mobileExclusive}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>
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
    "
	>
		<!-- 
    [ℹ] profile picture
    -->
		<img
			id="menu-summary-profile-picture"
			src={$userBetarenaSettings?.user
				?.scores_user_data?.profile_photo ||
				profile_avatar}
			alt="Profile Icon"
			title="Profile Icon"
			aria-label="Profile Icon"
			width="64"
			height="64"
			class="m-r-16"
		/>
		<!-- 
    [ℹ] username
    -->
		<p
			class="
        s-20
        w-500
        color-black-2
      "
		>
			{$userBetarenaSettings?.user
				?.scores_user_data?.username}
		</p>
	</div>

	<!--
  [ℹ] MOBILE
  -->
	{#if mobileExclusive}
		<!-- 
    [ℹ] dropdown menu select
    -->
		<MenuOptRow
			VIEW_OPT={1}
			MENU_OPT={selectedMenuOpt}
			SELECTED_OPT={selectedMenuOpt}
			{mobileExclusive}
			{tabletExclusive}
			{showDropdown}
			on:toggle_dropdown={() =>
				(showDropdown = !showDropdown)}
		/>
		<!-- 
    [ℹ] dropdown menu select
    -->
		{#if showDropdown}
			<div
				id="background-modal-blur"
				on:click={() =>
					(showDropdown = !showDropdown)}
			/>
			<div id="dropdown-menu-opt-mobile">
				{#each PROFILE_MENU_OPT as item}
					<MenuOptRow
						VIEW_OPT={2}
						MENU_OPT={item}
						SELECTED_OPT={selectedMenuOpt}
						{mobileExclusive}
						{tabletExclusive}
						on:select_opt_trigger={(e) =>
							update_selected_opt(e)}
					/>
				{/each}
			</div>
		{/if}
	{/if}

	<!-- 
  [ℹ] TABLET
  [ℹ] MOBILE (CSS adjusted)
  -->
	{#if tabletExclusive && !mobileExclusive}
		<!-- 
    <-contents->
    [ℹ] profile menu options
    -->
		<div id="dropdown-menu-opt-tablet-box">
			<!-- 
      [ℹ] selected menu show
      -->
			<MenuOptRow
				VIEW_OPT={1}
				MENU_OPT={selectedMenuOpt}
				SELECTED_OPT={selectedMenuOpt}
				{mobileExclusive}
				{tabletExclusive}
				{showDropdown}
				on:toggle_dropdown={() =>
					(showDropdown = !showDropdown)}
			/>
			<!-- 
      [ℹ] dropdown menu select
      -->
			{#if showDropdown}
				<div id="dropdown-menu-opt-tablet">
					{#each PROFILE_MENU_OPT as item}
						<MenuOptRow
							VIEW_OPT={2}
							MENU_OPT={item}
							SELECTED_OPT={selectedMenuOpt}
							{mobileExclusive}
							{tabletExclusive}
							on:select_opt_trigger={(e) =>
								update_selected_opt(e)}
						/>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- 
  [ℹ] DESKTOP
  -->
	{#if !tabletExclusive}
		<!-- 
    <-contents->
    [ℹ] profile menu options
    -->
		<div>
			{#each PROFILE_MENU_OPT as item}
				<MenuOptRow
					VIEW_OPT={2}
					MENU_OPT={item}
					SELECTED_OPT={selectedMenuOpt}
					{mobileExclusive}
					{tabletExclusive}
					on:select_opt_trigger={(e) =>
						update_selected_opt(e)}
				/>
			{/each}
		</div>
	{/if}
</div>

<!-- ===============
COMPONENT STYLE
=================-->
<style>
	div#background-area-close {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 1000;
	}

	/* profile widget */
	div#profile-menu-widget-container {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
	}

	div#profile-menu-widget-container
		> div#profile-main-row {
		padding: 20px 20px 0 20px;
	}
	div#profile-menu-widget-container
		> div#profile-main-row
		> img#menu-summary-profile-picture {
		border-radius: 50%;
	}

	/* mobile styles dropdown */
	div#background-modal-blur {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 999998;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
	div#dropdown-menu-opt-mobile {
		position: fixed;
		z-index: 999999;
		bottom: 0;
		right: 0;
		width: 100%;
		background-color: var(--white);
		box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
		border-radius: 16px 16px 0px 0px;
		padding: 12px 0 5px 0;
	}

	/* -----------------
    RESPONSIVNESS
  ----------------- */

	@media screen and (min-width: 768px) {
		/* tablet styles dropdown */
		div#dropdown-menu-opt-tablet-box {
			position: relative;
		}
		div#dropdown-menu-opt-tablet {
			position: absolute;
			top: 115%;
			right: 12.5%;
			z-index: 10000;
			width: 260px;
			background-color: var(--white);
			box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
			border-radius: 16px;
			max-height: 209px;
			overflow: hidden;
		}
	}

  @media screen and (min-width: 1159px) {
		/* desktop styles dropdown */
		div#profile-menu-widget-container {
      overflow: hidden;
    }
  }

	/* -----------------
    WIDGET DARK THEME 
  ----------------- */

  div#profile-menu-widget-container.dark-background-1 {
		box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--dark-theme-1) !important;
	}

</style>
