<script lang="ts">
  import Button from "../Button.svelte";

  export let startDate: Date | null = null;
  export let endDate: Date | null = null;
  export let onApply: (start: Date, end: Date) => void = () => {};
  export let onCancel: () => void = () => {};

  let currentMonth: Date = new Date();
  let displayDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    isSibling: boolean;
  }> = [];
  let tempStart: Date | null = startDate;
  let tempEnd: Date | null = endDate;

  const weekDaysShort = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  $: {
    generateCalendarDays(currentMonth);
  }

  function generateCalendarDays(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const dayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    displayDays = [];

    // Previous month days
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      displayDays.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isSibling: true,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      displayDays.push({
        day: day,
        isCurrentMonth: true,
        isSibling: false,
      });
    }

    // Next month days to fill grid
    const remainingDays = 42 - displayDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      displayDays.push({
        day: i,
        isCurrentMonth: false,
        isSibling: true,
      });
    }
  }

  function isInRange(
    dayObj: any,
    tempStart: Date | null,
    tempEnd: Date | null
  ): boolean {
    if (!dayObj || !tempStart || !tempEnd) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() +
        (dayObj.isSibling && dayObj.day > 15 ? -1 : dayObj.isSibling ? 1 : 0),
      dayObj.day
    );
    const start = new Date(tempStart);
    const end = new Date(tempEnd);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= start && date <= end;
  }

  function isRangeStart(dayObj: any, tempStart: Date | null): boolean {
    if (!dayObj || !tempStart) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() +
        (dayObj.isSibling && dayObj.day > 15 ? -1 : dayObj.isSibling ? 1 : 0),
      dayObj.day
    );
    const start = new Date(tempStart);
    start.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === start.getTime();
  }

  function isRangeEnd(dayObj: any, tempEnd: Date | null): boolean {
    if (!dayObj || !tempEnd) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() +
        (dayObj.isSibling && dayObj.day > 15 ? -1 : dayObj.isSibling ? 1 : 0),
      dayObj.day
    );
    const end = new Date(tempEnd);
    end.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === end.getTime();
  }

  function selectDay(dayObj: any) {
    if (!dayObj) return;

    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() +
        (dayObj.isSibling && dayObj.day > 15 ? -1 : dayObj.isSibling ? 1 : 0),
      dayObj.day
    );

    if (!tempStart || (tempStart && tempEnd)) {
      tempStart = date;
      tempEnd = null;
    } else if (!tempEnd) {
      if (date < tempStart) {
        tempEnd = tempStart;
        tempStart = date;
      } else {
        tempEnd = date;
      }
    }
  }

  function previousMonth() {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
  }

  function nextMonth() {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
  }

  function setQuickRange(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    tempStart = start;
    tempEnd = end;
  }

  function handleApply() {
    if (tempStart && tempEnd) {
      onApply(tempStart, tempEnd);
    }
  }

  function handleCancel() {
    tempStart = startDate;
    tempEnd = endDate;
    onCancel();
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${year}`;
  }

  function getMonthYear(): string {
    return `${
      monthNames[currentMonth.getMonth()]
    } ${currentMonth.getFullYear()}`;
  }
</script>

<div class="date-picker-container">
  <div class="date-picker-wrapper">
    <div class="content">
      <div class="calendar-section">
        <div class="month-header">
          <button
            class="nav-button"
            on:click={previousMonth}
            aria-label="Previous month"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12 4L6 10L12 16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <span class="month-title">{getMonthYear()}</span>
          <button
            class="nav-button"
            on:click={nextMonth}
            aria-label="Next month"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M8 4L14 10L8 16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div class="date-inputs">
          <div class="input-field">
            <input
              type="text"
              value={tempStart ? formatDate(tempStart) : ""}
              placeholder="Start date"
              readonly
            />
          </div>
          <span class="date-separator">–</span>
          <div class="input-field">
            <input
              type="text"
              value={tempEnd ? formatDate(tempEnd) : ""}
              placeholder="End date"
              readonly
            />
          </div>
        </div>

        <div class="quick-select">
          <button class="quick-btn" on:click={() => setQuickRange(7)}
            >Last week</button
          >
          <button class="quick-btn" on:click={() => setQuickRange(30)}
            >Last month</button
          >
          <button class="quick-btn" on:click={() => setQuickRange(365)}
            >Last year</button
          >
        </div>

        <div class="calendar-grid">
          {#each weekDaysShort as day}
            <div class="weekday">{day}</div>
          {/each}

          {#each displayDays as dayObj, index}
            {@const inRange = isInRange(dayObj, tempStart, tempEnd)}
            {@const isStart = isRangeStart(dayObj, tempStart)}
            {@const isEnd = isRangeEnd(dayObj, tempEnd)}
            <button
              class="calendar-day"
              class:sibling={dayObj.isSibling}
              class:in-range={inRange && !isStart && !isEnd}
              class:range-start={isStart}
              class:range-end={isEnd}
              class:range-fill={inRange}
              on:click={() => selectDay(dayObj)}
            >
              <span>{dayObj.day}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <div class="bottom-panel">
      <Button type="secondary-gray" on:click={handleCancel} full>Cancel</Button>
      <Button type="primary" on:click={handleApply} full>Apply</Button>
    </div>
  </div>
</div>

<style lang="scss">
  .date-picker-container {
    background-color: var(--colors-background-bg-primary, #ffffff);
    border: 1px solid var(--colors-border-border-secondary, #ededed);
    border-radius: var(--radius-xl, 12px);
    overflow: hidden;
    width: min-content;
    /* Shadows/shadow-xl */
    box-shadow: 0 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(31, 31, 31, 0.08)),
      0 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(31, 31, 31, 0.03));

    .date-picker-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;

      .content {
        display: flex;
        padding: var(--spacing-2xl, 20px) var(--spacing-3xl, 24px);
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xl, 16px);
        align-self: stretch;

        .calendar-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg, 12px);

          .month-header {
            color: var(
              --component-colors-components-buttons-secondary-button-secondary-fg
            );
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 280px;

            .month-title {
              margin: 0;
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-md, 16px);
              font-weight: 600;
              line-height: var(--line-height-text-md, 24px);
              color: var(--colors-foreground-fg-secondary-700, #525252);
              text-align: center;
            }
          }

          .date-inputs {
            display: flex;
            gap: var(--spacing-md, 8px);
            align-items: center;
            width: 100%;

            .input-field {
              flex: 1;
              display: flex;
              align-items: center;

              input {
                width: 100%;
                padding: var(--spacing-md, 8px) var(--spacing-lg, 12px);
                border: 1px solid var(--colors-border-border-primary, #d2d2d2);
                border-radius: var(--radius-md, 8px);
                background-color: var(--colors-background-bg-primary, #ffffff);
                font-family: Roboto, sans-serif;
                font-size: var(--font-size-text-md, 16px);
                font-weight: 400;
                line-height: var(--line-height-text-md, 24px);
                color: var(--colors-text-text-primary, #000000);
                cursor: pointer;
                outline: none;
                transition: border-color 0.2s ease;

                &:hover {
                  border-color: var(--colors-border-border-secondary, #ededed);
                }

                &:focus {
                  border-color: var(
                    --colors-foreground-fg-brand-primary-\(500\),
                    #f5620f
                  );
                }

                &::placeholder {
                  color: var(
                    --colors-foreground-fg-quaternary-\(500\),
                    #727171
                  );
                }
              }
            }

            .date-separator {
              color: var(--colors-foreground-fg-quaternary-\(500\), #727171);
              font-size: var(--font-size-text-md, 16px);
              margin: 0 var(--spacing-md, 8px);
            }
          }
          .quick-select {
            display: flex;
            padding: var(--spacing-xs, 4px) var(--spacing-md, 8px) 0
              var(--spacing-md, 8px);
            justify-content: space-between;
            align-items: center;
            align-self: stretch;

            .quick-btn {
              background: transparent;
              border: none;
              color: var(--colors-foreground-fg-brand-primary-\(500\), #f5620f);
              font-family: Roboto, sans-serif;
              font-size: var(--font-size-text-sm, 14px);
              font-weight: var(--font-weight-medium, 500);
              line-height: var(--line-height-text-sm, 20px);
              cursor: pointer;
              transition: opacity 0.2s ease;
              padding: 0;

              &:hover {
                opacity: 0.8;
              }

              &:active {
                opacity: 0.6;
              }
            }
          }
        }
      }
    }
  }

  .nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: var(--spacing-md, 8px);
    background: transparent;
    border: none;
    border-radius: var(--radius-md, 8px);
    color: var(--colors-foreground-fg-secondary-\(700\), #525252);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &:active:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    gap: 4px;
    width: 100%;
  }

  .weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    font-family: Roboto, sans-serif;
    font-size: var(--font-size-text-sm, 14px);
    font-weight: var(--font-weight-medium, 500);
    line-height: var(--line-height-text-sm, 20px);
    color: var(--colors-text-text-secondary-700, #525252);
    margin: 0 auto;
  }

  .calendar-day {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    position: relative;
    border: none;
    border-radius: var(--radius-full, 9999px);
    background-color: transparent;
    color: var(--colors-text-text-secondary-700, #525252);
    font-family: Roboto, sans-serif;
    font-size: var(--font-size-text-sm, 14px);
    font-weight: 400;
    line-height: var(--line-height-text-sm, 20px);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;

    span {
      position: relative;
      z-index: 2;
    }

    .dot {
      position: absolute;
      bottom: 4px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: var(--colors-foreground-fg-brand-primary-500, #f5620f);
    }

    &.sibling {
      color: var(--colors-text-text-disabled, #727171) !important;
      &:not(.range-fill) {
        opacity: 0.6;
      }
    }

    &.disabled {
      color: var(--colors-text-text-disabled, #727171);
      cursor: not-allowed;
      opacity: 1;
    }

    &.range-fill {
      background-color: var(--colors-background-bg-active, #fbfbfb);
      color: var(--colors-text-text-secondary-700, #525252);
      font-weight: 500;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -10px;
        right: -10px;
        background-color: var(--colors-background-bg-active, #fbfbfb);
        z-index: 0;
      }

      &.range-start::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        right: -10px;
        background-color: var(--colors-background-bg-active, #fbfbfb);
        z-index: 0;
      }

       &.range-end::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 50%;
        left: -10px;
        background-color: var(--colors-background-bg-active, #fbfbfb);
        z-index: 0;
      }
    }

    &.range-start {
      background: var(--colors-background-bg-brand-solid, #f5620f);
      color: var(--colors-text-text-white, #ffffff);
      font-weight: 500;
      z-index: 3;


      &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        border-radius: var(--radius-full, 9999px);
        background: var(--colors-background-bg-brand-solid, #f5620f);
        z-index: 1;
      }


    }

    &.range-end {
      background-color: var(--colors-background-bg-brand-solid, #f5620f);
      color: var(--colors-text-text-white, #ffffff);
      font-weight: 500;
      z-index: 3;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        border-radius: var(--radius-full, 9999px);
        background: var(--colors-background-bg-brand-solid, #f5620f);
        z-index: 1;
      }
    }

    &:not(.sibling):not(.disabled):hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .bottom-panel {
    display: flex;
    gap: var(--spacing-lg, 12px);
    justify-content: flex-end;
    align-items: flex-start;
    padding: var(--spacing-xl, 16px);
    border-top: 1px solid var(--colors-border-border-secondary, #ededed);
  }
</style>
