<script>
  import { modalStore } from "$lib/store/modal";
  import ModalBackdrop from "./Modal-Backdrop.svelte";
</script>

{#if $modalStore.show && $modalStore.component}
  {#if $modalStore.modal}
    <ModalBackdrop on:closeModal={() => ($modalStore.show = false)} />
  {/if}
  <div class="modal-content">
    <svelte:component this={$modalStore.component} />
  </div>
{/if}

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
  .modal-content {
    z-index: 4000;
  }
</style>
