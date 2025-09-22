import { BedIcon, LinkIcon, RefreshIcon, SpaceshipIcon, SwordIcon, WeddingIcon } from "./components/icons.tsx";
import OptionButton from "./components/option-button.tsx";

export default function App() {
  return (<>
    <main className="flex flex-col items-center gap-y-6 pt-8">
      {/* Heading */}
      <header className="flex flex-col items-center gap-y-2">
        <img src="/bwb-logo.png" title="[Aurebesh] Bed Wed & Behead" alt="Bed Wed & Behead" />
        <h1 className="text-center text-xl italic font-semibold">
          Bed Wed & Behead
        </h1>
      </header>

      {/* Profiles */}
      <section className="flex flex-row gap-x-8 justify-center items-center">
        {new Array(3).fill(0).map((_, i) => (
          <div className="flex flex-col gap-y-4" key={`profile-column-${i}`}>
            {/* Profile */}
            <a
              href={""}
              className="flex flex-col justify-center items-center gap-y-2 hover:[&_.link]:underline"
              target="_blank" rel="noopener"
            >
              <img className="size-48 rounded-sm" src="/alien-headshot.png" alt="Headshot of character" />
              <div className="w-full flex flex-row gap-x-2 items-center justify-end">
                <span className="w-full text-lg text-center">...</span>
                <LinkIcon className="size-5 absolute" />
              </div>
            </a>

            {/* Answer list */}
            <ul
              className="flex flex-col gap-y-3"
            >
              <li>
                <OptionButton toggled icon={<BedIcon className="size-10" />} label="Bed" />
              </li>
              <li>
                <OptionButton icon={<WeddingIcon className="size-10 scale-90" />} label="Wed" />
              </li>
              <li>
                <OptionButton icon={<SwordIcon className="size-10 scale-75" />} label="Behead" />
              </li>
            </ul>
          </div>
        ))}
      </section>

      {/* Controls */}
      <section className="w-full flex flex-row justify-center items-center gap-x-10">
        <button className="px-3 hover:bg-hyper-500 hover:[&_.icon]:rotate-180">
          <RefreshIcon className="icon size-8 hover:rotate-180 transition-all" />
          Refresh
        </button>

        <button className="px-3 hover:bg-jump-500 hover:[&_.icon]:animate-jitter">
          <SpaceshipIcon className="icon size-8" />
          Commit
        </button>
      </section>
    </main>

    {/* Filter hint */}
    {/* <div>
      <h3>
        Never heard of
        <a target="_blank" href="https://starwars.fandom.com/wiki/Unidentified_Hebekrr_Minor_magistrate%27s_granddaughter%27s_wife">
          Unidentified Hebekrr Minor magistrate's granddaughter's wife
        </a>?
        Try these filters!
      </h3>
      <p>→</p>
      <div>Got it!</div>
    </div> */}

    {/* <img src="style/images/icons/icon_settings.png" title="Filters" tabIndex={14} /> */}
    {/* 
    <aside>
      <h2>Filter</h2>

      <form>
        <div>
          <p>Include ONLY</p>
          <p>Miscellaneous</p>
        </div>
        <div>
          <p>Include ONLY</p>
          <p>Canonicity</p>
        </div>
        <div>
          <p>Include ONLY</p>
          <p>Appearances</p>
        </div>
        <div>
          <p>Include ONLY</p>
          <p>Gender</p>
        </div>
      </form>
    </aside> */}

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