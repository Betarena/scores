<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
	  class="animation-target"
    width="303" height="92" 
    viewBox="0 0 303 92" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    
    <rect x="155" y="52" width="148" height="40" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <rect y="52" width="148" height="40" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <circle cx="60" cy="20" r="20" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <circle cx="74" cy="34" r="10" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <rect y="11" width="24" height="18" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <rect x="96" y="1" width="207" height="18" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <rect x="96" y="24" width="207" height="18" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    
</svg>
    