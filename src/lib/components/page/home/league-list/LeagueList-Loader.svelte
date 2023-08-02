<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';

	import LoaderRow from './loaders/Loader_Row.svelte';
</script>

<!-- ===============
    COMPONENT HTML
==================== -->

<div
	id="league-list-content-loader"
	class:dark-background-1={$userBetarenaSettings.theme ==
		'Dark'}
>
	<!--
  [ℹ] [DESKTOP ONLY]
  -->
	<p
		class="
    s-14
    color-grey
  "
	>
		Popular leagues
	</p>
	{#each { length: 6 } as _, i}
		<div class="loader-row">
			<LoaderRow />
		</div>
	{/each}

	<p
		class="
    s-14
    color-grey
  "
	>
		Leagues by country
	</p>
	{#each { length: 21 } as _, i}
		<div class="loader-row">
			<LoaderRow />
		</div>
	{/each}
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->
<style>
	div#league-list-content-loader {
		background-color: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		width: 100%;
		min-width: 100%;
		overflow: hidden;
		border-radius: 12px;
		/* dynamic */
		padding: 0 20px;
		margin-top: 40px;
		padding-top: 0;
	}

	/* loader group section text */
	div#league-list-content-loader p {
		margin-top: 20px;
	}

	/* loader row */
	div#league-list-content-loader div.loader-row {
		padding: 12px 0;
	}

	/* IMPORTANT - OVERRIDE GLOBAL SVG STYLE */
	:global(div#league-list-content-loader svg) {
		width: fit-content !important;
	}

	/* ====================
    RESPONSIVNESS
  ==================== */

	/*
  TABLET RESPONSIVNESS (&+) */
	@media only screen and (min-width: 726px) and (max-width: 1000px) {
		/* EMPTY */
	}

	/*
  DESKTOP RESPONSIVNESS (&+) */
	@media only screen and (min-width: 1001px) {
		/* EMPTY */
	}

	/* ====================
    WIDGET DARK THEME
  ==================== */

	/* EMPTY */
</style>
