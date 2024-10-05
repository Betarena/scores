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

  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/u/author/create/[lang=lang]/$types.js";
  import session from "$lib/store/session.js";
  import WidgetMenuOpt from "../Widget-MenuOpt.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
  import PublicationHome from "./PublicationHome.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import PublicationArticles from "./PublicationArticles.svelte";
  import PublicationSettings from "./PublicationSettings.svelte";

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

  export let data: PageData;

  $: ({ translate } = data);
  $: ({ viewportType } = $session);
  // #endregion ➤ 📌 VARIABLES

  const tabs = [
    { id: 1, label: "Home", view: "home" },
    { id: 2, label: "Articles", view: "articles" },
    { id: 3, label: "Settings", view: "settings" },
  ];
  const options = [
    { id: 1, label: "SprortsTack1" },
    { id: 2, label: "SprortsTack2" },
    { id: 3, label: "SprortsTack3" },
  ];

  const viewMap = {
    home: PublicationHome,
    articles: PublicationArticles,
    settings: PublicationSettings,
  };

  function change(e) {
    const url = $page.url;
    url.searchParams.set("view", e.detail.view);
    goto(url, { replaceState: true, noScroll: true });
    view = e.detail.view;
  }
  $: view = $page.url.searchParams.get("view") || "home";
  $: selected = tabs.find((tab) => tab.view === view) || tabs[0];
  $: console.log("selected", selected);
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
  <div class="publication-widget-wrapper {viewportType}">
    {#if viewportType === "desktop"}
      <div class="menu">
        <WidgetMenuOpt />
      </div>
    {/if}
    <div id="publication-home" class={viewportType}>
      <div class="header-wrapper">
        <div class="header">
          <h2>{translate?.[view] || selected.label}</h2>
          {#if viewportType === "mobile"}
            <DropDownInput {options} />
          {/if}
          <Tabbar
            on:select={change}
            type={viewportType === "mobile" ? "button_border" : "underline"}
            data={tabs}
            bind:selected
          />
        </div>
      </div>
      <svelte:component this={viewMap[view]} />
    </div>
  </div>
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
  .publication-widget-wrapper {
    margin-top: 24px;

    #publication-home {
      display: flex;
      padding: var(--spacing-none, 0px);
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-3xl, 24px);
      flex: 1 0 0;
      align-self: stretch;
      min-height: calc(100vh - 56px - 22px - 5px);
      padding-bottom: 22px;

      .header-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xl, 16px);

        .header {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-xl, 16px);
          align-self: stretch;
          h2 {
            color: var(--colors-text-text-primary-900, #fbfbfb);
            margin: 0;

            /* Display xs/Semibold */
            font-family: var(--font-family-font-family-display, Roboto);
            font-size: var(--font-size-display-xs, 24px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-xs, 32px); /* 133.333% */
          }
        }

        .buttons-header {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-lg, 12px);
          align-self: stretch;
          :global(.button) {
            flex-grow: 1;
            flex-shrink: 0;
            flex-basis: 0;
            width: 100%;
          }
        }
      }
    }

    &.desktop {
      margin-top: 0;
      display: flex;
      align-items: start;
      gap: var(--spacing-2xl, 20px);
      padding-top: var(--spacing-5xl, 40px);
      padding-bottom: 72px;
      min-height: calc(100vh - 128px);

      .menu {
        flex-shrink: 0;
        min-width: 328px;
      }

      #publication-home {
        padding: var(--spacing-2xl, 20px);
        min-height: unset;
        gap: var(--spacing-2xl, 20px);

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
              font-size: var(--font-size-display-xs, 24px);
              font-style: normal;
              font-weight: 600;
              line-height: var(--line-height-display-xs, 32px);
            }

            :global(.tabbar) {
              border-bottom: 1px solid var(--colors-border-border-secondary, #3B3B3B);
            }
          }
        }
      }
    }
    &.tablet {
      margin-top: 0;
      display: flex;
      align-items: start;
      gap: var(--spacing-2xl, 20px);
      padding-top: var(--spacing-5xl, 40px);
      padding-bottom: 72px;
      min-height: calc(100vh - 128px);

      #publication-home {
        min-height: unset;
        gap: var(--spacing-2xl, 20px);

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
            gap: var(--spacing-2xl, 20px);
            :global(.tabbar) {
              border-bottom: 1px solid var(--colors-border-border-secondary, #3B3B3B);
            }
          }
        }
      }
    }
  }
</style>
