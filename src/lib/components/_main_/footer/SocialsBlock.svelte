<script lang="ts">
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import type { B_H_SFOOTD_Social_Network } from "@betarena/scores-lib/types/_HASURA_.js";
  import { onMount } from "svelte";
  import Discord from "./assets/icon_redisign/discord.svelte";
  import Linkedin from "./assets/icon_redisign/linkedin.svelte";
  import Medium from "./assets/icon_redisign/medium.svelte";
  import Telegram from "./assets/icon_redisign/telegram.svelte";
  import X from "./assets/icon_redisign/x.svelte";
  import Github from "./assets/icon_redisign/github.svelte";

  /**
   * @description
   *  📣 Component `Type`.
   */
  type IDynamicAssetMap =
    | "begambleawareorg"
    | "logoFull"
    | "legal18icon"
    | "discord"
    | "linkedin"
    | "medium"
    | "telegram"
    | "x"
    | "github";

  export let translation;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    CNAME = "global⮕footer⮕w⮕main-socials",
    /**
     * @description
     *  📣 Dynamic import variable condition
     */
    useDynamicImport: boolean = true,
    /**
     * @description
     *  📣 Target social media order.
     */
    socialNetworkOrder: B_H_SFOOTD_Social_Network[] = [
      "x",
      "telegram",
      "discord",
      "medium",
      "linkedin",
      "github",
    ];

  let /**
     * @description
     *  📣 Holds target `component(s)` of dynamic nature.
     */
    dynamicAssetMap = new Map<IDynamicAssetMap, any>();

  onMount(async () => {
    if (useDynamicImport) {
      dynamicAssetMap.set("discord", Discord);
      dynamicAssetMap.set("linkedin", Linkedin);
      dynamicAssetMap.set("medium", Medium);
      dynamicAssetMap.set("telegram", Telegram);
      dynamicAssetMap.set("x", X);
      dynamicAssetMap.set("github", Github);

      dynamicAssetMap = dynamicAssetMap;
    }

    return;
  });
</script>

<div class="follow-block">
    <span class="follow-text">
      <TranslationText
        key={`${CNAME}/unknown`}
        text={translation.terms.follow}
        fallback={"Follow us"}
      />
    </span>
  <div class="socials-wrapper">
    {#each socialNetworkOrder as key}
      <a
        class="social-icon"
        rel="external"
        target="_blank"
        aria-label="{key}"
        href={translation.links.social_networks[key]}
      >
        <svelte:component this={dynamicAssetMap.get(key)} />
      </a>
    {/each}
  </div>
</div>

<style lang="scss">
  .follow-block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .follow-text {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      color: var(--text-color-second-dark);
    }

    .socials-wrapper {
      display: flex;
      gap: 8px;

      .social-icon {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        border: var(--border);
        transition: all 0.3s ease-in-out;

        &:hover {
          border: 1px solid var(--primary);
          --icon-color: var(--text-color);
        }
      }
    }
  }
</style>
