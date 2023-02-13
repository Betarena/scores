<!-- ===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import wallet from './assets/wallet.svg';

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
<div id="modal-delete-box">
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
      color-black-2
      m-b-24
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
		class="
      btn-hollow
      w-500
      s-14
    "
		on:click={() => connect_wallet_action()}
	>
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
		text-align: -webkit-center;
		overflow: hidden;
	}
	div#modal-delete-box > img#close-vector {
		/* position */
		position: absolute;
		top: 30px;
		right: 15px;
		z-index: 400000002;
	}
</style>
