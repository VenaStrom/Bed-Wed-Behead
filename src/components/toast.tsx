import { useCallback, useState } from "react";
import { CloseIcon, NoticeIcon, SpaceshipIcon } from "./icons.tsx";

export type ToastMessage = {
  text: string;
  good?: boolean;
};

function Toaster({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="z-30 flex flex-col gap-y-2 absolute w-full justify-center items-center bottom-2 pointer-events-none">
      {toasts.map((t, i) =>
        <div
          key={`toast-${i}`}
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
          {t.good ?
            <SpaceshipIcon className="size-7 me-2" />
            :
            <NoticeIcon className="size-7 me-2" />
          }
          {t.text}
          <button className="bg-transparent hover:text-jump-700">
            <CloseIcon
              className="size-7"
              onClick={() => {
                setToasts(currentToasts => {
                  const newToasts = [...currentToasts];
                  newToasts.splice(i, 1);
                  return newToasts;
                });
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export function useToaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toast = useCallback((text: string, good: boolean = true) => {
    setToasts([...toasts, { text, good }]);

    setTimeout(() => {
      setToasts(currentToasts => {
        const [_, ...remaining] = currentToasts;
        return remaining;
      });
    }, 3000);
  }, [toasts]);

  return { toast};
}