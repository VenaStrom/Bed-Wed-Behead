import { imageBaseURL, wikiBaseUrl } from "../app.tsx";
import { BWBChoice, ProfileStates } from "../types.ts";
import { BedIcon, ExternalLinkIcon, SwordIcon, WeddingIcon } from "./icons.tsx";
import OptionButton from "./option-button.tsx";

export default function Profile({
  profiles,
  index: i,
  setProfiles,
}: {
  profiles: ProfileStates;
  index: number;
  setProfiles: React.Dispatch<React.SetStateAction<ProfileStates>>;
}) {
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
        <img className="size-48 rounded-sm object-contain" loading="eager" src={profile.imageRoute ? imageBaseURL + profile.imageRoute : "/alien-headshot.png"} crossOrigin="anonymous" alt="Headshot of character" />

        <div className="w-full flex flex-row items-center justify-center gap-x-2 h-9">
          <p className="flex-1 text-base text-center max-w-[18ch]">{profile.name || "..."}</p>
          <ExternalLinkIcon className="size-5 relative right-0" />
        </div>
      </a>

      {/* Answer list */}
      <ul className="flex flex-col gap-y-3">
        <li>
          <OptionButton
            profiles={profiles}
            setProfiles={setProfiles}
            index={i}
            label={BWBChoice.BED}
            icon={<BedIcon className="size-10 scale-105" />}
          />
        </li>
        <li>
          <OptionButton
            profiles={profiles}
            setProfiles={setProfiles}
            index={i}
            label={BWBChoice.WED}
            icon={<WeddingIcon className="size-10 scale-[85%]" />}
          />
        </li>
        <li>
          <OptionButton
            profiles={profiles}
            setProfiles={setProfiles}
            index={i}
            label={BWBChoice.BEHEAD}
            icon={<SwordIcon className="size-10 scale-[70%]" />}
          />
        </li>
      </ul>
    </div>
  );
}