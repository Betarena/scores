<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="98" 
  height="42" 
  viewBox="0 0 98 42" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <rect width="98" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect y="22" width="65" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>
  