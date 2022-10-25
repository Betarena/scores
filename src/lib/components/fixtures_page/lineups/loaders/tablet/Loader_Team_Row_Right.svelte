<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<!-- 
[ℹ] alternative
=> width=100%
-->
<svg
	class="animation-target"
	width="240"
	height="42"
	viewBox="0 0 240 42"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="184"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		x="75"
		y="22"
		width="109"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<circle
		cx="220"
		cy="21"
		r="20"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
</svg>
