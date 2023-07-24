<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<!--
[ℹ] alternative
=> width=100%
-->
<svg
	class="animation-target"
	width="144"
	height="96"
	viewBox="0 0 144 96"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="144"
		height="96"
		rx="8"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
