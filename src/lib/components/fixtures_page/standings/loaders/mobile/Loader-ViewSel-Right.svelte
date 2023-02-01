<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
</script>

<svg 
  class="animation-target"
  width="72" 
  height="40"
  viewBox="0 0 72 40" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none">
  <path d="M0 8C0 3.58172 3.58172 0 8 0H64C68.4183 0 72 3.58172 72 8V32C72 36.4183 68.4183 40 64 40H8C3.58172 40 0 36.4183 0 32V8Z" style={$userBetarenaSettings.theme == 'Dark' ? 'fill: #616161;' : 'fill: #F2F2F2;'} />
</svg>