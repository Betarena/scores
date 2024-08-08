<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { goto } from "$app/navigation";
  import CrossIcon from "$lib/components/ui/assets/crossicon.svelte";
  import Dotsicon from "$lib/components/ui/assets/dotsicon.svelte";
  import Settings_01 from "$lib/components/ui/assets/settings-01.svelte";
  import Settings_02 from "$lib/components/ui/assets/settings-02.svelte";
  import Icon from "$lib/components/ui/Icon.svelte";
  import Dropdown from "$lib/components/ui/wrappers/Dropdown.svelte";
  import session from "$lib/store/session.js";
  import { createEventDispatcher } from "svelte";

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

  export let config = false;
  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "notifications⮕header";

  const dispatch = createEventDispatcher();
  function back() {
    if (window?.history.length > 1) {
      history.back();
    } else {
      goto("/");
    }
  }

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

<div class="notifications-header {viewportType}" id={CNAME}>
  <Icon size="sm">
    <button class="button" on:click={back}><CrossIcon /></button>
  </Icon>
  <div class="title">Notifications {config ? "Settings" : ""}</div>
  {#if !config}
    <Dropdown>
      <Icon size="sm" slot="trigger">
        <button class="button" ><Dotsicon /></button>
      </Icon>
      <div slot="content">
        <button class="action-button" on:click={() => dispatch("readAll")}>
          <i class="icon"><Settings_01 /></i>
          Mark all as read
        </button>
        <a href="/notifications/settings" class="action-button">
          <i class="icon"><Settings_02 /></i>
          Notification settings
        </a>
      </div>
    </Dropdown>
  {:else}
    <div />
  {/if}
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
  .notifications-header {
    width: 100%;
    z-index: 1;
    display: flex;
    padding: var(--spacing-lg, 12px) 0;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    .button {
      &:hover {
        background-color: unset;
      }
    }

    .title {
      color: var(--Text-text-primary);
      text-align: center;
      font-family: var(--Font-family-font-family-display);
      font-size: var(--Font-size-display-xs);
      font-style: normal;
      font-weight: 500;
      line-height: var(--Line-height-display-xs);
    }

    button {
      background-color: inherit;
      padding: 0;
    }

    &.mobile {
      padding-inline: 16px;
    }

    .action-button {
      display: flex;
      padding: 9px var(--spacing-lg);
      align-items: center;
      gap: var(--spacing-sm);
      color: unset;
      width: 100%;
      white-space: nowrap;
      justify-content: start;

      .icon {
        transform: translateY(1px);
      }

      &:hover {
        background-color: var(--Background-bg-secondary_hover);
        color: var(--Text-text-primary);
        --icon-color: var(--Text-text-primary);
      }
    }
  }
</style>
