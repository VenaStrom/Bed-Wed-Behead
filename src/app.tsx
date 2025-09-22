

export default function App() {
  return (<>
    <main className="flex flex-col items-center">
      <img src="/bwb-logo.png" title="[Aurebesh] Bed Wed & Behead" alt="Bed Wed & Behead" />
      <h1>
        STAR WARS:
        <br />
        Bed Wed & Behead
      </h1>

      {/* Profiles */}
      <section className="flex flex-row gap-x-8 justify-center items-center">
        {new Array(3).fill(0).map((_, i) => (
          <a
            key={`headshot-${i}`}
            href={""}
            className="flex flex-col justify-center items-center gap-y-2"
            target="_blank" rel="noopener"
          >
            <img className="size-48" src="/alien-headshot.png" alt="Headshot of character" />
            <span className="text-lg">...</span>
            <img src="/icons/link.svg" alt="" className="size-6" />
          </a>
        ))}
      </section>

      {/* Answer boxes */}
      <section>
        {/* Beds */}
        {new Array(3).fill(0).map((_, i) => (
          <button
            key={`answer-box-bed-${i}`}
          >
            <img src="/icons/bed.svg" alt="Bed" />
          </button>
        ))}
        <button>
          <img src="style/images/icons/bed_FILL1_wght600_GRAD0_opsz48.png" alt="Bed" />
          <p>Bed</p>
        </button>
        <div tabIndex={6}>
          <img src="style/images/icons/bed_FILL1_wght600_GRAD0_opsz48.png" alt="Bed" />
          <p>Bed</p>
        </div>
        <div tabIndex={10}>
          <img src="style/images/icons/bed_FILL1_wght600_GRAD0_opsz48.png" alt="Bed" />
          <p>Bed</p>
        </div>

        <div tabIndex={3}>
          <img src="style/images/icons/favorite_FILL1_wght600_GRAD0_opsz48.png" alt="Wed" />
          <p>Wed</p>
        </div>
        <div tabIndex={7}>
          <img src="style/images/icons/favorite_FILL1_wght600_GRAD0_opsz48.png" alt="Wed" />
          <p>Wed</p>
        </div>
        <div tabIndex={11}>
          <img src="style/images/icons/favorite_FILL1_wght600_GRAD0_opsz48.png" alt="Wed" />
          <p>Wed</p>
        </div>

        <div tabIndex={4}>
          <img src="style/images/icons/skull_FILL1_wght600_GRAD0_opsz48.png" alt="Behead" />
          <p>Behead</p>
        </div>
        <div tabIndex={8}>
          <img src="style/images/icons/skull_FILL1_wght600_GRAD0_opsz48.png" alt="Behead" />
          <p>Behead</p>§
        </div>
        <div tabIndex={12}>
          <img src="style/images/icons/skull_FILL1_wght600_GRAD0_opsz48.png" alt="Behead" />
          <p>Behead</p>
        </div>
      </section>

      <div>
        <p tabIndex={13}>Play</p>
        <p>Character count: <span>00000</span></p>
      </div>
    </main>

    <div>
      <h3>
        Never heard of
        <a target="_blank" href="https://starwars.fandom.com/wiki/Unidentified_Hebekrr_Minor_magistrate%27s_granddaughter%27s_wife">
          Unidentified Hebekrr Minor magistrate's granddaughter's wife
        </a>?
        Try these filters!
      </h3>
      <p>→</p>
      <div>Got it!</div>
    </div>

    <img src="style/images/icons/icon_settings.png" title="Filters" tabIndex={14} />

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
    </aside>

    <footer>
      <p>Data sourced from <a href="https://starwars.fandom.com/" target="_blank">Wookieepedia</a></p>
      <p>Licensed under <a target="_blank" href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a></p>
    </footer>
  </>);
}