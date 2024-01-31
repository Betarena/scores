<script lang="ts">
  import ProfileAvatar from "$lib/components/shared/avatar/ProfileAvatar.svelte";
  import ButtonSvgCircle from "$lib/components/shared/buttons/ButtonSvgCircle.svelte";
  import BackButtonIconSrc from "$lib/components/shared/assets/chevron-left.svg";
  import { ThemeName } from "$lib/constants";
  
  export let dark: boolean = false;
</script>
  
  <header class="header-content-mobile-component">
    <div class="wrap">
        <ButtonSvgCircle src={BackButtonIconSrc} alt="back" {dark} />
    </div>
    <div class="wrap">
        <ProfileAvatar />
    </div>
  </header>
  
  <style lang="scss">
    .header-content-mobile-component {
      height: 48px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      .wrap {
        display: flex;
        align-items: center;        
      }
    }
  </style>
  