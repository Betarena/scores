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
  let hover = false;
  $: if (browser && img) {
    getFile(img);
  }

  $: ({ deviceType } = $session);

  async function getFile(src) {
    try {
      const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(src)}`);
      if (!r.ok) return;
      const contentType = r.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        return;
      }
      const blob = await r.blob();
      if (contentType === "image/svg+xml") {
        file = await convertSvgToJpeg(blob);
      } else {
        file = new File([blob], "share.jpg", { type: contentType });
      }
    } catch (e) {
      return
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

  async function convertSvgToJpeg(svgBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event) {
        const svgData = event.target.result;
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            resolve(new File([blob], "share.jpg", { type: "image/jpeg" }));
          }, "image/jpeg");
        };
        img.onerror = reject;
        img.src = svgData;
      };
      reader.onerror = reject;
      reader.readAsDataURL(svgBlob);
    });
  }
</script>

<button
  class="button share-button secondary"
  aria-label="share"
  id="share-button"
  class:hover
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}
  on:touchend={() => (hover = false)}
  on:mouseup={() => (hover = false)}
  on:click={share}
>
  <ShareIcon />
</button>

{#if img}
  <img src={img} bind:this={imgNode} alt="share" style="display: none;" />
{/if}

<style lang="scss">
   .button {
    display: flex;
    padding: 9px 20px;
    align-items: center;
    gap: 8px;
    font-size: var(--text-button-size);
    border-radius: 8px;
    text-align: center;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 24px */
    cursor: pointer;
  }
  .secondary {
    background-color: var(--button-secondary-bg);
    color: var(--text-color);

    &.hover {
      background: var(--primary, #f5620f);
      color: var(--white-day, #fff);
    }
  }
  .share-button#share-button {
    padding: 0;
    width: 40px;
    height: 40px;

    &:hover {
      --text-color: #fff;
    }
  }
</style>
