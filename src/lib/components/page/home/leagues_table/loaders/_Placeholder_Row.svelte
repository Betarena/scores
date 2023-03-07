<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	class="animation-target"
	width="462"
	height="32"
	viewBox="0 0 462 32"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		x="326"
		y="2"
		width="64"
		height="30"
		rx="4"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="398"
		y="2"
		width="64"
		height="30"
		rx="4"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<path
		d="M0 16C0 9.37258 5.37258 4 12 4V4C18.6274 4 24 9.37258 24 16V16C24 22.6274 18.6274 28 12 28V28C5.37258 28 0 22.6274 0 16V16Z"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<circle
		cx="64"
		cy="16"
		r="16"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="96"
		y="8"
		width="150"
		height="18"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
