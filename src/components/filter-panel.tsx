import { useState } from "react";
import { CheckmarkIcon, CloseIcon, GearIcon, RefreshIcon, RightArrowIcon } from "./icons.tsx";

export default function FilterPanel({ }: {}) {
  return (
    <aside
      className={`
        bg-eclipse-700
        absolute top-0 right-0
        z-20
        py-5 px-6 pe-3
        w-[50ch] max-w-11/12
        h-screen
        transition-all
        ${isFilterPanelExpanded ? `translate-x-0` : `translate-x-full *:hidden`}
        flex flex-col gap-y-2
      `}
    >
      <header className="flex flex-row justify-between items-end gap-2 pe-3 mt-3.5 sticky top-8">
        {/* Reset filter button */}
        <button
          className={`w-fit px-3 hover:bg-hyper-500 transition-all ${usingDefaultFilter ? "hidden" : ""}`}
          onClick={() => { setFilter(defaultFilters); setFilterCategories(defaultFilterCategories); }}
        >
          <RefreshIcon className="size-6 inline" />
          Reset&nbsp;filter
        </button>

        <span className="flex-1"></span>

        {/* Close filter panel button */}
        <button
          onClick={() => setFilterPanelExpanded(!isFilterPanelExpanded)}
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
          {showMnemonics && <span className="mnum text-jump-700">[{"\u2009"}f{"\u2009"}|{"\u2009"}Esc{"\u2009"}]</span>}
        </button>
      </header>

      <p className="text-2xl font-bold text-center">Filters</p>

      <div className="overflow-y-scroll flex flex-col gap-y-8 pe-3">
        {filterCategories.map((category) =>
          <div key={`filter-category-${category.id}`} className="flex flex-col ">
            <p className="text-lg font-bold">{category.name}</p>

            {/* If toggle category is allowed */}
            {category.state !== undefined && (
              <label className="flex flex-row justify-center items-center gap-x-3 cursor-pointer mb-2">
                <div className="flex flex-col gap-y-0.5 text-sm">
                  <span>{category.label}</span>
                </div>

                <input
                  checked={category.state}
                  type="checkbox"
                  onChange={() => {
                    const newCategories = filterCategories.map(c => c.id === category.id ? { ...c, state: !c.state } : c);
                    setFilterCategories(newCategories);
                  }}
                />
              </label>
            )}

            <ul className={`flex flex-col gap-y-1 ${category.state !== undefined && !category.state ? "opacity-50 *:pointer-events-none cursor-not-allowed" : ""}`}>
              {/* Mass operations buttons */}
              <li className="flex flex-row justify-start items-center gap-x-3 *:py-1 *:bg-transparent *:text-sm *:italic *:text-star/70">
                <button className="hover:bg-hyper-400 hover:text-eclipse-700"
                  onClick={() => {
                    // All filters in this category to true
                    const newFilters = [...filter.map(f => f.category === category.id ? { ...f, state: true } : f)];
                    setFilter(newFilters);
                  }}
                >
                  Enable all <CheckmarkIcon className="size-5 inline ms-1" />
                </button>

                <button className="hover:bg-jump-400 hover:text-star"
                  onClick={() => {
                    // All filters in this category to false
                    const newFilters = [...filter.map(f => f.category === category.id ? { ...f, state: false } : f)];
                    setFilter(newFilters);
                  }}
                >
                  Disable all <CloseIcon className="size-5 inline ms-1" />
                </button>

                <button className="hover:bg-hyper-500 hover:text-star"
                  onClick={() => {
                    // Invert all filters in this category
                    const newFilters = [...filter.map(f => f.category === category.id ? { ...f, state: !f.state } : f)];
                    setFilter(newFilters);
                  }}
                >
                  Invert <RefreshIcon className="size-5 inline ms-1" />
                </button>
              </li>

              {/* All filter options in category */}
              {filter.filter(f => f.category === category.id).map(f =>
                <li key={`filter-${f.id}`} className="flex flex-row justify-start items-center gap-x-3">
                  <label className="flex flex-row justify-start items-center gap-x-3 cursor-pointer ps-0.5 w-full">
                    <input
                      className="size-5 min-w-5"
                      checked={f.state}
                      type="checkbox"
                      onChange={() => {
                        const newFilters = filter.map(fl => fl.id === f.id ? { ...fl, state: !fl.state } : fl);
                        setFilter(newFilters);
                      }}
                    />

                    <div className="flex flex-col gap-y-0.5">
                      <span>{f.label}</span>
                      <span className="text-xs italic text-star/70">{f.description}</span>
                    </div>
                  </label>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <p className="text-star text-sm font-normal w-full text-center py-2">
        Current character pool is {filteredCharacters?.length ?? "loading..."}
      </p>

      <button
        onClick={refresh}
        className="px-3 hover:bg-hyper-500 hover:[&_.icon]:rotate-180 flex flex-row justify-center items-center pe-10"
      >
        <RefreshIcon className="icon size-8 hover:rotate-180 transition-all" />
        Play
        {showMnemonics && <span className="text-command-500">[{"\u2009"}r{"\u2009"}]</span>}
      </button>

      {/* Stats */}
      < div className="text-xs text-star/70 italic flex flex-col gap-y-1 w-full" >
        <span className="text-center">
          You have <span title="Refreshed or committed" className="underline decoration-dotted cursor-help">played</span> {rolls} times this <span title="Resets on page refresh" className="underline decoration-dotted cursor-help">session</span>
        </span>
      </div>
    </aside>
  );
}

export function FilterPanelButton({ }: {}) {
  const [hasGottenHint, setHasGottenHint] = useState(typeof window !== "undefined" ? Boolean(sessionStorage.getItem("hasGottenHint")) : false);

  return (
    <div className="flex flex-row justify-end items-start gap-x-3">
      {/* Filter hint */}
      {!hasGottenHint && !isFilterPanelExpanded && rolls >= 3 && (
        <div className={`
          bg-eclipse-500
          rounded-lg
          p-3
          flex flex-col justify-center items-center gap-y-2
          shadow-eclipse-700 shadow-2xl
        `}>
          <div className="flex flex-row justify-start items-center gap-x-2">
            <span>
              Never heard of {" "}
              <a
                className="visited:text-shadow-hyper-500"
                href="https://starwars.fandom.com/wiki/Unidentified_Hebekrr_Minor_magistrate%27s_granddaughter%27s_wife"
                target="_blank"
              >
                Unidentified Hebekrr Minor magistrate's granddaughter's wife
              </a>?
            </span>

            <span className="flex flex-row justify-start items-center">
              Try these filters!
              <RightArrowIcon className="size-6 ms-2 inline" />
            </span>
          </div>

          {/* Confirm hint */}
          <button
            onClick={() => {
              setHasGottenHint(true);
              sessionStorage.setItem("hasGottenHint", "true");
            }}
            className="bg-eclipse-700 hover:bg-jump-500"
          >
            <CheckmarkIcon className="size-6" />
            Got it!
          </button>
        </div>
      )
      }

      {/* Toggle filter panel */}
      <button
        onClick={() => setFilterPanelExpanded(!isFilterPanelExpanded)}
        className={`
          z-10
          px-3
          hover:[&_.icon]:rotate-[120deg] 
          hover:[&_.mnum]:text-jump-500
          hover:bg-star hover:text-eclipse-500
          ${isFilterPanelExpanded ? `bg-star text-eclipse-500 [&_.icon]:rotate-[120deg]` : ``}
        `}
      >
        <GearIcon className="icon size-8 transition-all" />
        Filter
        {showMnemonics && <span className="mnum text-command-500">[{"\u2009"}f{"\u2009"}]</span>}
      </button>
    </div >
  );
}