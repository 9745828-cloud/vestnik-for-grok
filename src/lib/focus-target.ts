const HIGHLIGHT_CLASSES = [
  "ring-2",
  "ring-gold",
  "ring-offset-2",
  "ring-offset-cream",
  "border-gold",
  "bg-[oklch(0.98_0.03_86)]",
  "shadow-[0_0_0_1px_oklch(0.74_0.10_80/0.55),0_18px_40px_-22px_oklch(0.36_0.12_25/0.35)]",
];

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getHashTarget(prefix?: string) {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return null;
  const decoded = safeDecode(raw);
  if (!prefix) return decoded;
  return decoded.startsWith(prefix) ? decoded.slice(prefix.length) : null;
}

export function getFocusTarget(prefix?: string) {
  if (typeof window === "undefined") return null;
  return getHashTarget(prefix) ?? new URLSearchParams(window.location.search).get("focus");
}

export function focusElementById(id: string, options?: { block?: ScrollLogicalPosition; retries?: number; delay?: number }) {
  if (typeof window === "undefined") return () => {};

  const block = options?.block ?? "center";
  const retries = options?.retries ?? 18;
  const delay = options?.delay ?? 120;
  let attempt = 0;
  let frame = 0;
  let retryTimer = 0;
  let removeTimer = 0;
  let settleTimers: number[] = [];
  let cancelled = false;

  const run = () => {
    if (cancelled) return;
    const el = document.getElementById(id);

    if (!el) {
      if (attempt >= retries) return;
      attempt += 1;
      retryTimer = window.setTimeout(run, delay);
      return;
    }

    frame = window.requestAnimationFrame(() => {
      const settleDelays = [0, 180, 420];
      settleDelays.forEach((ms) => {
        const timer = window.setTimeout(() => {
          const headerOffset = 112;
          const rectTop = el.getBoundingClientRect().top;
          const absoluteTop = window.scrollY + rectTop;
          const targetTop = block === "center"
            ? absoluteTop - Math.max((window.innerHeight - el.clientHeight) / 2, headerOffset)
            : absoluteTop - headerOffset;
          window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
        }, ms);
        settleTimers.push(timer);
      });
      el.classList.add(...HIGHLIGHT_CLASSES);
      removeTimer = window.setTimeout(() => el.classList.remove(...HIGHLIGHT_CLASSES), 8000);
    });
  };

  retryTimer = window.setTimeout(run, 60);

  return () => {
    cancelled = true;
    window.clearTimeout(retryTimer);
    window.clearTimeout(removeTimer);
    settleTimers.forEach((timer) => window.clearTimeout(timer));
    window.cancelAnimationFrame(frame);
  };
}