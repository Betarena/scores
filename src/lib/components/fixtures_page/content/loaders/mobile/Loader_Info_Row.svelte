<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<!-- 
[ℹ] alternative
=> width=100%
-->
<svg
	class="animation-target"
	width="207"
	height="76"
	viewBox="0 0 207 76"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="162"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		y="28"
		width="207"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		y="56"
		width="56"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="68"
		y="56"
		width="56"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
