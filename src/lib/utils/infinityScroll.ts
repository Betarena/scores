/**
 * Options for the infiniteScroll action.
 */
export interface InfiniteScrollOptions {
  /**
   * Distance in pixels from the bottom of the container at which to trigger loading.
   * @default 100
   */
  threshold?: number;

  /**
   * Callback invoked to load the next batch of items.
   */
  loadMore: () => void;

  /**
   * Flag indicating whether there are more items to load.
   */
  hasMore: boolean;

  /**
   * Flag indicating whether a loading operation is currently in progress.
   */
  loading: boolean;
}

/**
 * Svelte action that automatically calls `loadMore` when the user
 * scrolls within `threshold` pixels of the bottom of an element.
 *
 * @param node - The scrollable container element to observe.
 * @param options - Configuration options for the infinite scroll behavior.
 * @returns An object with `update` and `destroy` methods to manage the action.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { infiniteScroll } from '$lib/actions/infiniteScroll';
 *   let loading = false;
 *   let hasMore = true;
 *   function loadMore() {
 *     // fetch next page
 *   }
 * </script>
 *
 * <div
 *   use:infiniteScroll={{ loadMore, hasMore, loading, threshold: 150 }}
 *   style="overflow:auto; max-height:400px"
 * >
 *   {#each items as item}
 *     <ItemComponent {item} />
 *   {/each}
 * </div>
 * ```
 */
export function infiniteScroll(
  node: HTMLElement,
  options: InfiniteScrollOptions
) {
  let { threshold = 100, loadMore, hasMore, loading } = options;

  function onScroll() {
    const { scrollHeight, scrollTop, clientHeight } = node;
    if (
      scrollHeight - scrollTop - clientHeight <= threshold &&
      hasMore &&
      !loading
    ) {
      loadMore();
    }
  }

  node.addEventListener('scroll', onScroll);

  return {
    /**
     * Update the action when its parameters change.
     */
    update(newOpts: InfiniteScrollOptions) {
      threshold = newOpts.threshold ?? threshold;
      loadMore  = newOpts.loadMore;
      hasMore   = newOpts.hasMore;
      loading   = newOpts.loading;
    },

    /**
     * Cleanup the scroll listener when the element is destroyed.
     */
    destroy() {
      node.removeEventListener('scroll', onScroll);
    }
  };
}
