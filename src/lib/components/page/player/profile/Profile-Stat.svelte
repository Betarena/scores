<script lang="ts">
  export let profileStatTitle: string;
  export let statVal: string | number;
  // (optional)
  export let widthFirst: boolean = false;
  export let countryIso3: string = null;
  export let countryImg: string = null;
</script>

<div
  class="
    status-box
    m-r-40
  "
  class:first-box={widthFirst}>
  <!-- 
  player stat box
  -->
  <p
    class="
      s-14
      color-grey
      w-400
      no-wrap
    ">
    {profileStatTitle}
  </p>
  <!-- 
  player stat value 
  v1 => standard (default)
  v2 => standard for Nationality (conditional)
  -->
  {#if countryIso3 && countryImg}
    <div
      class="
        row-space-start
      ">
      <img 
        src={countryImg}
        alt='country-logo'
        width="18"
        height="18"
        id="country-icon"
        class="m-r-8"
      />
      <p
        class="
          s-14
          w-500
          color-black-2
        ">
        {countryIso3}
      </p>
    </div>
  {:else}
    <p
      class="
        s-14
        color-black-2
        w-500
        no-wrap
      ">
      {statVal}
    </p>
  {/if}
</div>

<style>

  div.status-box {
    /* s */
    padding-left: 16px;
    /* width: 110px; */
    border-left: 1px solid var(--grey-shade);
    max-width: 63px;
    min-width: 63px;
  }

  div.first-box {
    max-width: 87px;
    min-width: 87px;
  }

  img#country-icon {
    border-radius: 40px;
    border: 1px solid var(--grey-shade)
  }

  /*
  =============
  DARK-THEME
  =============
  */

  :global(.dark-background div.status-box) {
    border-left: 1px solid var(--dark-theme-1-shade) !important;
  }

</style>