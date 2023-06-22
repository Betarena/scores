<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	class="animation-target"
	width="482"
	height="75"
	viewBox="0 0 482 75"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		y="55"
		width="46"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="57.5"
		y="61"
		width="367"
		height="8"
		rx="4"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="436"
		y="55"
		width="46"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<path
		d="M362 8C362 3.58172 365.582 0 370 0H474C478.418 0 482 3.58172 482 8V32C482 36.4183 478.418 40 474 40H370C365.582 40 362 36.4183 362 32V8Z"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="57"
		width="289"
		height="40"
		rx="8"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
