import { useEffect, useMemo, useState } from "react";
import { BedIcon, GearIcon, ExternalLinkIcon, RefreshIcon, SpaceshipIcon, SwordIcon, WeddingIcon, LinkIcon, RightArrowIcon, CheckmarkIcon, CloseIcon, SpinnerIcon } from "./components/icons.tsx";
import OptionButton from "./components/option-button.tsx";
import { BWBChoice, type Character, type ProfileState } from "./types.ts";
import { protoDecode } from "./proto/proto.ts";
import { base64ToUint8Array } from "./functions/baseConverter.ts";

const wikiBaseUrl = "https://starwars.fandom.com/wiki/";
const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";

export default function App() {
  const [profiles, setProfiles] = useState<[ProfileState, ProfileState, ProfileState]>([
    {
      name: null,
      wikiLink: null,
      imageLink: null,
      selectedOption: null,
    },
    {
      name: null,
      wikiLink: null,
      imageLink: null,
      selectedOption: null,
    },
    {
      name: null,
      wikiLink: null,
      imageLink: null,
      selectedOption: null,
    }
  ]);
  // UI state and control state
  const [isFilterPanelExpanded, setFilterPanelOpen] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [hasGottenHint, setHasGottenHint] = useState(typeof window !== "undefined" ? Boolean(localStorage.getItem("hasGottenHint")) : false);
  const [hasFetchedCharData, setHasFetchedCharData] = useState(false);

  // Character names
  const [minCharNamesFetchTime, setMinCharNamesFetchTime] = useState<number>(Date.now());
  const [minimizedCharacterNames, setMinimizedCharacterNames] = useState<string[] | null>(null);
  const characterNames: string[] | null = useMemo(() => minimizedCharacterNames || null, [minimizedCharacterNames]);
  // Character details
  const [minCharFetchTime, setMinCharFetchTime] = useState<number>(Date.now());
  const [minimizedCharacters, setMinimizedCharacters] = useState<Character[] | null>(null);
  const characters: Character[] | null = useMemo(() => minimizedCharacters || null, [minimizedCharacters]);

  // Fetch character data
  useEffect(() => {
    if (hasFetchedCharData) return;
    setHasFetchedCharData(true);

    fetch("/db/characters-links.min.json")
      .then(res => res.json())
      .then(min => min.singleLineData.split(min.joiningCharacter))
      .then(expanded => setMinimizedCharacterNames(expanded))
      .then(() => console.log(`Fetched characters-links.min.json in ${Date.now() - minCharNamesFetchTime} ms`))
      .then(() => setMinCharNamesFetchTime(Date.now() - minCharNamesFetchTime))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching character names")
      });

    fetch("/db/characters.min.json")
      .then(res => res.json())
      .then(base64 => protoDecode(base64ToUint8Array(base64 as string)))
      .then(chars => setMinimizedCharacters(chars))
      .then(() => console.log(`Fetched characters.min.json in ${Date.now() - minCharFetchTime} ms`))
      .then(() => setMinCharFetchTime(Date.now() - minCharFetchTime))
      .catch((e) => {
        console.error(e);
        alert("A critical error occurred while fetching character data")
      });
  }, [hasFetchedCharData, minCharFetchTime, minCharNamesFetchTime]);

  function refresh() {
    setRolls(rolls + 1);
  }

  function commit() {
    // Stuff

    refresh();
  }

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
                localStorage.setItem("hasGottenHint", "true");
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
        className="z-10 absolute top-0 left-0 min-w-screen w-screen min-h-screen h-screen bg-eclipse-500/20 transition-all"
        onClick={() => setFilterPanelOpen(false)}
      ></div>
      {/* Filter panel */}
      <aside
        className={`
          bg-eclipse-700
          absolute top-0 right-0 
          z-20
          py-5 px-6
          w-11/12 md:w-2/5
          h-screen
          transition-all
          ${isFilterPanelExpanded ? `translate-x-0` : `translate-x-full *:hidden`}
          flex flex-col gap-y-6
        `}
      >
        <header className="flex flex-row justify-between items-center mt-3.5 sticky top-8">
          <button className="w-fit px-3 hover:bg-hyper-500">
            <LinkIcon
              className="size-8"
            />
            Share filter
          </button>

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
            <CloseIcon className="size-8 transition-all" />
          </button>
        </header>

        <p className="text-star text-sm font-normal w-full text-center italic">
          Current character pool is {2332}
        </p>

        <div>
          <p className="text-lg font-bold">Miscellaneous</p>
          <ul>

          </ul>
        </div>

        <div>
          <p className="text-lg font-bold">Canonicity</p>
          <ul>

          </ul>
        </div>

        <div>
          <p className="text-lg font-bold">Appearances</p>
          <ul>

          </ul>
        </div>

        <div>
          <p className="text-lg font-bold">Gender</p>
          <ul>

          </ul>
        </div>
      </aside>

      {/* Profiles */}
      <section className="flex flex-row gap-x-8 justify-center items-center">
        {new Array(3).fill(0).map((_, i) => {
          const profile = profiles[i];
          return (
            <div className="flex flex-col gap-y-4" key={`profile-column-${i}`}>
              {/* Profile */}
              <a
                href={profile.wikiLink ?? ""}
                className={`
                  flex flex-col justify-center items-center gap-y-2 hover:[&_.link]:underline
                  ${!profile.wikiLink && "pointer-events-none text-star/60"}
                `}
                target="_blank" rel="noopener"
              >
                <img className="size-48 rounded-sm" src={profile.imageLink || "/alien-headshot.png"} alt="Headshot of character" />
                <div className="w-full flex flex-row gap-x-2 items-center justify-end">
                  <span className="w-full text-lg text-center">{profile.name || "..."}</span>
                  <ExternalLinkIcon className="size-5 absolute" />
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
    </main>

    <footer className={`
      flex flex-row justify-between items-end gap-x-4
      text-xs italic
      w-full absolute bottom-1
      px-2
    `}>
      <p className="flex flex-col gap-y-0.5">
        <span>
          Licensed under <a target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA</a>
        </span>
        <span>
          Data sourced from <a href="https://starwars.fandom.com/" target="_blank">Wookieepedia</a>
        </span>
      </p>

      <p className="w-[26ch] flex flex-col gap-y-0.5">
        <span className="italic text-star/70">
          {!characterNames && "Loading character names..."}
        </span>
        <span className="italic text-star/70">
          {!characters && "Loading character data..."}
        </span>
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
