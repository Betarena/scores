<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
	class="animation-target"
  width="120" 
  height="20" 
  viewBox="0 0 120 20" 
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none">
  <rect width="120" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
</svg>