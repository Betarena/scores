<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  import Button from "$lib/components/ui/Button.svelte";
  import ButtonGroup from "$lib/components/ui/ButtonGroup.svelte";
  import Change from "$lib/components/ui/metrics/Change.svelte";
  import TweenedNumber from "$lib/components/ui/metrics/TweenedNumber.svelte";
  import session from "$lib/store/session";
  import Chart from "chart.js/auto";
  import { onDestroy, onMount, tick } from "svelte";
  import WidgetCalendar from "../tx-history/Widget-Calendar.svelte";

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  const options = [
    { id: "year", label: "12m" },
    { id: "month", label: "30d" },
    { id: "week", label: "7d" },
    { id: "day", label: "24h" },
  ];
  let showDatepicker = false;
  let selectedDate = new Date();
  let dateRange = {
    to: new Date(),
    from: new Date(),
  };

  $: selectedOption = options[0];
  $: ({ viewportType } = $session);
  $: if (viewportType) {
    createChart(selectedOption.id);
  }

  let canvas: HTMLCanvasElement | null = null;
  let chart: Chart | null = null;
  let chartContainer: HTMLElement | null = null;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  let isResizing = false;

  // sample datasets for different ranges (mocked to match the attached image shape)
  $: dataSets = {
    year: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      data: []
      // data: [10, 11, 12, 13, 15, 14, 13, 16, 17, 16.5, 17, 11],
    },
    month: {
      labels: ["1", "6", "12", "18", "24", "30"],
      // data: [8, 9, 11, 12, 12.5, 13.2],
      data: []
    },
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      // data: [11, 11.2, 11.8, 12.1, 12.0, 12.4, 12.8],
      data: []
    },
    day: {
      labels: ["00", "04", "08", "12", "16", "20", "24"],
      // data: [12.0, 11.8, 11.6, 12.2, 12.4, 12.6, 13.0],
      data: [],
    },
    custom: generateRandomForRange(dateRange)
  };

  function generateRandomForRange(range: { from: Date; to: Date }) {
    const from = new Date(range.from);
    const to = new Date(range.to);
    const msDiff = Math.max(0, to.getTime() - from.getTime());
    // number of points: at least 6, at most 30
    const days = Math.max(1, Math.ceil(msDiff / (24 * 60 * 60 * 1000)));
    const points = Math.min(30, Math.max(6, days));
    const labels: string[] = [];
    const data: number[] = [];

    // starting baseline and gentle random walk
    let value = 10 + Math.random() * 6; // base between 10..16
    for (let i = 0; i < points; i++) {
      // jitter + slight upward drift
      value = Math.max(
        1,
        value + (Math.random() - 0.45) * 1.4 + (i / points) * 0.4
      );
      data.push(parseFloat(value.toFixed(2)));
      const t =
        points === 1
          ? from.getTime()
          : from.getTime() + Math.round((msDiff * i) / (points - 1 || 1));
      const d = new Date(t);
      // label as "DD.MM" for readability
      labels.push(`${d.getDate()}.${d.getMonth() + 1}`);
    }

    return { labels, data: [] };
  }


  async function createChart(rangeId: string) {
    if (!canvas) return;
    await tick();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // create gradient fill to mimic the dark area under the line
    const height = canvas.clientHeight || 150;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(255,122,45,0.18)");
    gradient.addColorStop(1, "rgba(0,0,0,0.05)");

    const chosen = dataSets[rangeId] ?? dataSets.year;

    // compute suggested max to leave top padding above highest point
    const maxVal = Math.max(...chosen.data);
    const suggestedMax = maxVal + Math.max(1, maxVal * 0.06); // +6% or at least +1

    // index of "current"
    const lastIndex = Math.max(0, chosen.data.length - 1);
    const currentValue = chosen.data[lastIndex];

    // per-point radii / colors so only current point is highlighted
    const pointRadii = chosen.data.map((_, i) => (i === lastIndex ? 6 : 0));
    const pointBg = chosen.data.map((_, i) =>
      i === lastIndex ? "#FFFFFF" : "#F7813F"
    );
    const pointBorder = chosen.data.map((_, i) =>
      i === lastIndex ? "#F7813F" : "#F7813F"
    );
    const pointBorderWidth = chosen.data.map((_, i) =>
      i === lastIndex ? 2 : 0
    );

    // small plugin to draw dashed horizontal line at current point
    const currentPointPlugin = {
      id: "currentPointLine",
      afterDatasetsDraw(chart: any) {
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data || !meta.data.length) return;
        const el = meta.data[lastIndex];
        if (!el) return;
        const y = el.y; // pixel y coord of last point
        const { left, right, top, bottom } = chart.chartArea;
        const ctx = chart.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(247,129,63,0.5)";
        // draw line across chart plotting area (not over labels)
        ctx.moveTo(left, y + 0.5);
        ctx.lineTo(right, y + 0.5);
        ctx.stroke();
        ctx.restore();
      },
    };

    const config = {
      type: "line" as const,
      data: {
        labels: chosen.labels,
        datasets: [
          {
            label: "Earnings",
            data: chosen.data,
            borderColor: "#F7813F",
            backgroundColor: gradient,
            fill: true,
            tension: 0.3,
            pointRadius: pointRadii,
            pointHoverRadius: 6,
            pointBackgroundColor: pointBg,
            pointHoverBorderWidth: 0,
            pointBorderColor: pointBorder,
            pointBorderWidth: pointBorderWidth,
          },
        ],
      },
      plugins: [currentPointPlugin],
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: 0,
        },
        interaction: {
          mode: "nearest",
          intersect: false,
        },
        // enable a smooth draw animation and gentle transitions on update
        animation: {
          duration: 900,
          easing: "easeOutQuart",
        },
        transitions: {
          show: {
            animations: {
              x: { from: 0 },
              y: { from: 0 },
            },
          },
          active: {
            animations: {
              x: { duration: 600, easing: "easeOutCubic" },
              y: { duration: 600, easing: "easeOutCubic" },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            offset: false,
            ticks: { color: "#8C8C8C", maxRotation: 0, padding: 0 },
          },
          y: {
            grid: {
              color: "rgba(140,140,140,0.16)",
              drawBorder: false,
              tickLength: 6,
            },
            ticks: {
              display: true,
              color: "#8C8C8C",
              padding: 6,
              maxTicksLimit: 6,
              callback: (value: any) => {
                const num = Number(value);
                if (Number.isNaN(num)) return String(value);
                return `$${num % 1 === 0 ? num : num.toFixed(0)}`;
              },
            },
            beginAtZero: false,
            suggestedMax,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(20,20,20,0.95)",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",
            padding: 8,
            displayColors: false,
            caretSize: 6,
            cornerRadius: 6,
            callbacks: {
              title: (items: any[]) => {
                return items && items.length
                  ? String(items[0].label ?? "")
                  : "";
              },
              label: (context: any) => {
                const raw =
                  context.parsed && typeof context.parsed.y !== "undefined"
                    ? context.parsed.y
                    : context.formattedValue;
                const num = Number(raw);
                if (Number.isNaN(num)) return String(raw);
                const formatted = num % 1 === 0 ? String(num) : num.toFixed(2);
                return `${formatted}`;
              },
            },
          },
        },
      },
    };

    if (chart) {
      try {
        chart.destroy();
      } catch (e) {
        /* ignore */
      }
      chart = null;
    }

    chart = new Chart(ctx, config as any);
  }

  function handleResize() {
    if (!isResizing) {
      isResizing = true;
      if (chart) {
        try {
          chart.destroy();
        } catch (e) {
          /* ignore */
        }
        chart = null;
      }
    }

    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      isResizing = false;
      createChart(selectedOption.id);
      resizeTimer = null;
    }, 150);
  }
  onMount(() => {
    createChart(selectedOption.id);
  });

  onDestroy(() => {
    if (chart) {
      try {
        chart.destroy();
      } catch (e) {
        /* ignore */
      }
      chart = null;
    }

    if (resizeTimer) {
      clearTimeout(resizeTimer);
      resizeTimer = null;
    }
    isResizing = false;
  });

  $: if (chart && selectedOption) {
    // update existing chart when range changes
    const chosen = dataSets[selectedOption.id] ?? dataSets.year;
    chart.data.labels = chosen.labels as any;
    // @ts-ignore
    chart.data.datasets[0].data = chosen.data;
    // ensure update uses animation settings (will animate by Chart.js options)
    if (chart.options) {
      // slightly shorten animation for updates
      // @ts-ignore
      chart.options.animation = { duration: 650, easing: "easeOutCubic" };
    }
    chart.update();
  }
  // #endregion ➤ 📌 VARIABLES
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->
<svelte:window on:resize={handleResize} />
<div id="dashboard-earnings" class={viewportType}>
  <div class="title">Earnings</div>
  <div class="buttons-text-wrapper">
    <div class="buttons-wrapper">
      <ButtonGroup group={options} bind:selected={selectedOption} />
      <Button
        size="md"
        type="secondary"
        icon_leading={true}
        on:click={() => {
          showDatepicker = !showDatepicker
          selectedOption = {id: "custom", label: "custom"}
          }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 10H15M2.5 5H17.5M7.5 15H12.5"
            stroke="#6A6A6A"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Button>
      {#if showDatepicker}
        <WidgetCalendar
          bind:show={showDatepicker}
          bind:dateSelect={selectedDate}
          bind:dateRange
        />
      {/if}
    </div>
    <div class="chart-text">
      <div class="mrr">MRR</div>
      <div class="number-badge-wrapper">
        <div class="numbers-data">
          <span class="bta">BTA</span>
          <div class="numbers">
            <div class="amount"><TweenedNumber fixNumber={1} number={0}  /></div>
            {#if $session.btaUsdRate}
               <div class="usd">$<TweenedNumber fixNumber={1} number={0 / $session.btaUsdRate} /></div>
            {/if}
          </div>
        </div>
        <Change type="second" change={0} />
      </div>
    </div>
  </div>
  <div class="chart-section">
    <div class="chart" bind:this={chartContainer}>
      <canvas bind:this={canvas} />
    </div>
  </div>
</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">
  #dashboard-earnings {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex-shrink: 0;
    align-self: stretch;

    .title {
      color: var(--colors-text-text-secondary-700, #fbfbfb);
      flex: 1 0 0;
      /* Text lg/Semibold */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-lg, 18px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--line-height-text-lg, 28px); /* 155.556% */
    }
    .buttons-text-wrapper {
      display: flex;
      gap: 12px;
      flex-direction: column;
      .buttons-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        align-self: stretch;
      }
      .chart-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        align-self: stretch;

        .mrr {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text sm/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
        .number-badge-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          align-self: stretch;

          .numbers-data {
            display: flex;
            align-items: flex-start;
            gap: 2px;

            .bta {
              color: var(--colors-text-text-primary-900, #fff);
              padding-top: 2px;

              /* Text xl/Medium */
              font-family: var(--font-family-font-family-body, Roboto);
              font-size: var(--font-size-text-xl, 20px);
              font-style: normal;
              font-weight: 500;
              line-height: var(--line-height-text-xl, 30px); /* 150% */
            }
            .numbers {
              display: flex;
              gap: 5px;
              align-items: baseline;
              .amount {
                color: var(--colors-text-text-primary-900, #fff);

                /* Display md/Semibold */
                font-family: var(--font-family-font-family-display, Roboto);
                font-size: var(--font-size-display-md, 36px);
                font-style: normal;
                font-weight: 600;
                line-height: var(--line-height-display-md, 44px); /* 122.222% */
                letter-spacing: -0.72px;
              }

              .usd {
                color: var(--colors-text-text-tertiary-600, #8c8c8c);

                /* Display xs/Bold */
                font-family: var(--font-family-font-family-display, Roboto);
                font-size: var(--font-size-display-xs, 24px);
                font-style: normal;
                font-weight: 700;
                line-height: var(--line-height-display-xs, 32px);
              }
            }
          }
        }
      }
    }
    .chart-section {
      display: flex;
      padding: 0 var(--spacing-none, 0);
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      align-self: stretch;

      .chart {
        margin-top: 12px;
        width: 100%;
        height: 200px; /* fixed height to match compact sparkline-like chart */
        position: relative;
        canvas {
          width: 100% !important;
          height: 100% !important;
        }
      }
    }

    &:not(.mobile) {
      .title {
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-lg, 18px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-lg, 28px); /* 155.556% */
      }
      .buttons-text-wrapper {
        width: 100%;
        flex-direction: row-reverse;
        flex-wrap: wrap-reverse;
        justify-content: space-between;
        gap: 32px;
        .chart-text {
          flex-shrink: 1;
          flex-grow: 1;
          max-width: 100%;
        }
      }
      .chart {
        height: 240px;
      }
    }
  }
</style>
