<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="303"
	height="44"
	viewBox="0 0 303 44"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		x="176"
		y="7"
		width="43"
		height="30"
		rx="4"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<path
		d="M235 7H295C299.418 7 303 10.5817 303 15V37H243C238.582 37 235 33.4183 235 29V7Z"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		width="44"
		height="44"
		rx="4"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="60"
		y="7"
		width="80"
		height="30"
		rx="4"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
