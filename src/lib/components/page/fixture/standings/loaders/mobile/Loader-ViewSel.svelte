<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="214"
	height="40"
	viewBox="0 0 214 40"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<g clip-path="url(#clip0_1_9536)">
		<rect
			width="214"
			height="40"
			rx="8"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
		<rect
			width="72"
			height="40"
			transform="translate(71)"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
		<path
			d="M142 0H206C210.418 0 214 3.58172 214 8V32C214 36.4183 210.418 40 206 40H142V0Z"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
		<path
			d="M0 8C0 3.58172 3.58172 0 8 0H72V40H8C3.58172 40 0 36.4183 0 32V8Z"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
	</g>
	<defs>
		<clipPath id="clip0_1_9536">
			<rect
				width="214"
				height="40"
				rx="8"
				fill="white"
			/>
		</clipPath>
	</defs>
</svg>
