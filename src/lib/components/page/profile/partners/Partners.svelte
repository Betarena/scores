<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { json } from '@sveltejs/kit';
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
  import { onMount } from "svelte";
  import PartnerCard from "./PartnerCard.svelte";
  import { get } from "$lib/api/utils.js";
  import userSettings from "$lib/store/user-settings.js";
  import type { PartnersPartnerRegistrationSubmissionsMain, PartnersPartnersListMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";

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
  let loading = false;
  let partners: PartnersPartnersListMain[] = [];
  let submissions: Map<PartnersPartnerRegistrationSubmissionsMain['id'], PartnersPartnerRegistrationSubmissionsMain> = new Map();
  $: ({ profile } = $page.data.RESPONSE_PROFILE_DATA);
  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(async () => {
    loading = true;
    try {
      const { geoJs, user } = userSettings.extractAll();
      const [res, res2] = await Promise.all([
        get<{ partners: PartnersPartnersListMain[]}>(
          `/api/data/partners?geo=${geoJs.country_code}`
        ),
        get<{partners_submissions: PartnersPartnerRegistrationSubmissionsMain[]}>(
          `/api/data/partners.submissions?uid=${user?.firebase_user_data?.uid}`
        ),
      ]);
      partners = res?.partners || [];
      res2?.partners_submissions.forEach(submission => {
        submissions.set(submission.partner_id, submission);
      });
      submissions = new Map(submissions)
      loading = false;
    } catch (e) {
      loading = false;
    }
  });
  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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

<div id="partners-section" class="partners-wrapper">
  <h2>{profile.earn_with_partners || "Earn BTA with our partners (NT)"}</h2>

  <div class="content">
    <div class="description">
      <span class="description-title"
        >{profile.how_to_earn || "How to Earn (NT)"}</span
      >
      <p class="description-text">
        {profile.earn_description ||
          "Earn BTA tokens by registering, depositing, and betting on our partner platforms. Register through the provided links to be eligible for rewards.(NT)"}
      </p>
    </div>
    <div class="partners-sections">
      {#each partners as partner}

        <PartnerCard {partner} bind:submissions/>
      {/each}
    </div>
  </div>

  <div class="requirements">
    <div>{profile.requirements || `Requirements*`}</div>
    <div>
      {profile.requirements_descr ||
        `To receive the BTA, you need to register with at least one of our partners using our links, make a minimum deposit of $10, and place at least one bet. Once these requirements are met, you can claim the BTA. (NT)`}
    </div>
  </div>
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
  .partners-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;

    h2 {
      color: var(--colors-text-text-primary-900, #fff);
      margin: 0;
      /* Text xl/Semibold */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-xl, 20px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--line-height-text-xl, 30px); /* 150% */
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .description {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xxs, 2px);
      align-self: stretch;

      .description-title {
        color: var(--colors-text-text-secondary-700);

        /* Text sm/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      .description-text {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);

        /* Text md/Regular */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-md, 16px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--Line-height-text-md, 24px); /* 150% */
      }
    }

    .requirements {
      color: var(--colors-text-text-primary-900, #fff);
      display: flex;
      flex-direction: column;
      gap: 10px;

      /* Text xs/Medium */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-xs, 12px);
      font-style: normal;
      font-weight: 500;
      line-height: var(--line-height-text-xs, 18px); /* 150% */
    }
  }
</style>
