<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

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
  <rect width="154" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect y="18" width="61" height="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>
