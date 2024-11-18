<!--===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  import { page } from "$app/stores";
  import Plus from "$lib/components/ui/assets/plus.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import session from "$lib/store/session.js";
  import userSettings from "$lib/store/user-settings.js";

  import type { IProfileTrs } from "@betarena/scores-lib/types/types.profile.js";
  import PublicationCard from "./PublicationCard.svelte";
  import { onMount } from "svelte";
  import { get } from "$lib/api/utils.js";
  import type { AuthorsAuthorsMain } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import PublicationCardLoader from "./PublicationCardLoader.svelte";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  let profileTrs = {} as IProfileTrs["sportstack"] & IProfileTrs["sportstack2"],
    noWidgetData: boolean = false;
  let sportstacks: AuthorsAuthorsMain[] = [];
  let loading = false;
  let currentPage = 0;
  let limitOfArticles = 5;
  let totalPages = 0;
  let node;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  $: if ($page.data.RESPONSE_PROFILE_DATA) {
    profileTrs = {
      ...$page.data.RESPONSE_PROFILE_DATA.sportstack,
      ...$page.data.RESPONSE_PROFILE_DATA.sportstack2,
    };
  }

  $: showLoadButton = currentPage < totalPages - 1;
  $: if (
    sportstacks.length &&
    $userSettings.user?.firebase_user_data &&
    !$userSettings.user.firebase_user_data.highlights?.sportstack
  ) {
    const firstSporsttack = sportstacks.at(-1);
    userSettings.updateData([
      ["user-highlighted-sportstack", firstSporsttack?.id],
    ]);
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🛠️ METHODS
  function handleScroll() {
    if ($session.viewportType === "desktop" || !node || !showLoadButton) return;
    const rect = node.getBoundingClientRect();
    if (window.scrollY > rect.bottom - 20) {
      loadMore()
    }
  }

  function loadMore() {
    currentPage++;
    getSportstacks();
  }

  async function getSportstacks() {
    const uid = userSettings.extract("uid");
    loading = true;
    const res = await get<{
      sportstacks: AuthorsAuthorsMain[];
      count: number;
    }>(
      `/api/data/author/sportstack?user=${uid}&limit=${limitOfArticles}&offset=${
        limitOfArticles * currentPage
      }`
    );
    loading = false;
    if (res?.sportstacks) {
      sportstacks = [...sportstacks, ...res.sportstacks].sort((a, b) => {
        return (
          new Date(b.data?.creation_date) - new Date(a.data?.creation_date)
        );
      });
      totalPages = Math.floor(res.count / limitOfArticles);
    }
  }
  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  onMount(async () => {
    getSportstacks();
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
  AUTHOR WIDGET
-->
<svelte:window on:scroll={handleScroll} />
{#if !noWidgetData}
  <div id="account-author-widget-box" class={$session.viewportType}>
    <!--
    WIDGET TITLE
    -->
    <div class="header">
      <div class="title">
        <h2>
          {profileTrs?.publications || "Publications"}
        </h2>

        <div class="description">
          {profileTrs?.publications_description ||
            "Lorem ipsum dolor sit amet consectetur. Turpis sed et proin commodo."}
        </div>
      </div>
      <a href="/u/author/create/{$userSettings.lang}">
        <Button full={$session.viewportType === "mobile"}>
          <div class="button-text">
            <Plus />
            {profileTrs?.new_publication || "New Publication"}
          </div>
        </Button>
      </a>
    </div>

    <div class="publications-wrapper" bind:this={node}>
      {#each sportstacks as s (s.id)}
        <PublicationCard
          sportstack={s.data}
          owner={s.uid}
          permalink={s.permalink}
        />
      {/each}
      {#if loading}
        {#each Array(limitOfArticles) as _}
          <PublicationCardLoader />
        {/each}
      {/if}
    </div>
    {#if showLoadButton && $session.viewportType === "desktop"}
      <div class="load-more">
        <Button type="outline" on:click={loadMore}
          >{profileTrs?.view_more || "View more"}</Button
        >
      </div>
    {/if}
  </div>
{/if}

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style lang="scss">
  /*
  profile [settings] widget
  */
  div#account-author-widget-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2xl, 20px);
    align-self: stretch;
    height: 100%;

    .header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xl, 16px);
      align-self: stretch;
      .title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs, 4px);
        align-self: stretch;

        h2 {
          color: var(--colors-text-text-primary-900, #fbfbfb);
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-display-xs, 24px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--Line-height-display-xs, 32px);
          margin: 0;
        }
        .description {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text md/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
      }

      a {
        width: 100%;
      }
      .button-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-sm, 6px);
        align-self: stretch;

        /* Text md/Medium */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-md, 16px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--Line-height-text-md, 24px); /* 150% */

        :global(svg) {
          width: 20px;
          height: 20px;
        }
      }
    }

    .publications-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xl, 16px);
      flex: 1 0 0;
      align-self: stretch;
    }

    .load-more {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-sm, 6px);
      align-self: stretch;
    }

    &.tablet,
    &.desktop {
      .header {
        flex-direction: row;
        gap: 10px;
        align-items: center;
        justify-content: space-between;

        a {
          width: max-content;
        }
      }
      .publications-wrapper {
        gap: var(--spacing-3xl, 24px);
      }
    }

    &.desktop {
      gap: 24px;
      padding: 20px;
      .header {
        h2 {
          font-size: var(--Font-size-text-xl, 20px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--Line-height-text-xl, 30px); /* 150% */
        }
      }
    }
  }
</style>
