<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="100%"
	height="20"
	viewBox="0 0 134 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		x="32"
		y="1"
		width="102"
		height="18"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		width="20"
		height="20"
		rx="10"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
