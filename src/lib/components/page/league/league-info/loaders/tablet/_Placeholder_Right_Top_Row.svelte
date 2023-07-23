<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="120"
	height="40"
	viewBox="0 0 120 40"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M0 8C0 3.58172 3.58172 0 8 0H112C116.418 0 120 3.58172 120 8V32C120 36.4183 116.418 40 112 40H8C3.58172 40 0 36.4183 0 32V8Z"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
