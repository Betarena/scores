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

  let scrollContainer: HTMLElement | Window = getScrollParent(node) ?? window;

  const attach = (c: HTMLElement | Window) =>
    c.addEventListener("scroll", onScroll);
  const detach = (c: HTMLElement | Window) =>
    c.removeEventListener("scroll", onScroll);

  function onScroll() {
    let scrollHeight: number;
    let scrollTop: number;
    let clientHeight: number;

    if (scrollContainer instanceof Window) {
      scrollHeight = document.documentElement.scrollHeight;
      scrollTop = window.scrollY;
      clientHeight = window.innerHeight;
    } else {
      scrollHeight = scrollContainer.scrollHeight;
      scrollTop = scrollContainer.scrollTop;
      clientHeight = scrollContainer.clientHeight;
    }

    if (
      scrollHeight - scrollTop - clientHeight <= threshold &&
      hasMore &&
      !loading
    ) {
      loadMore();
    }
  }

  attach(scrollContainer);
  setTimeout(onScroll, 0);

  return {
    update(newOpts: InfiniteScrollOptions) {
      threshold = newOpts.threshold ?? threshold;
      loadMore = newOpts.loadMore;
      hasMore = newOpts.hasMore;
      loading = newOpts.loading;

      const newContainer = getScrollParent(node) ?? window;
      if (newContainer !== scrollContainer) {
        detach(scrollContainer);
        scrollContainer = newContainer;
        attach(scrollContainer);
      }

      setTimeout(onScroll, 0);
    },

    destroy() {
      detach(scrollContainer);
    },
  };
}

function getScrollParent(element: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = element;
  while (el && el !== document.body) {
    const style = getComputedStyle(el);
    const overflowY = style.overflowY;
    const canScroll = /(auto|scroll)/.test(overflowY);
    const hasScrollbar = el.scrollHeight > el.clientHeight;

    if (canScroll && hasScrollbar) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
