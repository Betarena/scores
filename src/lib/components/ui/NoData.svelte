<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

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


export let title = "No information is available at the moment!";
export let text = "The lack of data may be due to no information available at the moment, an error, or the widget is still under development for this section.";

// #endregion ➤ 📌 VARIABLES

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

<div class="no-data-wrapper">
  <div class="no-data-title">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <g clip-path="url(#clip0_1_11749)">
        <path d="M13.2 5.65353C14.1178 5.4387 15.0574 5.33131 16 5.33353C25.3333 5.33353 30.6667 16.0002 30.6667 16.0002C29.8573 17.5143 28.8921 18.9398 27.7867 20.2535M18.8267 18.8269C18.4605 19.2199 18.0189 19.5351 17.5282 19.7537C17.0375 19.9723 16.5079 20.0899 15.9708 20.0994C15.4337 20.1088 14.9002 20.01 14.4022 19.8089C13.9041 19.6077 13.4516 19.3082 13.0718 18.9284C12.692 18.5486 12.3925 18.0961 12.1914 17.598C11.9902 17.1 11.8914 16.5665 11.9009 16.0294C11.9103 15.4923 12.0279 14.9627 12.2465 14.472C12.4651 13.9813 12.7803 13.5397 13.1733 13.1735M23.92 23.9202C21.6408 25.6575 18.8655 26.62 16 26.6669C6.66668 26.6669 1.33334 16.0002 1.33334 16.0002C2.99186 12.9094 5.29219 10.209 8.08001 8.0802L23.92 23.9202Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.33334 1.3335L30.6667 30.6668" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1_11749">
          <rect width="32" height="32" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <div class="text">
      {title}
    </div>
  </div>
  <p class="content">{text}</p>
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
  .no-data-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: auto;
    padding: 20px;
    color: var(--component-colors-utility-gray-utility-gray-400, #8C8C8C);
    .no-data-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 16px;
      .text {
        color: var(--text-text-primary, #292929);
        /* nav/14px */
        font-family: Roboto;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 21px */
      }
    }

    .content {
      text-align: center;
      color: var(--component-colors-utility-gray-utility-gray-400, #8C8C8C);
      /* body/14px */
      font-family: Roboto;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 21px */
    }
  }
  :global(.dark-mode .no-data-wrapper .content) {
    color: var(--semi-black-night, #A8A8A8) !important;
  }
</style>