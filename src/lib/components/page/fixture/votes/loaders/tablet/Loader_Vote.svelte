<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	class="animation-target"
	width="207"
	height="84"
	viewBox="0 0 207 84"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<rect
		width="206.667"
		height="48"
		rx="8"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="43"
		y="64"
		width="120"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
