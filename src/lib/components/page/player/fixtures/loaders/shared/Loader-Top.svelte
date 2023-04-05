<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="320" 
  height="24" 
  viewBox="0 0 320 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <rect x="51" y="2" width="269" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect width="24" height="24" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>
  