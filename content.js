(() => {
  "use strict";

  const RTL_RE = /[\u0590-\u05FF\u0600-\u06FF]/;
  const LTR_RE = /[A-Za-z]/;
  const SKIP_SELECTOR = [
    "script", "style", "svg", "canvas", "pre", "code",
    "[data-testid*='icon']", "[aria-hidden='true']"
  ].join(",");

  const JIRA_CONTENT_SELECTORS = [
    "[data-testid*='issue.views.issue-base.foundation.summary']",
    "[data-testid*='issue.views.field.rich-text.description']",
    "[data-testid*='issue.views.field.rich-text']",
    "[data-testid*='comment']",
    "[data-testid*='activity']",
    "[data-testid*='issue-field']",
    "[data-testid*='card']",
    "[data-testid*='modal']",
    "[role='dialog']",
    "[contenteditable='true']",
    "textarea",
    "input[type='text']"
  ].join(",");

  function directionOf(text) {
    const value = (text || "").trim();
    if (!value) return null;
    const rtl = value.search(RTL_RE);
    const ltr = value.search(LTR_RE);
    if (rtl < 0 && ltr < 0) return null;
    return rtl >= 0 && (ltr < 0 || rtl < ltr) ? "rtl" : "ltr";
  }

  function mark(element, direction) {
    if (!element || !direction) return;
    element.setAttribute("dir", direction);
    element.classList.add("jira-rtl-managed");
    element.classList.toggle("jira-rtl", direction === "rtl");
    element.classList.toggle("jira-ltr", direction === "ltr");
  }

  function processEditable(element) {
    const text = element.value ?? element.innerText ?? element.textContent ?? "";
    mark(element, directionOf(text));
  }

  function processBlock(element) {
    if (!element || element.matches(SKIP_SELECTOR) || element.closest("pre, code")) return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent || parent.matches(SKIP_SELECTOR) || parent.closest("pre, code")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent) continue;

      // Prefer paragraph/list/heading-level direction so mixed Jira UI is untouched.
      const target = parent.closest("p, li, blockquote, h1, h2, h3, h4, h5, h6") || parent;
      mark(target, directionOf(node.textContent));
    }
  }

  function processRoot(root = document) {
    if (!(root instanceof Document || root instanceof Element)) return;

    if (root instanceof Element && root.matches(JIRA_CONTENT_SELECTORS)) {
      root.matches("textarea,input,[contenteditable='true']")
        ? processEditable(root)
        : processBlock(root);
    }

    root.querySelectorAll(JIRA_CONTENT_SELECTORS).forEach((element) => {
      element.matches("textarea,input,[contenteditable='true']")
        ? processEditable(element)
        : processBlock(element);
    });
  }

  let scheduled = false;
  const pendingRoots = new Set();

  function schedule(root) {
    if (root instanceof Element) pendingRoots.add(root);
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      if (!pendingRoots.size) {
        processRoot(document);
        return;
      }
      const roots = [...pendingRoots];
      pendingRoots.clear();
      roots.forEach(processRoot);
    });
  }

  function observe() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          schedule(mutation.target.parentElement);
          continue;
        }
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) schedule(node);
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    document.addEventListener("input", (event) => {
      const target = event.target;
      if (target instanceof Element && target.matches("textarea,input,[contenteditable='true']")) {
        processEditable(target);
      }
    }, true);
  }

  function init() {
    processRoot(document);
    observe();
    console.log("[Jira RTL] v0.2.0 ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
