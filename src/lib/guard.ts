if (typeof window !== "undefined") {
  window.addEventListener(
    "error",
    (event) => {
      const msg = String(event?.message || event?.error?.message || "");
      if (/invalid url|failed to construct 'url'/i.test(msg)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    const msg = reason instanceof Error ? String(reason.message || "") : String(reason || "");
    if (/invalid url|failed to construct 'url'/i.test(msg)) {
      event.preventDefault();
    }
  });
}

export {};
