import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

function keepScrollOnReplaceState() {
  if (typeof window === "undefined") return;
  const history = window.history as History & { __validmixKeepScroll?: boolean };
  if (history.__validmixKeepScroll) return;
  history.__validmixKeepScroll = true;
  const original = history.replaceState.bind(history);
  history.replaceState = (data, unused, url) => {
    const x = window.scrollX;
    const y = window.scrollY;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    original(data, unused, url);
    const restore = () => {
      if (window.scrollX !== x || window.scrollY !== y) window.scrollTo(x, y);
    };
    restore();
    window.requestAnimationFrame(() => {
      restore();
      root.style.scrollBehavior = previous;
    });
  };
}

export function getRouter() {
  keepScrollOnReplaceState();
  return createRouter({ routeTree, defaultErrorComponent: AppErrorComponent });
}
