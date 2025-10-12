import { useMemo } from "react";
import { BWBChoice, ProfileState } from "../types.ts";

export default function OptionButton({
  profiles,
  setProfiles: profilesSetter,
  index: i,
  icon,
  label,
  ...props
}: {
  profiles: [ProfileState, ProfileState, ProfileState];
  setProfiles: React.Dispatch<React.SetStateAction<[ProfileState, ProfileState, ProfileState]>>;
  index: number;
  icon: React.ReactNode;
  label: BWBChoice;
} & React.LabelHTMLAttributes<HTMLLabelElement>
) {
  const toggled = useMemo(() => profiles[i].selectedOption === label as BWBChoice, [profiles, i, label]);

  return (
    <label
      {...props}
      className={`
        _button
        gap-x-2 p-2
        text-lg
        w-full
        select-none
        ${toggled ? `
          bg-jump-500 
          hover:bg-jump-400
          ` : `
          bg-eclipse-500
          hover:bg-command-700 hover:text-eclipse-500
        `}
      `}
    >
      {icon}
      {label}

      <input
        onChange={() => {
          const newProfiles = [...profiles] as [ProfileState, ProfileState, ProfileState];

          // Set this profile normally
          newProfiles[i] = {
            ...newProfiles[i],
            selectedOption: toggled ? null : label,
          };

          const otherProfileIndexes = [0, 1, 2].filter((i) => i !== i);

          if (otherProfileIndexes.some((i) => newProfiles[i].selectedOption === label)) {
            // If another profile has the same option, swap it with the current profile's option
            const otherProfileIndex = otherProfileIndexes.find((i) => newProfiles[i].selectedOption === label)!;
            newProfiles[otherProfileIndex] = {
              ...newProfiles[otherProfileIndex],
              selectedOption: profiles[i].selectedOption,
            };
          }

          profilesSetter(newProfiles);
        }}
        checked={toggled}
        className="hidden"
        type="checkbox"
      />
    </label>
  );
}