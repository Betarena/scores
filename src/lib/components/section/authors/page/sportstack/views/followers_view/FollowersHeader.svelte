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
  import Tabbar from "$lib/components/ui/Tabbar.svelte";
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

  export let data = { name: "Rodrigo Monteirasso" };

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "author-profile⮕followers⮕header";
  const dispatch = createEventDispatcher();
  const options = [
    { id: "subscribers", label: "Subscribers" },
    { id: "followers", label: "Followers" },
    { id: "followings", label: "Followings" },
  ];

  $: ({ globalState, viewportType } = $session);
  $: isPWA = globalState.has("IsPWA");
  $: ({ name } = data);
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
<div class="wrapper {viewportType}" id={CNAME}>
  <div class="name-block">
    {#if !isPWA}
      <div class="back-button">
        <BackButton
          custom_handler={true}
          on:click={() => dispatch("changeMode")}
        />
      </div>
    {/if}
    <div class="name">{name}</div>
  </div>
  <div class="tabbar-wrapper">
    <Tabbar data={options} style="gap: {viewportType === "mobile" ? 40 : 24}px; font-size: var(--text-size-m)" />
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
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &.mobile {
      border-bottom: var(--header-border);
      padding-inline: 16px;

      .tabbar-wrapper {
        margin: auto;
      }

      .name-block .name {
        justify-content: center;
        padding-left: 0;
      }
    }

    .name-block {
      display: flex;
      justify-content: start;
      align-items: center;
      position: relative;

      .back-button {
        position: absolute;
        left: 0;
        top: 0;
        transform: translateY(-20%);
      }

      .name {
        display: flex;
        color: var(--text-color);
        justify-self: start;
        padding-left: 48px;
        align-items: center;
        flex-grow: 1;
        font-family: Roboto;
        font-size: var(--text-size-l);
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
      }
    }
  }
</style>
