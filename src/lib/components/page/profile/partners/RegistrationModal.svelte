<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { PartnersPartnerRegistrationSubmissionsMain } from './../../../../../../../scores-lib/types/v8/_HASURA-0.d.ts';
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
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import PaginationDots from "$lib/components/ui/PaginationDots.svelte";
  import { fly } from "svelte/transition";
  import Banner1 from "../assets/partner-banner/banner-registration-1.png";
  import Banner2 from "../assets/partner-banner/banner-registration-2.png";
  import { cubicIn, cubicOut } from "svelte/easing";
  import type {
    PartnersPartnerRegistrationSubmissionsMain,
    PartnersPartnersListMain,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import { onMount } from "svelte";
  import { post } from "$lib/api/utils.js";
  import userSettings from "$lib/store/user-settings.js";
  import { modalStore } from "$lib/store/modal.js";
  import { infoMessages } from "$lib/components/ui/infomessages/infomessages.js";

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

  export let partner: PartnersPartnersListMain;
  export let updateSubmissions: (
    submission: PartnersPartnerRegistrationSubmissionsMain
  ) => void;
  $: ({ profile } = $page.data.RESPONSE_PROFILE_DATA);
  let step = 1;
  let value = "";
  let loading = false;
  let inputError = false;
  let buttonDisabled = true;
  $: stepText = [
    {
      title: profile.first_step_register || "First Step: Register (NT)",
      link: profile.here || "here (NT)",
      subtitle:
        profile.after_register_next_step ||
        "After registering move to the next step (NT)",
    },
    {
      title:
        profile.second_step_fill_details ||
        "Second Step: Fill the details (NT)",
      subtitle:
        profile.add_username_or_email ||
        "Add the username or email used in the partners website (NT)",
    },
  ];

  $: text = stepText[step - 1];
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    window.Intercom("update", {
      hide_default_launcher: true,
    });
    return () => {
      window.Intercom("update", {
        hide_default_launcher: false,
      });
    };
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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

  async function submit() {
    try {
      loading = true;
      const { user } = userSettings.extractAll();
      const res = await post<{
        submission: PartnersPartnerRegistrationSubmissionsMain;
        ok: boolean;
      }>("/api/data/partners", {
        partner,
        input: value,
        wallet: user?.scores_user_data?.web3_wallet_addr,
      });
      if (res?.submission) {
        updateSubmissions(res.submission);
      }

        infoMessages.add({
          type: res?.ok ? "success" : "error",
          text: res?.ok ? profile?.success || "Success!" : profile?.error || "Error",
        });

      $modalStore.show = !res?.ok;
      loading = false;
    } catch (e) {
      loading = false;
    }
  }

  function onInputValidation(e) {
    const val = e.detail;
    if (val && `${val}`.length < 4) {
      buttonDisabled = true;
      inputError = true;
      return;
    }
    buttonDisabled = false;
    0;
    inputError = false;
  }

  // #endregion ➤ 🛠️ METHODS
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  class="registration-modal"
  in:fly={{ duration: 700, y: 600, easing: cubicOut }}
  out:fly={{ duration: 700, y: 600, easing: cubicIn }}
>
  <div class="image-wrapp">
    <div
      class="img"
      style="background: url({step === 1
        ? Banner1
        : Banner2}) lightgray 50% / cover no-repeat"
    />
  </div>
  <div class="header">
    <p class="title">
      {text.title}
      {#if text.link}
        <a target="_blank" href={partner.data?.register_link}>{text.link}</a>
      {/if}
    </p>
    <p class="step-description">
      {text.subtitle}
    </p>
  </div>
  <div class="pagination-wrapper">
    <PaginationDots count={2} active={step} />
  </div>
  {#if step === 1}
    <div class="buttons-wrapper">
      <Button full={true} type="secondary" on:click={() => (step = 2)}
        >{profile.skip || "Skip"}</Button
      >
      <Button full={true} type="primary" on:click={() => (step = 2)}
        >{profile.next || "Next"}</Button
      >
    </div>
  {:else}
    <div class="input-wrapper">
      <Input
        bind:value
        placeholder="Username or Email"
        on:input={onInputValidation}
        error={inputError}
      >
        <span slot="error">Minimum 4 chars</span>
      </Input>
      <Button
        full={true}
        type="primary"
        on:click={submit}
        disabled={!value || loading || buttonDisabled}
      >
        {#if loading}
          Loading...
        {:else}
          {profile.submit || "Submit"}
        {/if}
      </Button>
    </div>
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
  .registration-modal {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    z-index: 2147483004;

    border-radius: var(--radius-2xl, 16px) var(--radius-2xl, 16px)
      var(--radius-none, 0px) var(--radius-none, 0px);
    background: var(--colors-background-black-white, #000);
    /* shadows/shadow-xl */
    box-shadow: 0px 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(255, 255, 255, 0)),
      0px 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(255, 255, 255, 0)),
      0px 3px 3px -1.5px var(--colors-effects-shadows-shadow-xl_03, rgba(255, 255, 255, 0));

    .image-wrapp {
      display: flex;
      padding: var(--spacing-3xl, 24px) var(--spacing-3xl, 24px) 0px
        var(--spacing-3xl, 24px);
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2xl, 20px);
      align-self: stretch;
      overflow: hidden;
      height: calc(208px + var(--spacing-3xl, 24px));
      max-height: calc(208px + var(--spacing-3xl, 24px));

      img,
      .img {
        height: 208px;
        width: 100%;
        border-radius: var(--spacing-md, 8px);
      }
    }
    .header {
      display: flex;
      padding: var(--spacing-3xl, 24px) var(--spacing-3xl, 24px)
        var(--spacing-2xl, 20px) var(--spacing-3xl, 24px);
      flex-direction: column;
      align-items: center;
      align-self: stretch;

      .title {
        color: var(--colors-text-text-primary-900, #fff);
        text-align: center;
        margin: 0;
        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        width: 100%;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */

        a {
          display: inline;
          color: var(--colors-brand-500, #f5620f);
        }
      }

      .step-description {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);
        text-align: center;

        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      .pagination-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
    .buttons-wrapper {
      display: flex;
      padding: var(--spacing-4xl, 32px) var(--spacing-3xl, 24px)
        var(--spacing-3xl, 24px) var(--spacing-3xl, 24px);
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;
      width: 100%;
    }
    .input-wrapper {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-2xl, 20px) var(--spacing-3xl, 24px)
        var(--spacing-3xl, 24px) var(--spacing-3xl, 24px);
      align-items: flex-start;
      gap: var(--spacing-4xl, 32px);
      align-self: stretch;
    }
  }
</style>
