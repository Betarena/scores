<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<div
	style="margin-top: 20px;margin-bottom:20px;border-bottom:2px solid {$userBetarenaSettings.theme ==
	'Dark'
		? '#616161;'
		: '#F2F2F2'}"
>
	<svg
		class="animation-target"
		width="454"
		height="21"
		viewBox="0 0 454 21"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			y="3"
			x="12"
			width="24"
			height="18"
			rx="2"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
		<rect
			x="65"
			width="403"
			height="20"
			rx="2"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
	</svg>

	<svg
		style="margin-top: 10px;"
		class="animation-target"
		width="502"
		height="56"
		viewBox="0 0 502 56"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			y="3"
			width="47"
			height="48"
			x="2"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>

		<rect
			y="3"
			width="2"
			height="48"
			x="65"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>

		<rect
			x="85"
			width="369"
			height="20"
			rx="2"
			y="3"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
		<rect
			x="85"
			width="369"
			height="20"
			rx="2"
			y="30"
			style={$userBetarenaSettings.theme == 'Dark'
				? 'fill: #616161;'
				: 'fill: #F2F2F2;'}
		/>
	</svg>
</div>
