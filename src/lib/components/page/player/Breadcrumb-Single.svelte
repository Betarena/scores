<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  export let href: string;
  export let name: string;
  export let end: boolean = false;
  export let disable: boolean = false;

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!-- 
[ℹ] single breadcrumb
-->
<div
  class="
    row-space-start
    width-auto
  ">
  <a
    {href}
    class:disabled={disable}
  >
    <p
      class="
        breadcrumb
      "
    >
      {name}
    </p>
  </a>
  {#if !end}
    <img
      src="/assets/svg/tournaments/arrow-right.svg"
      alt="Arrow Right Icon"
      class="m-r-10"
      width="14"
      height="14"
    />
  {/if}
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  a.disabled {
    pointer-events: none;
    cursor: default;
  } a.disabled > p.breadcrumb {
    color: var(--grey);
    max-width: 50px;
  }

  a > p.breadcrumb {
    font-size: 14px;
    color: var(--white);
    margin-right: 10px;
    text-transform: capitalize;
		overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100px;
  } a > p.breadcrumb:hover {
    color: var(--primary);
  }

  @media only screen and (min-width: 450px) {
    a > p.breadcrumb,
    a.disabled > p.breadcrumb {
      max-width: unset;
    }
  }

</style>