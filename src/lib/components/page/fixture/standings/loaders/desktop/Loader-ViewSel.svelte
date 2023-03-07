<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	class="animation-target"
	width="286"
	height="40"
	viewBox="0 0 286 40"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M0 8C0 3.58172 3.58172 0 8 0H278C282.418 0 286 3.58172 286 8V32C286 36.4183 282.418 40 278 40H8C3.58173 40 0 36.4183 0 32V8Z"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>
