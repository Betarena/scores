<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";

  type DateInput = Date | string;
  type ViewMode = "day" | "month" | "year";
  export let value: Date | null = null;
  export let viewDate: Date | null = new Date();
  export let weekStartsOn: 0 | 1 = 1;
  export let locale = "en-US";
  export let weekdays: string[] | null = null;
  export let showOutsideDays = true;
  export let showActions = true;
  export let showFooter = true;
  export let showMonthSelect = true;
  export let showYearSelect = true;
  export let selectOnToday = true;
  export let minDate: Date | null = null;
  export let maxDate: Date | null = null;
  export let minYear: number | null = null;
  export let maxYear: number | null = null;
  export let placeholder = "Select date";
  export let labels = {
    today: "Today",
    cancel: "Cancel",
    apply: "Apply",
  };
  export let disabledDates: DateInput[] = [];
  export let markedDates: DateInput[] = [];
  export let isDateDisabled: ((date: Date) => boolean) | null = null;

  let calendarCells: ReturnType<typeof buildCalendarCells> = [];

  const dispatch = createEventDispatcher<{
    select: { date: Date };
    viewchange: { date: Date };
    apply: { date: Date | null };
    cancel: Record<string, never>;
    inputclick: { date: Date | null };
  }>();

  const DAY_COUNT = 42;
  const YEAR_PAGE_SIZE = 12;
  let viewMode: ViewMode = "day";
  let yearPageStart = 0;
  $: prevLabel =
    viewMode === "day"
      ? "Previous month"
      : viewMode === "month"
      ? "Previous year"
      : "Previous years";
  $: nextLabel =
    viewMode === "day"
      ? "Next month"
      : viewMode === "month"
      ? "Next year"
      : "Next years";

  function stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function toKey(date: Date): string {
    const d = stripTime(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  }

  function normalizeDateInput(input: DateInput): Date | null {
    if (input instanceof Date) {
      if (Number.isNaN(input.getTime())) return null;
      return stripTime(input);
    }
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) return null;
    return stripTime(parsed);
  }

  function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function addMonths(date: Date, amount: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }

  function addDays(date: Date, amount: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  }

  function isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function buildWeekdayLabels(): string[] {
    if (weekdays) return weekdays;
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const base = Array.from({ length: 7 }, (_, index) => {
      const sample = new Date(2020, 5, 7 + index);
      return formatter.format(sample).slice(0, 2);
    });
    if (weekStartsOn === 1) {
      return base.slice(1).concat(base[0]);
    }
    return base;
  }

  function buildMonths(): string[] {
    const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
    return Array.from({ length: 12 }, (_, index) => {
      const sample = new Date(2020, index, 1);
      return formatter.format(sample);
    });
  }

  function getYearRangeBounds() {
    const rangeStart = minYear ?? internalView.getFullYear() - 50;
    const rangeEnd = maxYear ?? internalView.getFullYear() + 50;
    return { rangeStart, rangeEnd };
  }

  function getYearPageStart(year: number) {
    const { rangeStart, rangeEnd } = getYearRangeBounds();
    const maxStart = Math.max(rangeStart, rangeEnd - YEAR_PAGE_SIZE + 1);
    const pageIndex = Math.floor((year - rangeStart) / YEAR_PAGE_SIZE);
    return Math.min(
      maxStart,
      Math.max(rangeStart, rangeStart + pageIndex * YEAR_PAGE_SIZE),
    );
  }

  function clampYearPageStart(start: number) {
    const { rangeStart, rangeEnd } = getYearRangeBounds();
    const maxStart = Math.max(rangeStart, rangeEnd - YEAR_PAGE_SIZE + 1);
    if (rangeEnd - rangeStart + 1 <= YEAR_PAGE_SIZE) return rangeStart;
    return Math.min(maxStart, Math.max(rangeStart, start));
  }

  let internalView = startOfMonth(viewDate ?? value ?? new Date());

  $: if (viewDate) {
    internalView = startOfMonth(viewDate);
  }

  $: if (!viewDate && value && !isSameMonth(value, internalView)) {
    internalView = startOfMonth(value);
  }

  $: monthNames = buildMonths();
  $: weekdayLabels = buildWeekdayLabels();
  $: todayKey = toKey(new Date());
  $: selectedKey = value ? toKey(value) : null;
  $: monthItems = monthNames.map((label, index) => {
    const year = internalView.getFullYear();
    return {
      label,
      index,
      isSelected: index === internalView.getMonth(),
      disabled: isMonthDisabled(index, year),
    };
  });
  $: yearItems = Array.from({ length: YEAR_PAGE_SIZE }, (_, index) => {
    const year = yearPageStart + index;
    const { rangeStart, rangeEnd } = getYearRangeBounds();
    return {
      year,
      isSelected: year === internalView.getFullYear(),
      disabled: year < rangeStart || year > rangeEnd || isYearDisabled(year),
    };
  });
  $: disabledKeySet = new Set(
    disabledDates
      .map(normalizeDateInput)
      .filter((date): date is Date => Boolean(date))
      .map((date) => toKey(date)),
  );
  $: markedKeySet = new Set(
    markedDates
      .map(normalizeDateInput)
      .filter((date): date is Date => Boolean(date))
      .map((date) => toKey(date)),
  );

  $: if (viewDate || value || internalView) {
    calendarCells = buildCalendarCells();
  }

  $: if (viewMode !== "year") {
    yearPageStart = getYearPageStart(internalView.getFullYear());
  }

  function isOutsideMonth(date: Date): boolean {
    return !isSameMonth(date, internalView);
  }

  function isDisabled(date: Date, isOutside: boolean): boolean {
    if (!showOutsideDays && isOutside) return true;
    const key = toKey(date);
    if (disabledKeySet.has(key)) return true;
    if (minDate && stripTime(date) < stripTime(minDate)) return true;
    if (maxDate && stripTime(date) > stripTime(maxDate)) return true;
    if (isDateDisabled && isDateDisabled(date)) return true;
    return false;
  }

  function isMonthDisabled(monthIndex: number, year: number) {
    if (!minDate && !maxDate) return false;
    const monthStart = stripTime(new Date(year, monthIndex, 1));
    const monthEnd = stripTime(new Date(year, monthIndex + 1, 0));
    if (minDate && monthEnd < stripTime(minDate)) return true;
    if (maxDate && monthStart > stripTime(maxDate)) return true;
    return false;
  }

  function isYearDisabled(year: number) {
    if (!minDate && !maxDate) return false;
    const yearStart = stripTime(new Date(year, 0, 1));
    const yearEnd = stripTime(new Date(year, 11, 31));
    if (minDate && yearEnd < stripTime(minDate)) return true;
    if (maxDate && yearStart > stripTime(maxDate)) return true;
    return false;
  }

  function buildCalendarCells() {
    const start = startOfMonth(internalView);
    const offset = (start.getDay() - weekStartsOn + 7) % 7;
    const firstDate = addDays(start, -offset);
    return Array.from({ length: DAY_COUNT }, (_, index) => {
      const date = addDays(firstDate, index);
      const key = toKey(date);
      const outside = isOutsideMonth(date);
      const disabled = isDisabled(date, outside);
      return {
        date,
        key,
        outside,
        disabled,
        hidden: !showOutsideDays && outside,
        isToday: key === todayKey,
        isSelected: selectedKey === key,
        isMarked: markedKeySet?.has(key),
      };
    });
  }

  function setView(date: Date) {
    internalView = startOfMonth(date);
    dispatch("viewchange", { date: internalView });
  }

  function goPrev() {
    if (viewMode === "day") {
      setView(addMonths(internalView, -1));
      return;
    }
    if (viewMode === "month") {
      const next = new Date(internalView);
      next.setFullYear(next.getFullYear() - 1);
      setView(next);
      return;
    }
    yearPageStart = clampYearPageStart(yearPageStart - YEAR_PAGE_SIZE);
  }

  function goNext() {
    if (viewMode === "day") {
      setView(addMonths(internalView, 1));
      return;
    }
    if (viewMode === "month") {
      const next = new Date(internalView);
      next.setFullYear(next.getFullYear() + 1);
      setView(next);
      return;
    }
    yearPageStart = clampYearPageStart(yearPageStart + YEAR_PAGE_SIZE);
  }

  function openMonthView() {
    if (!showMonthSelect) return;
    viewMode = "month";
  }

  function openYearView() {
    if (!showYearSelect) return;
    viewMode = "year";
    yearPageStart = getYearPageStart(internalView.getFullYear());
  }

  function handleMonthSelect(monthIndex: number) {
    if (isMonthDisabled(monthIndex, internalView.getFullYear())) return;
    const next = new Date(internalView);
    next.setMonth(monthIndex);
    setView(next);
    viewMode = "day";
  }

  function handleYearSelect(year: number) {
    if (isYearDisabled(year)) return;
    const next = new Date(internalView);
    next.setFullYear(year);
    setView(next);
    viewMode = "month";
  }

  function handleSelect(date: Date, disabled: boolean) {
    if (disabled) return;
    value = stripTime(date);
    dispatch("select", { date: value });
  }

  function handleToday() {
    const today = stripTime(new Date());
    setView(today);
    viewMode = "day";
    if (selectOnToday) {
      value = today;
      dispatch("select", { date: today });
    }
  }

  function handleCancel() {
    dispatch("cancel", {});
  }

  function handleApply() {
    dispatch("apply", { date: value });
  }

  function handleInputClick() {
    dispatch("inputclick", { date: value });
  }

  $: displayValue = value
    ? new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(value)
    : "";

  $: titleText = (() => {
    if (viewMode === "day") {
      const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long" });
      const monthName = monthFormatter.format(internalView);
      const year = internalView.getFullYear();
      return `${monthName} ${year}`;
    } else if (viewMode === "month") {
      return String(internalView.getFullYear());
    } else {
      const rangeStart = yearPageStart;
      const rangeEnd = yearPageStart + YEAR_PAGE_SIZE - 1;
      return `${rangeStart}–${rangeEnd}`;
    }
  })();

  function handleTitleClick() {
    if (viewMode === "day" && showMonthSelect) {
      viewMode = "month";
    } else if (viewMode === "month" && showYearSelect) {
      viewMode = "year";
      yearPageStart = getYearPageStart(internalView.getFullYear());
    }
  }
</script>

<div class="calendar" data-node-id="1547:269100">
  <div class="calendar-content">
    <div class="calendar-header">
      <button
        type="button"
        class="calendar-nav"
        on:click={goPrev}
        aria-label={prevLabel}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14.5 6.5L9 12l5.5 5.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button type="button" class="calendar-title" on:click={handleTitleClick}>
        <span class="calendar-title-text">{titleText}</span>
      </button>

      <button
        type="button"
        class="calendar-nav"
        on:click={goNext}
        aria-label={nextLabel}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9.5 6.5L15 12l-5.5 5.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    {#if showActions}
      <div class="calendar-actions">
        <div class="date-input-wrapper">
          <Input size="sm" readonly={true} {placeholder} value={displayValue} />
        </div>
        <!-- <button type="button" class="calendar-input" on:click={handleInputClick}>
					{#if displayValue}
						{displayValue}
					{:else}
						<span class="calendar-placeholder">{placeholder}</span>
					{/if}
				</button> -->
        <Button on:click={handleToday} type="secondary" size="md">
          {labels.today}
        </Button>
      </div>
    {/if}

    {#if viewMode === "day"}
      <div class="calendar-weekdays">
        {#each weekdayLabels as day}
          <div class="calendar-weekday">{day}</div>
        {/each}
      </div>

      <div class="calendar-grid">
        {#each calendarCells as cell}
          <button
            type="button"
            class="calendar-cell"
            class:calendar-cell--outside={cell.outside}
            class:calendar-cell--disabled={cell.disabled}
            class:calendar-cell--today={cell.isToday}
            class:calendar-cell--selected={cell.isSelected ||
              cell.date.getTime() === value?.getTime()}
            class:calendar-cell--hidden={cell.hidden}
            disabled={cell.disabled}
            on:click={() => handleSelect(cell.date, cell.disabled)}
          >
            <span class="calendar-date">{cell.date.getDate()}</span>
            {#if cell.isMarked}
              <span class="calendar-dot" aria-hidden="true" />
            {/if}
          </button>
        {/each}
      </div>
    {:else if viewMode === "month"}
      <div class="calendar-grid calendar-grid--months">
        {#each monthItems as monthItem}
          <button
            type="button"
            class="calendar-cell calendar-cell--month"
            class:calendar-cell--selected={monthItem.isSelected}
            class:calendar-cell--disabled={monthItem.disabled}
            disabled={monthItem.disabled}
            on:click={() => handleMonthSelect(monthItem.index)}
          >
            <span class="calendar-date">{monthItem.label.slice(0, 3)}</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="calendar-grid calendar-grid--years">
        {#each yearItems as yearItem}
          <button
            type="button"
            class="calendar-cell calendar-cell--year"
            class:calendar-cell--selected={yearItem.isSelected}
            class:calendar-cell--disabled={yearItem.disabled}
            disabled={yearItem.disabled}
            on:click={() => handleYearSelect(yearItem.year)}
          >
            <span class="calendar-date">{yearItem.year}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  {#if showFooter}
    <div class="calendar-footer">
      <div class="calendar-footer-actions">
        <Button on:click={handleCancel} type="secondary" size="md">
          {labels.cancel}
        </Button>
        <Button on:click={handleApply} type="primary" size="md">
          {labels.apply}
        </Button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .calendar {
    background: var(--colors-background-bg-primary, #fff);
    /* Shadows/shadow-xl */
    box-shadow: 0 20px 24px -4px var(--colors-effects-shadows-shadow-xl_01, rgba(10, 13, 18, 0.08)),
      0 8px 8px -4px var(--colors-effects-shadows-shadow-xl_02, rgba(10, 13, 18, 0.03)),
      0 3px 3px -1.5px var(--colors-effects-shadows-shadow-xl_03, rgba(10, 13, 18, 0.04));

    border-radius: var(--radius-2xl, 16px);
    color: var(--colors-text-text-secondary-700, #525252);
    font-family: var(
      --calendar-font-family,
      var(--font-family-body, "Roboto", sans-serif)
    );
    width: var(--calendar-width, 100%);
    max-width: var(--calendar-max-width, 360px);
    overflow: hidden;
  }

  .calendar-content {
    padding: var(--spacing-2xl, 20px) var(--spacing-3xl, 24px);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg, 12px);
  }

  .calendar-header {
    display: grid;
    grid-template-columns: 32px 1fr 32px;
    align-items: center;
  }

  .calendar-nav {
    border: none;
    background: none;
    width: var(--calendar-nav-size, 32px);
    height: var(--calendar-nav-size, 32px);
    border-radius: var(--calendar-nav-radius, 6px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--colors-foreground-fg-quaternary-400, #525252);
    cursor: pointer;
  }

  .calendar-nav svg {
    width: 20px;
    height: 20px;
  }

  .calendar-title {
    display: flex;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  .calendar-title-text {
    color: var(--colors-foreground-fg-secondary-700, #525252);
    text-align: center;

    /* Text sm/Semibold */
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-sm, 14px);
    font-style: normal;
    font-weight: 600;
    line-height: var(--line-height-text-sm, 20px); /* 142.857% */
  }

  .calendar-actions {
    display: flex;
    gap: var(--spacing-lg, 12px);
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, var(--calendar-cell-size, 40px));
    justify-content: space-between;

    color: var(--colors-text-text-secondary-700, #525252);
    text-align: center;

    /* Text sm/Medium */
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-sm, 14px);
    font-style: normal;
    font-weight: 500;
    line-height: var(--line-height-text-sm, 20px); /* 142.857% */
  }

  .calendar-weekday {
    height: var(--calendar-cell-size, 40px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, var(--calendar-cell-size, 40px));
    gap: var(--calendar-grid-gap, 4px);
    justify-content: space-between;
  }

  .calendar-grid--months {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--calendar-grid-gap, 8px);
    justify-items: center;
  }

  .calendar-grid--years {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--calendar-grid-gap, 8px);
    justify-items: center;
  }

  .calendar-cell {
    width: var(--calendar-cell-size, 40px);
    height: var(--calendar-cell-size, 40px);
    border-radius: var(--calendar-cell-radius, 999px);
    border: none;
    background: transparent;
    color: var(--colors-text-text-secondary-700, #525252);
    text-align: center;

    /* Text sm/Regular */
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-sm, 14px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--line-height-text-sm, 20px); /* 142.857% */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    @media (hover: hover) {
      &:hover {
        background: var(--colors-background-bg-primary_hover, #fbfbfb);
        color: var(--colors-text-text-secondary_hover, #3b3b3b);
      }
    }
  }

  .calendar-cell--outside {
    color: var(--colors-text-text-disabled, #727171);
  }

  .calendar-cell--disabled {
    color: var(--colors-text-text-disabled, #727171);
    cursor: not-allowed;
  }

  .calendar-cell--hidden {
    visibility: hidden;
  }

  .calendar-cell--today {
    background: var(--colors-background-bg-active, #fbfbfb);
    font-weight: var(--calendar-today-weight, 500);
    color: var(--colors-text-text-secondary_hover, #3b3b3b);
  }

  .calendar-cell--selected {
    background: var(--colors-background-bg-brand-solid, #f5620f);
    color: var(--colors-text-text-white, #fff);
    font-weight: var(--calendar-selected-weight, 500);
  }

  .calendar-dot {
    width: var(--calendar-dot-size, 5px);
    height: var(--calendar-dot-size, 5px);
    border-radius: 999px;
    background: var(--calendar-dot-color, #f5620f);
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
  }

  .calendar-cell--disabled .calendar-dot,
  .calendar-cell--outside .calendar-dot {
    background: var(--calendar-dot-disabled-color, #bdbdbd);
  }

  .calendar-footer {
    border-top: 1px solid var(--colors-border-border-secondary, #ededed);
    padding: var(--calendar-footer-padding, 16px);
  }

  .calendar-footer-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--calendar-footer-gap, 12px);
  }
  .date-input-wrapper {
    flex-grow: 1;
  }

  button:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--calendar-focus, #f5620f);
    outline-offset: 2px;
  }
</style>
