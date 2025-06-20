import { mergeAttributes, Node } from "@tiptap/core";
import LoaderImage from "$lib/components/ui/loaders/LoaderImage.svelte";
import Image from "@tiptap/extension-image";
import userSettings from "$lib/store/user-settings.js";
import { Plugin } from "prosemirror-state";
import session from "$lib/store/session.js";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options: {
            conversation: string;
            align: string;
            theme: string;
            width: number;
          }
        ) => Promise<void>;
      };
    };
  }
}

export const ImageWithPlaceholder = Image.extend({
  name: "imageWithPlaceholder",

  addAttributes() {
    return {
      ...this.parent?.(),
      id: { default: null },
      loading: { default: false },
      style: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).getAttribute("style"),
        renderHTML: (attrs) => {
          return { style: attrs.style };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-placeholder-image]",
        getAttrs: (el) => ({
          id: el.getAttribute("data-id"),
          loading: el.getAttribute("data-loading") === "true",
          style: el.getAttribute("style"),
        }),
      },
      {
        tag: "img[src]",
        getAttrs: (dom) => ({
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt"),
          title: dom.getAttribute("title"),
          style: dom.getAttribute("style"),
          loading: false,
          id: null,
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    if (HTMLAttributes.loading) {
      return [
        "span",
        mergeAttributes(HTMLAttributes, {
          "data-placeholder-image": "",
          "data-id": HTMLAttributes.id,
          "data-loading": "true",
        }),
      ];
    }
    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        src: HTMLAttributes.src,
        alt: HTMLAttributes.alt,
        title: HTMLAttributes.title,
        style: HTMLAttributes.style,
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const { loading, src, alt, title, style } = node.attrs;
      const dom = loading
        ? document.createElement("div")
        : document.createElement("img");

      if (loading) {
        dom.setAttribute("data-placeholder-image", "");
        if (node.attrs.id) dom.setAttribute("data-id", node.attrs.id);
        dom.setAttribute("data-loading", "true");
        if (style) dom.setAttribute("style", style);
        const loaderWrapper = document.createElement("div");
        loaderWrapper.style.cssText = `
          width: 100%; height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        dom.appendChild(loaderWrapper);

        new LoaderImage({
          target: loaderWrapper,
          props: {
            width: "100%",
            height: "100%",
            borderRadius: 12,
          },
        });
      } else {
        dom.setAttribute("src", src);
        if (alt) dom.setAttribute("alt", alt);
        if (title) dom.setAttribute("title", title);
        if (style) dom.setAttribute("style", style);
      }

      return { dom };
    };
  },
});

export const Tweet = Node.create({
  name: "tweet",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      theme: { default: "dark" },
    };
  },

  parseHTML() {
    const { theme: userTheme } = userSettings.extractAll();
    return [
      {
        tag: "blockquote.twitter-tweet",
        getAttrs: (el: HTMLElement) => {
          const src =
            el.getAttribute("src") ??
            el.querySelector<HTMLAnchorElement>("a[href]")?.href;
          const theme = userTheme === "Dark" ? "dark" : "light";
          return { src, theme };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, { class: "twitter-tweet" }),
      ["a", { href: HTMLAttributes.src }, ""],
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const { src, theme } = node.attrs;
      const container = document.createElement("blockquote");
      container.classList.add("twitter-tweet");
      container.setAttribute("data-theme", theme);
      container.style.minHeight = "200px";
      container.style.position = "relative";

      const loaderWrapper = document.createElement("div");
      loaderWrapper.style.cssText = `
        width: 100%; height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      container.appendChild(loaderWrapper);

      new LoaderImage({
        target: loaderWrapper,
        props: {
          width: "70%",
          height: "100%",
          borderRadius: 12,
        },
      });

      const tweetId = extractTweetId(src);
      if (!tweetId) {
        loaderWrapper.remove();
        container.textContent = "Invalid Tweet URL";
        return { dom: container };
      }

      const render = () => {
        const { viewportType } = session.extractAll();
        window.twttr?.widgets
          .createTweet(tweetId, container, {
            conversation: "none",
            align: "center",
            theme,
            width: viewportType === "mobile" ? 350 : 550,
          })
          .then(() => {
            loaderWrapper.remove();
          })
          .catch(() => {
            loaderWrapper.remove();
            container.innerHTML = `<a href="${src}" target="_blank">${src}</a>`;
          });
      };

      if (window.twttr?.widgets) {
        render();
      } else {
        window.addEventListener("twttr:loaded", render, { once: true });
      }

      return { dom: container };
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            const text = event.clipboardData?.getData("text/plain") || "";
            const match = text.match(
              /^https:\/\/(?:twitter|x)\.com\/[^/]+\/status\/\d+/
            );
            if (match) {
              const node = view.state.schema.nodes.tweet.create({
                src: match[0],
              });
              view.dispatch(view.state.tr.replaceSelectionWith(node));
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});

export const YouTube = Node.create({
  name: "youtube",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
        getAttrs: (el) => ({ src: el.getAttribute("src") }),
      },
      {
        tag: 'iframe[src*="youtu.be"]',
        getAttrs: (el) => ({ src: el.getAttribute("src") }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const safeSrc = normalizeYouTubeSrc(HTMLAttributes.src);

    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        class: "embed",
        src: safeSrc,
        width: "100%",
        frameborder: "0",
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowfullscreen: "true",
        style: "aspect-ratio: 16 / 9;",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const { src } = node.attrs;
      const container = document.createElement("div");
      container.style.position = "relative";
      container.style.minHeight = "200px";
      container.classList.add("embed");

      // 1) прелоадер
      const loaderWrapper = document.createElement("div");
      loaderWrapper.style.cssText = `
        width: 100%; height: 315px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      container.appendChild(loaderWrapper);
      new LoaderImage({
        target: loaderWrapper,
        props: { width: "100%", height: "100%", borderRadius: 12 },
      });

      // 2) создаём iframe
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", normalizeYouTubeSrc(src));
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      iframe.style.width = "100%";
      iframe.style.aspectRatio  = '16 / 9'
      iframe.style.display = "none";

      iframe.onload = () => {
        loaderWrapper.remove();
        iframe.style.display = "block";
      };

      container.appendChild(iframe);
      return { dom: container };
    };
  },

  addProseMirrorPlugins() {
    const YT_REGEX =
  /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/))([\w-]{11})(?:[?&][^\s]*)?$/;

    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            const text = event.clipboardData?.getData("text/plain") ?? "";
            const match = text.match(YT_REGEX);
            if (!match) return false;

            const url = match[0];
            const node = view.state.schema.nodes.youtube.create({ src: url });
            view.dispatch(view.state.tr.replaceSelectionWith(node));
            return true;
          },
        },
      }),
    ];
  },
});

function extractTweetId(url: string): string | null {
  const m = url.match(/status\/(\d+)/);
  return m ? m[1] : null;
}

/* --- helpers --- */
function normalizeYouTubeSrc(url: string): string {
  //  a) https://youtu.be/ID?xyz
  const short = url.match(/youtu\.be\/([\w-]{11})/)
  if (short) return `https://www.youtube.com/embed/${short[1]}`

  //  b) https://www.youtube.com/watch?v=ID&anything
  const watch = url.match(/[?&]v=([\w-]{11})/)
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`

  //  c) уже embed-формат или что-то другое — оставляем как есть
  return url
}
