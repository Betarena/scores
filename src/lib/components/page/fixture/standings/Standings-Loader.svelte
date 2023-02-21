<!-- [ℹ]============
	COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import PlaceholderBottom from './loaders/desktop/Loader-Bottom.svelte';
	import PlaceholderHead from './loaders/desktop/Loader-Head.svelte';
	import PlaceholderRowLeft from './loaders/desktop/Loader-Row-Left.svelte';
	import PlaceholderRowRight from './loaders/desktop/Loader-Row-Right.svelte';
	import PlaceholderViewSel from './loaders/desktop/Loader-ViewSel.svelte';

	import PlaceholderBottomM from './loaders/mobile/Loader-Bottom.svelte';
	import PlaceholderHeadM from './loaders/mobile/Loader-Head.svelte';
	import PlaceholderRowLeftM from './loaders/mobile/Loader-Row-Left-M.svelte';
	import PlaceholderRowRightM from './loaders/mobile/Loader-Row-Right-M.svelte';
	import PlaceholderViewSelRight from './loaders/mobile/Loader-ViewSel-Right.svelte';
	import PlaceholderViewSelM from './loaders/mobile/Loader-ViewSel.svelte';

	let showNum: number = 2;

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	const tabletView = 1160;
	const mobileView = 725;
	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		viewport_change();
		window.addEventListener(
			'resize',
			function () {
				viewport_change();
			}
		);
	});

	function viewport_change() {
		var w = document.documentElement.clientWidth;
		tabletExclusive =
			w > tabletView ? false : true;
		mobileExclusive =
			w < mobileView ? true : false;
	}
</script>

<!-- ============
  COMPONENT HTML 
=================-->

<div
	id="fixture-standings-table-container"
	class:dark-background-1={$userBetarenaSettings.theme ==
		'Dark'}
>
	<!-- 
  [ℹ] DESKTOP CONTENT-LOADER
  -->
	{#if !tabletExclusive}
		<div class="m-b-15">
			<PlaceholderViewSel />
		</div>

		<div>
			<PlaceholderHead />
		</div>

		{#each { length: showNum } as _, i}
			<div class="teams-row row-space-out">
				<div class="yes m-r-15">
					<PlaceholderRowLeft />
				</div>
				<div>
					<PlaceholderRowRight />
				</div>
			</div>
		{/each}

		<PlaceholderBottom />

		<!-- 
  [ℹ] TABLET CONTENT-LOADER 
  -->
	{:else if tabletExclusive && !mobileExclusive}
		<div class="m-b-15">
			<PlaceholderViewSel />
		</div>

		<div>
			<PlaceholderHead />
		</div>

		{#each { length: showNum } as _, i}
			<div class="teams-row row-space-out">
				<div class="yes m-r-15">
					<PlaceholderRowLeft />
				</div>
				<div>
					<PlaceholderRowRight />
				</div>
			</div>
		{/each}

		<PlaceholderBottom />

		<!-- 
  [ℹ] MOBILE EXCLUSIVE CONTENT-LOADER 
  -->
	{:else if tabletExclusive && mobileExclusive}
		<div
			id="top-header"
			class="
        m-b-20
        row-space-out
      "
			style="padding: 0 20px;"
		>
			<PlaceholderViewSelM />
			<PlaceholderViewSelRight />
		</div>

		<PlaceholderHeadM />

		{#each { length: showNum } as _, i}
			<div class="teams-row row-space-out">
				<div class="yes m-r-15">
					<PlaceholderRowLeftM />
				</div>
				<div class="yes_2">
					<PlaceholderRowRightM />
				</div>
			</div>
		{/each}

		<div style="padding: 0 20px;">
			<PlaceholderBottomM />
		</div>
	{/if}
</div>

<!-- ============
  COMPONENT STYLE
=================-->
<style>
	.yes {
		width: auto;
	}

	.yes_2 {
		width: auto;
	}

	#fixture-standings-table-container {
		/* display: grid; */
		padding: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		/* overflow: hidden; */
		position: relative;
		margin-top: 40px;
	}

	div.teams-row {
		padding: 10px 0;
	}

	/* 
  MOBILE-EXCLUSIVE RESPONSIVNESS 
  */
	@media only screen and (max-width: 725px) {
		/* ... REUIRED FOR SVELTE-CONTENT-LOADER ... */
		:global(#fixture-standings-table-container
				#top-header
				svg) {
			width: auto !important;
		}

		#fixture-standings-table-container {
			padding: 20px 0;
		}

		div.teams-row {
			padding: 10px 20px;
		}
	}

	@media only screen and (max-width: 768px) {
		:global(svg) {
			/* width: 100% !important; */
		}
	}

	@media only screen and (min-width: 768px) {
		#fixture-standings-table-container {
			margin-top: 40px;
		}
	}

	/* WIDGET DARK THEME */
	.dark-background-1 #fixture-league-title,
	.dark-background-1 #fixture-visual-box,
	.dark-background-1 .best-players-box,
	.dark-background-1 #live-stream-box {
		box-shadow: inset 0px -1px 0px #616161 !important;
	}
</style>
