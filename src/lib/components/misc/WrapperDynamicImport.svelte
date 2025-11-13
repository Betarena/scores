<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
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

  import { onMount } from 'svelte';

  import { log_v3 } from '$lib/utils/debug.js';

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

  export let
    /**
     * @description
     *  📝 path component to be dynamically imported.
     */
    importComponentPath:
      | 'Splash-Screen'
      | 'Banner-Offline-Alert'
      | 'Banner-Platform-Alert'
      | 'Modal-Email-Subscribe'
  ;

  let _DynamicComponent;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    async (
    ) =>
    {
      // [🐞]
      log_v3
      (
        {
          strGroupName: 'WrapperDynamicImport ⮕ onMount',
          msgs:
          [
            `importComponentPath: ${importComponentPath}`
          ]
        }
      );

      if (importComponentPath == 'Splash-Screen')
        _DynamicComponent
          = (
            await import
            (
              '$lib/components/misc/Splash-Screen.svelte'
            )
          ).default
        ;
      else if (importComponentPath == 'Banner-Offline-Alert')
        _DynamicComponent
          = (
            await import
            (
              '$lib/components/misc/banner/Banner-Offline-Alert.svelte'
            )
          ).default
        ;
      else if (importComponentPath == 'Banner-Platform-Alert')
        _DynamicComponent
          = (
            await import
            (
              '$lib/components/misc/banner/Banner-Platform-Alert.svelte'
            )
          ).default
        ;
      else if (importComponentPath == 'Modal-Email-Subscribe')
        _DynamicComponent
          = (
            await import
            (
              '$lib/components/misc/modal/Modal-Email-Subscribe.svelte'
            )
          ).default
        ;
      ;

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<svelte:component
  this={_DynamicComponent}
>
  <slot/>
</svelte:component>
