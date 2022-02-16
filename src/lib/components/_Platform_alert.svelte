<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->
<script lang="ts">
  import { page } from "$app/stores";
  import type { Header_Translation_Response } from "$lib/models/navbar/types";

  export let HEADER_TRANSLATION_DATA: Header_Translation_Response;

  // ... immediately update the data with the lang;
	let server_side_language: string = 'en';
	$: if ($page.params.lang === undefined) {
		server_side_language = 'en';
	} else {
		server_side_language = $page.params.lang;
	}

  // ...
  let show: boolean = true;
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if HEADER_TRANSLATION_DATA != undefined}
		<!-- ... identify the correct translation via IF -->
		{#each HEADER_TRANSLATION_DATA.scores_top_bar_messages_dev as lang_obj}
      {#if lang_obj.lang === server_side_language}
        <!-- ... -->
        {#if lang_obj.status && show}
          <!-- ... -->
          <div 
              id="platform-alert-container">
            <!-- ... -->
            <p 
              class="s-12 color-white">
              {lang_obj.message}
            </p>
              <!-- ... close-cross ... -->
              <img 
                id='close-platform-alert-img'
                src="./assets/svg/alert/close.svg" 
                alt="" 
                width="14px" height="14px"
                on:click={() => show = false} />
          </div>
        {/if}
      {/if}
  {/each}
{/if}

<!-- ===================
	COMPONENT STYLE
=================== -->
<style>
	#platform-alert-container {
		position: relative;
		width: 100%;
		padding: 8px 27px;
		background: #8C8C8C;
		text-align: center;
		z-index: 20000;
	}
  img#close-platform-alert-img {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
