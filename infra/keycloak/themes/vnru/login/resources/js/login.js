addEventListener("DOMContentLoaded", () => {
  const localeSelect = document.querySelector("#login-select-toggle");
  if (localeSelect) {
    localeSelect.onchange = () => {
      const target = new URL(localeSelect.value, location.href);
      const locale = target.searchParams.get("kc_locale");
      if (!/^(vi|en|ru)$/.test(locale || "")) return;
      document.cookie = `vnru_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
      location.replace(target.href);
    };
  }

  const title = document.querySelector(".vnru-auth-copy h1");
  if (!title || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const segmenter = new Intl.Segmenter(document.documentElement.lang, { granularity: "grapheme" });
  let index = 0;
  for (const node of [...title.childNodes]) {
    const textNodes = node.nodeType === Node.TEXT_NODE ? [node] : [...node.childNodes].filter((child) => child.nodeType === Node.TEXT_NODE);
    for (const textNode of textNodes) {
      const fragment = document.createDocumentFragment();
      for (const { segment } of segmenter.segment(textNode.data)) {
        const char = document.createElement("span");
        char.className = "vnru-type-char";
        char.style.setProperty("--char-index", index++);
        char.textContent = segment;
        fragment.append(char);
      }
      textNode.replaceWith(fragment);
    }
  }
}, { once: true });
