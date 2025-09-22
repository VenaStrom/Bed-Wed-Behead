
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
        flex flex-row gap-x-2 justify-start items-center
        text-lg
        border-2
        rounded-lg
        bg-eclipse-500
        p-2
        w-full
        ${toggled ? `
          outline-2
          bg-eclipse-700 
          hover:text-command-400
          outline-command-500 border-command-500
          ` : `
          outline-2
          outline-eclipse-700 hover:outline-command-300
          border-transparent
        `}
      `}
    >
      {icon}
      {label}
    </button>
  );
}