<script lang="ts">
  export let text: string;
  export let dark: boolean = false;
</script>

<button class="tag-component" class:dark on:click>
  {text}
</button>

<style lang="scss">
  .tag-component {
    font-family: var(--font-family);
    font-size: 14px;
    line-height: 14px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 100px;
    color: var(--dark-theme);
    background: var(--grey-color);
    &:hover {
      background: var(--primary);
    }
    &.dark {
      color: var(--white);
      background: var(--dark-theme-1);
      &:hover {
        background: var(--primary);
      }
    }
  }
</style>
