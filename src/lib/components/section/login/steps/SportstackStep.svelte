<script lang="ts">
  import { post } from "$lib/api/utils";
  import CircleBg from "$lib/components/shared/backround-patterns/CircleBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import SportsTackList from "$lib/components/ui/composed/sportstack_list/SportsTackList.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import userSettings from "$lib/store/user-settings";
  import type { IPageAuthorTranslationDataFinal } from "@betarena/scores-lib/types/v8/segment.authors.tags";
  import { onMount } from "svelte";
  import { loginStore } from "../login-store";

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

  let sportstacks: Map<string, IPageAuthorTranslationDataFinal> = new Map();
  let loading = false;
  $: ({ user: { scores_user_data } = { scores_user_data: {} } } =
    $userSettings);
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
  // #endregion ➤ 🛠️ METHODS

  async function fetchSuggestedSportstacks() {
    loading = true;
    const res = await post<{
      data: { authors: IPageAuthorTranslationDataFinal[] };
    }>("/api/data/authors.recommendations", {
      user: scores_user_data,
      country: scores_user_data?.country || $loginStore.country,
    });
    if (res?.data?.authors)
      sportstacks = new Map(
        res?.data.authors.map((author) => [author.id, author])
      );
    loading = false;
  }
  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    fetchSuggestedSportstacks();
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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

<div class="sportstack-step">
  <div class="logo-wrapper">
    <div class="bg"><CircleBg /></div>
    <div class="icon-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="29"
        height="28"
        viewBox="0 0 29 28"
        fill="none"
      >
        <path
          d="M14.5 18.0833H9.25001C7.62185 18.0833 6.80777 18.0833 6.14534 18.2843C4.65387 18.7367 3.48672 19.9039 3.03429 21.3953C2.83334 22.0578 2.83334 22.8718 2.83334 24.5M22.6667 24.5V17.5M19.1667 21H26.1667M17.4167 8.75C17.4167 11.6495 15.0662 14 12.1667 14C9.26718 14 6.91668 11.6495 6.91668 8.75C6.91668 5.8505 9.26718 3.5 12.1667 3.5C15.0662 3.5 17.4167 5.8505 17.4167 8.75Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>Follow Sportstacks</h2>
        <p class="subtitle">Follow at least 3 publications</p>
      </div>
      <div class="form-body">
        <SportsTackList {sportstacks} {loading} limit={5} />
        <Button
          full={true}
          size="lg"
          disabled={(scores_user_data?.subscriptions?.sportstacks?.length ||
            0) < 3}
          on:click={() => {
            $loginStore.currentStep += 1;
          }}>Continue</Button
        >
      </div>
    </div>
  </Container>
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
  .sportstack-step {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    position: relative;
    padding: var(--spacing-6xl, 48px) 0;
    gap: var(--spacing-4xl, 32px);

    .logo-wrapper {
      display: flex;
      justify-content: center;
      height: max-content;
      position: relative;
      .bg {
        position: absolute;
        z-index: -1;
        right: 50%;
        top: 50%;
        transform: translate(50%, -50%);
      }
      .icon-wrapper {
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

        :global(.list-wrapper) {
          padding-block: 0;
        }
        :global(.list-item) {
          padding-inline: 0;
        }
      }
    }
  }
</style>
