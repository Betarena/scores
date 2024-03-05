<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ High Order Component Overview                                                    │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Version Svelte Format :|: V.8.0 [locked]                                       │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

	import sessionStore from '$lib/store/session.js';

	import ModalBackdrop from './Modal-Backdrop.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'global⮕w⮕email-subscribe-modal⮕main'
  ;

  $: ({ currentActiveModal } = $sessionStore)

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

{#if currentActiveModal == 'Footer_Newsletter_Modal'}

  <ModalBackdrop
    on:closeModal=
    {
      () =>
      {
        $sessionStore.currentActiveModal = null;
        return;
      }
    }
  />

	<div
    id={CNAME}
  >

    <!--
    ▓ NOTE:
    ▓ > close icon
    -->
		<img
			id="close-vector"
			class="cursor-pointer"
			src="/assets/svg/close.svg"
			alt="close-svg"
      width=20
      height=20
			on:click=
      {
        () =>
        {
          $sessionStore.currentActiveModal = null;
          return;
        }
      }
		/>

		<!--
    ▓ NOTE:
    ▓ > email iframe
    -->
		{#if $sessionStore.serverLang == 'es'}
			<iframe
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/e2e80a33-947e-11ec-9a6f-bab7bbd1e44a"
			/>
		{:else if $sessionStore.serverLang == 'it'}
			<iframe
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/f6daf19c-947f-11ec-9a6f-bab7bbd1e44a"
			/>
		{:else if $sessionStore.serverLang == 'br'}
      <iframe
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/6a180301-9480-11ec-9a6f-bab7bbd1e44a"
			/>
		{:else if $sessionStore.serverLang == 'pt'}
			<iframe
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/ae8bbec3-9480-11ec-9a6f-bab7bbd1e44a"
			/>
    {:else}
			<iframe
				id="iframe-email-form"
				title="email-betarena-form"
				src="https://cdn.forms-content.sg-form.com/959f35f0-8a5e-11ec-ae12-6ab0b90e93b0"
			/>
		{/if}
	</div>

{/if}

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

	div#global⮕w⮕email-subscribe-modal⮕main
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

    img#close-vector
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
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media screen
  and (min-width: 475px)
  {
		div#global⮕w⮕email-subscribe-modal⮕main
    {
      /* 🎨 style */
			width: 465px !important;
			max-width: none;

      iframe
      {
        /* 🎨 style */
        width: 465px !important;
        max-width: none;
      }
		}
	}

</style>
