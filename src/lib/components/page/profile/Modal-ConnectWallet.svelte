<!-- ===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import wallet from './assets/wallet.svg';
	import metamask_icon from './assets/metamask.svg';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	const dispatch = createEventDispatcher();

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	/**
	 * @description bubbles up to parent event
	 * to close (this) modal widget
	 */
	function toggle_modal(): void {
		dispatch('toggle_delete_modal');
	}

	/**
	 * @description bubbles up to parent event
	 * to trigger target method
	 */
	function connect_wallet_action(): void {
		dispatch('connect_wallet_action');
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~
</script>

<!-- ===============
COMPONENT HTML 
=================-->

<!-- 
[ℹ] main modal widget (background blur)
-->
<div
	id="background-modal-blur"
	on:click={() => toggle_modal()}
	in:fade
/>

<!--
[ℹ] main modal widget
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
		on:click={() => toggle_modal()}
	/>
	<!-- 
  [ℹ] delete account icon (danger)
  -->
	<img
		src={wallet}
		alt="wallet icon"
		class="m-b-24"
	/>
	<!-- 
  [ℹ] delete account main text
  -->
	<p
		class="
      s-16
      m-b-12
      color-black-2
    "
	>
		Cryptocurrency wallet
	</p>
	<!-- 
  [ℹ] delete account desc. info
  -->
	<p
		class="
      s-16
      m-b-24
      color-grey
    "
	>
		Connect your crypto wallet to your Paragraph
		account. This lets you login using your wallet
		and unlock other web3 functionality.
	</p>
	<!-- 
  [ℹ] connect wallet action (btn)
  -->
	<button
    id="sign-in-metamask-btn"
		class="
      btn-hollow
      w-500
      s-14
      color-black-2
    "
		on:click={() => connect_wallet_action()}
	>
    <img 
      src="{metamask_icon}" 
      alt="metamask icon"
      class="m-r-16"
    />
		Connect with MetaMask
	</button>
</div>

<!-- ===============
COMPONENT STYLE
=================-->
<style>
	div#background-modal-blur {
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

	div#modal-delete-box {
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
		text-align: -moz-center;
		overflow: hidden;
	}
	div#modal-delete-box > img#close-vector {
		/* position */
		position: absolute;
		top: 20px;
		right: 20px;
		z-index: 400000002;
	}
  button#sign-in-metamask-btn {
    width: -webkit-fill-available; 
    width: -moz-available; 
    border-radius: 60px;
  }

  /* -----------------
    RESPONSIVNESS
  ----------------- */

	@media only screen and (min-width: 575px) {
		div#modal-delete-box  {
			width: 328px;
		}
	}

  /* -----------------
    WIDGET DARK THEME 
  ----------------- */

  div#modal-delete-box.dark-background-1 {
		box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--dark-theme-1) !important;
	}
  div#modal-delete-box.dark-background-1 button#sign-in-metamask-btn {
		border: 1px solid var(--dark-theme-1-2-shade) !important;
  }
</style>
