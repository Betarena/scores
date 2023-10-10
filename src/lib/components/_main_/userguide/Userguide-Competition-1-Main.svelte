<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import { userUpdateUserguideOptOut } from '$lib/firebase/common.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlogv2 } from '$lib/utils/debug.js';

	import type { B_USRG_D } from '@betarena/scores-lib/types/types.misc.userguide.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. export const / let [..]                                       ◼️
  // ### 2. const [..]                                                    ◼️
  // ### 3. let [..]                                                      ◼️
  // ### 4. $: [..]                                                       ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	export let
    B_USRG_D: B_USRG_D
  ;

  const
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'global⮕w⮕userguide⮕comp-1⮕main'
  ;

  let
    noWidgetData: unknown = false,
    showModal: boolean = false
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'methods' that are to be     ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. function (..)                                                 ◼️
  // ### 2. async function (..)                                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📌 Toggle `user` opt-out.
   * @returns { void }
   */
  function toggleUserguideOptOut
  (
  ): void
  {
    if ($userBetarenaSettings.user != null)
    {
      userUpdateUserguideOptOut
      (
        $userBetarenaSettings.user.firebase_user_data.uid,
        1
      );
    }

    userBetarenaSettings.updateUserGuideOpt
    (
      1
    );

    $sessionStore.showUseguide1 = false;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### WARNING:                                                         ◼️
  // ### ❗️ Can go out of control.                                        ◼️
  // ### (a.k.a cause infinite loops and/or cause bottlenecks).           ◼️
  // ### Please keep very close attention to these methods and            ◼️
  // ### use them carefully.                                              ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  $: if_R_0_1 =
    $userBetarenaSettings?.userguide_id_opt_out.includes(B_USRG_D.id)
    || $userBetarenaSettings?.user?.scores_user_data?.userguide_id_opt_out?.includes(B_USRG_D.id)
  ;
  $: if (!if_R_0_1)
  {
    // ### [🐞]
    dlogv2
    (
      `🚏 checkpoint [R] ➤ USRGUIDE if_R_0_1`,
      [
        '📝 INFO: Action click detected! Processing logic...',
        '❗️ WARNING: Non re-occuring logic, (once per load), should not be seen again until action trigger taken.'
      ],
      true
    );

    setUserShowGuide1();

    /**
     * @description
     *  TODO: DOC:
     */
    function setUserShowGuide1
    (
    ): void
    {
      $sessionStore.showUseguide1 = true;
    }
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    () =>
    {
      setTimeout
      (
        () =>
        {
          showModal = true;
        },
        1500
      );
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class=styles                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
MAIN WIDGET COMPONENT
-->
{#if showModal && $sessionStore?.showUseguide1}

  <!--
  BACKGROUND BLUR
  -->
  <div
    id='background-modal-blur'
    in:fade
    on:click={() => $sessionStore.showUseguide1 = false}
  />

  <div
    id="{CNAME}"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    in:fly={{ x: 200, duration: 250 }}
    out:fly={{ x: 200, duration: 250 }}
  >

    <div
      id="{CNAME}⮕inner"
    >

      <!--
      USERGUIDE ➤ CLOSE ICON
      -->
      <img
        id='close-vector'
        class='cursor-pointer'
        src='/assets/svg/close.svg'
        alt='close-svg'
        on:click={() => $sessionStore.showUseguide1 = false}
      />

      <!--
      USERGUIDE ➤ TITLE
      -->
      <div
        id="{CNAME}⮕title"
        class=
        "
        m-b-35
        "
      >
        {@html B_USRG_D.content.title1}
        {@html B_USRG_D.content.title2}
      </div>

      <!--
      USERGUIDE ➤ DESCRIPTION
      -->
      <div
        id="{CNAME}⮕description"
        class=
        "
        global s-20
        "
      >
        {@html B_USRG_D.content.description}
      </div>

      <!--
      USERGUIDE ➤ VIDEO
      -->
      <iframe
        src="https://www.youtube.com/embed/watch?v=lrmAAadPVQI?enablejsapi=1"
        frameborder="0"
        class=
        "
        m-t-45
        m-b-50
        "
      />

      <!--
      USERGUIDE ➤ STEP-BY-STEP
      -->
      <div
        id="{CNAME}⮕step-by-step-box"
      >
        {#each (B_USRG_D?.content?.tutorial_steps ?? []) as step}

          <div
            class=
            "
            m-b-35
            "
          >
            {@html step.title ?? ''}
          </div>

          {#each (step?.steps ?? []) as [stepId, stepTxt]}

            <div
              class=
              "
              row-space-start
              m-b-8
              step-by-step-row
              "
            >

              <div
                class=
                "
                m-r-24
                text-center
                step-box
                "
              >
                <p
                  class=
                  "
                  s-16
                  color-black-2
                  "
                >
                  {stepId}
                </p>
              </div>

              <p
                class=
                "
                s-16
                color-black-2
                "
              >
                {stepTxt}
              </p>
            </div>

          {/each}

        {/each}
      </div>

      <!--
      USERGUIDE ➤ DIVIDER
      -->
      <div
        id="divider"
        class=
        "
        m-t-45
        m-b-50
        "
      />

      <!--
      USERGUIDE ➤ FOOTER DATA
      -->
      <div
        id="{CNAME}⮕footer"
        class=
        "
        global s-20
        "
      >
        {@html B_USRG_D.content.footer1}
        {@html B_USRG_D.content.footer2}
      </div>

    </div>

    <!--
    USERGUIDE ➤ DON'T SHOW ANYMORE
    -->
    <div
      id="{CNAME}⮕bottom"
      class=
      "
      row-space-start
      "
    >
      <input
        id=""
        type="checkbox"
        name=""
        class=
        "
        m-r-16
        v-1
        "
        on:click={() => toggleUserguideOptOut()}
      >
      <p
        class=
        "
        s-18
        color-black-2
        "
      >
        {B_USRG_D?.content?.extra?.do_not_show}
      </p>
    </div>

  </div>

{/if}

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>

  div#background-modal-blur
  {
    /* 📌 position */
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 4000;
    /* 🎨 style */
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	div#global⮕w⮕userguide⮕comp-1⮕main
  {
    /* 📌 position */
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    position: fixed;
    z-index: 100000;
    /* 🎨 style */
    background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px 12px 0 0;
    width: 100vw;
    overflow: hidden;
    padding: 24px;
    padding-bottom: 150px;
	}

	div#global⮕w⮕userguide⮕comp-1⮕main⮕inner
  {
    /* 🎨 style */
    display: grid;
    overflow-x: hidden;
    max-height: 100%;
    overflow-y: scroll;
    /* 💠 scrollbar */
    /* IE and Edge */ -ms-overflow-style: none !important;
		/* Firefox */ scrollbar-width: none !important;
  }
  div#global⮕w⮕userguide⮕comp-1⮕main⮕inner::-webkit-scrollbar
  {
		display: none !important;
  }

  div#global⮕w⮕userguide⮕comp-1⮕main⮕scroll-box
  {
    /* 🎨 style */
    overflow-y: scroll;
  }

  :global(
    div#global⮕w⮕userguide⮕comp-1⮕main⮕title > h1
  )
  {
    /* 🎨 style */
    display: inline;
  }

	:global(
    div#global⮕w⮕userguide⮕comp-1⮕main h1,
    div#global⮕w⮕userguide⮕comp-1⮕main h2,
    div#global⮕w⮕userguide⮕comp-1⮕main h3
  )
  {
    /* 🎨 style */
		margin-top: 0;
	}

	:global(
    div#global⮕w⮕userguide⮕comp-1⮕main a
  )
  {
    /* 🎨 style */
		color: #f5620f !important;
		width: fit-content !important;
		margin: 0;
		display: initial;
	}

  :global(
    div#global⮕w⮕userguide⮕comp-1⮕main⮕footer > p
  )
  {
    /* 🎨 style */
    display: inline;
  }

  iframe
  {
    /* 🎨 style */
    width: 100%;
    height: 396px;
  }

  div#divider
  {
    /* 🎨 style */
    height: 1px;
    color: var(--grey-color);;
    background-color: var(--grey-color);
    border: none;
  }

  div.step-box
  {
    /* 🎨 style */
    padding: 4px 0;
    min-width: 32px;
    min-height: 32px;
    border-radius: 4px;
    background: var(--colors-gray-6, #F7F7F7);
  }

  div#global⮕w⮕userguide⮕comp-1⮕main⮕bottom
  {
    /* 📌 position */
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    /* 🎨 style */
    height: 84px;
    width: 100%;
    padding: 32px 48px;
    background: var(--white);
    box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.08);
  }

  img#close-vector
  {
    /* 📌 position */
		position: absolute;
		top: 20px;
		right: 20px;
		z-index: 400000002;
	}

	/*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

	@media only screen
  and (min-width: 767px)
  {
    div#global⮕w⮕userguide⮕comp-1⮕main
    {
      /* 📌 position */
      top: 0;
      bottom: 0;
      right: 0;
      left: unset;
      margin: unset;
      /* 🎨 style */
      width: 45vw;
      overflow: hidden;
      border-radius: 0;
      padding: 48px;
      padding-bottom: unset;
    }
  }

	/*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#global⮕w⮕userguide⮕comp-1⮕main.dark-background-1
  {
    /* 🎨 style */
		background-color: var(--dark-theme) !important;
  }

	:global(
    div#global⮕w⮕userguide⮕comp-1⮕main.dark-background-1 h1,
    div#global⮕w⮕userguide⮕comp-1⮕main.dark-background-1 h2,
    div#global⮕w⮕userguide⮕comp-1⮕main.dark-background-1 h3
  )
  {
    /* 🎨 style */
		color: var(--white);
	}

	:global(
    div#global⮕w⮕userguide⮕comp-1⮕main.dark-background-1 p
  )
  {
    /* 🎨 style */
		color: var(--white);
	}

  div#global⮕w⮕userguide⮕comp-1⮕main.dark-background-1 div.step-box
  {
    /* 🎨 style */
    padding: 4px 0;
    background: rgba(255, 255, 255, 0.08);
  }

  div#global⮕w⮕userguide⮕comp-1⮕main.dark-background-1 div#divider
  {
    /* 🎨 style */
    height: 1px;
    border: 0;
    background-color: var(--dark-theme-1) !important;
  }

  div#global⮕w⮕userguide⮕comp-1⮕main.dark-background-1 div#global⮕w⮕userguide⮕comp-1⮕main⮕bottom
  {
    /* 🎨 style */
    background: #1F1F1F;
    box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.12);
  }

</style>
