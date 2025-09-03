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
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import session from "$lib/store/session";
  import { gotoSW } from "$lib/utils/sveltekitWrapper";
  import { updateUserProfileData } from "$lib/utils/user";
  import img from "../assets/publish.png";
  import img_tablet from "../assets/publish_tablet.png";
  import img_stars from "../assets/Stars.png";
  import { loginStore } from "../login-store";

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

  $: ({ viewportType } = $session);
  $: translations = $page.data.auth_translations.data[0];
  let loading = false;

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

  async function skip() {
    loading = true;
    await updateUserProfileData({ verified: true });
    $session.currentActiveModal = null;
    gotoSW("/", true);
    loading = false;
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
<div class="ready-to-publish-wrapper {viewportType}">
  {#if viewportType === "desktop"}
    <div class="side-banner">
      <img
        id=""
        src="https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/Betarena_Media%2Fgeneral%2Fsportstacks_1-min.png?alt=media&token=92e7eb7d-8025-4686-8a25-989c9335a5dc"
        alt=""
        title=""
        loading="lazy"
      />
      <div class="cta-wrapper">
        <div class="star-img">
          <img id="" src={img_stars} alt="" title="" loading="lazy" />
        </div>

        <div class="cta">
          <div class="side-text-wrapper">
            <h2>
              {translations.start_tuning ||
                "Start turning your ideas into reality."}
            </h2>
            <p>
              {translations.create_own_publication ||
                "Create your own publication and get full access to all features."}
            </p>
          </div>
        </div>
      </div>
    </div>
  {/if}
  <div class="ready-to-publish">
    {#if viewportType !== "desktop"}
      <img
        id=""
        src={viewportType === "tablet" ? img_tablet : img}
        alt="ready to publish"
        title=""
        loading="lazy"
      />
    {/if}
    <div class="text-wrapper">
      <Container>
        <div class="content">
          <div class="heading-wrapper">
            <h2>{translations.ready_publish || "Ready to publish?"}</h2>
            <p>
              {translations.create_sportstack ||
                "Create your own Sportstack and start building your brand."}
            </p>
          </div>
          <div class="actions">
            <Button
              size="xl"
              type="primary"
              full={true}
              disabled={loading}
              on:click={() => ($loginStore.currentStep += 1)}
              >{translations.create_publication || "Create Publication"}</Button
            >
            <Button
              size="xl"
              type="secondary"
              full={true}
              disabled={loading}
              on:click={skip}
              >{translations.skip_for_now || "Skip for now"}</Button
            >
          </div>
        </div>
      </Container>
    </div>
  </div>
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
  .ready-to-publish-wrapper {
    display: flex;
    height: 100vh;
    .side-banner {
      width: 50%;
      flex-shrink: 0;

      max-height: 100vh;
      position: relative;
      display: flex;
      background-color: #131313;
      flex-direction: column;
      justify-content: flex-start;
      background-size: contain;
      background-repeat: no-repeat;
      img {
        width: 100%;
      }

      .cta-wrapper {
        transform: translateY(-52%);
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: var(--spacing-4xl, 32px);
        align-self: stretch;
        padding: var(--spacing-9xl, 96px) var(--spacing-7xl, 64px);
        padding-top: calc(
          80px + var(--spacing-4xl, 32px) + var(--spacing-9xl, 96px)
        );
      }
      .cta {
        z-index: 1;
        display: flex;
        width: 592px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-4xl, 32px);

        .side-text-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-2xl, 20px);
          align-self: stretch;

          h2 {
            margin: 0;
            color: var(--colors-text-text-white, #fff);

            /* Display xl/Semibold */
            font-family: var(--font-family-font-family-display, Roboto);
            font-size: var(--font-size-display-xl, 60px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-xl, 72px); /* 120% */
            letter-spacing: -1.2px;
          }

          p {
            width: 100%;
            color: var(--colors-text-text-white, #fff);
            text-align: start;
            /* Text lg/Medium */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-lg, 18px);
            font-style: normal;
            font-weight: 500;
            line-height: var(--line-height-text-lg, 28px); /* 155.556% */
          }
        }
      }
    }

    .ready-to-publish {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;

      img {
        width: 100%;
      }
      .text-wrapper {
        :global(.container-wrapper) {
          padding-block: 24px;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-4xl, 32px);
          flex: 1 0 0;
          align-self: stretch;

          .heading-wrapper {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xl, 16px);
            align-self: stretch;

            h2 {
              color: var(--colors-text-text-primary-900, #fff);
              margin: 0;

              /* Display sm/Semibold */
              font-family: var(--Font-family-font-family-display, Roboto);
              font-size: var(--Font-size-display-sm, 30px);
              font-style: normal;
              font-weight: 600;
              line-height: var(--Line-height-display-sm, 38px); /* 126.667% */
            }
            p {
              max-width: var(--width-sm, 480px);
              color: var(--colors-text-text-tertiary-600, #8c8c8c);
              margin: 0;
              /* Text md/Regular */
              font-family: var(--Font-family-font-family-body, Roboto);
              font-size: var(--Font-size-text-md, 16px);
              font-style: normal;
              font-weight: 400;
              line-height: var(--Line-height-text-md, 24px); /* 150% */
            }
          }

          .actions {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-lg, 12px);
            align-self: stretch;
          }
        }
      }
    }

    &.desktop {
      .ready-to-publish {
        height: 100%;
        width: 100%;
        padding-inline: 60px;
        justify-content: center;
        align-items: center;
        .text-wrapper {
          width: 100%;
          max-width: 610px;
          margin: auto;
          :global(.container-wrapper) {
            padding: 0;
            width: 100%;
            margin: 0;
            max-width: 100%;
          }
          .content {
            width: 100%;
            gap: var(--spacing-6xl, 48px);

            .heading-wrapper {
              gap: var(--spacing-3xl, 24px);
              h2 {
                color: var(--colors-text-text-primary-900, #fff);

                /* Display xl/Semibold */
                font-family: var(--font-family-font-family-display, Roboto);
                font-size: var(--font-size-display-xl, 60px);
                font-style: normal;
                font-weight: 600;
                line-height: var(--line-height-display-xl, 72px); /* 120% */
                letter-spacing: -1.2px;
              }
              p {
                color: var(--colors-text-text-tertiary-600, #8c8c8c);

                /* Text xl/Regular */
                font-family: var(--Font-family-font-family-body, Roboto);
                font-size: var(--Font-size-text-xl, 20px);
                font-style: normal;
                font-weight: 400;
                line-height: var(--Line-height-text-xl, 30px); /* 150% */
              }
            }
          }
        }
      }
    }

    &.tablet {
      .text-wrapper {
        flex-grow: 1;
      }
      :global(.container-wrapper) {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center !important;
        align-items: center !important;
      }
      .content {
        max-width: 343px;
        max-height: max-content;
        margin: auto;
      }
    }
  }
</style>
