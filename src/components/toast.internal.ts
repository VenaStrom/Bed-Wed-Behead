import { createContext } from "react";

export type ToastMessage = {
  id: string;
  text: string;
  good?: boolean;
};

export type ToastContextValue = {
  toast: (text: string, good?: boolean) => void;
  removeToast: (id: string) => void;
  toasts: ToastMessage[];
};

export const ToastContext = createContext<ToastContextValue | null>(null);
