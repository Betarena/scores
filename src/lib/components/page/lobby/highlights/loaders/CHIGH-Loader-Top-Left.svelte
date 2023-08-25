<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

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