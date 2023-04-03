<script lang="ts">
  export let profileStatTitle: string;
  export let statVal: string | number;
  // (optional)
  export let countryIso3: string = null;
  export let countryImg: string = null;
</script>

<div
  class="
    status-box
    m-r-15
  ">
  <!-- 
  player stat box
  -->
  <p
    class="
      s-14
      color-grey
      w-400
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
      ">
      {statVal}
    </p>
  {/if}
</div>

<style>

  div.status-box {
    /* s */
    padding-left: 12px;
    /* width: 110px; */
    border-left: 1px solid var(--grey-shade);
  }

  img#country-icon {
    border-radius: 40px;
    border: 1px solid var(--grey-shade)
  }

</style>