<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

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
