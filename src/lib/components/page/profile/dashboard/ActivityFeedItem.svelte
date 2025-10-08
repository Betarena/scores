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

  import Avatar from "$lib/components/ui/Avatar.svelte";

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

  export let avatar: string;
  export let name = "";
  export let text = "";
  export let connector = true;

  const dotHeight = 3;
  const dotGap = 3;
  let dotsCount = 0;
  let connectorDiv: HTMLDivElement;
  let contentDiv: HTMLDivElement;
  // #endregion ➤ 📌 VARIABLES

  $: if (connectorDiv && contentDiv && connector) {
    const contentHeight = contentDiv.clientHeight;
    const dotsHeight = contentHeight - connectorDiv.clientHeight;
    dotsCount = Math.floor(dotsHeight / (dotHeight + dotGap));
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
<div class="activity-feed-item">
  <div class="activity-avatar-wrapper" bind:this={connectorDiv}>
    <Avatar size="lg" src={null} />
    <div class="timeline-connector-wrapper">
      {#each Array(dotsCount) as _item}
        <div class="timeline-connector" />
      {/each}
    </div>
  </div>
  <div class="body-wrapper" bind:this={contentDiv}>
    <div class="data-wrapper">
      <div class="name">{name}</div>
      <div class="text">
        <slot name="text">{text}</slot>
      </div>
    </div>
    <slot name="footer" />
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
  .activity-feed-item {
    display: flex;
    width: 100%;
    max-width: 360px;
    align-items: stretch;
    gap: var(--spacing-lg, 12px);
    min-height: fit-content;

    .activity-avatar-wrapper {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      height: 100%;
      min-height: 100%;
      gap: var(--spacing-sm, 6px);
      :global(.avatar-wrapper) {
        flex-shrink: 0;
      }
      .timeline-connector-wrapper {
        flex-grow: 1;
        flex-shrink: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 3px;

        .timeline-connector {
          flex-shrink: 0;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background-color: var(--colors-border-border-primary, #d2d2d2);
        }
      }
    }
    .body-wrapper {
      display: flex;
      padding-bottom: var(--spacing-4xl, 32px);
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      flex: 1 0 0;

      .data-wrapper {
        display: flex;
        flex-direction: column;

        .name {
          display: flex;
          align-items: center;
          gap: var(--spacing-md, 8px);
          align-self: stretch;

          color: var(--colors-text-text-secondary-700, #525252);

          /* Text sm/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
        .text {
          color: var(--colors-text-text-tertiary-600, #6a6a6a);

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }
  }
</style>
