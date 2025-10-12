import { CloseIcon, HistoryIcon } from "./icons.tsx";

export default function HistoryPanel({
  isOpen,
  setIsOpen,
  showMnemonics,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  showMnemonics: boolean;
}) {
  return (
    <aside
      className={`
        bg-eclipse-700
        absolute top-0 left-0
        z-20
        py-5 px-6 pe-3
        w-[50ch] max-w-11/12
        h-screen
        transition-all
        ${isOpen ? `translate-x-0` : `-translate-x-full *:hidden`}
        flex flex-col gap-y-2
      `}
    >
      <header>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            z-10
            ps-5
            pe-2
            bg-star hover:bg-eclipse-500
            text-eclipse-500 hover:text-jump-500
            hover:[&_.mnum]:text-command-500
          `}
        >
          Close
          <CloseIcon className="size-6 transition-all" />
          {showMnemonics && <span className="mnum text-jump-700">[{"\u2009"}h{"\u2009"}|{"\u2009"}Esc{"\u2009"}]</span>}
        </button>
      </header>
    </aside>
  );
}

export function HistoryPanelButton({
  showMnemonics
}: {
  showMnemonics: boolean;
}) {
  return (
    <button className="px-3 hover:bg-jump-500">
      <HistoryIcon className="size-8" />
      History
      {showMnemonics && <span className="mnum text-command-500">[{"\u2009"}h{"\u2009"}]</span>}
    </button>
  );
}