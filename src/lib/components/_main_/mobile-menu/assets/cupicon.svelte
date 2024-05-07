<script lang="ts">
  export let color: string = 'var(--icon-color)';
  export const contrastColor: string = 'var(--icon-contrast-color)';
  export let type: "outline" | "solid" = "outline";

  $: fill = type === "outline" ? "none" : color;
  $: stroke = type === "outline" ? color : "none";
  $: contourWidth = type === "outline" ? "1.5" : "0";
</script>


<svg width="25" height="24" viewBox="0 0 25 24" {fill} xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 4H16.5C17.0523 4 17.5 4.44772 17.5 5V11C17.5 13.7614 15.2614 16 12.5 16V16C9.73858 16 7.5 13.7614 7.5 11V5C7.5 4.44772 7.94772 4 8.5 4Z" {fill} {stroke}  stroke-width={contourWidth} stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.1733 12.7801L19.0653 11.8341C20.2511 11.2412 21.0001 10.0293 21.0001 8.70361V7.3667C21.0001 6.88345 20.6084 6.4917 20.1251 6.4917H17.5001" {fill} {stroke} stroke-width={contourWidth} stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.5 20V16" {fill}  stroke={color} stroke-width="1.5"  stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.5 20H8.5" {fill} stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.82677 12.7801L5.93477 11.8341C4.74903 11.2412 4.00001 10.0293 4 8.70361V7.3667C4 6.88345 4.39175 6.4917 4.875 6.4917H7.5" {fill}  stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
