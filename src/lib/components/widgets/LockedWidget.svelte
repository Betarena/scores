<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/api/utils";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";
  import type { IFirebaseFunctionArticleAccessCheck } from "@betarena/scores-lib/types/firebase/functions.js";
  import type { TranslationAwardsDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import type { BtaRewardTiersMain } from "@betarena/scores-lib/types/v8/_HASURA-1_.js";
  import type { IPageAuthorAuthorData } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { tick } from "svelte";
  import TranslationText from "../misc/Translation-Text.svelte";
  import Button from "../ui/Button.svelte";
  import FeaturedIcon from "../ui/FeaturedIcon.svelte";
  import LoaderLine from "../ui/loaders/LoaderLine.svelte";

  export let sportstack = {} as IPageAuthorAuthorData;
  export let article_access =
    {} as IFirebaseFunctionArticleAccessCheck["response"]["success"]["data"];
  export let article_id = 0;
  export let grantAccess = () => {};
  export let tier_id = 0;

  $: ({ awards_translations } = $page.data as {
    awards_translations: TranslationAwardsDataJSONSchema;
  });
  $: ({ user } = $userSettings);

  $: ({ viewportType } = $session);

  let TipsModalComponent;
  let TipsModalAnonComponent;
  let setClass = false;
  let award_tier_info: null | BtaRewardTiersMain = null;
  $: loadComponents(user?.firebase_user_data);
  $: getRewardTier(tier_id);
  async function loadComponents(user) {
    if (!user?.uid && !TipsModalAnonComponent) {
      const res = await import(
        "../section/authors/common_ui/articles/TipsModalAnon.svelte"
      );
      TipsModalAnonComponent = res.default;
      await tick();
      setClass = true;
      return;
    }
    if (user?.uid && !TipsModalComponent) {
      const res = await import(
        "../section/authors/common_ui/articles/TipsModal.svelte"
      );
      TipsModalComponent = res.default;
      await tick();
      setClass = true;
      return;
    }
  }

  async function getRewardTier(tier_id) {
    const res = await get<{ rewards_tiers: BtaRewardTiersMain[] }>(
      `/api/data/rewards_tiers?id=${tier_id}`
    );
    if (res) {
      const { rewards_tiers } = res;
      award_tier_info = rewards_tiers[0];
    }
  }
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

<div class="lock-widget-wrapper {viewportType}">
  <FeaturedIcon size="md" color="gray" type="modern"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M14.1663 8.33333V6.66667C14.1663 4.36548 12.3009 2.5 9.99967 2.5C7.69849 2.5 5.83301 4.36548 5.83301 6.66667V8.33333M9.99967 12.0833V13.75M7.33301 17.5H12.6663C14.0665 17.5 14.7665 17.5 15.3013 17.2275C15.7717 16.9878 16.1542 16.6054 16.3939 16.135C16.6663 15.6002 16.6663 14.9001 16.6663 13.5V12.3333C16.6663 10.9332 16.6663 10.2331 16.3939 9.69836C16.1542 9.22795 15.7717 8.8455 15.3013 8.60582C14.7665 8.33333 14.0665 8.33333 12.6663 8.33333H7.33301C5.93288 8.33333 5.23281 8.33333 4.69803 8.60582C4.22763 8.8455 3.84517 9.22795 3.60549 9.69836C3.33301 10.2331 3.33301 10.9332 3.33301 12.3333V13.5C3.33301 14.9001 3.33301 15.6002 3.60549 16.135C3.84517 16.6054 4.22763 16.9878 4.69803 17.2275C5.23281 17.5 5.93288 17.5 7.33301 17.5Z"
        stroke="var(--colors-foreground-fg-secondary-700)"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </FeaturedIcon>
  <div class="cta">
    <TranslationText
      text={awards_translations.locked_content}
      fallback="Locked content"
    />
  </div>
  <Button type="secondary-gray" size="sm">
    {#if award_tier_info}
      <TranslationText text={awards_translations.unlock} fallback="Unlock " /> ({(
        (award_tier_info.usd_value || 0) / $session.btaUsdRate
      ).toFixed(2)}
      BTA)
      {:else}
      <LoaderLine width={120}/>
    {/if}
  </Button>
  <div class="fade {viewportType}" />

  {#if !user?.firebase_user_data?.uid && TipsModalAnonComponent}
    <div class="locked-tips-modal-wrapper {viewportType}" class:pos={setClass}>
      <TipsModalAnonComponent
        type="unlock"
        {tier_id}
        {sportstack}
        {article_access}
      />
    </div>
  {:else if user?.firebase_user_data?.uid && TipsModalComponent}
    <div class="locked-tips-modal-wrapper {viewportType}" class:pos={setClass}>
      <TipsModalComponent
        type="unlock"
        {sportstack}
        {grantAccess}
        {article_id}
        {tier_id}
        {article_access}
      />
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
  .lock-widget-wrapper {
    display: flex;
    position: relative;
    width: 100%;
    padding: 16px;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    z-index: 1000;

    border-radius: var(--radius-xl, 12px);
    border: 1px solid var(--colors-border-border-secondary, #3b3b3b);
    background: var(--colors-background-bg-primary, #1f1f1f);

    /* Shadows/shadow-xs */
    box-shadow: 0 1px 2px 0
      var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));

    .cta {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: var(--spacing-none, 0);
      flex: 1 0 0;

      color: var(--colors-text-text-secondary-700, #fbfbfb);

      /* Text md/Semibold */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-md, 16px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--line-height-text-md, 24px); /* 150% */
    }

    &.mobile {
      z-index: 10000001;
    }
  }
  .fade {
    position: absolute;
    left: -5px;
    right: -5px;
    height: 120px;
    bottom: -2px;
    z-index: 2000;
    transform: translateY(100%);

    background: linear-gradient(
      180deg,
      transparent 20%,
      color-mix(
          in srgb,
          var(--colors-background-bg-secondary_alt, #1f1f1f) 80%,
          transparent
        )
        60%,
      var(--colors-background-bg-secondary_alt, #1f1f1f) 90%
    );
    &.mobile {
      background: linear-gradient(
        180deg,
        transparent 20%,
        var(--colors-background-bg-secondary_alt, #1f1f1f) 90%
      );
      height: 120px;
    }
  }
  .locked-tips-modal-wrapper {
    position: absolute;
    background: var(--colors-background-bg-secondary_alt, #1f1f1f);
    bottom: 0px;
    z-index: 3000;
    left: -5px;

    &.pos {
      width: calc(100% + 10px);
      transform: translateY(calc(100% + 120px));
      &.mobile {
        width: 100vw;
        left: calc(-50vw + 50%);
      }
      :global(.tips-modal-wrapper) {
        position: static;
      }
    }
  }
</style>
