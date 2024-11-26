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

  import Badge from "$lib/components/ui/Badge.svelte";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";
  import type { AuthorsAuthorsDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import PublicationAvatar from "./pupblication/PublicationAvatar.svelte";

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

  export let sportstack = {} as AuthorsAuthorsDataJSONSchema;
  export let owner = "";
  export let permalink = "";
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

<a
  class="publication-card {viewportType}"
  id="publication-card"
  href="/u/author/publication/{permalink}/{$userSettings.lang}"
>
  <PublicationAvatar avatar={sportstack.avatar} size={viewportType === "mobile" ? "74px" : "102px"}/>
  <div class="info">
    {#if owner === $userSettings.user?.firebase_user_data.uid}
      <Badge size="sm" color="gray">Owner</Badge>
    {/if}
    <h3>{sportstack.username}</h3>
  </div>
</a>

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
   :global(.dark-mode #publication-card:not(.mobile)) {
    border: 1px solid #3b3b3b;
  }
  .publication-card {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1 0 0;
    width: 100%;
    max-height: max-content;


    &:hover {
      background: var(--colors-background-bg-secondary, #1f1f1f);
      cursor: pointer;
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xs, 4px);
      align-self: stretch;

      h3 {
        margin: 0;
        color: var(--colors-text-text-primary-900, #fbfbfb);
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-lg, 18px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--Line-height-text-md, 24px); /* 133.333% */
      }
    }

    &.tablet,
    &.desktop {
      border-radius: var(--radius-xl, 12px);
      width: 100%;
      border: 1px solid #E6E6E6;
      max-height: 104px;
      height: 100%;

      :global(.img) {
        border-top-left-radius: var(--radius-xl, 12px);
        border-bottom-left-radius: var(--radius-xl, 12px);
      }
      .info {
        flex-direction: column-reverse;
        justify-content: center;

        h3 {
          font-size: var(--Font-size-text-xl, 20px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--Line-height-text-xl, 30px); /* 150% */
        }
      }
    }

    &.desktop {
      .info {
        gap: var(--spacing-md, 8px);
        justify-content: start;
        padding-top: 12px;

        h3 {
          font-size: var(--Font-size-text-md, 16px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--Line-height-text-md, 24px); /* 150% */
        }
      }
    }
  }
</style>
