<script lang="ts">
  export let label: string;
  export let dark: boolean = true;
</script>

<button class="btn-hollow cursor-pointer button-hollow-component" class:dark={dark} on:click>
  <span class="s-14" class:color-white={dark}>
    {label}
  </span>
</button>

<style lang="scss">
  .button-hollow-component {
    &.dark {
      background: var(--dark-theme);
    }
  }
</style>
