<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
	class="animation-target"
  width="109" 
  height="28" 
  viewBox="0 0 109 28" 
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none">
  <rect width="109" height="28" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>