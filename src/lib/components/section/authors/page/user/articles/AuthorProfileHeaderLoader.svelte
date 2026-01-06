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

  import LoaderAvatar from "$lib/components/ui/loaders/LoaderAvatar.svelte";
  import LoaderButton from "$lib/components/ui/loaders/LoaderButton.svelte";
  import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";
  import LoaderSporttackAvatar from "$lib/components/ui/loaders/LoaderSporttackAvatar.svelte";
  import LoaderStackedAvatar from "$lib/components/ui/loaders/LoaderStackedAvatar.svelte";
  import session from "$lib/store/session.js";

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
    CNAME: string = "author-profile⮕header-loader";

  $: ({ viewportType } = $session);
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

<div
  class="user-header-wrapper"
  id={CNAME}
  class:mobile={viewportType === "mobile"}
>
  <div class="user-block">
    <div class="social-info">
      <LoaderAvatar size={64} />
      <div class="following-info">
        <div class="follow-block">
          <div class="count">
            <LoaderLine width={70} />
          </div>
          <div class="follow-block-text">
            <LoaderLine width={40} height={7} />
          </div>
        </div>
        <div class="follow-block">
          <div class="count">
            <LoaderLine width={70} />
          </div>
          <div class="follow-block-text">
            <LoaderLine width={40} height={7} />
          </div>
        </div>
      </div>
    </div>

    <div class="user-info">
      <div class="name">
        <LoaderLine width={100} />
      </div>
      <div class="nick">
        <LoaderLine width={70} height={7} />
      </div>
    </div>
    <div class="user-description">
      {#each ["100%", "80%", "90%"] as width}
        <LoaderLine {width} height={12} />
      {/each}
    </div>
    <div class="followers">
      <LoaderStackedAvatar size={24} count={3} />
      <div class="followers-names">
        <LoaderLine width={150} />
      </div>
    </div>
  </div>
  <div class="actions-wrapper">
    <div class="buttons-wrapper">
      <LoaderButton style="flex-grow: 1" />
      <LoaderButton style="flex-grow: 1" />
      <LoaderButton width={40} height={40} />
    </div>
    <div class="sportstack">
      <div class="sportstack-info">
        <LoaderSporttackAvatar size={48} style="flex-shrink: 0" />
        <div class="sportstack-name">
          <div class="name"><LoaderLine width={"60%"}  /></div>
          <div class="owner">
            <LoaderLine width={"80%"} height={7}/>
          </div>
        </div>
      </div>
      <div class="sportstack-description">
        {#each ["100%", "80%", "90%"] as width}
          <LoaderLine {width} height={12} />
        {/each}
      </div>
    </div>
    <div />
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
  .user-header-wrapper {
    display: flex;
    width: 100%;
    gap: 60px;
    justify-content: space-between;
    padding-bottom: 12px;
    background-color: var(--colors-background-bg-primary);
    --text-button-size: 14px;

    &.mobile {
      gap: 20px;
      padding-inline: 16px;
      padding-top: 3px;
      flex-direction: column;

      .actions-wrapper {
        flex-direction: column;
        justify-content: space-between;
        max-width: unset;
        width: 100%;
        .sportstack {
          max-width: unset;
        }
      }
    }

    .user-block {
      flex-direction: column;
      gap: 12px;
      display: flex;

      .social-info {
        display: flex;
        gap: 40px;

        .following-info {
          display: flex;
          justify-content: center;
          gap: 32px;

          .follow-block {
            display: flex;
            flex-direction: column;
            margin-top: 5px;
            cursor: pointer;

            .count {
              color: var(--text-color);
              font-weight: 600;
              font-size: 16px;
            }
            &-text {
              color: #8c8c8c;
              opacity: 0.8;
              font-size: 10px;
            }
          }
        }
      }

      .user-info {
        display: flex;
        flex-direction: column;

        .name {
          color: var(--text-color);
          font-family: Roboto;
          font-size: 20px;
          font-style: normal;
          font-weight: 500;
          line-height: 28px; /* 140% */
        }
        .nick {
          color: #8c8c8c;
          font-size: 12px;
        }
      }

      .user-description {
        font-family: Roboto;
        display: flex;
        flex-direction: column;
        font-size: 12px;
        gap: 4px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        color: var(--text-color);
        opacity: 0.8;
      }

      .followers {
        display: flex;
        gap: 8px;
        font-family: Roboto;
        font-size: var(--text-size-xs);
        line-height: calc(var(--text-size-xs) + 3px);
        font-style: normal;
        line-height: 13px;
        margin-top: 4px;
        margin-top: auto;
        align-items: center;
        color: var(--text-color-second);
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;

        .followers-names {
          max-width: 206px;
        }
        .subscribed_by {
          color: var(--text-color);
          opacity: 0.8;
        }

        .username {
          font-weight: 500;
          display: inline;
          color: var(--text-color);
          &:hover {
            text-decoration: underline !important;
          }
          &::before {
            content: " ";
          }
        }
      }
    }

    .actions-wrapper {
      display: flex;
      max-width: 345px;
      width: 100%;
      gap: 24px;
      flex-shrink: 0;
      flex-direction: column-reverse;
      justify-content: space-between;

      .buttons-wrapper {
        display: flex;
        gap: 8px;
        width: 100%;

        .edit-button {
          flex-grow: 1;
        }
      }

      .sportstack {
        padding: 16px;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-color-second);
        border-radius: 8px;
        gap: 12px;
        max-width: 345px;
        width: 100%;
        cursor: pointer;

        &:hover {
          background-color: rgba(var(--bg-color-second-rgb-consts), 0.7);
        }

        &-info {
          gap: 12px;
          display: flex;
          align-items: center;
        }

        &-name {
          display: flex;
          flex-direction: column;

          .name {
            font-family: Roboto;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            color: var(--text-color);
            &:hover {
              color: var(--primary);
            }
          }
          .owner {
            color: var(--text-color);
            font-family: var(--font-family-font-family-body, Roboto);
            opacity: 0.8;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 150% */
            &:hover {
              text-decoration: underline !important;
            }
            &::before {
              content: " ";
            }
          }
        }

        &-description {
          color: var(--text-color);
          font-family: Roboto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: var(--text-size-s);
          font-style: normal;
          opacity: 0.8;
          font-weight: 400;
          line-height: 18px; /* 150% */
        }
      }
    }
  }
</style>
