<script lang="ts">
  import { post } from "$lib/api/utils";
  import CircleBg from "$lib/components/shared/backround-patterns/CircleBG.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import LoaderBadge from "$lib/components/ui/loaders/LoaderBadge.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import userSettings from "$lib/store/user-settings";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import type { AuthorsTagsMain } from "@betarena/scores-lib/types/v8/_HASURA-0";
  import { onMount } from "svelte";
  import IconTopics from "../icons/IconTopics.svelte";
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
  $: ({ user: { scores_user_data } = { scores_user_data: {} } } =
    $userSettings);
  let tags: AuthorsTagsMain[] = [];
  let loading = false;

  $: selectedTopics = scores_user_data?.following?.tags || [];

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

  function toggleTopic(topic: number) {
    const follow = !selectedTopics.includes(topic);
    userBetarenaSettings.updateData([
      ["user-following", { target: "tags", id: topic, follow }],
    ]);
  }

  async function fetchSuggestedTags() {
    loading = true;
    const res = await post<{
      data: { tags: AuthorsTagsMain[] };
    }>("/api/data/tags.recommendations", {
      user: scores_user_data,
      country: scores_user_data?.country || $loginStore.country,
    });
    loading = false;
    if (!res?.data?.tags) return;
    tags = res?.data.tags || [];
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    fetchSuggestedTags();
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

<div class="topics-step">
  <div class="logo-wrapper">
    <div class="bg"><CircleBg /></div>
    <div class="icon-wrapper">
      <IconTopics />
    </div>
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>Follow Topics</h2>
        <p class="subtitle">Follow at least 3 topics</p>
      </div>
      <div class="form-body">
        <div class="topics-grid">
          {#if loading}
                {#each Array(20) as _item}
                <LoaderBadge width={58 + Math.floor(Math.random() * (120 - 58 + 1))} />
              {/each}
          {:else}
             {#each tags as tag}
               <Badge
                 size="lg"
                 color={selectedTopics.includes(tag.id) ? "brand" : "gray"}
                 active={false}
                 on:click={() => toggleTopic(tag.id)}
               >
                 {tag.name}
               </Badge>
             {/each}
          {/if}
        </div>
        <Button
          full={true}
          size="lg"
          disabled={selectedTopics.length < 3}
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
  .topics-step {
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

        .topics-grid {
          display: flex;
          padding: 10px 0;
          align-items: center;
          align-content: center;
          gap: 10px;
          align-self: stretch;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
