<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
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

  import TranslationText from '../misc/Translation-Text.svelte';

  import type { TranslationsTransactionsDataStatus } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';
  import type { ITransactionStatus } from '@betarena/scores-lib/types/_ENUMS_.js';

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
     *  📣 Target `status` for _this_ transaction.
    */
    txStatus: ITransactionStatus | undefined
    /**
     * @description
     *  📣 Target incoming translation term(s).
    */
    , trsStatusTerms: TranslationsTransactionsDataStatus | undefined
  ;

  // [🐞]
  console.log('trsStatusTerms', trsStatusTerms)

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<p
  class=
  "
  tx-status-pill
  "
  class:completed={txStatus == 'completed'}
  class:pending={txStatus == 'pending'}
  class:failed={['failed', 'canceled', 'refunded'].includes((txStatus ?? ''))}
>
  {#if txStatus == 'completed'}
    <TranslationText key={'shared/tx-pill'} text={trsStatusTerms?.complete} />
  {:else if txStatus == 'pending'}
    <TranslationText key={'shared/tx-pill'} text={trsStatusTerms?.pending} />
  {:else if ['failed', 'canceled', 'refunded'].includes((txStatus ?? ''))}
    <TranslationText key={'shared/tx-pill'} text={trsStatusTerms?.failed} />
  {/if}
</p>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  p.tx-status-pill
  {
    /* 🛝 layout */
    width: fit-content;
    /* 🎨 style */
    padding: 4px 12px;
    border-radius: 32px;

    &.completed
    {
      /* 🎨 style */
      color: var(--status-green, #59C65D) !important;
      background: rgba(89, 198, 93, 0.10);
    }
    &.pending
    {
      /* 🎨 style */
      color: var(--status-yellow, #FFB904) !important;
      background: rgba(255, 185, 4, 0.10);
    }
    &.failed
    {
      /* 🎨 style */
      color: var(--status-red-night, #FF5959) !important;
      background: rgba(255, 89, 89, 0.10);
    }
  }

</style>
