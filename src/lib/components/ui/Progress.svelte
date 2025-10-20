<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";

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

  export let value = 10; // value between 0 and 100
  export let animation = true;

  const progress = tweened(0, {
    duration: animation ? 800 : 0,
    easing: cubicOut,
  });

  // element binding for intersection observer
  let container: HTMLElement | null = null;
  let inView = false;
  // store latest value while out of view
  let pendingValue = value;

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
          progress.set(pendingValue);
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
  $: if (value !== undefined) {
    pendingValue = value;
    if (inView) progress.set(value);
  }
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

<div class="progress-bar" bind:this={container}>
  <div class="progress" style="width: {$progress}%" />
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
  .progress-bar {
    border-radius: var(--radius-full, 9999px);
    background: var(--colors-background-bg-quaternary, #ededed);
    height: 8px;
    width: 100%;
    position: relative;

    .progress {
      border-radius: var(--radius-full, 9999px);
      background: var(--colors-foreground-fg-brand-primary-600, #f5620f);
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
    }
  }
</style>
