<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<!--
[ℹ] alternative
=> width=100%
-->
<svg
	class="animation-target"
	width="56"
	height="20"
	viewBox="0 0 56 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		width="56"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
