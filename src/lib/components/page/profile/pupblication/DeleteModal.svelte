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
  import type { TranslationSportstacksSectionDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import ModalWrapper from "./ModalWrapper.svelte";
  export let id = "";
  export let deleteSportsTack = false;
  export let cb;
  export let translations:
    | TranslationSportstacksSectionDataJSONSchema
    | undefined;
</script>

<ModalWrapper title={translations?.delete || "Delete"} actionButton={translations?.delete || "Delete"} cancel= {translations?.cancel || "Cancel"}>
  <div slot="header-icon">
    <FeaturedIcon size="lg" type="error"><Trash_01 /></FeaturedIcon>
  </div>
  <div slot="text">
     {translations?.delete_confirmation || "Are you sure you want to delete ?"}.
     {translations?.action_undone || "This action cannot be undone."}
  </div>
  <div slot="action-button" class=" action-button">
    <Button destructive={true} full={true} on:click={cb}>{translations?.delete}</Button>
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
    width: 100%;
  }
</style>
