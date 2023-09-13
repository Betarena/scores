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
    competitionExtraInfo: boolean = false
    , competitionJoinNowBox: boolean = false
    , competitionParticipants: boolean = false
    , competitionTeamBox: boolean = false
    , competitionCountdown: boolean = false
    , competitionTopLeftBox: boolean = false
    , competitionTopRightBox: boolean = false
    , competitionTournamentBox: boolean = false
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
COMPETITION ⮕ TOP-LEFT BOX
-->
{#if competitionTopLeftBox}
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
    <rect width="140" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect y="18" width="83" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
  </svg>
{/if}

<!--
COMPETITION ⮕ TOP-LEFT BOX
-->
{#if competitionTopRightBox}
  <svg
    class=
    "
    animation-target
    "
    width="53"
    height="16"
    viewBox="0 0 53 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="53" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
  </svg>
{/if}

<!--
COMPETITION ⮕ TOURNAMENT BOX
-->
{#if competitionTournamentBox}
  <svg
    class=
    "
    animation-target
    "
    width="205"
    height="34"
    viewBox="0 0 205 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="51" width="154" height="16" fill="#626262"/>
    <rect x="51" y="18" width="61" height="16" fill="#626262"/>
    <rect width="37" height="34" fill="#626262"/>
  </svg>
{/if}

<!--
COMPETITION ⮕ EXTRA INFO
-->
{#if competitionExtraInfo}
  <svg
    class=
    "
    animation-target
    "
    width="120"
    height="36"
    viewBox="0 0 120 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <rect y="20" width="120" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  </svg>
{/if}

<!--
COMPETITION ⮕ JOIN NOW
-->
{#if competitionJoinNowBox}
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
    <rect width="97" height="44" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
  </svg>
{/if}

<!--
COMPETITION ⮕ PARTICIPANTS
-->
{#if competitionParticipants}
  <svg
    class=
    "
    animation-target
    "
    width="150"
    height="34"
    viewBox="0 0 150 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="85" width="48" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect y="1" width="72" height="31" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect x="85" y="18" width="65" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
  </svg>
{/if}

<!--
COMPETITION ⮕ TEAM BOX
-->
{#if competitionTeamBox}
  <svg
    class=
    "
    animation-target
    width-100
    "
    width="280"
    height="86"
    viewBox="0 0 280 86"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio='none'
  >
    <rect width="280" height="86" rx="8" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4B4B4B;' : 'fill: #F2F2F2;'} />
    <line x1="139.5" y1="2.18557e-08" x2="139.5" y2="25" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <line x1="139.5" y1="61" x2="139.5" y2="86" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect x="41" y="53" width="61" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect x="179" y="53" width="61" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect x="52" y="15" width="37" height="34" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
    <rect x="191" y="15" width="37" height="34" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
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
    <rect width="280" height="40" rx="8" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #626262;' : 'fill: #F2F2F2;'} />
    <path d="M92 8C92 5.79086 93.7909 4 96 4H152V36H96C93.7909 36 92 34.2091 92 32V8Z" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #626262;' : 'fill: #F2F2F2;'} />
    <rect width="60" height="32" transform="translate(154 4)" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #626262;' : 'fill: #F2F2F2;'} />
    <path d="M216 4H272C274.209 4 276 5.79086 276 8V32C276 34.2091 274.209 36 272 36H216V4Z" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #626262;' : 'fill: #F2F2F2;'} />
    <rect x="11" y="12" width="61" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #626262;' : 'fill: #F2F2F2;'} />
    <rect x="109" y="12" width="27" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #626262;' : 'fill: #F2F2F2;'} />
    <rect x="171" y="12" width="27" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #626262;' : 'fill: #F2F2F2;'} />
    <rect x="232" y="12" width="27" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #626262;' : 'fill: #F2F2F2;'} />
  </svg>
{/if}
