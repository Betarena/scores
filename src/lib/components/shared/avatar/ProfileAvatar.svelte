<script lang="ts">
  import ProfileAvatarNoneSrc from "$lib/components/shared/assets/profile-avatar-none.svg";
  import { onMount, tick } from "svelte";
  export let imageSrc: string | undefined = undefined;
  export let imageAlt: string | undefined = undefined;
  export let effect: boolean = false;

  $: src = imageSrc || ProfileAvatarNoneSrc;
  $: alt = imageSrc ? imageAlt : "No avatar";

  let animate = false;
  if (effect) {
    onMount(async () => {
      await tick();
      animate = effect;
    });
  }
</script>

<img
  class="avatar-component"
  decoding="async"
  {src}
  {alt}
  class:effect
  class:animate
/>

<style lang="scss">
  .avatar-component {
    border-radius: 100%;
    color: transparent;

    &.effect {
      transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
      filter: blur(40px);
      transform: scaleX(1.1) scaleY(1.1);

      &.animate {
        filter: none;
        transform: none;
      }
    }
  }
</style>
