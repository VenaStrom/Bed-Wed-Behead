import React, { useCallback, useContext, useMemo, useState } from "react";
import { CloseIcon, NoticeIcon, SpaceshipIcon } from "./icons.tsx";
import { ToastContext, ToastMessage } from "./toast.internal.ts";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(current => current.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((text: string, good: boolean = true) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast: ToastMessage = { id, text, good };
    setToasts(current => [...current, newToast]);

    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ toast, removeToast, toasts }), [toast, removeToast, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function Toaster() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;

  const { toasts, removeToast } = ctx;

  return (
    <div className="z-30 flex flex-col gap-y-2 absolute w-full justify-center items-center bottom-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            bg-star text-eclipse-500
            text-lg
            [font-style:normal]
            font-normal
            rounded-lg
            p-5
            flex flex-row justify-center items-center gap-x-3
            pointer-events-auto
          `}
        >
          {t.good ? <SpaceshipIcon className="size-7 me-2" /> : <NoticeIcon className="size-7 me-2" />}
          {t.text}
          <button className="bg-transparent hover:text-jump-700" onClick={() => removeToast(t.id)}>
            <CloseIcon className="size-7" />
          </button>
        </div>
      ))}
    </div>
  );
}
