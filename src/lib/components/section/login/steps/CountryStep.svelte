<script lang="ts">
  import { browser } from "$app/environment";
  import GridBg from "$lib/components/shared/backround-patterns/GridBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import session from "$lib/store/session";
  import userSettings from "$lib/store/user-settings";
  import { updateUserProfileData } from "$lib/utils/user";
  import IconGlobe from "../icons/IconGlobe.svelte";
  import { loginStore } from "../login-store";
  import LogoutText from "./LogoutText.svelte";

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
  $: ({ viewportType } = $session);
  $: country = Object.entries($loginStore.countries).map(([id, label]) => ({
    id,
    label
  })).sort((a, b) => a.label.localeCompare(b.label));
  $: ({translations} = $loginStore)
  
  let value: { id: number | string; label: string } | null = null;

  const COUNTRY_MAPPINGS = {
    // Spanish-speaking countries
    'spain': 'es', 'argentina': 'es', 'mexico': 'es', 'chile': 'es',
    'colombia': 'es', 'peru': 'es', 'venezuela': 'es', 'ecuador': 'es',
    'guatemala': 'es', 'cuba': 'es', 'bolivia': 'es', 'dominican republic': 'es',
    'honduras': 'es', 'paraguay': 'es', 'el salvador': 'es', 'nicaragua': 'es',
    'costa rica': 'es', 'panama': 'es', 'uruguay': 'es', 'equatorial guinea': 'es',
    // Brazilian
    'brazil': 'br',
    // Portuguese-speaking (excluding Brazil)
    'portugal': 'pt', 'angola': 'pt', 'mozambique': 'pt',
    'guinea-bissau': 'pt', 'cape verde': 'pt', 'sao tome and principe': 'pt',
    'timor-leste': 'pt',
    // Italian-speaking countries
    'italy': 'it', 'san marino': 'it', 'vatican city': 'it',
    // French-speaking countries
    'france': 'fr', 'canada': 'fr', 'belgium': 'fr',
    'senegal': 'fr', 'ivory coast': 'fr', 'mali': 'fr', 'burkina faso': 'fr',
    'niger': 'fr', 'madagascar': 'fr', 'cameroon': 'fr', 'haiti': 'fr',
    'monaco': 'fr', 'luxembourg': 'fr',
    // Swedish-speaking countries
    'sweden': 'se',
    // Romanian-speaking countries
    'romania': 'ro', 'moldova': 'ro',

    // 
  } as const

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  $: if (browser && country.length && !value && $userSettings.geoJs) {
    const user_location = $userSettings.geoJs.country;
    value = country.find(c => c.id === user_location) || null;
  }
    

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  async function saveCountrySelection() {
    try {
      const country = value?.id as string;
      if (!country) return;
      await updateUserProfileData({ country, lang: COUNTRY_MAPPINGS[country.toLowerCase()] || "en" });
      $loginStore.country = country as string;
      if (!$loginStore.verifiedSteps.includes("profile")) {
        $loginStore.verifiedSteps.push("profile");
      }
      $loginStore.currentStep += 1;
    } catch (error) {
      console.error("Failed to update country in profile:", error);
    }
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                  d       │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div class="country-step {viewportType}">
  <div class="logo-wrapper">
    <div class="bg"><GridBg size={viewportType === "desktop" ? "768" : "468"} /></div>
    <div class="icon-wrapper">
      <IconGlobe />
    </div>
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>{translations.select_country || "Select Country"}</h2>
        <p class="subtitle">{translations.where_are_you_from || "Where are you from?"}</p>
      </div>
      <div class="form-body">
        <DropDownInput searchable={true} bind:value label="Country" options={country} placeholder={translations.search_country || "Select your country"} infoText={translations.customise_feed || "Select your country to customise your feed"}>
          <span slot="icon" class="select-icon">
            <IconGlobe />
          </span>
        </DropDownInput>
        <Button
          full={true}
          disabled = {!value}
          size="lg"
          on:click={saveCountrySelection}>{translations.continue || "Continue"}</Button
        >
      </div>
    </div>
  </Container>
   {#if $loginStore.isExistedUser && !$loginStore.currentStep}
    <LogoutText />
  {/if}
</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">
  .country-step {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    position: relative;
    gap: var(--spacing-4xl, 32px);

    .logo-wrapper {
      display: flex;
      justify-content: center;
      height: max-content;
      position: relative;
      width: 100%;
      z-index: 0;
      .bg {
        position: absolute;
        z-index: 0;
        right: 50%;
        top: 50%;
        transform: translate(50%, -50%);
      }
      .icon-wrapper {
        z-index: 1;
        display: flex;
        width: 56px;
        height: 56px;
        padding: 14px;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1/1;
        border-radius: var(--spacing-lg, 12px);
        border: 1px solid var(--colors-border-border-primary, #525252);
        background: var(--colors-background-bg-primary, #1f1f1f);

        /* Shadows/shadow-xs-skeuomorphic */
        box-shadow: 0 0 0 1px
            var(
              --colors-effects-shadows-shadow-skeumorphic-inner-border,
              rgba(12, 14, 18, 0.18)
            )
            inset,
          0 -2px 0 0 var(
              --colors-effects-shadows-shadow-skeumorphic-inner,
              rgba(12, 14, 18, 0.05)
            ) inset,
          0 1px 2px 0
            var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
        color: var(--colors-foreground-fg-secondary-700);
        svg {
          width: 28px;
          height: 28px;
        }
      }
    }
    .form {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4xl, 32px);
      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md, 8px);
        justify-content: center;
        h2 {
          color: var(--colors-text-text-primary-900, #fff);
          text-align: center;
          margin: 0;

          /* Display xs/Semibold */
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-display-xs, 24px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-display-xs, 32px); /* 133.333% */
        }
        .subtitle {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);
          text-align: center;

          /* Text md/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
      }

      .form-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-4xl, 32px);
        align-self: stretch;

        .select-icon {
          color: var(--colors-foreground-fg-quaternary-400);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    &.desktop {
      .form {
        .header {
          gap: var(--spacing-lg, 12px);

          h2 {
            font-size: var(--font-size-display-sm, 30px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-sm, 38px); /* 126.667% */
          }
        }
      }
    }
     &.tablet {
      .form {
        max-width: 343px;
        margin: 0 auto;
      }
    }
  }
</style>
