<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📌 VARIABLES

  import session from "$lib/store/session.js";
  import LoaderSporttackAvatar from "$lib/components/ui/loaders/LoaderSporttackAvatar.svelte";
  import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";
  import LoaderButton from "$lib/components/ui/loaders/LoaderButton.svelte";

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

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "sportstack-profile⮕header";

  $: ({ viewportType } = $session);

  // #endregion ➤ 📌 VARIABLES
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

<div class="sportstack-header-wrapper {viewportType}" id={CNAME}>
  <div class="sportstack-main-info {viewportType}">
    <div class="sportstack-block">
      <div class="sportstack-info">
        <LoaderSporttackAvatar size={64} />
        <div class="name"><LoaderLine height={20} /></div>
      </div>

      <div class="sportstack-description">
        <div class="about-text">
          {#each ["100%", "80%", "90%"] as width}
            <LoaderLine {width} height={10} />
          {/each}
        </div>
        <div class="actions-wrapper">
          <div class="buttons-wrapper">
            <LoaderButton style="flex-grow: 1" width={145} />
            <LoaderButton width={40} height={40} />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="tabbar">
    <LoaderLine height={12} width={50} />
    <LoaderLine height={12} width={50} />
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
  .sportstack-header-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: var(--colors-background-bg-primary);
    width: 100%;
    font-family: Roboto;
    --text-button-size: 14px;

    .tabbar {
      display: flex;
      gap: 24px;
    }

    &.mobile {
      padding-inline: 16px;
      padding-top: 3px;

      .sportstack-main-info {
        gap: 20px;
        flex-direction: column;

        .actions-wrapper {
          flex-direction: column;
          justify-content: space-between;
          .sportstack {
            max-width: unset;
          }
        }

        .sportstack-block {
          align-items: center;
          gap: 12px;

          .sportstack-info {
            flex-direction: column;
            gap: 16px;
          }

          .sportstack-description {
            flex-direction: column;
            width: 100%;
            gap: 20px;
            text-align: center;
          }
        }
      }
    }

    .sportstack-main-info {
      display: flex;
      flex-direction: column;
      gap: 60px;
      justify-content: space-between;

      .sportstack-block {
        flex-direction: column;
        gap: 16px;
        justify-content: center;
        display: flex;

        .social-info {
          display: flex;
          gap: 40px;

          .follow-block {
            display: flex;
            flex-direction: column;
            margin-top: 5px;
            .count {
              color: var(--text-color);
              font-weight: 600;
              font-size: 16px;
            }
            &-text {
              color: var(--text-color-second);
              font-size: 10px;
            }
          }
        }

        .sportstack-info {
          display: flex;
          align-items: center;
          gap: 24px;
          width: 100%;

          .name {
            color: var(--text-color);
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: 28px; /* 140% */
          }
        }

        .sportstack-description {
          display: flex;
          justify-content: space-between;
          font-size: var(--text-size-s);
          font-style: normal;
          font-weight: 400;
          color: var(--text-color);
          .about-text {
            display: flex;
            flex-direction: column;
            gap: 4px;
            line-height: 20px;
            opacity: 0.8;
            max-width: 355px;
          }
        }

        .followers {
          display: flex;
          gap: 8px;
          font-size: 10px;
          font-style: normal;
          line-height: 13px;
          margin-top: 4px;
          align-items: center;
          color: var(--text-color-second);

          .followers-names {
            max-width: 206px;
          }

          .username {
            font-weight: 500;
            color: var(--text-color);
          }
        }
      }

      .actions-wrapper {
        display: flex;

        gap: 24px;
        flex-shrink: 0;
        flex-direction: column-reverse;
        justify-content: space-between;

        .buttons-wrapper {
          display: flex;
          gap: 8px;
          width: 100%;
        }
      }
    }
  }
</style>
