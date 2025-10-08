<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import CreditCardUpload from "../assets/dashboard/CreditCardUpload.svelte";
  import DepositIcon from "../assets/dashboard/DepositIcon.svelte";
  import InviteFriends from "../assets/dashboard/InviteFriends.svelte";
  import PencilLineIcon from "../assets/dashboard/PencilLineIcon.svelte";

  const actions = [
    { icon: DepositIcon, id: "deposit", label: "Add Funds" },
    { icon: PencilLineIcon, id: "publish", label: "Publish Article" },
    { icon: CreditCardUpload, id: "withdraw", label: "Withdraw" },
    { icon: InviteFriends, id: "friends", label: "Invite Friends" },
  ];
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
      <Button type="secondary">
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
    flex-shrink: 0;
    width: 100%;
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
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: var(--spacing-lg, 12px);
      width: 100%;

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
      
        :global(svg) {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
</style>
