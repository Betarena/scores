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
  import Button from "$lib/components/ui/Button.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import SelectButton from "$lib/components/ui/SelectButton.svelte";
  import { createEventDispatcher } from "svelte";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  interface FilterFieldConfig {
    id: string;
    type: "date" | "select" | "input" | "currency";
    label: string;
    placeholder: string;
    value: any;
    options?: Array<{ label: string; id?: string | number }>;
  }

  export let onSave: (filters: FilterFieldConfig[]) => void = () => {};
  export let onCancel: () => void = () => {};
  export let onReset: () => void = () => {};
  export let onAddFilter: () => void = () => {};

  const date_options = [
    { label: "Last 7 days", id: "7d" },
    { label: "Last 30 days", id: "30d" },
    { label: "Last 90 days", id: "90d" },
  ];
  let filters: FilterFieldConfig[] = [
    {
      id: "startDate",
      type: "date",
      label: "Start Date",
      placeholder: "Select dates",
      value: null,
      options: date_options,
    },
    {
      id: "revenue",
      type: "select",
      label: "Revenue",
      placeholder: "Select revenue",
      value: null,
      options: [
        { label: "All", id: "all" },
        { label: "High", id: "high" },
        { label: "Medium", id: "medium" },
        { label: "Low", id: "low" },
      ],
    },
    {
      id: "condition",
      type: "select",
      label: "Is",
      placeholder: "Select condition",
      value: null,
      options: [
        { label: "Equal", id: "eq" },
        { label: "Greater than", id: "gt" },
        { label: "Less than", id: "lt" },
      ],
    },
    {
      id: "amount",
      type: "currency",
      label: "Amount",
      placeholder: "0.00",
      value: "",
    },
  ];

  const dispatch = createEventDispatcher();

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 REACTIVITY

  // #endregion ➤ 🔄 REACTIVITY

  // #region ➤ 🎯 METHODS

  function handleSave() {
    onSave(filters);
    dispatch("save", filters);
  }

  function handleCancel() {
    onCancel();
    dispatch("cancel");
  }

  function handleReset() {
    filters = filters.map((f) => ({ ...f, value: null }));
    onReset();
    dispatch("reset");
  }

  function handleAddFilter() {
    onAddFilter();
    dispatch("addFilter");
  }

  // #endregion ➤ 🎯 METHODS
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div class="subscribers-filter">
  <!-- Header with title and reset button -->
  <div class="filter-header">
    <h3 class="filter-title">Subscriber Filters</h3>
    <button class="reset-all" on:click={handleReset}>Reset All</button>
  </div>

  <!-- First row: Start Date and Date Picker -->
  <div class="filter-row">
    <div class="filter-field date-field">
      <DropDownInput
        label="Start Date"
        placeholder="Start Date"
        size="sm"
        options={date_options}
        bind:value={filters[0].value}
      />
    </div>
    <!-- <Button
      type="secondary"
      size="md"
      classname="date-picker-btn"
      on:click={() => dispatch("selectDates")}
    >
      <span class="calendar-icon">📅</span>
      Select dates
    </Button> -->
  </div>

  <!-- Second row: Revenue, Is, Amount -->
  <div class="filter-row">
    <div class="filter-field">
      <DropDownInput
        label="Revenue"
        placeholder="Revenue"
        size="sm"
        options={filters[1].options}
        bind:value={filters[1].value}
      />
    </div>
    <div class="filter-field">
      <DropDownInput
        label="Is"
        placeholder="Is"
        size="sm"
        options={filters[2].options}
        bind:value={filters[2].value}
      />
    </div>
    <div class="filter-field amount-field">
      <Input
        label="Amount"
        size="sm"
        placeholder="0.00"
        type="leading-text"
        bind:value={filters[3].value}
      >
        <div class="icon" slot="leading-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 13.3332C5 15.1741 6.49238 16.6665 8.33333 16.6665H11.6667C13.5076 16.6665 15 15.1741 15 13.3332C15 11.4922 13.5076 9.99984 11.6667 9.99984H8.33333C6.49238 9.99984 5 8.50745 5 6.6665C5 4.82555 6.49238 3.33317 8.33333 3.33317H11.6667C13.5076 3.33317 15 4.82555 15 6.6665M10 1.6665V18.3332"
              stroke="#6A6A6A"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </Input>
    </div>
  </div>

  <div class="filter-actions-wrapper">
    <div class="add-filter-container">
      <Button
        type="secondary"
        size="md"
        classname="add-filter-btn"
        on:click={handleAddFilter}
      >
        + Add new filter
      </Button>
    </div>
    <div class="filter-actions">
      <!-- Add new filter button -->
  
      <Button
        type="secondary"
        size="md"
        classname="cancel-btn"
        on:click={handleCancel}
      >
        Cancel
      </Button>
      <Button type="primary" size="md" classname="save-btn" on:click={handleSave}>
        Save
      </Button>
    </div>
  </div>
</div>

<style lang="scss">
  .subscribers-filter {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3xl, 24px);
    padding: var(--spacing-xl, 16px);
    border: 1px solid var(--colors-border-border-secondary, #3b3b3b);
    background: var(--colors-background-bg-primary, #1f1f1f);
    border-radius: var(--radius-xl, 12px);
    max-width: 988px;

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-none, 0px);

      .filter-title {
        font-family: var(--font-family-body, "Roboto", sans-serif);
        font-size: var(--font-size-text-md, 16px);
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px);
        color: var(--text-text-primary, white);
        margin: 0;
        padding: 10px 0;
      }

      .reset-all {
        background: none;
        border: none;
        color: var(--colors-text-text-error-primary-600, #f97066);
        font-family: var(--font-family-body, "Roboto", sans-serif);
        font-size: var(--font-size-text-md, 16px);
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px);
        cursor: pointer;
        padding: 10px 0;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .filter-row {
      display: flex;
      gap: var(--spacing-lg, 12px);
      align-items: flex-start;
      flex-wrap: wrap;

      &.date-field {
        // min-width: 320px;
      }

      .filter-field {
        // flex: 1;
        // max-width: 140px;
        // width: 100%;
        // min-width: 320px;

        &.date-field {
          //   max-width: 140px;
          //   width: 100%;
          //   flex: 0 0 320px;
        }
        &.amount-field {
            max-width: 100px;
        }
        .icon {
          display: flex;
          align-items: center;
        }
      }

      .date-picker-btn {
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        height: 44px;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs, 4px);

        .calendar-icon {
          font-size: 20px;
        }
      }
    }

    .filter-actions-wrapper {
      display: flex;
      justify-content: space-between;
    }
    .add-filter-container {
      display: flex;
      align-items: center;
      align-self: self-start;

      .add-filter-btn {
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        height: 44px;
      }
    }

    .filter-actions {
      display: flex;
      gap: var(--spacing-lg, 12px);
      justify-content: flex-end;
      align-items: center;

      .cancel-btn {
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        height: 44px;
      }

      .save-btn {
        padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
        height: 44px;
      }
    }
  }
</style>
