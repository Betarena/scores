<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { post } from "$lib/api/utils.js";
  import GridBg from "$lib/components/shared/backround-patterns/GridBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import session from "$lib/store/session";
  import { submitWrapper } from "$lib/utils/sveltekitWrapper.js";
  import IconLink from "../icons/IconLink.svelte";
  import { loginStore } from "../login-store";

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
  let debounceTimer;
  let inputError = false;
  let disabled = true;
  $: ({ viewportType } = $session);
  $: translations = $page.data.auth_translations.data[0];

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

  function debounceValidation(e: CustomEvent<string>) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => validateName(e.detail), 300); // 300ms debounce
  }

  async function validateName(val) {
    disabled = true;
    if (!val) return (inputError = false);
    const res = await post<{ isValid: boolean | undefined }>(
      "/api/data/author/sportstack/validate",
      { name: val }
    );
    inputError = !res?.isValid;
    if (!inputError) {
      disabled = false;
    }
    console.log("Input error:", inputError);
  }

  function submit() {
    return submitWrapper({
      successMessage: "The publication was created successfully.",
      cbAfter: (e) => {
        if(e.result.type !== "success") return;
        $loginStore.sportstack = {
          ...e.result.data.data,
        };
        $loginStore.currentStep += 1;
      },
    });
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                  d       │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div class="country-step {viewportType}">
  <div class="logo-wrapper">
    <div class="bg">
      <GridBg size={viewportType === "desktop" ? "768" : "468"} />
    </div>
    <div class="icon-wrapper">
      <IconLink />
    </div>
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>{translations.sportstack_domain ||"Sportstack Domain"}</h2>
        <p class="subtitle">{translations.choose_handle || "Choose your Sportstack handle"}</p>
      </div>
      <form
        class="form-body"
        method="POST"
        action="/api/data/author/sportstack?/create"
        use:enhance={submit}
      >
        <Input
          name="name"
          type="leading-text"
          placeholder={"name"}
          on:input={debounceValidation}
          error={inputError}
          required={true}
          label="Username"
          bind:value={$loginStore.sportstack.permalink}
        >
          <span slot="leading-text">sportstack/</span>
          <span slot="error">{translations.the_name_in_use || "The name is already in use."}</span>
        </Input>

        <Button full={true} {disabled} size="lg" submit={true}>{translations.continue || "Continue"}</Button>
      </form>
    </div>
  </Container>
</div>

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
  .country-step {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    position: relative;
    gap: var(--spacing-4xl, 32px);

    .logo-wrapper {
      display: flex;
      justify-content: center;
      height: max-content;
      position: relative;
      width: 100%;
      z-index: 0;
      .bg {
        position: absolute;
        z-index: 0;
        right: 50%;
        top: 50%;
        transform: translate(50%, -50%);
      }
      .icon-wrapper {
        z-index: 1;
        display: flex;
        width: 56px;
        height: 56px;
        padding: 14px;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1/1;
        border-radius: var(--spacing-lg, 12px);
        border: 1px solid var(--colors-border-border-primary, #525252);
        background: var(--colors-background-bg-primary, #1f1f1f);

        /* Shadows/shadow-xs-skeuomorphic */
        box-shadow: 0 0 0 1px
            var(
              --colors-effects-shadows-shadow-skeumorphic-inner-border,
              rgba(12, 14, 18, 0.18)
            )
            inset,
          0 -2px 0 0 var(
              --colors-effects-shadows-shadow-skeumorphic-inner,
              rgba(12, 14, 18, 0.05)
            ) inset,
          0 1px 2px 0
            var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
        color: var(--colors-foreground-fg-secondary-700);
        svg {
          width: 28px;
          height: 28px;
        }
      }
    }
    .form {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4xl, 32px);
      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md, 8px);
        justify-content: center;
        h2 {
          color: var(--colors-text-text-primary-900, #fff);
          text-align: center;
          margin: 0;

          /* Display xs/Semibold */
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-display-xs, 24px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-display-xs, 32px); /* 133.333% */
        }
        .subtitle {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);
          text-align: center;

          /* Text md/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
      }

      .form-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-4xl, 32px);
        align-self: stretch;

        .select-icon {
          color: var(--colors-foreground-fg-quaternary-400);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    &.desktop {
      .form {
        .header {
          gap: var(--spacing-lg, 12px);

          h2 {
            font-size: var(--font-size-display-sm, 30px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-sm, 38px); /* 126.667% */
          }
        }
      }
    }

    &.tablet {
      .form {
        max-width: 343px;
        margin: 0 auto;
      }
    }
  }
</style>
