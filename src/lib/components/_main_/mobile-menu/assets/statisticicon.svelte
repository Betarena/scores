<script lang="ts">
  export let color: string = 'var(--icon-color)';
  export const contrastColor: string = 'var(--icon-contrast-color)';
  export let type: "outline" | "solid" = "outline";

  $: fill = type === "outline" ? "none" : color;
</script>

<svg width="25" height="24" viewBox="0 0 25 24" {fill} xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4_1821)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.5 21L17.5 21L17.5 3L21.5 3L21.5 21Z" {fill} stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 21.0002L10.5 21.0002L10.5 8.68418L14.5 8.68418L14.5 21.0002Z" {fill} stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 21.0004L3.5 21.0004L3.5 14.3684L7.5 14.3684L7.5 21.0004Z" {fill} stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_4_1821">
<rect width="24" height="24" fill="var(--icon-color)" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
