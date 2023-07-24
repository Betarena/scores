<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import BronzeCup from './assets/_BronzeCup.svelte';
	import GoldCup from './assets/_GoldCup.svelte';
	import SilverCup from './assets/_SilverCup.svelte';
	import FeaturedSiteRow from './FeatBetSite-Row.svelte';

	import sessionStore from '$lib/store/session.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';
	import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let B_FEATB_T: B_FEATB_T;

  const MOBILE_VIEW = 767;
	const TABLET_VIEW = 767;

	let mobileExclusive = false;
  let tabletExclusive = false;

	let staticViewRow: number;
	let limitViewRow: number = 5;
	let showMore: boolean = false;
	let displayShowMore: boolean = false;
	let trueLengthOfArray: number;

  trueLengthOfArray = $sessionStore?.sportbook_list?.length;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

	function toggleFullList
  (
  )
  {
		showMore = !showMore;
		if (limitViewRow == trueLengthOfArray)
    {
			limitViewRow = staticViewRow;
			return;
		}
		limitViewRow = trueLengthOfArray;
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

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // TODO:
	$: if (tabletExclusive)
  {
		if (trueLengthOfArray > 10)
    {
			displayShowMore = true;
			staticViewRow = 10;
			limitViewRow = 10;
		}
	}
  else
  {
		if (trueLengthOfArray > 5)
    {
			displayShowMore = true;
			staticViewRow = 5;
			limitViewRow = 5;
		}
	}

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

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

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
FEATURED BETTING SITES WIDGET
-->
<div>

  <WidgetTitle
    WIDGET_TITLE={B_FEATB_T?.translations?.widget_title}
  />

  <div
    id="featured-list-container"
    class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
  >

    <!--
    TOP 3 BETSITES
    -->
    {#if !tabletExclusive}

      <div
        id="feature-rank-display"
        in:fade
      >

        <!--
        RANK 2
        -->
        <a
          target="_blank"
          rel="noreferrer"
          href={$sessionStore?.sportbook_list?.[1]?.register_link}
        >
          <div
            id="featured-rank"
            style="margin-top: 20px;"
          >
            <SilverCup
              imageURL={$sessionStore?.sportbook_list?.[1]?.image}
            />

            <!-- [ℹ] Featured Image Details
            -->
            <p
              class="x-large color-black site-name"
              class:color-white={$userBetarenaSettings.theme == 'Dark'}
            >
              {$sessionStore?.sportbook_list?.[1]?.title}
            </p>
            <p class="large color-grey">
              Rank {$sessionStore?.sportbook_list?.[1]?.position}
            </p>
          </div>
        </a>

        <!--
        RANK 1
        -->
        <a
          target="_blank"
          rel="noreferrer"
          href={$sessionStore?.sportbook_list?.[0]?.register_link}
        >
          <div
            id="featured-rank"
            style="margin-bottom: 20px;"
          >
            <GoldCup
              imageURL={$sessionStore?.sportbook_list?.[0]?.image}
            />

            <!--
            Featured Image Details
            -->
            <p
              class="
                x-large
                color-black
                site-name
              "
              class:color-white={$userBetarenaSettings.theme == 'Dark'}
            >
              {$sessionStore?.sportbook_list?.[0]?.title}
            </p>
            <p
              class="
                large
                color-grey
              ">
              Rank {$sessionStore?.sportbook_list?.[0]?.position}
            </p>
          </div>
        </a>

        <!--
        RANK 3
        -->
        <a
          target="_blank"
          rel="noreferrer"
          href={$sessionStore?.sportbook_list?.[2]?.register_link}
        >
          <div
            id="featured-rank"
            style="margin-top: 20px;"
          >
            <BronzeCup
              imageURL={$sessionStore?.sportbook_list?.[2]?.image}
            />

            <!--
            Featured Image Details
            -->
            <p
              class="
                x-large
                color-black
                site-name
              "
              class:color-white={$userBetarenaSettings.theme ==	'Dark'}
            >
              {$sessionStore?.sportbook_list?.[2]?.title}
            </p>

            <p
              class="
                large
                color-grey
              ">
              Rank {$sessionStore?.sportbook_list?.[2].position}
            </p>

          </div>
        </a>

      </div>

    {/if}

    <!--
    TITLE BOX
    -->
    <p
      id="title-box"
      class="
        w-500
        w-normal
        large
      "
    >
      {B_FEATB_T?.translations?.title}
    </p>

    <!--
    BETSITES ROW LIST
    -->
    {#each $sessionStore?.sportbook_list?.slice(0, limitViewRow) || [] as item}
      <FeaturedSiteRow
        data={item}
        {B_FEATB_T}
      />
    {/each}

    <!--
    SHOW MORE / LESS
    -->
    {#if displayShowMore}
      <div>
        <p
          id="show-more-box"
          on:click={() => toggleFullList()}
        >
          {#if !showMore}
            {B_FEATB_T
              .translations.show_more_less[1]}
          {:else}
            {B_FEATB_T
              .translations.show_more_less[0]}
          {/if}
        </p>
      </div>
    {:else}
      <p
        id="show-more-box"
        style="padding: 5px; box-shadow: none;"
      />
    {/if}

  </div>

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	#featured-list-container
  {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
	}

	#title-box
  {
		padding: 24px 60px 20px 60px;
		text-align: center;
		white-space: nowrap;
		font-weight: 500;
	}

	#show-more-box
  {
		padding: 25px 130px;
		text-align: center;
		white-space: nowrap;
		color: var(--primary);
		box-shadow: inset 0px 1px 0px #ebebeb;
		cursor: pointer;
	}

	/*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 767px)
  {
		#featured-rank
    {
			height: 257px;
			padding: 16px 39px;
			background: #f2f2f2;
			border-radius: 12px;
			justify-items: center;
			position: relative;
			text-align: center;
		}

		#feature-rank-display
    {
			display: grid;
			gap: 20px;
			grid-auto-flow: column;
			grid-template-columns: repeat(3, 1fr);
			justify-content: space-between;
			padding: 20px 20px 0 20px;
		}

		#featured-list-container
    {
			min-width: 100%;
		}
	}

	@media only screen
  and (min-width: 1024px)
  {
		#featured-rank
    {
			padding: 16px 8px;
		}

		#feature-rank-display
    {
			gap: 15px;
		}

		#featured-list-container
    {
			min-width: 100%;
		}

		p.site-name:hover
    {
			color: #f5620f;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	.dark-background-1 p#show-more-box
  {
		box-shadow: inset 0px 1px 0px #616161 !important;
	}

	.dark-background-1 div#featured-rank
  {
		background-color: #616161;
	}

	.dark-background-1 p#title-box
  {
		color: #ffffff;
	}

</style>
