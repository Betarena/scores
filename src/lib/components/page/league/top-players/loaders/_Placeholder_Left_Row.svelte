<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="231"
	height="44"
	viewBox="0 0 231 44"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<circle
		cx="60"
		cy="20"
		r="20"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<circle
		cx="74"
		cy="34"
		r="10"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		y="11"
		width="24"
		height="18"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="96"
		y="1"
		width="135"
		height="18"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="96"
		y="24"
		width="102"
		height="18"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
