<script lang="ts">
  
  //#region ➤ [MAIN] Package Imports
	
  //#endregion ➤ [MAIN] Package Imports
  
  //#region ➤ [VARIABLES]

  export let rating: number;
  export let img: string;
  export let name: string;
  export let appear: number;
  export let assists: number;
  export let goals: number;
  export let viewportDesktop: boolean;

	let ratingColorCode: string;

  //#endregion ➤ [VARIABLES]

  // #region ➤ [MAIN-METHODS]

  // #endregion ➤ [MAIN-METHODS]

  // #region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  // #endregion ➤ [ONE-OFF] [METHODS] [IF]

  // #region ➤ [REACTIVIY] [METHODS]

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

  // #endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  // #endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<tr>

  <td>
    <div
      class="rating-box"
      class:bronze={ratingColorCode === 'T'}
      class:silver={ratingColorCode === 'Y'}
      class:golden={ratingColorCode === 'G'}
    >
      <p 
        class="
          w-500 
          medium
        ">
        {rating || ''}
      </p>
    </div>
  </td>

  <td
    class="row-space-start">
    <img
      loading="lazy"
      src={img}
      alt="default alt text"
      width="32"
      height="32"
      class="player-img"
    />
    <p
      class="
        w-500 
        small 
        desktop-small
      "
    >
      {name}
    </p>
  </td>

  {#if viewportDesktop}

    <td>
      <p
        class="
          w-500 
          medium 
          boxed-rating-matches
        "
      >
        {appear}
      </p>
    </td>

    <td>
      <p
        class="
          w-500 
          medium 
          boxed-rating-assits
        "
      >
        {assists}
      </p>
    </td>

    <td>
      <p
        class="
          w-500 
          medium 
          boxed-rating-goals
        "
      >
        {goals}
      </p>
    </td>

  {/if}

</tr>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

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