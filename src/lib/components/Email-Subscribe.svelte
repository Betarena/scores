<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { fade } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';

  // #endregion ➤ 📦 Package Imports

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

{#if $sessionStore?.newsletterPopUpShow}

	<div
		id="background-modal-blur"
		on:click={() =>	($sessionStore.newsletterPopUpShow = false)}
		in:fade
	/>

	<div
    id="outer-iframe-cotnainer"
  >

    <!--
    CLOSE ICON
    -->
		<img
			id="close-vector"
			class="cursor-pointer"
			src="/assets/svg/close.svg"
			alt="close-svg"
      width=20
      height=20
			on:click={() => ($sessionStore.newsletterPopUpShow = false)}
		/>

		<!--
    EMAIL IFRAME LANGUAGE CONDITION
    -->
		{#if $sessionStore?.serverLang == 'en'}

			<iframe
				id="iframe-email-form"
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/959f35f0-8a5e-11ec-ae12-6ab0b90e93b0"
			/>

		{:else if $sessionStore?.serverLang == 'es'}

			<iframe
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/e2e80a33-947e-11ec-9a6f-bab7bbd1e44a"
			/>

		{:else if $sessionStore?.serverLang == 'it'}

			<iframe
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/f6daf19c-947f-11ec-9a6f-bab7bbd1e44a"
			/>

		{:else if $sessionStore?.serverLang == 'br'}

      <iframe
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/6a180301-9480-11ec-9a6f-bab7bbd1e44a"
			/>

		{:else if $sessionStore?.serverLang == 'pt'}

			<iframe
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/ae8bbec3-9480-11ec-9a6f-bab7bbd1e44a"
			/>

		{/if}

	</div>
  
{/if}

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

	div#background-modal-blur
  {
    /* 📌 position */
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 400000000;
    /* 🎨 style */
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	div#outer-iframe-cotnainer
  {
    /* 📌 position */
		position: fixed;
		right: 0;
		left: 0;
		margin: auto;
		top: 0;
		bottom: 0;
		z-index: 400000001;
    /* 🎨 style */
		width: 375px;
		max-width: 375px;
		height: 620px;
		overflow: hidden;
	}
	div#outer-iframe-cotnainer img#close-vector
  {
    /* 📌 position */
		position: absolute;
		top: 30px;
		right: 15px;
		z-index: 400000002;
	}

	iframe
  {
    /* 🎨 style */
		width: 375px;
		max-width: 375px;
		height: 620px;
		border: none;
		overflow: hidden;
	}

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

  @media screen
  and (min-width: 475px)
  {
		div#outer-iframe-cotnainer
    {
			width: 465px !important;
			max-width: none;
		}
		iframe
    {
			width: 465px !important;
			max-width: none;
		}
	}

</style>
