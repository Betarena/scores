<script>
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import session from "$lib/store/session";
  import { copyToClipboard } from "$lib/utils/miscellenous";
  import ShareIcon from "./assets/share-icon.svelte";
  import Button from "./Button.svelte";

  export let shareText = "Share",
    img = "";

  let imgNode;
  let file;
  $: if (browser && img) {
   getFile(img);
  }

  $: ({ deviceType } = $session);

  async function getFile(src) {
    try {
      const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(src)}`)
      if (!r.ok)  return
        const blob = await r.blob();
        file = new File([blob], "share.jpg", { type: "image/jpeg" });

    } catch(e) {
      console.log(e)
    }
  }

  async function share() {
    const href = $page.url.href;
    if (deviceType === "desktop") {
      copyToClipboard(href);
      return;
    }
    const data = { title: shareText, url: href };
    if (file) {
      data.files = [file];
    }
    if (navigator.share && navigator.canShare && navigator.canShare(data)) {
      try {
        await navigator.share(data);
      } catch (error) {
        copyToClipboard(href);
      }
      return;
    } else if (data.files) {
      file = null;
      share();
    } else {
      copyToClipboard(href);

    }
  }
</script>

<Button
  aria-label="share"
  type="secondary"
  on:click={share}
  id="share-button"
  classname="share-button"
  style="width: 40px; height: 40px; padding: 0"
>
  <ShareIcon />
</Button>
{#if img}
  <img src={img} bind:this={imgNode} alt="share" style="display: none;" />
{/if}

<style lang="scss">
  :global(.share-button#share-button) {
    padding: 0;
    width: 40px;
    height: 40px;

    &:hover {
      --text-color: #fff;
    }
  }
</style>
