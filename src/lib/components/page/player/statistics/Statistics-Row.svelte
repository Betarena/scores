<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

  export let STAT_NAME: string;
  export let STAT_VALUE: string;

</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

<div
  class="
    row-space-out
    pstat-row
  "
>
  <p
    class="
      s-14 
      w-500 
      color-black-2
    "
  >
    {STAT_NAME}
  </p>
  <p
    class="
      s-14 
      w-500 
      color-black-2
    "
  >
    {STAT_VALUE}
  </p>
</div>

<!-- ===============
  COMPONENT STYLE
==================== -->
<style>

	/* statistics row */
  div.pstat-row
  {
		padding: 8px 0;
    margin: 0 20px;
		width: -webkit-fill-available;
		width: -moz-available;
		position: relative;
  }
	div.pstat-row p 
  {
		font-size: 14px;
		display: flex;
	}

	/* div.stats-row p.greaterClass {
		color: #f5620f !important;
	}
	div.stats-row p.text-translate {
		position: absolute;
		margin: auto;
		left: 0;
		right: 0;
		width: fit-content;
	} */

	/* 
  MOBILE RESPONSIVNESS (&+) */
	@media only screen and (max-width: 425px) {
		/* EMPTY */
	}

	@media only screen and (max-width: 475px) {
		/* EMPTY */
	}

	/* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1160px) and (max-width: 1240px) {
		/* EMPTY */
	}

	@media only screen and (min-width: 1240px) {
		/* EMPTY */
	}

	/* .............. 
	WIDGET DARK THEME 
	................. */
</style>
