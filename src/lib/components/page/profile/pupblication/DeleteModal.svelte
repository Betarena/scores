<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Trash_01 from "$lib/components/ui/assets/trash-01.svelte";
  import Button from "$lib/components/ui/Button.svelte";
    import FeaturedIcon from "$lib/components/ui/FeaturedIcon.svelte";
  import session from "$lib/store/session.js";
  import ModalWrapper from "./ModalWrapper.svelte";
  export let id = "";

  $: ({ viewportType } = $session);
</script>

<ModalWrapper title="Delete" actionButton="Delete" cancel="Cancel">
  <div slot="header-icon">
    <FeaturedIcon size="lg" type="error"><Trash_01 /></FeaturedIcon>
  </div>
  <div slot="text">
    Are you sure you want to delete this article? <br /> This action cannot be undone.
  </div>
  <div slot="action-button" class=" action-button {viewportType}">
    <Button destructive={true} full={viewportType === "mobile"}>Delete</Button>
  </div>
</ModalWrapper>

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
  .action-button {
    &.mobile {
      width: 100%;
    }
  }
</style>
