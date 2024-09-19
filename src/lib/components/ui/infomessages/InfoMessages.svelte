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
  import close from "./x-close.svg";
  import { fly, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
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

<div id="info-message" class="info-message-wrapper">
  {#each $infoMessages as item, index (item.id)}
    <div
      class="info-message"
      class:loading={item.type === "loading"}
      in:fly={{ x: 200 }}
      out:fly={{ x: 200 }}
      animate:flip={{ duration: 500 }}
    >
      {#if ["success", "error"].includes(item.type)}
        <div
          class="body"
          style="z-index: {1000 + $infoMessages.length - index}"
        >
          <div class="header" on:click={() => infoMessages.remove(item.id)}>
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
                src={item.type === "success" ? checkCircle : alertCircle}
                alt=""
                title=""
                loading="lazy"
              />
            </div>
            <img id="" src={close} alt="" title="" loading="lazy" />
          </div>
          <span class="text">{item.text}</span>
        </div>
      {:else if item.type === "loading"}
        <div class="body">
          <div class="saving-animation">
            Saving<span class="dot">.</span><span class="dot">.</span><span
              class="dot">.</span
            >
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
    top: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    pointer-events: none;

    .info-message {
      margin-top: -70px;
      display: flex;
      width: 375px;
      padding: var(--spacing-8xl, 80px) var(--spacing-md, 8px)
        var(--spacing-xl, 16px) var(--spacing-md, 8px);
      flex-direction: column;
      pointer-events: none;
      align-items: flex-start;

      background: linear-gradient(
        357deg,
        rgba(0, 0, 0, 0.1) 2.75%,
        rgba(0, 0, 0, 0) 92.77%
      );

      .body {
        display: flex;
        flex-direction: column;
        padding: var(--spacing-xl, 16px);
        align-items: flex-start;
        gap: var(--spacing-xl, 16px);
        align-self: stretch;
        pointer-events: all;

        border-radius: var(--radius-xl, 12px);
        border: 1px solid var(--Colors-Border-border-primary, #6a6a6a);
        background: var(--Colors-Background-bg-primary_alt, #313131);

        /* Shadows/shadow-lg */
        box-shadow: 0px 12px 16px -4px var(--Colors-Effects-Shadows-shadow-lg_01, rgba(255, 255, 255, 0)),
          0px 4px 6px -2px var(--Colors-Effects-Shadows-shadow-lg_02, rgba(255, 255, 255, 0));

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
                  var(--Colors-Foreground-fg-success-primary, #17b26a);
              }
              &.error {
                border: 2px solid
                  var(--Colors-Foreground-fg-error-primary, #ff3c3c);
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
        }

        .text {
          color: var(--colors-foreground-fg-primary-900, #fff);

          /* Text sm/Semibold */
          font-family: var(--font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 600;
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
          border: 1px solid var(--Colors-Border-border-disabled_subtle, #3b3b3b);
          background: var(--Colors-Background-bg-disabled, #3b3b3b);

          /* Shadows/shadow-xs */
          box-shadow: 0px 1px 2px 0px
            var(--Colors-Effects-Shadows-shadow-xs, rgba(255, 255, 255, 0));
        }
      }
    }

    .saving-animation {
      color: var(--Colors-Foreground-fg-disabled, #727171);

      /* Text md/Medium */
      font-family: var(--Font-family-font-family-body, Roboto);
      font-size: var(--Font-size-text-md, 16px);
      font-style: normal;
      font-weight: 500;
      line-height: var(--Line-height-text-md, 24px); /* 150% */
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
  }
</style>
