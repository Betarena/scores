<script lang="ts">
  import { onMount } from "svelte";
  //   import { postMod } from "./utils/fetch";
  export let containerSelector = "#content";
  export let insertAfter = ["random", "p"];
  let adData = {
    id: 0,
    image: "",
    link: "",
  };
  let targetNode;
  let adNode: HTMLDivElement;

  // Fetch ad content
  async function fetchAd() {
    adData = {
      id: 1,
      image:
        "https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/Betarena_Media%2Fads%2F0x1510ea733e1e81f9bcfcc4eabb5a2226d1a9f9ea18da9aea119ba28b8ed6be81%2FBRBet365ADInterscroller.png?alt=media&token=4b1ef015-2643-4834-9081-f2c763531a21",
      link: "http://google.com",
    };
  }

  function trackClick() {
    // postMod(`${betarenaEndpoint}/ad/update/click`, {
    //   creativeId: adData.id,
    // });
  }

  onMount(async () => {
    targetNode = document.querySelector(containerSelector);
    await fetchAd();
    injectAdd(targetNode);
  });

  function injectAdd(node: Element | null) {
    if (!node) return;
    const [count, n] = insertAfter;
    const insertAfterNodes = node.querySelectorAll(n);
    if (!insertAfterNodes.length) return;
    let afterNode;
    if (typeof count === "number") {
      afterNode = insertAfterNodes[count];
    }
    if (count === "random") {
      if (insertAfterNodes.length > 2) {
        let randomCount =
          Math.floor(Math.random() * (insertAfterNodes.length - 2)) + 1;
        afterNode = insertAfterNodes[randomCount];
      } else {
        afterNode = insertAfterNodes[0];
      }
    }
    if (!afterNode) return;
    const pos = node.getBoundingClientRect();
    adNode.style.display = "flex";
    adNode.style.left = `${-pos.left}px`;
    afterNode.insertAdjacentElement("afterend", adNode);
    setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
    }, 1000);
  }
  function handleScroll() {
    if (!adNode) return;
    const rect = adNode.getBoundingClientRect();
    if (rect.bottom < 0) {
      adNode.style.display = "none";
      window.removeEventListener("scroll", handleScroll);
    }
  }
</script>

<slot />
<div
  id="inter-outer"
  bind:this={adNode}
  class="interscroller-wrapper"
  style="display: none; height: 100vh; right: 0px; width: 100vw;"
>
  <h2 class="info-box">Advertisement</h2>
  <div
    id="intscdiv"
    class="interscroller-bg-wrapper"
    style="height: 100%; right: 0px; clip: rect(0px 100vw 100vh 0px); width: 100vw;"
  >
    <div
      id="nxtads"
      class="interscroller-bg"
      style="height: 100%; width: 100%; padding: 0px; overflow: hidden; text-align: center;"
    >
      <div
        id="smt-130304454"
        style="margin: 0px auto;width: 100%;height: 100%;/* position: absolute; *//* z-index: 1000000000; */"
      >
        <a target="_blank" on:click={trackClick} href={adData.link}>
          <img
          alt="ad_image"
          class="ad_image"
            src={adData.image}
            width="100%"
            height="100%"
          />
        </a>
      </div>
    </div>
  </div>
  <h2 class="info-box">Scroll to continue</h2>
</div>

<style>
  .info-box {
    color: var(--colors-text-text-primary-900, #fbfbfb);
    text-align: center;
    font-family: Roboto;
    font-size: 12px !important;
    font-style: normal;
    font-weight: 700 !important;
    line-height: 38px !important; /* 190% */
    text-transform: uppercase;
    width: 100%;
    margin: 0 !important;
    z-index: 1;
    background: var(--colors-background-bg-primary-solid, #313131);
  }
  .interscroller-wrapper {
    position: relative !important;
    cursor: pointer !important;
    background: #ffffff !important;
    z-index: 10000000 !important;
    flex-direction: column;
    justify-content: space-between;
    /*border-top: 2px solid #cccccc;
      border-bottom: 2px solid #cccccc;*/
  }

  .interscroller-bg-wrapper {
    position: absolute !important;
    width: 100% !important;
    left: 0 !important;
  }

  .interscroller-bg {
    position: fixed !important;
    height: 100% !important;
    top: 0;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    border: 0 !important;
  }
  .ad_image {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }

  @media (min-width: 768px) {
    .info-box {
      font-size: 20px !important;
    }
  }
</style>
