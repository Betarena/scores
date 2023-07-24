<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
  class="animation-target"
  width="64"
  height="49"
  viewBox="0 0 64 49"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
>
  <rect x="63" width="1" height="48" fill="#E6E6E6"/>
  <rect y="0.0378418" width="47" height="48" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>