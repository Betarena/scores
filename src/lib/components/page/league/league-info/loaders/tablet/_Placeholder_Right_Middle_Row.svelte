<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="289"
	height="40"
	viewBox="0 0 289 40"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="289"
		height="40"
		rx="8"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
