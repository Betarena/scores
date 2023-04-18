<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="108" 
  height="44" 
  viewBox="0 0 108 44" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <rect width="108" height="44" rx="8" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>
  