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
│ |: Scores Footer Component (v2)
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

  import { routeIdContent } from '$lib/constants/paths.js';
  import sessionStore from '$lib/store/session.js';
  import { storeFooter } from './../_store.js';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import FooterBottom from './View.Bottom.svelte';
  import FooterSide from './View.Side.svelte';

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

  const
    /**
     * @description
     * 📝 List of paths for '<FooterSide />' toggle.
     */
    listStrFooterPaths
      = [
        routeIdContent
      ]
  ;

  $: ( { viewportType } = $sessionStore );

  $: objWidgetDataTranslation = $page.data.B_FOT_T as B_FOT_T;

  $: mapLinks = new Map(
    [
      [
        'changelog',
        {
          id: 'changelog',
          label: objWidgetDataTranslation.terms.changelog,
          href: objWidgetDataTranslation.links.changelog,
        },
      ],
      [
        'status',
        {
          id: 'status',
          label: objWidgetDataTranslation.terms.status,
          href: objWidgetDataTranslation.links.status,
        },
      ],
      [
        'about',
        {
          id: 'about',
          label: objWidgetDataTranslation.terms.about_us,
          href: objWidgetDataTranslation.links.about_us,
        },
      ],
      [
        'terms',
        {
          id: 'terms',
          label: objWidgetDataTranslation.terms.terms,
          href: objWidgetDataTranslation.links.terms,
        },
      ],
      [
        'roadmap',
        {
          id: 'roadmap',
          label: objWidgetDataTranslation.terms.latest_news,
          href: objWidgetDataTranslation.links.latest_news,
        },
      ],
      [
        'privacy',
        {
          id: 'privacy',
          label: objWidgetDataTranslation.terms.privacy,
          href: objWidgetDataTranslation.links.privacy,
        },
      ],
      [
        'gambleaware',
        {
          id: 'gambleaware',
          // @ts-expect-error :: Has not been defined in the B_FOT_T type.
          label: objWidgetDataTranslation.terms.gambleaware,
          // @ts-expect-error :: Has not been defined in the B_FOT_T type.
          href: objWidgetDataTranslation.links.gambleaware,
        }
      ]
    ])
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  $: storeFooter.updateData([['mapLinks', mapLinks]]);

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

<!--
╭─────
│ > Footer SEO
╰─────
-->
<SeoBox>
  <!--
  ╭─────
  │ > Social Links [1]
  ╰─────
  -->
  <p>{objWidgetDataTranslation.links.latest_news}</p>
  <p>{objWidgetDataTranslation.links.about_us}</p>
  <p>{objWidgetDataTranslation.links.betting_tips}</p>
  <p>{objWidgetDataTranslation.links.privacy}</p>
  <p>{objWidgetDataTranslation.links.social_networks}</p>
  <p>{objWidgetDataTranslation.links.terms}</p>
  <p>{objWidgetDataTranslation.links.status}</p>
  <p>{objWidgetDataTranslation.links.changelog}</p>
  <!--
  ╭─────
  │ > Social Links [2]
  ╰─────
  -->
  {#each Object.keys(objWidgetDataTranslation.links.social_networks) ?? [] as key}
    <p>{objWidgetDataTranslation.links.social_networks[key]}</p>
  {/each}
</SeoBox>

<!--
╭─────
│ > Footer Container
╰─────
-->
{#if
  viewportType === 'desktop'
  && listStrFooterPaths.includes($page.route.id ?? '')
}
  <FooterSide />
{:else}
  <FooterBottom />
{/if}
