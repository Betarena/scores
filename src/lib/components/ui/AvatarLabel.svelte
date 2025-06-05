<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Avatar from "./Avatar.svelte";

  export let size: "xs" | "md" | "lg" | "xl" | "sm" = "md";
  export let avatar = "";
  export let name = "";
  export let label = "";
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
<div class="wrapper {size}">
  <Avatar src={avatar} {size} />
  <div class="info">
    <div class="name">{name}</div>
    <div class="label">
      <slot name="label">{label}</slot>
    </div>
  </div>
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
  .wrapper {
    display: inline-flex;
    align-items: center;
    gap: 10px;

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .name {
        color: var(--colors-text-text-primary, #000);
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
        line-height: 14px; /* 140% */
      }
      .label {
        color: var(--colors-text-text-tertiary-600, #6a6a6a);
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: 10px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px; /* 140% */
      }
    }

    &.sm {
      .name {
        font-size: var(--font-size-text-sm, 14px);
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      .label {
        font-size: var(--font-size-text-xs, 12px);
        line-height: var(--line-height-text-xs, 18px); /* 150% */
      }
    }
    &.md {
      gap: var(--spacing-lg, 12px);

      .name {
        font-size: var(--font-size-text-sm, 14px);
        line-height: var(--line-height-text-sm, 20px);
      }
      .label {
        font-size: var(--font-size-text-sm, 14px);
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
    }
    &.lg {
      gap: var(--spacing-lg, 12px);
      .name {
        font-size: var(--font-size-text-md, 16px);
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
      .label {
        font-size: var(--font-size-text-md, 16px);
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
    &.xl {
      gap: var(--spacing-xl, 16px);
      .name {
        font-size: var(--font-size-text-lg, 18px);
        line-height: var(--line-height-text-lg, 28px); /* 155.556% */
      }
      .label {
        font-size: var(--font-size-text-md, 16px);
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
  }
</style>
