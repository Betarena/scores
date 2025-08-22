<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
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
  export let company: "Google" | "Metamask" = "Google";
  export let full = false;

  let iconsMap = {
    Google: "/assets/svg/social/google.svg",
    Metamask: "/assets/svg/social/metamask.png",
  };

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

<button class="social-button" class:full on:click>
  {#if iconsMap[company]}
    <img src={iconsMap[company]} alt={company} title="" loading="lazy" />
  {/if}
  <span>
    {`Sign in ${company ? `with ${company}` : ""}`}
  </span>
</button>

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
  .social-button {
    display: inline-flex;
    padding: 10px var(--spacing-xl, 16px);
    justify-content: center;
    align-items: center;
    gap: var(--spacing-lg, 12px);
    border-radius: var(--radius-md, 8px);
    border: 1px solid var(--colors-border-border-primary, #d2d2d2) !important;
    background: var(--colors-background-bg-primary, #fff);

    /* Shadows/shadow-xs-skeuomorphic */
    box-shadow: 0 0 0 1px
        var(
          --colors-effects-shadows-shadow-skeumorphic-inner-border,
          rgba(10, 13, 18, 0.18)
        )
        inset,
      0 -2px 0 0 var(
          --colors-effects-shadows-shadow-skeumorphic-inner,
          rgba(10, 13, 18, 0.05)
        ) inset,
      0 1px 2px 0
        var(--colors-effects-shadows-shadow-xs, rgba(10, 13, 18, 0.05));

    span {
      color: var(--colors-text-text-secondary-700, #525252);

      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-md, 16px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--line-height-text-md, 24px); /* 150% */
    }
    img {
      width: 24px;
      height: 24px;
      aspect-ratio: 1/1;
    }
    &:hover {
      background: var(--colors-background-bg-primary_hover, #fbfbfb);

      span {
        color: var(--colors-text-text-secondary_hover);
      }
    }

    &:focus {
      box-shadow: 0 0 0 1px
          var(
            --colors-effects-shadows-shadow-skeumorphic-inner-border,
            rgba(10, 13, 18, 0.18)
          )
          inset,
        0 -2px 0 0 var(
            --colors-effects-shadows-shadow-skeumorphic-inner,
            rgba(10, 13, 18, 0.05)
          ) inset,
        0 1px 2px 0
          var(--colors-effects-shadows-shadow-xs, rgba(10, 13, 18, 0.05)),
        0 0 0 2px var(--colors-background-bg-primary, #fff),
        0 0 0 4px var(--colors-effects-focus-rings-focus-ring, #f5620f);
    }
    &.full {
        width: 100%;
    }
  }
</style>
