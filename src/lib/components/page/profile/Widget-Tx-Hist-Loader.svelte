<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import LoaderBox_1 from './loaders/Loader-Box-1.svelte';
	import LoaderBox_2 from './loaders/Loader-Box-2.svelte';
	import LoaderBox_3 from './loaders/Loader-Box-3.svelte';

  // #endregion ➤ 📦 Package Imports

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  class="widget-component"
>
  <!-- <LivescoresTopRow
    numOfFixtures={0}
    numOfFixturesLive={0}
  /> -->

  <div>
    {#each { length: 10 } as _, i}
      <div
        class=
        "
        row-space-out
        "
      >
        <LoaderBox_1 />
        <LoaderBox_2 />
        <LoaderBox_3 />
      </div>
    {/each}
  </div>

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  :global(div.livescores-fixture-row-loader) {
    border-top: 1px solid var(--grey-color);
    padding-top: 20px;
    padding-bottom: 10px;
    padding: 20px;
    text-align: center;
  }

  /*
  =============
  RESPONSIVNESS
  =============
  */

  @media only screen and (min-width: 768px) {
		.widget-component {
			margin-top: 40px;
		}
	}

  /*
  =============
  DARK-THEME
  =============
  */

  :global(.dark-background div.livescores-fixture-row-loader) {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

</style>