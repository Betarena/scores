<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { createEventDispatcher, onMount, type EventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import { post } from '$lib/api/utils.js';
	import { userUpdateBalance } from '$lib/firebase/common.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';
  import { toDecimalFix } from '$lib/utils/string.js';
	import * as EmailValidator from 'email-validator';
	import * as ibantools from 'ibantools';
	import { spliceBalanceDoubleZero } from '$lib/utils/string.js';

	import icon_arrow_left from '../assets/arrow-left.svg';
	import icon_arrow_right from '../assets/arrow-right.svg';
	import icon_check from '../assets/check.svg';
	import icon_withdraw_white_mobile from '../assets/withdraw-white-mobile.svg';
	import icon_withdraw from '../assets/withdraw.svg';

  import type { B_H_TH, B_H_TRS_WF, B_H_TRS_WF_FormField_Type, B_H_TRS_WF_FormOptFlow, B_H_TRS_WF_WithdrawFormStep } from '@betarena/scores-lib/types/_HASURA_.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    /** Modal Withdraw Form - Target Withdraw Form Data */
    data: B_H_TRS_WF,
    /** Modal Withdraw Form - Target Withdraw FormId Selected */
    withdrawFormSelectId: number,
    /** Modal Withdraw Form - Target Withdraw Provider Logo */
    withdrawFormSelectLogo: string
  ;

  const
    // ◼️ IMPORTANT
    VIEWPORT_MOBILE_INIT = 575,
    VIEWPORT_TABLET_INIT = 1160,
    // ◼️ IMPORTANT
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'profile⮕w⮕withdraw⮕modal⮕form',
    dispatch: EventDispatcher < any > = createEventDispatcher(),
    withdrawObj: B_H_TH = { };
  ;

  let
    // ◼️ IMPORTANT
    isViewMobile: boolean = false,
    isViewTablet: boolean = false,
    // ◼️ IMPORTANT
    /** Modal Withdraw Form - Target Withdraw Form Data (Flow) */
    targetFormData: B_H_TRS_WF_FormOptFlow,
    /** Modal Withdraw Form - Target Withdraw Form Step */
    targetFormStep: B_H_TRS_WF_WithdrawFormStep,
    /** Modal Withdraw Form - Identifies wether the Withdraw Request has been a success */
    withdrawSuccess: boolean = false,
    /** Modal Withdraw Form - Keeps track of current withdraw step user is on */
    currentWithdrawStep: number = 1,
    /** Modal Withdraw Form - Takes note of total number of withdraw steps available */
    numWithdrawSteps: number = 1,
    /** Modal Withdraw Form - Takes note of the withdraw steps names available */
    withdrawStepsName: string[] = [],
    /** Modal Withdraw Form - Keeps track of the withdraw form */
    htmlElemForm: HTMLFormElement,
    /** Modal Withdraw Form - Keeps track of the withdraw selected crypto-coin */
    withdrawSelectCoinLogo: string,
    /** Modal Withdraw Form - Keeps track of input errors in withdraw fill out */
    withdrawTargetInputIdError: B_H_TRS_WF_FormField_Type,
    /** Modal Withdraw Form - Keeps track of target error display */
    withdrawTargetInputErrorMsg: string,
    withdrawAmount = ""
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
	 * @description
   * bubbles up to parent event
	 * to close (this) modal widget
	 */
	function toggleModal
  (
  ): void
  {
    $sessionStore.withdrawModal = false;

		dispatch
    (
      'toggleModal'
    );
	}

  /**
   * @description
   * TODO: DOC:
   */
  function initModalForm
  (
  ): void
  {

    targetFormData = data?.form_opt_flow
    ?.find
    (
      (
        x
      ) =>
      x?.form_id == withdrawFormSelectId
    );

    numWithdrawSteps = targetFormData?.withdraw_form_steps?.length;

    // [🐞]
    console.debug
    (
      `🔹 [var] numWithdrawSteps ${numWithdrawSteps}`,

    );

    if (numWithdrawSteps > 1)
    {
      withdrawStepsName = targetFormData?.withdraw_form_steps
      ?.map
      (
        (
          x
        ) =>
        x?.step_name
      );
    }

    targetFormStep = targetFormData?.withdraw_form_steps?.[0];
  }

  /**
   * @description
   * TODO: DOC:
   */
  async function submitWithdrawl
  (
  ): Promise < void >
  {

    const formData = new FormData(htmlElemForm);

    // ◾️ NOTE:
    // ◾️ extract data from 'form'.
    for (var [key, value] of formData.entries())
    {
      // [🐞]
      console.debug
      (
        `🔹 [var] formData key: ${key}, value: ${value}`
      );

      const keyTyped: B_H_TRS_WF_FormField_Type = key as B_H_TRS_WF_FormField_Type;

      if (keyTyped == 'withdraw-amount')
      {

        // ◾️ CHECK
        // ◾️ for 'quantity' to be a valid input number.
        const if_M_0: boolean =
          !Number.isInteger(parseInt(value as string))
        ;
        if (if_M_0)
        {
          withdrawTargetInputIdError = 'withdraw-amount';
          withdrawTargetInputErrorMsg = data?.form_error?.value_integer;
          return;
        }
        // ◾️ CHECK
        // ◾️ for 'balance' to be of a valid input.
        const if_M_1: boolean =
          $userBetarenaSettings?.user?.scores_user_data?.main_balance <= 0
        ;
        if (if_M_1)
        {
          withdrawTargetInputIdError = 'withdraw-amount';
          withdrawTargetInputErrorMsg = data?.form_error?.no_balance;
          return;
        }
        // ◾️ CHECK
        // ◾️ for 'quantity' to be of a valid input.
        const if_M_2: boolean =
          parseInt(value as string) > $userBetarenaSettings?.user?.scores_user_data?.main_balance
        ;
        if (if_M_2)
        {
          withdrawTargetInputIdError = 'withdraw-amount';
          withdrawTargetInputErrorMsg = data?.form_error?.enough_balance;
          withdrawTargetInputErrorMsg = withdrawTargetInputErrorMsg.replace
          (
            'X',
            `${$userBetarenaSettings?.user?.scores_user_data?.main_balance}`
          );
          return;
        }
        // ◾️ CHECK
        // ◾️ for 'quantity' to be above a minimum threshold input.
        const if_M_3: boolean =
          parseInt(value as string) < 5
        ;
        if (if_M_3)
        {
          withdrawTargetInputIdError = 'withdraw-amount';
          withdrawTargetInputErrorMsg = data?.form_error?.min_balance;
          return;
        }

        withdrawObj.quantity = parseFloat(value as unknown as string);
      };

      if (keyTyped == 'withdraw-email')
      {
        // ◾️ CHECK
        // ◾️ for 'quantity' to be a valid input number.
        const if_M_0: boolean =
          !EmailValidator.validate(value as string)
        ;
        if (if_M_0)
        {
          withdrawTargetInputIdError = 'withdraw-email';
          withdrawTargetInputErrorMsg = data?.form_error?.invalid_email;
          return;
        }

        withdrawObj.payment_email = value as unknown as string;
      };

      if (keyTyped == 'withdraw-first-name')
        withdrawObj.first_name = value as unknown as string;
      ;
      if (keyTyped == 'withdraw-last-name')
        withdrawObj.last_name = value as unknown as string;
      ;

      if (keyTyped == 'withdraw-bic-swift')
      {

        // ◾️ CHECK
        // ◾️ for 'IBAN' to be of valid type.
        const if_M_3: boolean =
          !ibantools.isValidBIC(value as string)
        ;
        if (if_M_3)
        {
          withdrawTargetInputIdError = 'withdraw-bic-swift';
          withdrawTargetInputErrorMsg = data?.form_error?.invalid_bic;
          return;
        }

        withdrawObj.bic_swift = value as unknown as string;
      };

      if (keyTyped == 'withdraw-iban')
      {

        // ◾️ CHECK
        // ◾️ for 'IBAN' to be of valid type.
        const if_M_3: boolean =
          !ibantools.isValidIBAN(ibantools.electronicFormatIBAN(value as string))
        ;
        if (if_M_3)
        {
          withdrawTargetInputIdError = 'withdraw-iban';
          withdrawTargetInputErrorMsg = data?.form_error?.invalid_iban;
          return;
        }

        withdrawObj.iban = value as unknown as string;
      };

      if (keyTyped == 'withdraw-crypto-address-erc20')
        withdrawObj.wallet_address_erc20 = value as unknown as string;
      ;
      if (keyTyped == 'withdraw-crypto-opts')
        withdrawObj.asset = value as unknown as string;
      ;
    }

    htmlElemForm.reset();

    // ◾️ CHECK
    // ◾️ multi-step withdraw opt. , such as: cryptocurrency.
    const if_M_0: boolean =
      currentWithdrawStep != numWithdrawSteps
    ;
    if (if_M_0)
    {
      // [🐞]
      console.debug
      (
        `🚏 checkpoint ➤ submitWithdrawl if_M_0`,
      );

      currentWithdrawStep++;

      targetFormStep = targetFormData?.withdraw_form_steps?.[currentWithdrawStep - 1];

      return;
    }

    withdrawObj.uid = $userBetarenaSettings?.user?.firebase_user_data?.uid;
    withdrawObj.Gateway = targetFormData?.gateway;
    withdrawObj.type = 'Withdraw';
    withdrawObj.description = 'BTA Withdraw Request'
    withdrawObj.amount = withdrawObj.quantity;
    if (withdrawObj.asset == undefined) withdrawObj.asset = 'USD';

    withdrawSuccess = true;

    let newBalance: number = ($userBetarenaSettings?.user?.scores_user_data?.main_balance - withdrawObj.quantity) ?? 0;
    if (newBalance < 0) newBalance = 0;

    // [🐞]
    console.debug
    (
      `🔹 [var] withdrawObj ${JSON.stringify(withdrawObj)}`
    );

    await post
    (
      `/api/data/profile.main?uid=${$userBetarenaSettings?.user?.firebase_user_data?.uid}`,
      withdrawObj
    );

    await userUpdateBalance
    (
      $userBetarenaSettings?.user?.firebase_user_data?.uid,
      newBalance
    );

    return;
  }

  /**
   * @description
   * TODO: DOC:
   */
  function previousWithdrawStep
  (
  ): void
  {
    // [🐞]
    console.debug
    (
      `🚏 [checkpoint] ➤ previousWithdrawStep`,
    );

    currentWithdrawStep--;

    targetFormStep = targetFormData?.withdraw_form_steps?.[currentWithdrawStep - 1];

    return;
  }

  /**
   * @description
   * TODO: DOC:
   */
  function selectFullBalance
  (
  ): void
  {
    const inputAmount = document.getElementById('withdraw-amount') as HTMLInputElement;
    inputAmount.value = toDecimalFix($userBetarenaSettings?.user?.scores_user_data?.main_balance);
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🚏 ONE-OFF CONDITIONS

  /**
   * @description
   * TODO: DOC:
   */
  const if_O_0: boolean =
    data != undefined
    && withdrawFormSelectId != undefined
  ;
  if (if_O_0)
  {
    // [🐞]
    console.debug
    (
      `🚏 checkpoint ➤ ModalWithdrawForm if_O_0`,
    );

    initModalForm();
  }

  // #endregion ➤ 🚏 ONE-OFF CONDITIONS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @description
   * TODO: DOC:
   */
  $: if_R_0 =
    currentWithdrawStep == numWithdrawSteps
    && withdrawSelectCoinLogo != undefined
  ;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  /**
   * @description
   * TODO: DOC:
   */
  onMount
  (
    async () =>
    {
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

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
MAIN MODAL BACKGROUND BLUR
-->
<!-- {#if !isViewMobile}
  <div
    id="{CNAME}⮕modal-bg-blur"
    on:click={() => toggleModal()}
    in:fade
  />
{/if} -->

<!--
WITHDRAW SUCCESS ICON
-->
{#if withdrawSuccess && isViewMobile}
  <div
    id="{CNAME}⮕success-box"
  >
    <img
      id=''
      src={isViewMobile ? icon_withdraw_white_mobile : icon_withdraw}
      alt='success_icon'
      title='Withdraw Successful'
      loading='lazy'
      class=
      "
      m-b-24
      "
      width={isViewMobile ? 88 : 48}
      height={isViewMobile ? 88 : 48}
    />
  </div>
{/if}

<!--
MAIN WITHDRAW FORM FLOW WIDGET
-->
<div
  id="{CNAME}⮕main"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  class:success-state={withdrawSuccess && isViewMobile}
>

  <!--
  CLOSE MODAL ICON
  -->
  {#if !(isViewMobile && withdrawSuccess)}

    <img
      id="{CNAME}⮕close-btn"
      src="/assets/svg/close.svg"
      alt="close_icon"
      title="Close Withdraw Modal"
      loading="lazy"
      class=
      "
      cursor-pointer
      "
      on:click={() => toggleModal()}
    />

  {/if}

  <!--
  MAIN STEP BASED FLOW UI
  -->
  {#if !withdrawSuccess}

    <!--
    TOP FORM SECTION
    -->
    <div
      id="{CNAME}⮕top-nav"
    >

      <!--
      WITHDRAW PREVIOUS STEP NAV
      -->
      {#if numWithdrawSteps > 1 && currentWithdrawStep > 1}

        <div
          id="{CNAME}⮕withdraw-back-step"
          class=
          "
          row-space-center
          width-auto
          cursor-pointer
          "
          on:click={() => previousWithdrawStep()}
        >

          <img
            id=''
            src={icon_arrow_left}
            alt='arrow_left'
            title='Previous Withdraw Step'
            loading='lazy'
          />

          {#if !isViewMobile}

            <p
              class=
              "
              s-14
              color-grey
              "
            >
              Back
            </p>

          {/if}

        </div>

      {/if}

      <!--
      WITHDRAW OPTION ASSET
      -->
      <img
        id="{CNAME}⮕withdraw-provider"
        src={withdrawFormSelectLogo}
        alt={targetFormData?.gateway ?? 'withdraw_gateway_logo'}
        title={targetFormData?.gateway ?? 'Withdraw Selected Provider'}
        loading='lazy'
        class:m-b-24={!isViewMobile}
      />

    </div>

    <!--
    WITHDRAW WELCOME TEXT
    -->
    <div
      id="{CNAME}⮕withdraw-welcome-text"
      class=
      "
      m-b-24
      "
    >

      <p
        class=
        "
        s-16
        w-500
        m-b-8
        color-black-2
        "
        class:s-20={isViewMobile}
      >
        {targetFormData?.title ?? 'Withdrawal Request'}
      </p>

      <p
        class=
        "
        s-14
        color-grey
        "
      >
        {targetFormStep?.description}
      </p>

    </div>

    <!--
    WITHDRAW STEPS DISPLAY
    -->
    {#if numWithdrawSteps > 1}

      <div
        id="{CNAME}⮕withdraw-steps"
        class=
        "
        m-b-24
        row-space-center
        "
      >

        {#each withdrawStepsName as item,i}

          <div
            style=
            "
            width: 100%;
            "
          >

            <div
              class=
              "
              m-b-5
              withdraw-step-bar
              "
              class:complete={currentWithdrawStep > (i+1)}
              class:current={currentWithdrawStep == (i+1)}
            />

            <div
              class=
              "
              row-space-center
              "
            >
              <p
                class=
                "
                s-12
                w-500
                color-black-2
                "
              >
                {item}
              </p>

              {#if currentWithdrawStep > (i+1)}
                <img
                  id=''
                  src={icon_check}
                  alt='check_mark'
                  title='Check Mark'
                  loading='lazy'
                  class=
                  "
                  m-l-8
                  "
                />
              {/if}

            </div>

          </div>

        {/each}

      </div>

    {/if}

    <!--
    BALANCE DISPLAY
    -->
    <div
      class=
      "
      m-b-16
      "
    >

      <p
        class=
        "
        s-14
        w-500
        color-black-2
        "
      >
        {targetFormStep?.balance ?? 'Your Balance:'}
      </p>

      <!--
      BTA BALANCE
      -->
      <p
        class=
        "
        s-22
        w-700
        color-primary
        m-b-5
        "
      >
        {#if currentWithdrawStep > 1}
          {withdrawAmount}
        {:else}
          {spliceBalanceDoubleZero(toDecimalFix($userBetarenaSettings?.user?.scores_user_data?.main_balance)) ?? 0}
        {/if}
          BTA
      </p>
      {#if currentWithdrawStep > 1}
        <p class="withdraw-conversion">
          <img
            src={getOptimizedImageUrl({ strImageUrl:  "https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/Betarena_Media%2Fforms_media%2Ficon_bta_form.png?alt=media&token=c454ca74-7ca6-4468-a2a2-bf5ba651dc07" })}
          />
         <span>
           BTA
         </span>
        </p>
      {/if}

    </div>

    <!--
    WITHDRAW FORM INIT.
    -->
    <form
      id="{CNAME}⮕form"
      bind:this={htmlElemForm}
      on:submit|preventDefault={() => submitWithdrawl()}
    >

      <!--
      WITHDRAW FORM FIELDS
      -->
      <div
        class=
        "
        text-left
        m-b-24
        "
      >

        {#each targetFormStep?.form_fields ?? [] as form_item}

          <div
            class=
            "
            m-b-16
            "
            class:row-space-out={form_item?.form_fields_nested != undefined && !isViewMobile}
            class:nested-form-field-box={form_item?.form_fields_nested != undefined && !isViewMobile}
            >

            <!--
            FORM FILEDS IS NESTED
            -->
            {#if form_item?.form_fields_nested != undefined}

              {#each form_item?.form_fields_nested as form_item_nest}

                <div
                  class=
                  "
                  m-r-16
                  width-100
                  "
                  class:m-b-16={isViewMobile}
                >

                  <p
                    class=
                    "
                    s-14
                    w-500
                    m-b-8
                    color-black-2
                    "
                  >
                    {form_item_nest?.title}
                  </p>

                  <!--
                  WITHDRAW STANDARD FORM INPUT
                  -->
                  <input
                    autocomplete="off"
                    id={form_item_nest?.id}
                    name={form_item_nest?.id}
                    type={form_item_nest?.type ?? 'text'}
                    placeholder={form_item_nest?.placeholder ?? ''}
                    required
                    class=
                    "
                    color-black-2
                    "
                  />

                </div>

              {/each}

            {/if}

            <!--
            FORM FILEDS IS NOT NESTED
            -->
            {#if form_item?.form_fields_nested == undefined}

              <p
                class=
                "
                s-14
                w-500
                m-b-8
                color-black-2
                "
              >
                {form_item?.title}
              </p>

              <!--
              WITHDRAW CRYPTOCURRENCY SELECT
              -->
              {#if form_item?.id == 'withdraw-crypto-opts'}

                <div
                  id="{CNAME}⮕withdraw-crypto-box"
                  class=
                  "
                  column-start-grid
                  "
                >

                  {#each form_item?.options as crypto_opt,i}

                    <!--
                    CRYPTO WITHDRAW COIN SELECT
                    -->
                    <div
                      title="{crypto_opt?.coin_name} Select to Withdraw"
                      class=
                      "
                      crypto-coin-box
                      "
                      on:click={() => withdrawSelectCoinLogo = crypto_opt?.coin_logo}
                    >

                      {#if crypto_opt?.is_beta}
                        <p
                          class=
                          "
                          s-12
                          color-grey
                          coming-soon-txt
                          "
                        >
                          Coming Soon
                        </p>
                      {/if}

                      <input
                        id={crypto_opt?.coin_name}
                        type='radio'
                        name='withdraw-crypto-opts'
                        value={crypto_opt?.coin_name}
                        disabled={crypto_opt?.is_beta}
                        autocomplete="off"
                        required
                        checked={i == 0}
                        class=
                        "
                        color-black-2
                        "
                      />

                      <label
                        for={crypto_opt?.coin_name}
                        class=
                        "
                        cursor-pointer
                        hover-transition-v-1
                        row-space-center
                        "
                      >

                        <img
                          id=''
                          src={crypto_opt?.coin_logo}
                          alt='{crypto_opt?.coin_name}_logo'
                          title={crypto_opt?.coin_name}
                          loading='lazy'
                          width=24
                          height=24
                        />
                        <p
                          class=
                          "
                          s-14
                          color-black-2
                          m-l-10
                          "
                        >
                          {crypto_opt?.coin_name}
                        </p>

                      </label>

                    </div>

                  {/each}

                </div>

              {/if}

              <!--
              WITHDRAW STANDARD FORM INPUT
              -->
              {#if form_item?.id != 'withdraw-crypto-opts'}

                {#if form_item?.id != 'withdraw-amount'}
                  <input
                    id={form_item?.id}
                    name={form_item?.id}
                    type={form_item?.type ?? 'text'}
                    class:error={withdrawTargetInputIdError == form_item?.id}
                    placeholder={form_item?.placeholder ?? ''}
                    autocomplete="off"
                    required
                    class=
                    "
                    color-black-2
                    "
                  />
                {:else}
                    <input
                    id={form_item?.id}
                    name={form_item?.id}
                    type='text'
                    class:error={withdrawTargetInputIdError == form_item?.id}
                    placeholder={form_item?.placeholder ?? ''}
                    autocomplete="off"
                    required
                    bind:value={withdrawAmount}
                    class=
                    "
                    color-black-2
                    "
                  />
                {/if}
                <!--
                WITHDRAW INPUT ERROR
                -->
                {#if withdrawTargetInputIdError == form_item?.id}

                  <p
                    class=
                    "
                    m-t-10
                    color-error
                    "
                  >
                    {withdrawTargetInputErrorMsg}
                  </p>

                {/if}

                <!--
                WITHDRAW FULL BTA AMOUNT
                -->
                {#if form_item?.id == 'withdraw-amount'}
                  <p
                    class=
                    "
                    s-14
                    color-grey
                    underline
                    m-t-5
                    cursor-pointer
                    "
                    on:click={() => selectFullBalance()}
                  >
                    {targetFormStep?.option_funds ?? 'Withdraw all available funds'}
                  </p>
                {/if}

              {/if}

            {/if}

          </div>

        {/each}

      </div>

    </form>

    <!--
    WITHDRAW FOOTNOTES
    -->
    <div
      class=
      "
      text-left
      m-b-24
      "
    >

      {#each targetFormStep?.footnotes ?? [] as form_footnote}

        <p
          class=
          "
          s-12
          w-500
          color-black-2
          m-b-5
          "
        >
          {form_footnote?.information_subtitle}
        </p>

        <p
          class=
          "
          s-12
          color-grey
          m-b-12
          "
        >
          {form_footnote?.information_description}
        </p>

      {/each}

    </div>

    <!--
    BOTTOM FORM SECTION
    -->
    <div
      id="{CNAME}⮕bottom-nav"
    >

      <!--
      WITHDRAW STEP COMPLETE BTN
      -->
      <button
        form="{CNAME}⮕form"
        type="submit"
        class=
        "
        btn-primary-v2
        m-b-12
        "
        style=
        "
        width: -webkit-fill-available;
        width: -moz-available;
        "
      >
        {targetFormStep?.cta_title}
      </button>

      <!--
      WITHDRAW STEP EXTRA NOTE
      -->
      {#if targetFormStep?.cta_info}

        <p
          class=
          "
          s-12
          color-grey
          text-left
          "
        >
          {targetFormStep?.cta_info}
        </p>

      {/if}

    </div>

  {/if}

  <!--
  WITHDRAW SUCCESS
  -->
  {#if withdrawSuccess}

    <!--
    WITHDRAW SUCCESS ICON
    -->
    {#if !isViewMobile}
      <img
        id=''
        src={icon_withdraw}
        alt='success_icon'
        title='Withdraw Successful'
        loading='lazy'
        class=
        "
        m-b-24
        "
        width=48
        height=48
      />
    {/if}

    <!--
    WITHDRAW SUCCESS TEXT
    -->
    <div
      class:m-b-40={!isViewMobile}
    >
      <p
        class=
        "
        s-22
        w-500
        color-black-2
        m-b-8
        "
      >
        {data?.form_success?.title ?? 'Withdrawal Request'}
      </p>

      <p
        class=
        "
        s-14
        color-grey
        "
      >
        {data?.form_success?.description}
      </p>
    </div>

    <!--
    DIVIDER
    -->
    <div
      class=
      "
      success-divider
      "
      class:m-b-20={!isViewMobile}
    />

    <!--
    WITHDRAW FOOTNOTES
    -->
    <div
      id="{CNAME}⮕success-footnotes"
      class=
      "
      text-left
      "
    >

      {#each data?.form_success?.footnotes ?? [] as form_footnote}

        <div
          class=
          "
          m-b-12
          "
        >
          <p
            class=
            "
            s-12
            w-500
            color-black-2
            m-b-5
            "
          >
            {form_footnote?.sub_title}
          </p>

          <p
            class=
            "
            s-12
            color-grey
            "
          >
            {form_footnote?.sub_description}
          </p>
        </div>

      {/each}

    </div>

    <!--
    WITHDRAW STEP COMPLETE BTN
    📱 MOBILE
    -->
    {#if isViewMobile}

      <!--
      BOTTOM FORM SECTION
      -->
      <div
        id="{CNAME}⮕bottom-nav"
      >

        <button
          class=
          "
          btn-primary-v2
          "
          style=
          "
          width: -webkit-fill-available;
          width: -moz-available;
          "
          on:click={() => toggleModal()}
        >
          Continue
        </button>

      </div>

    {/if}

  {/if}

</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style lang="scss">

  .withdraw-conversion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;

    span {

      color: var(--semi-black-night, #A8A8A8);
      /* body/14px */
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
  }

	div#profile⮕w⮕withdraw⮕modal⮕form⮕modal-bg-blur
  {
		/* 📌 position */
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 4000;
		/* 🎨 style */
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	div#profile⮕w⮕withdraw⮕modal⮕form⮕main
  {
    /* 📌 position */
		/* position: absolute; */
    z-index: 10000;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    /* 🎨 style */
    display: grid;
    grid-auto-rows: min-content;
    align-items: start;
    width: 100vw;
    height: 100vh;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    padding: 20px;
    padding-top: 45px;
    text-align: -webkit-center;
    text-align: -moz-center;
    overflow-y: scroll;
    padding-top: 85px;
    padding-bottom: 150px;
	}
  div#profile⮕w⮕withdraw⮕modal⮕form⮕main.success-state
  {
    /* 📌 position */
    top: 233px;
    /* 🎨 style */
    height: auto;
    gap: 20px;
    padding-top: 20px;
    border-radius: 16px;
  }

	img#profile⮕w⮕withdraw⮕modal⮕form⮕close-btn
  {
		/* 📌 position */
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 400000002;
	}

  div#profile⮕w⮕withdraw⮕modal⮕form⮕top-nav
  {
    /* 📌 position */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    /* 🎨 style */
    padding: 20px;
    background-color: var(--white);
    border-bottom: 1px solid var(--grey-color);
  }

  img#profile⮕w⮕withdraw⮕modal⮕form⮕withdraw-provider
  {
		/* 🎨 style */
    scale: 1.35;
  }

  div#profile⮕w⮕withdraw⮕modal⮕form⮕withdraw-back-step
  {
    /* 📌 position */
		position: absolute;
		top: 20px;
		left: 20px;
		z-index: 400000002;
  }

  /* div#profile⮕w⮕withdraw⮕modal⮕form⮕withdraw-welcome-text
  {
  } */

  div#profile⮕w⮕withdraw⮕modal⮕form⮕withdraw-steps
  {
    /* 🎨 style */
    grid-column: 1;
    grid-row: 1;
  }

  div.withdraw-step-bar
  {
    /* 🎨 style */
    height: 6px;
    border-radius: 30px;
    background-color: var(--grey-color);
  }
  div.withdraw-step-bar.complete
  {
    /* 🎨 style */
    background-color: #59C65D;
  }
  div.withdraw-step-bar.current
  {
    /* 🎨 style */
    background-color: var(--primary);
  }

  input.error
  {
    /* 🎨 style */
		border: 1px solid #ff3c3c !important;
	}
  input::placeholder
  {
    /* 🎨 style */
		color: var(--grey-shade);
	}

  div.nested-form-field-box div:last-child
  {
    /* 🎨 style */
    margin-right: 0;
  }

  div#profile⮕w⮕withdraw⮕modal⮕form⮕success-box
  {
    /* 📌 position */
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    z-index: 1;
    /* 🎨 style */
    height: 250px;
    width: 100vw;
    background-color: #59C65D;
  }
  div#profile⮕w⮕withdraw⮕modal⮕form⮕success-box img
  {
    /* 📌 position */
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
  }

  div#profile⮕w⮕withdraw⮕modal⮕form⮕success-footnotes div:last-child
  {
    /* 🎨 style */
    margin: 0;
  }
  div.success-divider
  {
    /* 🎨 style */
    height: 1px;
    background-color: var(--grey-color);
  }

  div#profile⮕w⮕withdraw⮕modal⮕form⮕withdraw-crypto-box
  {
    /* 🎨 style */
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }
  div.crypto-coin-box
  {
    /* 📌 position */
    position: relative;
  }
  div.crypto-coin-box p.coming-soon-txt
  {
    /* 📌 position */
    left: 0;
    width: fit-content;
    top: -10px;
    right: 0;
    margin: auto;
    position: absolute;
    /* 🎨 style */
    padding: 3px 8px;
    border-radius: 20px;
    background: var(--whitev2);
  }
  div.crypto-coin-box label
  {
    /* 🎨 style */
    width: 100%;
    padding: 16px 20px;
    border: 1px solid var(--dark-gray-day, #8C8C8C);
    border-radius: 8px;
  }
  div.crypto-coin-box input[type="radio"]
  {
    /* 📌 position */
    position: fixed;
    /* 🎨 style */
    opacity: 0;
    width: 0;
  }
  div.crypto-coin-box label:hover,
  div.crypto-coin-box input[type="radio"]:checked + label
  {
    /* 🎨 style */
    border: 1px solid var(--accent-normal, #F5620F);
  }

  div#profile⮕w⮕withdraw⮕modal⮕form⮕bottom-nav
  {
    /* 📌 position */
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    /* 🎨 style */
    padding: 20px;
    background-color: var(--white);
    border-top: 1px solid var(--grey-color);
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 575px)
  {

		div#profile⮕w⮕withdraw⮕modal⮕form⮕main
    {
      /* 🎨 style */
      display: block;
      max-width: 502px;
      margin: auto;
      height: fit-content;
      max-height: 80vh;
      border-radius: 12px;
      padding-top: 20px;
      padding-bottom: 20px;
		}

    div#profile⮕w⮕withdraw⮕modal⮕form⮕top-nav
    {
      all: unset;
    }

    img#profile⮕w⮕withdraw⮕modal⮕form⮕close-btn
    {
      /* 📌 position */
      position: absolute;
    }

    div#profile⮕w⮕withdraw⮕modal⮕form⮕bottom-nav
    {
      all: unset;
    }

	}

  /*
  =============
  🌒 DARK-THEME
  =============
  */

  div#profile⮕w⮕withdraw⮕modal⮕form⮕main.dark-background-1
  {
    /* 🎨 style */
		box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--dark-theme-1) !important;
	}

  div#profile⮕w⮕withdraw⮕modal⮕form⮕main.dark-background-1 div.crypto-coin-box p.coming-soon-txt
  {
    /* 🎨 style */
    background: var(--dark-theme-1-shade);
  }

  div#profile⮕w⮕withdraw⮕modal⮕form⮕main.dark-background-1 div.success-divider
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-shade);
  }

  div#profile⮕w⮕withdraw⮕modal⮕form⮕main.dark-background-1 div#profile⮕w⮕withdraw⮕modal⮕form⮕top-nav
  {
    /* 🎨 style */
    border-bottom: 1px solid var(--dark-theme-1-shade);
    background-color: var(--dark-theme-1);
  }

  div#profile⮕w⮕withdraw⮕modal⮕form⮕main.dark-background-1 div#profile⮕w⮕withdraw⮕modal⮕form⮕bottom-nav
  {
    /* 🎨 style */
    border-top: 1px solid var(--dark-theme-1-shade);
    background-color: var(--dark-theme-1);
  }

</style>