<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
	  class="animation-target"
    width="100%" height="32" 
    viewBox="0 0 100% 32" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    
    <rect width="100%" height="32" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />

</svg>