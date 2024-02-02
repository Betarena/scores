<script lang="ts">
  export let dark: boolean = false;
</script>

<div class="end-gradient-wrap-component" class:dark>
  <slot />
</div>

<style lang="scss">
  .end-gradient-wrap-component {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 53px;
      background: linear-gradient(to left, var(--white), transparent);
    }
    &.dark::after {
      background: linear-gradient(to left, var(--dark-theme), transparent);
    }

    @media only screen and (min-width: 768px) {
      &::after {
        content: unset;
      }
    }
  }
</style>
