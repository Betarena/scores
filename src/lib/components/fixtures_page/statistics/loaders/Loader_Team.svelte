<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<!-- 
[ℹ] alternative
=> width=100%
-->
<svg
	class="animation-target"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="24"
		height="24"
		rx="12"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
</svg>
