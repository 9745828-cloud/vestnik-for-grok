import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useT } from "@/i18n/lang";

const SKC_URL = "https://www.skc-agency.ru/";
const VISIBLE_MS = 8_000;

/**
 * Пасхалка SKC: показывается 8 с (достаточно, чтобы прочитать и скопировать ссылку).
 * Триггер — снаружи (10× меню за ~2 с).
 */
export function SkcEasterEgg({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => onClose(), VISIBLE_MS);
    return () => window.clearTimeout(id);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const title = t(
    "Сайт разработан профессионалами своего дела",
    "This site was crafted by professionals in their field",
  );
  const agency = t(
    "Агентством маркетинговых коммуникаций SKC",
    "by SKC Marketing Communications Agency",
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.35s ease-out both" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skc-egg-title"
    >
      {/* полупрозрачный фон; клик не закрывает — 10 с на чтение */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-sm border-2 border-gold/50 bg-gradient-to-b from-ivory to-cream shadow-[0_24px_80px_-20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

        <button
          type="button"
          onClick={onClose}
          aria-label={t("Закрыть", "Close")}
          className="absolute top-3 end-3 z-10 rounded-md border border-gold/40 bg-cream/80 p-1.5 text-bordo hover:bg-gold/15 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-8 pt-10 pb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 items-center justify-center">
            <img
              src="/skc-logo.svg"
              alt="SKC"
              className="h-16 w-auto max-w-[180px] object-contain"
            />
          </div>

          <div className="mx-auto mb-5 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />

          <p id="skc-egg-title" className="font-display text-lg md:text-xl text-bordo leading-snug">
            {title}
          </p>
          <p className="mt-2 font-display text-base text-foreground/85 leading-snug">
            {agency}
          </p>

          <a
            href={SKC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block select-all break-all font-display text-sm tracking-wide text-bordo underline decoration-gold/70 underline-offset-4 hover:text-bordo/80 hover:decoration-gold"
          >
            {SKC_URL}
          </a>

          <p className="mt-5 text-[10px] tracking-[0.2em] uppercase text-gold/80">
            {t("Окно закроется через 8 секунд", "Closes in 8 seconds")}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
