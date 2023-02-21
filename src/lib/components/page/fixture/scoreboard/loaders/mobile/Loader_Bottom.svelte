<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg
	class="animation-target"
	width="311"
	height="52"
	viewBox="0 0 311 52"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect
		x="45.75"
		y="20"
		width="64"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
	<path
		d="M155.5 50H0V54H155.5V50Z"
		fill="#F5620F"
		mask="url(#path-1-inside-1_485_7109)"
	/>
	<rect
		x="201.25"
		y="20"
		width="64"
		height="20"
		rx="2"
		style={$userBetarenaSettings.theme == 'Dark'
			? 'fill: #616161;'
			: 'fill: #F2F2F2;'}
	/>
</svg>

<!-- [v2] Alternative -->
<!-- 
<svg width="343" height="52" viewBox="0 0 343 52" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_b_5647_356352)">
  <path d="M0 0H343V40C343 46.6274 337.627 52 331 52H12C5.37258 52 0 46.6274 0 40V0Z" fill="white"/>
  <rect x="61.75" y="20" width="64" height="20" rx="2" fill="#F2F2F2"/>
  <path d="M171.5 50H16V54H171.5V50Z" fill="#F5620F" mask="url(#path-2-inside-1_5647_356352)"/>
  <rect x="217.25" y="20" width="64" height="20" rx="2" fill="#F2F2F2"/>
  </g>
  <defs>
  <filter id="filter0_b_5647_356352" x="-6" y="-6" width="355" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  <feGaussianBlur in="BackgroundImageFix" stdDeviation="3"/>
  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5647_356352"/>
  <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5647_356352" result="shape"/>
  </filter>
  </defs>
</svg> 
-->
