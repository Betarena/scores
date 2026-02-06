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
  import Calendar from "$lib/components/ui/assets/calendar.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import SelectButton from "$lib/components/ui/SelectButton.svelte";
  import WidgetCalendar from "../tx-history/Widget-Calendar.svelte";
  import session from "$lib/store/session";
  import { createEventDispatcher } from "svelte";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  type FilterFieldConfig = {
    start_date: {
      id: string;
      type: string;
      label: string;
      placeholder: string;
      value: any;
      options: Array<{ label: string; id: string }>;
      date: {
        id: string;
        type: string;
        label: string;
        placeholder: string;
        value: any;
        options: Array<{ label: string; id: string }>;
      };
    };
    revenue: {
      id: string;
      type: string;
      label: string;
      placeholder: string;
      value: any;
      options: Array<{ label: string; id: string }>;
      condition: {
        type: string;
        label: string;
        placeholder: string;
        value: any;
        options: Array<{ label: string; id: string }>;
      };
      amount: {
        id: string;
        type: string;
        label: string;
        placeholder: string;
        value: string;
      };
    };
  };

  export let onSave: (filters: FilterFieldConfig) => void = () => {};
  export let onCancel: () => void = () => {};
  export let onReset: () => void = () => {};
  export let onAddFilter: () => void = () => {};
  export let filters: FilterFieldConfig[] = [];

  let showDatepicker: number | null = null; // Track which filter's datepicker is open
  let selectedDate = new Date();
  let dateRange = {
    to: new Date(),
    from: new Date(),
  };

  $: ({ viewportType } = $session);

  const date_options = [
    { label: "Last 7 days", id: "7d" },
    { label: "Last 30 days", id: "30d" },
    { label: "Last 90 days", id: "90d" },
  ];
  let default_filter: FilterFieldConfig = {
    start_date: {
      id: "startDate",
      type: "date",
      label: "Start Date",
      placeholder: "Select dates",
      value: null,
      options: date_options,
      date: {
        id: "date",
        type: "date",
        label: "Start Date",
        placeholder: "Select dates",
        value: null,
        options: date_options,
      },
    },

    revenue: {
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
      condition: {
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
      amount: {
        id: "amount",
        type: "currency",
        label: "Amount",
        placeholder: "0.00",
        value: "",
      },
    },
  };

  const dispatch = createEventDispatcher();

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 REACTIVITY

  // #endregion ➤ 🔄 REACTIVITY

  // #region ➤ 🎯 METHODS

  function handleSave() {
    onSave(default_filter);
    dispatch("save", default_filter);
  }

  function handleCancel() {
    onCancel();
    dispatch("cancel");
  }

  function handleReset() {
    onReset();
    dispatch("reset");
    filters = [];
  }

  function handleAddFilter() {
    onAddFilter();
    dispatch("addFilter");
    filters = [...filters, JSON.parse(JSON.stringify(default_filter))];
  }

  function handleDateSelect(filterIndex: number) {
    if (showDatepicker === filterIndex) {
      showDatepicker = null;
    } else {
      showDatepicker = filterIndex;
    }
  }

  $: if (selectedDate && showDatepicker !== null) {
    handleDateChange(showDatepicker);
  }

  function handleDateChange(filterIndex: number) {
    if (filters[filterIndex]) {
      filters[filterIndex].start_date.date.value = selectedDate;
      filters = [...filters]; // Trigger reactivity
    }
  }

  // #endregion ➤ 🎯 METHODS
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div class="subscribers-filter {viewportType}">
  <!-- Header with title and reset button -->
  <div class="filter-header">
    <h3 class="filter-title">Subscriber Filters</h3>
    <button class="reset-all" on:click={handleReset}>Reset All</button>
  </div>

  {#each filters as filter, index}
    <div class="filter-row date-row">
      <div class="filter-field date-field">
        <DropDownInput
          label="Start Date"
          placeholder="Start Date"
          size="sm"
          options={date_options}
          bind:value={filter.start_date.value}
        />
      </div>
      <div class="date-picker-wrapper">
        <Button
          type="secondary"
          size="md"
          classname="date-picker-btn"
          on:click={() => handleDateSelect(index)}
        >
          <span class="calendar-icon"><Calendar /></span>
          {#if filter.start_date.date.value}
            <div class="selected-date">
              {new Date(filter.start_date.date.value).toLocaleDateString()}
            </div>
          {:else}
            <div class="placeholder">Select dates</div>
          {/if}
        </Button>
        {#if showDatepicker === index}
          <div class="calendar-wrapper">
            <WidgetCalendar
              bind:show={showDatepicker}
              bind:dateSelect={selectedDate}
              bind:dateRange
              allowRange={false}
              on:dateChange={() => handleDateChange(index)}
            />
          </div>
        {/if}
      </div>
    </div>
    <!-- Second row: Revenue, Is, Amount -->
    <div class="filter-row">
      <div class="filter-field">
        <DropDownInput
          label="Revenue"
          placeholder="Revenue"
          size="sm"
          options={filter.revenue.options}
          bind:value={filter.revenue.value}
        />
      </div>
      <div class="filter-field">
        <DropDownInput
          label="Is"
          placeholder="Is"
          size="sm"
          options={filter.revenue.condition.options}
          bind:value={filter.revenue.condition.value}
        />
      </div>
      <div class="filter-field amount-field">
        <Input
          label="Amount"
          size="sm"
          placeholder="0.00"
          type="leading-text"
          bind:value={filter.revenue.amount.value}
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
  {/each}

  <div class="filter-actions-wrapper">
    <div class="add-filter-container">
      <Button
        type="secondary"
        size="md"
        classname="add-filter-btn"
        full={viewportType === "mobile"}
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
        full={viewportType === "mobile"}
        on:click={handleCancel}
      >
        Cancel
      </Button>
      <Button
        type="primary"
        size="md"
        classname="save-btn"
        full={viewportType === "mobile"}
        on:click={handleSave}
      >
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

      &.date-row {
        align-items: end;
      }

      .filter-field {
        // flex: 1;
        // max-width: 140px;
        // width: 100%;
        // min-width: 320px;

        .date-picker-btn {
          align-self: end;
        }
        &.amount-field {
          max-width: 100px;
        }
        .icon {
          display: flex;
          align-items: center;
        }
      }

      .date-picker-wrapper {
        position: relative;
      }
      .calendar-wrapper {
        z-index: 10;
        transform: translateX(100%);
        position: relative;
      }

      .date-picker-btn {
        height: 44px;
        display: flex;
        align-self: end !important;
        gap: var(--spacing-xs, 4px);

        .calendar-icon {
          height: 20px;
          width: 20px;
          color: var(--colors-text-text-placeholder, #727171);
        }
        .placeholder {
          color: var(--colors-text-text-placeholder, #727171);
        }
        .selected-date {
          color: var(--colors-text-text-primary-900, #fff);
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

    &.mobile {
      .add-filter-container {
        width: 100%;
      }
      .filter-actions-wrapper,
      .filter-actions {
        flex-direction: column;
        justify-content: start;
        gap: var(--spacing-lg, 12px);
      }
      .filter-actions {
        flex-direction: column-reverse;
      }

      .calendar-wrapper {
        z-index: 10;
        // width: 200px;
        transform: unset;
        // position: relative;
      }
    }
  }
</style>
