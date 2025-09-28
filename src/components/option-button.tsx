import { useMemo } from "react";
import { BWBChoice, ProfileState } from "../types.ts";

export default function OptionButton({
  profiles,
  profilesSetter,
  profileIndex,
  icon,
  label,
  ...props
}: {
  profiles: [ProfileState, ProfileState, ProfileState];
  profilesSetter: React.Dispatch<React.SetStateAction<[ProfileState, ProfileState, ProfileState]>>;
  profileIndex: number;
  icon: React.ReactNode;
  label: BWBChoice;
} & React.LabelHTMLAttributes<HTMLLabelElement>
) {
  const toggled = useMemo(() => profiles[profileIndex].selectedOption === label as BWBChoice, [profiles, profileIndex, label]);

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
          bg-jump-500 text-eclipse-700
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
          newProfiles[profileIndex] = {
            ...newProfiles[profileIndex],
            selectedOption: label,
          };

          const selectionCount = newProfiles.filter(p => p.selectedOption !== null).length;

          if (selectionCount === 3) {
            const conflictingIndex = newProfiles.findIndex((p, i) => i !== profileIndex && p.selectedOption === label);
            if (conflictingIndex) {
              newProfiles[conflictingIndex] = {
                ...newProfiles[conflictingIndex],
                selectedOption: profiles[profileIndex].selectedOption,
              }
            }
          }
          else {
            for (let i = 0; i < newProfiles.length; i++) {
              if (i !== profileIndex && newProfiles[i].selectedOption === label) {
                newProfiles[i] = {
                  ...newProfiles[i],
                  selectedOption: null,
                };
              }
            }
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