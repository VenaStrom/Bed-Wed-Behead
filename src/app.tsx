import { useCallback, useEffect, useMemo, useState } from "react";
import { BedIcon, GearIcon, ExternalLinkIcon, RefreshIcon, SpaceshipIcon, SwordIcon, WeddingIcon, RightArrowIcon, CheckmarkIcon, CloseIcon, SpinnerIcon, NoticeIcon } from "./components/icons.tsx";
import OptionButton from "./components/option-button.tsx";
import { BWBChoice, emptyProfile, ProfileStates, Character } from "./types.ts";
import { defaultFilters, Filter, FilterCategory, filterChar, FilterOption } from "./functions/filters.tsx";

const wikiBaseUrl = "https://starwars.fandom.com/wiki/";
const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";

export default function App() {
  const [profiles, setProfiles] = useState<ProfileStates>([{ ...emptyProfile }, { ...emptyProfile }, { ...emptyProfile }]);

  // UI state and control state
  const [isFilterPanelExpanded, setFilterPanelOpen] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [hasGottenHint, setHasGottenHint] = useState(typeof window !== "undefined" ? Boolean(sessionStorage.getItem("hasGottenHint")) : false);
  const [hasFetchedCharData, setHasFetchedCharData] = useState(false);

  const [fetchTimes, setFetchTimes] = useState<{
    characterNames: number;
    characters: number;
    categoryLookup: number;
    appearanceCLookup: number;
    appearanceNCLookup: number;
    appearanceLLookup: number;
    appearanceNCLLookup: number;
  }>({
    characterNames: Date.now(),
    characters: Date.now(),
    categoryLookup: Date.now(),
    appearanceCLookup: Date.now(),
    appearanceNCLookup: Date.now(),
    appearanceLLookup: Date.now(),
    appearanceNCLLookup: Date.now(),
  });
  const [characterNames, setCharacterNames] = useState<string[] | null>(null);
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [categoryLookup, setCategoryLookup] = useState<Record<string, string> | null>(null);
  /** Appearances in Canon */
  const [appearanceCLookup, setAppearanceCLookup] = useState<Record<string, string> | null>(null);
  /** Appearances in Non-Canon */
  const [appearanceNCLookup, setAppearanceNCLookup] = useState<Record<string, string> | null>(null);
  /** Appearances in Legends */
  const [appearanceLLookup, setAppearanceLLookup] = useState<Record<string, string> | null>(null);
  /** Appearances in Non-Canon Legends */
  const [appearanceNCLLookup, setAppearanceNCLLookup] = useState<Record<string, string> | null>(null);

  // Fetch character data
  useEffect(() => {
    if (hasFetchedCharData) return;
    setHasFetchedCharData(true);

    fetch("/db/characters-links.min.json")
      .then(res => res.json())
      .then(min => min.singleLineData.split(min.joiningCharacter))
      .then(expanded => setCharacterNames(expanded))
      .then(() => console.log(`Fetched characters-links.min.json in ${Date.now() - fetchTimes.characterNames} ms`))
      .then(() => setFetchTimes(times => ({ ...times, characterNames: Date.now() - times.characterNames })))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching character names")
      });

    fetch("/db/characters.min.json")
      .then(res => res.json())
      .then(chars => setCharacters(chars))
      .then(() => console.log(`Fetched characters.min.json in ${Date.now() - fetchTimes.characters} ms`))
      .then(() => setFetchTimes(times => ({ ...times, characters: Date.now() - times.characters })))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching character data")
      });

    fetch("/db/category-lookup.min.json")
      .then(res => res.json())
      .then(lookup => setCategoryLookup(lookup))
      .then(() => console.log(`Fetched category-lookup.min.json in ${Date.now() - fetchTimes.categoryLookup} ms`))
      .then(() => setFetchTimes(times => ({ ...times, categoryLookup: Date.now() - times.categoryLookup })))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching category lookup data")
      });

    fetch("/db/appearance-canon-lookup.min.json")
      .then(res => res.json())
      .then(lookup => setAppearanceCLookup(lookup))
      .then(() => console.log(`Fetched appearance-canon-lookup.min.json in ${Date.now() - fetchTimes.appearanceCLookup} ms`))
      .then(() => setFetchTimes(times => ({ ...times, appearanceCLookup: Date.now() - times.appearanceCLookup })))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching appearance (canon) lookup data")
      });

    fetch("/db/appearance-non-canon-lookup.min.json")
      .then(res => res.json())
      .then(lookup => setAppearanceNCLookup(lookup))
      .then(() => console.log(`Fetched appearance-non-canon-lookup.min.json in ${Date.now() - fetchTimes.appearanceNCLookup} ms`))
      .then(() => setFetchTimes(times => ({ ...times, appearanceNCLookup: Date.now() - times.appearanceNCLookup })))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching appearance (non-canon) lookup data")
      });

    fetch("/db/appearance-legends-lookup.min.json")
      .then(res => res.json())
      .then(lookup => setAppearanceLLookup(lookup))
      .then(() => console.log(`Fetched appearance-legends-lookup.min.json in ${Date.now() - fetchTimes.appearanceLLookup} ms`))
      .then(() => setFetchTimes(times => ({ ...times, appearanceLLookup: Date.now() - times.appearanceLLookup })))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching appearance (legends) lookup data")
      });

    fetch("/db/appearance-non-canon-legends-lookup.min.json")
      .then(res => res.json())
      .then(lookup => setAppearanceNCLLookup(lookup))
      .then(() => console.log(`Fetched appearance-non-canon-legends-lookup.min.json in ${Date.now() - fetchTimes.appearanceNCLLookup} ms`))
      .then(() => setFetchTimes(times => ({ ...times, appearanceNCLLookup: Date.now() - times.appearanceNCLLookup })))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching appearance (non-canon legends) lookup data")
      });

  }, [hasFetchedCharData, fetchTimes.characterNames, fetchTimes.characters, fetchTimes.categoryLookup, fetchTimes.appearanceCLookup, fetchTimes.appearanceNCLookup, fetchTimes.appearanceLLookup, fetchTimes.appearanceNCLLookup]);

  // Filter
  const [filter, setFilter] = useState<Filter>((() => {
    if (typeof window === "undefined") return defaultFilters;

    const loadedStates = window.localStorage.getItem("bwb-filter-states") ? JSON.parse(window.localStorage.getItem("bwb-filter-states") as string) : null;
    if (loadedStates) {
      return {
        ...defaultFilters,
        ...Object.fromEntries(
          Object.entries(loadedStates)
            .map(([catId, cat]: [string, FilterCategory]) => [catId, {
              ...defaultFilters[catId],
              id: cat.id,
              ...cat.state ? { state: cat.state } : {},
              filters: Object.fromEntries(Object.entries(cat.filters)
                .map(([filId, fil]: [string, FilterOption]) => [filId, {
                  ...defaultFilters[catId].filters[filId],
                  id: fil.id,
                  state: fil.state,
                }]),
              ),
            }])
        ),
      };
    }

    return defaultFilters;
  })());
  const usingDefaultFilter = useMemo(() => JSON.stringify(defaultFilters) === JSON.stringify(filter), [filter]);

  // Save filter to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const toSave = Object.fromEntries(Object.entries(filter).map(([catId, cat]) => [catId, { ...cat, filters: Object.fromEntries(Object.entries(cat.filters).map(([filId, fil]) => [filId, { id: fil.id, state: fil.state }])) }]));
      window.localStorage.setItem("bwb-filter-states", JSON.stringify(toSave));
    }
  }, [filter]);

  const [toasts, setToasts] = useState<{ text: string, good?: boolean }[]>([]);
  const toast = useCallback((text: string, good: boolean = true) => {
    setToasts([...toasts, { text, good }]);

    setTimeout(() => {
      setToasts(currentToasts => {
        const [, ...remaining] = currentToasts;
        return remaining;
      });
    }, 3000);
  }, [toasts]);

  // TODO: use to allow for single character rerolls.
  // function clearProfile(index: number) {
  //   const newProfiles = [...profiles];
  //   newProfiles[index] = { ...emptyProfile };
  //   setProfiles(newProfiles as ProfileStates);
  // }

  const clearProfiles = useCallback(() => {
    setProfiles([{ ...emptyProfile }, { ...emptyProfile }, { ...emptyProfile }]);
  }, []);

  const refresh = useCallback(() => {
    setRolls(rolls + 1);

    clearProfiles();

    if (!(categoryLookup && appearanceCLookup && appearanceNCLookup && appearanceLLookup && appearanceNCLLookup && characterNames && characters)) {
      toast("Data is still loading, please wait", false);
      return;
    }

    // Filter characters based on filter state
    const filteredCharacters = characters.filter(c => filterChar(c, filter));

    // Get 3 random characters from filtered list
    const newProfiles: ProfileStates = [0, 1, 2].map(() => {
      const randomChar = filteredCharacters[Math.floor(Math.random() * filteredCharacters.length)];
      return {
        name: randomChar.name,
        wikiRoute: randomChar.route,
        imageRoute: randomChar.image?.replace(/\/revision\/.*/, "") ?? null,
        selectedOption: null,
      };
    }) as ProfileStates;

    setProfiles(newProfiles);
  }, [appearanceCLookup, appearanceLLookup, appearanceNCLLookup, appearanceNCLookup, categoryLookup, characterNames, characters, clearProfiles, filter, rolls, toast]);

  const commit = useCallback(() => {
    setRolls(rolls + 1);

    // Stuff

    refresh();
  }, [refresh, rolls]);

  const [hasDoneInitialRole, setHasDoneInitialRole] = useState(false);
  useEffect(() => {
    if (hasDoneInitialRole) return;
    if (categoryLookup && appearanceCLookup && appearanceNCLookup && appearanceLLookup && appearanceNCLLookup && characterNames && characters) {
      refresh();
      setHasDoneInitialRole(true);
    }
  }, [hasDoneInitialRole, categoryLookup, appearanceCLookup, appearanceNCLookup, appearanceLLookup, appearanceNCLLookup, characterNames, characters, refresh]);

  return (<>
    <main className="flex flex-col items-center gap-y-6 pt-8">
      {/* Heading */}
      <header className="flex flex-col items-center gap-y-2 justify-center">
        <img src="/bwb-logo.png" title="[Aurebesh] Bed Wed & Behead" alt="Bed Wed & Behead" />
        <h1 className="text-center text-xl italic font-semibold">
          Bed Wed & Behead
        </h1>
      </header>

      {/* Filter button */}
      <div className="w-full absolute flex flex-row justify-end items-start gap-x-3">
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
        )}

        {/* Toggle filter panel */}
        <button
          onClick={() => setFilterPanelOpen(!isFilterPanelExpanded)}
          className={`
            z-10
            px-3 me-6
            hover:[&_.icon]:rotate-[120deg] 
            hover:bg-star hover:text-eclipse-500
            ${isFilterPanelExpanded ? `bg-star text-eclipse-500 [&_.icon]:rotate-[120deg]` : ``}
          `}
        >
          <GearIcon className="icon size-8 transition-all" />
          Filter
        </button>
      </div>
      {/* Filter modal bg */}
      <div
        hidden={!isFilterPanelExpanded}
        className="z-10 absolute top-0 left-0 min-w-screen w-screen min-h-screen h-screen bg-eclipse-500/30 transition-all"
        onClick={() => setFilterPanelOpen(false)}
      ></div>
      {/* Filter panel */}
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
            onClick={() => setFilter(defaultFilters)}
          >
            <RefreshIcon className="size-6 inline" />
            Reset&nbsp;filter
          </button>

          <span className="flex-1"></span>

          {/* Close filter panel button */}
          <button
            onClick={() => setFilterPanelOpen(!isFilterPanelExpanded)}
            className={`
            z-10
            ps-5
            pe-2
            bg-star hover:bg-eclipse-500
            text-eclipse-500 hover:text-jump-500
          `}
          >
            Close
            <CloseIcon className="size-6 transition-all" />
          </button>
        </header>

        <p className="text-star text-sm font-normal w-full text-center italic py-2">
          Current character pool is {characterNames?.length ?? "loading..."}
        </p>

        <div className="overflow-y-scroll flex flex-col gap-y-8 pe-3">
          {Object.values(filter).map((category) =>
            <div key={`filter-category-${category.id}`} className="flex flex-col ">
              <p className="text-lg font-bold">{category.label}</p>

              {/* If toggle is allowed */}
              {category.state !== undefined && (
                <label className="flex flex-row justify-center items-center gap-x-3 cursor-pointer mb-2">
                  <div className="flex flex-col gap-y-0.5 text-sm">
                    <span>{category.stateLabel}</span>
                  </div>

                  <input
                    checked={category.state}
                    type="checkbox"
                    onChange={() => {
                      const newFilter = { ...filter, [category.id]: { ...category, state: !category.state } };

                      setFilter(newFilter);
                    }}
                  />
                </label>
              )}

              <ul className={`flex flex-col gap-y-1 ${category.state !== undefined && !category.state ? "opacity-50 *:pointer-events-none cursor-not-allowed" : ""}`}>
                {/* Toggle buttons */}
                <li className="flex flex-row justify-start items-center gap-x-3 *:py-1 *:bg-transparent *:text-sm *:italic *:text-star/70">
                  <button className="hover:bg-hyper-400 hover:text-eclipse-700"
                    onClick={() => {
                      const newFilter = { ...filter, [category.id]: { ...category, filters: Object.fromEntries(Object.entries(category.filters).map(([filId, fil]) => [filId, { ...fil, state: true }])) } };

                      setFilter(newFilter);
                    }}
                  >
                    Enable all <CheckmarkIcon className="size-5 inline ms-1" />
                  </button>

                  <button className="hover:bg-jump-400 hover:text-star"
                    onClick={() => {
                      const newFilter = { ...filter, [category.id]: { ...category, filters: Object.fromEntries(Object.entries(category.filters).map(([filId, fil]) => [filId, { ...fil, state: false }])) } };

                      setFilter(newFilter);
                    }}
                  >
                    Disable all <CloseIcon className="size-5 inline ms-1" />
                  </button>

                  <button className="hover:bg-hyper-500 hover:text-star"
                    onClick={() => {
                      const newFilter = { ...filter, [category.id]: { ...category, filters: Object.fromEntries(Object.entries(category.filters).map(([filId, fil]) => [filId, { ...fil, state: !fil.state }])) } };

                      setFilter(newFilter);
                    }}
                  >
                    Invert <RefreshIcon className="size-5 inline ms-1" />
                  </button>
                </li>

                {Object.values(category.filters).map((f) =>
                  <li key={`filter-${f.id}`} className="flex flex-row justify-start items-center gap-x-3">
                    <label className="flex flex-row justify-start items-center gap-x-3 cursor-pointer ps-0.5 w-full">
                      <input
                        className="size-5 min-w-5"
                        checked={f.state}
                        type="checkbox"
                        onChange={() => {
                          // Disable if category is toggled off due to keyboard navigation
                          if (category.state !== undefined && !category.state) return;

                          const newFilter = { ...filter, [category.id]: { ...category, filters: { ...category.filters, [f.id]: { ...f, state: !f.state } } } };

                          setFilter(newFilter);
                        }}
                      />

                      <div className="flex flex-col gap-y-0.5">
                        <span>{f.label}</span>
                        <span className="text-xs italic text-star/70">{f.help}</span>
                      </div>
                    </label>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1"></div>

        {/* Stats */}
        < div className="text-xs text-star/70 italic flex flex-col gap-y-1 w-full" >
          <span className="text-center">
            You have <span title="Refreshed or committed" className="underline decoration-dotted cursor-help">played</span> {rolls} times this <span title="Resets on page refresh" className="underline decoration-dotted cursor-help">session</span>
          </span>
        </div>
      </aside>

      {/* Profiles */}
      <section className="flex flex-row gap-x-12 justify-center items-center">
        {new Array(3).fill(0).map((_, i) => {
          const profile = profiles[i];
          return (
            <div className="flex flex-col gap-y-4 w-2/5 rounded-xl bg-eclipse-700/60" key={`profile-column-${i}`}>
              {/* Profile */}
              <a
                href={profile.wikiRoute ? wikiBaseUrl + profile.wikiRoute : undefined}
                className={`
                  flex flex-col justify-center items-center gap-y-3 hover:[&_.link]:underline
                  ${!profile.wikiRoute && "pointer-events-none text-star/60"}
                `}
                target="_blank" rel="noopener"
              >
                <img className="size-48 rounded-sm object-contain" src={profile.imageRoute ? imageBaseURL + profile.imageRoute : "/alien-headshot.png"} crossOrigin="anonymous" alt="Headshot of character" />

                <div className="w-full flex flex-row items-center justify-center gap-x-2 h-9">
                  <p className="flex-1 text-base text-center max-w-[18ch]">{profile.name || "..."}</p>
                  <ExternalLinkIcon className="size-5 relative right-0" />
                </div>
              </a>

              {/* Answer list */}
              <ul
                className="flex flex-col gap-y-3"
              >
                <li>
                  <OptionButton
                    profiles={profiles}
                    profilesSetter={setProfiles}
                    profileIndex={i}
                    label={BWBChoice.BED}
                    icon={<BedIcon className="size-10 scale-105" />}
                  />
                </li>
                <li>
                  <OptionButton
                    profiles={profiles}
                    profilesSetter={setProfiles}
                    profileIndex={i}
                    label={BWBChoice.WED}
                    icon={<WeddingIcon className="size-10 scale-[85%]" />}
                  />
                </li>
                <li>
                  <OptionButton
                    profiles={profiles}
                    profilesSetter={setProfiles}
                    profileIndex={i}
                    label={BWBChoice.BEHEAD}
                    icon={<SwordIcon className="size-10 scale-[70%]" />}
                  />
                </li>
              </ul>
            </div>
          );
        })}
      </section>

      {/* Controls */}
      <section className="w-full flex flex-row justify-center items-center gap-x-10">
        <button onClick={refresh} className="px-3 hover:bg-hyper-500 hover:[&_.icon]:rotate-180">
          <RefreshIcon className="icon size-8 hover:rotate-180 transition-all" />
          Refresh
        </button>

        <button onClick={commit} className="px-3 hover:bg-jump-500 hover:[&_.icon]:animate-jitter">
          <SpaceshipIcon className="icon size-8" />
          Commit
        </button>
      </section>
    </main >

    <footer className={`
      flex flex-row justify-between items-end gap-x-4
      text-xs italic
      w-full absolute bottom-1
      px-2
    `}>
      {/* License */}
      <p className="flex flex-col gap-y-0.5">
        <span>
          Licensed under <a target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA</a>
        </span>
        <span>
          Data sourced from <a href="https://starwars.fandom.com/" target="_blank">Wookieepedia</a>
        </span>
      </p>

      {/* Toast */}
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

      {/* Loading status */}
      <p className="w-[26ch] flex flex-col gap-y-0.5">
        {/* Loading status texts */}
        <span className="italic text-star/70">{!(categoryLookup && appearanceCLookup && appearanceNCLookup && appearanceLLookup && appearanceNCLLookup) && "Loading lookup tables..."}</span>
        <span className="italic text-star/70">{!characterNames && "Loading character names..."}</span>
        <span className="italic text-star/70">{!characters && "Loading character data..."}</span>

        <span>
          Characters loaded:
          {" "}
          {/* Loading... while names are fetched */}
          {characterNames ? characterNames.length : "loading..."}
          {" "}
          {/* Spinner while data is being fetched */}
          {!characters && <SpinnerIcon className="size-3 inline ms-1" />}
        </span>
      </p>
    </footer>
  </>);
}