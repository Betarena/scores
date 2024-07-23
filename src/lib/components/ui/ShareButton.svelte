<script>
  import { page } from "$app/stores";
  import session from "$lib/store/session";
  import { copyToClipboard } from "$lib/utils/miscellenous";
  import { title } from "process";
  import ShareIcon from "./assets/share-icon.svelte";
  import Button from "./Button.svelte";

  export let shareText = "Share",
    img = "";

  let imgNode;
  $: file = img
    ? fetch(img)
        .then((r) => r.blob())
        .then(
          (blobFile) =>
            new File([blobFile], "share.jpg", { type: "image/jpeg" })
        )
    : null;

  $: ({ deviceType } = $session);

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
