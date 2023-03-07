<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	width="289"
	height="140"
	viewBox="0 0 289 140"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M169 8C169 3.58172 172.582 0 177 0H281C285.418 0 289 3.58172 289 8V32C289 36.4183 285.418 40 281 40H177C172.582 40 169 36.4183 169 32V8Z"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		y="100"
		width="289"
		height="40"
		rx="8"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
