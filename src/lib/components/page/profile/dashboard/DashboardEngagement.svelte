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
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import MetricChart from "$lib/components/ui/metrics/MetricChart.svelte";
  import session from "$lib/store/session";

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
  const options = [
    { id: 1, label: "All" },
    { id: 2, label: "Not All" },
  ];

  const engagements = [
    { label: "Subscribers", count: 20.8, change: 12 },
    { label: "Views", count: 26.4, change: -2 },
  ];

  let selectedOption = options[0];
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
<div id="dashboard-engagement" class={viewportType}>
  <div class="title-wrapper">
    <div class="title">Engagement</div>
    <div class="dropdown">
      <DropDownInput checkIcon={true} {options} bind:value={selectedOption} />
    </div>
  </div>
  <div class="metrics-wrappers">
    {#each engagements as { label, count, change }}
      <MetricChart text={label} number={count} animation={true} {change} />
    {/each}
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
  #dashboard-engagement {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex-shrink: 0;
    align-self: stretch;
    .title-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-none, 0);
      flex-shrink: 0;
      align-self: stretch;
      flex-direction: column;
      gap: 12px;
      align-items: start;
      height: fit-content;
      .title {
        color: var(--colors-text-text-secondary-700, #fbfbfb);
        flex: 1 0 0;
        /* Text lg/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-lg, 18px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-lg, 28px); /* 155.556% */
      }

      .dropdown {
        flex: 1 0 0;
        width: 100%;
      }
    }

    .metrics-wrappers {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 20px;
      min-width: 0;
      align-self: stretch;
    }
    &:not(.mobile) {
       min-width: 0;
      :global(.metric-chart-1) {
        flex: 1 1 0;
        min-width: 0;
      }
    }
  }
</style>
