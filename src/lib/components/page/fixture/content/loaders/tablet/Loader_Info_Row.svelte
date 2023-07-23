<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<!--
[ℹ] alternative
=> width=100%
-->
<svg
	class="animation-target"
	width="496"
	height="85"
	viewBox="0 0 496 85"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="457"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		y="30"
		width="496"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		y="65"
		width="56"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="68"
		y="65"
		width="56"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="136"
		y="65"
		width="56"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
