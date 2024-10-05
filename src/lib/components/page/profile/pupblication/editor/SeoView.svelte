<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import BackButton from "$lib/components/ui/BackButton.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import XClose from "$lib/components/ui/infomessages/x-close.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";
  import ModalArticleSeo from "./ModalArticleSEO.svelte";

  $: ({ viewportType } = $session);

  function goBack() {
    $modalStore.component = ModalArticleSeo;
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

<div class="page-container {viewportType}">
  {#if viewportType === "mobile"}
    <Container style="height: unset">
      <div class="header">
        <BackButton on:click={goBack} custom_handler={true} />
      </div>
    </Container>
  {/if}
  <div class="content-wrapper">
    <div class="content">
      <div class="content-header-border">
        <Container>
          <div class="header-info">
            <div class="title-wrapper">
              <h2>SEO</h2>
              {#if viewportType !== "mobile"}
                <div class="close"  on:click={goBack}>
                  <XClose />
                </div>
              {/if}
            </div>
            <div class="info-desc">
              The changes made in the SEO details will affect how the article
              appears in public laces like Betarena homepage and in subscribers’
              inboxes — not the contents of the story itself.
            </div>
          </div>
        </Container>
      </div>
      <div class="form-wrapper">
        <Input placeholder="Default title" label="SEO title" />
        <Input
          inputType="textarea"
          height="176px"
          placeholder="Default title"
          label="SEO title"
        />
      </div>
    </div>
    <Container style="height: unset">
      <div class="buttons-wrapper">
        <Button full={viewportType !== "mobile"} type="secondary-gray" on:click={goBack}>Go Back</Button>
        <Button full={viewportType !== "mobile"}>Save</Button>
      </div>
    </Container>
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
  .page-container {
    background-color: var(--colors-background-bg-main);
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-bottom: 34px;

    .header {
      display: flex;
      height: 64px;
      align-items: center;
      gap: 20px;
      flex-shrink: 0;
      align-self: stretch;
    }

    .content-wrapper {
      display: flex;
      padding-bottom: var(--spacing-lg, 12px);
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2xl, 20px);
      flex: 1 0 0;
      align-self: stretch;

      .content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl, 16px);
        flex-grow: 1;

        .content-header-border {
          border-bottom: 1px solid
            var(--colors-border-border-secondary, #3b3b3b);

          .header-info {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md, 8px);
            align-self: stretch;
            padding-bottom: var(--spacing-xl, 16px);

            h2 {
              color: var(--colors-text-text-primary, #fbfbfb);

              /* Display xs/Semibold */
              font-family: var(--font-family-font-family-display, Roboto);
              font-size: var(--font-size-display-xs, 24px);
              font-style: normal;
              font-weight: 600;
              margin: 0;
              line-height: var(--line-height-display-xs, 32px); /* 133.333% */
            }

            .info-desc {
              color: var(--colors-text-text-quaternary, #8c8c8c);

              /* Text sm/Regular */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 400;
              line-height: var(--line-height-text-sm, 20px); /* 142.857% */
            }
          }
        }

        .form-wrapper {
          display: flex;
          padding: var(--spacing-none, 0px) var(--spacing-xl, 16px);
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          flex: 1 0 0;
          align-self: stretch;
        }
      }

      .buttons-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        align-self: stretch;

        :global(.button) {
          flex-grow: 1;
          flex-shrink: 0;
          flex-basis: 0;
        }
      }
    }

    &.tablet {
      width: var(--width-md, 560px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: auto;
      padding-bottom: 0;
      border-radius: var(--radius-xl, 12px);

      /* Shadows/shadow-xl */
      box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
        0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0));

      :global(.container-wrapper) {
        padding-inline: var(--spacing-xl, 16px);
      }

      .content-wrapper {
        gap: var(--spacing-3xl, 24px);
        padding-bottom: var(--spacing-xl, 16px);
        .header-info {
          padding-top: var(--spacing-2xl, 20px);
          gap: var(--spacing-xs, 4px);

          .title-wrapper {
            display: flex;
            justify-content: space-between;
            h2 {
              font-size: var(--font-size-text-lg, 18px);
              font-weight: 600;
              line-height: var(--line-height-text-lg, 28px); /* 155.556% */
            }

            .info-desc {
              font-size: var(--font-size-text-sm, 14px);
              font-style: normal;
              font-weight: 400;
              line-height: var(--line-height-text-sm, 20px); /* 142.857% */
            }
          }
        }

        .form-wrapper {
          gap: var(--spacing-2xl, 20px) !important;
        }

        .buttons-wrapper {
          flex-direction: column-reverse;
          gap: var(--spacing-lg, 12px);
        }
      }
    }
  }
</style>
