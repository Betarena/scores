<!-- ===================
	COMPONENT JS - BASIC 
    [TypeScript Written]
=================== -->
<script lang="ts">
  import { page } from "$app/stores";
  import type { Cache_Single_Lang_Header_Translation_Response } from "$lib/models/navbar/types";

  export let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;

  let show: boolean = true;
</script>

<!-- ===================
	COMPONENT HTML
=================== -->

{#if HEADER_TRANSLATION_DATA != undefined}
  <!-- [ℹ] identify the correct translation via IF 
  -->
  {#if HEADER_TRANSLATION_DATA.scores_top_bar_messages.status && show}
    <!-- [ℹ] 
    -->
    <div 
        id="platform-alert-container">
      <!-- [ℹ] 
      -->
      <p 
        class="s-12 color-white">
        {HEADER_TRANSLATION_DATA.scores_top_bar_messages.message}
      </p>
        <!-- [ℹ] close-cross
        -->
        <img 
          id='close-platform-alert-img'
          src="/assets/svg/alert/close.svg" 
          alt="close-vector" 
          width="14px" height="14px"
          on:click={() => show = false} 
        />
    </div>
  {/if}
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
