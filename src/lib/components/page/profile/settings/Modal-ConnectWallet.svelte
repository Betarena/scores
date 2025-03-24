<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Overview                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Code Format   // V.8.0                                                         │
│ ➤ Status        // 🔒 LOCKED                                                     │
│ ➤ Author(s)     // @migbash                                                      │
│ ➤ Maintainer(s) // @migbash                                                      │
│ ➤ Created on    // February 21st, 2023                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ BETARENA (Module) :: User Profile :: Account Settings Widget                     │
│ |: User Profile :: Account Settings Widget
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog, log_v3 } from '$lib/utils/debug';

	import metamask_icon from '../assets/metamask.svg';
	import wallet from '../assets/wallet.svg';

  import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  const
    /**
     * @description
     */
    dispatch = createEventDispatcher()
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  async function connectWallet
  (
  ): Promise < void >
  {
    // ╭─────
    // │ NOTE:
    // │ |: Detecting for 'mobile' devices
    // ╰─────
    // if (typeof screen.orientation !== 'undefined')
    // if (navigator?.userAgentData?.mobile)
    if (/Mobi/i.test(window.navigator.userAgent))
    {
      // ╭─────
      // │ NOTE:
      // │ |: Navigate to MetaMask in-app browser
      // ╰─────
      // await goto('https://metamask.app.link/dapp/scores.betarena.com/?dappLogin=true') // ✅ works
      // await goto('https://metamask.app.link/dapp/http://192.168.0.28:3050/') // ❌ does not work
      // await goto('https://metamask.app.link/dapp/192.168.0.28:3050/?dappLogin=true') // ❌ does not work
      window.open
      (
        `https://metamask.app.link/dapp/${$page.url.host}?metmaskAuth=true`,
        '_self'
      );

      dispatch('toggle_delete_modal');

      return
    }

    // ╭─────
    // │ NOTE:
    // │ |: Restrict only to MetaMask (original)
    // ╰─────
    if (!providerDetect('isMetaMask')[0])
    {
      // [🐞]
      dlog('🔴 Moralis Auth not found!');
      // [🐞]
      alert('Please install the MetaMask Wallet Extension!');

      dispatch('toggle_delete_modal');

      return
    }

    const
      /**
       * @description
       * 📝 List of 'web3' accounts detected
       */
      listWeb3Accounts: any[]
        = await window.ethereum.request
        (
          {
            method: 'eth_requestAccounts'
          }
        )
    ;

    dispatch
    (
      'connect_wallet_action',
      {
        wallet_id: listWeb3Accounts[0]
      }
    );

    return;
  }

  function providerDetect
  (
    walletType:
      | 'isMetaMask'
      | 'isCoinbaseWallet'
      | 'isBraveWallet'
  ): [boolean, any]
  {
    // ╭─────
    // │ NOTE:
    // │ |: Detecting for NO Ethereum Wallet
    // ╰─────
    if (!window.ethereum)
    // throw new Error("No injected ethereum object.");
      return [false, null];
    ;

    let
      /**
       * @description
       * 📝 Default provider (single) assign
       */
      target_wallet = undefined
    ;

    // ╭─────
    // │ CHECK:
    // │ |: for multiple 'wallet' providers detected
    // ╰─────
    if (Array.isArray(window.ethereum.providers))
    {
      if (walletType == 'isMetaMask')
        target_wallet
          = window.ethereum.providers.find
          (
            (provider) =>
            {
              return provider[walletType]
              && provider?.isBraveWallet == undefined
            }
          )
        ;
      ;
      // ╭─────
      // │ NOTE:
      // │ |: Alternative
      // ╰─────
      // else
      // {
      //   target_wallet = window.ethereum.providers.find((provider) => provider[walletType])
      // }

      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 [checkpoint] :: Modal-ConnectWallet.svelte ➤ providerDetect(..) // INSIGHT',
          msgs:
          [
            `🔵 More than 1 provider identified! ${window.ethereum.providers.length}`,
            `target_wallet ${target_wallet}`,
            `window.ethereum.providers ${window.ethereum.providers}`
          ]
        }
      );
    }
    else
    {
      if
      (
        walletType == 'isMetaMask'
        && window.ethereum?.isBraveWallet == undefined
        && window.ethereum?.isMetaMask != undefined
        && window.ethereum?.isMetaMask
      )
        target_wallet = window.ethereum[walletType];
      ;
      // ╭─────
      // │ NOTE:
      // │ |: Alternative
      // ╰─────
      // else
      // {
      //   target_wallet = window.ethereum[walletType]
      // }

      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 [checkpoint] :: Modal-ConnectWallet.svelte ➤ providerDetect(..) // INSIGHT',
          msgs:
          [
            `🔵 1 provider identified! ${window.ethereum}`,
            `target_wallet ${target_wallet}`,
            `window.ethereum ${window.ethereum}`
          ]
        }
      );
    }

    // ╭─────
    // │ CHECK:
    // │ |: for 'target' wallet identified
    // ╰─────
    if (target_wallet != undefined)
    {
      // ╭─────
      // │ NOTE:
      // │ |: conflicting use of CoinBaseWallet & MetaMask
      // │ |: setting MetaMask as main wallet
      // │ IMPORTANT
      // │ |: causes issues with FireFox
      // ┣─────
      // │ |: DOC: https://stackoverflow.com/questions/69377437/metamask-conflicting-with-coinbase-wallet
      // │ |: DOC: https://stackoverflow.com/questions/72613011/whenever-i-click-on-connect-metamask-button-why-it-connects-the-coinbase-wallet
      // │ |: DOC: https://stackoverflow.com/questions/68023651/how-to-connect-to-either-metamask-or-coinbase-wallet
      // │ |: DOC: https://github.com/MetaMask/metamask-extension/issues/13622
      // │ |: DOC: https://stackoverflow.com/questions/69377437/metamask-conflicting-with-coinbase-wallet
      // ╰─────
      // target_wallet.request({ method: 'eth_requestAccounts' });
      // ╭─────
      // │ NOTE:
      // │ |: Not working
      // ╰─────
      // window.ethereum.setSelectedProvider(target_wallet);
      // window.ethereum.request
      // (
      //  {
      //    method: 'wallet_requestPermissions',
      //    params: [{ eth_accounts: {}}]
      //  }
      // );

      // [🐞]
      dlog(`${target_wallet} identified`);

      return [true, target_wallet];
    }
    else
    {
      // [🐞]
      dlog(`No ${target_wallet} identified`);

      return [false, null];
    }
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

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
		on:click=
    {
      () =>
      {
        dispatch('toggle_delete_modal');
        return;
      }
    }
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
		class=
    "
    btn-hollow
    w-500
    s-14
    color-black-2
    "
		on:click=
    {
      () =>
      {
        connectWallet();
        return;
      }
    }
	>
    <img
      src="{metamask_icon}"
      alt="metamask icon"
      class="m-r-16"
    />
		{profileTrs.profile?.connect_wallet_title} Metamask
	</button>
</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

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
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
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
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
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
