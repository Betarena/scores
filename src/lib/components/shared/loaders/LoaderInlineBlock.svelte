<script lang="ts">
  export let dark: boolean = false;
</script>
<div class="loader-text animate" class:dark></div>

<style lang="scss">
  .loader-text {
    display: inline-block;
    border-radius: var(--border-radius, unset);

    --loader-height-mobile: var(--mobile-height, 1em);
    --loader-height-tablet: var(--tablet-height, var(--loader-height-mobile));
    --loader-height-desktop: var(--desktop-height, var(--loader-height-tablet));
    --loader-height: var(--loader-height-mobile);
    height: var(--loader-height);
    @media only screen and (min-width: 768px) {
      --loader-height: var(--loader-height-tablet);
    }
    @media only screen and (min-width: 1440px) {
      --loader-height: var(--loader-height-desktop);
    }

    --loader-width-mobile: var(--mobile-width, 100%);
    --loader-width-tablet: var(--tablet-width, var(--loader-width-mobile));
    --loader-width-desktop: var(--desktop-width, var(--loader-width-tablet));
    --loader-width: var(--loader-width-mobile);
    width: var(--loader-width);
    flex-shrink: 0;
    @media only screen and (min-width: 768px) {
      --loader-width: var(--loader-width-tablet);
    }
    @media only screen and (min-width: 1440px) {
      --loader-width: var(--loader-width-desktop);
    }

    background: var(--whitev2, #F2F2F2);
    &.dark {
      background: var(--dark-theme-1-shade, #616161);
    }

    &.animate {
      -webkit-animation: flickerAnimation 1.5s infinite;
      -moz-animation: flickerAnimation 1.5s infinite;
      -o-animation: flickerAnimation 1.5s infinite;
      animation: flickerAnimation 1.5s infinite;
    }
  }
</style>
