<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import danger from '../assets/alert.svg';

  import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

	const dispatch: EventDispatcher < any > = createEventDispatcher();

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

	/**
	 * @description
   * bubbles up to parent event
	 * to close (this) modal widget
	 */
	function toggle_modal
	(
	): void
	{
	  dispatch('toggle_delete_modal');
	}

	/**
	 * @description
   * bubbles up to parent event
	 * to trigger target method
	 */
	function continue_delete_account
	(
	): void
	{
	  dispatch('delete_account');
	}

  // #endregion ➤ 🛠️ METHODS

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
[ℹ] main modal widget (background blur)
-->
<div
	id="background-modal-blur"
	on:click={() => {return toggle_modal()}}
	in:fade
/>

<!--
MAIN MODAL - WIDGET
-->
<div
  id="modal-delete-box"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>
	<!--
  [ℹ] close modal icon (cross)
  -->
	<img
		id="close-vector"
		class="cursor-pointer"
		src="/assets/svg/close.svg"
		alt="close-svg"
		on:click={() => {return toggle_modal()}}
	/>
	<!--
  [ℹ] delete account icon (danger)
  -->
	<img
		src={danger}
		alt="danger icon"
		class="m-b-24"
	/>
	<!--
  [ℹ] delete account main text
  -->
	<p
		class="
      s-16
      m-b-12
      w-500
      color-red-bright
    "
	>
    {profileTrs.profile?.delete_account_title} ?
	</p>
	<!--
  [ℹ] delete account desc. info
  -->
	<p
		class="
      s-16
      color-grey
      m-b-24
    "
	>
		{profileTrs.profile?.delete_account_desc}
	</p>
	<!--
  [ℹ] main widget action
  <-contents->
  [ℹ] delete account (btn)
  [ℹ] cancel action (btn)
  -->
	<div class="row-space-out">
		<!--
    [ℹ] delete action (btn)
    -->
		<button
			class="
        btn-hollow
        w-500
        s-14
        color-red-bright
        m-r-16
      "
      style="width: 100%"
			on:click={() => {return continue_delete_account()}}
		>
      {profileTrs.profile?.delete_button}
		</button>
		<!--
    [ℹ] cancel action (btn)
    -->
		<button
			class="
        btn-hollow
        color-black-2
      "
      style="width: 100%"
			on:click={() => {return toggle_modal()}}
		>
      {profileTrs.profile?.cancel_expression}
		</button>
	</div>
</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	div#background-modal-blur
  {
		/* position */
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 4000;
		/* style */
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	div#modal-delete-box
  {
		/* position */
		position: fixed;
		z-index: 10000;
		margin: auto;
		width: fit-content;
		width: 92%;
		right: 0;
		left: 0;
		bottom: 0;
		top: 0;
		height: fit-content;
		/* style */
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;
    padding-top: 45px;
		text-align: -webkit-center;
		overflow: hidden;
	}
	div#modal-delete-box > img#close-vector
  {
		/* position */
		position: absolute;
		top: 20px;
		right: 20px;
		z-index: 400000002;
	}

  /*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 575px)
  {
		div#modal-delete-box
    {
			width: 328px;
		}
	}

  /*
  =============
  DARK-THEME
  =============
  */

  div#modal-delete-box.dark-background-1
  {
		box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--dark-theme-1) !important;
	}
  div#modal-delete-box.dark-background-1 button.btn-hollow
  {
		border: 1px solid var(--dark-theme-1-2-shade) !important;
  }
</style>
