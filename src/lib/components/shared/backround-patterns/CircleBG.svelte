<script>
  export let color = "var(--colors-border-border-secondary)";
  export let animation = "none"; // "none", "ripple", "grow"
  export let duration = 15; // seconds - increased for grow animation
  export let delay = 0; // seconds
  export let size = "480"; // size of the SVG, can be adjusted as needed  
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 480 480"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style="--duration: {duration}s; --delay: {delay}s;"
>
  <mask
    id="mask0_4933_393068"
    style="mask-type:alpha"
    maskUnits="userSpaceOnUse"
    x="0"
    y="0"
    width="480"
    height="480"
  >
    <rect width="480" height="480" fill="url(#paint0_radial_4933_393068)" />
  </mask>
  <g mask="url(#mask0_4933_393068)">
    <circle cx="240" cy="240" r="47.5" stroke={color} class={animation === "ripple" ? "ripple-1" : animation === "grow" ? "grow-1" : ""} />
    <circle cx="240" cy="240" r="79.5" stroke={color} class={animation === "ripple" ? "ripple-2" : animation === "grow" ? "grow-2" : ""} />
    <circle cx="240" cy="240" r="111.5" stroke={color} class={animation === "ripple" ? "ripple-3" : animation === "grow" ? "grow-3" : ""} />
    <circle cx="240" cy="240" r="143.5" stroke={color} class={animation === "ripple" ? "ripple-4" : animation === "grow" ? "grow-4" : ""} />
    <circle cx="240" cy="240" r="175.5" stroke={color} class={animation === "ripple" ? "ripple-5" : animation === "grow" ? "grow-5" : ""} />
    <circle cx="240" cy="240" r="207.5" stroke={color} class={animation === "ripple" ? "ripple-6" : animation === "grow" ? "grow-6" : ""} />
    <circle cx="240" cy="240" r="239.5" stroke={color} class={animation === "ripple" ? "ripple-7" : animation === "grow" ? "grow-7" : ""} />
  </g>
  <defs>
    <radialGradient
      id="paint0_radial_4933_393068"
      cx="0"
      cy="0"
      r="1"
      gradientUnits="userSpaceOnUse"
      gradientTransform="translate(240 240) rotate(90) scale(240 240)"
    >
      <stop />
      <stop offset="1" stop-opacity="0" />
    </radialGradient>
  </defs>
</svg>

<style>
  /* Ripple effect - circles fade in sequence */
  .ripple-1 { animation: ripple var(--duration) ease-in-out infinite; animation-delay: calc(var(--delay) + 0s); }
  .ripple-2 { animation: ripple var(--duration) ease-in-out infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.2s); }
  .ripple-3 { animation: ripple var(--duration) ease-in-out infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.4s); }
  .ripple-4 { animation: ripple var(--duration) ease-in-out infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.6s); }
  .ripple-5 { animation: ripple var(--duration) ease-in-out infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.8s); }
  .ripple-6 { animation: ripple var(--duration) ease-in-out infinite; animation-delay: calc(var(--delay) + var(--duration) * 1s); }
  .ripple-7 { animation: ripple var(--duration) ease-in-out infinite; animation-delay: calc(var(--delay) + var(--duration) * 1.2s); }

  /* Grow effect - continuous flow */
  .grow-1 { animation: grow var(--duration) linear infinite; animation-delay: calc(var(--delay) + 0s); }
  .grow-2 { animation: grow var(--duration) linear infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.143); }
  .grow-3 { animation: grow var(--duration) linear infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.286); }
  .grow-4 { animation: grow var(--duration) linear infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.429); }
  .grow-5 { animation: grow var(--duration) linear infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.572); }
  .grow-6 { animation: grow var(--duration) linear infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.715); }
  .grow-7 { animation: grow var(--duration) linear infinite; animation-delay: calc(var(--delay) + var(--duration) * 0.858); }

  @keyframes ripple {
    0%, 100% {
      opacity: 0.2;
      stroke-width: 1;
    }
    50% {
      opacity: 1;
      stroke-width: 2;
    }
  }

  @keyframes grow {
    0% {
      opacity: 1;
      r: 20;
      stroke-width: 1;
    }
    100% {
      opacity: 0;
      r: 239.5;
      stroke-width: 1;
    }
  }
</style>
