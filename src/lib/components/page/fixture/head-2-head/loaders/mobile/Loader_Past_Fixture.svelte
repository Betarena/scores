<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	class="animation-target"
	width="252"
	height="82"
	viewBox="0 0 252 82"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<rect
		y="30"
		width="44"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="56"
		y="28"
		width="24"
		height="24"
		rx="12"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="104"
		y="30"
		width="44"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="172"
		y="28"
		width="24"
		height="24"
		rx="12"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="208"
		y="30"
		width="44"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="56"
		width="140"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="86"
		y="62"
		width="80"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
