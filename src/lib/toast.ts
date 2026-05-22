"use client";

export interface ToastEvent {
  message: string;
  tone?: "info" | "success" | "warn" | "error";
  durationMs?: number;
}

const EVENT_NAME = "mizan.toast";

export function toast(message: string, opts: Omit<ToastEvent, "message"> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastEvent>(EVENT_NAME, {
    detail: { message, tone: opts.tone ?? "info", durationMs: opts.durationMs ?? 2400 },
  }));
}

export function onToast(handler: (e: ToastEvent) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (event: Event) => handler((event as CustomEvent<ToastEvent>).detail);
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
