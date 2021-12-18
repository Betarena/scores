<script lang='ts'>
	import { userBetarenaSettings } from '$lib/store/user-settings'
</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

<svg width="303" height="222" viewBox="0 0 303 222" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- ... animating-container ... -->
    <rect class='animation-target' width="303" height="222" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
    <!-- ... non-animating-containers ... -->
    <rect x="235" y="148" width="56" height="30" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4B4B4B;' : 'fill: #F2F2F2;'} />
    <rect x="235" y="114" width="56" height="30" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4B4B4B;' : 'fill: #F2F2F2;'} />
    <rect x="235" y="80" width="56" height="30" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4B4B4B;' : 'fill: #F2F2F2;'} />
    <rect x="235" y="46" width="56" height="30" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4B4B4B;' : 'fill: #F2F2F2;'} />
    <rect x="235" y="12" width="56" height="30" rx="4" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4B4B4B;' : 'fill: #F2F2F2;'} />
    <rect y="190" width="303" height="32" rx="4" fill="#F5620F" />
</svg>