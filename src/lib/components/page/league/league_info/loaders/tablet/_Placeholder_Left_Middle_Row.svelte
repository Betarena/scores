<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	class="animation-target"
	width="346"
	height="20"
	viewBox="0 0 346 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="46"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="57.5"
		y="6"
		width="231"
		height="8"
		rx="4"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="300"
		width="46"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
