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

  import { post } from "$lib/api/utils.js";
  import ToggleButton from "$lib/components/ui/ToggleButton.svelte";
  import userSettings from "$lib/store/user-settings.js";
  import type { INotificationsConfigSection } from "$lib/types/types.notifications.js";

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

  export let section: INotificationsConfigSection;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "notifications⮕config⮕block";

  $: ({ title, options, type } = section);

  async function toggle(
    e: CustomEvent<boolean>,
    o: INotificationsConfigSection["options"][0]
  ) {
    const { detail } = e;
    const uid = userSettings.extract("uid");
    if (!uid) return;
    await post("/api/notifications/config", {
      uid,
      type: "notification",
      data: {
        notificationId: o.id,
        notificationType: type,
        notificationState: detail,
      },
    });
    userSettings.updateData([
      ["user-notifications-settings", { [type]: section }],
    ]);
  }
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

<div class="notifications-config-block" id={CNAME}>
  <div class="title">{title}</div>
  <div class="options-wrapper">
    {#each options as o}
      <div class="option">
        <div class="label">{o.label}</div>
        <ToggleButton bind:active={o.checked} on:toggle={(e) => toggle(e, o)} />
      </div>
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
  :global(#notifications⮕config⮕block:last-of-type) {
    border-bottom: none;
  }
  .notifications-config-block {
    display: flex;
    padding-block: var(--spacing-xl);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-lg);
    align-self: stretch;
    border-bottom: 1px solid var(--Border-border-tertiary);

    .title {
      color: var(--colors-text-text-primary-900);
      /* Text md/Medium */
      font-family: var(--Font-family-font-family-body, Roboto);
      font-size: var(--Font-size-text-md);
      font-style: normal;
      font-weight: 500;
      line-height: var(--Line-height-text-md);
    }
    .options-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xl);
      align-self: stretch;

      .option {
        display: flex;
        align-items: start;
        width: 100%;
        gap: var(--spacing-xl, 16px);
        align-self: stretch;

        .label {
          font-size: var(--Font-size-text-sm);
          color: var(--colors-text-text-secondary-700);
          flex-grow: 1;
        }
      }
    }
  }
</style>
