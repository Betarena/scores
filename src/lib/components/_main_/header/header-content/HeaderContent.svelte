<script lang="ts">
  import SignIn from "$lib/components/_main_/auth/SignIn.svelte";
  import BrandLogo from "./sub-components/BrandLogo.svelte";
  import ThemeToggle from "$lib/components/_main_/header/header-content/sub-components/ThemeToggle.svelte";

  export let dark: boolean = false;
</script>

<header class="header-content-component">
  <div class="wrap-side">
    <BrandLogo {dark} />
  </div>  
  <div class="wrap-side">
    <ThemeToggle />
    <SignIn  />
  </div>
</header>

<style lang="scss">
  .header-content-component {
    height: 64px;
    padding: 0 34px;
    display: flex;
    justify-content: space-between;
    .wrap-side {
      display: flex;
      align-items: center;
      gap: 24px;
    }
  }
</style>
