<script lang="ts">
  import userBetarenaSettings from '$lib/store/user-settings.js';


  export let size:number= 34, clazz: string = '';

  $: sizeString = typeof size === 'number' ? `${size}px` : size


  $: style = $userBetarenaSettings.theme == 'Dark' ? 'fill: var(--dark-theme-1-4-shade);' : 'fill: var(--whitev2);' as string;

  $: r = size / 2;
</script>

<svg
    class=
    "
    animation-target
    {clazz}
    "
    style="--loader-svg-size:{sizeString}"
    width={size}
    height = {size}
    viewBox="0 0 {size} {size}"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <circle cx={r} cy={r} r={r} {style} />
</svg>

<style>
  svg {
    width: var(--loader-svg-size) !important;
    height: var(--loader-svg-size) !important;
  }
</style>