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
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import session from "$lib/store/session";
  import { gotoSW } from "$lib/utils/sveltekitWrapper";
  import img from "../assets/publish.png";
  import { loginStore } from "../login-store";

  $: ({ viewportType } = $session);

  // #endregion ➤ 📦 Package Imports
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
  <div class="side-banner">
    <img
      id=''
      src=''
      alt=''
      title=''
      loading='lazy'
    />
  </div>
  <div class="ready-to-publish ">
    <img id="" src={img} alt="ready to publish" title="" loading="lazy" />
    <div class="text-wrapper">
      <Container>
        <div class="content">
          <div class="heading-wrapper">
            <h2>Ready to publish?</h2>
            <p>Create your own Sportstack and start building your brand.</p>
          </div>
          <div class="actions">
            <Button
              size="xl"
              type="primary"
              full={true}
              on:click={() => ($loginStore.currentStep += 1)}
              >Create Publication</Button
            >
            <Button
              size="xl"
              type="secondary"
              full={true}
              on:click={() => {
                $session.currentActiveModal = null;
                gotoSW("/", true);
              }}>Skip for now</Button
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
          padding-top: 54px;
          padding-bottom: 24px;
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
  }
</style>
