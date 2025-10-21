<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { toDecimalFix } from '$lib/utils/string.js';
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

  import { toDecimalFix } from "$lib/utils/string";
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";

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
  export let number: number = 0;
  export let fixNumber = 0;
  export let needsToFormat: boolean = true;
  const tweenedNumber = tweened(0, {
    duration: 800,
    easing: cubicOut,
  });

  // element binding for intersection observer
  let container: HTMLElement | null = null;
  let inView = false;
  // store latest value while out of view
  let pendingValue: number = 0;

  // when component mounts, observe visibility
  let io: IntersectionObserver | null = null;
  onMount(() => {
    io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) {
          inView = true;
          // animate to the latest known value when entering view
          tweenedNumber.set(pendingValue);
        } else {
          inView = false;
        }
      },
      { threshold: 0.15 }
    );

    if (container) io.observe(container);
    return () => {
      container && io?.unobserve(container);
      io = null;
    };
  });

  // react to external value changes: if in view animate immediately, otherwise store
  $: if (number !== undefined) {
    pendingValue = number;
    if (inView) tweenedNumber.set(number);
  }

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS
  
  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯
  
  function format(num) {
    if (!needsToFormat) return num.toFixed(fixNumber);
    return toDecimalFix(num, 2, true, true, true)
  }
  
  // #endregion ➤ 🛠️ METHODS
  
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<span bind:this={container}>{format($tweenedNumber)}</span>

