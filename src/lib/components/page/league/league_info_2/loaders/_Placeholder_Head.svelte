<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<!-- 138 -->
<svg
	class="animation-target"
	width="100%"
	height="24"
	viewBox="0 0 138 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="24"
		height="24"
		rx="12"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="36"
		y="3"
		width="102"
		height="18"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
