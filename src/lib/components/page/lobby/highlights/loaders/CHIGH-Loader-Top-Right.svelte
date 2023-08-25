<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

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
