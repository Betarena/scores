<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // ... external modules imports;
	import ColorThief from 'colorthief/dist/color-thief.mjs';

	import { userBetarenaSettings } from '$lib/store/user-settings';

  import type { FeaturedSite, All_SportBook_Details_Data_Translation, Cache_Single_Lang_Featured_Betting_Site_Translation_Response } from "$lib/models/featured_betting_sites/firebase-real-db-interface";

  export let data: FeaturedSite;
  export let FEATURED_BETTING_SITES_WIDGET_DATA_SEO: Cache_Single_Lang_Featured_Betting_Site_Translation_Response;

  let showExtraInfo: boolean;

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... onMount() function that verifies that
   * ... the `viewport` width is of tablet size
   * ... or greater;
  */
  let viewportDesktop: boolean;
  // ...
  onMount(async () => {
    var wInit = document.documentElement.clientWidth;
    if (wInit > 767) {
      viewportDesktop = true;
    } else {
      viewportDesktop = false;
    }
    window.addEventListener("resize", function () {
      var w = document.documentElement.clientWidth;
      if (w > 767) {
        viewportDesktop = true;
      } else {
        viewportDesktop = false;
      }
    });
  });

  // let intercept the image URL;
  // let imgURL = db_real_data.logo;
  getImageBgColor(data.image);

  // declaring a new instance of `ColorThief`;
  const colorThief = new ColorThief();

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~
   * ... A function-method to obtain the main
   * ... `primary` color of the image
   * ... and place it on the background
   * ... container to keep the image the same size
   *
   * @param imgURL
  */
  let imageVar: string = "--logo-bookmaker-bg-" + data.position;
  let hexColor: string;

  function getImageBgColor(imgURL: string) {
    // instantiate the image Type;
    const img = new Image();
    // listen, event to wait for the image to load
    img.addEventListener("load", function () {
      // get the array of RGB values,
      let colorValues = colorThief.getColor(img);
      // convert the RGB values to HEX value,
      hexColor = rgbToHex(colorValues[0], colorValues[1], colorValues[2]);
      // pass this values as a `CSS :root` variable, accessible to all the website,
      const doc = document.documentElement;
      doc.style.setProperty(imageVar, `${hexColor}`);
    });
    // declaring the image paramaters & CORS by-pass
    let imageURL = imgURL;
    let googleProxyURL =
      "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=";
    img.crossOrigin = "Anonymous";
    img.src = googleProxyURL + encodeURIComponent(imageURL);
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~
   * ... A function-method to convert the
   * ... [x,a,c] of RBG values to `#HEX` values
   *
   * @param r
   * @param g
   * @param b
   * @returns (# a singel #HEX-Color Value)
  */
  const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");
</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

{#if showExtraInfo}
  <div
    id="background-modal-blur"
    in:fade
    on:click={() => (showExtraInfo = false)}
  />
{/if}

<div 
  class="featured-row"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} 
  in:fade>

  <!-- ... first container of the row site -->
  <div 
    class="row-space-out"
    style="width: fit-content;">

    <!-- ... Position Number ONLY ON DESKTOP VERSION ... -->
    {#if viewportDesktop}
      <p 
        class="large w-500 w-normal" 
        style="margin-right: 32px;">
        {data.position}.
      </p>
    {/if}

    <!-- ... site logo-img ... -->
    <a 
      target="_blank" 
      rel="noreferrer" 
      href={data.register_link}
      aria-label={data.title}>
      <img
        style="background-color: var({imageVar}); border-radius: 4px;"
        src={data.image}
        alt=""
      />
    </a>

    <!-- ... site name ... -->
    <a 
      target="_blank" 
      rel="noreferrer" 
      href={data.register_link}>
      <p 
        class="large w-500 w-normal" 
        style="margin-left: 12px;">
        {data.title}
      </p>
    </a>
  </div>

  <!-- ... second container of the row site ... -->
  <div 
    class="row-space-out "
    style="width: fit-content;">

    <!-- ... Rating Value ... -->
    <p 
      class="large w-500 w-normal" 
      style="margin-right: 16px;">
      {data.stars}
      <span class="medium"> /5 </span>
    </p>

    <!-- ... Rating Star BOX ONLY ON DESKTOP VERSION ... -->
    {#if viewportDesktop}
      {#if data.stars === '5'}
        <img
          class="rating-img"
          src="https://www.betarena.com/widgets/featured_betting_sites/static/star5.svg"
          alt=""
        />
      {:else if data.stars === '4'}
        <img
          class="rating-img"
          src="https://www.betarena.com/widgets/featured_betting_sites/static/star4.svg"
          alt=""
        />
      {:else if data.stars === '3'}
        <img
          class="rating-img"
          src="https://www.betarena.com/widgets/featured_betting_sites/static/star3.svg"
          alt=""
        />
      {:else if data.stars === '2'}
        <img
          class="rating-img"
          src="https://www.betarena.com/widgets/featured_betting_sites/static/star2.svg"
          alt=""
        />
      {:else}
        <img
          class="rating-img"
          src="https://www.betarena.com/widgets/featured_betting_sites/static/star1.svg"
          alt=""
        />
      {/if}
    {/if}

    <!-- ... extra-info pop-up container ... -->
    <div 
      class="button-extra-info-container">

      <!-- ... extra-info pop-up container TOGGLE BUTTON ... -->
      <button
        class="btn-primary"
        on:click={() => (showExtraInfo = !showExtraInfo)}
        >
        <p class='w-500 s-14 w-normal'>
          {data.bonus}
        </p>
      </button>

      <!-- ... extra-info pop-up container ... -->
      {#if showExtraInfo}
        <div 
          class="extra-info" 
          in:fade>
          <!-- ... site-image ... -->
          <img
            style="background-color: var({imageVar});"
            class="extra-info-img"
            src={data.image}
            alt=""
            />
          <!-- ... extra-site info ... -->
          <div 
            class="extra-info-container">
            <!-- ... text ... -->
            <p 
              class="large">
              {data.bonus_description}
            </p>
            <!-- ... button_cta ... -->
            <a 
              rel="external" 
              href={data.register_link}>
              <button
                class="btn-primary btn-cta"
                style="width: 100% !important;"
              >
                <p 
                  class="w-500 s-14 w-normal">
                  {FEATURED_BETTING_SITES_WIDGET_DATA_SEO.translations.register_cta}
                </p>
              </button>
            </a>
            <!-- ... extra-site info text ... -->
            <p 
              class="small" 
              style="color: #CCCCCC;">
              {data.information}
            </p>
          </div>
        </div>
      {/if}

    </div>

  </div>

</div>

<!-- ===============
  COMPONENT STYLE
==================== -->

<style>
  #background-modal-blur {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 4;
    height: 100%;
    width: 100%;
  }

  .featured-row {
    padding: 13px 20px;
    background-color: #ffffff;
    box-shadow: inset 0px 1px 0px #ebebeb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  .featured-row img {
    width: 44px;
    height: 44px;
    object-fit: contain;
    /* border: 1px solid #CCCCCC; */
    /* background-color: var(--logo-bookmaker-bg); */
  }
  .featured-row button {
    background: #f5620f;
    box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
    border-radius: 0px 8px;
    padding: 4.5px 12px;
    width: 68px !important;
  }
  .featured-row .button-extra-info-container {
    position: relative;
  } .featured-row .button-extra-info-container button:hover,
    .featured-row .button-extra-info-container button.btn-cta:hover {
    background-color: #F77C42;
  }
  .extra-info-container {
    padding: 20px;
    display: grid;
    justify-items: stretch;
    justify-content: center;
    align-items: center;
    align-content: center;
    text-align: center;
  }
  .extra-info-container p {
    color: white;
  }
  .featured-row .extra-info {
    background: #4b4b4b;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    position: absolute;
    top: 105%;
    right: 0;
    width: 300px;
    display: grid;
    z-index: 100;
    justify-items: center;
    overflow: hidden;
  }
  .featured-row .extra-info-img {
    width: 100%;
  }

  .rating-img {
    margin-right: 20px;
    width: 77px !important;
    height: 14px !important;
    /* background-color: white !important; */
  }
  .btn-cta {
    border-radius: 8px !important;
    margin-top: 32px;
    margin-bottom: 16px;
    padding: 11.5px !important;
    width: -webkit-fill-available;
  }
  /* .apply-border {
    border: 1px solid #cccccc;
  } */

  /* .............. 
	WIDGET DARK THEME 
	................. */

	div.dark-background-1.featured-row {
		box-shadow: inset 0px 1px 0px #616161 !important;
    background-color: #4B4B4B !important;
	}

  .dark-background-1 p {
    color: #ffffff;
  }
</style>