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

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { viewport_change } from '$lib/utils/platform-functions.js';

  import icon_slider_left from './assets/icon-slider-left.svg';
  import icon_slider_right from './assets/icon-slider-right.svg';

	import type { B_COMP_HIGH_D } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description TODO: DOC: */
    competitionList: B_COMP_HIGH_D[] = []
  ;

  const
    /** @description TODO: DOC: */
    VIEWPORT_TABLET_INIT = 912,
    /** @description TODO: DOC: */
    VIEWPORT_MOBILE_INIT = 581,
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'competition⮕w⮕highlights-grid'
  ;

  let
    /** @description TODO: DOC: */
    isViewMobile: boolean = false,
    /** @description TODO: DOC: */
    isViewTablet: boolean = false,
    /** @description dynamic import variable condition */
    useDynamicImport: boolean = true,
    /** @description dynamic import variable for svelte component */
    HighlightsMainDynamic: any,
    /** @description TODO: DOC: */
    currentSlidePositionNumber: number = 0,
    /** @description TODO: DOC: */
    incrementBy: number,
    /** @description target `this` component grid element `HTMLElement` */
    gridElement: HTMLElement,
    /** @description target `this` component gird inner element `HTMLElement` */
    gridChildElement: HTMLElement,
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

    let touchstartX = 0
    let touchendX = 0

    function checkDirection
    (
    ): void
    {
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
    )

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
    )
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
      || (currentSlidePositionNumber + change + (change * incrementBy) > competitionList?.length)
    ;
    if (if_M_0) return;

    currentSlidePositionNumber += change;

    const parentBox: HTMLElement = gridElement;

    const element: HTMLElement = gridChildElement;
    element.style.transform = `translateX(${(-parentBox.offsetWidth * currentSlidePositionNumber) - (currentSlidePositionNumber * 20)}px)`;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  $: if (!isViewTablet) incrementBy = 4;
  $: if (isViewTablet && !isViewMobile) incrementBy = 2;
  $: if (isViewTablet && isViewMobile) incrementBy = 1;

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
>

  <!--
  🖥️ LAPTOP
  PREVIOUS SLIDE TOGGLE
  -->
  {#if !isViewTablet && showPrevNextBtns}

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
    on:mouseover={() => showPrevNextBtns = true}
    on:mouseout={() => showPrevNextBtns = false}
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
  {#if !isViewTablet && showPrevNextBtns}

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
    carousel-dots
    "
  >
    {#each { length: Math.ceil(competitionList?.length / incrementBy) } ?? [] as _,i}
      <span
        class="dot"
        class:active-carousel={i == currentSlidePositionNumber}
      />
    {/each}
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
    overflow: hidden;
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
    /* 🎨 style */
    display: grid;
    grid-auto-flow: column;
    gap: 8px;
    justify-content: center;
  }
  span.dot
  {
    /* 🎨 style */
    height: 6px;
    width: 6px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
  }
  span.dot.active-carousel
  {
    /* 🎨 style */
    background: var(--black);
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
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
      grid-auto-columns: 328px;
    }

	}

  /*
  =============
  🌒 DARK-THEME
  =============
  */

</style>
