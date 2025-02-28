<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ High Order Component Overview                                                    │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Version Svelte Format :|: V.8.0 [locked]                                       │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
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

  // 🔗 read-more :|: https://www.npmjs.com/package/web3modal
  // 🔗 read-more :|: https://mumbai.polygonscan.com/address/0x38eb8b22df3ae7fb21e92881151b365df14ba967#code
  // 🔗 read-more :|: https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=0x38eb8b22df3ae7fb21e928811
  //                  51b365df14ba967&format=raw
  // 🔗 read-more :|: https://mumbai.polygonscan.com/token/0x3813e82e6f7098b9583fc0f33a962d02018b6803#code

  import { browser, dev } from '$app/environment';
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import { fly } from 'svelte/transition';

	import { get, postv2 } from '$lib/api/utils.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog, dlogv2 } from '$lib/utils/debug.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';
  import { sleep } from '$lib/utils/miscellenous.js';
  import { toDecimalFix } from '$lib/utils/string.js';
	import { chainObject, chainObjectWalletConnect } from '$lib/utils/web3.js';
	import { passByValue } from '@betarena/scores-lib/dist/util/common.js';
	import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
	import { scoresProfileInvestorStore } from './_store.js';
	import { shortenWeb3WalletAddress } from '$lib/utils/string.js';
	import { polygonMainnet } from './web3/_constants.js';

	import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5';
	import { BigNumber, ethers, type ContractInterface, type Transaction } from 'ethers';

  import icon_checkbox from '../assets/checkbox.svg';
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

  import ModalTermsAndConditions from './Modal-TermsAndConditions.svelte';
  import ModalTxState from './Modal-Tx-State.svelte';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import ModalBackdrop from '$lib/components/misc/modal/Modal-Backdrop.svelte';
  import type { PublicTransactionHistoryMain } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';
  import type { ICoinMarketCapDataMain } from '@betarena/scores-lib/types/_WEB3_.js';
  import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';
  import type { Web3Modal } from '@web3modal/ethers5/dist/types/src/client.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // | 2. types / interfaces                                                  │
  // │ 3. const [..]                                                          │
  // │ 4. let [..]                                                            │
  // │ 5. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  export let
    /**
     * @augments IProfileData
     */
    profileData: IProfileData | null
  ;

  // 🔗 read-more :|: https://stackoverflow.com/questions/72230897/how-to-call-a-smart-contract-function-with-walletconnect-react-js-node-js
  // 🔗 read-more :|: https://wiki.polygon.technology/docs/tools/wallets/walletconnect/

  /**
   * @description
   *  📣 Component interface.
   */
  interface ITierDiscount
  {
    /**
     * @description
     *  📣 Tier discount name.
     * @example
     *  'Bronze' | 'Silver' | 'Gold' | 'Platinum'
     */
    name?: string;
    /**
     * @description
     *  📣 Tier discount icon.
     */
    icon?: string;
    /**
     * @description
     *  📣 tier discount number.
     */
    discount?: number;
    /**
     * @description
     *  📣 tier **BTA** price.
     */
    btaPrice?: number;
  }

  /**
   * @description
   *  📣 Component interface.
   */
  interface ICryptoDesposit
  {
    /**
     * @description
     *  📣 cryptocurrency full name
     */
    full_name: string;
    /**
     * @description
     *  📣 cryptocurrency symbol
     */
    name: string;
    /**
     * @description
     *  📣 cryptocurrency icon
     */
    icon: string;
    /**
     * @description
     *  📣 cryptocurrency address
     */
    contractAddress: string;
    /**
     * @description
     *  📣 cryptocurrency ABI
     */
    abi: unknown;
    /**
     * @description
     *  📣 cryptocurrency user amount
     */
    userBalance: any;
  }

  /**
   * @description
   *  📣 Component interface.
   */
  type IStateWidget =
    'In Progress'
    | 'Completed'
    | 'Error'
    | 'ErrorBalance'
    | null
  ;

  /**
   * @description
   *  📣 Component interface.
   */
  type IStateWidgetFormError =
    | 'First_Minimum_Deposit_Not_Reached'
    | 'Transaction_Error'
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    // eslint-disable-next-line no-unused-vars
    CNAME = 'profile⮕w⮕investbox⮕main'
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
    /**
     * @description
     *  📣 target `polygon` blockchain `BetarenaBank` polygon mumbai (testnet)
     */
    , betarenaBankContractAddress: string = polygonMainnet.betarenaBankContractAddress.address
  ;

  let
    /**
     * @description
     *  📣 Creating a Web3Modal with `WalletConnect` configuration.
     */
    modal: Web3Modal
      = createWeb3Modal
      (
        {
          projectId: import.meta.env.VITE_WALLETCONNECT_ID!
          , ethersConfig: defaultConfig
          (
            {
              metadata:
              {
                name: 'Scores Platform'
                , description: 'Betarena Scores Platform'
                , url: 'https://betarena-scores-platform.herokuapp.com/'
                , icons:
                [
                  'https://betarena-scores-platform.herokuapp.com/_app/immutable/assets/betarena-logo-full.f6af936d.svg'
                ]
              }
              , defaultChainId: 137
              , enableCoinbase: true
            }
          )
          , chains:
          [
            chainObjectWalletConnect.ethereum
            , chainObjectWalletConnect.polygon_mainnet
          ]
          , defaultChain: chainObjectWalletConnect.polygon_mainnet
          // , featuredWalletIds:
          // [
          //   // ▓ NOTE:
          //   // ▓ > MetaMask Wallet
          //   // 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
          //   // ▓ NOTE:
          //   // ▓ > Trust Wallet
          //   // , '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
          //   // ▓ NOTE:
          //   // ▓ > CoinBase Wallet
          //   // , 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'
          // ]
          // , includeWalletIds:
          // [
          //   // ▓ NOTE:
          //   // ▓ > MetaMask Wallet
          //   // 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
          //   // ▓ NOTE:
          //   // ▓ > Trust Wallet
          //   // , '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
          //   // ▓ NOTE:
          //   // ▓ > CoinBase Wallet
          //   // , 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'
          // ]
          // , excludeWalletIds:
          // [
          // ]
          // , privacyPolicyUrl: ''
          // , termsConditionsUrl: ''
        }
      )
    /**
     * @description
     *  📣 wether user has triggered the `invest` action.
     */
    , triggerInvestBox: boolean = false
    /**
     * @description
     *  📣 wether user has triggered the `invest` action.
     */
    , stateWidget: IStateWidget = null
    /**
     * @description
     *  📣 prices of supported tokens.
     */
    , cryptoPrices:  null | undefined | ICoinMarketCapDataMain
    /**
     * @description
     *  📣 target token price.
     */
    , cryptoPrice: number
    /**
     * @description
     *  📣 amount user wishes to `deposit`.
     */
    , depositAmount: number | null = $sessionStore.investDepositAmountMobileWeb3 ?? 2600
    /**
     * @description
     *  📣 amount user wishes to `recieve`.
     */
    , recieveAmount: number = 2600
    /**
     * @description
     *  📣 target selected option by user.
     */
    , selectDepositOption: 'crypto' | 'fiat' = 'crypto'
    /**
     * @description
     *  📣 tier discount data object
     */
    , tierDiscountObject: ITierDiscount = { }
    /**
     * @description
     *  📣 terms&conditions checkbox
     */
    , agreeTermsAndConditions: boolean = false
    /**
     * @description
     *  📣 crypto deposit data object list
     */
    , cryptoDepositOptions: ICryptoDesposit[]
      = [
        {
          full_name: 'USD Coin'
          , name: 'USDC'
          , icon: icon_usdc
          , contractAddress: polygonMainnet.usdcContractAddress.address
          , abi: polygonMainnet.usdcContractAddress.abi
          , userBalance: null
        }
        , {
          full_name: 'Tether'
          , name: 'USDT'
          , icon: icon_usdt
          , contractAddress: polygonMainnet.usdtContractAddress.address
          , abi: polygonMainnet.usdtContractAddress.abi
          , userBalance: null
        }
      ]
    /**
     * @description
     *  📣 crypto deposit data object list (search)
     */
    , cryptoDepositOptionsSearch: ICryptoDesposit[] = passByValue(cryptoDepositOptions)
    /**
     * @description
     *  📣 crypto deposit object selected
     */
    , cryptoDepositOptionSelect: ICryptoDesposit = cryptoDepositOptions[1]
    /**
     * @description
     *  📣 modal open select cryptocurrency option
     */
    , walletAddress: `0x${string}` | undefined
    /**
     * @description
     *  📣 search text for target token
     */
    , tokenSearch: string
    /**
     * @description
     *  📣 interval for CoinMarketCap fetching
     */
    , interval1: NodeJS.Timer
    /**
     * @description
     *  📣 modal unsubsribe events (callback)
     */
    , modalUnsubscribe: (() => void)[] = []
    /**
     * @description
     *  📣 Target `errors` encountered in form fill out.
     */
    , formErrorState = new Set<IStateWidgetFormError>()
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: deepReactListenSignerChange = undefined as unknown;
  $: deepReactListenDepositOptionChange = JSON.stringify(cryptoDepositOptionSelect) as string;
  $: ({ theme } = $userBetarenaSettings);
  $: ({ referredBy } = $userBetarenaSettings.user.scores_user_data ?? { referredBy: null });
  $: ({ grand_total } = $userBetarenaSettings.user.scores_user_data?.investor_balance ?? { grand_total: 0 });
  $: ({ uid } = $userBetarenaSettings.user.firebase_user_data ?? { uid: null });
  $: ({ roundStateWidget, userTotalFiatInvested } = $scoresProfileInvestorStore);

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 COMPONENT MAIN
   * @description
   *  📣 Document (visibility-change) event listener;
   * @returns { void }
   */
  function addEventListeners
  (
  ): void
  {
    document.addEventListener
    (
      'visibilitychange',
      async function
      (
      )
      {
        if (!document.hidden)
        {
          dlog('🔵 user is active', true);
          getCryptoPrices();
        }
        else
        {
          dlog('🔴 user is not-active', true);
          // @ts-expect-error
          clearInterval(interval1);
        }
      }
    );

    window.addEventListener
    (
      'resize',
      function ()
      {
        resizeAction();
      }
    );

    const
      modalUnsub1 = modal.subscribeEvents
      (
        async (
          e
        ): Promise < void > =>
        {
          // ### [🐞]
          dlogv2
          (
            '🚏 checkpoint [R] ➤ src/lib/components/page/profile/investor/Main-InvestBox.svelte if_R_X342',
            [
              `🔹 [var] ➤ e.data.event ${e.data.event}`
            ],
            true
          );

          if (e.data.event == 'MODAL_OPEN')
            $sessionStore.currentActiveModal = 'ProfileInvestor_WalletConnect_Modal';
          if (e.data.event == 'MODAL_CLOSE')
            $sessionStore.currentActiveModal = null;
        }
      )
      , modalUnsub2 = modal.subscribeProvider
      (
        async (
          newProvider
        ): Promise < void > =>
        {
          // ### [🐞]
          dlogv2
          (
            '🚏 checkpoint [R] ➤ src/lib/components/page/profile/investor/Main-InvestBox.svelte if_R_X12',
            [
              newProvider
              // ,`🔹 [var] ➤ modal.getSigner() ${modal.getSigner()}`
              ,`🔹 [var] ➤ modal.getAddress() ${modal.getAddress()}`
            ],
            true
          );

          deepReactListenSignerChange = newProvider.isConnected;
          // @ts-expect-error
          walletAddress = modal.getAddress();
          // await switchUserNetwork();

          return;
        }
      )
    ;

    modalUnsubscribe.push(modalUnsub1);
    modalUnsubscribe.push(modalUnsub2);
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 COMPONENT MAIN
   * @description
   *  📣 Update variables for viewport state.
   * @returns { void }
   */
  function resizeAction
  (
  ): void
  {
    [
      VIEWPORT_TABLET_INIT[1],
      VIEWPORT_MOBILE_INIT[1]
    ] = viewport_change
    (
      VIEWPORT_TABLET_INIT[0],
      VIEWPORT_MOBILE_INIT[0]
    );
  }

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
      const if_M_0: boolean
        = item.name.toLowerCase().includes(_searchTarget)
        || item.full_name.toLowerCase().includes(_searchTarget)
        || item.contractAddress.toLowerCase().includes(_searchTarget)
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
   *  📣 Calculate target `tier`.
   * @return { void }
   */
  function recalculateReceive
  (
    depositAmount: number
    , cryptoPrice: number
  ): void
  {
    const
      /**
       * @description
       *  📣 Final deposit calculated, taking into account other variable(s) and values
       */
      depositCalculated = (depositAmount * cryptoPrice) + userTotalFiatInvested
    ;

    console.log('previouslyInvestedAmount', userTotalFiatInvested);

    if (depositCalculated >= 100000)
      tierDiscountObject
        = {
          name: 'platinum'
          , icon: icon_platinum
          , discount: 50
          , btaPrice: 0.50
        }
      ;
    else if (depositCalculated >= 50000)
      tierDiscountObject
        = {
          name: 'gold'
          , icon: icon_gold
          , discount: 40
          , btaPrice: 0.60
        }
      ;
    else if (depositCalculated >= 20000)
      tierDiscountObject
        = {
          name: 'silver'
          , icon: icon_silver
          , discount: 30
          , btaPrice: 0.70
        }
      ;
    else if (depositCalculated >= 2500)
      tierDiscountObject
        = {
          name: 'bronze'
          , icon: icon_bronze
          , discount: 20
          , btaPrice: 0.80
        }
      ;
    else if (depositCalculated < 2500)
      tierDiscountObject
        = {
          name: undefined
          , icon: undefined
          , discount: 0
          , btaPrice: 1.00
        }
      ;
    //

    if (depositAmount == 0)
      recieveAmount = 0;
    else
      recieveAmount
        = parseFloat
        (
          toDecimalFix
          (
            cryptoPrice * (depositAmount / tierDiscountObject.btaPrice!)
            , 3
            , false
            , false
          )
        )
      ;
    //

    if (depositCalculated < (profileData?.presaleData.data?.min_buy ?? 2500))
    {
      formErrorState.add('First_Minimum_Deposit_Not_Reached');
      formErrorState = formErrorState;
    }
    else
    {
      formErrorState.delete('First_Minimum_Deposit_Not_Reached');
      formErrorState = formErrorState;
    }

    return;
  }

  /**
   * @description
   */
  function setupFormRequiredListener
  (
  ): any[]
  {
    const
      requiredInputs = document.querySelectorAll('[required]')
      , emptyInputs = Array.prototype.slice.call(requiredInputs)
        .filter
        (
          item =>
          {
            return (!item.checked && item.required && item.type === 'checkbox' && VIEWPORT_MOBILE_INIT[1])
          }
        )
    ;

    // [🐞]
    console.log('requiredInputs', Array.prototype.slice.call(requiredInputs), 'emptyInputs', emptyInputs);

    if (emptyInputs.length > 0)
      emptyInputs[0].scrollIntoView();
    //

    return emptyInputs;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  [🐞]
   * @description
   *  📣 Debug Helper
   * @param reactDebug
   */
  function _DEBUG_
  (
    reactDebug: 'Option1' | 'Option2' | 'Option3' | 'Option4'
  ): void
  {
    const
      prefix: string = '🚏 checkpoint [R] ➤ src/lib/components/page/profile/investor/Main-InvestBox.svelte'
    ;

    // ▓ [🐞]
    if (reactDebug == 'Option1')
      dlogv2
      (
        `${prefix} if_R_X20`,
        [
          `🔹 [var] ➤ deepReactListenSignerChange ${deepReactListenSignerChange}`
          , `🔹 [var] ➤ triggerInvestBox ${triggerInvestBox}`
        ],
        true
      );
    else if (reactDebug == 'Option2')
      dlogv2
      (
        '🚏 checkpoint [R] ➤ if_R_X2234',
        [
          `🔹 [var] ➤ tokenSearch ${tokenSearch}`
        ],
        true
      );
    else if (reactDebug == 'Option3')
      dlogv2
      (
        '🚏 checkpoint [R] ➤ src/lib/components/page/profile/investor/Main-InvestBox.svelte IF_X_212',
        [
          `🔹 [var] ➤ deepReactListenDepositOptionChange ${deepReactListenDepositOptionChange}`
          ,`🔹 [var] ➤ deepReactListenSignerChange ${deepReactListenSignerChange}`
        ],
        true
      );
    else if (reactDebug == 'Option4')
      dlogv2
      (
        '🚏 checkpoint [R] ➤ src/lib/components/page/profile/investor/Main-InvestBox.svelte IF_X_212 [E]',
        [
          `🔹 [var] ➤ deepReactListenSignerChange ${deepReactListenSignerChange}`
        ],
        true
      );
    //

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 COMPONENT MAIN
   * @description
   *  📣 Obtains target user target **selected ERC-20 token** balance.
   * @returns { Promise < void > }
   */
  async function getTokenBalance
  (
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        const
          // @ts-expect-error
          ethersProvider = new ethers.providers.Web3Provider(modal.getWalletProvider())
          , signer = await ethersProvider.getSigner()
          , contract = new ethers.Contract
          (
            cryptoDepositOptionSelect.contractAddress,
              cryptoDepositOptionSelect.abi as ContractInterface,
              signer
          )
          , numberDecimals = await contract.decimals()
          , numberUserBalance = await contract.balanceOf(modal.getAddress())
        ;

        cryptoDepositOptionSelect.userBalance = ethers.utils.formatUnits(numberUserBalance?.toString(), numberDecimals);

        // ▓ [🐞]
        dlogv2
        (
          'testing'
          , [
            `numberDecimals ${numberDecimals}`
            ,`numberUserBalance ${numberUserBalance}`
            ,`modal?.getAddress() ${modal.getAddress()}`
          ]
        );

        return;
      }
      ,
      (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        if (ex?.toString()?.includes('TypeError: null is not an object (evaluating \'signerOrProvider.call\')'))
          console.info('❗️', '');
        else
          console.error(`💀 Unhandled :: ${ex}`);
        //

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
        return await modal.getWalletProvider()?.request
        (
          {
            method: 'wallet_addEthereumChain'
            , params:
            [
              // @ts-expect-error
              chainObject.polygon_mainnet
            ]
          }
        );
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        if (ex?.toString()?.includes('TypeError: undefined is not an object (evaluating \'window.ethereum.request\')'))
          console.warn
          (
            '❗️', 'Ethereum is not available in the global scope (window). Please check that you have MetaMask (or other wallet) installed.'
          );
        else
          console.error('💀', `Unhandled :: ${ex}`);
        //

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
   *  📣 Toggle connect/disconnect `web3` wallet connection.
   *  Redirects user to `MetaMask` browser to continue with `Invest/Deposit` flow.
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

    // ▓ CHECK
    // ▓ > for mobile, redirect with 'deep-link' user to MetaMask browser.
    // ▓ NOTE:
    // ▓ > does not appear to be working for 'localhost' with MetaMask browser.
    // const if_M_0: boolean
    //   // typeof screen.orientation !== 'undefined' // ❌ unreliable
    //   // navigator?.userAgentData?.mobile // ❌ unreliable
    //   = /Mobi/i.test(window.navigator.userAgent)
    //   && window.ethereum == null
    // ;
    // if (if_M_0)
    // {
    //   const
    //     dappUrl: string = $page.url.host
    //     , metamaskAppDeepLink = `
    //         https://metamask.app.link/dapp/${dappUrl}
    //           ?metmaskAuth=true
    //           &investDepositIntent=true
    //           &investDepositAmount=${depositAmount}
    //       `.replace(/\s/g, '')
    //   ;
    //   window.open
    //   (
    //     metamaskAppDeepLink
    //     ,  '_self'
    //   );
    //   return;
    // }

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
    // console.log('📣', modal.getSigner());
    // ▓ [🐞]
    // console.log('📣', modal.getIsConnected());

    $sessionStore.currentActiveModal = 'ProfileInvestor_TxState_Modal';

    if (formErrorState.has('First_Minimum_Deposit_Not_Reached'))
    {
      triggerInvestBox = false;
      stateWidget = 'ErrorBalance';
      return;
    }

    stateWidget = 'In Progress';

    await switchUserNetwork();

    let
      targetDecimals: number
      , targetAmount: BigNumber
      // @ts-expect-error
      , ethersProvider = new ethers.providers.Web3Provider(modal.getWalletProvider())
      , signer = ethersProvider.getSigner()
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
        // ▓ [🐞]
        console.log('executing approve()...');

        // ▓ NOTE:
        // ▓ > alternative num.1
        // const walletProvider = modal.getWalletProvider()
        // console.log(walletProvider)
        // const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
        // const signer = await ethersProvider.getSigner();
        // const
        //   contract = new ethers.Contract
        //   (
        //     cryptoDepositOptionSelect?.contractAddress,
        //     cryptoDepositOptionSelect?.abi as ContractInterface,
        //     signer,
        //   )
        // ;

        // ▓ NOTE:
        // ▓ > alternative num.2
        const
          contract = new ethers.Contract
          (
            cryptoDepositOptionSelect.contractAddress,
            cryptoDepositOptionSelect.abi as ContractInterface,
            signer
          )
        ;

        targetDecimals = await contract.decimals();
        targetAmount = ethers.utils.parseUnits((depositAmount ?? 0).toString(), targetDecimals);

        // [🐞]
        // console.log('targetAmount', targetAmount.toNumber());

        const
          transactionResponse: Transaction = await contract.approve(betarenaBankContractAddress, targetAmount)
        ;

        // ▓ [🐞]
        dlogv2
        (
          ''
          , [
            `targetDecimals ${targetDecimals}`
            ,`targetAmount ${targetAmount}`
            ,`transactionResponse ${transactionResponse}`
          ]
        );

        return;
      }
      ,
      (
        ex: unknown
      ): void =>
      {
        formErrorState.add('Transaction_Error');

        // ▓ [🐞]
        if (ex?.toString()?.includes('ACTION_REJECTED'))
          console.info('📣 The user has rejected the transaction.');
        else if (ex?.toString()?.includes('Error: Internal JSON-RPC error.'))
          // ▓ see :> https://support.metamask.io/hc/en-us/articles/360059289871-Error-Intern
          // al-JSON-RPC-error-when-trying-to-interact-with-other-networks
          console.info('❌ Something is not right, please recheck everything again.');
        else if (ex?.toString()?.includes('code=CALL_EXCEPTION'))
          console.info('❌ ERR :: Incorrect selected chain by client/user');
        else
          console.error(`💀 Unhandled :: ${ex}`);

        return;
      }
    );

    // ╭─
    // │ NOTE:
    // │ > needed due occasional slow network/chain propagation.
    // ╰─
    // await sleep(12500);

    // ╭─
    // │ NOTE:
    // │ > execute `.allowance(..)` logic for `allowance` for `ERC20` tokens.
    // │ > prior to effectuating a `deposit`/`transfer` of funds.
    // ╰─
    let
      count = 0
    ;
    // eslint-disable-next-line no-constant-condition
    while (true)
    {
      const
        response = await tryCatchAsync
        (
          async (
          ): Promise < boolean > =>
          {
            // [🐞]
            console.log('executing allowance()...');

            const
              /**
               * @description
               *  📣 Target `contract` for interaction.
               */
              contract
                = new ethers.Contract
                (
                  cryptoDepositOptionSelect.contractAddress,
                  cryptoDepositOptionSelect.abi as ContractInterface,
                  signer
                )
              /**
               * @description
               *  📣 Target `transaction` return.
               */
              , transactionResponse
                = await contract.allowance(signer.getAddress(), betarenaBankContractAddress) as BigNumber
              /**
               * @description
               *  📣 Target `allowance` amount.
               */
              , allowanceAmount = transactionResponse.toNumber()
              /**
               * @description
               *  📣 Target amount number.
               */
              , targetAmountNumber = targetAmount!.toNumber()
            ;

            // [🐞]
            console.log('allowanceAmount', allowanceAmount);
            // [🐞]
            console.log('targetAmountNumber', targetAmountNumber);

            if (allowanceAmount < targetAmountNumber)
              throw new Error('ERR-X1');
            //

            // [🐞]
            dlogv2
            (
              'data'
              , [
                `transactionResponse ${transactionResponse}`
              ]
              , true
            );

            return true;
          }
          , (
            ex: unknown
          ): boolean =>
          {
            formErrorState.add('Transaction_Error');

            // ▓ [🐞]
            if (ex?.toString()?.includes('ACTION_REJECTED'))
              console.info('📣 The user has rejected the transaction.');
            else if (ex?.toString()?.includes('Error: Internal JSON-RPC error.'))
              // ▓ see :> https://support.metamask.io/hc/en-us/articles/360059289871-Error-Intern
              // al-JSON-RPC-error-when-trying-to-interact-with-other-networks
              console.info('❌ Something is not right, please recheck everything again.');
            else if (ex?.toString()?.includes('code=CALL_EXCEPTION'))
              console.info('❌ ERR :: Incorrect selected chain by client/user');
            else
              console.error(`💀 Unhandled :: ${ex}`);
            //

            return false;
          }
        ) as boolean
      ;

      if (response)
      {
        // [🐞]
        // console.log('EXITING!');
        formErrorState.delete('Transaction_Error');
        break;
      }

      await sleep(2500);

      count++;

      if (count > 10)
      {
        // [🐞]
        // console.log('EXITING V2!');
        formErrorState.add('Transaction_Error');
        break;
      }

      continue;
    }

    // ╭─
    // │ CHECK
    // │ > For errors registered.
    // ╰─
    if (formErrorState.has('Transaction_Error'))
    {
      triggerInvestBox = false;
      stateWidget = 'Error';
      formErrorState = new Set();
      return;
    }

    // @ts-expect-error
    ethersProvider = new ethers.providers.Web3Provider(modal.getWalletProvider());
    signer = ethersProvider.getSigner();

    // ╭─
    // │ NOTE:
    // │ > execute '.depositTokens(..)' on the target 'SmartContract'.
    // ╰─
    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        // ▓ [🐞]
        console.log('executing depositTokens()...');

        const
          contract = new ethers.Contract
          (
            betarenaBankContractAddress,
            polygonMainnet.betarenaBankContractAddress.abi as ContractInterface,
            signer
          )
          , transactionResponse: Transaction = await contract.depositToken(cryptoDepositOptionSelect.contractAddress, targetAmount)
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
        formErrorState.add('Transaction_Error');

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

    // ▓ NOTE:
    // ▓ > needed due occasional slow network/chain propagation.
    await sleep(3000);

    // ▓ CHECK
    // ▓ > for errors registered.
    if (formErrorState.has('Transaction_Error'))
    {
      triggerInvestBox = false;
      stateWidget = 'Error';
      formErrorState = new Set();
      return;
    }

    if (!uid) return;

    const
      /**
       * @description
       *  📣 send data for completed user transaction to DB.
       */
      txDepositData: PublicTransactionHistoryMain
        = {
          uid
          , asset: cryptoDepositOptionSelect.name
          , amount: recieveAmount
          , quantity: (depositAmount ?? 0)
          , Gateway: 'cryptocurrency'
          , description: `${profileData?.presaleData.presale} presale`
          , type: 'investment'
          // @ts-expect-error
          , bta_price: toDecimalFix(cryptoPrice * tierDiscountObject.btaPrice!, 3)
          // @ts-expect-error
          , tier: tierDiscountObject.name
          , deposit_wallet_address:
          {
            type: 'Polygon'
            , address: walletAddress
          }
          , referral: referredBy as string | undefined
        }
    ;

    // ▓ [🐞]
    console.debug
    (
      `🔹 [var] txDepositData ${JSON.stringify(txDepositData)}`
    );

    const
      /**
       * @description
       *  📣 Response from `endpoint`.
       */
      result
        = await postv2
        (
          '/api/data/profile.main'
          , txDepositData
        )
    ;

    // @ts-expect-error
    if (result?.error)
    {
      $sessionStore.currentActiveModal = 'GeneralPlatform_Error';
      return;
    }

    triggerInvestBox = false;
    stateWidget = 'Completed';

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 COMPONENT MAIN
   * @description
   *  📣 Fetch target cryptocurrency prices.
   * @returns { Promise < void > }
   */
  async function getCryptoPrices
  (
  ): Promise < void >
  {
    if (dev)
    {
      // @ts-expect-error
      cryptoPrices
        = await get
        (
          '/api/coinmarketcap?tickers=USDT,USDC',
          null,
          true,
          true
        )
      ;

      cryptoPrice
        = parseFloat
        (
          toDecimalFix
          (
            // @ts-expect-error
            cryptoPrices?.data[cryptoDepositOptionSelect.name].quote.USD.price
            , 3
            , true
            , false
          )
        )
      ;

      if (isNaN(cryptoPrice)) cryptoPrice = 1.00;
    }


    // [🐞]
    // cryptoPrice = 0.999

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  $:
  if (browser && deepReactListenSignerChange && triggerInvestBox)
  {
    _DEBUG_('Option1');
    executeContract();
  }

  $:
  recalculateReceive((depositAmount ?? 0), cryptoPrice);

  $:
  if (tokenSearch)
  {
    _DEBUG_('Option2');
    searchToken();
  }
  else if (tokenSearch == '' || tokenSearch == undefined)
  {
    _DEBUG_('Option2');
    cryptoDepositOptionsSearch = passByValue(cryptoDepositOptions);
  }

  $:
  if (deepReactListenDepositOptionChange && deepReactListenSignerChange)
  {
    _DEBUG_('Option3');
    getTokenBalance();
  }

  $:
  if (!deepReactListenSignerChange)
  {
    _DEBUG_('Option3');
    cryptoDepositOptionSelect.userBalance = 0;
  }

  $:
  ({ currentActiveModal } = $sessionStore);

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    async (
    ) =>
    {
      getCryptoPrices();
      interval1 = setInterval
      (
        async (
        ): Promise < void > =>
        {
          getCryptoPrices();
        }
        ,
        30000
      );
      addEventListeners();
      resizeAction();
      return;
    }
  );

  onDestroy
  (
    () =>
    {
      // @ts-expect-error
      clearInterval(interval1);

      for (const unsubscribe of modalUnsubscribe)
        unsubscribe();

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

{#if currentActiveModal == 'ProfileInvestor_Terms&Cond_Modal'}
  <ModalTermsAndConditions />
{/if}

{#if currentActiveModal == 'ProfileInvestor_TxState_Modal'}
  <ModalTxState
    {stateWidget}
    minimumAmount={(profileData?.presaleData.data?.min_buy ?? 2500)}
  />
{/if}

<div
  id={CNAME}
  class:dark-background-1={theme == 'Dark'}
>
  <form
    id='invest-form'
    on:submit|preventDefault=
    {
      () =>
      {
        executeDeposit();
        return;
      }
    }
  >

    <!--
    ▓ NOTE:
    ▓ > Top Box (Outer)
    -->
    <div
      id="top-row"
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
        style=
        "
        align-items: flex-start
        "
      >

        <!--
        ▓ NOTE:
        ▓ > widget title
        -->
        <p
          class=
          "
          {VIEWPORT_MOBILE_INIT[1] ? 's-20' : 's-24'}
          w-500
          color-black-2
          "
        >
          {
            profileTrs?.investor?.invest_box.widget_title
            ?? 'Invest Box'
          }
        </p>

        <!--
        ▓ NOTE:
        ▓ > Connect Wallet.
        -->
        {#if roundStateWidget == 'Round_CountdownToFinish'}
          <button
            type="button"
            class=
            "
            btn-dark
            w-500
            row-space-start
            width-auto
            "
            on:click={() => {return connectWallet()}}
          >
            <p
              class=
              "
              s-14
              color-black-2
              m-r-6
              "
            >
              {
                shortenWeb3WalletAddress(walletAddress ?? '')
                ?? (
                  profileTrs?.investor?.invest_box.connect_wallet
                  ?? 'Connect your wallet'
                )
              }
            </p>

            {#if !walletAddress}
              <img
                id=''
                src={theme == 'Dark' ? icon_arrow_right_dark : icon_arrow_right}
                alt=''
                title=''
                loading='lazy'
                width=16
                height=16
              />
            {/if}
          </button>
        {/if}

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
        {
          profileTrs?.investor?.invest_box.options.title
          ?? 'Investment options'
        }
      </p>

      <!--
      ▓ NOTE:
      ▓ > Deposit Method.
      -->
      {#if roundStateWidget == 'Round_CountdownToFinish'}
        <div
          id="deposit-method"
          class=
          "
          m-t-20
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
            on:click=
            {
              () =>
              {
                selectDepositOption = 'crypto'
                return;
              }
            }
          >
            <TranslationText
              key={'profile/investor/invest-box'}
              text={profileTrs?.investor?.invest_box.options.option_1}
              fallback={'Crypto'}
            />
          </button>

          <!--
          ▓ NOTE:
          ▓ > Fiat Deposit OPTION.
          -->
          <a
            href=
            {
              !agreeTermsAndConditions
                ? ''
                : `https://buy.stripe.com/7sIeWc72V8Hw33WbIM?client_reference_id=${$userBetarenaSettings.user.firebase_user_data?.uid}`
            }
            target="_blank"
            class=
            "
            width-100
            "
          >
            <button
              id="fiat"
              type=
              {
                !agreeTermsAndConditions
                  ? 'submit'
                  : 'button'
              }
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
            >
              <TranslationText
                key={'profile/investor/invest-box'}
                text={profileTrs?.investor?.invest_box.options.option_2}
                fallback={'Fiat'}
              />
            </button>
          </a>

        </div>
      {/if}

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

        <!-- [🐞] -->
        <!-- {agreeTermsAndConditions} -->

        <!--
        ▓ NOTE:
        ▓ > Terms & Conditions INPUT.
        -->
        <label
          class=
          "
          m-r-12
          container
          "
        >
          <input
            id=""
            name=""
            type="checkbox"
            class=
            "
            v-1
            cursor-pointer
            "
            required
            bind:checked={agreeTermsAndConditions}
          />

          <span
            class="checkmark"
          >
            {#if agreeTermsAndConditions}
              <img
                id=''
                class=
                "
                box-center
                "
                src={icon_checkbox}
                alt=''
                title=''
                loading='lazy'
              />
            {/if}
          </span>
        </label>

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
          on:click=
          {
            () =>
            {
              $sessionStore.currentActiveModal = 'ProfileInvestor_Terms&Cond_Modal';
              return;
            }
          }
        >
          {
            @html profileTrs?.investor?.invest_box.terms
            ?? 'I have read the terms and disclaimers.'
          }
        </p>

      </div>

    </div>

    <!--
    ▓ NOTE:
    ▓ > Middle Box (Outer)
    -->
    <div
      id="middle-row"
    >

      {#if roundStateWidget == 'Round_CountdownToFinish'}

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
              {
                profileTrs?.investor?.invest_box.deposit_box.title
                ?? 'Deposit Amount'
              }
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
                dark-v1
              "
            >
              {
                profileTrs?.investor?.invest_box.deposit_box.subtitle_1
                ?? 'First Minimum Deposit'
              }
              <span
                class=
                "
                color-black-2
                w-500
                "
              >
                {
                  profileData?.presaleData.data?.min_buy
                  ?? 1
                }
              </span>
              /
              {
                profileTrs?.investor?.invest_box.deposit_box.subtitle_2
                ?? 'Deposit'
              }
              <span
                class=
                "
                color-black-2
                w-500
                "
              >
                {
                  profileData?.presaleData.data?.max
                  ?? 2500
                } USD
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
                inputmode="decimal"
                step="0.01"
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
                {
                  formErrorState.has('First_Minimum_Deposit_Not_Reached')
                    ? 'color-red-bright'
                    : 'color-grey dark-v1'
                }
                m-t-5
                "
              >
                <!-- ▓ [🐞] -->
                <!-- {console.log(cryptoPrices?.data?.['USDC']?.quote?.USD?.price)} -->
                {depositAmount ?? 0} {cryptoDepositOptionSelect.name} ≈ {(depositAmount ?? 0) * cryptoPrice} USD
              </p>

            </div>

            <!--
            ▓ NOTE:
            ▓ > token box (parent)
            -->
            <div>

              <!--
              ▓ NOTE:
              ▓ > Token.
              -->
              <div
                class=
                "
                row-space-end
                width-auto
                cursor-pointer
                m-b-5
                "
                on:click=
                {
                  () =>
                  {
                    $sessionStore.currentActiveModal = 'ProfileInvestor_SelectCrypto_Modal';
                    return;
                  }
                }
              >

                <!--
                ▓ NOTE:
                ▓ > Token Asset Icon.
                -->
                <img
                  id=''
                  src={cryptoDepositOptionSelect.icon}
                  alt={cryptoDepositOptionSelect.name}
                  title={cryptoDepositOptionSelect.name}
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
                  {cryptoDepositOptionSelect.name}
                </p>

                <img
                  id=''
                  src={theme == 'Dark' ? icon_arrow_down_dark : icon_arrow_down}
                  alt=''
                  title=''
                  loading='lazy'
                  width=16
                  height=16
                />

              </div>

              <!--
              ▓ NOTE:
              ▓ > Token User Balance.
              -->
              <p
                class=
                "
                s-12
                color-black-2
                "
              >

                {
                  profileTrs?.investor?.invest_box.balance
                  ?? 'Balance'
                }
                :
                {
                  toDecimalFix(cryptoDepositOptionSelect.userBalance)
                  ?? 0
                }
              </p>

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
            {
              profileTrs?.investor?.invest_box.receive_box.title
              ?? 'You will recieve'
            }
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
                  dark-v1
                m-t-5
                "
              >
                {toDecimalFix(cryptoPrice * (tierDiscountObject.btaPrice ?? 1), 3)} {cryptoDepositOptionSelect.name} ≈ 1.00 BTA
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

      {/if}

      <!--
      ▓ NOTE:
      ▓ > Current Tier Discount
      -->
      {#if tierDiscountObject.name}

        <div
          id="tier-box"
          style=
          "
          {VIEWPORT_MOBILE_INIT[1] ? 'justify-content: space-between;' : ''}
          "
          class:row-space-out={!VIEWPORT_MOBILE_INIT[1]}
          class:column-space-start={VIEWPORT_MOBILE_INIT[1]}
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
            text-left
            width-100
            "
          >
            {
              profileTrs?.investor?.invest_box.tier_title
              ?? 'Current Tier Discount'
            }
          </p>

          <!--
          ▓ NOTE:
          ▓ > tier SUB-BOX.
          -->
          <div
            class=
            "
            {!VIEWPORT_MOBILE_INIT[1] ? 'row-space-start width-auto' : 'row-space-out'}
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
                src={tierDiscountObject.icon}
                alt={tierDiscountObject.icon}
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
                capitalize
                "
              >
                {tierDiscountObject.name}
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
              {tierDiscountObject.discount ?? 0}%
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
        form="invest-form"
        class=
        "
        btn-primary-v2
          btn-shadow-1
        width-100
        w-500
        s-14
        "
        disabled={roundStateWidget != 'Round_CountdownToFinish'}
        on:click={() => { return setupFormRequiredListener() }}
      >
        {#if roundStateWidget == 'Round_CountdownToFinish'}
          <TranslationText
            key={'profile/investor/invest-box'}
            text={profileTrs?.investor?.invest_box.cta}
            fallback={'Buy BTA'}
          />
        {:else}
          <TranslationText
            key={'profile/investor/invest-box'}
            text={profileTrs?.investor?.round.details.end_message}
            fallback={'Sale ended'}
          />
        {/if}
      </button>

    </div>

    <!--
    ▓ NOTE:
    ▓ > Cryptocurrency Deposit Option Select (Outer)
    -->
    {#if currentActiveModal == 'ProfileInvestor_SelectCrypto_Modal'}

      <!--
      ▓ NOTE:
      ▓ > Generic Modal Background
      -->
      <ModalBackdrop
        on:closeModal=
        {
          () =>
          {
            $sessionStore.currentActiveModal = null;
            return;
          }
        }
      />

      <!--
      ▓ NOTE:
      ▓ > Cryptocurrency Select
      -->
      <div
        id="select-crypto"
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
            <!-- TRS -->
            {
              profileTrs?.investor?.invest_box.crypto_selection
              ?? 'Fiat'
            }
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
            on:click=
            {
              () =>
              {
                $sessionStore.currentActiveModal = null;
                return;
              }
            }
            width=14
            height=14
          />

          <!--
          ▓ NOTE:
          ▓ > Execute Deposit Button
          -->
          {#if false}
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
          {/if}

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
              on:click={() => {return cryptoDepositOptionSelect = item}}
              on:click=
              {
                () =>
                {
                  $sessionStore.currentActiveModal = null;
                  return;
                }
              }
            >

              <!--
              ▓ NOTE:
              ▓ > Token Icon.
              -->
              <img
                id=''
                src={item.icon}
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
                {item.name ?? ''}

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
                  {item.full_name ?? ''}
                </span>
              </p>

            </div>

          {/each}
        </div>

      </div>

    {/if}

  </form>
</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  div#profile⮕w⮕investbox⮕main
  {
    /* 📌 position */
    position: relative;
    border-radius: 12px;

    form
    {
      /* 🎨 style */
      border-radius: 12px;
      overflow: hidden;
      height: fit-content;

      div#top-row
      {
        /* 📌 position */
        position: relative;
        /* 🎨 style */
        padding: 20px;
        padding-top: 24px;
        background: var(--white);
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
        /* z-index: 10; */

        div#deposit-method
        {
          /* 🎨 style */
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        :global
        {
          span.x0001
          {
            /* 🎨 style */
            font-weight: 500;
            text-decoration: underline;
            cursor: pointer;
            color: var(--dark-theme);
          }
        }
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

      div#middle-row
      {
        /* 🎨 style */
        padding: 20px;
        padding-bottom: 20px;
        background: var(--white);
        display: grid;
        gap: 12px;

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
          margin-bottom: 12px;
        }

        input[type=number]
        {
          &.amount-input
          {
            /* 🎨 style */
            padding: 0;
            margin: 0;
            border: none;
            width: fit-content;
            max-width: 150px;
            height: fit-content;
            /* 🤖 compatability */
            appearance: textfield;
            -moz-appearance: textfield;

            /* Chrome, Safari, Edge, Opera */
            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button
            {
              -webkit-appearance: none;
              margin: 0;
            }
          }
        }
      }

      img#close-vector
      {
        /* 📌 position */
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 400000002;
      }

      div#select-crypto
      {
        /* 📌 position */
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 100000;
        /* 🎨 style */
        border-radius: 12px;
        background: var(--white);
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
        padding-bottom: 10px;

        div#top-box
        {
          /* 🎨 style */
          padding: 20px;
          padding-bottom: 12px;
        }

        input#token-search
        {
          /* 🎨 style */
          background-image: url('/assets/svg/league_list/search.svg');
          background-repeat: no-repeat;
          background-position: 15px 50%;
          background-size: 20px 20px;
          padding: 12px 52px 12px 40px;
          background-color: var(--white-3);
          border: 1px solid transparent;

          &:hover
          {
            /* 🎨 style */
            border: 1px solid #8c8c8c;
          }
          &:focus
          {
            /* 🎨 style */
            border: 1px solid #4b4b4b;
          }
          &[placeholder]
          {
            /* 🎨 style */
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }

        div#token-list
        {
          /* 🎨 style */
          display: grid;

          div.token-row
          {
            /* 🎨 style */
            padding: 8px 20px;
            min-height: 53px;
            max-height: 53px;

            &:hover
            {
              /* 🎨 style */

              background-color: var(--white-3);
            }
            p.token-text
            {
              /* 🎨 style */
              position: relative;
            }
            p.token-text span
            {
              /* 🎨 style */
              position: absolute;
            }
          }
        }
      }
    }
  }

  :global
  {
    body:has(w3m-modal)
    {
      /* 🎨 style */
      overflow: unset;

      html &
      {
        /* 🎨 style */
        overflow: unset;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media screen
  and (min-width: 575px)
  {
    div#profile⮕w⮕investbox⮕main
    {
      div#middle-row
      {
        /* 🎨 style */
        padding-bottom: 32px;

        div#tier-box
        {
          /* 🎨 style */
          min-height: 64px !important;
          max-height: 64px !important;
          margin-bottom: 22px;
        }
      }
    }
  }

  @media screen
  and (min-width: 1160px)
  {
    div#profile⮕w⮕investbox⮕main
    {
      form
      {
        div#select-crypto
        {
          /* 📌 position */
          position: absolute;
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investbox⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: transparent !important;
    }

    &.dark-background-1 div#top-row
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1);

      :global
      {
        span.x0001
        {
          /* 🎨 style */
          color: var(--white);
        }
      }
    }

    &.dark-background-1 div#middle-row
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade);

      div.input-box,
      div#tier-box
      {
        /* 🎨 style */
        background-color: var(--dark-theme);
      }
    }

    &.dark-background-1 div#select-crypto
    {
      /* 🎨 style */
      background: var(--dark-theme-1-4-shade) !important;

      input#token-search
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1) !important;
        border: 1px solid transparent;
        color: white;

        &:hover
        {
          /* 🎨 style */
          border: 1px solid var(--dark-theme-1-2-shade);
        }

        &:focus
        {
          /* 🎨 style */
          border: 1px solid var(--grey-shade);
          background-image: url('/assets/svg/league_list/search-white.svg');
        }
      }

      div#token-list
      {
        div.token-row:hover
        {
          /* 🎨 style */
          background-color: var(--dark-theme-1);
        }
      }
    }
  }

</style>
