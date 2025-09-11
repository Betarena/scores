<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import session from "$lib/store/session";
  import userSettings from "$lib/store/user-settings";
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
  import Button from "../ui/Button.svelte";
  import FeaturedIcon from "../ui/FeaturedIcon.svelte";
  import PredictionMetric from "./PredictionMetric.svelte";
  import WidgetIcon from "./WidgetIcon.svelte";

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

  export let probabilities = {
    home: { coefficient: "2.50", probability: "40%" },
    draw: { coefficient: "3.20", probability: "35%" },
    away: { coefficient: "3.00", probability: "25%" },
  };

  $: ({ user } = $userSettings);
  $: ({ viewportType } = $session);
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

  function signIn() {
    $session.currentActiveModal = "Auth_Modal";
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

<div class="card-wrapper disabled {viewportType}" class:disabled={!user}>
  <div class="header">
    <WidgetIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
      >
        <path
          d="M7.7496 -0.00012207C8.42463 3.60002 11.3497 6.52514 14.9499 7.20016C11.3497 7.87519 8.42463 10.8003 7.7496 14.4004C7.07457 10.8003 4.14946 7.87519 0.549316 7.20016C4.14946 6.52514 7.07457 3.60002 7.7496 -0.00012207Z"
          fill="currentColor"
        />
        <path
          d="M15.8506 3.60034C16.2106 5.40041 17.6506 6.84047 19.4507 7.20048C17.6506 7.5605 16.2106 9.00056 15.8506 10.8006C15.4906 9.00056 14.0505 7.5605 12.2504 7.20048C14.0505 6.84047 15.4906 5.40041 15.8506 3.60034Z"
          fill="currentColor"
        />
        <path
          d="M2.34939 14.4001C2.52939 15.3001 3.24942 16.0201 4.14946 16.2002C3.24942 16.3802 2.52939 17.1002 2.34939 18.0002C2.16938 17.1002 1.44935 16.3802 0.549316 16.2002C1.44935 16.0201 2.16938 15.3001 2.34939 14.4001Z"
          fill="currentColor"
        />
      </svg>
    </WidgetIcon>
    <div class="title">AI Prediction</div>
    <div class="market">1X2 Market</div>
  </div>
  <div class="body-wrapper">
    <div class="content-wrapper">
      <div class="markets">
        {#each Object.entries(probabilities) as [team, { coefficient, probability }]}
          <PredictionMetric
            type={team === "draw" ? "green" : "normal"}
            number={team === "home" ? 1 : team === "draw" ? "X" : 2}
            {coefficient}
            {probability}
          />
        {/each}
      </div>
      <div class="logo-text">
        <div class="name">AI Suggestion Analysis</div>
        <div class="description">
          Based on recent performances and head-to-head records, a draw is the
          most likely outcome. Both teams have shown strong defensive
          capabilities, and key offensive players are currently out with
          injuries, limiting their scoring potential.
        </div>
      </div>
    </div>
    <div class="ads-widget">Here will be ads integration</div>
  </div>

  {#if !user}
    <div class="disabled-overlay">
      <div class="header-preview">
        <WidgetIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M7.7496 -0.00012207C8.42463 3.60002 11.3497 6.52514 14.9499 7.20016C11.3497 7.87519 8.42463 10.8003 7.7496 14.4004C7.07457 10.8003 4.14946 7.87519 0.549316 7.20016C4.14946 6.52514 7.07457 3.60002 7.7496 -0.00012207Z"
              fill="currentColor"
            />
            <path
              d="M15.8506 3.60034C16.2106 5.40041 17.6506 6.84047 19.4507 7.20048C17.6506 7.5605 16.2106 9.00056 15.8506 10.8006C15.4906 9.00056 14.0505 7.5605 12.2504 7.20048C14.0505 6.84047 15.4906 5.40041 15.8506 3.60034Z"
              fill="currentColor"
            />
            <path
              d="M2.34939 14.4001C2.52939 15.3001 3.24942 16.0201 4.14946 16.2002C3.24942 16.3802 2.52939 17.1002 2.34939 18.0002C2.16938 17.1002 1.44935 16.3802 0.549316 16.2002C1.44935 16.0201 2.16938 15.3001 2.34939 14.4001Z"
              fill="currentColor"
            />
          </svg>
        </WidgetIcon>
        <div class="title">AI Prediction</div>
        <div class="lock-screen">
          <div class="lock-screen-header">
            <div class="heading-icon">
              <FeaturedIcon type="gray">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <path
                    d="M17.5 10V8C17.5 5.23858 15.2614 3 12.5 3C9.73858 3 7.5 5.23858 7.5 8V10M12.5 14.5V16.5M9.3 21H15.7C17.3802 21 18.2202 21 18.862 20.673C19.4265 20.3854 19.8854 19.9265 20.173 19.362C20.5 18.7202 20.5 17.8802 20.5 16.2V14.8C20.5 13.1198 20.5 12.2798 20.173 11.638C19.8854 11.0735 19.4265 10.6146 18.862 10.327C18.2202 10 17.3802 10 15.7 10H9.3C7.61984 10 6.77976 10 6.13803 10.327C5.57354 10.6146 5.1146 11.0735 4.82698 11.638C4.5 12.2798 4.5 13.1198 4.5 14.8V16.2C4.5 17.8802 4.5 18.7202 4.82698 19.362C5.1146 19.9265 5.57354 20.3854 6.13803 20.673C6.77976 21 7.61984 21 9.3 21Z"
                    stroke="var(--component colors-components-icons-featured icons-featured-icon-light-fg-gray)"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </FeaturedIcon>
              <div class="heading">
                Register to unlock the AI betting suggestion
              </div>
            </div>
          </div>
          <div class="footer">
            <Button on:click={signIn} full={true}>Register now</Button>
          </div>
        </div>
      </div>
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
  .card-wrapper {
    position: relative;
    margin-inline: auto;
    display: flex;
    width: 100%;
    padding: var(--spacing-3xl, 24px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    border-radius: var(--radius-xl, 12px);
    border: 1px solid var(--colors-border-border-secondary, #3b3b3b);
    background: var(--colors-background-bg-primary_alt, #232323);
    border-radius: 12px;

    .header,
    .header-preview {
      display: flex;
      height: 40px;
      align-items: flex-start;
      gap: var(--spacing-lg, 12px);
      align-self: stretch;

      .title {
        display: flex;
        height: 40px;
        flex-direction: column;
        justify-content: center;
        flex: 1 0 0;

        /* Text lg/Semibold */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-lg, 18px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--Line-height-text-lg, 28px); /* 155.556% */

        background: var(
          --Gradient-Linear-70,
          linear-gradient(135deg, #f49062 0%, #fd371f 100%)
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .market {
        display: flex;
        width: 72px;
        height: 40px;
        flex-direction: column;
        justify-content: center;

        color: var(--colors-text-text-tertiary-600, #8c8c8c);

        /* Text sm/Regular */
        font-family: var(--Font-family-font-family-body, Roboto);
        font-size: var(--Font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
      }
    }
    .body-wrapper {
      width: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      .content-wrapper {
        width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
        .markets {
          display: flex;
          height: 90px;
          padding-right: 1px;
          justify-content: center;
          align-items: flex-start;
          gap: var(--spacing-lg, 12px);
          align-self: stretch;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-lg, 12px);
          align-self: stretch;

          .name {
            align-self: stretch;
            color: var(--colors-text-text-primary-900, #fff);

            /* Text lg/Semibold */
            font-family: var(--Font-family-font-family-body, Roboto);
            font-size: var(--Font-size-text-lg, 18px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--Line-height-text-lg, 28px); /* 155.556% */
          }
          .description {
            align-self: stretch;
            color: var(--colors-text-text-primary-900, #fff);

            /* Text md/Regular */
            font-family: var(--Font-family-font-family-body, Roboto);
            font-size: var(--Font-size-text-md, 16px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--Line-height-text-md, 24px); /* 150% */
          }
        }
      }
      .ads-widget {
        display: none;
      }
    }

    &.disabled {
      > :not(.disabled-overlay):not(.header-preview) {
        filter: blur(5.5px);
      }
      .header-preview .market {
        filter: blur(5.5px);
      }
      .disabled-overlay {
        padding: var(--spacing-3xl, 24px);
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(
          --component-colors-alpha-alpha-white-60,
          rgba(12, 14, 18, 0.6)
        );
        border-radius: var(--radius-xl, 12px);
        z-index: 1;

        .lock-screen {
          position: absolute;
          display: flex;
          width: 313px;
          height: 240px;
          flex-direction: column;
          align-items: flex-start;
          flex-shrink: 0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: var(--radius-2xl, 16px);
          border: 1px solid var(--colors-border-border-secondary_alt, #3b3b3b);
          background: var(
            --component-colors-alpha-alpha-white-70,
            rgba(12, 14, 18, 0.7)
          );

          .lock-screen-header {
            display: flex;
            padding: var(--spacing-3xl, 24px) var(--spacing-3xl, 24px) 0
              var(--spacing-3xl, 24px);
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-3xl, 24px);
            align-self: stretch;
            .heading-icon {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: var(--spacing-xl, 16px);
              align-self: stretch;

              .heading {
                color: var(--colors-text-text-brand-secondary-700, #d2d2d2);
                text-align: center;

                /* Text xl/Semibold */
                font-family: var(--font-family-font-family-body, Roboto);
                font-size: var(--font-size-text-xl, 20px);
                font-style: normal;
                font-weight: 600;
                line-height: var(--line-height-text-xl, 30px); /* 150% */
              }
            }
          }

          .footer {
            display: flex;
            padding: var(--spacing-3xl, 24px);
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-3xl, 24px);
            align-self: stretch;
          }
        }
      }
    }

    &.desktop {
      .body-wrapper {
        flex-direction: row;
        gap: 13px;
        .ads-widget {
          border-radius: var(--radius-xl, 12px);
          border: 2px solid var(--colors-vorder-border-disabled, #525252);
          background: var(--colors-background-bg-secondary, #232323);

          /* Shadows/shadow-xs */
          box-shadow: 0 1px 2px 0
            var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
          width: 268px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
