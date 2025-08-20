<script lang="ts">
  export let checked = false;
  export let title = "";
  export let description = "";
</script>

<label class="checkbox-wrapper" class:centered={!description}>
  <div class="custom-checkbox">
    <input type="checkbox" bind:checked />
    <span class="checkmark">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        class="check-icon"
      >
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="white"
          stroke-width="1.6666"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </div>
  <div class="text-wrapper">
    <div class="title">{title}</div>
    <div class="description">{description}</div>
  </div>
</label>

<style lang="scss">
  .checkbox-wrapper {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md, 8px);
    &.centered {
        align-items: center;
        justify-content: center;

        .custom-checkbox {
            display: flex;
            justify-content: baseline;
        }
    }
    .custom-checkbox {
      position: relative;
      display: inline-block;
      cursor: pointer;
      user-select: none;

      input[type="checkbox"] {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      .checkmark {
        top: 0;
        display: inline-block;
        width: 16px;
        height: 16px;
        background: transparent;
        border-radius: var(--spacing-xs, 4px);
        border: 1px solid var(--colors-border-border-primary, #d2d2d2);
        transition: background 0.2s;
        position: relative;

        .check-icon {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 12px;
          height: 12px;
          transform: translate(-50%, -50%);
          opacity: 0;
        }
      }

      input:checked + .checkmark {
        background: var(--colors-background-bg-brand-solid, #f5620f);
        border: none;

        .check-icon {
          opacity: 1;
        }
      }
    }
    .text-wrapper {
      .title {
        color: var(--colors-text-text-secondary-700, #525252);

        /* Text sm/Medium */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      .description {
        color: var(--colors-text-text-tertiary-600, #6a6a6a);

        /* Text sm/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
    }
  }
</style>
