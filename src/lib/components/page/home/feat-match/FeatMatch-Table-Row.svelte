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

	import sessionStore from "$lib/store/session.js";

	import type { Urls } from "@betarena/scores-lib/types/_HASURA_.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. export const / let [..]                                       ◼️
  // ### 2. const [..]                                                    ◼️
  // ### 3. let [..]                                                      ◼️
  // ### 4. $: [..]                                                       ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    rating: number,
    img: string,
    name: string,
    appear: number,
    assists: number,
    goals: number,
    urls: Urls,
    viewportDesktop: boolean
  ;

	let
    ratingColorCode: string,
    url: string
  ;

  $: url =
    urls?.[$sessionStore?.serverLang] == undefined
      ? undefined
      : `/${urls?.[$sessionStore?.serverLang]}`
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### WARNING:                                                         ◼️
  // ### ❗️ Can go out of control.                                        ◼️
  // ### (a.k.a cause infinite loops and/or cause bottlenecks).           ◼️
  // ### Please keep very close attention to these methods and            ◼️
  // ### use them carefully.                                              ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description
   * listens to target "player.rating" change, assigns color-code;
  */
  $: if_R_0 =
    rating != undefined
  ;
	$: if (if_R_0)
  {
    ratingColorCode = 'T';
    if (rating >= 7) ratingColorCode = 'Y';
		if (rating >= 9) ratingColorCode = 'G';
	}
  else
  {
		ratingColorCode = undefined;
	}

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class=tyles                                ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<tr>

  <td>
    <div
      class=
      "
      rating-box
      "
      class:bronze={ratingColorCode === 'T'}
      class:silver={ratingColorCode === 'Y'}
      class:golden={ratingColorCode === 'G'}
    >
      <p
        class=
        "
        w-500
        medium
        ">
        {rating || ''}
      </p>
    </div>
  </td>

  <td>
    <a
      href={url}
      class=
      "
      cursor-pointer
      "
      class:disable-anchor={url == undefined}
      class:enabeld-anchor={url != undefined}
      style=
      "
      display: block;
      "
    >
      <div
        class=
        "
        row-space-start
        "
      >
        <img
          loading="lazy"
          src={img}
          alt="default alt text"
          width=32
          height=32
          class=
          "
          player-img
          "
        />
        <p
          id="featm-player-name"
          class=
          "
          w-500
          small
          desktop-small
          color-black-2
          "
        >
          {name}
        </p>
      </div>
    </a>
  </td>

  <!--
  🖥️ LAPTOP
  -->
  {#if viewportDesktop}

    <td>
      <p
        class=
        "
        w-500
        medium
        boxed-rating-matches
        color-black-2
        "
      >
        {appear}
      </p>
    </td>

    <td>
      <p
        class=
        "
        w-500
        medium
        boxed-rating-assits
        color-black-2
        "
      >
        {assists}
      </p>
    </td>

    <td>
      <p
        class=
        "
        w-500
        medium
        boxed-rating-goals
        color-black-2
        "
      >
        {goals}
      </p>
    </td>

  {/if}

</tr>

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

  .rating-box
  {
		width: fit-content;
		border-radius: 30px;
		padding: 1.5px 8px;
		color: white;
	}
	.rating-box p
  {
		color: white;
	}
	.golden
  {
		background: #ffb904;
	}
	.silver
  {
		background: #a1a1a1;
	}
	.bronze
  {
		background: #dbb884;
	}

  .player-img
  {
		border: 1px solid #cccccc;
		border-radius: 50%;
		margin-right: 8px;
	}

  a.enabeld-anchor:hover p#featm-player-name
  {
    color: var(--primary) !important;
  }

  .boxed-rating-matches
  {
    background: #ffffff;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    max-height: 30px;
    width: 64px;
  }
  .boxed-rating-assits
  {
    background: #f2f2f2;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    max-height: 30px;
    width: 64px;
  }
  .boxed-rating-goals
  {
    background: #e6e6e6;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    max-height: 30px;
    width: 64px;
  }

</style>