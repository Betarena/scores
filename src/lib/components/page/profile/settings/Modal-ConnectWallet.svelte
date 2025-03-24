<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog, PR_P_STY, PR_P_TAG, PR_P_TOG } from '$lib/utils/debug';

	import metamask_icon from '../assets/metamask.svg';
	import wallet from '../assets/wallet.svg';

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
   * connects the user to the platform using their
   * MetaMask wallet; Dispatches event to parent to bubble up
	 * to trigger target method;
   * @returns { Promise<void> }
	 */
	async function connect_wallet_action
	(
	): Promise < void >
	{
	  // NOTE: detect mobile device
	  // if (typeof screen.orientation !== 'undefined') {
	  // if (navigator?.userAgentData?.mobile) {
	  if (/Mobi/i.test(window.navigator.userAgent)) 
	  {
	    // [ℹ] navigate to MetaMask in-app browser
	    // await goto('https://metamask.app.link/dapp/scores.betarena.com/?dappLogin=true') // ✅ works
	    // await goto('https://metamask.app.link/dapp/http://192.168.0.28:3050/') // does not work
	    // await goto('https://metamask.app.link/dapp/192.168.0.28:3050/?dappLogin=true') // does not work
	    const dappUrl = $page.url.host
	      ,metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}?metmaskAuth=true`;
	    window.open(metamaskAppDeepLink, '_self');
	    toggle_modal()
	    return
	  }
	  // [ℹ] restrict only to MetaMask (original)
	  if (!providerDetect('isMetaMask')[0]) 
	  {
	    dlog('🔴 Moralis Auth not found!')
	    alert('Please install the MetaMask Wallet Extension!')
	    toggle_modal()
	    return
	  }
	  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
	    ,account = accounts[0];
	  dispatch('connect_wallet_action', {
	    wallet_id: account
	  });
	}

  	/**
	 * Validates what Web3 wallet extension
	 * is being used for the platform
	 * @param walletType
	 */
	function providerDetect
	(
	  walletType:
			| 'isMetaMask'
			| 'isCoinbaseWallet'
			| 'isBraveWallet'
	): [boolean, any]
	{
	  // [ℹ] no ethereum wallet present
	  if (!window.ethereum) 

	    return [false, null];
	  // throw new Error("No injected ethereum object.");
		

	  // [ℹ] default provider (single) assign
	  let target_wallet = undefined;

	  // [ℹ] multiple provider(s) check true
	  if (
	    Array.isArray(window.ethereum.providers)
	  ) 
	  {
	    if (walletType == 'isMetaMask') 
	    {
	      target_wallet
					= window.ethereum.providers.find(
					  (provider) =>
					    {
	            return provider[walletType]
							&& provider?.isBraveWallet == undefined
	          }
	        );
	    }
	    // [ℹ] alternative
	    // else {
	    //   target_wallet = window.ethereum.providers.find((provider) => provider[walletType])
	    // }
	    dlog(`${PR_P_TAG} 🔵 More than 1 provider identified! ${window.ethereum.providers.length}`, PR_P_TOG, PR_P_STY)
	    dlog(`${PR_P_TAG} target_wallet ${target_wallet}`, PR_P_TOG, PR_P_STY)
	    dlog(`${PR_P_TAG} window.ethereum.providers ${window.ethereum.providers}`, PR_P_TOG, PR_P_STY)
	  }
	  else 
	  {
	    if (
	      walletType == 'isMetaMask'
				&& window.ethereum?.isBraveWallet
					== undefined
				&& window.ethereum?.isMetaMask
					!= undefined
				&& window.ethereum?.isMetaMask
	    ) 
	    {
	      target_wallet
					= window.ethereum[walletType];
	    }
	    // [ℹ] alternative
	    // else {
	    //   target_wallet = window.ethereum[walletType]
	    // }
	    dlog(`${PR_P_TAG} 🔵 1 provider identified! ${window.ethereum}`, PR_P_TOG, PR_P_STY)
	    dlog(`${PR_P_TAG} target_wallet ${target_wallet}`, PR_P_TOG, PR_P_STY)
	    dlog(`${PR_P_TAG} window.ethereum ${window.ethereum}`, PR_P_TOG, PR_P_STY)
	  }

	  // [ℹ] TARGET (THIS) single provider check true
	  if (target_wallet != undefined) 
	  {
	    dlog(`${PR_P_TAG} 🟢 ${walletType} identified`, PR_P_TOG, PR_P_STY)
	    // DOC: https://stackoverflow.com/questions/69377437/metamask-conflicting-with-coinbase-wallet
	    // DOC: https://stackoverflow.com/questions/72613011/whenever-i-click-on-connect-metamask-button-why-it-connects-the-coinbase-wallet
	    // DOC: https://stackoverflow.com/questions/68023651/how-to-connect-to-either-metamask-or-coinbase-wallet
	    // DOC: https://github.com/MetaMask/metamask-extension/issues/13622
	    // NOTE: conflicting use of CoinBaseWallet & MetaMask
	    // NOTE: setting MetaMask as main wallet
	    // NOTE: IMPORTANT causes issues with FireFox
	    // target_wallet.request({ method: 'eth_requestAccounts' });
	    // NOTE: Not working
	    // window.ethereum.setSelectedProvider(target_wallet);
	    // window.ethereum.request({
	    //   method: 'wallet_requestPermissions',
	    //   params: [{ eth_accounts: {}}]
	    // });
	    return [true, target_wallet];
	  }
	  else 
	  {
	    dlog(`${PR_P_TAG} 🔴 no target wallet (${walletType}) identified`, PR_P_TOG, PR_P_STY)
	    return [false, null];
	  }
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
		on:click={() => {return toggle_modal()}}
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
      w-500
      color-black-2
    "
	>
  {profileTrs.profile?.crypto_title}
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
    {profileTrs.profile?.crypto_desc}
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
		on:click={() => {return connect_wallet_action()}}
	>
    <img
      src="{metamask_icon}"
      alt="metamask icon"
      class="m-r-16"
    />
		{profileTrs.profile?.connect_wallet_title} Metamask
	</button>
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
		text-align: -moz-center;
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
  button#sign-in-metamask-btn
  {
    width: -webkit-fill-available;
    width: -moz-available;
    border-radius: 60px;
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
  div#modal-delete-box.dark-background-1 button#sign-in-metamask-btn
  {
		border: 1px solid var(--dark-theme-1-2-shade) !important;
  }
</style>
