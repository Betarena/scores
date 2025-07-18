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

  import LoaderBadge from '$lib/components/ui/loaders/LoaderBadge.svelte';
  import LoaderImage from '$lib/components/ui/loaders/LoaderImage.svelte';
  import LoaderLine from '$lib/components/ui/loaders/LoaderLine.svelte';
  import LoaderSporttackAvatar from '$lib/components/ui/loaders/LoaderSporttackAvatar.svelte';
  import { fade } from 'svelte/transition';

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
     * @description tablet view
     */
    tablet = false,
    /**
     * @description mobile view
     */
    mobile = false
  ;

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
{#key mobile || tablet}

<div class="card-wrapper" class:mobile class:tablet in:fade={{ duration: 250 }}>
  <div class="card-content">
    <div class="author-wrapper">
      <LoaderSporttackAvatar size={mobile ? 24 : 32} />
      <div class="author-info">
        <LoaderLine width={110} />
        <LoaderLine width={90} />
      </div>
    </div>
    <div class="title">
      {#each ['90%', '85%'] as item}
        <LoaderLine width={item} />
        {/each}
        {#if mobile || tablet}
        <LoaderLine width="70%" />
      {/if}
    </div>
    <div class="tags-wrapper">
      <LoaderBadge height={!mobile && !tablet ? 26: 24 }/>
      <LoaderBadge height={!mobile && !tablet ? 26: 24 }/>
      <LoaderBadge height={!mobile && !tablet ? 26: 24 }/>
    </div>
  </div>
  <div class="preview" class:tablet class:mobile>
    <LoaderImage width={'100%'} height={'100%'} />
  </div>
</div>

{/key}

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
  .card-wrapper {
    display: flex;
    width: 100%;
    max-width: 824px;
    gap: 56px;
    border-radius: 12px;
    padding: 24px;
    box-sizing: border-box;
    justify-content: space-between;
    background: var(--colors-background-bg-secondary);
    align-items: start;

    a {
      color: var(--text-color);
      transition: all;
      transition-duration: 0.5s;

      &:hover {
        color: var(--primary);
      }
    }

    .preview {
      border-radius: 8px;
      flex-shrink: 0;
      width: 240px;
      height: 154px;

      img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-grow: 1;
      width: 455px;
      max-width: 100%;

      overflow: hidden;

      .tags-wrapper {
        max-width: 100%;
        --text-button-size: var(--text-size-s);
        --gradient-color-rgb: var(--bg-color-second-rgb-consts);
        margin-top: 4px;

        &.expanded {
          flex-wrap: wrap;
        }
      }

      .title {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        height: max-content;
        font-family: Inter;
        font-size: var(--text-size-l);
        font-style: normal;
        font-weight: 600;
        line-height: 28px;
      }

      .author {
        &-wrapper {
          display: flex;
          gap: 12px;
          align-items: start;
        }

        &-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--text-color-second, #ccc);

          .publication-date {
            color: var(--text-color-second-dark, #8c8c8c);
            font-family: Roboto;
            font-size: var(--text-size-xs);
            font-style: normal;
            font-weight: 400;
            line-height: 12px;
          }
        }

        &-name {
          color: var(--text-color);
          font-family: Inter;
          font-size: var(--text-size-s);
          font-style: normal;
          font-weight: 500;
          line-height: 20px;
        }
      }
    }

    &.tablet {
      max-width: 100%;
      width: 100%;
    }

    &.mobile {
      flex-direction: row-reverse;
      background: var(--colors-background-bg-primary);
      gap: 16px;
      border-radius: 0;
      padding: 20px 16px;
      padding-right: 0px;

      .card-content {
        padding: 0;
        gap: 12px;

        .title {
          line-height: 24px;
          padding-right: 16px;
        }
        .author-wrapper {
          padding-right: 16px;
        }

        .author-name {
          line-height: 18px;
        }

        .tags-wrapper {
          margin-top: 0;
        }
      }

      .preview {
        width: 112px;
        height: 150px;
      }
    }
  }
</style>
