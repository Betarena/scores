<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import userBetarenaSettings from '$lib/store/user-settings.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    competitionTitleLeft: boolean = false,
    competitionTitleRight: boolean = false,
    isTabletView: boolean = false,
    competitionCountdown: boolean = false,
    competitionSocialRight: boolean = false,
    competitionDetail: boolean = false,
    competitionLeagueBox: boolean = false,
    competitionLeagueBoxTablet: boolean = false,
    competitionLeagueTextBox: boolean = false,
    competitionTeamBox: boolean = false,
    participantLeft: boolean = false,
    participantRight: boolean = false,
    participantLeftTablet: boolean = false,
    participantRightTablet: boolean = false,
    participantTopLeftBox: boolean = false,
    isOdd: boolean = false,
    participantTopRightBox: boolean = false,
    participantListGeneralBox: boolean = false,
    participantListGeneralBoxTablet: boolean = false,
    participantListGeneralBoxTablet2: boolean = false,
    participantListColumnn: boolean = false
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
COMPETITION ⮕ MAIN TITLE
-->
{#if competitionTitleLeft && !isTabletView}
  <svg
    class=
    "
    animation-target
    "
    width="280"
    height="52"
    viewBox="0 0 280 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="280" height="24" fill="#F2F2F2"/>
    <rect y="28" width="192" height="24" fill="#F2F2F2"/>
  </svg>
{:else if competitionTitleLeft && isTabletView}
  <svg
    class=
    "
    animation-target
    "
    width="140"
    height="34"
    viewBox="0 0 140 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="140" height="16" fill="#F2F2F2"/>
    <rect y="18" width="83" height="16" fill="#F2F2F2"/>
  </svg>
{/if}

<!--
COMPETITION ⮕ MAIN PREDICTION
-->
{#if competitionTitleRight && !isTabletView}
  <svg
    class=
    "
    animation-target
    "
    width="280"
    height="24"
    viewBox="0 0 280 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="280" height="24" fill="#F2F2F2"/>
  </svg>
{:else if competitionTitleLeft && isTabletView}
  <svg
    class=
    "
    animation-target
    "
    width="71"
    height="16"
    viewBox="0 0 71 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="71" height="16" fill="#F2F2F2"/>
  </svg>
{/if}

<!--
COMPETITION ⮕ COUNTER BOX
-->
{#if competitionCountdown}
  <svg
    class=
    "
    animation-target
    "
    width="280"
    height="40"
    viewBox="0 0 280 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="280" height="40" rx="8" fill="#F2F2F2"/>
    <path d="M92 8C92 5.79086 93.7909 4 96 4H152V36H96C93.7909 36 92 34.2091 92 32V8Z" fill="white"/>
    <rect width="60" height="32" transform="translate(154 4)" fill="white"/>
    <path d="M216 4H272C274.209 4 276 5.79086 276 8V32C276 34.2091 274.209 36 272 36H216V4Z" fill="white"/>
    <rect x="11" y="12" width="61" height="16" fill="#F2F2F2"/>
    <rect x="109" y="12" width="27" height="16" fill="#F2F2F2"/>
    <rect x="171" y="12" width="27" height="16" fill="#F2F2F2"/>
    <rect x="232" y="12" width="27" height="16" fill="#F2F2F2"/>
  </svg>
{/if}

<!--
COMPETITION ⮕ SOCIAL BOX
-->
{#if competitionSocialRight && !isTabletView}
  <svg
    class=
    "
    animation-target
    "
    width="201"
    height="24"
    viewBox="0 0 201 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
  <rect width="201" height="24" fill="#F2F2F2"/>
  </svg>
{:else if competitionSocialRight && isTabletView}
  <svg
    class=
    "
    animation-target
    "
    width="274"
    height="31"
    viewBox="0 0 274 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="274" height="31" fill="#F2F2F2"/>
  </svg>
{/if}

<!--
COMPETITION ⮕ LEAGUE BOX
-->
{#if competitionLeagueBox}
  <svg
    class=
    "
    animation-target
    "
    width="79"
    height="72"
    viewBox="0 0 79 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
  <rect width="79" height="72" fill="#F2F2F2" />
  </svg>
{/if}

<!--
💻 TABLET
COMPETITION ⮕ LEAGUE BOX
-->
{#if competitionLeagueBoxTablet}
  <svg
    class=
    "
    animation-target
    "
    width="37"
    height="34"
    viewBox="0 0 37 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="37" height="34" fill="#F2F2F2" />
  </svg>
{/if}

<!--
COMPETITION ⮕ LEAGUE TEXT BOX
-->
{#if competitionLeagueTextBox}
  <svg
    class=
    "
    animation-target
    "
    width="154"
    height="34"
    viewBox="0 0 154 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="154" height="16" fill="#F2F2F2"/>
    <rect y="18" width="61" height="16" fill="#F2F2F2"/>
  </svg>
{/if}

<!--
COMPETITION ⮕ DETAIL (SHARED)
-->
{#if competitionDetail}
  <svg
    class=
    "
    animation-target
    "
    width="97"
    height="34"
    viewBox="0 0 97 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <rect width="48" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <rect y="18" width="97" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  </svg>
{/if}

<!--
COMPETITION ⮕ TEAM BOX
-->
{#if competitionTeamBox}
  <svg width="312" height="118" viewBox="0 0 312 118" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_4029_27147)">
    <rect x="16" y="12" width="280" height="86" rx="8" fill="#F2F2F2"/>
    </g>
    <line x1="155.5" y1="12" x2="155.5" y2="37" stroke="white"/>
    <line x1="155.5" y1="73" x2="155.5" y2="98" stroke="white"/>
    <rect x="57" y="65" width="61" height="16" fill="white"/>
    <rect x="195" y="65" width="61" height="16" fill="white"/>
    <rect x="68" y="27" width="37" height="34" fill="white"/>
    <rect x="207" y="27" width="37" height="34" fill="white"/>
    <defs>
    <filter id="filter0_d_4029_27147" x="0" y="0" width="312" height="118" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="8"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4029_27147"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4029_27147" result="shape"/>
    </filter>
    </defs>
  </svg>
{/if}

<!--
COMPETITION ⮕ PARTICIPANT ROW (LEFT)
-->
{#if participantLeft && isOdd}

  <svg
    class=
    "
    animation-target
    "
    width="84"
    height="16"
    viewBox="0 0 84 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect x="29" width="55" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
  </svg>

{:else if participantLeft && !isOdd}

  <svg
    class=
    "
    animation-target
    "
    width="84"
    height="16"
    viewBox="0 0 84 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #161616;' : 'fill: #F2F2F2;'} />
    <rect x="29" width="55" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #161616;' : 'fill: #F2F2F2;'} />
  </svg>

{/if}

<!--
COMPETITION ⮕ PARTICIPANT ROW (RIGHT)
-->
{#if participantRight && isOdd}

  <svg
    class=
    "
    animation-target
    "
    width="205"
    height="16"
    viewBox="0 0 205 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect x="30" width="175" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
  </svg>

{:else if participantRight && !isOdd}

  <svg
    class=
    "
    animation-target
    "
    width="205"
    height="16"
    viewBox="0 0 205 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #161616;' : 'fill: #F2F2F2;'} />
    <rect x="30" width="175" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #161616;' : 'fill: #F2F2F2;'} />
  </svg>

{/if}

<!--
💻 TABLET
COMPETITION ⮕ PARTICIPANT ROW (LEFT)
-->
{#if participantLeftTablet && isOdd}

  <svg width="97" height="16" viewBox="0 0 97 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="32" y="4" width="65" height="8" fill="#F2F2F2"/>
    <rect width="20" height="16" fill="#F2F2F2"/>
  </svg>

{:else if participantLeftTablet && !isOdd}

  <svg width="97" height="16" viewBox="0 0 97 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="32" y="4" width="65" height="8" fill="#F2F2F2"/>
    <rect width="20" height="16" fill="#F2F2F2"/>
  </svg>

{/if}

<!--
💻 TABLET
COMPETITION ⮕ PARTICIPANT ROW (LEFT)
-->
{#if participantRightTablet && isOdd}

  <svg
    class=
    "
    animation-target
    "
    width="65"
    height="16"
    viewBox="0 0 65 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="32" y="4" width="33" height="8" fill="white"/>
    <rect width="20" height="16" fill="white"/>
  </svg>

{:else if participantRightTablet && !isOdd}

  <svg
    class=
    "
    animation-target
    "
    width="65"
    height="16"
    viewBox="0 0 65 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="32" y="4" width="33" height="8" fill="white"/>
    <rect width="20" height="16" fill="white"/>
  </svg>

{/if}

<!--
COMPETITION ⮕ PARTICIPANT TOP ROW (LEFT)
-->
{#if participantTopLeftBox}

  <svg
    class=
    "
    animation-target
    "
    width="72"
    height="31"
    viewBox="0 0 72 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="72" height="31" fill="#F2F2F2"/>
  </svg>

{/if}

<!--
COMPETITION ⮕ PARTICIPANT TOP ROW (RIGHT)
-->
{#if participantTopRightBox}

  <svg
    class=
    "
    animation-target
    "
    width="97"
    height="44"
    viewBox="0 0 97 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="97" height="44" rx="8" fill="#F2F2F2"/>
  </svg>

{/if}

<!--
COMPETITION ⮕ GENERAL BOX SVG
-->
{#if participantListGeneralBox}

  <svg
    class=
    "
    animation-target
    "
    width="65"
    height="34"
    viewBox="0 0 65 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="16" fill="#F2F2F2"/>
    <rect y="18" width="65" height="16" fill="#F2F2F2"/>
  </svg>

{/if}

<!--
💻 TABLET
COMPETITION ⮕ GENERAL BOX SVG
-->
{#if participantListGeneralBoxTablet}

  <svg
    class=
    "
    animation-target
    "
    width="139"
    height="16"
    viewBox="0 0 139 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.361328" width="138.12" height="16" fill="#F2F2F2"/>
  </svg>

{/if}

<!--
💻 TABLET
COMPETITION ⮕ GENERAL BOX (2) SVG
-->
{#if participantListGeneralBoxTablet2}

  <svg
    width="54"
    height="16"
    viewBox="0 0 54 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.519043" width="53.0379" height="16" fill="#F2F2F2"/>
  </svg>

{/if}

<!--
COMPETITION ⮕ PARTICIPANT LIST TITLE
-->
{#if participantListColumnn}

  <svg
    class=
    "
    animation-target
    "
    width="65"
    height="8"
    viewBox="0 0 65 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="65" height="8" fill="#F2F2F2"/>
  </svg>

{/if}