<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Overview                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Code Format   // V.8.0                                                         │
│ ➤ Status        // 🔒 LOCKED                                                     │
│ ➤ Author(s)     // @izobov                                                       │
│ ➤ Maintainer(s) // @izobov @migbash                                              │
│ ➤ Created on    // <date-created>                                                │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ BETARENA (Module)                                                                │
│ |: Scores Footer Sub-Component (v2)
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

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

  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import Discord from './assets/icon_redisign/discord.svelte';
  import Github from './assets/icon_redisign/github.svelte';
  import Linkedin from './assets/icon_redisign/linkedin.svelte';
  import Medium from './assets/icon_redisign/medium.svelte';
  import Telegram from './assets/icon_redisign/telegram.svelte';
  import X from './assets/icon_redisign/x.svelte';

  import type { B_H_SFOOTD_Social_Network } from '@betarena/scores-lib/types/_HASURA_.js';
  import type { B_FOT_T } from '@betarena/scores-lib/types/types.main.footer.js';

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

  /**
   * @description
   *  📣 Component `Type`.
   */
  type IDynamicAssetMap =
    | 'begambleawareorg'
    | 'logoFull'
    | 'legal18icon'
    | 'discord'
    | 'linkedin'
    | 'medium'
    | 'telegram'
    | 'x'
    | 'github'
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = 'global⮕footer⮕w⮕main-socials',
    /**
     * @description
     *  📣 Dynamic import variable condition
     */
    isDynamicImport = true,
    /**
     * @description
     *  📣 Target social media order.
     */
    socialNetworkOrder: B_H_SFOOTD_Social_Network[]
      = [
        'x',
        'telegram',
        'discord',
        'medium',
        'linkedin',
        'github',
      ]
  ;

  let
    /**
     * @description
     *  📣 Holds target `component(s)` of dynamic nature.
     */
    dynamicAssetMap = new Map < IDynamicAssetMap, any > ()
  ;

  $: objWidgetDataTranslation = $page.data.B_FOT_T as B_FOT_T;

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

  onMount
  (
    async () =>
    {
      if (isDynamicImport)
      {
        dynamicAssetMap.set('discord', Discord);
        dynamicAssetMap.set('linkedin', Linkedin);
        dynamicAssetMap.set('medium', Medium);
        dynamicAssetMap.set('telegram', Telegram);
        dynamicAssetMap.set('x', X);
        dynamicAssetMap.set('github', Github);

        dynamicAssetMap = dynamicAssetMap;
      }

      return;
    }
  );

  // #endregion ➤ 🛠️ METHODS

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

<div
  class="follow-block"
>
  <span
    class="follow-text"
  >
    <TranslationText
      key={`${CNAME}/unknown`}
      text={objWidgetDataTranslation.terms.follow}
      fallback={'Follow us'}
    />
  </span>

  <div
    class="socials-wrapper"
  >
    {#each socialNetworkOrder as key}
      <a
        class="social-icon"
        rel="external"
        target="_blank"
        aria-label="{key}"
        href={objWidgetDataTranslation.links.social_networks[key]}
      >
        <svelte:component this={dynamicAssetMap.get(key)} />
      </a>
    {/each}
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

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  .follow-block
  {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .follow-text
    {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      color: var(--text-color-second-dark);
    }

    .socials-wrapper
    {
      display: flex;
      gap: 8px;

      .social-icon
      {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        border: var(--border);
        transition: all 0.3s ease-in-out;

        &:hover {
          border: 1px solid var(--primary);
          --icon-color: var(--text-color);
        }
      }
    }
  }

</style>
