<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import ActivityFeedItem from "./ActivityFeedItem.svelte";

  const users = [
    { avatar: null, name: "User Name", amount: 10 },
    { avatar: null, name: "User Name", amount: 10 },
    { avatar: null, name: "User Name", amount: 10 },
    { avatar: null, name: "User Name", amount: 10 },
    { avatar: null, name: "User Name", amount: 10 },
    { avatar: null, name: "User Name", amount: 10 },
    { avatar: null, name: "User Name", amount: 10 },
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
<div id="dashboard-activity">
  <div class="title">Activity</div>
  <div class="activity-list">
    {#each users as user}
      <ActivityFeedItem avatar={user.avatar} name={user.name}>
        <div class="shared" slot="text">
          Shared
          <span class="amount">
            {user.amount}
            BTA
          </span>
        </div>
      </ActivityFeedItem>
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
  #dashboard-activity {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex-shrink: 0;
    align-self: stretch;

    .title {
      color: var(--colors-text-text-secondary-700, #fbfbfb);

      /* Text lg/Semibold */
      font-family: var(--Font-family-font-family-body, Roboto);
      font-size: var(--Font-size-text-lg, 18px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--Line-height-text-lg, 28px); /* 155.556% */
    }
    .activity-list {
      display: flex;
      flex-direction: column;
      width: 100%;

      .shared {
        display: flex;
        gap: 5px;
        color: var(--colors-text-text-tertiary-600, #8c8c8c);

        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */

        .amount {
          color: var(--colors-text-text-brand-secondary-700, #d2d2d2);

          /* Text sm/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-sm, 20px);
        }
      }
    }
  }
</style>
