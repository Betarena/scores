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

  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import userSettings from "$lib/store/user-settings.js";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/create/[lang=lang]/$types.js";
  import session from "$lib/store/session.js";
  import WidgetMenuOpt from "../Widget-MenuOpt.svelte";
  import { post } from "$lib/api/utils.js";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { submitWrapper } from "$lib/utils/sveltekitWrapper.js";
  import { goto } from "$app/navigation";
  import { mutateStringToPermalink } from "@betarena/scores-lib/dist/util/language.js";
  export let data: PageData;

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

  let name = "";
  let inputError = false;
  let debounceTimer;
  let form: HTMLFormElement;
  $: translation = $page.data.RESPONSE_PROFILE_DATA?.sportstack;

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

  $: name = name.replace(/[^\w\s]/gi, "");

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

  function submit() {
    return submitWrapper({
      successMessage: "The publication was created successfully.",
      cbAfter: gotoPublication,
    });
  }

  async function validateName(val) {
    if (!val) return (inputError = false);
    const res = await post<{ isValid: boolean | undefined }>(
      "/api/data/author/sportstack/validate",
      { name: val }
    );
    inputError = !res?.isValid ?? false;
  }

  async function gotoPublication(e) {
    if (e.result.type !== "success") return;
    const permalink = mutateStringToPermalink(name);
    const url = `/u/author/publication/${permalink}/${userSettings.extract("lang")}`;
    await goto(url);
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

<Container>
  <form
    class="publication-create-wrapper {$session.viewportType}"
    method="POST"
    bind:this={form}
    action="/api/data/author/sportstack?/create"
    use:enhance={submit}
  >
    {#if $session.viewportType === "desktop"}
      <div class="menu">
        <WidgetMenuOpt />
      </div>
    {/if}
    <div id="publication-create" class={$session.viewportType}>
      <div class="header-wrapper">
        <div class="header">
          <h2>{translation?.create || "Publication Create"}</h2>
          <p>
            {translation?.description ||
              "Lorem ipsum dolor sit amet consectetur. Turpis sed et proin commodo."}
          </p>
        </div>
        <div class="buttons-header">
          <a data-sveltekit-replacestate href="/u/author/{$userSettings.lang}">
            <Button full={true} type="outline"
              >{translation?.cancel || "Cancel"}</Button
            >
          </a>
          <Button submit={true} disabled={inputError}
            >{translation?.save || "Save"}</Button
          >
        </div>
      </div>
      <div class="form">
        <div class="form-controls">
          <Input
            name="name"
            type="leading-text"
            placeholder={translation?.default_name || "default_sportstack"}
            on:input={debounceValidation}
            error={inputError}
            requred={true}
            bind:value={name}
          >
            <span slot="label">URL</span>
            <span slot="leading-text">sportstack/</span>
            <span slot="error"
              >{translation.alert || "The name is already in use."}</span
            >
            <span slot="info"
              >{translation.message ||
                "You can change the name later if you wish."}</span
            >
          </Input>
        </div>

        <div class="buttons">
          <a href="/u/author/{$userSettings.lang}">
            <Button full={true} type="secondary-gray"
              >{translation?.cancel || "Cancel"}</Button
            >
          </a>
          <Button submit={true} disabled={inputError}
            >{translation?.save || "Save"}</Button
          >
        </div>
      </div>
    </div>
  </form>
</Container>

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
  #publication-create {
    display: flex;
    padding: var(--spacing-none, 0px);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3xl, 24px);
    flex: 1 0 0;
    align-self: stretch;
    min-height: calc(var(--vh, 1vh) * 100 - 56px - 22px - 5px);
    padding-bottom: 22px;

    .header-wrapper {
      .header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs, 4px);
        align-self: stretch;
        h2 {
          color: var(--colors-text-text-primary-900, #fbfbfb);
          margin: 0;

          /* Display xs/Semibold */
          font-family: var(--Font-family-font-family-display, Roboto);
          font-size: var(--Font-size-display-xs, 24px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--Line-height-display-xs, 32px); /* 133.333% */
        }
        p {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text md/Regular */
          font-family: var(--Font-family-font-family-body, Roboto);
          font-size: var(--Font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--Line-height-text-md, 24px); /* 150% */
        }
      }

      .buttons-header {
        display: none;
      }
    }

    .form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-2xl, 20px);
      flex: 1 0 0;
      flex-grow: 1;
      align-self: stretch;
      .form-controls {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-self: stretch;
        .label {
          display: flex;
          flex-direction: column;
          height: max-content;
          input {
            border: 1px solid red;
            width: 100%;
            background-color: white;
          }
        }
      }
      .buttons {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-lg, 12px);
        align-self: stretch;
        a,
        :global(button) {
          flex-grow: 1;
        }
      }
    }

    :global(.button) {
      padding: 10px var(--spacing-xl, 16px);

      font-size: var(--font-size-text-md, 16px);
      font-style: normal;
      font-weight: 500;
      line-height: var(--line-height-text-md, 24px); /* 150% */
      max-height: 44px;
    }

    &.desktop {
      padding: var(--spacing-2xl, 20px);
      min-height: unset;

      .header-wrapper {
        display: flex;
        gap: 24px;
        width: 100%;

        .buttons-header {
          display: flex;
          flex-grow: 1;
          align-items: start;
          justify-content: end;
          width: 50%;
          gap: var(--spacing-lg, 12px);
          a {
            height: 44px;
            width: max-content;
          }
        }
        .header {
          width: 50%;
          flex-grow: 1;
          h2 {
            font-size: var(--font-size-text-xl, 20px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-text-xl, 30px); /* 150% */
          }
        }
      }

      .form {
        height: max-content;
        .buttons {
          display: none;
        }
      }
    }
  }

  .publication-create-wrapper {
    margin-top: 24px;

    &.desktop {
      margin-top: 0;
      display: flex;
      align-items: start;
      gap: var(--spacing-2xl, 20px);
      padding-top: var(--spacing-5xl, 40px);
      padding-bottom: 72px;
      min-height: calc(var(--vh, 1vh) * 100 - 128px);

      .menu {
        flex-shrink: 0;
        min-width: 328px;
      }
    }
  }
</style>
