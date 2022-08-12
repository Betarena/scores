<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="64" height="30" 
  viewBox="0 0 64 30" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
    
  <rect width="64" height="30" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    
</svg>