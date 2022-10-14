<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	class="animation-target"
	width="652"
	height="20"
	viewBox="0 0 652 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		y="1"
		width="24"
		height="18"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		x="51"
		width="601"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
</svg>
