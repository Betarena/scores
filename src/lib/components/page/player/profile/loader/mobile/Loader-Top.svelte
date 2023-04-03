<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="217" 
  height="40" 
  viewBox="0 0 217 40" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <rect width="40" height="40" rx="20" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="52" y="10" width="165" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark'	? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>
  