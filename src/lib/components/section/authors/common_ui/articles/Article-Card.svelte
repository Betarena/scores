<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
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

  import { page } from "$app/stores";

  import { timeAgo } from "$lib/utils/dates.js";
  import { mutateStringToPermalink } from "@betarena/scores-lib/dist/util/language.js";
  import { fade } from "svelte/transition";
  import { readingTime } from "../helpers.js";
  import defaultAvatar from "../profile-avatar.svg";

  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";

  import { modalStore } from "$lib/store/modal.js";
  import { getOptimizedImageUrl } from "$lib/utils/image.js";
  import type {
    IPageAuthorArticleData,
    IPageAuthorAuthorData,
    IPageAuthorTagData,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";
  import { BetarenaUserHelper } from "$lib/firebase/common.js";
  import Trophy from "$lib/components/ui/assets/trophy.svelte";
  import type { BtaRewardTiersMain } from "@betarena/scores-lib/types/v8/_HASURA-1_.js";
  import type { IFirebaseFunctionArticleAccessCheck } from "@betarena/scores-lib/types/firebase/functions.js";
  import { get } from "$lib/api/utils.js";
  import { gotoSW } from "$lib/utils/sveltekitWrapper.js";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags.js";
  import type { SvelteComponent } from "svelte";

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

  interface IArticle extends IPageAuthorArticleData {
    author: IPageAuthorAuthorData;
    tags_data: IPageAuthorTagData[];
  }

  export let /**
     * @augments IArticle
     */
    article: IArticle,
    /**
     * @description tablet view
     */
    tablet = false,
    /**
     * @description mobile view
     */
    mobile = false,
    /**
     * @description awards tier info for reward gated articles
     */
    award_tier_info: null | BtaRewardTiersMain = null,
    /**
     * @description check user access
     */
    article_access:
      | null
      | IFirebaseFunctionArticleAccessCheck["response"]["success"]["data"] =
      null,
    TipsModal: SvelteComponent;

  $: translations = ($page.data?.translations ||
    {}) as IPageAuthorTranslationDataFinal;

  $: ({
    permalink,
    access_type,
    reward_tier_id,
    published_date,
    data,
    seo_details,
    author,
    id,
    authors__article_reward_unlocks_snapshot__article_id__nested
  } = article);

  $: ({ total_reward_unlocks = 0 } = (authors__article_reward_unlocks_snapshot__article_id__nested?.[0] || {}))
  $: ({ avatar, username } = author.data || {
    username: "unknow",
    avatar: defaultAvatar,
  });
  $: ({ firebase_user_data } = $userSettings.user || {});
  $: ({ images = [] } = seo_details?.opengraph || {});
  $: ({ title = "", content = "", featured_image } = data || {});
  $: date = timeAgo(published_date, translations.time_ago);
  $: timeToRead = content && readingTime(content);
  $: img = images[0]?.url || featured_image;

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

  $: if (img && !decodeURI(img).startsWith('https://img.betarena.com')) {
    img = getOptimizedImageUrl({ strImageUrl: img });
  }

  $: if (firebase_user_data?.uid && access_type === "reward_gated" && id) {
    getRewardsAccessInfo(firebase_user_data.uid, id);
  }

  $: if (access_type === "reward_gated" && reward_tier_id && !award_tier_info) {
    getRewardsTier(reward_tier_id);
  }

  $: if(access_type === "reward_gated" && !article_access?.hasAccess) {
    import('./TipsModal.svelte').then((res) => {
      TipsModal = res.default;
    } )
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

   function sendTip() {
    if (article_access?.hasAccess) return;
    if (!firebase_user_data?.uid) {
      gotoSW(`/login`);
    }

    modalStore.set({
      modal: true,
      component: TipsModal,
      show: true,
      props: {
        sportstack: author,
        article_id: id,
        article_access: article_access || {},
      },
    });
  }

  async function getRewardsAccessInfo(uid: string, article_id: number) {
    const res = await BetarenaUserHelper.pingArticleAccessCheck({
      query: {},
      body: {
        strUid: uid,
        intArticleId: article_id,
      },
    });
    const access = res.success ? res.success.data : null;
    if (access) {
      article_access = access;
    }
  }
  async function getRewardsTier(tier_id: number) {
    const res = await get<{ rewards_tiers: BtaRewardTiersMain[] }>(
      `/api/data/rewards_tiers?id=${tier_id}`
    );
    if (res) {
      const { rewards_tiers } = res;
      award_tier_info = rewards_tiers[0];
    }
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

<div class="card-wrapper" class:mobile class:tablet in:fade={{ duration: 500 }}>
  <div class="card-content">
    <a
      href={`/a/sportstack/${mutateStringToPermalink(username)}`}
      class="author-wrapper"
    >
      <SportstackAvatar src={avatar} size={!mobile ? "md" : "sm"} />
      <div class="author-info">
        <div class="author-name">{username}</div>
        <div class="publication-date">
          {#if timeToRead}
            {timeToRead}
            <TranslationText
              key={"uknown"}
              text={translations?.readingTime?.reading_time}
              fallback={"mins"}
            />
            -
          {/if}
          {date}
        </div>
      </div>
    </a>
    <a href="/a/{permalink}">
      <div class="title">
        {title}
      </div>
    </a>

    {#if access_type === "reward_gated" && award_tier_info}
      <div class="tips-wrapper" on:click={sendTip}>
        <div class="tip-info" class:access={article_access?.hasAccess}>
          <Trophy />
          <span class="tips-count">{total_reward_unlocks}</span>
        </div>
        <div class="tip-amount">
          {((award_tier_info?.usd_value || 1) / $session.btaUsdRate).toFixed(2)}
          BTA
        </div>
      </div>
    {/if}
  </div>
  {#if img}
    <a href="/a/{permalink}" class="preview" class:tablet class:mobile>
      <img
        src={img}
        alt={images[0]?.alt || title}
        srcset=""
      />
    </a>
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
  .card-wrapper {
    display: flex;
    max-width: 100%;
    width: 824px;
    gap: 56px;
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
    justify-content: space-between;
    background: var(--colors-background-bg-secondary);
    align-items: start;

    a {
      color: var(--text-color);
      transition: all;
      transition-duration: 0.5s;

      &:hover {
        color: var(--primary);
      }
    }

    .preview {
      border-radius: 8px;
      flex-shrink: 0;
      width: 240px;
      height: 154px;

      img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-grow: 1;
      width: 455px;
      max-width: 100%;
      height: 100%;
      min-height: 100%;

      overflow: hidden;

      .author-wrapper {
        &:hover {
          .author-name {
            color: var(--primary);
          }
        }
      }

      .tags-wrapper {
        max-width: 100%;
        justify-self: flex-end;
        --text-button-size: var(--text-size-s);
        --gradient-color-rgb: var(--bg-color-second-rgb-consts);
        margin-top: 4px;
        .tag {
          flex-shrink: 0;
        }

        &.expanded {
          flex-wrap: wrap;
        }
      }

      .title {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        height: max-content;
        font-family: Inter;
        font-size: var(--font-size-text-xl, 20px);
        font-style: normal;
        font-weight: 600;
        line-height: 28px;
      }

      .author {
        &-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        &-info {
          display: flex;
          flex-direction: column;
          color: var(--text-color-second, #ccc);

          .publication-date {
            color: var(--colors-text-text-tertiary-600, #8c8c8c);
            /* Text xs/Regular */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-xs, 12px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--line-height-text-xs, 18px); /* 150% */
          }
        }

        &-name {
          color: var(--colors-text-text-primary-900, #fbfbfb);

          /* Text sm/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          &:hover {
            color: var(--primary);
          }
        }
      }

      .tips-wrapper {
        display: flex;
        align-items: center;
        gap: var(--spacing-none, 0);
        color: var(--colors-text-text-tertiary-600, #8c8c8c);
        cursor: pointer;

        &:hover {
          color: var(--colors-foreground-fg-brand-primary-600, #f5620f);
        }
        .tip-info {
          display: flex;
          width: 47px;
          align-items: center;
          gap: var(--spacing-xs, 4px);

          .tips-count {
            /* Text xs/Medium */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-xs, 12px);
            font-style: normal;
            font-weight: 500;
            line-height: var(--line-height-text-xs, 18px); /* 150% */
            transform: translateY(1px);
          }
          &.access {
            color: var(--colors-foreground-fg-brand-primary-600, #f5620f);
          }
        }
        .tip-amount {
          display: flex;
          width: auto;
          padding-inline: 3px;
          height: 20px;
          flex-direction: column;
          justify-content: center;
          flex-shrink: 0;

          background: var(--colors-background-bg-disabled, #3b3b3b);

          color: var(--colors-foreground-fg-brand-primary-600, #f5620f);
          text-align: center;

          /* Text xs/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-xs, 12px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-xs, 18px); /* 150% */
        }
      }
    }

    &.tablet {
      max-width: 100%;
      width: 100%;

      .title {
        -webkit-line-clamp: 3;
        height: 84px;
      }
    }

    &.mobile {
      flex-direction: row-reverse;
      background: var(--colors-background-bg-primary);
      gap: 16px;
      border-radius: 0;
      padding: 20px 16px;
      padding-right: 0px;

      .card-content {
        padding: 0;
        gap: 12px;

        .title {
          padding-right: 16px;
          -webkit-line-clamp: 3;
          height: 72px;
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-md, 24px);
        }
        .author-wrapper {
          padding-right: 16px;
        }

        .author-name {
          line-height: 18px;
        }

        .tags-wrapper {
          margin-top: 0;
        }
      }

      .preview {
        width: 112px;
        height: 150px;
      }
    }
  }
</style>
