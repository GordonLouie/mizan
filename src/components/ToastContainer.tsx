"use client";

import { useEffect, useState } from "react";
import { onToast, type ToastEvent } from "@/lib/toast";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

interface Live extends ToastEvent { id: number; }

const TONE_STYLES = {
  info:    { bg: "bg-navy-800",     icon: Info,          accent: "text-blue-300" },
  success: { bg: "bg-emerald-700",  icon: CheckCircle2,  accent: "text-emerald-200" },
  warn:    { bg: "bg-amber-700",    icon: AlertTriangle, accent: "text-amber-200" },
  error:   { bg: "bg-rose-700",     icon: AlertCircle,   accent: "text-rose-200" },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Live[]>([]);

  useEffect(() => {
    return onToast((e) => {
      const id = Date.now() + Math.random();
      const live: Live = { ...e, id };
      setToasts((current) => [...current, live]);
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, e.durationMs ?? 2400);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
    >
      {toasts.map((t) => {
        const tone = TONE_STYLES[t.tone ?? "info"];
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            className={
              "pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white shadow-lg " +
              tone.bg + " animate-in slide-in-from-bottom-4 duration-200"
            }
            style={{ maxWidth: 420 }}
          >
            <Icon size={16} className={tone.accent + " flex-shrink-0"} />
            <span className="font-medium">{t.message}</span>
            <button
              type="button"
              onClick={() => setToasts((current) => current.filter((x) => x.id !== t.id))}
              className="ml-2 rounded p-0.5 opacity-60 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
