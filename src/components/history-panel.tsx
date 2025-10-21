import { BWBChoice, HistoryItem, ProfileState, RollType } from "../types.ts";
import { BedIcon, CloseIcon, ExternalLinkIcon, HistoryIcon, RefreshIcon, SpaceshipIcon, SwordIcon, WeddingIcon } from "./icons.tsx";
import { imageBaseURL, wikiBaseUrl } from "../app.tsx";
import { useState } from "react";

export default function HistoryPanel({
  isOpen,
  setIsOpen,
  showMnemonics,
  history,
  setHistory,
  persistent,
  setPersistent
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  showMnemonics: boolean;
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  persistent: boolean;
  setPersistent: (persistent: boolean) => void;
}) {
  const [showSkipped, setShowSkipped] = useState<boolean>(false);

  function sortByChoice(a: ProfileState, b: ProfileState) {
    const order: BWBChoice[] = [BWBChoice.BED, BWBChoice.WED, BWBChoice.BEHEAD];

    if (!a.selectedOption) return 1;
    if (!b.selectedOption) return -1;

    return order.indexOf(a.selectedOption as BWBChoice) - order.indexOf(b.selectedOption as BWBChoice);
  }

  return (
    <aside
      className={`
        bg-eclipse-700
        absolute top-0 left-0
        z-20
        py-5 px-6 pe-3
        w-[55ch] max-w-11/12
        h-screen
        transition-all
        ${isOpen ? `translate-x-0` : `-translate-x-full *:hidden`}
        flex flex-col gap-y-2
      `}
    >
      <header className="flex flex-row justify-between items-end gap-2 pe-3 mt-3.5 sticky top-8">
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

        {/* Persistent checkbox */}
        <label className="flex flex-row items-center gap-x-2 mb-2">
          Save persistent history locally
          <input
            type="checkbox"
            checked={persistent}
            onChange={(e) => {
              const newVal = e.target.checked;
              setPersistent(newVal);
              if (typeof window !== "undefined") {
                localStorage.setItem("bwb-history-persistent", newVal ? "true" : "false");
                if (!newVal) {
                  localStorage.removeItem("bwb-history");
                } else {
                  localStorage.setItem("bwb-history", JSON.stringify(history));
                }
              }
            }}
          />
        </label>
      </header>

      <p className="text-2xl font-bold text-center">History</p>

      <div className="w-full flex flex-row justify-center items-center">
        <label className="flex flex-row items-center gap-x-2">
          <input
            type="checkbox"
            checked={showSkipped}
            onChange={(e) => setShowSkipped(e.target.checked)}
          />
          Show skipped
        </label>
      </div>

      <ul className="flex flex-col gap-y-4 overflow-y-auto">
        {history
          .filter(item => showSkipped && item.rollType === RollType.SKIP || item.rollType === RollType.COMMIT)
          .map((item, index) => (
            <li className={`w-full flex flex-col justify-between bg-eclipse-500 rounded-lg p-3 gap-y-1`} key={`history-item-${item.id}`}>
              {/* Roll type */}
              <div className={`w-full flex flex-row justify-between items-center pb-1`}>
                {item.rollType === RollType.COMMIT &&
                  <p className="flex flex-row items-center gap-x-1 text-jump-500">
                    <SpaceshipIcon />
                    Committed
                  </p>
                }
                {item.rollType === RollType.SKIP &&
                  <p className="flex flex-row items-center gap-x-1 text-command-500">
                    <RefreshIcon />
                    Skipped
                  </p>
                }

                <span className="text-xs">
                  {new Date(item.date).toLocaleString()}
                </span>
              </div>

              {/* Images */}
              <div className="w-full flex flex-row justify-between items-center gap-x-2">
                {item.profiles
                  .sort(sortByChoice)
                  .map((p, pIndex) => (
                    <a
                      key={`history-item-${index}-profile-${pIndex}`}
                      className="flex flex-col items-center flex-1 text-sm gap-y-2"
                      href={p.wikiRoute ? wikiBaseUrl + p.wikiRoute : undefined}
                      target="_blank" rel="noopener"
                    >
                      <img className="size-24 rounded-sm object-contain" loading="eager" src={p.imageRoute ? imageBaseURL + p.imageRoute : "/alien-headshot.png"} crossOrigin="anonymous" alt="Headshot of character" />
                      <span>
                        {p.name}
                        <ExternalLinkIcon className="size-4 inline ms-1" />
                      </span>
                    </a>
                  ))}
              </div>

              {/* Selected options */}
              {item.rollType === RollType.COMMIT &&
                <div className="w-full flex flex-row justify-between items-center gap-x-2">
                  {item.profiles
                    .sort(sortByChoice)
                    .map(p => (
                      <span className="flex-1 flex flex-row gap-x-2 justify-center items-center [&>svg]:text-jump-500">
                        {p.selectedOption === BWBChoice.BED ? <>
                          <BedIcon className="size-8 scale-105" />
                          {BWBChoice.BED}
                        </>
                          :
                          p.selectedOption === BWBChoice.WED ? <>
                            <WeddingIcon className="size-8 scale-[85%]" />
                            {BWBChoice.WED}
                          </>
                            :
                            p.selectedOption === BWBChoice.BEHEAD ? <>
                              <SwordIcon className="size-8 scale-[70%]" />
                              {BWBChoice.BEHEAD}
                            </>
                              :
                              <>
                                <CloseIcon className="size-8" />
                                Error
                              </>
                        }
                      </span>
                    ))}
                </div>
              }
            </li>
          ))
        }
      </ul>
    </aside>
  );
}

export function HistoryPanelButton({
  isOpen,
  setIsOpen,
  showMnemonics
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  showMnemonics: boolean;
}) {
  return (
    <button
      className="px-3 hover:bg-jump-500"
      onClick={() => setIsOpen(!isOpen)}
    >
      <HistoryIcon className="size-8" />
      History
      {showMnemonics && <span className="mnum text-command-500">[{"\u2009"}h{"\u2009"}]</span>}
    </button>
  );
}