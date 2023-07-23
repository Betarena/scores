<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
  class="animation-target"
  width="32"
  height="60"
  viewBox="0 0 32 60"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
>
  <rect width="32" height="32" rx="16" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
  <rect y="40" width="32" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
</svg>