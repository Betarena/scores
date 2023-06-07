<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

	export let TEAM_HOME_STAT: string;
	export let TEAM_AWAY_STAT: string;
	export let STAT_TRANSLATION: string;
	export let OPT: string;

	let greaterClass: string;

	$: if (
		TEAM_HOME_STAT != undefined &&
		TEAM_AWAY_STAT != undefined
	) {
		if (
			parseFloat(TEAM_HOME_STAT) >
			parseFloat(TEAM_AWAY_STAT)
		) {
			greaterClass = 'H';
		}
		if (
			parseFloat(TEAM_AWAY_STAT) >
			parseFloat(TEAM_HOME_STAT)
		) {
			greaterClass = 'A';
		}
	}
</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

{#if TEAM_HOME_STAT != undefined && TEAM_AWAY_STAT != undefined && STAT_TRANSLATION != undefined}
	<div
		class="
      row-space-out
      stats-row
    "
	>
		<p
			class="
        w-500
        color-black-2
      "
			class:greaterClass={greaterClass == 'H'}
		>
			{parseInt(TEAM_HOME_STAT)}
			{#if OPT == 'possessiontime' || OPT == 'percentage'}
				<span> % </span>
			{/if}
		</p>
		<p
			class="
        w-400
        color-grey
        text-translate
      "
		>
			{STAT_TRANSLATION}
		</p>
		<p
			class="
        w-500
        color-black-2
      "
			class:greaterClass={greaterClass == 'A'}
		>
			{parseInt(TEAM_AWAY_STAT)}
			{#if OPT == 'possessiontime' || OPT == 'percentage'}
				<span> % </span>
			{/if}
		</p>
	</div>
{/if}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* 
  statistics row 
  */
	div.stats-row 
  {
		padding: 14px 0 4px 0;
		margin: 0 20px;
		border-bottom: 1px solid #e6e6e6;
		width: -webkit-fill-available;
		width: -moz-available;
		position: relative;
	}
	div.stats-row p 
  {
		font-size: 14px;
		display: flex;
	}
	div.stats-row p.greaterClass 
  {
		color: #f5620f !important;
	}
	div.stats-row p.text-translate 
  {
		position: absolute;
		margin: auto;
		left: 0;
		right: 0;
		width: fit-content;
	}

  /*
  =============
  RESPONSIVNESS 
  =============
  */

	@media only screen 
  and (max-width: 425px) 
  {
		/* EMPTY */
	}

	@media only screen 
  and (max-width: 475px) 
  {
		/* EMPTY */
	}

	@media only screen 
  and (min-width: 1160px) 
  and (max-width: 1240px) 
  {
		/* EMPTY */
	}

	@media only screen 
  and (min-width: 1240px) 
  {
		/* EMPTY */
	}

	/*
  =============
  DARK-THEME
  =============
  */

</style>
