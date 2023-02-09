<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import arrow_down_fade from './assets/arrow-down-fade.svg';
	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';
	import logo_full from './assets/betarena-logo.svg';
	import icon_check from './assets/icon-check.svg';
	import profile_avatar from './assets/profile-avatar.svg';
	import light_icon_theme from './assets/theme-light-icon.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

	// export let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;
  
  const HEADER_TRANSLATION_DATA: string[] = ['EN', 'ES', 'SE', 'IT', 'PR', 'BR'] // TODO: needs to be data from DB
  const HEADER_THEME_OPT: string[] = ['Light', 'Dark'] // TODO: needs to be data from DB

	let dropdown_theme_visible: boolean = false;
  let dropdown_lang_visible:  boolean = false;
  let platform_lang: string = 'EN' // TODO: needs to be in accordance with user localStorage()

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * [ℹ] update the user selected lang `.localStorage()`
   * @param lang
  */
	function selectLanguage(lang: string) {
    userBetarenaSettings.setLang(lang);
  }

  /**
   * [ℹ] update the user selected theme `.localStorage()`
  */
	function selectedTheme(theme: string) {
		userBetarenaSettings.setTheme(theme);
	}

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES | IMPORTANT
  // ~~~~~~~~~~~~~~~~~~~~~

  const TABLET_VIEW = 1160
  const MOBILE_VIEW = 560
  let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		viewport_change()
		window.addEventListener('resize', function () {
		  viewport_change()
		});
  });

  function viewport_change() {
    var w = document.documentElement.clientWidth;
    tabletExclusive =
      w >= TABLET_VIEW
        ? false
        : true;
    mobileExclusive =
      w < MOBILE_VIEW
        ? true
        : false;
  }

</script>

<!-- ===============
COMPONENT HTML 
=================-->

<nav
  class="row-space-out">
  <!-- 
  [ℹ] first left container
  <-contents->
  [ℹ] logo image
  [ℹ] platform language select
  -->
  <div
    class="row-space-start">
    <img
      class="m-r-30"
      src={logo_full}
      alt="betarena-logo"
      title="Betarena Logo"
      width="142"
      height="30"
    />
    <!-- 
    [ℹ] language-change-dropdown-select 
    -->
    <div
      id="lang-container" 
      class="m-r-30">
      <!-- 
      [ℹ] INIT-selected-lang
      -->
      <div
        id="selected-language-btn"
        class="row-space-out"
        class:active-lang-select={dropdown_lang_visible == true}
        on:click={() => (dropdown_lang_visible = !dropdown_lang_visible)}>
        <p 
          class="
            color-white 
            s-14 
            mr-5
          ">
          {platform_lang.toUpperCase()}
        </p>
        <!-- 
        [ℹ] arrow down [hidden-menu] 
        -->
        <img
          src={!dropdown_lang_visible ? arrow_down : arrow_up}
          alt={!dropdown_lang_visible ? 'arrow down' : 'arrow up'}
          title={!dropdown_lang_visible ? 'arrow down' : 'arrow up'}
          width="16"
          height="16"
        />
      </div>
      <!-- 
      [ℹ] INITIALLY-HIDDEN drop-down menu 
      -->
      {#if dropdown_lang_visible}
        <div 
          id="dropdown-menu" 
          transition:fly>
          {#each HEADER_TRANSLATION_DATA.sort() as lang}
            {#if lang.toUpperCase() != platform_lang.toUpperCase()}
              <div 
                id="lang-select" 
                on:click={() => selectLanguage(lang)}>
                <p 
                  class="
                    color-white 
                    s-14
                  ">
                  {lang.toUpperCase()}
                </p>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <!-- 
  [ℹ] second left container
  <-contents->
  [ℹ] theme-options box
  [ℹ] user profile img
  -->
  <div
    class="row-space-end">
    <!-- 
    [ℹ] theme-options box
    -->
    {#if !tabletExclusive}
      <div
        id="theme-opt-container" 
        class="
          row-space-start
          dropdown-opt-box
          m-r-16
        "
        style="width: auto;">
        <!--
        [ℹ] name of the container-opt 
        -->
        <div
          class="m-r-10"
          on:click={() => (dropdown_theme_visible = !dropdown_theme_visible)}>
          <p 
            class="
              color-grey 
              s-12 
              m-b-5
            ">
            Theme
          </p>
          <div
            class="row-space-start">
            <img
              class="m-r-5"
              src={light_icon_theme}
              alt="{$userBetarenaSettings.theme} icon"
              title="{$userBetarenaSettings.theme} icon"
              width="16"
              height="16"
            />
            <p 
              class="
                color-white 
                s-14
              ">
              {$userBetarenaSettings.theme}
            </p>
          </div>
        </div>
        <!-- 
        [ℹ] arrow down [hidden-menu] 
        -->
        <img
          src={!dropdown_lang_visible ? arrow_down_fade : arrow_up}
          alt={!dropdown_lang_visible ? 'arrow down fade' : 'arrow up'}
          title={!dropdown_lang_visible ? 'arrow down' : 'arrow up'}
          width="16"
          height="16"
          on:click={() => (dropdown_theme_visible = !dropdown_theme_visible)}
        />
        <!-- 
        [ℹ] INIT-HIDDEN-dropdown-theme-select 
        -->
        {#if dropdown_theme_visible}
          <div 
            id="theme-dropdown-menu" 
            transition:fly>
            {#each HEADER_THEME_OPT as theme}
              <div
                class="
                  theme-opt-box 
                  row-space-out
                "
                on:click={() => selectedTheme(theme)}>
                <p 
                  class="
                    color-white 
                    s-14
                  ">
                  {theme}
                </p>
                {#if theme == $userBetarenaSettings.theme}
                  <img 
                    src={icon_check} 
                    alt={theme} 
                    width="16" 
                    height="16" 
                  />
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
    <!-- 
    [ℹ] profile picture
    -->
    <img 
      src={profile_avatar}
      alt='Profile Icon'
      title='Profile Icon'
      aria-label='Profile Icon'
    />
  </div>
</nav>

<!-- ===============
COMPONENT STYLE
=================-->

<style>

  nav {
    max-width: 1430px;
    width: inherit;
    padding: 23px 34px;
    height: 72px !important;
  }

</style>