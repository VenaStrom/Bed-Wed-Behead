import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshIcon, SpaceshipIcon, SpinnerIcon } from "./components/icons.tsx";
import { emptyProfile, ProfileStates, Character, Filters, FilterCategoryMeta } from "./types.ts";
import { defaultFilters, defaultFilterCategories, filterCharacters } from "./functions/filters.tsx";
import FilterPanel, { FilterPanelButton } from "./components/filter-panel.tsx";
import HistoryPanel, { HistoryPanelButton } from "./components/history-panel.tsx";
import Profile from "./components/profile.tsx";
import { useToast } from "./components/useToast.ts";
import { Toaster } from "./components/toast.tsx";

export const wikiBaseUrl = "https://starwars.fandom.com/wiki/";
export const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";

export default function App() {
  const [profiles, setProfiles] = useState<ProfileStates>([{ ...emptyProfile }, { ...emptyProfile }, { ...emptyProfile }]);

  // UI state and control state
  const { toast } = useToast();
  const [rolls, setRolls] = useState(0);
  const [hasFetchedCharData, setHasFetchedCharData] = useState<boolean>(false);
  const [showMnemonics, setShowMnemonics] = useState<boolean>(false);
  const [hasDoneInitialRole, setHasDoneInitialRole] = useState<boolean>(false);
  const [isFilterPanelExpanded, setFilterPanelExpanded] = useState<boolean>(false);
  const [isHistoryPanelExpanded, setIsHistoryPanelExpanded] = useState<boolean>(false);
  const closeModals = useCallback(() => { setFilterPanelExpanded(false); setIsHistoryPanelExpanded(false); }, []);

  const [fetchTimes, setFetchTimes] = useState<{
    characters: number;
    categoryLookup: number;
    appearanceCLookup: number;
    appearanceNCLookup: number;
    appearanceLLookup: number;
    appearanceNCLLookup: number;
  }>({
    characters: Date.now(),
    categoryLookup: Date.now(),
    appearanceCLookup: Date.now(),
    appearanceNCLookup: Date.now(),
    appearanceLLookup: Date.now(),
    appearanceNCLLookup: Date.now(),
  });
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

  }, [hasFetchedCharData, fetchTimes, fetchTimes.characters, fetchTimes.categoryLookup, fetchTimes.appearanceCLookup, fetchTimes.appearanceNCLookup, fetchTimes.appearanceLLookup, fetchTimes.appearanceNCLLookup]);

  // Filter
  const [filters, setFilters] = useState<Filters>((() => {
    if (typeof window === "undefined") return defaultFilters;

    const loadedStates: Record<string, boolean> = window.localStorage.getItem("bwb-filter-item-states") ? JSON.parse(window.localStorage.getItem("bwb-filter-item-states") as string) : null;
    if (loadedStates) {
      const loadedFilter: Filters = defaultFilters.map(f => ({
        ...f,
        state: f.state !== undefined ? Boolean(loadedStates[f.id]) : f.state,
      }));
      return loadedFilter;
    }

    return defaultFilters;
  })());
  const [filterCategories, setFilterCategories] = useState<FilterCategoryMeta[]>((() => {
    if (typeof window === "undefined") return defaultFilterCategories;

    const loadedStates: Record<string, boolean> = window.localStorage.getItem("bwb-filter-cats-states") ? JSON.parse(window.localStorage.getItem("bwb-filter-cats-states") as string) : null;
    if (loadedStates) {
      const loadedCats: FilterCategoryMeta[] = defaultFilterCategories.map(c => ({
        ...c,
        state: c.state !== undefined ? Boolean(loadedStates[c.id]) : c.state,
      }));
      return loadedCats;
    }

    return defaultFilterCategories;
  })());
  const filteredCharacters = useMemo(() => {
    if (!(categoryLookup && appearanceCLookup && appearanceNCLLookup && appearanceLLookup && appearanceNCLLookup && characters)) return null;
    return filterCharacters(characters, filters, filterCategories, categoryLookup);
  }, [appearanceCLookup, appearanceLLookup, appearanceNCLLookup, categoryLookup, characters, filters, filterCategories]);

  // Save filter to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const strippedFilters = Object.fromEntries(filters.map(f => ([f.id, f.state])));
    const strippedCategories = Object.fromEntries(filterCategories.map(c => ([c.id, c.state])));
    window.localStorage.setItem("bwb-filter-item-states", JSON.stringify(strippedFilters));
    window.localStorage.setItem("bwb-filter-cats-states", JSON.stringify(strippedCategories));
  }, [filters, filterCategories]);

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
    closeModals();

    setRolls(rolls + 1);

    clearProfiles();

    if (!(categoryLookup && appearanceCLookup && appearanceNCLookup && appearanceLLookup && appearanceNCLLookup && characters && filteredCharacters)) {
      toast("Data is still loading, please wait", false);
      return;
    }

    if (filteredCharacters.length === 0) {
      toast("No characters match the current filter", false);
      return;
    }

    if (filteredCharacters.length < 3) {
      toast(`Only ${filteredCharacters.length} characters match the current filter`, false);
      return;
    }

    // Get 3 random characters from filtered list
    const newProfiles: ProfileStates = [{ ...emptyProfile }, { ...emptyProfile }, { ...emptyProfile }];
    for (let index = 0; index < newProfiles.length; index++) {
      let randomChar: Character | null = null;

      for (let tries = 0; tries < 10; tries++) {
        const candidate = filteredCharacters[Math.floor(Math.random() * filteredCharacters.length)];

        // Already selected
        if (newProfiles.some(p => p.wikiRoute === candidate.route)) continue;

        randomChar = candidate;
        break;
      }

      if (!randomChar) {
        toast("An unknown error occurred while selecting a character", false);
        return;
      }

      newProfiles[index] = {
        name: randomChar.name,
        wikiRoute: randomChar.route,
        imageRoute: randomChar.image?.replace(/\/revision\/.*/, "") ?? null,
        selectedOption: null,
      };
    }

    setProfiles(newProfiles);
  }, [appearanceCLookup, appearanceLLookup, appearanceNCLLookup, appearanceNCLookup, categoryLookup, characters, clearProfiles, closeModals, filteredCharacters, rolls, toast]);

  const commit = useCallback(() => {
    // Missing selections
    if (profiles.some(p => !p.selectedOption)) {
      toast("Please make a selection for all three characters before committing", false);
      return;
    }

    // Colliding selections (should not be possible with current UI)
    const selections = profiles.map(p => p.selectedOption);
    if (new Set(selections).size !== selections.length) {
      toast("Please make sure all three characters have different selections before committing", false);
      return;
    }

    refresh();
  }, [profiles, refresh, toast]);

  // Initial roll when data is ready
  useEffect(() => {
    if (hasDoneInitialRole) return;
    if (categoryLookup && appearanceCLookup && appearanceNCLookup && appearanceLLookup && appearanceNCLLookup && characters) {
      refresh();
      setHasDoneInitialRole(true);
    }
  }, [hasDoneInitialRole, categoryLookup, appearanceCLookup, appearanceNCLookup, appearanceLLookup, appearanceNCLLookup, characters, refresh]);

  // Key handlers
  useEffect(() => {
    function onKeyPress(e: KeyboardEvent) {
      // Show mnemonics if filter panel is closed and 'Alt' is held
      if (showMnemonics) {
        setShowMnemonics(false);
      }
      else if (e.altKey) {
        setShowMnemonics(true);
      }

      // Open and close filter panel on 'f'
      if (e.key === "f") {
        setFilterPanelExpanded(!isFilterPanelExpanded);
      }

      // Refresh on 'r' keypress
      else if (e.key === "r") {
        refresh();
      }

      // Commit on 'Enter' keypress
      else if (e.key === "Enter") {
        commit();
      }

      // Open history panel on 'h' keypress
      else if (e.key === "h") {
        setIsHistoryPanelExpanded(!isHistoryPanelExpanded);
      }

      // Close modals on 'Escape' keypress
      else if (e.key === "Escape") {
        closeModals();
      }
    }

    window.addEventListener("keydown", onKeyPress);
    return () => window.removeEventListener("keydown", onKeyPress);
  }, [closeModals, commit, isFilterPanelExpanded, isHistoryPanelExpanded, refresh, showMnemonics]);


  return (<>
    <main className="flex flex-col h-screen items-center gap-y-6 pt-7">
      {/* Heading */}
      <header className="flex flex-col items-center gap-y-2 justify-center">
        <img className="min-h-16 max-h-full" src="/bwb-logo.png" title="[Aurebesh] Bed Wed & Behead" alt="Bed Wed & Behead" />
        <h1 className="text-center text-xl italic font-semibold">
          Bed Wed & Behead
        </h1>
      </header>

      {/* Top buttons */}
      <div className="w-full absolute flex flex-row justify-between items-start px-6">
        <HistoryPanelButton
          showMnemonics={showMnemonics}
        />

        <FilterPanelButton
          showMnemonics={showMnemonics}
          rolls={rolls}
          isOpen={isFilterPanelExpanded}
          setIsOpen={setFilterPanelExpanded}
        />
      </div>

      {/* Modal Bg */}
      <div
        hidden={!(isFilterPanelExpanded || isHistoryPanelExpanded)}
        className="z-10 absolute top-0 left-0 min-w-screen w-screen min-h-screen h-screen bg-eclipse-500/30 transition-all"
        onClick={closeModals}
      />

      <FilterPanel
        filters={filters}
        filterCategories={filterCategories}
        filteredCharacters={filteredCharacters}
        isOpen={isFilterPanelExpanded}
        setIsOpen={setFilterPanelExpanded}
        setFilters={setFilters}
        setFilterCategories={setFilterCategories}
        refresh={refresh}
        rolls={rolls}
        showMnemonics={showMnemonics}
      />

      <HistoryPanel
        isOpen={isHistoryPanelExpanded}
        setIsOpen={setIsHistoryPanelExpanded}
        showMnemonics={showMnemonics}
      />

      {/* Profiles */}
      <section className="flex flex-row gap-x-12 justify-center items-center">
        {new Array(3).fill(0).map((_, i) =>
          <Profile
            key={`profile-${i}`}
            index={i}
            profiles={profiles}
            setProfiles={setProfiles}
          />
        )}
      </section>

      {/* Refresh and Commit */}
      <section className="w-full flex flex-row justify-center items-center gap-x-10 pb-4">
        <button onClick={refresh} className="px-3 hover:bg-hyper-500 hover:[&_.icon]:rotate-180">
          <RefreshIcon className="icon size-8 hover:rotate-180 transition-all" />
          Refresh
          {showMnemonics && <span className="text-command-500">[{"\u2009"}r{"\u2009"}]</span>}
        </button>

        <button onClick={commit} className="px-3 hover:bg-jump-500 hover:[&_.icon]:animate-jitter">
          <SpaceshipIcon className="icon size-8" />
          Commit
          {showMnemonics && <span className="text-command-500">[{"\u2009"}Enter{"\u2009"}]</span>}
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

      <Toaster />

      {/* Loading status */}
      <p className="w-[22ch] flex flex-col gap-y-0.5">
        {/* Loading status texts */}
        <span className="italic text-star/70">{!(categoryLookup && appearanceCLookup && appearanceNCLookup && appearanceLLookup && appearanceNCLLookup) && "Loading lookup tables..."}</span>
        <span className="italic text-star/70">{!characters && "Loading character data..."}</span>

        <span>
          Current pool:
          {" "}
          {filteredCharacters ? filteredCharacters.length : "calculating..."}
        </span>

        <span className="flex flex-row justify-start items-center">
          Characters loaded:
          {" "}
          {characters ? characters.length : <SpinnerIcon className="size-3 inline ms-1" />}
        </span>
      </p>
    </footer>
  </>);
}