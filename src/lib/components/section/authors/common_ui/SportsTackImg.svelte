<script>
  import { getOptimizedImageUrl } from "$lib/utils/image";

  export let src =
    "https://s3-alpha-sig.figma.com/img/ead9/422f/35e3b50c15d637cc9219c84e6578d300?Expires=1721001600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EmvyAFwy5cFn4kbaOCzPBmg2mcO6P7VUi~P0P46f86WYbq52HvxuxJgpqXFcOuXP-G5q5Lsv6jzPovh1Xt-aeEKnDtwgZoMG2TpTw41A5LJAAFFMbYcVwEAqBPWf4VT3SVc-hXB8u~dk7IT-Ntu77WBnXLTGKCZePMQykjBbrkS0NTiFhvHFIOAmbQ-HmlgIdvrJZxvVQR2f0Xe9g5qX2Tle37SNqA2EjlOaxzMbn4zw8MXcRkAOzATeOzao1GNdD3yUt~pHs6EDiRVLxf9xjKXYsYdUn~geDu12j7HP9CNuW9nC~CgzE6NeTQLFi0UjU3aQuYVsSDJTYAAg06hM-A__";
</script>

<div
  class="sportstack-image"
  style=
  "
  background: url({getOptimizedImageUrl({ strImageUrl: src })}) lightgray -10.166px -9.798px / 143.179% 143.179% no-repeat;
  background-image: url({getOptimizedImageUrl({ strImageUrl: src })});
  "
/>

<style>
  .sportstack-image {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    object-fit: cover;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
