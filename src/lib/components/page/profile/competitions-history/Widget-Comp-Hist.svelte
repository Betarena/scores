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
	import { get } from '$lib/api/utils.js';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog } from '$lib/utils/debug.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';
	import { PROF_U_competitionTitle } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';
	import { onMount } from 'svelte';

	import WidgetTxHistLoader from './Widget-Comp-Hist-Loader.svelte';
	import WidgetTxHistRow from './Widget-Comp-Hist-Row.svelte';

	import icon_tx_hist from '../assets/menu-opt/tx-hist-selected.svg';

	import type { B_H_COMP_DATA } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { B_PROF_D, B_PROF_T } from '@betarena/scores-lib/types/profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const
    VIEWPORT_TABLET_INIT = 912,
    VIEWPORT_MOBILE_INIT = 581,
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'profile⮕w⮕comp-hist'
  ;

	let
    isViewMobile: boolean = false,
    isViewTablet: boolean = false,
    RESPONSE_PROFILE_DATA: B_PROF_T,
    WIDGET_DATA: B_PROF_D,
    NO_WIDGET_DATA: boolean,
    isShowMore: boolean = true,
    // isShowCalendar: boolean = false,
    txHistList: B_H_COMP_DATA[] = [],
    txHistListLimit: number = 10
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
    // ### IMPORTANT
    if (!browser) return;

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
   */
  function showMoreToggle
  (
  ): void
  {
    // ### [🐞]
    dlog
    (
      `🚏 checkpoint ➤ showMoreToggle`,
      true
    );

    txHistListLimit =
      txHistListLimit + 10 > WIDGET_DATA?.competitions?.length
        ? WIDGET_DATA?.competitions?.length
        : txHistListLimit + 10
    ;
    isShowMore =
      txHistListLimit + 10 > WIDGET_DATA?.competitions?.length
        ? false
        : true
    ;
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

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

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

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!-- <WidgetTxHistLoader /> -->

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
    {#if WIDGET_DATA?.competitions?.length == 0}

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
        {RESPONSE_PROFILE_DATA?.competition_hist?.title ?? 'Competition History'}
      </h2>

      <!--
      NO COMPETITIONS FOUND
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
            {`You have not taken part in any Competitions yet`}
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
    {#if WIDGET_DATA?.competitions?.length > 0}

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
            {RESPONSE_PROFILE_DATA?.competition_hist?.title ?? 'Competition History'}
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
              {RESPONSE_PROFILE_DATA?.competition_hist?.description ?? ''}
            </p>
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
              COMPETITION ➤ (COLUMN) ➤ ID
              -->
              <th
                id="col-tx-id"
                data-testid="col-tx-id"
              >
                <p>
                  {RESPONSE_PROFILE_DATA?.competition_hist?.header?.id ?? 'ID'}
                </p>
              </th>

              <!--
              COMPETITION ➤ (COLUMN) ➤ SPORT / DATE
              -->
              <th
                id="col-tx-date-address"
                data-testid="col-tx-date-address"
              >
                <p>
                  {RESPONSE_PROFILE_DATA?.competition_hist?.header?.sport ?? 'Sport / Date'}
                </p>
              </th>

              <!--
              💻 TABLET + 🖥️ LAPTOP
              -->
              {#if !isViewMobile}

                <!--
                COMPETITION ➤ (COLUMN) ➤ CONTEST TITLE / STYLE
                -->
                <th
                  id="col-tx-date"
                  data-testid="col-tx-date"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.contest_title ?? 'Contest Title / Style'}
                  </p>
                </th>

                <!--
                COMPETITION ➤ (COLUMN) ➤ ENTRY FEE
                -->
                <th
                  id="col-tx-type"
                  data-testid="col-tx-type"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.entry_fee ?? 'Entry Fee'}
                  </p>
                </th>

              {/if}

              <!--
              🖥️ LAPTOP
              -->
              {#if !isViewMobile && !isViewTablet}

                <!--
                COMPETITION ➤ (COLUMN) ➤ TOTAL PRIZES
                -->
                <th
                  id="col-tx-asset"
                  data-testid="col-tx-asset"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.total_prize ?? 'Total Prizes'}
                  </p>
                </th>

                <!--
                COMPETITION ➤ (COLUMN) ➤ POTENTIAL WIN
                -->
                <th
                  id="col-tx-gateway"
                  data-testid="col-tx-gateway"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.potential_win ?? 'Potential Win'}
                  </p>
                </th>

                <!--
                COMPETITION ➤ (COLUMN) ➤ FORECAST
                -->
                <th
                  id="col-tx-bta"
                  data-testid="col-tx-bta"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.forecast ?? 'Forecast'}
                  </p>
                </th>

                <!--
                COMPETITION ➤ (COLUMN) ➤ RESULT
                -->
                <th
                  id="col-tx-fee"
                  data-testid="col-tx-fee"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.result ?? 'Result'}
                  </p>
                </th>

                <!--
                COMPETITION ➤ (COLUMN) ➤ PRIZE WON
                -->
                <th
                  id="col-tx-wallet"
                  data-testid="col-tx-wallet"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.prize ?? 'Prize Won'}
                  </p>
                </th>

              {/if}

              <!--
              💻 TABLET
              -->
              {#if !isViewMobile && isViewTablet}

                <!--
                COMPETITION ➤ (COLUMN) ➤ POTENTIAL WIN / PRIZE WON
                -->
                <th
                  id="col-tx-gateway"
                  data-testid="col-tx-gateway"
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.potential_win ?? 'Potential Win'}
                    /
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.prize ?? 'Prize Won'}
                  </p>
                </th>

              {/if}

              <!--
              💻 TABLET + 🖥️ LAPTOP
              COMPETITION ➤ (COLUMN) ➤ STATUS (END)
              -->
              {#if !isViewMobile}

                <th
                  id="col-tx-status"
                  data-testid="col-tx-status"
                  class=
                  "
                  text-right
                  "
                  >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.status ?? 'Status'}
                  </p>
                </th>

              {/if}

              <!--
              📱 MOBILE
              COMPETITION ➤ (COLUMN) ➤ PRIZE WON (END)
              -->
              {#if isViewMobile}

                <th
                  id="col-tx-status"
                  data-testid="col-tx-status"
                  class=
                  "
                  text-right
                  "
                >
                  <p>
                    {RESPONSE_PROFILE_DATA?.competition_hist?.header?.prize ?? 'Prize Won'}
                  </p>
                </th>
              {/if}

            </tr>
          </thead>

          <tbody>

            <!-- [🐞] -->

            <!-- {#each { length: 1 } as _}
              <WidgetTxHistRow
                tx_data={WIDGET_DATA?.competitions[0]}
                {isViewMobile}
                {isViewTablet}
                txTranslation={RESPONSE_PROFILE_DATA?.tx?.fields}
                txStatusTrans={RESPONSE_PROFILE_DATA?.tx?.status}
              />
            {/each} -->

            {#each WIDGET_DATA?.competitions?.slice(0, txHistListLimit) ?? [] as item}
              <WidgetTxHistRow
                competitionObject={item}
                competitionTitle=
                {
                  PROF_U_competitionTitle
                  (
                    RESPONSE_PROFILE_DATA?.competition_general?.title
                    , item?.data?.target_team_name
                    , item?.data?.target_team_prediction_term
                    , RESPONSE_PROFILE_DATA?.competition_general?.prediction
                  )
                }
                {isViewMobile}
                {isViewTablet}
                translationObject={RESPONSE_PROFILE_DATA?.competition_hist}
                translationObject2={RESPONSE_PROFILE_DATA?.competition_general}
              />
            {/each}

          </tbody>
        </table>

        <!--
        SHOW MORE OPT
        -->
        {#if WIDGET_DATA?.competitions?.length > 10 && isShowMore}
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
          class:isMoreTx={WIDGET_DATA?.competitions?.length <= 10}
        />

      </div>

      <!--
      COMPETITION > ADDITIONAL NOTE
      -->
      <div
        id="{CNAME}⮕add-info"
        data-testid="{CNAME}⮕add-info"
        class=
        "
        m-b-12
        s-12
        global
        color-grey
        "
      >
        {@html RESPONSE_PROFILE_DATA?.competition_hist?.description_2 ?? ''}
      </div>

    {/if}

  </div>

{:catch error}
  <!-- NaN -->
{/await}

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

	div#profile⮕w⮕comp-hist⮕main
  {
    /* 🎨 style */
		padding: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
	}

  div#profile⮕w⮕comp-hist⮕main⮕no-widget-data⮕content-box
  {
    /* 📌 position */
    position: relative;
    /* 🛝 layout */
    height: 362px;
  }
  div#profile⮕w⮕comp-hist⮕main⮕no-widget-data⮕content
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

  table#profile⮕w⮕comp-hist⮕main⮕table
  {
    /* 🎨 style */
    text-align: left;
		border-collapse: collapse;
    width: -webkit-fill-available;
    width: -moz-available;
  }
  table#profile⮕w⮕comp-hist⮕main⮕table thead tr
  {
    /* 🎨 style */
    border-radius: 2px;
    background: var(--whitev2);
  }
  table#profile⮕w⮕comp-hist⮕main⮕table thead tr th
  {
    /* 🛝 layout */
    width: fit-content;
    /* 🎨 style */
    white-space: nowrap;
    padding-right: 12px;
  }
  table#profile⮕w⮕comp-hist⮕main⮕table thead tr th#col-tx-id
  {
    /* 🎨 style */
    min-width: 50px;
  }
  table#profile⮕w⮕comp-hist⮕main⮕table thead tr th#col-tx-status
  {
    /* 🎨 style */
    min-width: 150px;
  }
  table#profile⮕w⮕comp-hist⮕main⮕table thead tr th:first-child
  {
    /* 🎨 style */
    padding-left: 20px;
    border-radius: 2px 0 0 2px;
  }
  table#profile⮕w⮕comp-hist⮕main⮕table thead tr th:last-child
  {
    /* 🎨 style */
    padding-right: 20px;
    border-radius: 0 2px 2px 0;
  }
  table#profile⮕w⮕comp-hist⮕main⮕table thead tr th p
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
  :global(table#profile⮕w⮕comp-hist⮕main⮕table tbody tr:nth-child(odd))
  {
    /* 🎨 style */
    background-color: var(--white);
  }
  :global(table#profile⮕w⮕comp-hist⮕main⮕table tbody tr:nth-child(even))
  {
    /* 🎨 style */
    background-color: var(--whitev2)
  }

  div#profile⮕w⮕comp-hist⮕main⮕table-show-more
  {
    /* 🎨 style */
    padding: 18px 0 18px 0;
  }

  div#profile⮕w⮕comp-hist⮕divider
  {
    /* 🎨 style */
    border-bottom: 1px solid var(--grey-color);
  }
  div#profile⮕w⮕comp-hist⮕divider.isMoreTx
  {
    /* 🎨 style */
    padding: 18px 0 18px 0;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  and (min-width: 581px)
  {
    table#profile⮕w⮕comp-hist⮕main⮕table thead tr th:first-child,
    :global(table#profile⮕w⮕comp-hist⮕main⮕table tbody tr td:first-child)
    {
      /* 🎨 style */
      padding-left: 12px !important;
    }
    table#profile⮕w⮕comp-hist⮕main⮕table thead tr th:last-child,
    :global(table#profile⮕w⮕comp-hist⮕main⮕table tbody tr td:last-child)
    {
      /* 🎨 style */
      padding-right: 12px !important;
    }
  }

  @media only screen
  and (min-width: 912px)
  {
    table#profile⮕w⮕comp-hist⮕main⮕table thead tr th#col-tx-id
    {
      /* 🎨 style */
      padding-right: 20px;
      min-width: 12px;
    }
    table#profile⮕w⮕comp-hist⮕main⮕table thead tr th#col-tx-date
    {
      /* 🎨 style */
      padding-right: 20px;
      min-width: 90px;
    }
    table#profile⮕w⮕comp-hist⮕main⮕table thead tr th#col-tx-status
    {
      /* 🎨 style */
      min-width: 105px;
    }
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#profile⮕w⮕comp-hist⮕main.dark-background-1 table#profile⮕w⮕comp-hist⮕main⮕table thead tr
  {
    /* 🎨 style */
    background: var(--dark-theme-1-shade) !important;
  }

  div#profile⮕w⮕comp-hist⮕main.dark-background-1 :global(table#profile⮕w⮕comp-hist⮕main⮕table tbody tr:nth-child(odd))
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1) !important;
  }
  div#profile⮕w⮕comp-hist⮕main.dark-background-1 :global(table#profile⮕w⮕comp-hist⮕main⮕table tbody tr:nth-child(even))
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-shade) !important;
  }

  div#profile⮕w⮕comp-hist⮕main.dark-background-1 :global(table#profile⮕w⮕comp-hist⮕main⮕table tbody tr td p)
  {
    /* style */
    color: var(--white);
  }

  div#profile⮕w⮕comp-hist⮕main.dark-background-1 div#profile⮕w⮕comp-hist⮕divider
  {
    /* 🎨 style */
    border-bottom: 1px solid var(--dark-theme-1-shade);
  }

</style>