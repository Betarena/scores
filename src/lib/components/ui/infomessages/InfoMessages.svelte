<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { infoMessages } from "./infomessages.js";
  import checkCircle from "./check-circle.svg";
  import alertCircle from "./alert-circle.svg";
  import awardsIcon from "./awards.svg";
  import { fly, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import XClose from "./x-close.svelte";
  import session from "$lib/store/session.js";

  const iconsMap = {
    success: checkCircle,
    error: alertCircle,
    awards: awardsIcon,
  };
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

<div id="info-message" class="info-message-wrapper {$session.viewportType}">
  {#each $infoMessages as item, index (item.id)}
    <div
      class="info-message"
      class:loading={item.type === "loading"}
      in:fly={{ x: 200 }}
      out:fly={{ x: 200 }}
      animate:flip={{ duration: 500 }}
    >
      {#if ["success", "error", "awards"].includes(item.type)}
        <div
          class="body {item.type} {$session.viewportType}"
          on:click={() => infoMessages.remove(item.id)}
          style="z-index: {1000 + $infoMessages.length - index}"
        >
          <div class="header">
            <div class="icon">
              <div
                class="inner {item.type}"
                in:scale={{ delay: 800, duration: 1000 }}
              />
              <div
                class="outer {item.type}"
                in:scale={{ delay: 950, duration: 1000 }}
              />
              <img
                id=""
                src={iconsMap[item.type]}
                alt=""
                title=""
                loading="lazy"
              />
            </div>
            <i class="x-close">
              <XClose />
            </i>
          </div>
          <div class="text-wrapper">
            <span class="title">{item.title}</span>
            {#if item.text}
               <span class="text">{item.text}</span>
            {/if}
          </div>
        </div>
      {:else if item.type === "loading"}
        <div class="body">
          <div class="saving-animation">
            {item.title || "Loading"}<span class="dot">.</span><span class="dot"
              >.</span
            ><span class="dot">.</span>
          </div>
        </div>
      {/if}
    </div>
  {/each}
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
  .info-message-wrapper {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    gap: 10px;

    .info-message {
      position: relative;
      display: flex;
      height: fit-content;
      width: 375px;
      max-width: 90vw;
      cursor: pointer;

      .body {
        display: flex;
        flex-direction: column;
        padding: var(--spacing-xl, 16px);
        align-items: flex-start;
        gap: var(--spacing-xl, 16px);
        align-self: stretch;
        pointer-events: all;
        width: 100%;
        z-index: 1;

        border-radius: var(--radius-xl, 12px);
        border: 1px solid var(--colors-border-border-primary, #6a6a6a);
        background: var(--colors-background-bg-primary_alt, #313131);

        /* Shadows/shadow-lg */
        box-shadow: 0px 12px 16px -4px var(--colors-effects-shadows-shadow-lg_01, rgba(31, 31, 31, 0.08)),
          0px 4px 6px -2px var(--colors-effects-shadows-shadow-lg_02, rgba(31, 31, 31, 0.03));

        .header {
          display: flex;
          justify-content: space-between;
          width: 100%;

          .icon {
            position: relative;
            width: 20px;
            height: 20px;

            .inner,
            .outer {
              position: absolute;
              border-radius: 50%;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);

              &.success {
                border: 2px solid
                  var(--colors-foreground-fg-success-primary, #17b26a);
              }
              &.error {
                border: 2px solid
                  var(--colors-foreground-fg-error-primary, #ff3c3c);
              }
              &.awards {
                border: 2px solid
                  var(--colors-foreground-fg-brand-primary-600, #f5a524);
              }
            }
            .inner {
              opacity: 0.3;
              width: 28px;
              height: 28px;
            }

            .outer {
              width: 38px;
              height: 38px;
              opacity: 0.1;
            }
          }

          .x-close {
            :global(path) {
              stroke: var(--colors-foreground-fg-quinary-400) !important;
            }
          }
        }
        .text-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs, 4px);
        }
        .title {
          color: var(--colors-foreground-fg-primary-900, #fff);

          /* Text sm/Semibold */
          font-family: var(--font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
        .text {
          color: var(--colors-foreground-fg-secondary-700, #525252);

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }

      &.loading {
        background: inherit;

        .body {
          display: flex;
          height: 44px;
          padding: 10px var(--spacing-xl, 16px);
          justify-content: center;
          align-items: center;
          gap: var(--spacing-sm, 6px);
          align-self: stretch;

          border-radius: var(--radius-md, 8px);
          border: 1px solid var(--colors-border-border-disabled_subtle, #3b3b3b);
          background: var(--colors-background-bg-disabled, #3b3b3b);

          /* Shadows/shadow-xs */
          box-shadow: 0px 1px 2px 0px
            var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
        }
      }
    }

    .saving-animation {
      color: var(--colors-foreground-fg-disabled, #727171);

      /* Text md/Medium */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-md, 16px);
      font-style: normal;
      font-weight: 500;
      line-height: var(--line-height-text-md, 24px); /* 150% */
    }

    .dot {
      animation: blink 1.4s infinite both;
    }

    .dot:nth-child(1) {
      animation-delay: 0s;
    }

    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes blink {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 1;
      }
    }

    &.mobile {
      right: 50%;
      transform: translateX(50%);
    }
  }
</style>
