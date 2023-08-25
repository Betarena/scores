<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
  class=
  "
  animation-target
  "
  width="61"
  height="54"
  viewBox="0 0 61 54"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect y="38" width="61" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
  <rect x="11" width="37" height="34" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #FFFFFF;'} />
</svg>
