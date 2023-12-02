<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5';
	import { BigNumber, ethers, type ContractInterface, type Transaction } from 'ethers';
  // read-more :|: https://www.npmjs.com/package/web3modal

  import { get, post } from '$lib/api/utils.js';
  import { dlogv2 } from '$lib/utils/debug.js';
  import { shortenWeb3WalletAddress, toDecimalFix, viewport_change } from '$lib/utils/platform-functions.js';
  import { passByValue } from '@betarena/scores-lib/dist/functions/func.common.js';
  import { tryCatchAsync } from '@betarena/scores-lib/dist/util/util.common.js';

  import icon_arrow_down_dark from '../assets/common/arrow-down-dark.svg';
  import icon_arrow_down from '../assets/common/arrow-down.svg';
  import icon_arrow_right_dark from '../assets/common/arrow-right-dark.svg';
  import icon_arrow_right from '../assets/common/arrow-right.svg';
  import icon_close_dark from '../assets/icon-close-dark.svg';
  import icon_close from '../assets/icon-close.svg';
  import icon_bronze from '../assets/price-tier/icon-bta-bronze.svg';
  import icon_gold from '../assets/price-tier/icon-bta-gold.svg';
  import icon_platinum from '../assets/price-tier/icon-bta-platinum.svg';
  import icon_silver from '../assets/price-tier/icon-bta-silver.svg';
  import icon_bta_token from '../assets/price-tier/icon-bta-token.svg';
  import icon_usdc from '../assets/price-tier/icon-usdc.png';
  import icon_usdt from '../assets/price-tier/icon-usdt.png';
  import betarenaBankContractABI from './web3/BetarenaBankABI.json';
  // read-more :|: https://mumbai.polygonscan.com/address/0x38eb8b22df3ae7fb21e92881151b365df14ba967#code
  // read-more :|: https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=0x38eb8b22df3ae7fb21e92881151b365df14ba967&format=raw
  import usdcContractAddressABI from './web3/UsdcABI.json';
  // read-more :|: https://mumbai.polygonscan.com/token/0x3813e82e6f7098b9583fc0f33a962d02018b6803#code
  import usdtContractAddressABI from './web3/UsdtABI.json';

  import ModalTermsAndConditions from './Modal-TermsAndConditions.svelte';

  import type { B_H_TH } from '@betarena/scores-lib/types/_HASURA_.js';
  import type { ICoinMarketCapDataMain } from '@betarena/scores-lib/types/_WEB3_.js';
  import type { B_PROF_T } from '@betarena/scores-lib/types/profile.js';
  import type { Web3Modal } from '@web3modal/ethers5/dist/types/src/client.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. export const / let [..]                                       ◼️
  // ### 2. const [..]                                                    ◼️
  // ### 3. let [..]                                                      ◼️
  // ### 4. $: [..]                                                       ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  // ### @see :|: https://stackoverflow.com/questions/72230897/how-to-call-a-smart-contract-function-with-walletconnect-react-js-node-js
  // ### @see :|: https://wiki.polygon.technology/docs/tools/wallets/walletconnect/

  interface ITierDiscount
  {
    /** @description tier discount name */
    name?: string,
    /** @description tier discount icon. */
    icon?: string,
    /** @description tier discount number. */
    discount?: number,
  }

  interface ICryptoDesposit
  {
    /** @description cryptocurrency full name */
    full_name: string;
    /** @description cryptocurrency symbol */
    name: string;
    /** @description cryptocurrency icon */
    icon: string;
    /** @description cryptocurrency address */
    contractAddress: string;
    /** @description cryptocurrency ABI */
    abi: unknown;
  }

  const
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'profile⮕w⮕investbox⮕main',
    // ◼️ IMPORTANT
    VIEWPORT_MOBILE_INIT = 575,
    VIEWPORT_TABLET_INIT = 1160,
    /** @description target `polygon` blockchain `BetarenaBank` polygon mumbai (testnet) */
    betarenaBankContractAddress: string = '0x5BC335e9c9492B8abb07B49a6dbD8269d7419F1D'
    /** @description target `polygon` blockchain `USDC` polygon mumbai (testnet) */
    , usdcContractAddress: string = '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23'
    /** @description target `polygon` blockchain `USDT` polygon mumbai (testnet) */
    , usdtContractAddress: string = '0x3813e82e6f7098b9583FC0F33a962D02018B6803'
    /** @description TODO: */
    // provider = EthereumProvider.init({ .. })
  ;

  let
    // ◼️ IMPORTANT
    isViewMobile: boolean = false
    , isViewTablet: boolean = false
    /** @description Profile Translation data. */
    , B_PROF_T: B_PROF_T
    /** @description Creating a Web3Modal with `WalletConnect`. */
    , modal: Web3Modal = createWeb3Modal
    (
      {
        // ▓ @see :> get projectId at https://cloud.walletconnect.com
        projectId: 'a523c408585b0f7c88a7df7a9d70dfe6'
        , ethersConfig: defaultConfig
        (
          {
            metadata:
            {
              name: 'My Website',
              description: 'My Website description',
              url: 'https://mywebsite.com',
              icons: ['https://avatars.mywebsite.com/']
            }
          }
        )
        , chains:
        [
          // {
          //   chainId: 1,
          //   name: 'Ethereum',
          //   currency: 'ETH',
          //   explorerUrl: 'https://etherscan.io',
          //   rpcUrl: 'https://cloudflare-eth.com'
          // },
          {
            chainId: 80001,
            name: 'Mumbai Testnet',
            currency: 'MATIC',
            explorerUrl: 'https://mumbai.polygonscan.com',
            rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/0zWtf5I24NBkM826G-VJFiYkkGoC5atJ'
          }
        ]
        , defaultChain:
        {
          chainId: 80001,
          name: 'Mumbai Testnet',
          currency: 'MATIC',
          explorerUrl: 'https://mumbai.polygonscan.com',
          rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/0zWtf5I24NBkM826G-VJFiYkkGoC5atJ'
        }
      }
    )
    /** @description wether user has triggered the `invest` action. */
    , triggerInvestBox: boolean = false
    /** @description prices of supported tokens. */
    , cryptoPrices: ICoinMarketCapDataMain
    /** @description target token price. */
    , cryptoPrice: number
    /** @description amount user wishes to `deposit`. */
    , depositAmount: number = 2500
    /** @description amount user wishes to `recieve`. */
    , recieveAmount: number = 2500
    /** @description target selected option by user. */
    , selectDepositOption: 'crypto' | 'fiat' = 'crypto'
    /** @description tier discount data object */
    , tierDiscountObject: ITierDiscount = { }
    /** @description terms&conditions checkbox */
    , agreeTermsAndConditions: boolean = false
    /** @description crypto deposit data object list */
    , cryptoDepositOptions: ICryptoDesposit[] =
    [
      {
        full_name: 'USD Coin',
        name: 'USDC',
        icon: icon_usdc,
        contractAddress: usdcContractAddress,
        abi: usdcContractAddressABI
      },
      {
        full_name: 'Tether',
        name: 'USDT',
        icon: icon_usdt,
        contractAddress: usdtContractAddress,
        abi: usdtContractAddressABI
      }
    ]
    /** @description crypto deposit data object list (search) */
    , cryptoDepositOptionsSearch: ICryptoDesposit[] = passByValue(cryptoDepositOptions)
    /** @description crypto deposit object selected */
    , cryptoDepositOptionSelect: ICryptoDesposit = cryptoDepositOptions?.[0]
    /** @description modal open select cryptocurrency option */
    , modalSelectCryptoOption: boolean = false
    /** @description modal open select cryptocurrency option */
    , walletAddress: string
    /** @description search text for target token */
    , tokenSearch: string
    /** @description interval for CoinMarketCap fetching */
    , interval1: NodeJS.Timer
  ;

  $: B_PROF_T = $page.data?.RESPONSE_PROFILE_DATA;
  $: deepReactListenSignerChange = undefined;

  modal.subscribeProvider
  (
    async (
      newProvider
    ): Promise < void > =>
    {
      // ### [🐞]
      dlogv2
      (
        `🚏 checkpoint [R] ➤ if_R_X12`,
        [
          newProvider,
          `🔹 [var] ➤ modal.getSigner() ${modal.getSigner()}`,
          `🔹 [var] ➤ modal.getAddress() ${modal.getAddress()}`,
        ],
        true
      );

      deepReactListenSignerChange = newProvider?.isConnected;
      walletAddress = modal?.getAddress();
      await switchUserNetwork();

      return;
    }
  );

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'methods' that are to be     ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. function (..)                                                 ◼️
  // ### 2. async function (..)                                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Search Token.
   * @returns { void }
   */
  function searchToken
  (
  ): void
  {
    // ▓ NOTE:
    // ▓ > reset data.
		cryptoDepositOptionsSearch = [];

    const _searchTarget: string = tokenSearch.toLowerCase();

		// ▓ CHECK
    // ▓ > for matching token names.
		for (const item of cryptoDepositOptions ?? [])
    {
      // ▓ NOTE:
      // ▓ > search by: (1) shortname, (2) fullname, (3) contract-address;
      const if_M_0: boolean =
        item?.name?.toLowerCase().includes(_searchTarget)
        || item?.full_name?.toLowerCase().includes(_searchTarget)
        || item?.contractAddress?.toLowerCase().includes(_searchTarget)
      ;

      if (if_M_0) cryptoDepositOptionsSearch.push(item);
		}

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Promots user `network` switch.
   * @returns { void }
   */
  async function switchUserNetwork
  (
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ) : Promise < void > =>
      {
        return await window.ethereum.request
        (
          {
            method: "wallet_addEthereumChain",
            params:
            [
              {
                chainId: "0x13881",
                chainName: "Mumbai Testnet",
                rpcUrls: ["https://polygon-mumbai.g.alchemy.com/v2/0zWtf5I24NBkM826G-VJFiYkkGoC5atJ"],
                nativeCurrency:
                {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://mumbai.polygonscan.com"],
              },
            ],
          }
        )
      }
      , (
        ex: unknown
      ): void =>
      {
        console.error(`💀 Unhandled :: ${ex}`);

        return;
      }
    );

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Toggle (connect/disconnect) `web3` wallet connection.
   * @returns { Promise < void > }
   */
  async function connectWallet
  (
  ): Promise < void >
  {
    if (!browser) return;

    // ▓ CHECK
    // ▓ > for (1) existing signer + (2) not a 'Buy BTA' action;
    // ▓ NOTE:
    // ▓ > web3 disconnect + exit;
    if (deepReactListenSignerChange && !triggerInvestBox)
    {
      await modal.disconnect();
      return;
    }

    await modal.open({ view: 'Connect' });

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Initialize deposit action.
   * @returns { Promise < void > }
   */
  async function executeDeposit
  (
  ): Promise < void >
  {
    if (!browser) return;

    triggerInvestBox = true;

    if (!deepReactListenSignerChange)
      await connectWallet();
    ;

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Interact with `deployed` contract and perform `deposit` logic.
   * @returns { Promise < void > }
  */
  async function executeContract
  (
  ): Promise < void >
  {
    if (!browser) return;

    // ▓ [🐞]
    console.log('📣', modal.getSigner());
    // ▓ [🐞]
    console.log('📣', modal.getIsConnected());

    await switchUserNetwork();

    let
      errors: boolean = false
      , targetDecimals: number
      , targetAmount: BigNumber
    ;

    // @see :> https://docs.alchemy.com/reference/error-reference

    // ▓ NOTE:
    // ▓ > execute `.approve(..)` logic for `allowance` for `ERC20` tokens.
    // ▓ > prior to effectuating a `deposit`/`transfer` of funds.
    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        const
          contract = new ethers.Contract
          (
            cryptoDepositOptionSelect?.contractAddress,
            cryptoDepositOptionSelect?.abi as ContractInterface,
            modal.getSigner(),
          )
        ;

        targetDecimals = await contract?.decimals();
        targetAmount = ethers.utils.parseUnits(depositAmount?.toString(), targetDecimals);

        const transactionResponse: Transaction = await contract?.approve(betarenaBankContractAddress, targetAmount);

        // ▓ [🐞]
        dlogv2
        (
          ``
          , [
            `targetDecimals ${targetDecimals}`,
            `targetAmount ${targetAmount}`,
            `transactionResponse ${transactionResponse}`
          ]
        );

        return;
      }
      ,
      (
        ex: unknown
      ): void =>
      {
        errors = true;

        // ▓ [🐞]
        if (ex?.toString()?.includes('ACTION_REJECTED'))
          console.info('📣 The user has rejected the transaction.');
        else if (ex?.toString()?.includes('Error: Internal JSON-RPC error.'))
          // ▓ see :> https://support.metamask.io/hc/en-us/articles/360059289871-Error-Internal-JSON-RPC-error-when-trying-to-interact-with-other-networks
          console.info('❌ Something is not right, please recheck everything again.');
        else if (ex?.toString()?.includes('code=CALL_EXCEPTION'))
          console.info('❌ ERR :: Incorrect selected chain by client/user');
        else
          console.error(`💀 Unhandled :: ${ex}`);

        return;
      }
    );

    // ▓ CHECK
    // ▓ > for errors registered.
    if (errors)
    {
      triggerInvestBox = false;
      return;
    }

    // ▓ NOTE:
    // ▓ > execute `.depositTokens(..)` on the target `SmartContract`.
    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        const
          contract = new ethers.Contract
          (
            betarenaBankContractAddress,
            betarenaBankContractABI,
            modal.getSigner()
          ),
          transactionResponse: Transaction = await contract?.depositToken(cryptoDepositOptionSelect?.contractAddress, targetAmount);
        ;

        // ▓ [🐞]
        console.log('transactionResponse', transactionResponse);

        return;
      }
      ,
      (
        ex: unknown
      ): void =>
      {
        errors = true;

        if (ex?.toString()?.includes('ERC20: transfer amount exceeds allowance'))
          // ▓ [🐞]
          console.info('❌ Invalid ERC20 allowance amount.');
        else if (ex?.toString()?.includes('Error: Internal JSON-RPC error.'))
          // ▓ [🐞]
          console.info('❌ Incorrect Network Selected.');
        else if (ex?.toString()?.includes('code=CALL_EXCEPTION'))
          console.info('❌ ERR :: Incorrect selected chain by client/user');
        else
          // ▓ [🐞]
          console.error(`💀 Unhandled :: ${ex}`);

        return;
      }
    );

    // ▓ CHECK
    // ▓ > for errors registered.
    if (errors)
    {
      triggerInvestBox = false;
      return;
    }

    // ▓ NOTE:
    // ▓ > send data for completed user transaction to DB.
    const txDepositData: B_H_TH =
    {
      uid: $userBetarenaSettings?.user?.firebase_user_data?.uid,
      // date: new Date().toISOString(),
      wallet_address_erc20: walletAddress,
      asset: cryptoDepositOptionSelect?.name,
      amount: depositAmount,
      quantity: recieveAmount,
      Gateway: 'cryptocurrency',
      description: 'BTA Deposit Request',
      type: 'deposit',
      bta_price: 1,
      deposit_wallet_address:
      {
        type: 'Polygon',
        address: walletAddress
      }
    };

    // ▓ [🐞]
    console.debug
    (
      `🔹 [var] txDepositData ${JSON.stringify(txDepositData)}`
    );

    await post
    (
      '/api/data/profile',
      txDepositData
    );

    triggerInvestBox = false;

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### WARNING:                                                         ◼️
  // ### ❗️ Can go out of control.                                        ◼️
  // ### (a.k.a cause infinite loops and/or cause bottlenecks).           ◼️
  // ### Please keep very close attention to these methods and            ◼️
  // ### use them carefully.                                              ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description TODO:
  */
  $:
  if (browser && deepReactListenSignerChange && triggerInvestBox)
  {
    // ### [🐞]
    dlogv2
    (
      `🚏 checkpoint [R] ➤ if_R_X20`,
      [
        `🔹 [var] ➤ deepReactListenSignerChange ${deepReactListenSignerChange}`,
        `🔹 [var] ➤ triggerInvestBox ${triggerInvestBox}`,
      ],
      true
    );

    executeContract();
  }

  /**
   * @description TODO:
  */
  $:
  if (depositAmount >= 100000)
  {
    tierDiscountObject.name = 'Platinum';
    tierDiscountObject.icon = icon_platinum;
    tierDiscountObject.discount = 50;
  }
  else if (depositAmount >= 50000)
  {
    tierDiscountObject.name = 'Gold';
    tierDiscountObject.icon = icon_gold;
    tierDiscountObject.discount = 40;
  }
  else if (depositAmount >= 20000)
  {
    tierDiscountObject.name = 'Silver';
    tierDiscountObject.icon = icon_silver;
    tierDiscountObject.discount = 30;
  }
  else if (depositAmount >= 2500)
  {
    tierDiscountObject.name = 'Bronze';
    tierDiscountObject.icon = icon_bronze;
    tierDiscountObject.discount = 20;
  }
  else if (depositAmount < 2500)
  {
    tierDiscountObject.name = null;
    tierDiscountObject.icon = null;
    tierDiscountObject.discount = 0;
  }

  /**
   * @description TODO:
  */
  $:
  {
    // ▓ NOTE:
    // ▓ > relation between (1) deposit, (2) exchange price, (3) discount to obtain recieveAmount.
    recieveAmount = parseFloat(toDecimalFix(depositAmount * cryptoPrice * (1 + (tierDiscountObject.discount / 100)), 2));
  }

  /**
   * @description TODO:
  */
  $: if (tokenSearch)
  {
    // ### [🐞]
    dlogv2
    (
      `🚏 checkpoint [R] ➤ if_R_X2234`,
      [
        `🔹 [var] ➤ tokenSearch ${tokenSearch}`,
      ],
      true
    );

    searchToken();
  }
  else if (tokenSearch == '' || tokenSearch == undefined)
  {
    cryptoDepositOptionsSearch = passByValue(cryptoDepositOptions);
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    async (
    ) =>
    {
      cryptoPrices = await get
      (
        `/api/coinmarketcap?tickers=USDT,USDC`,
        null,
        true,
        true
      ) as ICoinMarketCapDataMain;

      cryptoPrice = parseFloat(toDecimalFix(cryptoPrices?.data?.[cryptoDepositOptionSelect?.name]?.quote?.USD?.price, 3, true, false)) ?? 0;

      interval1 = setInterval
      (
        async (
        ): Promise < void > =>
        {
          cryptoPrices = await get
          (
            `/api/coinmarketcap?tickers=USDT,USDC`,
            null,
            true,
            true
          ) as ICoinMarketCapDataMain;

          cryptoPrice = parseFloat(toDecimalFix(cryptoPrices?.data?.[cryptoDepositOptionSelect?.name]?.quote?.USD?.price, 3, true, false)) ?? 0;
        }
        ,
        30000
      );

      [
        isViewTablet,
        isViewMobile
      ] = viewport_change
      (
        VIEWPORT_TABLET_INIT,
        VIEWPORT_MOBILE_INIT
      );

      window.addEventListener
      (
        'resize',
        function ()
        {
          [
            isViewTablet,
            isViewMobile
          ] =
          viewport_change
          (
            VIEWPORT_TABLET_INIT,
            VIEWPORT_MOBILE_INIT
          );
        }
      );

    }
  );

  onDestroy
  (
    () =>
    {
      // @ts-expect-error
      clearInterval(interval1);
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class=styles                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<ModalTermsAndConditions />

<form
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  on:submit|preventDefault={() => executeDeposit()}
>

  <!--
  ▓ NOTE:
  ▓ > Top Box (Outer)
  -->
  <div
    id="{CNAME}⮕top-row"
  >

    <!--
    ▓ NOTE:
    ▓ > Top Row
    -->
    <div
      class=
      "
      row-space-out
      "
    >

      <!--
      ▓ NOTE:
      ▓ > widget title
      -->
      <p
        class=
        "
        s-24
        w-500
        color-black-2
        "
      >
        Invest Box
      </p>

      <!--
      ▓ NOTE:
      ▓ > Connect Wallet.
      -->
      <button
        type="button"
        class=
        "
        btn-dark
        w-500
        row-space-start
        width-auto
        "
        on:click={() => connectWallet()}
      >
        <p
          class=
          "
          s-14
          color-black-2
          m-r-6
          "
        >
          {shortenWeb3WalletAddress(walletAddress) ?? 'Connect your wallet'}
        </p>

        {#if !walletAddress}
          <img
            id=''
            src={$userBetarenaSettings.theme == 'Dark' ? icon_arrow_right_dark : icon_arrow_right}
            alt=''
            title=''
            loading='lazy'
            width=16
            height=16
          />
        {/if}
      </button>

    </div>

    <!--
    ▓ NOTE:
    ▓ > Investment Options TEXT.
    -->
    <p
      class=
      "
      s-14
      color-grey
      dark-white-v3
      m-t-15
      "
    >
      Investment options
    </p>

    <!--
    ▓ NOTE:
    ▓ > Deposit Method.
    -->
    <div
      class=
      "
      m-t-20
      row-space-out
      "
    >

      <!--
      ▓ NOTE:
      ▓ > Crypto Deposit OPTION.
      -->
      <button
        type="button"
        class=
        "
        btn-hollow
          v4
          v3d
        width-100
        color-black-2
        m-r-12
        w-500
        s-14
        "
        class:btn-active={selectDepositOption == 'crypto'}
        on:click={() => selectDepositOption = 'crypto'}
      >
        Crypto
      </button>

      <!--
      ▓ NOTE:
      ▓ > Fiat Deposit OPTION.
      -->
      <a
        href="https://buy.stripe.com/7sIeWc72V8Hw33WbIM?client_reference_id=${$userBetarenaSettings?.user?.firebase_user_data?.uid}"
        target="_blank"
        class=
        "
        width-100
        "
      >
        <button
          type="button"
          class=
          "
          btn-hollow
            v4
            v3d
          width-100
          color-black-2
          w-500
          s-14
          "
          class:btn-active={selectDepositOption == 'fiat'}
          on:click={() => selectDepositOption = 'fiat'}
        >
          Fiat
        </button>
      </a>

    </div>

    <!--
    ▓ NOTE:
    ▓ > Terms & Conditions BOX.
    -->
    <div
      class=
      "
      m-t-20
      row-space-start
      "
    >

      <!--
      ▓ NOTE:
      ▓ > Terms & Conditions INPUT.
      -->
      <input
        id=""
        name=""
        type="checkbox"
        class=
        "
        v-1
        m-r-12
        cursor-pointer
        "
        required
        bind:value={agreeTermsAndConditions}
      />

      <!--
      ▓ NOTE:
      ▓ > Terms & Conditions TEXT.
      -->
      <p
        class=
        "
        s-16
        color-grey
          grey-v1
        "
        on:click={() => $sessionStore.showTermsAndConditions = true}
      >
        I have read the

        <span
          class=
          "
          w-500
          color-black-2
          underline
          cursor-pointer
          "
          on:click={() => alert('clicked terms and conditions')}
        >
          terms
        </span>
        and
        <span
          class=
          "
          w-500
          color-black-2
          underline
          cursor-pointer
          "
          on:click={() => alert('clicked terms and conditions')}
        >
          disclaimers.
        </span>

      </p>

    </div>

  </div>

  <!--
  ▓ NOTE:
  ▓ > Middle Box (Outer)
  -->
  <div
    id="{CNAME}⮕middle-row"
  >

    <!--
    ▓ NOTE:
    ▓ > Deposit Amount
    -->
    <div
      class=
      "
      input-box
      "
    >

      <!--
      ▓ NOTE:
      ▓ > Deposit Amount BOX
      -->
      <div>

        <!--
        ▓ NOTE:
        ▓ > Deposit amount TITLE.
        -->
        <p
          class=
          "
          s-16
          w-500
          color-black-2
          m-b-5
          "
        >
          Deposit Amount
        </p>

        <!--
        ▓ NOTE:
        ▓ > Deposit amount initial.
        -->
        <p
          class=
          "
          s-12
          color-grey
          "
        >
          First Minimum Deposit
          <span
            class=
            "
            color-black-2
            w-500
            "
          >
            $2500
          </span>
          / Max. Deposit
          <span
            class=
            "
            color-black-2
            w-500
            "
          >
            ∞
          </span>
        </p>

      </div>

      <!--
      ▓ NOTE:
      ▓ > Deposit Box.
      -->
      <div
        class=
        "
        row-space-out
        "
      >

        <!--
        ▓ NOTE:
        ▓ > Deposit Box.
        -->
        <div>

          <!--
          ▓ NOTE:
          ▓ > Deposit amount INPUT.
          -->
          <input
            type="number"
            step="any"
            placeholder=0
            class=
            "
            s-20
            color-black-2
            amount-input
            w-500
            "
            required
            bind:value={depositAmount}
          />

          <!--
          ▓ NOTE:
          ▓ > Conversion Rate.
          -->
          <p
            class=
            "
            s-12
            color-grey
            m-t-5
            "
          >
            <!-- ▓ [🐞] -->
            <!-- {console.log(cryptoPrices?.data?.['USDC']?.quote?.USD?.price)} -->
            {depositAmount ?? 0} {cryptoDepositOptionSelect?.name} ≈ {cryptoPrice ?? '-'} $
          </p>

        </div>

        <!--
        ▓ NOTE:
        ▓ > Token.
        -->
        <div
          class=
          "
          row-space-start
          width-auto
          cursor-pointer
          "
          on:click={() => modalSelectCryptoOption = true}
        >

          <!--
          ▓ NOTE:
          ▓ > Token Asset Icon.
          -->
          <img
            id=''
            src={cryptoDepositOptionSelect?.icon}
            alt={cryptoDepositOptionSelect?.name}
            title={cryptoDepositOptionSelect?.name}
            loading='lazy'
            width=20
            height=20
            class=
            "
            m-r-6
            "
          />

          <!--
          ▓ NOTE:
          ▓ > Token Asset Name.
          -->
          <p
            class=
            "
            s-15
            w-500
            color-black-2
            m-r-6
            "
          >
            {cryptoDepositOptionSelect?.name}
          </p>

          <img
            id=''
            src={$userBetarenaSettings.theme == 'Dark' ? icon_arrow_down_dark : icon_arrow_down}
            alt=''
            title=''
            loading='lazy'
            width=16
            height=16
          />

        </div>

      </div>

    </div>

    <!--
    ▓ NOTE:
    ▓ > Recieve Amount
    -->
    <div
      class=
      "
      input-box
      "
    >

      <!--
      ▓ NOTE:
      ▓ > Recieve amount TITLE.
      -->
      <p
        class=
        "
        s-16
        w-500
        color-black-2
        m-b-5
        "
      >
        You will recieve
      </p>

      <!--
      ▓ NOTE:
      ▓ > Recieve Box.
      -->
      <div
        class=
        "
        row-space-out
        "
      >

        <!--
        ▓ NOTE:
        ▓ > Recieve amount BOX.
        -->
        <div
        >

          <!--
          ▓ NOTE:
          ▓ > Recieve amount INPUT.
          -->
          <input
            type="number"
            step="any"
            placeholder=0
            class=
            "
            s-20
            amount-input
            color-black-2
            w-500
            "
            required
            bind:value={recieveAmount}
          />

          <!--
          ▓ NOTE:
          ▓ > Conversion Rate.
          -->
          <p
            class=
            "
            s-12
            color-grey
            m-t-5
            "
          >
            1 {cryptoDepositOptionSelect?.name} ≈ 1.00 BTA
          </p>

        </div>

        <!--
        ▓ NOTE:
        ▓ > BTA Token.
        -->
        <div
          class=
          "
          row-space-start
          width-auto
          "
        >
          <!--
          ▓ NOTE:
          ▓ > BTA Asset.
          -->
          <img
            id=''
            src={icon_bta_token}
            alt=''
            title=''
            loading='lazy'
            width=20
            height=20
            class=
            "
            m-r-6
            "
          />

          <!--
          ▓ NOTE:
          ▓ > BTA Token NAME.
          -->
          <p
            class=
            "
            s-15
            w-500
            color-black-2
            "
          >
            BTA
          </p>

        </div>

      </div>

    </div>

    <!--
    ▓ NOTE:
    ▓ > Current Tier Discount
    -->
    {#if tierDiscountObject?.name}

      <div
        id="tier-box"
        style=
        "
        {isViewMobile ? 'justify-content: space-between;' : ''}
        "
        class:row-space-out={!isViewMobile}
        class:column-space-start={isViewMobile}
      >
        <!--
        ▓ NOTE:
        ▓ > current tier TEXT.
        -->
        <p
          class=
          "
          s-16
          w-500
          color-black-2
          no-wrap
          "
        >
          Current Tier Discount
        </p>

        <!--
        ▓ NOTE:
        ▓ > tier SUB-BOX.
        -->
        <div
          class=
          "
          {!isViewMobile ? 'row-space-start width-auto' : 'row-space-out'}
          "
        >

          <!--
          ▓ NOTE:
          ▓ > current tier SUB-BOX.
          -->
          <div
            class=
            "
            row-space-start
            width-auto
            m-r-20
            "
          >

            <!--
            ▓ NOTE:
            ▓ > current tier discount icon IMG.
            -->
            <img
              id=''
              src={tierDiscountObject?.icon}
              alt={tierDiscountObject?.icon}
              title='Discount Tier Asset'
              loading='lazy'
              width=24
              height=24
              class=
              "
              m-r-8
              "
            />

            <!--
            ▓ NOTE:
            ▓ > current tier discount name TEXT.
            -->
            <p
              class=
              "
              s-16
              w-500
              color-black-2
              "
            >
              {tierDiscountObject?.name}
            </p>

          </div>

          <!--
          ▓ NOTE:
          ▓ > current tier discount amount NUMBER.
          -->
          <p
            class=
            "
            s-15
            w-500
            color-black-2
            "
          >
            {tierDiscountObject?.discount ?? 0}%
          </p>

        </div>

      </div>

    {/if}

    <!--
    ▓ NOTE:
    ▓ > Execute Deposit Button
    -->
    <button
      type="submit"
      form="{CNAME}"
      class=
      "
      btn-primary-v2
      width-100
      m-t-15
      w-500
      s-14
      "
    >
      Buy BTA
    </button>

  </div>

  <!--
  ▓ NOTE:
  ▓ > Cryptocurrency Deposit Option Select (Outer)
  -->
  {#if modalSelectCryptoOption}

    <!--
    ▓ NOTE:
    ▓ > Cryptocurrency Background
    -->
    <div
      id="{CNAME}⮕modal-bg-blur"
      in:fade
      on:click={() => modalSelectCryptoOption = false}
    />

    <!--
    ▓ NOTE:
    ▓ > Cryptocurrency Select
    -->
    <div
      id="select-cryptocurrency"
      in:fly={{ y: 500, duration: 500 }}
      out:fly={{ y: 500, duration: 500 }}
    >

      <!--
      ▓ NOTE:
      ▓ > Select token TITLE.
      -->
      <div
        id="top-box"
      >

        <!--
        ▓ NOTE:
        ▓ > Select token TITLE.
        -->
        <p
          class=
          "
          s-20
          w-500
          color-black-2
          m-b-20
          "
        >
          {'Select Crypto Currency'}
        </p>

        <!--
        ▓ NOTE:
        ▓ > Close vector.
        -->
        <img
          id="close-vector"
          src={$userBetarenaSettings.theme == 'Dark' ? icon_close_dark : icon_close}
          alt="close-svg"
          class=
          "
          cursor-pointer
          "
          on:click={() => modalSelectCryptoOption = false}
          width=14
          height=14
        />

        <!--
        ▓ NOTE:
        ▓ > Execute Deposit Button
        -->
        <input
          id="token-search"
          placeholder="Search"
          type="text"
          class=
          "
          s-14
          color-black-2
          "
          required
          bind:value={tokenSearch}
        />

      </div>

      <!--
      ▓ NOTE:
      ▓ > Available ERC-20 options.
      -->
      <div
        id="token-list"
      >
        {#each cryptoDepositOptionsSearch ?? [] as item}

          <!--
          ▓ NOTE:
          ▓ > Token Row BOX.
          -->
          <div
            class=
            "
            row-space-start
            cursor-pointer
            ▓
            token-row
            "
            style=
            "
            align-items: flex-start;
            "
            on:click={() => cryptoDepositOptionSelect = item}
            on:click={() => modalSelectCryptoOption = false}
          >

            <!--
            ▓ NOTE:
            ▓ > Token Icon.
            -->
            <img
              id=''
              src={item?.icon}
              alt=''
              title=''
              loading='lazy'
              width=24
              height=24
              class=
              "
              m-r-12
              "
            />

            <!--
            ▓ NOTE:
            ▓ > Token Icon.
            -->
            <p
              class=
              "
              s-14
              color-black-2
              no-wrap
              ▓
              token-text
              "
            >
              {item?.name ?? ''}

              <br/>

              <span
                class=
                "
                s-12
                color-grey
                  grey-v1
                no-wrap
                "
              >
                {item?.full_name ?? ''}
              </span>
            </p>

          </div>

        {/each}
      </div>

    </div>

  {/if}

</form>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>

  #profile⮕w⮕investbox⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    border-radius: 12px;
    overflow: hidden;
  }

  div#profile⮕w⮕investbox⮕main⮕top-row
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    padding: 20px;
    padding-top: 24px;
    background: var(--white);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    /* z-index: 10; */
  }

  button.btn-hollow.btn-active
  {
    /* 🎨 style */
    border: 1px solid var(--primary) !important;
    background: rgba(245, 98, 15, 0.08);
  }

  input[type=checkbox]
  {
    /* 🎨 style */
    border: none;
    border-radius: 50px;
  }

  div#profile⮕w⮕investbox⮕main⮕middle-row
  {
    /* 🎨 style */
    padding: 20px;
    padding-bottom: 32px;
    background: var(--white);
    display: grid;
    gap: 12px;
  }

  div#profile⮕w⮕investbox⮕main⮕tier-box
  {
    /* 🎨 style */
    border-radius: 12px;
  }

  div.input-box
  {
    /* 🎨 style */
    padding: 20px;
    border-radius: 12px;
    background-color: var(--whitev2);
    min-height: 154px;
    max-height: 154px;
    display: grid;
    align-content: space-between;

  }

  div#tier-box
  {
    /* 🎨 style */
    border-radius: 12px;
    min-height: 104px;
    max-height: 104px;
    padding: 20px;
    background-color: var(--whitev2);
  }

  input.amount-input
  {
    /* 🎨 style */
    padding: 0;
    margin: 0;
    border: none;
    width: fit-content;
    max-width: 150px;
    height: fit-content;
  }
  /* Chrome, Safari, Edge, Opera */
  input[type=number].amount-input::-webkit-inner-spin-button,
  input[type=number].amount-input::-webkit-outer-spin-button
  {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type=number].amount-input
  {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  div#select-cryptocurrency
  {
    /* 📌 position */
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    /* 🎨 style */
    border-radius: 12px;
    background: var(--white);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding-bottom: 10px;
  }

  div#select-cryptocurrency div#top-box
  {
    /* 🎨 style */
    padding: 20px;
    padding-bottom: 12px;
  }

  img#close-vector
  {
		/* 📌 position */
		position: absolute;
		top: 20px;
		right: 20px;
		z-index: 400000002;
	}

  /*
  token search input
  */
  div#select-cryptocurrency input#token-search
  {
    /* 🎨 style */
    background-image: url('/assets/svg/league_list/search.svg');
		background-repeat: no-repeat;
		background-position: 15px 50%;
		background-size: 20px 20px;
		padding: 12px 52px 12px 40px;
    background-color: var(--white-3);
		border: 1px solid transparent;
	}
	div#select-cryptocurrency input#token-search:hover
  {
    /* 🎨 style */
		border: 1px solid #8c8c8c;
	}
	div#select-cryptocurrency input#token-search:focus
  {
    /* 🎨 style */
		border: 1px solid #4b4b4b;
	}
	div#select-cryptocurrency input#token-search[placeholder]
  {
    /* 🎨 style */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

  /*
  token list
  */
  div#select-cryptocurrency div#token-list
  {
    /* 🎨 style */
    display: grid;
  }
  div#select-cryptocurrency div#token-list div.token-row
  {
    /* 🎨 style */
    padding: 8px 20px;
    min-height: 53px;
    max-height: 53px;
  }
  div#select-cryptocurrency div#token-list div.token-row:hover
  {
    /* 🎨 style */

    background-color: var(--white-3);
  }
  div#select-cryptocurrency div#token-list div.token-row p.token-text
  {
    /* 🎨 style */
    position: relative;
  }
  div#select-cryptocurrency div#token-list div.token-row p.token-text span
  {
    /* 🎨 style */
    position: absolute;
  }

  div#profile⮕w⮕investbox⮕main⮕modal-bg-blur
  {
		/* 📌 position */
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 0;
		/* 🎨 style */
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS       ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media screen
  and (min-width: 575px)
  {
    div#tier-box
    {
      /* 🎨 style */
      min-height: 64px;
      max-height: 64px;
    }
  }

  @media screen
  and (min-width: 1160px)
  {
    div#select-cryptocurrency
    {
      /* 📌 position */
      position: absolute;
    }
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  #profile⮕w⮕investbox⮕main.dark-background-1 div#profile⮕w⮕investbox⮕main⮕top-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

  #profile⮕w⮕investbox⮕main.dark-background-1 div#profile⮕w⮕investbox⮕main⮕middle-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade);
  }

  #profile⮕w⮕investbox⮕main.dark-background-1 div.input-box,
  #profile⮕w⮕investbox⮕main.dark-background-1 div#tier-box
  {
    /* 🎨 style */
    background-color: var(--dark-theme);
  }

  #profile⮕w⮕investbox⮕main.dark-background-1 div#select-cryptocurrency
  {
    /* 🎨 style */
    background: var(--dark-theme-1-4-shade) !important;
  }

  /* token search input */
  #profile⮕w⮕investbox⮕main.dark-background-1 div#select-cryptocurrency input#token-search
  {
    /* 🎨 style */
		background-color: var(--dark-theme-1) !important;
		border: 1px solid transparent;
		color: white;
	}
	#profile⮕w⮕investbox⮕main.dark-background-1 div#select-cryptocurrency input#token-search:hover
  {
    /* 🎨 style */
		border: 1px solid var(--dark-theme-1-2-shade);
	}
	#profile⮕w⮕investbox⮕main.dark-background-1 div#select-cryptocurrency input#token-search:focus
  {
    /* 🎨 style */
		border: 1px solid var(--grey-shade);
		background-image: url('/assets/svg/league_list/search-white.svg');
	}

  /* token row */
  #profile⮕w⮕investbox⮕main.dark-background-1 div#token-list div.token-row:hover
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

</style>
