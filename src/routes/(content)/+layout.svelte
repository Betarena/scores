<script lang="ts">
  import Footer from "$lib/components/_main_/footer/Footer.svelte";
  import HeaderContent from "$lib/components/_main_/header/header-content/HeaderContent.svelte";
  import HeaderContentMobile from "$lib/components/_main_/header/header-content-mobile/HeaderContentMobile.svelte";

  import {
    DeviceType,
    setDeviceTypeContext,
  } from "$lib/context/device-type-context";

  import { getDarkThemeContext } from "$lib/context/dark-theme-context";

  let windowInnerHeight;
  $: layoutHeight = windowInnerHeight + 'px';

  let windowInnerWidth;
  $: deviceType = setDeviceTypeContext(windowInnerWidth);

  let isDark = getDarkThemeContext();
  $: displayFooter = $deviceType && $deviceType > DeviceType.Tablet;
  $: displayHeaderContent = $deviceType && $deviceType > DeviceType.Mobile;

  let mobileHeaderReservedHeight = 48;
  $: mobileHeaderReservedHeightPx = mobileHeaderReservedHeight + 'px';
</script>

<svelte:window
  bind:innerWidth={windowInnerWidth}
  bind:innerHeight={windowInnerHeight}
/>
<div
  class="content-layout-component"
  class:theme-dark={$isDark}
  style:min-height={layoutHeight}
>
  {#if displayHeaderContent}
    <HeaderContent dark={$isDark} />
  {:else}
    <div
      class="sticky-header-reserved"
      style:height={mobileHeaderReservedHeightPx}
    />
    <div class="sticky-header" bind:clientHeight={mobileHeaderReservedHeight}>
      <HeaderContentMobile dark={$isDark} />
    </div>
  {/if}
    
  <div class="content">
    <main>
      <slot />
    </main>    
  </div>

  {#if displayFooter}
    <Footer />
  {/if}
</div>

<style lang="scss">
  .content-layout-component {
    display: flex;
    flex-direction: column;
    background: var(--white);
    &.theme-dark {
      background: var(--dark-theme);
    }
    .sticky-header {
      position: fixed;
      width: 100%;
    }
    .content {
      flex-grow: 1;      
      main {
        margin: auto;
        max-width: 836px;
      }
    }
  }
</style>
