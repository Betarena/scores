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

  import Trash_01 from "$lib/components/ui/assets/trash-01.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import FeaturedIcon from "$lib/components/ui/FeaturedIcon.svelte";
  import type { TranslationSportstacksSectionDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import ModalWrapper from "./ModalWrapper.svelte";

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

 export let id = "";
 export let deleteSportsTack = false;
 export let cb;
 export let translations:
 | TranslationSportstacksSectionDataJSONSchema
 | undefined;

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



<ModalWrapper title={translations?.delete || "Delete"} actionButton={translations?.delete || "Delete"} cancel= {translations?.cancel || "Cancel"}>
  <div slot="header-icon">
    <FeaturedIcon size="lg" color="error"><Trash_01 /></FeaturedIcon>
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
