<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<!-- 
[ℹ] alternative
=> width=100%
-->
<svg
	class="animation-target"
	width="140"
	height="24"
	viewBox="0 0 140 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="140"
		height="24"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
