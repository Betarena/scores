<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="101" 
  height="40" 
  viewBox="0 0 101 40" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <rect width="101" height="40" rx="8" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>

  