<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

    const articles = [
        // {title: "The Outermost House", tips: 123},
        // {title: "Northern Farm", tips: 86},
        // {title: "Northern Farm", tips: 86},
    ]
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
<div id="dashboard-top-articles">
  <div class="title">Top Articles by Tips</div>
  <div class="articles-wrapper">
    {#each articles as article}
        <div class="article">
            <div class="title">{article.title}</div>
            <div class="tips">{article.tips} Tips</div>
        </div>
         <!-- content here -->
    {/each}
    <div class="empty-state">
      <div class="empty-text-wrapper">
        <div class="empty-title">No articles found</div>
        <div class="empty-text">
          This section exclusively features award-winning articles.
        </div>
      </div>
    </div>
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
  #dashboard-top-articles {
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
    .articles-wrapper {
      display: flex;
      padding: 0 var(--spacing-none, 0);
      flex-direction: column;
      align-items: flex-start;
      flex-shrink: 0;
      width: 100%;
      align-self: stretch;

      .article {
        padding-block: var(--spacing-lg, 12px);
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
        border-top: 1px dashed var(--colors-border-border-primary, #525252);
        &:last-child {
            border-bottom: 1px dashed var(--colors-border-border-primary, #525252);
        }

        .title {
          color: var(--colors-text-text-secondary-700, #fbfbfb);

          /* Text sm/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
        .tips {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }
     .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: stretch;
      width: 100%;
      .empty-text-wrapper {
        display: flex;
        max-width: 352px;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xs, 4px);
        align-self: stretch;

        .empty-title {
          color: var(--colors-text-text-primary-900, #fff);
          text-align: center;

          /* Text md/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
        .empty-text {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);
          text-align: center;

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }
  }
</style>
