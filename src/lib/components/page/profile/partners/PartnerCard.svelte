<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📌 VARIABLES

  import Badge from "$lib/components/ui/Badge.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { modalStore } from "$lib/store/modal.js";
  import type {
    PartnersPartnerRegistrationSubmissionsMain,
    PartnersPartnersListMain,
  } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import RegistrationModal from "./RegistrationModal.svelte";
  import { page } from "$app/stores";

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
  export let submissions: Map<
    PartnersPartnerRegistrationSubmissionsMain["id"],
    PartnersPartnerRegistrationSubmissionsMain
  > = new Map();

  $: ({ status } = submissions.get(partner.id) || {});
  $: ({ profile } = $page.data.RESPONSE_PROFILE_DATA);
  // #endregion ➤ 📌 VARIABLES

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

  function showModal() {
    $modalStore.modal = true;
    $modalStore.component = RegistrationModal;
    $modalStore.show = true;
    $modalStore.props = { partner, updateSubmissions };
  }

  function updateSubmissions(
    submission: PartnersPartnerRegistrationSubmissionsMain
  ) {
    if (submissions.has(submission.partner_id)) {
      submissions.delete(submission.partner_id);
    }
    submissions.set(submission.partner_id, submission);
    submissions = new Map(submissions);
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

<div class="partner-wrapper">
  <div class="info">
    <img class="logo" src={partner.data?.image} />
    <div class="text-wrapper">
      <div class="name-row">
        <span class="name">{partner.name}</span>
        {#if status === "pending"}
          <Badge color="orange" size="sm"
            >{profile.pending || "Pending (NT)"}</Badge
          >
        {:else if status === "approved"}
          <Badge color="success" size="sm"
            >{profile.approved || "Approved (NT)"}</Badge
          >
        {:else if status === "failed"}
          <Badge color="error" size="sm"
            >{profile.failed || "Failed (NT)"}</Badge
          >
        {/if}
      </div>
      <div class="description">{partner.data?.bonus_description}</div>
    </div>
  </div>
  {#if !status}
    <Button full={true} type="primary" size="md" on:click={showModal}
      >{profile.get_100_bta_free || "GET 100 BTA FREE!"}</Button
    >
  {:else}
    <Button full={true} disabled={true}>
      {#if status === "pending"}
        {profile.pending_review || "PENDING REVIEW (NT)"}
      {:else if status === "approved"}
        {profile["100_bta_received"] || "100 BTA RECEIVED (NT)"}
      {:else if status === "failed"}
        {profile.unaffiliated || "UNAFFILIATED (NT)"}
      {/if}
    </Button>
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
  .partner-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-block: 16px;
    border-top: 1px solid var(--colors-border-border-secondary, #3b3b3b);

    &:first-of-type {
      border-top: none;
      padding-top: var(--spacing-lg, 12px);
    }
    &:last-of-type {
      padding-bottom: var(--spacing-lg, 12px);
    }

    .info {
      display: flex;
      height: 65px;
      padding: 16px 0px;
      align-items: center;
      gap: 16px;
      align-self: stretch;

      .logo {
        display: flex;
        width: 52px;
        height: 52px;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        border-radius: var(--radius-md, 8px);
        border: 1px solid var(--colors-border-border-secondary, #3b3b3b);

        /* Shadows/shadow-xs */
        box-shadow: 0px 1px 2px 0px
          var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
      }

      .text-wrapper {
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
        gap: 2px;
        flex: 1 0 0;
        flex-wrap: wrap;

        .name-row {
          display: flex;
          gap: 2px;

          .name {
            width: 205px;
            color: var(--colors-text-text-primary-900, #fff);

            /* Text md/Semibold */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-md, 16px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-text-md, 24px); /* 150% */
          }
        }
        .description {
          display: -webkit-box;
          width: 198px;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          color: var(--colors-text-text-tertiary-600, #8c8c8c);
          text-overflow: ellipsis;

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }
  }
</style>
