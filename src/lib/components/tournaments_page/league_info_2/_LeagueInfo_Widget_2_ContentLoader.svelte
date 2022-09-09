<!-- [ℹ]============
	COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';

  import DesktopPlaceholderBodyMain from './loaders/_Placeholder_Body_Main.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// TABLET - VIEW
		if (wInit > 1160) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// MOBILE - VIEW
		if (wInit < 725) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// TABLET - VIEW
			if (w > 1160) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// MOBILE - VIEW
			if (w < 725) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
	});

</script>

<!-- ============
  COMPONENT HTML 
=================-->

<div 
  id="content-loader-box"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

	<!-- [ℹ] CONTENT-LOADER
  [DESKTOP]
  [TABLET]
  -->
  <div
    style="padding: 20px;">
    <DesktopPlaceholderBodyMain />
  </div>
  
</div>

<!-- ============
  COMPONENT STYLE
=================-->
<style>

  #content-loader-box {
    /* display: grid; */
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
    /* overflow: hidden; */
    position: relative;
    /* margin-top: 40px; */
  }

</style>
