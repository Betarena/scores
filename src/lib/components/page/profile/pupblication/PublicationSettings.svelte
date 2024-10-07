<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import { infoMessages } from "$lib/components/ui/infomessages/infomessages.js";
  import Input from "$lib/components/ui/Input.svelte";
  import session from "$lib/store/session.js";
  import type { AuthorsAuthorsDataJSONSchema, AuthorsAuthorsMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import PublicationAvatar from "./PublicationAvatar.svelte";

  export let selectedSportstack: AuthorsAuthorsMain;

  let inputError = false;
  let debounceTimer;
  let form: HTMLFormElement;
  let fileInput: HTMLInputElement;
  $: translation = $page.data.RESPONSE_PROFILE_DATA?.sportstack;
  let username = "";
  $: ({ viewportType } = $session);
  $: ({ permalink, data = {} } = selectedSportstack);
  $: ({username} = data as AuthorsAuthorsDataJSONSchema);
  // #endregion ➤ 📌 VARIABLES

  function debounceValidation(e: CustomEvent<string>) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => validateName(e.detail), 300); // 300ms debounce
  }

  async function validateName(val) {
    if (!val) return (inputError = false);
    const v = JSON.stringify({ name: val });
    const res = await post<{ isValid: boolean | undefined }>(
      "/api/data/author/sportstack/validate",
      { name: val }
    );
    inputError = !res?.isValid ?? false;
  }

  function submit() {
    if (inputError) return;
    const loadingId = infoMessages.add({
      type: "loading",
      text: "",
    });

    return ({ update }) => {
      // Set invalidateAll to false if you don't want to reload page data when submitting
      update({ invalidateAll: false }).finally(async (d) => {
        infoMessages.remove(loadingId);
        if ($page.form.error) {
          infoMessages.add({
            type: "error",
            text: "An error occurred.",
          });
        }
        if ($page.form.success) {
          infoMessages.add({
            type: "success",
            text: "The publication was created successfully.",
          });
        }
      });
    };
  }
  $: url = permalink?.replace(/[^\w\s-]/gi, "") || "";
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

<form method="POST" id="publication-settings" class="form {viewportType}">
  <Input
    name="url"
    type="leading-text"
    label="URL"
    placeholder={translation?.default_name || "default_sportstack"}
    on:input={debounceValidation}
    error={inputError}
    requred={true}
    bind:value={url}
  >
    <span slot="leading-text">sportstack/</span>
    <span slot="error"
      >{translation.alert || "The name is already in use."}</span
    >
  </Input>

  <div class="thumbnail-field">
    <div class="label">Thumbnail</div>
    <div class="input-wrapper">
      <PublicationAvatar />

      <div class="file-uploader" on:click={() => fileInput.click()}>
        <input type="file" class="hidden-input" bind:this={fileInput} />
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
          <div class="upload-title">Upload thumbnail</div>
          <div class="upload-file-type">PNG, JPG or GIF (max. 800x400px)</div>
        </div>
      </div>
    </div>
  </div>
  <Input
    name="name"
    label="Name"
    placeholder={translation?.default_name || "Default name"}
    on:input={debounceValidation}
    requred={true}
    bind:value={username}
  />

  <Input
    name="description"
    label="Description"
    inputType="textarea"
    placeholder={"Write your description"}
  />
  {#if viewportType !== "desktop"}
    <div class="button-wrapper">
      <Button type="primary" submit={true} full={viewportType === "mobile"}
        >Save</Button
      >
    </div>
  {/if}
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
        line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
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
          align-items: flex-start;
          gap: var(--spacing-lg, 12px);
          flex: 1 0 0;

          border-radius: var(--radius-xl, 12px);
          border: 1px solid var(--colors-border-border-secondary, #3b3b3b);
          background: var(--colors-background-bg-primary_alt, #313131);

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

            .upload-title {
              color: var(
                --Component-colors-Components-Buttons-Tertiary-color-button-tertiary-color-fg,
                #d2d2d2
              );

              /* Text sm/Medium */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 500;
              line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
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

    &.tablet,
    &.desktop {
      .thumbnail-field {
        .input-wrapper {
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
      }
    }
  }
</style>
