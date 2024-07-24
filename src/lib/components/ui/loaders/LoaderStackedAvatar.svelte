<script lang="ts">
  import userBetarenaSettings from "$lib/store/user-settings.js";

  export let size: number = 34;
  export let deep = 14;
  export let reverse = false;
  export let clazz: string = "";
  export let count: number = 3; // Количество аватаров в стеке

  $: sizeString = typeof size === "number" ? `${size}px` : size;

  $: style =
    $userBetarenaSettings.theme == "Dark"
      ? "fill: var(--dark-theme-1-4-shade);"
      : ("fill: var(--whitev2);" as string);

  $: r = size / 2;
</script>

<div class="stacked-avatar-wrapper">
  {#each Array(count) as s, index}
    <div class="avatar-wrapper">
      <svg
        class="
    animation-target
    {clazz}
    "
        style="width:{size}px; height: {size}px; margin-left: -{index
          ? deep
          : 0}px; --loader-svg-size:{sizeString}"
        width={size}
        height={size}
        viewBox="0 0 {size} {size}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {#if !reverse && index}
          <defs>
            <mask id="hole-{index}">
              <rect width="100%" height="100%" fill="white" />
              <circle {r} cx={deep - r + 1} cy={r} fill="black" />
            </mask>
          </defs>
        {/if}
        {#if reverse && index !== count - 1}
          <defs>
            <mask id="hole-{index}">
              <rect width="100%" height="100%" fill="white" />
              <circle {r} cx={deep + r - 1} cy={r} fill="black" />
            </mask>
          </defs>
        {/if}

        <circle cx={r} cy={r} {r} {style} mask="url(#hole-{index})" />
      </svg>
    </div>
  {/each}
</div>

<style>
  .avatar-stack {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stacked-avatar-wrapper {
    display: flex;
  }
</style>
