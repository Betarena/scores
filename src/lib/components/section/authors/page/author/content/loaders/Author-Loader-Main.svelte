<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
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

	import userBetarenaSettings from '$lib/store/user-settings.js';

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
     *  📣 Target `option` assets to display
    */
    option: IWidgetState
    /**
     * @description
     *  📣 Target `option` supplementary `CSS` width.
    */
    , width: number = 0
    /**
     *
    */
    , clazz: string = ''
  ;

  /**
   * @description
   *  📣 Target `widget` state asset to show.
  */
  type IWidgetState =
    | 'ArticleTitleVariant1'
    | 'ArticleBadgeVariant1'
    | 'ArticleAuthorBlockVariant1'
    | 'ArticleAuthorBlockVariant2'
    | 'ArticleAuthorBlockVariant3'
    | 'ArticlePreviewBlock'
    | 'ArticlePeviewText'
    | 'ArticleSubTitle'
  ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  $: style = $userBetarenaSettings.theme == 'Dark' ? 'fill: var(--dark-theme-1-4-shade);' : 'fill: var(--whitev2);' as string;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

{#if option == 'ArticleTitleVariant1'}
  <svg
    id={option}
    class=
    "
    animation-target
    {clazz}
    "
    height="26"
    viewBox="0 0 {width} 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    style=
    "
    {width == 676 ? 'width: -webkit-fill-available;' : ''}
    {width == 464 ? 'width: 65%;' : ''}
    {width == 577 ? 'width: 80%;' : ''}
    {width == 293 ? 'width: 35%;' : ''}
    "
  >
    <rect
      {width}
      height="26"
      {style}
    />
  </svg>
{/if}

{#if option == 'ArticleBadgeVariant1'}
  <svg
    id={option}
    class=
    "
    animation-target
    {clazz}
    "
    height="26"
    viewBox="0 0 {width} 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <rect
      {width}
      height="26"
      rx="13"
      {style}
    />
  </svg>
{/if}

{#if option == 'ArticleAuthorBlockVariant1'}
  <svg
    id={option}
    class=
    "
    animation-target
    {clazz}
    "
    width="332"
    height="76"
    viewBox="0 0 332 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <circle cx="22" cy="22" r="22" {style} />
    <rect x="53" y="7" width="168" height="12" {style} />
    <rect x="233" y="7" width="99" height="12" {style} />
    <rect x="53" y="25" width="121" height="12" {style} />
    <rect x="53" y="48" width="168" height="12" {style} />
    <rect x="53" y="64" width="100" height="12" {style} />
  </svg>
{:else if option == 'ArticleAuthorBlockVariant2'}
  <svg
    id={option}
    class=
    "
    animation-target
    {clazz}
    "
    width="332"
    height="44"
    viewBox="0 0 332 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <circle cx="22" cy="22" r="22" {style} />
    <rect x="53" y="7" width="168" height="12" {style} />
    <rect x="233" y="7" width="99" height="12" {style} />
    <rect x="53" y="25" width="121" height="12" {style} />
  </svg>
{:else if option == 'ArticleAuthorBlockVariant3'}
  <svg
    id={option}
    class=
    "
    animation-target
    {clazz}
    "
    width="207"
    height="61"
    viewBox="0 0 207 61"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <circle cx="17" cy="17" r="17" {style} />
    <rect x="44" y="2" width="160" height="14" {style} />
    <rect x="44" y="20" width="99" height="14" {style} />
    <rect y="45" width="207" height="16" {style} />
  </svg>

{/if}

{#if option == 'ArticlePreviewBlock'}
  <svg
    id={option}
    class=
    "
    animation-target
    {clazz}
    "
    width="676"
    height="352"
    viewBox="0 0 676 352"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    style=
    "
    <!-- width: 100%; -->
    "
  >
    <rect width="676" height="352" {style} />
  </svg>
{/if}

{#if option == 'ArticleSubTitle'}
  <svg
    id={option}
    class=
    "
    animation-target
    {clazz}
    "
    width="422"
    height="24"
    viewBox="0 0 422 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    style=
    "
    width: 100%;
    "
  >
    <rect width="422" height="24" {style} />
  </svg>
{/if}

{#if option == 'ArticlePeviewText'}
  <svg
    id={option}
    class=
    "
    animation-target
    {clazz}
    "
    width="608"
    height="84"
    viewBox="0 0 608 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    style=
    "
    width: 100%;
    "
  >
    <rect width="608" height="12" {style} />
    <rect y="24" width="476.686" height="12" {style} />
    <rect y="48" width="608" height="12" {style} />
    <rect y="72" width="476.686" height="12" {style} />
  </svg>
{/if}
