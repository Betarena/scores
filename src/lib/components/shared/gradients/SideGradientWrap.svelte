<script lang="ts">
  import { DeviceType } from "$lib/context/device-type-context";

  export let dark: boolean = false;

  export let side: "bottom" | "right" = "right"; // can be extended with "top" | "right" if will be needed
  export let width: string = "100%";
  export let height: string = "100%";
  
  export let hideOn: DeviceType[] = [];

  const resolveAfterContent = (deviceType: DeviceType) =>
    hideOn.includes(deviceType) ? "unset" : "\"\"";

  $: style = `
      --after-width: ${width};
      --after-height: ${height};
      --after-content-mobile: ${resolveAfterContent(DeviceType.Mobile)};
      --after-content-tablet: ${resolveAfterContent(DeviceType.Tablet)};
      --after-content-desktop: ${resolveAfterContent(DeviceType.Desktop)};
      --gradient-color: ${dark ? "var(--dark-theme)": "var(--white)"};
  `;
</script>

<div class="side-gradient-wrap-component {side}" {style}>
  <slot />
</div>

<style lang="scss">
  .side-gradient-wrap-component {
    position: relative;

    --after-content: var(--after-content-mobile);
    @media only screen and (min-width: 768px) {
      --after-content: var(--after-content-tablet);
    }
    @media only screen and (min-width: 1440px) {
      --after-content: var(--after-content-desktop);
    }

    // side: right
    --gradient-direction: 270deg;
    --top: 0;
    --right: 0;
    --bottom: 0;
    --left: auto;
    &.bottom {
      // side: bottom
      --gradient-direction: 0deg;
      --top: auto;
      --right: 0;
      --bottom: 0;
      --left: 0;
    }

    position: relative;
    &::after {
      content: var(--after-content);
      position: absolute;
      top: var(--top);
      right: var(--right);
      bottom: var(--bottom);
      left: var(--left);

      width: var(--after-width, 100%);
      height: var(--after-height, 100%);

      background: linear-gradient(var(--gradient-direction), var(--gradient-color) , transparent );
    }    
  }
</style>
