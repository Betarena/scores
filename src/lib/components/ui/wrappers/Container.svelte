<script>
  import session from "$lib/store/session";
  export let clazz = "";
  export let hFull = true;
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


<div {...$$restProps} class="container-wrapper {$session.viewportType}  {clazz}" class:hFull >
  <slot/>
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

.container-wrapper {
  width: 100%;
  padding-inline: 16px;


  &.tablet {
    padding-inline: 34px;
  }

  &.desktop {
    max-width: 1430px;
    margin-inline: auto;
    padding-inline: 34px;
  }

  &.hFull {
    height: 100%;
  }
}

</style>
