<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import GridBg from "$lib/components/shared/backround-patterns/GridBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import SectionLabel from "$lib/components/ui/SectionLabel.svelte";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";
  import Uploader from "$lib/components/ui/Uploader.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { uploadImage } from "$lib/firebase/common";
  import session from "$lib/store/session";
  import { submitWrapper } from "$lib/utils/sveltekitWrapper";
  import IconImg from "../icons/IconImg.svelte";
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

  let isLoading = false;
  let form: HTMLFormElement;
  let button: HTMLButtonElement;

  let avatar = "";
  $: ({ id = 0, permalink = "" } = $loginStore.sportstack);
  $: ({ viewportType } = $session);
  $: translations = $page.data.auth_translations.data[0];

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
  // ╰───────────────────────────────────────────────────────────────╯

  async function uploadProfilePicture(e: CustomEvent<string>): Promise<void> {
    const img = e.detail;
    $loginStore.sportstack_img = img;
    avatar = img;
    const id = $loginStore.sportstack.id;
    // if (!id) return;
    isLoading = true;
    avatar = await uploadImage(
      img,
      `Betarena_Media/authors/authors_list/${id}/avatars/${id}.png`
    );
    button.click();
  }

  async function handleContinue(): Promise<void> {
    if (isLoading) {
      return;
    }
    $loginStore.currentStep += 1;
  }

  async function submit(e) {
    e.data.append("avatar", avatar);
    return submitWrapper({
      successMessage: "The publication was updated successfully.",
      cbAfter: (e) => {
        isLoading = false
        $loginStore.sportstack = {
          ...e.result.data.data,
        };
      },
    });
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯
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

<div class="profile-step {viewportType}">
  <div class="logo-wrapper">
    <div class="bg">
      <GridBg size={viewportType === "desktop" ? "768" : "468"} />
    </div>
    <div class="profile-icon">
      <IconImg />
    </div>
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>{translations.sportstack_avatar || "Sportstack Avatar"}</h2>
        <p class="subtitle">{translations.choose_profile_picture || "Choose a profile picture"}</p>
      </div>
      <form
        class="form-body"
        method="POST"
        bind:this={form}
        use:enhance={submit}
        action="/api/data/author/sportstack?/update"
      >
        <button bind:this={button} style="display: none" hidden type="submit" />
        <input type="hidden" id="id" name="id" value={id} />
        <input
          type="hidden"
          id="permalink"
          name="permalink"
          value={permalink}
        />
        <input type="hidden" id="permalink" name="permalink" value={permalink} />
        <div class="profile-photo-wrapper">
          <SectionLabel title={translations.your_publication_avatar || "Your publication Avatar"} text={translations.upload_avatar || "Upload Avatar"} />
          <SportstackAvatar size="xxl" src={avatar} />
          <Uploader bind:avatar on:upload={uploadProfilePicture} />
        </div>
        <Button
          full={true}
          size="lg"
          disabled={isLoading || !$loginStore.sportstack.data?.avatar}
          on:click={handleContinue}
        >
          {isLoading ? translations.processing || "Updating..." : translations.continue || "Continue"}
        </Button>
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
  .profile-step {
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
      .profile-icon {
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

        .profile-photo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          align-self: stretch;
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
