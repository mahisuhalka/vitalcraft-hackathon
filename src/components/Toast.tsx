"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Tone = "success" | "error" | "info";
interface Toast {
  id: number;
  tone: Tone;
  message: string;
}

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const toneStyle: Record<Tone, string> = {
  success: "bg-emerald-deep text-white",
  error: "bg-[#5a1a15] text-white",
  info: "bg-panel-2 text-ink",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const push = useCallback((message: string, tone: Tone = "info") => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-2), { id, tone, message }]);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDone={() => setToasts((all) => all.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 6000);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`vc-panel pointer-events-auto flex max-w-md animate-rise items-start gap-3 px-4 py-3 ${toneStyle[toast.tone]}`}>
      <p className="text-sm font-bold">{toast.message}</p>
      <button type="button" onClick={onDone} className="ml-auto -mr-1 px-1 font-display text-lg leading-none" aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
