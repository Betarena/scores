<script lang="ts">
  import { page } from "$app/stores";
  import AssetBetarenaLogoFull from "./assets/asset-betarena-logo-full.svelte";
  import BetarenaLogoMobile from "./assets/betarena-logo-mobile.svelte";

  import sessionStore from "$lib/store/session.js";

  export let mobile, tablet;
  $: ({ serverLang } = $sessionStore);
  $: homepageURL = serverLang != "en" ? `/${serverLang}` : "/";
  $: logoLink =
    serverLang != "en" ? `${$page.url.origin}/${serverLang}` : $page.url.origin;

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
