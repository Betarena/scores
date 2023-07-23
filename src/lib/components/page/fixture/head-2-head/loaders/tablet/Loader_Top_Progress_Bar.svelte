<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="326"
	height="12"
	viewBox="0 0 326 12"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<rect
		width="326"
		height="12"
		rx="6"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
