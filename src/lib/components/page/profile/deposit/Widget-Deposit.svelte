<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { get } from '$lib/api/utils.js';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import type { B_PROF_D, B_PROF_T } from '@betarena/scores-lib/types/profile.js';
	import WidgetTxHistLoader from '../tx-history/Widget-Tx-Hist-Loader.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  let
    RESPONSE_PROFILE_DATA: B_PROF_T,
    WIDGET_DATA: B_PROF_D,
    NO_WIDGET_DATA: boolean
  ;

  $: RESPONSE_PROFILE_DATA = $page.data?.RESPONSE_PROFILE_DATA ?? { }
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

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

  /**
   * @description
   * TODO: DOC:
   * @see https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-client_reference_id
   */
  function modStripeLink
  (
    link: string
  ): string
  {
    const if_M_0: boolean =
      link.includes('buy.stripe.com')
    ;
    if (if_M_0)
      link = `${link}?client_reference_id=${$userBetarenaSettings?.user?.firebase_user_data?.uid}`;
    ;

    return link;
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
MAIN DEPOST WIDGET
-->
{#await widgetInit()}
  <WidgetTxHistLoader />
{:then value}

  <div
    id="profile/widget/deposit-outer"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!--
    WIDGET TITLE
    -->
    <h2
      class="
        w-500
        s-20
        m-b-24
        color-black-2
      "
      style="margin-top: 0px;"
    >
      {RESPONSE_PROFILE_DATA?.deposit?.title ?? 'Deposit'}
    </h2>

    <!--
    WIDGET DESCRIPTION
    -->
    <div
      id="profile/widget/deposit/inner/description-box"
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
        {RESPONSE_PROFILE_DATA?.deposit?.subtitle ?? 'Deposit Options'}
      </p>
      <p
        class=
        "
          m-t-5
          s-14
          color-grey
        "
      >
        {RESPONSE_PROFILE_DATA?.deposit?.description ?? ''}
      </p>
    </div>

    <!--
    DEPOSIT OPTIONS GRID
    -->
    <div
      id="profile/widget/deposit/inner/deposit-opts-box"
      class=
      "
        m-b-16
      "
      >

      {#each WIDGET_DATA?.deposit_opts ?? [] as item}
        <a
          href={modStripeLink(item?.link)}
          target="_blank"
          title={item?.type ?? 'Deposit Provider Link'}
          class=
          "
          deposit/option/box
          hover/transition/v-1
          "
        >
          <div
            class=
            "
            text-center
            "
          >
            <img
              src={$userBetarenaSettings.theme == "Dark" ? item?.provider_logo_dark : item?.provider_logo}
              alt={item?.type}
            />
          </div>
        </a>
      {/each}

    </div>

    <!--
    ADDITIONAL NOTE
    -->
    <div
      id="profile/widget/deposit/inner/additional-info-box"
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
        {RESPONSE_PROFILE_DATA?.deposit?.subtitle_1 ?? 'Please note:'}
      </p>
      <p
        class=
        "
          s-12
          color-grey
        "
      >
        {@html RESPONSE_PROFILE_DATA?.deposit?.information}
      </p>
    </div>

    <!--
    TRANSACTION FEES
    -->
    <div
      id="profile/widget/deposit/inner/additional-info-2-box"
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
        {RESPONSE_PROFILE_DATA?.deposit?.subtitle_2 ?? 'Transaction fees:'}
      </p>
      <p
        class=
        "
          s-12
          color-grey
        "
      >
        {@html RESPONSE_PROFILE_DATA?.deposit?.information1}
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

	div#profile\/widget\/deposit-outer
  {
    /* 🎨 style */
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;
	}

  div#profile\/widget\/deposit\/inner\/deposit-opts-box
  {
    /* 🛝 layout */
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
  }
  div#profile\/widget\/deposit\/inner\/deposit-opts-box a.deposit\/option\/box
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
  div#profile\/widget\/deposit\/inner\/deposit-opts-box a.deposit\/option\/box:hover
  {
    /* 🎨 style */
    border: 1px solid var(--primary) !important;
  }
  div#profile\/widget\/deposit\/inner\/deposit-opts-box a.deposit\/option\/box div
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
    div#profile\/widget\/deposit\/inner\/deposit-opts-box
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

  div#profile\/widget\/deposit-outer.dark-background-1 div#profile\/widget\/deposit\/inner\/deposit-opts-box a
  {
    /* 🎨 style */
    border: 1px solid var(--dark-theme-1-shade);
    background: var(--dark-theme-1);
  }

</style>