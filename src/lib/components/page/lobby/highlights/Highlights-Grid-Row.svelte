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

	import { createEventDispatcher, onMount, type EventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';

  import icon_slider_left from './assets/icon-slider-left.svg';
  import icon_slider_right from './assets/icon-slider-right.svg';

	import type { BetarenaUser } from '@betarena/scores-lib/types/_FIREBASE_.js';
	import type { B_COMP_HIGH_D, B_COMP_HIGH_D_EXTRA } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description TODO: DOC: */
    competitionList: B_COMP_HIGH_D[] = [],
    /** @description competition (main) - participants detailed data `Map` */
    participantsMap: Map < string, BetarenaUser >,
    /** @description TODO: DOC: */
    LIMITS: Map<B_COMP_HIGH_D_EXTRA, number>,
    /** @description TODO: DOC: */
    competitionType: 'pending' | 'active' | 'finished'
  ;

  const
    /** @description TODO: DOC: */
    VIEWPORT_TABLET_INIT = 912,
    /** @description TODO: DOC: */
    VIEWPORT_MOBILE_INIT = 581,
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'competition⮕w⮕highlights-grid',
    dispatch: EventDispatcher<any> = createEventDispatcher()
  ;

  let
    /** @description 📱 MOBILE viewport */
    isViewMobile: boolean = false,
    /** @description 💻 TABLET viewport */
    isViewTablet: boolean = false,
    /** @description dynamic import variable condition */
    useDynamicImport: boolean = true,
    /** @description dynamic import variable for svelte component */
    HighlightsMainDynamic: any,
    /** @description current slider position value */
    currentSlidePositionNumber: number = 0,
    /** @description current position of slider dot */
    slidePositionDotMirror: number = 1,
    /** @description previous position of slider dot */
    slideDirection: number = 0,
    /** @description number of carousel slide dots to be shown on 📱 MOBILE */
    sliderCount: number = 0,
    /** @description wether exists more than 5 limit */
    isOverLimitUI: boolean = false,
    /** @description **/
    triggerSlide2ndOppositesEffect: boolean = false,
    /** @description number of increments grid elements should slide by */
    incrementBy: number,
    /** @description target `this` component grid element `HTMLElement` */
    gridElement: HTMLElement,
    /** @description target `this` component gird inner element `HTMLElement` */
    gridChildElement: HTMLElement,
    /** @description target `this` component carousel element `HTMLElement` */
    carouselDotsElement: HTMLElement,
    /** @description show / hide on 🖥️ LAPTOP carousel buttons */
    showPrevNextBtns: boolean = false
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

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
    isViewTablet = isViewTablet;
    isViewMobile = isViewMobile;
  }

  /**
   * @summary
   * 🟥 MAIN | IMPORTANT
   *
   * @description
   * ⚡️ window (resize) event listener.
   *
   * @returns
   * `void`.
   */
  function addEventListeners
  (
  ): void
  {
    // ### NOTE:
    // ### (on-resize)
    window.addEventListener
    (
			'resize',
			function ()
      {
				resizeAction();
			}
		);

    let touchstartX: number = 0;
    let touchendX: number = 0;

    function checkDirection
    (
    ): void
    {
      if (touchstartX - touchendX <= 50 && touchstartX - touchendX >= -50) return;

      // console.log('touchstartX:', touchstartX)
      // console.log('touchendX:', touchendX)

      if (touchendX < touchstartX)
      {
        // alert('swiped left!')
        toggleCarousel(1)
      }
      if (touchendX > touchstartX)
      {
        // alert('swiped right!')
        toggleCarousel(-1)
      }
    }

    let disableScroll: boolean = false;

    // ### SEE:
    // ### https://stackoverflow.com/questions/9977876/two-fingered-scroll-js-on-touchpad
    function doScroll
    (
      e: WheelEvent
    ): void
    {

      if (disableScroll) return;

      // ### [🐞]
      console.log(`x:${e.deltaX} y:${e.deltaY}`);

      if (e?.deltaY != 0 || (e?.deltaX <= 5 && e?.deltaX >= -5)) return;

      if (e?.deltaX > 0)
        toggleCarousel(1);
      else
        toggleCarousel(-1);
      ;

      disableScroll = true;

      setTimeout
      (
        () =>
        {
          disableScroll = false;
        },
        1000
      );

      // ### NOTE:
      // ### disable the actual scrolling
      e.preventDefault();
    }

    const element: HTMLElement = gridElement;

    // ### NOTE:
    // ### on 'touchstart'.
    element.addEventListener
    (
      'touchstart',
      e =>
      {
        touchstartX = e?.changedTouches?.[0]?.screenX;
      }
    );

    // ### NOTE:
    // ### on 'touchend'.
    element.addEventListener
    (
      'touchend',
      e =>
      {
        touchendX = e?.changedTouches?.[0]?.screenX;
        checkDirection();
      }
    );

    // ### NOTE:
    // ### on 'wheel' (a.k.a scroll)
    element.addEventListener
    (
      'wheel',
      doScroll,
      false
    );

  }

  /**
   * @description
   * TODO: DOC:
   */
  function toggleCarousel
  (
    change: number
  ): void
  {

    // ### CHECK
    // ### for limit reach for list data in slider.
    const if_M_0: boolean =
      (currentSlidePositionNumber + change < 0)
      || (currentSlidePositionNumber + change + (change * incrementBy) > LIMITS?.get(competitionType))
    ;
    if (if_M_0) return;

    // ### NOTE:
    // ### initial position if 0, can only go between 0 - X, where X is positive integer.
    currentSlidePositionNumber += change;

    slideDirection = change;

    // ### NOTE:
    // ### mirror slider (dot carousel) change
    slidePositionDotMirror += change;

    const parentBox: HTMLElement = gridElement;

    const element: HTMLElement = gridChildElement;
    element.style.transform = `translateX(${(-parentBox.offsetWidth * currentSlidePositionNumber) - (currentSlidePositionNumber * 20)}px)`;

    dispatch
    (
      'load-more',
      {
        targetStatus: 'pending'
      }
    );

    // ### CHECK
    // ### for slider to be in a ±2 distance (middle)
    const if_M_1: boolean =
      carouselDotsElement
      && isOverLimitUI
      && ((currentSlidePositionNumber * incrementBy) - 2) > 0
      && ((currentSlidePositionNumber * incrementBy) + 2) < LIMITS?.get(competitionType)
    ;
    if (if_M_1)
    {
      // ### NOTE:
      // ### carousel (dot-slider) control.
      const carouselElement: HTMLElement = carouselDotsElement;

      setTimeout
      (
        () =>
        {
          carouselElement.style.transform = `translateX(${-change * 35}px)`;
          triggerSlide2ndOppositesEffect = true;
        },
        100
      );
      setTimeout
      (
        () =>
        {
          carouselElement.style.transform = `translateX(0px)`
          triggerSlide2ndOppositesEffect = false;
          slidePositionDotMirror = 3;
        },
        300
      );
    }

  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  $: if (!isViewTablet)
    incrementBy = 4;
  else if (isViewTablet && !isViewMobile)
    incrementBy = 2;
  else if (isViewTablet && isViewMobile)
    incrementBy = 1;
  ;

  // ### NOTE:
  // ### complex svelte-reactivity block.
  $:
  {
    sliderCount = Math.ceil(LIMITS?.get(competitionType) / incrementBy);
    if (!isViewTablet && sliderCount > 1)
    {
      sliderCount = 5 + 2;
      isOverLimitUI = true;
    }
    else if (sliderCount > 5)
    {
      sliderCount = 5 + 2;
      isOverLimitUI = true;
    }
    else
    {
      isOverLimitUI = false;
    }
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description
   * TODO: DOC:
  */
  onMount
  (
    async (
    ): Promise < void > =>
    {

      resizeAction();
      addEventListeners();

      if (useDynamicImport)
      {
        HighlightsMainDynamic = (await import('./Highlights-Main.svelte')).default;
      }

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

<!--
TARGET COMPETITIONS VIEW
-->
<!-- <h2>Open</h2> -->

<div
  id="{CNAME}⮕competitions-outer"
  class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
  on:mouseover={() => showPrevNextBtns = true}
  on:mouseleave={() => showPrevNextBtns = false}
>

  <!--
  🖥️ LAPTOP
  PREVIOUS SLIDE TOGGLE
  -->
  {#if !isViewTablet && showPrevNextBtns && isOverLimitUI}

    <div
      id="previous-open"
      class=
      "
      carousel-btn
      cursor-pointer
      "
      on:click={() => toggleCarousel(-1)}
    >
      <img
        id=''
        src={icon_slider_left}
        alt='slider-left'
        title='slider-left'
        loading='lazy'
      />
    </div>

  {/if}

  <div
    id="{CNAME}⮕competitions"
    bind:this={gridElement}
  >

    <div
      id="{CNAME}⮕competitions-inner"
      bind:this={gridChildElement}
    >

      {#each competitionList ?? [] as item}

        <div
          transition:fade
        >

          <!--
          ### NOTE:
          ### Dynamic Svelte Component Import
          ### WARNING:
          ### Disable, if Standard Import is Enabled.
          -->
          <svelte:component
            this={HighlightsMainDynamic}
            B_COMP_HIGH_D={item}
            {participantsMap}
          />

          <!--
          ### NOTE:
          ### Standard Svelte Component Import
          ### WARNING:
          ### Disable, if Dynamic Import is Enabled.
          -->
          <!--
            <FeatBetSiteMain
              B_FEATB_T={WIDGET_T_DATA}
            />
          -->

        </div>

      {/each}

    </div>

  </div>

  <!--
  🖥️ LAPTOP
  NEXT SLIDE TOGGLE
  -->
  {#if !isViewTablet && showPrevNextBtns && isOverLimitUI}

    <div
      id="next-open"
      on:click={() => toggleCarousel(1)}
      class=
      "
      carousel-btn
      cursor-pointer
      "
    >
      <img
        id=''
        src={icon_slider_right}
        alt='slider-left'
        title='slider-left'
        loading='lazy'
      />
    </div>

  {/if}

</div>

<!--
📱 MOBILE + 💻 TABLET
CAROUSEL DOTS
-->
{#if isViewTablet}

  <div
    class=
    "
    m-t-25
    text-center
    "
    class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
  >

    <div
      class=
      "
      carousel-dots
      "
    >

      <div
        class=
        "
        carousel-dots-inner
        row-space-center
        "
        bind:this={carouselDotsElement}
      >
        {#each { length: sliderCount } ?? [] as _,i}

          <!--
          NOTE:
          USE CASE OF STANDARD AMOUNT
          -->
          {#if !isOverLimitUI}

            <span
              class=
              "
              dot
              standard
              "
              class:active-carousel={i == slidePositionDotMirror - 1}
            />

          <!--
          NOTE:
          USE CASE OF OVER LIMIT AMOUNT
          -->
          {:else}

            <span
              class=
              "
              dot
              "
              class:visibility-none=
              {
                i == 0 && slidePositionDotMirror == 1
                || i == (sliderCount - 1) && slidePositionDotMirror == 6
              }
              class:first-dot={i == 1 && slidePositionDotMirror == 1}
              class:slideIllusionDots={triggerSlide2ndOppositesEffect}
              class:active-carousel={i == slidePositionDotMirror}
              class:last-dot={i == 5 && slidePositionDotMirror == 5}
            />

          {/if}

        {/each}
      </div>

    </div>

  </div>

{/if}

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

  div#competition⮕w⮕highlights-grid⮕competitions-outer
  {
    /* 📌 position */
    position: relative;
  }

  div#competition⮕w⮕highlights-grid⮕competitions
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    display: grid;
    /* NOTE: only necessary if child 'grid' is position 'absolute' */
    /* height: 483px; */
    max-width: calc(100vw - 32px);
    /* overflow: hidden; */
    padding-top: 15px;
    overflow-x: hidden;
  }

  div#competition⮕w⮕highlights-grid⮕competitions-inner
  {
    /* 📌 position */
    /* NOTE: not wanting to use 'absolute' because then height cannot be 'dynamic' in parent */
    /* position: absolute; */
    /* 🎨 style */
    width: 100%;
    display: grid;
    gap: 20px;
    grid-auto-flow: column dense;
    grid-template-rows: 1fr;
    /* NOTE: does not work with the last highlights on the list */
    /* grid-template-columns: repeat(auto-fill, calc(100vw - 32px)); */
    grid-auto-columns: calc(100vw - 32px);
    transition: all 0.5s;
  }

  div.carousel-btn
  {
    /* 📌 position */
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 1;
    /* 🎨 style */
    width: 32px;
    height: 32px;
    background-color: #313131;
    border-radius: 50%;
    text-align: -webkit-center;
  }
  div#previous-open.carousel-btn
  {
    /* 📌 position */
    left: -17px;
  }
  div#next-open.carousel-btn
  {
    /* 📌 position */
    right: -17px;
  }
  div.carousel-btn img
  {
    /* 🎨 style */
    padding: 5px;
  }

  div.carousel-dots
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    max-width: 62px;
    height: 6px;
    overflow: hidden;
  }
  div.carousel-dots-inner
  {
    /* 📌 position */
    position: absolute;
    /* 🛝 layout */
    display: grid;
    /* 🎨 style */
    /* width: fit-content; */
    grid-auto-flow: column;
    gap: 8px;
    justify-content: center;
    transition: all 0.5s;
  }
  span.dot
  {
    /* 🎨 style */
    height: 6px;
    width: 6px;
    background-color: var(--black);
    opacity: 0.4;
    border-radius: 50%;
    display: inline-block;
    transition: all 0.5s;
  }
  span.dot.first-dot,
  span.dot.last-dot
  {
    /* 🎨 style */
    height: 6px;
    width: 6px;
  }
  div.carousel-dots-inner span.dot:nth-child(2):not(.standard):not(.slideIllusionDots):not(.first-dot),
  div.carousel-dots-inner span.dot:nth-last-child(2):not(.standard):not(.slideIllusionDots):not(.last-dot),
  div.carousel-dots-inner span.dot:first-child:not(.standard),
  div.carousel-dots-inner span.dot:last-child:not(.standard)
  {
    /* 🎨 style */
    height: 4px;
    width: 4px;
  }
  span.dot.active-carousel
  {
    /* 🎨 style */
    opacity: 1;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  and (min-width: 726px)
  {

    div#competition⮕w⮕highlights-grid⮕competitions
    {
      /* 🎨 style */
      max-width: calc(100vw - 64px);
    }

    div#competition⮕w⮕highlights-grid⮕competitions-inner
    {
      /* 🎨 style */
      /* IMPORTANT */
      grid-auto-columns: calc((100vw - 64px - 20px) / 2);
      /* grid-auto-columns: 328px; */
    }

  }

  @media only screen
  and (min-width: 1160px)
  {

    div#competition⮕w⮕highlights-grid⮕competitions-inner
    {
      /* 🎨 style */
      /* IMPORTANT */
      grid-auto-columns: calc((100vw - 64px - (20px * 2)) / 3);
      /* grid-auto-columns: 328px; */
    }

  }

  @media only screen
  and (min-width: 1430px)
  {

    div#competition⮕w⮕highlights-grid⮕competitions-inner
    {
      /* 🎨 style */
      /* IMPORTANT */
      grid-auto-columns: 325px;
    }

	}

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  .dark-background-1
  {
    /* 🔥 override */
    background-color: unset !important;
  }

  .dark-background-1 span.dot
  {
    /* 🎨 style */
    background-color: var(--white-4);
  }

</style>
