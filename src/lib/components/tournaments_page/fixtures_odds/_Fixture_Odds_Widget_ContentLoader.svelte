<!-- [ℹ]============
	COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import DesktopPlaceholderBodyMain from './loaders/desktop/_Placeholder_Body_Main.svelte';
	import DesktopPlaceholderHead from './loaders/desktop/_Placeholder_Head.svelte';
	import DesktopPlaceholderLeftHead from './loaders/desktop/_Placeholder_Left_Head.svelte';
	import DesktopPlaceholderRightHead from './loaders/desktop/_Placeholder_Right_Head.svelte';

	import PlaceholderBodyMain from './loaders/mobile/_Placeholder_Body_Main.svelte';
	import PlaceholderHeadLow from './loaders/mobile/_Placeholder_Head_Low.svelte';
	import PlaceholderHeadMid from './loaders/mobile/_Placeholder_Head_Mid.svelte';
	import PlaceholderHeadTop from './loaders/mobile/_Placeholder_Head_Top.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
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
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
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
			}
		);
	});
</script>

<!-- ============
  COMPONENT HTML 
=================-->

<div
	id="content-loader-box"
	class:dark-background-1={$userBetarenaSettings.theme ==
		'Dark'}
>
	<!-- [ℹ] CONTENT-LOADER
  [DESKTOP]
  [TABLET]
  -->
	{#if !mobileExclusive}
		<div
			style="padding: 20px 20px 0 20px;"
			class="row-space-out m-b-15"
		>
			<DesktopPlaceholderLeftHead />
			<DesktopPlaceholderRightHead />
		</div>

		<div
			class="m-b-15"
			style="padding: 0 20px 0 20px;"
		>
			<DesktopPlaceholderHead />
		</div>

		<div>
			<DesktopPlaceholderBodyMain />
		</div>
	{:else}
		<div
			style="padding: 20px 20px 0 20px;"
			class="m-b-15"
		>
			<PlaceholderHeadTop />
		</div>

		<div
			style="padding: 0 20px 0 20px;"
			class="m-b-15"
		>
			<PlaceholderHeadMid />
		</div>

		<div
			style="padding: 0 20px 0 20px;"
			class="m-b-10"
		>
			<PlaceholderHeadLow />
		</div>

		<div>
			<PlaceholderBodyMain />
		</div>
	{/if}
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
		margin-top: 40px;
	}
</style>
