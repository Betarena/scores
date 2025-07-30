<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import CropperModal from "$lib/components/ui/Cropper/CropperModal.svelte";
  import { dlog } from "$lib/utils/debug";

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  export let avatar = "";
  export let translations = {} as Record<string, string>;
  let fileInput: HTMLInputElement,
    files: HTMLInputElement["files"] | undefined,
    profile_pic: string | undefined;

  let image: string | ArrayBuffer | null | undefined;
  let showCropModal = false;
  let modal = false;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  function setCropImage(img) {
    profile_pic = img;
    avatar = img;
    modal = false
  }

  function handleFileChange(event) {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    files = target.files;
    const allowedFormats = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    for (const file_ of files) {
      // [🐞]
      dlog(`${file_.name}: ${file_.size} ${typeof file_} type`, true);
    }
    const file = files[0];
    if (!allowedFormats.includes(file.type)) {
      alert("🔴 Invalid file format. Please upload a PNG, JPG or GIF file.");
      fileInput.value = "";
      return;
    }
    if (file.size > 10000000) {
      alert("🔴 Uploaded picture is too large. Limit is 10MB.");
      fileInput.value = "";
      return;
    }
    let reader = new FileReader();
    reader.onload = (e) => {
      image = e.target?.result;
      showCropModal = true;
      modal = true;
    };
    reader.readAsDataURL(file);
    files = undefined;
  }

  // #endregion ➤ 🛠️ METHODS
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

<div class="file-uploader" on:click={() => fileInput.click()}>
  <input
    type="file"
    class="hidden-input"
    bind:this={fileInput}
    on:change={handleFileChange}
    accept=".jpg, .jpeg, .png, .gif, .webp"
  />
  <div class="upload-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M6.66675 13.3333L10.0001 10M10.0001 10L13.3334 13.3333M10.0001 10V17.5M16.6667 13.9524C17.6847 13.1117 18.3334 11.8399 18.3334 10.4167C18.3334 7.88536 16.2814 5.83333 13.7501 5.83333C13.568 5.83333 13.3976 5.73833 13.3052 5.58145C12.2185 3.73736 10.2121 2.5 7.91675 2.5C4.46497 2.5 1.66675 5.29822 1.66675 8.75C1.66675 10.4718 2.36295 12.0309 3.48921 13.1613"
        stroke="#D2D2D2"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
  <div class="upload-info">
    <div class="upload-title">
      <span class="upload-action">
        {translations?.upload_thumbnail_action || "Click to upload"}</span
      >
      {translations?.upload_thumbnail || "or drag and drop"}
    </div>
    <div class="upload-file-type">
      PNG, JPG {translations?.or || "or"} GIF ({translations?.max || "max"}.
      800x400px)
    </div>
  </div>
</div>

{#if modal && typeof image === "string"}
  <div class="modal">
    <CropperModal
      {image}
      shape="rect"
      cb={setCropImage}
      closeCb={() => {
        fileInput.value = "";
      }}
    />
  </div>
{/if}

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
  .modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 100000000000;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .file-uploader {
    display: flex;
    padding: var(--spacing-xl, 16px) var(--spacing-3xl, 24px);
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg, 12px);
    align-self: stretch;
    cursor: pointer;

    border-radius: var(--radius-xl, 12px);
    border: 1px solid var(--colors-border-border-secondary, #ededed);
    background: var(--colors-background-bg-primary, #fff);

    &:hover {
      background-color: var(--colors-background-bg-secondary_hover);
    }

    .hidden-input {
      display: none;
    }

    .upload-icon {
      display: flex;
      width: 40px;
      height: 40px;
      padding: 10px;
      justify-content: center;
      align-items: center;

      border-radius: var(--radius-md, 8px);
      border: 1px solid
        var(
          --component-colors-components-icons-featured-icons-modern-featured-icon-modern-border,
          #525252
        );

      /* Shadows/shadow-xs-skeuomorphic */
      box-shadow: 0px 0px 0px 1px
          var(
            --colors-effects-shadows-shadow-skeumorphic-inner-border,
            rgba(31, 31, 31, 0.18)
          )
          inset,
        0px -2px 0px 0px var(
            --colors-effects-shadows-shadow-skeumorphic-inner,
            rgba(31, 31, 31, 0.05)
          ) inset,
        0px 1px 2px 0px
          var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));

      path {
        stroke: var(--colors-foreground-fg-secondary);
      }
    }

    .upload-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs, 4px);
      align-self: stretch;
      color: var(--colors-text-text-tertiary-600, #6a6a6a);

      /* Text sm/Regular */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-sm, 14px);
      font-style: normal;
      font-weight: 400;
      line-height: var(--line-height-text-sm, 20px); /* 142.857% */

      .upload-action {
        color: var(--colors-text-text-brand-secondary-700, #ae460b);

        /* Text sm/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }

      .upload-file-type {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);

        /* Text xs/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-xs, 12px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-xs, 18px); /* 150% */
      }
    }
  }
</style>
