<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  width="227" 
  height="45" 
  viewBox="0 0 227 45" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
>
  <rect y="0.5" width="227" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect y="25" width="227" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>