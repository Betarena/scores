<script lang="ts">
  import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="160"
  height="52" 
  viewBox="0 0 160 52" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">

  <g filter="url(#filter0_i_32_1635)">
    <rect width="64" height="52" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4b4b4b;' : 'fill: #FFFFFF;'} />
    <rect y="20" width="64" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  </g>
  <rect width="64" height="52" transform="translate(96)" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #4b4b4b;' : 'fill: #FFFFFF;'} />
  <rect x="96" y="20" width="64" height="20" rx="2" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
  <defs>
    <filter id="filter0_i_32_1635" x="0" y="0" width="64" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.960784 0 0 0 0 0.384314 0 0 0 0 0.0588235 0 0 0 1 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_32_1635"/>
    </filter>
  </defs>

</svg>
  