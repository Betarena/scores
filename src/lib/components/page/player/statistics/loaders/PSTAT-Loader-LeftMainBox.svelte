<script lang="ts">
	import userBetarenaSettings from '$lib/store/user-settings.js';
</script>

<svg
  class="animation-target"
  width="326"
  height="44"
  viewBox="0 0 326 44"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
>
  <rect width="326" height="44" rx="8" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'}/>
</svg>

<style>
  svg
  {
    width: 100% !important;
  }
</style>