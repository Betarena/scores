<!-- [ℹ]============
	COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	// ... svelte-imports;

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import DesktopPlaceholderBodyMain from './loaders/_Placeholder_Body_Main.svelte';
	import DesktopPlaceholderHead from './loaders/_Placeholder_Head.svelte';
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
	<div
		class="row-space-start"
		style="padding: 20px; width: fit-content; padding-bottom: 0px;"
	>
		<DesktopPlaceholderHead />
	</div>

	<div style="padding: 20px;">
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
		margin-top: 40px;
	}
</style>
