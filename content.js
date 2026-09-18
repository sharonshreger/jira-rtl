(() => {
  "use strict";

  const RTL_REGEX = /[\u0590-\u05FF\u0600-\u06FF]/;
  const LTR_REGEX = /[A-Za-z]/;
  const IGNORE_TAGS = new Set([
    "SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT",
    "SELECT", "OPTION", "SVG"
  ]);

  function getDirection(text) {
    if (!text || !text.trim()) return null;
    const rtlMatch = text.search(RTL_REGEX);
    const ltrMatch = text.search(LTR_REGEX);
    if (rtlMatch === -1 && ltrMatch === -1) return null;
    return rtlMatch !== -1 && (ltrMatch === -1 || rtlMatch < ltrMatch)
      ? "rtl"
      : "ltr";
  }

  function shouldIgnore(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
    if (IGNORE_TAGS.has(element.tagName)) return true;
    return Boolean(element.closest("pre, code"));
  }

  function applyDirection(element) {
    if (shouldIgnore(element)) return;
    const text = element.textContent?.trim();
    if (!text) return;

    const direction = getDirection(text);
    if (!direction) return;

    element.setAttribute("dir", direction);
    element.classList.add("jira-rtl-managed");
    element.classList.toggle("jira-rtl", direction === "rtl");
    element.classList.toggle("jira-ltr", direction === "ltr");
  }

  function processTextNode(textNode) {
    const parent = textNode.parentElement;
    if (!parent || shouldIgnore(parent) || !textNode.textContent?.trim()) return;
    applyDirection(parent);
  }

  function processNode(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      processTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE || shouldIgnore(root)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) processTextNode(node);
  }

  function observeChanges() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) processNode(node);
        if (mutation.type === "characterData") processTextNode(mutation.target);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function init() {
    console.log("[Jira RTL] Starting...");
    processNode(document.body);
    observeChanges();
    console.log("[Jira RTL] Ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
