<!-- [ℹ]============
	COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';

  import PlaceholderRowRight from './loaders/desktop/_Placeholder_Row_Right.svelte';
  import PlaceholderRowLeft from './loaders/desktop/_Placeholder_Row_Left.svelte';
  import PlaceholderHead from './loaders/desktop/_Placeholder_Head.svelte';
  import PlaceholderViewSel from './loaders/desktop/_Placeholder_ViewSel.svelte';
  import PlaceholderBottom from './loaders/desktop/_Placeholder_Bottom.svelte';

  import PlaceholderBottomM from './loaders/mobile/_Placeholder_Bottom.svelte';
  import PlaceholderHeadM from './loaders/mobile/_Placeholder_Head.svelte';
  import PlaceholderViewSelM from './loaders/mobile/_Placeholder_ViewSel.svelte';
  import PlaceholderRowLeftM from './loaders/mobile/_Placeholder_Row_Left_M.svelte'
  import PlaceholderRowRightM from './loaders/mobile/_Placeholder_Row_Right_M.svelte'
  import PlaceholderTableViewM from './loaders/mobile/_Placeholder_Table_View.svelte';
  
  let showNum: number = 10;

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
  id="standings-table-container"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

	<!-- [ℹ] DESKTOP CONTENT-LOADER
  -->
	{#if !tabletExclusive}

    <div
      class="m-b-15">
      <PlaceholderViewSel />
    </div>

    <div>
      <PlaceholderHead />
    </div>

    {#each {length: showNum} as _, i}
      <div 
        class="teams-row row-space-out">
          <div
            class="yes m-r-15">
            <PlaceholderRowLeft />
          </div>
          <div>
            <PlaceholderRowRight />
          </div>
      </div>
    {/each}

    <PlaceholderBottom />

  <!-- [ℹ] TABLET CONTENT-LOADER 
  -->
	{:else if tabletExclusive && !mobileExclusive}

    <div
      class="m-b-15">
      <PlaceholderViewSel />
    </div>

    <div>
      <PlaceholderHead />
    </div>

    {#each {length: showNum} as _, i}
      <div 
        class="teams-row row-space-out">
          <div
            class="yes m-r-15">
            <PlaceholderRowLeft />
          </div>
          <div>
            <PlaceholderRowRight />
          </div>
      </div>
    {/each}

    <PlaceholderBottom />
		
  <!-- [ℹ] MOBILE EXCLUSIVE CONTENT-LOADER 
  -->
	{:else if tabletExclusive && mobileExclusive}

    <div
      class="m-b-20"
      style="padding: 0 20px;">
      <PlaceholderViewSelM />
    </div>

    <div
      class="m-b-10"
      style="padding: 0 20px;">
      <PlaceholderTableViewM />
    </div>

    <PlaceholderHeadM />

    {#each {length: showNum} as _, i}
      <div 
        class="teams-row row-space-out">
        <div
          class="yes m-r-15">
          <PlaceholderRowLeftM />
        </div>
        <div
          class="yes_2">
          <PlaceholderRowRightM />
        </div>
      </div>
    {/each}

    <div
      style="padding: 0 20px;">
      <PlaceholderBottomM />
    </div>

  {/if}
  
</div>

<!-- ============
  COMPONENT STYLE
=================-->
<style>

  .yes {
    width: auto;
  }

  .yes_2 {
    width: auto;
  }

  #standings-table-container {
    /* display: grid; */
    padding: 20px;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
    /* overflow: hidden; */
    position: relative;
  }

  div.teams-row {
    padding: 10px 0;
  }

	#leagues-table-container-loader {
		min-width: 100%;
    padding: 20px;
    padding-bottom: 0;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
	}

	/* 
    MOBILE-EXCLUSIVE RESPONSIVNESS */
	@media only screen and (max-width: 725px) {
		/* ... REUIRED FOR SVELTE-CONTENT-LOADER ... */
		:global(svg) {
			/* width: 100% !important; */
		}

    #standings-table-container { 
      padding: 20px 0;
    }

    div.teams-row {
      padding: 10px 20px;
    }

	}

	@media only screen and (max-width: 768px) {
		:global(svg) {
			/* width: 100% !important; */
		}
	}

	/* WIDGET DARK THEME */
	.dark-background-1 #fixture-league-title,
	.dark-background-1 #fixture-visual-box,
	.dark-background-1 .best-players-box,
	.dark-background-1 #live-stream-box {
		box-shadow: inset 0px -1px 0px #616161 !important;
	}
</style>
