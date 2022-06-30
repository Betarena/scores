<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="447" 
  height="80" 
  viewBox="0 0 447 80" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">

  <rect width="80" height="80" rx="40" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="100" y="4" width="347" height="32" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="100" y="52" width="24" height="24" rx="12" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="136" y="54" width="94" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="246" y="52" width="24" height="24" rx="12" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="278" y="54" width="94" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <rect x="388" y="54" width="59" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />

</svg>
  