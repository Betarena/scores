<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from "$app/environment";

  //#endregion ➤ [MAIN] Package Imports

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

{#if !browser}
  <div
    id="seo-widget-box"
  >
    <slot>
    </slot>
  </div>
{/if}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#seo-widget-box
  {
    position: fixed;
    z-index: -100000000;
    top: -999999px;
    left: -999999px;
  }

  @media only screen and (min-width: 726px) and (max-width: 1000px) {
  }
</style>