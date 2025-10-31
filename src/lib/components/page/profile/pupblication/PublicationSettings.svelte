<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  import { enhance } from "$app/forms";
  import { goto, invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { post } from "$lib/api/utils.js";
  import Button from "$lib/components/ui/Button.svelte";
  import CropperModal from "$lib/components/ui/Cropper/CropperModal.svelte";
  import { infoMessages } from "$lib/components/ui/infomessages/infomessages.js";
  import Input from "$lib/components/ui/Input.svelte";
  import { uploadImage } from "$lib/firebase/common.js";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";
  import { dlog } from "$lib/utils/debug.js";
  import { submitWrapper } from "$lib/utils/sveltekitWrapper.js";
  import { mutateStringToPermalink } from "@betarena/scores-lib/dist/util/language.js";
  import type {
    AuthorsAuthorsDataJSONSchema,
    AuthorsAuthorsMain,
    TranslationSportstacksSectionDataJSONSchema,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import type { Writable } from "svelte/store";
  import DeleteModal from "./DeleteModal.svelte";
  import PublicationAvatar from "./PublicationAvatar.svelte";
  import UrlInfo from "./UrlInfo.svelte";

  // #endregion ➤ 📦 Package Imports

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

  export let selectedSportstack: Writable<AuthorsAuthorsMain>;
  export let translations:
    | TranslationSportstacksSectionDataJSONSchema
    | undefined;

  let inputError = false,
    debounceTimer,
    form: HTMLFormElement,
    fileInput: HTMLInputElement,
    files: HTMLInputElement["files"] | undefined,
    username = "",
    profile_pic: string | undefined;

  let image;

  $: descriptionError = desc.length >= 200;
  $: translation = $page.data.RESPONSE_PROFILE_DATA?.sportstack;
  $: ({ viewportType } = $session);
  $: ({ theme } = { ...$userSettings });
  $: ({ data = {}, id, permalink: initPermalink } = $selectedSportstack);
  $: ({
    username,
    about,
    avatar: initialAvatar,
  } = data as AuthorsAuthorsDataJSONSchema);
  $: ({ username: initialName } = data as AuthorsAuthorsDataJSONSchema);

  $: desc = about || "";
  $: name = username || "";
  $: avatar = initialAvatar || "";

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  $: url = permalink?.replace(/[^\w\s-]/gi, "") || "";
  $: permalink = mutateStringToPermalink(username);

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]


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




  function debounceValidation(e: CustomEvent<string>) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => validateName(e.detail), 300); // 300ms debounce
  }

  function setCropImage(img) {
    profile_pic = img;
    avatar = img;
    $modalStore.show = false;
  }

  function showDeleteModal() {
    modalStore.set({
      modal: true,
      component: DeleteModal,
      props: {
        translations,
        id,
        deleteSportsTack: true,
        cb: deleteSportstack,
      },
      show: true,
    });
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
      modalStore.set({
        modal: true,
        component: CropperModal,
        props: {
          image,
          shape: "rect",
          cb: setCropImage,
          closeCb: () => {
            fileInput.value = "";
          },
        },
        show: true,
      });
    };
    reader.readAsDataURL(file);
    files = undefined;
  }

  async function validateName(val) {
    permalink = mutateStringToPermalink(val);
    if (!val || val === initialName) return (inputError = false);
    const v = JSON.stringify({ name: val });
    const res = await post<{ isValid: boolean | undefined }>(
      "/api/data/author/sportstack/validate",
      { name: val }
    );

    inputError = !res?.isValid ?? false;
  }
  async function submit(e) {
    e.data.append("avatar", avatar);
    if (profile_pic) {
      const avatar = await uploadImage(
        profile_pic,
        `Betarena_Media/authors/authors_list/${id}/avatars/${id}.png`
      );
      (e.data as FormData).set("avatar", avatar)
    }

    return submitWrapper({
      successMessage:
        translations?.update_success ||
        "The publication was updated successfully.",
      cbAfter: async (e) => {
        const name = e.data.get("username");
        const avatar = e.data.get("avatar");
        const permalink = mutateStringToPermalink(name);
        selectedSportstack.update((prev) => {
          return {
            ...prev,
            data: { ...prev.data, avatar },
            username: name,
            label: name,
            permalink,
            avatar,
          };
        });
        window.history.replaceState(
          {},
          "",
          `/u/author/publication/${permalink}/${session.extract("lang")}${
            $page.url.search
          }`
        );
        invalidateAll();
      },
    });
  }

  async function deleteSportstack() {
    $modalStore.show = false;
    const loadingId = infoMessages.add({
      type: "loading",
      title: "Deleting publication...",
    });
    const res = await fetch(`/api/data/author/sportstack`, {
      method: "DELETE",
      body: JSON.stringify({ id, uid: $selectedSportstack.uid }),
    });
    infoMessages.remove(loadingId);
    const data = await res.json();
    if (data.success) {
      infoMessages.add({
        type: "success",
        title: translations?.publication_deleted || "Publication deleted!",
      });
      setTimeout(() => {
        goto(`/u/author/${session.extract("lang")}`);
      }, 1000);
    } else {
      infoMessages.add({
        type: "error",
        title: "Failed to delete publication.",
      });
    }
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

<form
  method="POST"
  bind:this={form}
  id="publication-settings"
  class="form {viewportType}"
  use:enhance={submit}
  class:light-mode={theme == "Light"}
  action="/api/data/author/sportstack?/update"
>
  <input type="hidden" name="id" value={id} />
  <input type="hidden" name="permalink" value={initPermalink} />

  <UrlInfo permalink={url} />

  <Input
    name="username"
    label={translations?.name || "Name"}
    placeholder={translation?.default_name || "Default name"}
    on:input={debounceValidation}
    required={true}
    error={inputError}
    bind:value={name}
  >
    <span slot="error"
      >{$page.data.RESPONSE_PROFILE_DATA.sportstack.alert ||
        "The name is already in use."}</span
    >
  </Input>

  <div class="thumbnail-field">
    <div class="label">{translations?.thumbnail || "Thumbnail"}</div>
    <div class="input-wrapper">
      <PublicationAvatar
        {avatar}
        size={viewportType === "mobile" ? "92px" : "74px"}
      />

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
            {translations?.upload_thumbnail || "Upload thumbnail"}
          </div>
          <div class="upload-file-type">
            PNG, JPG {translations?.or || "or"} GIF ({translations?.max ||
              "max"}. 800x400px)
          </div>
        </div>
      </div>
    </div>
  </div>

  <Input
    name="about"
    label={translations?.description || "Description"}
    inputType="textarea"
    error={descriptionError}
    placeholder={translations?.description_place_holder ||
      "Write your description"}
    bind:value={desc}
  >
  <span slot="error">Max 200 chars</span>

</Input>
  <div class="button-wrapper">
    <Button
      type="primary"
      disabled={!name || descriptionError}
      submit={true}
      full={viewportType === "mobile"}>{translations?.save || "Save"}</Button
    >
  </div>
  <div class="separator" />
  <div class="delete-wrapper">
    <div class="warn-text">
      <h3>{translations?.delete_publication || "Delete publication"}</h3>
      <p>
        {translations?.permanently_delete ||
          `Permanently delete your publication, podcasts and subscriber list. This
        action is permantely and can’t be rolled back`}
      </p>
    </div>
    <Button
      type="subtle"
      on:click={showDeleteModal}
      full={viewportType === "mobile"}
      >{translations?.delete || "Delete"}</Button
    >
  </div>
</form>

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
  .form {
    display: flex;
    height: fit-content;
    flex-shrink: 0;
    height: max-content;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    flex: 1 0 0;
    align-self: stretch;

    .thumbnail-field {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-sm, 6px);
      align-self: stretch;

      .label {
        color: var(--colors-text-text-secondary-700, #d2d2d2);

        /* Text sm/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }

      .input-wrapper {
        display: flex;
        height: 92px;
        align-items: flex-start;
        gap: 16px;
        align-self: stretch;

        :global(.img) {
          width: 92px;
          height: 92px;
        }

        .file-uploader {
          display: flex;
          padding: var(--spacing-xl, 16px);
          justify-content: center;
          align-items: center;
          gap: var(--spacing-lg, 12px);
          flex: 1 0 0;
          height: 100%;

          border-radius: var(--radius-xl, 12px);
          border: 1px solid var(--colors-border-border-secondary, #3b3b3b);
          background: var(--colors-background-bg-primary_alt, #313131);
          cursor: pointer;

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
            align-items: flex-start;
            gap: var(--spacing-xs, 4px);
            align-self: stretch;
            justify-content: center;

            .upload-title {
              color: var(
                --component-colors-components-buttons-tertiary-color-button-tertiary-color-fg
              );

              /* Text sm/Medium */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 500;
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
      }
    }

    .button-wrapper {
      width: 100%;
      margin-top: -4px;
    }

    .separator {
      width: 100%;
      height: 1px;
      background-color: var(--colors-border-border-secondary, #3b3b3b);
    }
    .delete-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2xl, 20px);
      align-self: stretch;
      :global(.button) {
        background-color: #292929;
        border: 1px solid var(--custom-button-gray-border, #737373) !important;
        color: #ff5959 !important;
        display: flex;
        height: 44px;
        padding: 12px 24px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        min-width: 160px;
        &:hover {
          border: 1px solid var(--colors-background-bg-secondary_hover) !important;
          color: var(--colors-foreground-fg-error-primary) !important;
        }
      }

      .warn-text {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 9px;
        align-self: stretch;

        h3 {
          color: var(--colors-text-text-error-primary-600, #f97066);
          margin: 0;
          text-align: left;
          /* Text md/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
        p {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }

    &.tablet,
    &.desktop {
      gap: 20px;
      .thumbnail-field {
        .input-wrapper {
          height: 74px;
          :global(.img) {
            width: 74px;
            height: 74px;
          }

          .file-uploader {
            width: max-content;
            flex: unset;
          }
        }
      }

      .button-wrapper {
        display: flex;
        justify-content: center;
        :global(.button) {
          min-width: 160px;
        }
      }

      .delete-wrapper {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
    &.light-mode {
      .delete-wrapper {
        :global(.button) {
          background-color: #fff;
        }
      }
    }
  }
</style>
