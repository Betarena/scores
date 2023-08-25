<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

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
