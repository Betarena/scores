<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { get } from '$lib/api/utils.js';
  import Modal from '$lib/components/ui/Modal.svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';

	import WidgetTxHistLoader from '../tx-history/Widget-Tx-Hist-Loader.svelte';
	import ModalWithdrawForm from './Modal-Withdraw-Form.svelte';

	import type { B_PROF_D, B_PROF_T } from '@betarena/scores-lib/types/profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'profile⮕w⮕withdraw'
  ;

  let
    RESPONSE_PROFILE_DATA: B_PROF_T,
    WIDGET_DATA: B_PROF_D,
    NO_WIDGET_DATA: boolean,
    withdrawFormSelectId: number,
    withdrawFormSelectLogo: string,
    showWithdrawModalForm: boolean = false
  ;

  $: RESPONSE_PROFILE_DATA = $page.data?.RESPONSE_PROFILE_DATA ?? { };

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ### NOTE:
  // ### TEMPORARY
  async function widgetInit
  (
  ): Promise < B_PROF_D >
  {
		// await sleep(3000);

    const response: B_PROF_D = await get
    (
			`/api/data/profile.main?uid=${$userBetarenaSettings?.user?.firebase_user_data?.uid}`
		);

    WIDGET_DATA = response

    const if_0 =
      WIDGET_DATA == undefined
    ;
		if (if_0)
    {
      // dlog(`${IN_W_F_TAG} ❌ no data available!`, IN_W_F_TOG, IN_W_F_STY);
			NO_WIDGET_DATA = true;
			return;
		}

    NO_WIDGET_DATA = false;
    return WIDGET_DATA
  }

  // ### NOTE:
  function withdrawModalToggle
  (
    formId: number,
    providerLogo: string
  ): void
  {
    withdrawFormSelectId = formId;
    withdrawFormSelectLogo = providerLogo;
    showWithdrawModalForm = true;
    $sessionStore.withdrawModal = true;
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->
<Modal bind:show={showWithdrawModalForm} style="padding: 0px">
  <ModalWithdrawForm
    data={RESPONSE_PROFILE_DATA?.withdraw_forms}
    {withdrawFormSelectId}
    {withdrawFormSelectLogo}
    on:toggleModal={() => showWithdrawModalForm = false}
  />
</Modal>

<!--
MAIN DEPOST WIDGET
-->
{#await widgetInit()}
  <WidgetTxHistLoader />
{:then value}

  <div
    id="{CNAME}⮕main"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!--
    WIDGET TITLE
    -->
    <h2
      class=
      "
      w-500
      s-20
      m-b-24
      color-black-2
      "
      style="margin-top: 0px;"
    >
      {RESPONSE_PROFILE_DATA?.withdraw?.title ?? 'Withdraw'}
    </h2>

    <!--
    WIDGET DESCRIPTION
    -->
    <div
      id="{CNAME}⮕description-box"
      class=
      "
        m-b-16
      "
    >
      <p
        class=
        "
        s-16
        w-500
        color-black-2
        m-b-5
        "
      >
        {RESPONSE_PROFILE_DATA?.withdraw?.subtitle ?? 'Withdraw Options'}
      </p>
      <p
        class=
        "
        m-t-5
        s-14
        color-grey
        "
      >
        {RESPONSE_PROFILE_DATA?.withdraw?.description ?? ''}
      </p>
    </div>

    <!--
    WITHDRAW OPTIONS GRID
    -->
    <div
      id="{CNAME}⮕withdraw-opts-box"
      class=
      "
      m-b-16
      "
      >

      {#each WIDGET_DATA?.withdraw_opts ?? [] as item}
        {#if !item.blacklist}
          <div
              title={item?.type ?? 'Withdraw Provider Option'}
              class=
              "
              deposit-option-box
              hover-transition-v-1
              text-center
              cursor-pointer
              "
              on:click={() => withdrawModalToggle(item?.form_id, ($userBetarenaSettings.theme == "Dark" ? item?.provider_logo_dark : item?.provider_logo))}
            >
              <img
                src={$userBetarenaSettings.theme == "Dark" ? item?.provider_logo_dark : item?.provider_logo}
                alt={item?.type}
              />
            </div>
          {/if}
        {/each}

    </div>

    <!--
    ADDITIONAL NOTE
    -->
    <div
      id="{CNAME}⮕additional-info-box"
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
        {RESPONSE_PROFILE_DATA?.withdraw?.subtitle_1 ?? 'Please note:'}
      </p>
      <p
        class=
        "
        s-12
        color-grey
        "
      >
        {@html RESPONSE_PROFILE_DATA?.withdraw?.information}
      </p>
    </div>

  </div>

{:catch error}
  <!-- Error -->
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	div#profile⮕w⮕withdraw⮕main
  {
    /* 🎨 style */
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;
	}

  div#profile⮕w⮕withdraw⮕withdraw-opts-box
  {
    /* 🛝 layout */
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
  }
  div#profile⮕w⮕withdraw⮕withdraw-opts-box div.deposit-option-box
  {
    /* 📌 position */
    position: relative;
    /* 🛝 layout */
    height: 72px;
    /* 🎨 style */
    border-radius: 8px;
    border: 1px solid var(--grey-color);
    background: var(--white);
  }
  div#profile⮕w⮕withdraw⮕withdraw-opts-box div.deposit-option-box:hover
  {
    /* 🎨 style */
    border: 1px solid var(--primary) !important;
  }
  div#profile⮕w⮕withdraw⮕withdraw-opts-box div.deposit-option-box img
  {
    /* 📌 position */
    position: absolute;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
    /* 🛝 layout */
		margin: auto;
		width: fit-content;
		height: fit-content;
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

  @media only screen
  and (min-width: 726px)
  {
    div#profile⮕w⮕withdraw⮕withdraw-opts-box
    {
      /* 🛝 layout */
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  /*
  =============
  🌒 DARK-THEME
  =============
  */

  div#profile⮕w⮕withdraw⮕main.dark-background-1 div#profile⮕w⮕withdraw⮕withdraw-opts-box div.deposit-option-box
  {
    /* 🎨 style */
    border: 1px solid var(--dark-theme-1-shade);
    background: var(--dark-theme-1);
  }

</style>