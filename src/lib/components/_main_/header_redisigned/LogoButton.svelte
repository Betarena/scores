<script lang="ts">
  import { page } from "$app/stores";
  import AssetBetarenaLogoFull from "./assets/asset-betarena-logo-full.svelte";
  import BetarenaLogoMobile from "./assets/betarena-logo-mobile.svelte";
  import userSettings from "$lib/store/user-settings.js";

  export let mobile, tablet;
  $: ({ lang } = $userSettings);
  $: homepageURL = lang != "en" ? `/${lang}` : "/";
  $: logoLink =
    lang != "en" ? `${$page.url.origin}/${lang}` : $page.url.origin;

</script>

<div
  id="brand"
  data-testid="header-brand-img"
  aria-label="brand-img"
  class="cursor-pointer"
  on:click={() => {
    if ($page.url.pathname == "/") window.location.reload();
    return;
  }}
>
  <a href={homepageURL} title={logoLink}>
    {#if !mobile && tablet}
      <AssetBetarenaLogoFull />
    {:else}
      <BetarenaLogoMobile />
    {/if}
  </a>
</div>

<style lang="scss">
  #brand {
    :global(svg) {
      width: unset !important;
    }
  }
</style>
