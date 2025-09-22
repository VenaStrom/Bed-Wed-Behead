
export default function OptionButton({
  icon,
  label,
  toggled = false,
}: {
  icon: React.ReactNode;
  label: string;
  toggled?: boolean;
}) {
  return (
    <button
      className={`
        gap-x-2 p-2
        text-lg
        w-full
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
    </button>
  );
}