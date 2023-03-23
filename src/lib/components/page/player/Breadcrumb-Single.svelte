<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  export let href: string = undefined;
  export let name: string;
  export let end: boolean = false;
  export let disable: boolean = false;

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!-- 
[ℹ] single breadcrumb (with link)
-->
{#if !end}
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
      <img
        src="/assets/svg/tournaments/arrow-right.svg"
        alt="Arrow Right Icon"
        class="m-r-10"
        width="14"
        height="14"
      />
  </div>
{/if}

<!-- 
[ℹ] single breadcrumb (without link)
-->
{#if end}
  <div
    class="
      row-space-start
      width-auto
    ">
    <p
      class="
        breadcrumb
        disabled
      "
    >
      {name}
    </p>
  </div>
{/if}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  p.breadcrumb.disabled {
    color: var(--grey);
    text-transform: unset;
    /* max-width: 50px; */
    max-width: calc(25vw - 25px);
  }

  p.breadcrumb {
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

  @media only screen and (min-width: 475px) {
    /* p.breadcrumb, */
    p.breadcrumb.disabled {
      /* max-width: unset; */
      max-width: calc(40vw - 25px);
    }
  }

  @media only screen and (min-width: 768px) {
    p.breadcrumb,
    p.breadcrumb.disabled {
      max-width: calc(60vw - 25px);
    }
  }

</style>