<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	width="466"
	height="85"
	viewBox="0 0 466 85"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
  class="animation-target"
>
	<rect
		x="12"
		y="1"
		width="24"
		height="18"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="63"
		width="403"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="80"
		y="37.5"
		width="386"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="80"
		y="62.5"
		width="386"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="63"
		y="36"
		width="1"
		height="48"
		fill="#E6E6E6"
	/>
	<rect
		y="36.0379"
		width="47"
		height="48"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>

<style>
  svg {
    max-width: 100%
  }
</style>
