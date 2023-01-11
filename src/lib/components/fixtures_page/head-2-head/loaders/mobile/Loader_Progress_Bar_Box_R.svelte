<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
	class="animation-target"
  width="147" 
  height="36" 
  viewBox="0 0 147 36" 
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none">
  <rect y="28" width="147" height="8" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
  <rect x="23" width="124" height="20" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
</svg>