<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { modalStore } from "$lib/store/modal.js";
  import Cropper from "svelte-easy-crop";
  import XClose from "../assets/x-close.svelte";
  import Button from "../Button.svelte";
  import { getCroppedImg } from "./canvasUtils";

  export let shape: "rect" | "round" = "rect";
  export let image = "";
  export let croppiedImage = "";
  export let cb = (img) => {};
  export let title = "Profile Photo";
  export let closeCb = () => {};

  let pixelCrop, croppedImage;

  async function cropImage() {
    croppedImage = await getCroppedImg(image, pixelCrop);
    cb(croppedImage);
  }

  function previewCrop(e) {
    pixelCrop = e.detail.pixels;
  }

  function close() {
    $modalStore.show = false;
    closeCb();
  }
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!-- <Modal {show}> -->
<div class="wrapper">
  <div class="header">
    <span>{title}</span>
    <div class="close" on:click={close}>
      <XClose />
    </div>
  </div>
  <div class="image-box">
    <div class="image-wrapper">
      <Cropper
        cropShape={shape}
        {image}
        aspect={1}
        zoom={2}
        on:cropcomplete={previewCrop}
        crop={{ x: 0, y: 0 }}
      />
    </div>
  </div>
  <div class="buttons">
    <Button type="outline" size="md" on:click={close}>Cancel</Button>
    <Button type="primary" size="md" on:click={cropImage}>Save</Button>
  </div>
</div>

<!-- </Modal> -->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    position: fixed;
    top: 50%;
    left: 50%;
    flex-direction: column;
    transform: translate(-50%, -50%);

    box-shadow: inset 0 1px 0 var(--dark-theme-1-shade) !important;
    background-color: var(--background-bg-secondary) !important;
    width: 502px;
    max-width: 90vw;

    border-radius: 12px;
    padding: 20px;
    gap: 20px;

    .header {
      display: flex;
      width: 100%;
      justify-content: space-between;
      color: var(--colors-text-text-primary) !important;
      font-size: 16px;
      font-weight: 500;

      .close {
        cursor: pointer;
      }
    }

    .image-box {
      position: relative;
      height: 240px;
      max-height: 240px;
      width: 100%;
      overflow: hidden;
      background-color: var(--dark-theme);
      .image-wrapper {
        position: relative;
        height: 240px;
        max-height: 240px;
        width: 100%;
        overflow: hidden;
        background-color: var(--dark-theme);
      }
    }
    .buttons {
      display: flex;
      width: 100%;
      justify-content: end;
      gap: 16px;
    }
  }
</style>
