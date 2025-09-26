import { useState } from "react";
import { BedIcon, GearIcon, ExternalLinkIcon, RefreshIcon, SpaceshipIcon, SwordIcon, WeddingIcon, LinkIcon, RightArrowIcon, CheckmarkIcon, CloseIcon } from "./components/icons.tsx";
import OptionButton from "./components/option-button.tsx";
import type { Character, ProfileState } from "./types.ts";
import { protoDecode } from "./proto/proto.ts";
import { base64ToUint8Array } from "./functions/baseConverter.ts";

import characterLinksMin from "../public/db/characters-links.min.json" with { type: "json" };
const characterLinks: string[] = characterLinksMin.singleLineData.split(characterLinksMin.joiningCharacter);
import characterDataBase64 from "../public/db/characters.min.json" with { type: "json" };
const characterData = await protoDecode(base64ToUint8Array(characterDataBase64 as string));
const characterMap: Record<string, Character> = {};
for (const char of characterData) {
  characterMap[char.route] = char;
}

const wikiBaseUrl = "https://starwars.fandom.com/wiki/";
const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";

export default function App() {
  const [profiles, setProfiles] = useState<[ProfileState, ProfileState, ProfileState]>([
    {
      name: null,
      wikiLink: null,
      imageLink: null,
    },
    {
      name: null,
      wikiLink: null,
      imageLink: null,
    },
    {
      name: null,
      wikiLink: null,
      imageLink: null,
    }
  ]);
  const [isFilterPanelExpanded, setFilterPanelOpen] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [hasGottenHint, setHasGottenHint] = useState(typeof window !== "undefined" ? Boolean(localStorage.getItem("hasGottenHint")) : false);

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
          ${isFilterPanelExpanded ? `translate-x-0` : `translate-x-full`}
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
                  <OptionButton icon={<BedIcon className="size-10 scale-105" />} label="Bed" />
                </li>
                <li>
                  <OptionButton icon={<WeddingIcon className="size-10 scale-[85%]" />} label="Wed" />
                </li>
                <li>
                  <OptionButton icon={<SwordIcon className="size-10 scale-[70%]" />} label="Behead" />
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
      flex flex-row justify-start items-center gap-x-4
      text-xs italic
      w-full absolute bottom-1
      px-2
    `}>
      <p className="flex flex-col gap-y-0.5">
        <span>
          Licensed under <a target="_blank" href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>
        </span>
        <span>
          Data sourced from <a href="https://starwars.fandom.com/" target="_blank">Wookieepedia</a>
        </span>
      </p>
    </footer>
  </>);
}
