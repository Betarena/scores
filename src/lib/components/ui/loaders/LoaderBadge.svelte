<script lang="ts">
  import userBetarenaSettings from '$lib/store/user-settings.js';


  export let width: number = 68, r: number = 13, height: number = 26, clazz: string = '';

  $: widthString = typeof width === 'number' ? `${width}px` : width
  $: heightString = typeof width === 'number' ? `${height}px` : height

  $: style = $userBetarenaSettings.theme == 'Dark' ? 'fill: var(--dark-theme-1-4-shade);' : 'fill: var(--whitev2);' as string;
</script>

<svg
  class=
  "
  animation-target
  {clazz}
  "
  {height}
  {width}
  style="--loader-svg-height:{heightString}; --loader-svg-width:{widthString};"
  viewBox="0 0 {width} {height}"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
>
  <rect
    {width}
    {height}
    rx={r}
    {style}
  />
</svg>

<style>
  svg {
    width: var(--loader-svg-width) !important;
    height: var(--loader-svg-height) !important;
  }
</style>