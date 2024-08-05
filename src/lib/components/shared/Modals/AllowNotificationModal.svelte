<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { scale } from "svelte/transition";
  import {backOut, expoOut} from "svelte/easing"
  import Button from "$lib/components/ui/Button.svelte";
  import ToggleButton from "$lib/components/ui/ToggleButton.svelte";


  let active = false;
  let transitionEnded = false;
  $: showBell = active && transitionEnded

  function startBell() {
    active = true
    transitionEnded = true
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


<div class="modal-body" on:introend={startBell} in:scale={{easing: expoOut, duration: 1000 }} out:scale={{easing: expoOut, duration: 1000}}>
  <div class="img">
    {#if showBell}
       <div class="bell" in:scale={{easing: backOut, duration: 500 }} out:scale={{easing: backOut, duration: 1000}}></div>
       {/if}
  </div>
  <h2>Stay Updated with Betarena</h2>
  <div class="text">Enable push notifications for the latest sports updates from Betarena</div>
  <ToggleButton bind:active>Turn on</ToggleButton>
  <Button style="width: 100%" type="primary">Confirm</Button>

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

.modal-body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--bg-color);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px;

  .img {
    background-color: red;
    width: 150px;
    height: 250px;
    position: relative;

    .bell {
      background-color: blue;
      width: 50px;
      height: 50px;
      position: absolute;
      top: 50%;
      right: 0%;
      transform: translate(50%, -50%);
    }
  }
  .toggle-button{
    background-color: blue;
    width: 50px;
    height: 50px;
  }
}

</style>