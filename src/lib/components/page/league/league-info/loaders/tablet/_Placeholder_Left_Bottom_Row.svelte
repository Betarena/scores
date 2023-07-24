<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
	class="animation-target"
	width="256"
	height="52"
	viewBox="0 0 256 52"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g filter="url(#filter0_i_473_0)">
		<rect
			width="64"
			height="52"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #4b4b4b;'
				: 'fill: #FFFFFF;'}
		/>
		<rect
			y="20"
			width="64"
			height="20"
			rx="2"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
	</g>
	<rect
		x="96"
		y="20"
		width="64"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<rect
		x="192"
		y="20"
		width="64"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<defs>
		<filter
			id="filter0_i_473_0"
			x="0"
			y="0"
			width="64"
			height="52"
			filterUnits="userSpaceOnUse"
			color-interpolation-filters="sRGB"
		>
			<feFlood
				flood-opacity="0"
				result="BackgroundImageFix"
			/>
			<feBlend
				mode="normal"
				in="SourceGraphic"
				in2="BackgroundImageFix"
				result="shape"
			/>
			<feColorMatrix
				in="SourceAlpha"
				type="matrix"
				values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				result="hardAlpha"
			/>
			<feOffset dy="-2" />
			<feComposite
				in2="hardAlpha"
				operator="arithmetic"
				k2="-1"
				k3="1"
			/>
			<feColorMatrix
				type="matrix"
				values="0 0 0 0 0.960784 0 0 0 0 0.384314 0 0 0 0 0.0588235 0 0 0 1 0"
			/>
			<feBlend
				mode="normal"
				in2="shape"
				result="effect1_innerShadow_473_0"
			/>
		</filter>
	</defs>
</svg>
