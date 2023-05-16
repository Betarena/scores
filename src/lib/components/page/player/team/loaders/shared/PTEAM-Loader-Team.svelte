<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="176" 
  height="42" 
  viewBox="0 0 176 42" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
>
  <circle cx="20" cy="21" r="20" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="56" width="80" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="56" y="22" width="120" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>