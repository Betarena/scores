<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { fade, scale, fly } from "svelte/transition";
  import { backOut, expoOut } from "svelte/easing";
  import Button from "$lib/components/ui/Button.svelte";
  import ToggleButton from "$lib/components/ui/ToggleButton.svelte";
  import PhoneIcon from "../assets/PhoneIcon.svelte";
  import BellIcon from "../assets/BellIcon.svelte";
  import SoundWave from "../assets/SoundWave.svelte";
  import CrossIcon from "../assets/CrossIcon.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import session from "$lib/store/session.js";

  let active = false;

  $: ({ viewportType } = $session);

  function startBell() {
    active = true;
  }

  function transition(node) {
    if (viewportType === "mobile") {
      return fly(node, { duration: 700, y: 450 });
    }

    return scale(node, { easing: expoOut, duration: 1000 });
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

<div
  class="modal-body block {viewportType}"
  on:introend={startBell}
  in:transition
  out:transition
>
  <div class="header">
    <button on:click={() => ($modalStore.show = false)}>
      <CrossIcon />
    </button>
  </div>
  <div class="block body">
    <div class="block info">
      <div class="img">
        <div class="svg-wrap">
          <PhoneIcon />
        </div>
        {#if active}
          <div
            class="svg-wrap"
            in:scale={{ easing: backOut, duration: 500 }}
            out:scale={{ easing: backOut, duration: 500 }}
          >
            <BellIcon />
          </div>
          <div
            class="svg-wrap"
            in:fade={{ duration: 500, delay: 300 }}
            out:fade={{ duration: 200 }}
          >
            <SoundWave />
          </div>
        {/if}
      </div>
      <div class="block text">
        <h2>Stay Updated with Betarena</h2>
        <div class="desc">
          Enable push notifications for the latest sports updates from Betarena
        </div>
      </div>
    </div>

    <ToggleButton bind:active>Turn on</ToggleButton>
    <Button style="width: 100%" type="primary">Confirm</Button>
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
  .block {
    justify-content: center;
    flex-direction: column;
    align-items: center;
    display: flex;

    &.body {
      gap: var(--spacing-5xl);
    }

    &.info {
      gap: var(--spacing-xl);
    }

    &.text {
      gap: var(--spacing-md);
    }
  }
  .modal-body {
    display: flex;
    background-color: var(--modal-bg);
    max-width: 375px;
    width: 100%;
    padding: var(--spacing-xl, 16px) var(--spacing-4xl, 32px)
      var(--spacing-4xl, 32px) var(--spacing-4xl, 32px);

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    border-radius: var(--radius-xl);

    .header {
      display: flex;
      justify-content: end;
      width: 100%;

      button {
        background-color: inherit;
      }
    }

    .img {
      position: relative;
      height: 100px;
      display: flex;
      width: 85px;
      justify-content: center;
      margin: auto;
      .svg-wrap {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .text {
      width: 100%;

      h2 {
        margin: 0;
        color: var(--text-color);
      }

      .desc {
        color: var(--text-color-second-dark);
      }
    }

    &.mobile {
      top: unset;
      max-width: 100%;
      bottom: 0;
      transform: unset;
      left: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
</style>
