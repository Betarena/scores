<script lang="ts">
  export let src: string | undefined = undefined;
  export let alt: string | undefined = undefined;
  export let dark: boolean = true;
  export let opacity: number | undefined = 1;
</script>

<button class="button-svg-circle-component" class:theme-dark={dark} on:click style:opacity>
  {#if src}
    <img {src} {alt} />
  {/if}
</button>

<style lang="scss">
  .button-svg-circle-component {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 100%;    
    background: #E6E6E6;
    &.theme-dark {
      background: #4B4B4B;
    }
    img {
      flex-shrink: 1;
    }
  }
</style>
