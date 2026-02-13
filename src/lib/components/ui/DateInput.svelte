<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Calendar from "./Calendar.svelte";
  import CalendarIcon from "$lib/components/ui/assets/calendar.svelte";
  import Button from "./Button.svelte";
  import session from "$lib/store/session.js";

  type DateInput = Date | string | null;

  export let value: DateInput = null;
  export let placeholder = "Select date";
  export let size: "sm" | "md" | "lg" = "md";
  export let type: "primary" | "secondary" = "secondary";
  export let locale = "en-US";
  export let minDate: Date | null = null;
  export let maxDate: Date | null = null;
  export let minYear: number | null = null;
  export let maxYear: number | null = null;
  export let disabled = false;

  const dispatch = createEventDispatcher<{
    select: { date: Date };
    apply: { date: Date | null };
    cancel: Record<string, never>;
  }>();

  let isOpen = false;
  let selectedDate: Date | null = normalizeDateInput(value);
  let containerRef: HTMLDivElement;
  let calendarRef: HTMLDivElement;

  $: isMobile = $session.viewportType === "mobile";

  function normalizeDateInput(input: DateInput): Date | null {
    if (input instanceof Date) {
      if (Number.isNaN(input.getTime())) return null;
      return input;
    }
    if (typeof input === "string") {
      const parsed = new Date(input);
      if (Number.isNaN(parsed.getTime())) return null;
      return parsed;
    }
    return null;
  }

  $: selectedDate = normalizeDateInput(value);

  function toggleCalendar(e: Event) {
    e.stopPropagation();
    isOpen = !isOpen;
  }

  function handleCalendarSelect(event: CustomEvent<{ date: Date }>) {
    selectedDate = event.detail.date;
    value = event.detail.date;
    dispatch("select", { date: event.detail.date });
  }

  function handleCalendarApply(event: CustomEvent<{ date: Date | null }>) {
    value = event.detail.date;
    dispatch("apply", { date: event.detail.date });
    closeCalendar();
  }

  function handleCalendarCancel(event: CustomEvent) {
    dispatch("cancel", {});
    closeCalendar();
  }

  function closeCalendar() {
    isOpen = false;
  }

  function handleClickOutside(event: MouseEvent) {
    if (isOpen && containerRef && !containerRef.contains(event.target as Node)) {
      closeCalendar();
    }
  }

  function getDisplayValue(date: Date): string {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="date-input-container" bind:this={containerRef}>
  <Button
    type="secondary"
    size="md"
    classname="date-picker-btn"
    {disabled}
    on:click={toggleCalendar}
  >
    <span class="calendar-icon"><CalendarIcon /></span>
    {#if selectedDate}
      <div class="selected-date">
        {getDisplayValue(selectedDate)}
      </div>
    {:else}
      <div class="placeholder">{placeholder}</div>
    {/if}
  </Button>

  {#if isOpen}
    {#if isMobile}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="calendar-backdrop" on:click={closeCalendar}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="calendar-popup calendar-popup--mobile" bind:this={calendarRef} on:click|stopPropagation>
          <Calendar
            bind:value={selectedDate}
            {minDate}
            {maxDate}
            {minYear}
            {maxYear}
            {locale}
            showActions={true}
            showFooter={true}
            on:select={handleCalendarSelect}
            on:apply={handleCalendarApply}
            on:cancel={handleCalendarCancel}
          />
        </div>
      </div>
    {:else}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="calendar-popup" bind:this={calendarRef} on:click|stopPropagation>
        <Calendar
          bind:value={selectedDate}
          {minDate}
          {maxDate}
          {minYear}
          {maxYear}
          {locale}
          showActions={true}
          showFooter={true}
          on:select={handleCalendarSelect}
          on:apply={handleCalendarApply}
          on:cancel={handleCalendarCancel}
        />
      </div>
    {/if}
  {/if}
</div>

<style>
  .date-input-container {
    position: relative;
    display: inline-block;
  }

  .calendar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  }

  .calendar-popup {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 1000;
    background: white;
    border-radius: var(--calendar-radius, 16px);
    box-shadow: 0 20px 24px -4px rgba(10, 13, 18, 0.08),
      0 8px 8px -4px rgba(10, 13, 18, 0.03),
      0 3px 3px -1.5px rgba(10, 13, 18, 0.04);
    animation: slideUp 0.2s ease;
  }

  .calendar-popup--mobile {
    position: relative;
    top: auto;
    left: auto;
    animation: slideUpMobile 0.3s ease;
  }
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

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUpMobile {
    from {
      opacity: 0;
      transform: translateY(100px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
