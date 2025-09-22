
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
        gap-x-2
        text-lg
        bg-eclipse-500
        p-2
        w-full
        ${toggled ? `
          outline-2
          bg-eclipse-700 
          hover:text-command-400
          outline-command-500 
          ` : `
          outline-2
          outline-transparent hover:outline-command-400
          border-transparent
        `}
      `}
    >
      {icon}
      {label}
    </button>
  );
}