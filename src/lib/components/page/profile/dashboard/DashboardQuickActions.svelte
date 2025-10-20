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
  import DepositIcon from "$lib/components/ui/assets/DepositIcon.svelte";
  import PencilLineIcon from "$lib/components/ui/assets/PencilLineIcon.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import userSettings from "$lib/store/user-settings";
  import { showDepositModal } from "../deposit/showDeposit";

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
  $: ({ lang } = $userSettings);
  $: actions = [
    { icon: DepositIcon, id: "deposit", label: "Add Funds" },
    {
      icon: PencilLineIcon,
      id: "publish",
      label: "Publish Article",
      href: `/u/author/article/create/${lang}`,
    },
    // {
    //   icon: CreditCardUpload,
    //   id: "withdraw",
    //   label: "Withdraw",
    //   href: `/u/withdraw/${lang}`,
    // },
    // { icon: InviteFriends, id: "friends", label: "Invite Friends" },
  ];

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

  function click(id: string) {
    switch (id) {
      case "deposit":
        showDepositModal();
        break;
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

<div id="dashboard-quick-actions">
  <div class="title">Actions</div>
  <div class="actions">
    {#each actions as action}
      <Button
        type="secondary"
        href={action.href}
        on:click={() => click(action.id)}
      >
        <div class="action">
          <svelte:component this={action.icon} />
          <span class="action-label">
            {action.label}
          </span>
        </div>
      </Button>
    {/each}
  </div>
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
  #dashboard-quick-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex-shrink: 1;
    width: 100%;
    min-width: 0;
    align-self: stretch;

    .title {
      color: var(--colors-text-text-secondary-700, #fbfbfb);

      /* Text lg/Semibold */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-lg, 18px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--line-height-text-lg, 28px); /* 155.556% */
    }
    .actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg, 12px);
      width: 100%;
      min-width: 0;

      :global(.button) {
        height: 101px;
        min-width: 0;
      }
      .action {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-sm, 6px);
        flex: 1 1 0;
        min-width: 0;
        align-self: stretch;

        .label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        :global(svg) {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
</style>
