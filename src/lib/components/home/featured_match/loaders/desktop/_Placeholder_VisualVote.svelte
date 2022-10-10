<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg width="460" height="260" viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg">
	<!-- ... animating-container ... -->
	<rect
		class="animation-target"
		y="180"
		width="140"
		height="48"
		rx="8"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<path
		class="animation-target"
		d="M160 188C160 183.582 163.582 180 168 180H292C296.418 180 300 183.582 300 188V220C300 224.418 296.418 228 292 228H168C163.582 228 160 224.418 160 220V188Z"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		class="animation-target"
		x="320"
		y="180"
		width="140"
		height="48"
		rx="8"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<circle
		class="animation-target"
		cx="68"
		cy="44"
		r="44"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<circle
		class="animation-target"
		cx="394"
		cy="44"
		r="44"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		class="animation-target"
		x="24"
		y="104"
		width="88"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		class="animation-target"
		y="240"
		width="140"
		height="20"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		class="animation-target"
		x="160"
		y="240"
		width="140"
		height="20"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		class="animation-target"
		x="320"
		y="240"
		width="140"
		height="20"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		class="animation-target"
		x="187"
		y="38"
		width="88"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		class="animation-target"
		x="164"
		y="71"
		width="134"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<rect
		class="animation-target"
		x="350"
		y="104"
		width="88"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}
	/>
	<!-- ... non-animating-containers ... -->
	<circle
		cx="350"
		cy="204"
		r="14"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4B4B4B;' : 'fill: white;'}
	/>
	<circle
		cx="30"
		cy="204"
		r="14"
		style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4B4B4B;' : 'fill: white;'}
	/>
	<path
		d="M197 197L183 211"
		stroke="#8C8C8C"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M183 197L197 211"
		stroke="#8C8C8C"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
