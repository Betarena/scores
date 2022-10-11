<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { dev } from '$app/environment';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import LoaderTeam from "./loaders/desktop/Loader_Team.svelte";
	import LoaderMiddle from "./loaders/desktop/Loader_Middle.svelte";

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// [ℹ] TABLET - VIEW
			if (w > 768) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// [ℹ] MOBILE - VIEW
			if (w < 475) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
	});
</script>


<!-- ===============
    COMPONENT HTML 
==================== -->

<div
  id="fixture-scoreboard-loader"
  class="row-space-out">

  <div>
    <LoaderTeam />
  </div>
  <div>
    <LoaderMiddle />
  </div>
  <div>
    <LoaderTeam />
  </div>

</div>

<!-- ===============
    COMPONENT STYLE
==================== -->

<style>

  div#fixture-scoreboard-loader {
		min-width: 100%;
    padding: 20px;
    padding-bottom: 0;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
	}

</style>
