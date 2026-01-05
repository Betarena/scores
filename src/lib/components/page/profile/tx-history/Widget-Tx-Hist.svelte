<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { daysInMonth, targetDate, toISOMod } from '$lib/utils/dates.js';
	import { dlog } from '$lib/utils/debug.js';
	import { get_v1 } from '$lib/utils/fetch.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';

	import WidgetCalendar from './Widget-Calendar.svelte';
	import WidgetTxHistLoader from './Widget-Tx-Hist-Loader.svelte';
	import WidgetTxHistRow from './Widget-Tx-Hist-Row.svelte';

	import icon_calendar_selected from '../assets/menu-opt/calendar-selected.svg';
	import icon_calendar from '../assets/menu-opt/calendar.svg';
	import icon_tx_hist from '../assets/menu-opt/tx-hist-selected.svg';

	import type { IScoresEndpointProfileMain } from '$lib/types/endpoint.js';
	import type { B_H_TH } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { B_PROF_D, B_PROF_T } from '@betarena/scores-lib/types/profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    VIEWPORT_TABLET_INIT = 912,
    VIEWPORT_MOBILE_INIT = 581,
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'profile⮕w⮕txhist'
  ;

	let
    isViewMobile: boolean = false,
    isViewTablet: boolean = false;
  ;

  let
    RESPONSE_PROFILE_DATA: B_PROF_T,
    WIDGET_DATA: B_PROF_D,
    NO_WIDGET_DATA: boolean,
    selectedDateFilterOpt1: 'Last 7 Days' | 'Last Month' | 'Last 6 Months' = 'Last 7 Days',
    isShowMore: boolean = false,
    // isShowCalendar: boolean = false,
    txHistList: B_H_TH[] = [],
    LIST_LIMIT_DEFAULT: number = 10,
    txHistListLimit: number = 10,
    calendarIcon: string = icon_calendar
  ;

  $: RESPONSE_PROFILE_DATA = $page.data?.RESPONSE_PROFILE_DATA ?? { };


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

    const response = await get_v1
    <
      IScoresEndpointProfileMain['request']['query'],
      IScoresEndpointProfileMain['response']
    >
    (
			{
        endpoint: '/api/data/profile.main',
        objParameters:
        {
          uid: $userBetarenaSettings?.user?.firebase_user_data?.uid
        }
      }
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

    // [🐞]
    dlog
    (
      `🔹 [var] fromDate ${fromDate}`
    );
    dlog
    (
      `🔹 [var] toDate ${toDate}`
    );

    txHistList = WIDGET_DATA?.tx_hist
    ?.filter
    (
      x =>
      {
        return new Date(toISOMod(x?.date)).getTime() >= new Date(toISOMod(fromDate)).getTime()
          && new Date(toISOMod(x?.date)).getTime() <= new Date(toISOMod(toDate)).getTime()
      }
    );

    // [🐞]
    dlog
    (
      `🔹 [var] ➤ txHistList?.length ${txHistList?.length}`,
      true
    );

    txHistListLimit = LIST_LIMIT_DEFAULT;

    isShowMore = false;

    txHistList = txHistList;
  }

  /**
   * @description
   * TODO: DOC:
   */
  function applyDateRangeFilter1
  (
    opt: "Last 7 Days" | "Last Month" | "Last 6 Months"
  ): void
  {

    // NOTE:
    // Reset 'store' param. used by 'calendar' widget,
    // indicating 'custom date selection' is no longer
    // predominant filter.
    $sessionStore.userTxHistDateSelect = undefined;

    selectedDateFilterOpt1 = opt;

    if (opt == 'Last 7 Days')
    {
      // [🐞]
      dlog
      (
        `🚏 checkpoint - applyDateRangeFilter1 - Last 7 Days`,
        true
      );

      $sessionStore.userTxHistFilterDateRange =
      {
        from: targetDate
        (
          -7
        ),
        to: targetDate()
      }

      isShowMore = false;
    }

    if (opt == 'Last Month')
    {
      // [🐞]
      dlog
      (
        `🚏 checkpoint - applyDateRangeFilter1 - Last Month`,
        true
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

      const fromDate = new Date(_lastMonthDate);
      const toDate = new Date(_lastMonthDate);

      fromDate.setDate(1);
      toDate.setDate(_daysInPastMonth);

      const _from: Date = fromDate;
      const _to: Date = toDate;

      $sessionStore.userTxHistFilterDateRange =
      {
        from: _from,
        to: _to
      };

      isShowMore = false;
    }

    if (opt == 'Last 6 Months')
    {
      // [🐞]
      dlog
      (
        `🚏 checkpoint - applyDateRangeFilter1 - Last 6 Months`,
        true
      );

      const _last6MonthDate: Date = new Date();
      _last6MonthDate.setMonth(_last6MonthDate.getMonth() - 6);

      const _daysInPastMonth: number = daysInMonth
      (
        (_last6MonthDate.getMonth() + 1),
        _last6MonthDate.getFullYear()
      );

      const fromDate = new Date(_last6MonthDate);
      const toDate = new Date();

      fromDate.setDate(1);
      toDate.setDate(1);

      const _from: Date = fromDate;
      const _to: Date = toDate;

      $sessionStore.userTxHistFilterDateRange =
      {
        from: _from,
        to: _to
      };

      isShowMore = false;
    }

  }

  /**
   * @description
   * TODO: DOC:
   */
  function showMoreToggle
  (
  ): void
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ showMoreToggle`,
      true
    );

    txHistListLimit = WIDGET_DATA?.tx_hist?.length;
    isShowMore = true;
  }

  /**
   * IMPORTANT
   * @description
   * TODO: DOC:
   */
  function resizeAction
  (
  ): void
  {
    [
      isViewTablet,
      isViewMobile
    ] =	viewport_change
    (
      VIEWPORT_TABLET_INIT,
      VIEWPORT_MOBILE_INIT
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
    && selectedDateFilterOpt1 != undefined
  ;
  $: if (if_R_1)
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ TxHist if_R_1`,
      true
    );

    applyDateRangeFilter1
    (
      selectedDateFilterOpt1
    );
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
    dlog
    (
      `🚏 checkpoint ➤ TxHist if_R_0`,
      true
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

<!-- <WidgetTxHistLoader /> -->

<!--
MAIN DEPOST WIDGET
-->
{#await widgetInit()}
  <WidgetTxHistLoader />
{:then value}

  <div
    id="{CNAME}⮕main"
    data-testid="{CNAME}⮕main"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!--
    NO WIDGET DATA
    -->
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
        id="{CNAME}⮕main⮕no-widget-data⮕content-box"
        data-testid="{CNAME}⮕main⮕no-widget-data⮕content-box"
      >
        <div
          id="{CNAME}⮕main⮕no-widget-data⮕content"
          data-testid="{CNAME}⮕main⮕no-widget-data⮕content"
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

    <!--
    MAIN WIDGET DATA
    -->
    {#if WIDGET_DATA?.tx_hist?.length > 0}

      <!--
      TOP WIGET ROW
      -->
      <div
        class:row-space-out-top={!isViewMobile}
        class:column-space-start={isViewMobile}
      >

        <!--
        1st COLUMN
        -->
        <div
          class:m-b-16={isViewMobile}
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
            {RESPONSE_PROFILE_DATA?.tx?.title ?? 'Transaction History'}
          </h2>

          <!--
          WIDGET DESCRIPTION
          -->
          <div
            id="{CNAME}⮕main⮕desc-box"
            data-testid="{CNAME}⮕main⮕desc-box"
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
          class:width-auto={!isViewMobile}
          class:m-b-16={isViewMobile}
        >

          <!--
          COMMON DATES FILTER
          -->
          <div
            id="{CNAME}⮕main⮕date-filter-1"
            data-testid="{CNAME}⮕main⮕date-filter-1"
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
              id="{CNAME}⮕main⮕date-filter-1⮕opt-1"
              data-testid="{CNAME}⮕main⮕date-filter-1⮕opt-1"
              title='Show last 7 Days'
              class=
              "
              common-date-box
              cursor-pointer
              "
              class:selected_date={selectedDateFilterOpt1 == 'Last 7 Days' && $sessionStore.userTxHistDateSelect == undefined}
              on:click={() => applyDateRangeFilter1('Last 7 Days')}
            >
              <p
                class=
                "
                s-14
                color-grey
                no-wrap
                "
                class:color-black-2={selectedDateFilterOpt1 == 'Last 7 Days' && $sessionStore.userTxHistDateSelect == undefined}
              >
                {#if isViewMobile}
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
              id="{CNAME}⮕main⮕date-filter-1⮕opt-2"
              data-testid="{CNAME}⮕main⮕date-filter-1⮕opt-2"
              title='Show last month'
              class=
              "
              common-date-box
              cursor-pointer
              "
              class:selected_date={selectedDateFilterOpt1 == 'Last Month' && $sessionStore.userTxHistDateSelect == undefined}
              on:click={() => applyDateRangeFilter1('Last Month')}
            >
              <p
                class=
                "
                s-14
                color-grey
                no-wrap
                "
                class:color-black-2={selectedDateFilterOpt1 == 'Last Month' && $sessionStore.userTxHistDateSelect == undefined}
              >
                {#if isViewMobile}
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
              id="{CNAME}⮕main⮕date-filter-1⮕opt-3"
              data-testid="{CNAME}⮕main⮕date-filter-1⮕opt-3"
              title='Show last 6 months'
              class=
              "
              common-date-box
              cursor-pointer
              "
              class:selected_date={selectedDateFilterOpt1 == 'Last 6 Months' && $sessionStore.userTxHistDateSelect == undefined}
              on:click={() => applyDateRangeFilter1('Last 6 Months')}
            >
              <p
                class=
                "
                s-14
                color-grey
                no-wrap
                "
                class:color-black-2={selectedDateFilterOpt1 == 'Last 6 Months' && $sessionStore.userTxHistDateSelect == undefined}
              >
                {#if isViewMobile}
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
            id="{CNAME}⮕main⮕date-filter-2"
            data-testid="{CNAME}⮕main⮕date-filter-2"
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
              id="{CNAME}⮕main⮕date-filter-2⮕calendar-box"
              data-testid="{CNAME}⮕main⮕date-filter-2⮕calendar-box"
              class=
              "
              column-space-center
              cursor-pointer
              "
              class:selected={$sessionStore.userTxHistDateSelect != undefined}
              on:mouseover={(e) => e.currentTarget.children[0].src = icon_calendar_selected}
              on:mouseleave={(e) => { if ($sessionStore.userTxHistDateSelect == undefined) e.currentTarget.children[0].src = icon_calendar }}
              on:click={() => $sessionStore.userTxShowCalendar = !$sessionStore.userTxShowCalendar}
            >
              <img
                src={$sessionStore.userTxHistDateSelect != undefined ? icon_calendar_selected : icon_calendar}
                alt='Calendar Icon'
                title='Select specific date'
              />
            </div>

            <!--
            CALENDAR POP-UP
            -->
            {#if $sessionStore.userTxShowCalendar}
              <WidgetCalendar bind:show={$sessionStore.userTxShowCalendar} bind:dateRange={$sessionStore.userTxHistFilterDateRange} bind:dateSelect={$sessionStore.userTxHistDateSelect} />
            {/if}

          </div>

        </div>

      </div>

      <!--
      USER TRANSACTION HISTORY TABLE
      [+] PLAYWRIGHT TESTED
      -->
      <div
        id="{CNAME}⮕main⮕table-outline"
        data-testid="{CNAME}⮕main⮕table-outline"
        class=
        "
        m-b-16
        "
      >

        <table
          id="{CNAME}⮕main⮕table"
          data-testid="{CNAME}⮕main⮕table"
        >
          <thead>
            <tr
            >
              <!--
              ID
              -->
              <th
                id="col-tx-id"
                data-testid="col-tx-id"
              >
                <p>
                  {RESPONSE_PROFILE_DATA?.tx?.fields?.id ?? 'ID'}
                </p>
              </th>

              <!--
              📱 MOBILE
              DATE + WALLET ADRRESS
              -->
              {#if isViewMobile || isViewTablet}
                <th
                  id="col-tx-date-address"
                  data-testid="col-tx-date-address"
                >
                  <p>
                    {'Date, Address:'}
                  </p>
                </th>
              {/if}

              <!--
              🖥️ LAPTOP
              -->
              {#if !isViewMobile && !isViewTablet}

                <!--
                DATE
                -->
                <th
                  id="col-tx-date"
                  data-testid="col-tx-date"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.date ?? 'Date:'}
                  </p>
                </th>

                <!--
                TYPE
                -->
                <th
                  id="col-tx-type"
                  data-testid="col-tx-type"
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
                <th
                  id="col-tx-asset"
                  data-testid="col-tx-asset"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.asset ?? 'Asset:'}
                  </p>
                </th>

                <!--
                GATEWAY
                -->
                <th
                  id="col-tx-gateway"
                  data-testid="col-tx-gateway"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.gateway ?? 'Gateway:'}
                  </p>
                </th>

                <!--
                QUANTITY
                -->
                <th
                  id="col-tx-quantity"
                  data-testid="col-tx-quantity"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.quantity ?? 'Quantity:'}
                  </p>
                </th>

                <!--
                BTA
                -->
                <th
                  id="col-tx-bta"
                  data-testid="col-tx-bta"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.bta ?? 'BTA:'}
                  </p>
                </th>

                <!--
                FEE
                -->
                <th
                  id="col-tx-fee"
                  data-testid="col-tx-fee"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.fee ?? 'Fee:'}
                  </p>
                </th>

                <!--
                WALLET ADDR
                -->
                <th
                  id="col-tx-wallet"
                  data-testid="col-tx-wallet"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.wallet ?? 'Wallet Address:'}
                  </p>
                </th>

              {/if}

              <!--
              💻 TABLET
              -->
              {#if !isViewMobile && isViewTablet}

                <!--
                TYPE
                -->
                <th
                  id="col-tx-type"
                  data-testid="col-tx-type"
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
                <th
                  id="col-tx-asset"
                  data-testid="col-tx-asset"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.asset ?? 'Asset:'}
                  </p>
                </th>

                <!--
                QUANTITY
                -->
                <th
                  id="col-tx-quantity"
                  data-testid="col-tx-quantity"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.quantity ?? 'Quantity:'}
                  </p>
                </th>

                <!--
                FEE
                -->
                <th
                  id="col-tx-fee"
                  data-testid="col-tx-fee"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.tx?.fields?.fee ?? 'Fee:'}
                  </p>
                </th>

              {/if}

              <!--
              STATUS
              -->
              <th
                id="col-tx-status"
                data-testid="col-tx-status"
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

            <!-- {#each { length: 1 } as _}
              <WidgetTxHistRow
                tx_data={WIDGET_DATA?.tx_hist[0]}
                {isViewMobile}
                {isViewTablet}
                txTranslation={RESPONSE_PROFILE_DATA?.tx?.fields}
                txStatusTrans={RESPONSE_PROFILE_DATA?.tx?.status}
              />
            {/each} -->

            {#each txHistList.slice(0, txHistListLimit) as item}
              <WidgetTxHistRow
                tx_data={item}
                {isViewMobile}
                {isViewTablet}
                txTranslation={RESPONSE_PROFILE_DATA?.tx?.fields}
                txStatusTrans={RESPONSE_PROFILE_DATA?.tx?.status}
                txTypeTrans={RESPONSE_PROFILE_DATA?.tx?.types}
              />
            {/each}

          </tbody>
        </table>

        <!--
        SHOW MORE OPT
        -->
        {#if txHistList?.length > 10 && !isShowMore}
          <div
            id="{CNAME}⮕main⮕table-show-more"
            data-testid="{CNAME}⮕main⮕table-show-more"
            class=
            "
            text-center
            cursor-pointer
            "
            on:click={() => showMoreToggle()}
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
        {/if}

        <!--
        CONTENT DIVIDER
        -->
        <div
          id="{CNAME}⮕divider"
          data-testid="{CNAME}⮕main⮕divider"
          class:isMoreTx={txHistList?.length <= 10}
        />

      </div>

      <!--
      ADDITIONAL NOTE
      -->
      <div
        id="{CNAME}⮕add-info"
        data-testid="{CNAME}⮕add-info"
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

{:catch error}
  <!-- NaN -->
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	div#profile⮕w⮕txhist⮕main
  {
    /* 🎨 style */
		padding: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
	}

  div#profile⮕w⮕txhist⮕main⮕no-widget-data⮕content-box
  {
    /* 📌 position */
    position: relative;
    /* 🛝 layout */
    height: 362px;
  }
  div#profile⮕w⮕txhist⮕main⮕no-widget-data⮕content
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

  div#profile⮕w⮕txhist⮕main⮕date-filter-1
  {
    /* 🎨 style */
    padding: 4px;
    border-radius: 4px;
    background: var(--whitev2);
  }
  div#profile⮕w⮕txhist⮕main⮕date-filter-1 div.common-date-box
  {
    /* 🎨 style */
    height: 32px;
    padding: 6px 12px;
    border-radius: 4px;
  }
  div#profile⮕w⮕txhist⮕main⮕date-filter-1 div.common-date-box.selected_date
  {
    /* 🎨 style */
    background: var(--white);
    backdrop-filter: blur(10px);
  }
  div#profile⮕w⮕txhist⮕main⮕date-filter-1 div.common-date-box.selected_date p,
  div#profile⮕w⮕txhist⮕main⮕date-filter-1 div.common-date-box p:hover
  {
    /* 🎨 style */
    color: var(--dark-theme) !important;
  }

  div#profile⮕w⮕txhist⮕main⮕date-filter-2
  {
    /* 📌 position */
    position: relative;
    /* 🛝 layout */
    max-width: 40px;
    min-width: 40px;
    min-height: 40px;
    max-height: 40px;
    /* 🎨 style */
    border-radius: 4px;
    background: var(--whitev2);
  }
  div#profile⮕w⮕txhist⮕main⮕date-filter-2⮕calendar-box
  {
    /* 🎨 style */
    width: auto;
    border-radius: 4px;
    padding: 6px 6px;
  }
  div#profile⮕w⮕txhist⮕main⮕date-filter-2⮕calendar-box.selected
  {
    /* 🎨 style */
    background: var(--white);
    backdrop-filter: blur(10px);
  }

  table#profile⮕w⮕txhist⮕main⮕table
  {
    /* 🎨 style */
    text-align: left;
		border-collapse: collapse;
    width: -webkit-fill-available;
  }
  table#profile⮕w⮕txhist⮕main⮕table thead tr
  {
    /* 🎨 style */
    border-radius: 2px;
    background: var(--whitev2);
  }
  table#profile⮕w⮕txhist⮕main⮕table thead tr th
  {
    /* 🛝 layout */
    width: fit-content;
    /* 🎨 style */
    white-space: nowrap;
    padding-right: 12px;
  }
  table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-id
  {
    /* 🎨 style */
    min-width: 50px;
  }
  table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-status
  {
    /* 🎨 style */
    min-width: 150px;
  }
  table#profile⮕w⮕txhist⮕main⮕table thead tr th:first-child
  {
    /* 🎨 style */
    padding-left: 20px;
    border-radius: 2px 0 0 2px;
  }
  table#profile⮕w⮕txhist⮕main⮕table thead tr th:last-child
  {
    /* 🎨 style */
    padding-right: 20px;
    border-radius: 0 2px 2px 0;
  }
  table#profile⮕w⮕txhist⮕main⮕table thead tr th p
  {
    /* 🛝 layout */
    width: fit-content;
    /* 🎨 style */
    color: var(--semi-black-night, #A8A8A8);
    font-family: Roboto;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding: 3px 0 3px 0;
  }
  :global(table#profile⮕w⮕txhist⮕main⮕table tbody tr:nth-child(odd))
  {
    /* 🎨 style */
    background-color: var(--white);
  }
  :global(table#profile⮕w⮕txhist⮕main⮕table tbody tr:nth-child(even))
  {
    /* 🎨 style */
    background-color: var(--whitev2)
  }

  div#profile⮕w⮕txhist⮕main⮕table-show-more
  {
    /* 🎨 style */
    padding: 18px 0 18px 0;
  }

  div#profile⮕w⮕txhist⮕divider
  {
    /* 🎨 style */
    border-bottom: 1px solid var(--grey-color);
  }
  div#profile⮕w⮕txhist⮕divider.isMoreTx
  {
    /* 🎨 style */
    padding: 18px 0 18px 0;
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

  @media only screen
  and (min-width: 581px)
  {
    table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-quantity
    {
      /* 🎨 style */
      min-width: 70px;
    }
    table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-fee
    {
      /* 🎨 style */
      min-width: 50px;
    }
    table#profile⮕w⮕txhist⮕main⮕table thead tr th:first-child,
    :global(table#profile⮕w⮕txhist⮕main⮕table tbody tr td:first-child)
    {
      /* 🎨 style */
      padding-left: 12px !important;
    }
    table#profile⮕w⮕txhist⮕main⮕table thead tr th:last-child,
    :global(table#profile⮕w⮕txhist⮕main⮕table tbody tr td:last-child)
    {
      /* 🎨 style */
      padding-right: 12px !important;
    }
  }

  @media only screen
  and (min-width: 912px)
  {
    table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-id
    {
      /* 🎨 style */
      padding-right: 20px;
      min-width: 12px;
    }
    table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-date
    {
      /* 🎨 style */
      padding-right: 20px;
      min-width: 90px;
    }
    table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-wallet
    {
      /* 🎨 style */
      min-width: 130px;
    }
    table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-status
    {
      /* 🎨 style */
      min-width: 105px;
    }
    table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-quantity
    {
      /* 🎨 style */
      min-width: 60px;
    }
    table#profile⮕w⮕txhist⮕main⮕table thead tr th#col-tx-bta
    {
      /* 🎨 style */
      min-width: 50px;
    }
  }

  /*
  =============
  🌒 DARK-THEME
  =============
  */

  div#profile⮕w⮕txhist⮕main.dark-background-1 div#profile⮕w⮕txhist⮕main⮕date-filter-1
  {
    /* 🎨 style */
    background: var(--dark-theme-1-shade);
  }
  div#profile⮕w⮕txhist⮕main.dark-background-1 div#profile⮕w⮕txhist⮕main⮕date-filter-1 div.common-date-box.selected_date
  {
    /* 🎨 style */
    background: var(--dark-theme-1);
  }
  div#profile⮕w⮕txhist⮕main.dark-background-1 div#profile⮕w⮕txhist⮕main⮕date-filter-1 div.common-date-box.selected_date p,
  div#profile⮕w⮕txhist⮕main.dark-background-1 div#profile⮕w⮕txhist⮕main⮕date-filter-1 div.common-date-box p:hover
  {
    /* 🎨 style */
    color: var(--white) !important;
  }

  div#profile⮕w⮕txhist⮕main.dark-background-1 div#profile⮕w⮕txhist⮕main⮕date-filter-2
  {
    /* 🎨 style */
    background: var(--dark-theme-1-shade);
  }
  div#profile⮕w⮕txhist⮕main.dark-background-1 div#profile⮕w⮕txhist⮕main⮕date-filter-2⮕calendar-box.selected
  {
    /* 🎨 style */
    background: var(--dark-theme-1);
  }

  div#profile⮕w⮕txhist⮕main.dark-background-1 table#profile⮕w⮕txhist⮕main⮕table thead tr
  {
    /* 🎨 style */
    background: var(--dark-theme-1-shade);
  }

  div#profile⮕w⮕txhist⮕main.dark-background-1 :global(table#profile⮕w⮕txhist⮕main⮕table tbody tr:nth-child(odd))
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }
  div#profile⮕w⮕txhist⮕main.dark-background-1 :global(table#profile⮕w⮕txhist⮕main⮕table tbody tr:nth-child(even))
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-shade)
  }

  div#profile⮕w⮕txhist⮕main.dark-background-1 :global(table#profile⮕w⮕txhist⮕main⮕table tbody tr td p)
  {
    /* style */
    color: var(--white);
  }

  div#profile⮕w⮕txhist⮕main.dark-background-1 div#profile⮕w⮕txhist⮕divider
  {
    /* 🎨 style */
    border-bottom: 1px solid var(--dark-theme-1-shade);
  }

</style>