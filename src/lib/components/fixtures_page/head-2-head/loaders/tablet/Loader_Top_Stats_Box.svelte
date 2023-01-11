<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
	class="animation-target"
  width="168" 
  height="64" 
  viewBox="0 0 168 64" 
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none">
  <rect width="40" height="40" rx="4"  style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
  <rect y="44" width="40" height="20" rx="4"  style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
  <rect x="64" width="40" height="40" rx="4"  style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
  <rect x="64" y="44" width="40" height="20" rx="4"  style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
  <rect x="128" width="40" height="40" rx="4"  style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
  <rect x="128" y="44" width="40" height="20" rx="4"  style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
</svg>