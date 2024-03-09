<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import userBetarenaSettings from '$lib/store/user-settings.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  export let WIDGET_TITLE: string
  export let OVERRIDE_COLOR: boolean = false;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // -Methods Go Here

  function do_something() {}

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<h2
  class="
    s-20
    m-b-10
    w-500
    {$userBetarenaSettings.theme == 'Dark' || OVERRIDE_COLOR ? 'color-white' : 'color-black-2'}
  "
  style="margin-top: 0px;"
>
  {WIDGET_TITLE}
</h2>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

</style>