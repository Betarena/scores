<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="139"
	height="48"
	viewBox="0 0 139 48"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<rect
		width="139"
		height="48"
		rx="8"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
