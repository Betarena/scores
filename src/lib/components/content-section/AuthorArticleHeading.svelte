<script lang="ts">
  export let heading: string;
</script>

<h1>{heading}</h1>

<style lang="scss">
  h1 {
    color: inherit;
    margin: 0;
    font-weight: 600;

    // mobile
    font-size: 24px;
    line-height: 36px;
    // tablet
    @media only screen and (min-width: 768px) {
      font-size: 36px;
      line-height: 54px;
    }
    // desktop
    @media only screen and (min-width: 1440px) {
      font-size: 38px;
    }
  }
</style>
