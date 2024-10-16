<script lang="ts">
  import LoaderAvatar from "./LoaderAvatar.svelte";
  import LoaderLine from "./LoaderLine.svelte";

  export let size: "xs" | "md" | "lg" | "xl" | "sm" = "md";

  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    xxl: 64,
  };
</script>

<div class="wrapper {size}">
  <LoaderAvatar size={sizeMap[size]} />
  <div class="info">
    <LoaderLine width="50px" height={10} />
    <LoaderLine width="30px" height={5} />
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: inline-flex;
    align-items: center;
    gap: 10px;

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      .name {
        color: var(--colors-text-text-secondary-700, #525252);
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
        line-height: 14px; /* 140% */
      }
      .label {
        color: var(--colors-text-text-tertiary-600, #6a6a6a);
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: 10px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px; /* 140% */
      }
    }

    .sm {
      .name {
        font-size: var(--font-size-text-sm, 14px);
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
      .label {
        font-size: var(--font-size-text-xs, 12px);
        line-height: var(--line-height-text-xs, 18px); /* 150% */
      }
    }
    .md {
      gap: var(--spacing-lg, 12px);

      .name {
        font-size: var(--font-size-text-sm, 14px);
        line-height: var(--line-height-text-sm, 20px);
      }
      .label {
        font-size: var(--font-size-text-sm, 14px);
        line-height: var(--line-height-text-sm, 20px); /* 142.857% */
      }
    }
    .lg {
      gap: var(--spacing-lg, 12px);
      .name {
        font-size: var(--font-size-text-md, 16px);
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
      .label {
        font-size: var(--font-size-text-md, 16px);
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
    .xl {
      gap: var(--spacing-xl, 16px);
      .name {
        font-size: var(--font-size-text-lg, 18px);
        line-height: var(--line-height-text-lg, 28px); /* 155.556% */
      }
      .label {
        font-size: var(--font-size-text-md, 16px);
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
  }
</style>
