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
<div class="widget-icon-wrapper">
  <slot><!-- optional fallback --></slot>
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
  .widget-icon-wrapper {
    display: flex;
    width: 40px;
    height: 40px;
    padding: 4px 0;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;

    border-radius: var(--radius-md, 8px);
    border: 1px solid var(--colors-border-border-primary, #525252);
    background: var(--colors-background-bg-primary, #1f1f1f);

    /* Shadows/shadow-xs-skeuomorphic */
    box-shadow: 0 0 0 1px
        var(
          --colors-effects-shadows-shadow-skeumorphic-inner-border,
          rgba(12, 14, 18, 0.18)
        )
        inset,
      0 -2px 0 0 var(
          --colors-effects-shadows-shadow-skeumorphic-inner,
          rgba(12, 14, 18, 0.05)
        ) inset,
      0 1px 2px 0
        var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
  
    color: var(--colors-foreground-fg-brand-secondary-500);
  }
</style>
