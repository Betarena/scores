<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
  class=
  "
  animation-target
  "
  width="60"
  height="32"
  viewBox="0 0 60 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M0 0H56C58.2091 0 60 1.79086 60 4V28C60 30.2091 58.2091 32 56 32H0V0Z" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #383838;' : 'fill: #FFFFFF;'} />
  <rect x="16" y="8" width="27" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>
