<script>
    import { page } from "$app/stores";
    import session from "$lib/store/session";
    import { copyToClipboard } from "$lib/utils/miscellenous";
    import ShareIcon from "./assets/share-icon.svelte";
    import Button from "./Button.svelte";

    export let shareText = "Share";

    $: ({deviceType} = $session)

   async function share() {
    const href = $page.url.href;
      if(deviceType === "desktop") {
        copyToClipboard(href)
        return
      }
      if (navigator.share) {
          try {
            await navigator.share({
              title: shareText,
              url: href
            });
          } catch (error) {
            copyToClipboard(href);
          }
        } else {
          copyToClipboard(href);
        }
    }

</script>
<Button type="secondary" on:click={share} id="share-button" classname="share-button" style="width: 40px; height: 40px; padding: 0">
  <ShareIcon />
</Button>

<style lang="scss">
  :global(.share-button#share-button) {
    padding: 0;
    width: 40px;
    height: 40px;

    &:hover {
      --text-color: #fff
    }

  }
</style>