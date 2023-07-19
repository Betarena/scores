<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { get } from '$lib/api/utils.js';

	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings.js';
	import { daysInMonth, targetDate } from '$lib/utils/dates.js';
	import { onMount } from 'svelte';

	import WidgetCalendar from './Widget-Calendar.svelte';
	import WidgetTxHistRow from './Widget-Tx-Hist-Row.svelte';

	import calendar from './assets/menu-opt/calendar.svg';
	import icon_tx_hist from './assets/menu-opt/tx-hist-selected.svg';

	import { viewport_change } from '$lib/utils/platform-functions.js';
	import type { B_H_TH } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { B_PROF_D, B_PROF_T } from '@betarena/scores-lib/types/profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    TABLET_VIEW = 768,
    MOBILE_VIEW = 767
  ;

	let
    mobileExclusive: boolean = false,
    tabletExclusive: boolean = false;
  ;

  let
    RESPONSE_PROFILE_DATA: B_PROF_T,
    WIDGET_DATA: B_PROF_D,
    NO_WIDGET_DATA: boolean,
    selectedDateFilterOpt1: 'Last 7 Days' | 'Last Month' | 'Last 6 Months' = 'Last 7 Days',
    isShowMore: boolean = false,
    // isShowCalendar: boolean = false,
    txHistList: B_H_TH[] = []
  ;

  $: RESPONSE_PROFILE_DATA = $page.data?.RESPONSE_PROFILE_DATA ?? { }
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ### NOTE:
  // ### Temporary, deciding where to 'put' widget data loader,
  // ### Either into the parent (+page.svelte), or make 'this' widget
  // ### into it's own component, with the V6 structure.
  async function widgetInit
  (
  ): Promise < B_PROF_D >
  {
		// await sleep(3000);

    const response: B_PROF_D = await get
    (
			`/api/data/profile?uid=${$userBetarenaSettings?.user?.firebase_user_data?.uid}`
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
   */
  function filterTxListDateRange
  (
  ): void
  {
    const fromDate: Date = $sessionStore.userTxHistFilterDateRange.from;
    const toDate: Date = $sessionStore.userTxHistFilterDateRange.to;

    console.log('🔥 fromDate', fromDate);
    console.log('🔥 toDate', toDate);

    txHistList = WIDGET_DATA?.tx_hist
    ?.filter
    (
      x =>
        new Date(x?.date).getTime() >= fromDate.getTime()
        && new Date(x?.date).getTime() <= toDate.getTime()
    );

    txHistList = txHistList;
  }

  /**
   * @description
   * TODO: DOC:
   */
  function applyDateRangeFilter1
  (
  ): void
  {

    if (selectedDateFilterOpt1 == 'Last 7 Days')
    {
      // [🐞]
      console.debug
      (
        `🚏 checkpoint - applyDateRangeFilter1 - Last 7 Days`,
      );

      $sessionStore.userTxHistFilterDateRange =
      {
        from: targetDate
        (
          -7
        ),
        to: targetDate()
      }
    }

    if (selectedDateFilterOpt1 == 'Last Month')
    {
      // [🐞]
      console.debug
      (
        `🚏 checkpoint - applyDateRangeFilter1 - Last Month`,
      );

      // ### STASHED:
      // ### Used for Testing 'alternative' to '$ = [..]' data update.
      // sessionStore.updateUserTxHistDateRange
      // (
      //   targetDate
      //   (
      //     -30
      //   ),
      //   targetDate()
      // )
      // ### STASHED:

      const _lastMonthDate: Date = new Date();
      _lastMonthDate.setMonth(_lastMonthDate.getMonth() - 1);

      const _daysInPastMonth: number = daysInMonth
      (
        (_lastMonthDate.getMonth() + 1),
        _lastMonthDate.getFullYear()
      );

      const sMonthDate = new Date(_lastMonthDate);
      const eMonthDate = new Date(_lastMonthDate);

      sMonthDate.setDate(1);
      eMonthDate.setDate(_daysInPastMonth);

      const _from: Date = sMonthDate;
      const _to: Date = eMonthDate;

      $sessionStore.userTxHistFilterDateRange =
      {
        from: _from,
        to: _to
      };
    }

    if (selectedDateFilterOpt1 == 'Last 6 Months')
    {
      // [🐞]
      console.debug
      (
        `🚏 checkpoint - applyDateRangeFilter1 - Last 6 Months`,
      );

      const _last6MonthDate: Date = new Date();
      _last6MonthDate.setMonth(_last6MonthDate.getMonth() - 6);

      const _daysInPastMonth: number = daysInMonth
      (
        (_last6MonthDate.getMonth() + 1),
        _last6MonthDate.getFullYear()
      );

      const sMonthDate = new Date();
      const eMonthDate = new Date(_last6MonthDate);

      sMonthDate.setDate(1);
      eMonthDate.setDate(_daysInPastMonth);

      const _from: Date = sMonthDate;
      const _to: Date = eMonthDate;

      $sessionStore.userTxHistFilterDateRange =
      {
        from: _from,
        to: _to
      };
    }

  }

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  ): void
  {
    [
      tabletExclusive,
      mobileExclusive
    ] =	viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ document (visibility-change) event listener;
   * @returns
   * void
   */
  function addEventListeners
  (
  ): void
  {
    // NOTE: (on-resize)
    window.addEventListener
    (
			'resize',
			function ()
      {
				resizeAction();
			}
		);
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @description
   * TODO: DOC:
   */
  $: if_R_1 =
    browser
  ;
  $: if (if_R_1 && selectedDateFilterOpt1)
  {
    // [🐞]
    console.debug
    (
      `🚏 checkpoint ➤ [2]`,
    );

    applyDateRangeFilter1();
  }

  /**
   * @description
   * TODO: DOC:
   */
  $: if_R_0 =
    browser
    && WIDGET_DATA?.tx_hist != undefined
    && $sessionStore.userTxHistFilterDateRange != undefined
  ;
  $: if (if_R_0 && $sessionStore?.userTxHistFilterDateRange)
  {
    // [🐞]
    console.debug
    (
      `🚏 checkpoint ➤ if_R_0`,
    );

    filterTxListDateRange();
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() =>
    {
      resizeAction();
      addEventListeners();
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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
{#await widgetInit() then value}

  <div
    id="profile/widget/tx-history-outer"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    {#if WIDGET_DATA?.tx_hist?.length == 0}

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
        {RESPONSE_PROFILE_DATA?.tx?.title ?? 'Transaction History'}
      </h2>

      <!--
      NO TRANSACTIONS FOUND
      -->
      <div
        id="profile/widget/tx-history/inner/no-tx-hist-data-box"
      >
        <div
          id="no-tx-hist-data/content"
          class=
          "
          text-center
          "
        >
          <img
            src={icon_tx_hist}
            alt="icon_tx_hist"
            width=40
            height=40
            class=
            "
            m-b-20
            "
          >
          <p
            class=
            "
            s-16
            color-black-2
            w-500
            m-b-8
            "
          >
            {`You Don't Have Transactions Yet`}
          </p>
          <p
            class=
            "
            s-14
            color-grey
            "
          >
            Here you will be able to see your transaction history,
            <br/>
            deposits and withdrawal requests.
          </p>
        </div>
      </div>

    {/if}

    {#if WIDGET_DATA?.tx_hist?.length > 0}

      <!--
      TOP WIGET ROW
      -->
      <div
        class:row-space-out-top={!mobileExclusive}
        class:column-space-start={mobileExclusive}
      >

        <!--
        1st COLUMN
        -->
        <div
          class:m-b-16={mobileExclusive}
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
            {RESPONSE_PROFILE_DATA?.tx?.title ?? 'Transaction History'}
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
                m-t-5
                s-14
                color-grey
              "
            >
              {RESPONSE_PROFILE_DATA?.tx?.description ?? ''}
            </p>
          </div>

        </div>

        <!--
        2nd COLUMN
        -->
        <div
          class=
          "
          row-space-end
          "
          class:width-auto={!mobileExclusive}
          class:m-b-16={mobileExclusive}
        >

          <!--
          COMMON DATES FILTER
          -->
          <div
            id="profile/widget/tx-history/inner/date-filter-1"
            class=
            "
            row-space-start
            m-r-8
            "
          >

            <!--
            LAST 7 DAYS
            -->
            <div
              title='Show last 7 Days'
              class=
              "
              common-date-box
              cursor-pointer
              "
              class:selected_date={selectedDateFilterOpt1 == 'Last 7 Days'}
              on:click={() => selectedDateFilterOpt1 = 'Last 7 Days'}
            >
              <p
                class=
                "
                s-14
                color-grey
                no-wrap
                "
                class:color-black-2={selectedDateFilterOpt1 == 'Last 7 Days'}
              >
                {#if mobileExclusive}
                  {'7 Days'}
                {:else}
                  {RESPONSE_PROFILE_DATA?.tx?.date ?? 'Last 7 Days'}
                {/if}
              </p>
            </div>

            <!--
            LAST MONTH
            -->
            <div
              title='Show last month'
              class=
              "
              common-date-box
              cursor-pointer
              "
              class:selected_date={selectedDateFilterOpt1 == 'Last Month'}
              on:click={() => selectedDateFilterOpt1 = 'Last Month'}
            >
              <p
                class=
                "
                s-14
                color-grey
                no-wrap
                "
                class:color-black-2={selectedDateFilterOpt1 == 'Last Month'}
              >
                {#if mobileExclusive}
                  {'Month'}
                {:else}
                  {RESPONSE_PROFILE_DATA?.tx?.date1 ?? 'Last Month'}
                {/if}
              </p>
            </div>

            <!--
            LAST 6 MONTHS
            -->
            <div
              title='Show last 6 months'
              class=
              "
              common-date-box
              cursor-pointer
              "
              class:selected_date={selectedDateFilterOpt1 == 'Last 6 Months'}
              on:click={() => selectedDateFilterOpt1 = 'Last 6 Months'}
            >
              <p
                class=
                "
                s-14
                color-grey
                no-wrap
                "
                class:color-black-2={selectedDateFilterOpt1 == 'Last 6 Months'}
              >
                {#if mobileExclusive}
                  {'Year'}
                {:else}
                  {RESPONSE_PROFILE_DATA?.tx?.date2 ?? 'Last 6 Months'}
                {/if}
              </p>
            </div>

          </div>

          <!--
          CALENDAR FILTER
          -->
          <div
            id="profile/widget/tx-history/inner/date-filter-2"
            class=
            "
            column-space-center
            "
            title='Select specific date'
          >

            <!--
            CALENDAR ACTIVATE BOX
            -->
            <div
              id="activate-calendar"
              class=
              "
              column-space-center
              cursor-pointer
              "
              on:click={() => $sessionStore.userTxShowCalendar = !$sessionStore.userTxShowCalendar}
            >
              <img
                src={calendar}
                alt='Calendar Icon'
                title='Select specific date'
              />
            </div>

            <!--
            CALENDAR POP-UP
            -->
            {#if $sessionStore.userTxShowCalendar}
              <WidgetCalendar />
            {/if}

          </div>

        </div>

      </div>

      <!--
      USER TRANSACTION HISTORY TABLE
      -->
      <div
        id="profile/widget/tx-history/inner/table-box"
        class=
        "
          m-b-16
        "
      >

        <table
          id="profile/widget/tx-history/inner/table"
        >
          <thead>
            <tr
              id="row-head"
            >
              <!--
              ID
              -->
              <th>
                <p>
                  {RESPONSE_PROFILE_DATA?.tx?.fields?.id ?? 'ID'}
                </p>
              </th>

              <!--
              📱 MOBILE
              DATE + WALLET ADRRESS
              -->
              {#if mobileExclusive}
                <th
                  style=
                  "
                  width: 100%;
                  "
                >
                  <p>
                    {'Date, Address:'}
                  </p>
                </th>
              {/if}

              <!--
              🖥️ LAPTOP
              -->
              {#if !mobileExclusive}

                <!--
                DATE
                -->
                <th>
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.date ?? 'Date:'}
                  </p>
                </th>

                <!--
                TYPE
                -->
                <th
                  style=
                  "
                  width: 100%;
                  "
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.type ?? 'Type:'}
                  </p>
                </th>

                <!--
                ASSET
                -->
                <th>
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.asset ?? 'Asset:'}
                  </p>
                </th>

                <!--
                GATEWAY
                -->
                <th>
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.gateway ?? 'Gateway:'}
                  </p>
                </th>

                <!--
                QUANTITY
                -->
                <th>
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.quantity ?? 'Quantity:'}
                  </p>
                </th>

                <!--
                BTA
                -->
                <th>
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.bta ?? 'BTA:'}
                  </p>
                </th>

                <!--
                FEE
                -->
                <th>
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.fee ?? 'Fee:'}
                  </p>
                </th>

                <!--
                WALLET ADDR
                -->
                <th>
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.wallet ?? 'Wallet Address:'}
                  </p>
                </th>

              {/if}

              <!--
              STATUS
              -->
              <th
                style="text-align: -webkit-right;"
              >
                <p>
                  {RESPONSE_PROFILE_DATA?.tx?.fields?.status ?? 'Status:'}
                </p>
              </th>

            </tr>
          </thead>

          <tbody>

            <!-- [🐞] -->

            {#each { length: 5 } as _}
              <WidgetTxHistRow
                tx_data={WIDGET_DATA?.tx_hist[0]}
                {mobileExclusive}
                txTranslation={RESPONSE_PROFILE_DATA?.tx?.fields}
              />
            {/each}


            <!-- {#each txHistList as item}
              <WidgetTxHistRow
                tx_data={item}
                {mobileExclusive}
                txTranslation={RESPONSE_PROFILE_DATA?.tx?.fields}
              />
            {/each} -->

          </tbody>
        </table>

        <!--
        SHOW MORE OPT
        -->
        <div
          id="profile/widget/tx-history/inner/table-show-more"
          class=
          "
          text-center
          cursor-pointer
          "
          on:click={() => isShowMore = !isShowMore}
        >
          <p
            class=
            "
            s-14
            w-500
            color-primary
            "
          >
            {RESPONSE_PROFILE_DATA?.tx?.show_more ?? 'Show more'}
          </p>
        </div>

      </div>

      <!--
      ADDITIONAL NOTE
      -->
      <div
        id="profile/widget/tx-history/inner/additional-info-box"
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
          {RESPONSE_PROFILE_DATA?.tx?.subtitle ?? 'Please review:'}
        </p>
        <p
          class=
          "
            s-12
            color-grey
          "
        >
          {RESPONSE_PROFILE_DATA?.tx?.information}
        </p>
      </div>

    {/if}

  </div>

{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	div#profile\/widget\/tx-history-outer
  {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;
	}

  div#profile\/widget\/tx-history\/inner\/no-tx-hist-data-box
  {
    position: relative;
    height: 362px;
  }
  div#profile\/widget\/tx-history\/inner\/no-tx-hist-data-box div#no-tx-hist-data\/content
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

  div#profile\/widget\/tx-history\/inner\/date-filter-1
  {
    padding: 4px;
    border-radius: 4px;
    background: var(--light-gray-night, #616161);
  }
  div#profile\/widget\/tx-history\/inner\/date-filter-1 div.common-date-box
  {
    height: 32px;
    padding: 6px 12px;
    border-radius: 4px;
  }
  div#profile\/widget\/tx-history\/inner\/date-filter-1 div.common-date-box.selected_date
  {
    background: var(--white-night, #4B4B4B);
    backdrop-filter: blur(10px);
  }
  div#profile\/widget\/tx-history\/inner\/date-filter-1 div.common-date-box p:hover
  {
    color: var(--white) !important;
  }

  div#profile\/widget\/tx-history\/inner\/date-filter-2
  {
    /* 📌 position */
    position: relative;
  }
  div#profile\/widget\/tx-history\/inner\/date-filter-2 div#activate-calendar
  {
    /* 🛝 layout */
    width: 40px;
    height: 40px;
    /* 🎨 style */
    padding: 6px 12px;
    border-radius: 4px;
    background: var(--light-gray-night, #616161);
    backdrop-filter: blur(10px);
  }

  table#profile\/widget\/tx-history\/inner\/table
  {
    text-align: left;
		border-collapse: collapse;
    width: -webkit-fill-available;
  }
  table#profile\/widget\/tx-history\/inner\/table thead tr#row-head
  {
    border-radius: 2px;
    background: var(--dark-theme-1-shade);
  }
  table#profile\/widget\/tx-history\/inner\/table thead tr#row-head th
  {
    width: fit-content;
    white-space: nowrap;
    padding-right: 12px;
  }
  table#profile\/widget\/tx-history\/inner\/table thead tr#row-head th:first-child
  {
    padding-left: 20px;
    border-radius: 2px 0 0 2px;
  }
  table#profile\/widget\/tx-history\/inner\/table thead tr#row-head th:last-child
  {
    padding-right: 20px;
    border-radius: 0 2px 2px 0;
  }
  table#profile\/widget\/tx-history\/inner\/table thead tr#row-head th p
  {
    color: var(--semi-black-night, #A8A8A8);
    /* body/12px */
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 18px */
    padding: 3px 0 3px 0;
    width: fit-content;
  }
  :global(table#profile\/widget\/tx-history\/inner\/table tbody tr:nth-child(odd))
  {
    background-color: var(--dark-theme-1);
  }
  :global(table#profile\/widget\/tx-history\/inner\/table tbody tr:nth-child(even))
  {
    background-color: var(--dark-theme-1-shade)
  }

  div#profile\/widget\/tx-history\/inner\/table-show-more
  {
    padding: 18px 0 18px 0;
    border-bottom: 1px solid var(--light-gray-night, #616161);
  }

  /*
  =============
  📱 RESPONSIVNESS
  =============
  */

  @media only screen
  and (min-width: 726px)
  {
    :global(table#profile\/widget\/tx-history\/inner\/table tbody tr td)
    {
      padding-right: 40px;
    }
    :global(table#profile\/widget\/tx-history\/inner\/table tbody tr td:first-child)
    {
      padding-left: 12px;
    }
    :global(table#profile\/widget\/tx-history\/inner\/table tbody tr td:last-child)
    {
      padding-right: 12px;
    }
  }

  /*
  =============
  🌒 DARK-THEME
  =============
  */

</style>