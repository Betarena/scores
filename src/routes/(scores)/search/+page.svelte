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

import Search from "$lib/components/section/search/Search.svelte";

// #endregion ➤ 📦 Package Imports

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

<Search />