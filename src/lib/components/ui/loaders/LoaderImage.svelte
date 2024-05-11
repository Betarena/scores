<script lang="ts">
  import userBetarenaSettings from '$lib/store/user-settings.js';


  export let width: number | string = 676,  height: number | string = 352, clazz: string = '';

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
  {width}
  {height}
  style="--loader-svg-height:{heightString}; --loader-svg-width:{widthString};"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="none"
>
    <rect {width} {height} {style} />
</svg>

<style>
  svg {
    width: var(--loader-svg-width) !important;
    height: var(--loader-svg-height) !important;
  }
</style>