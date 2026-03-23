interface StatusBarProps {
  status: {
    status: "default" | "success" | "warning" | "error";
    message: string;
  };
  setStatus: React.Dispatch<React.SetStateAction<{
    status: "default" | "success" | "warning" | "error";
    message: string;
  }>>
}

export function StatusBar(props: StatusBarProps) {
  const { status, setStatus } = props;

  const themeConfig = {
    default: "text-[#6272a4]",
    success: "text-[#50fa7b]",
    warning: "text-[#f1fa8c]",
    error: "text-[#ff5555]",
  };

  const iconConfig = {
    default: "•",
    success: "✔",
    warning: "⚠",
    error: "✖",
  };

  return (
    <div className="flex items-center justify-between px-3 py-1 border border-[#44475a] bg-[#282a36] font-mono
      text-sm sticky bottom-0 opacity-75"
    >
      {/* message */}
      <div className={`truncate ${themeConfig[status.status]}`}>
        {`[${iconConfig[status.status]}] `}
        {status.message}
      </div>

      {/* clear if not default */}
      <button
        onClick={() => setStatus({ status: "default", message: "No issue" })}
        className="ml-3 text-[#6272a4] hover:text-[#f8f8f2] transition-colors px-3"
        title="Clear status"
      >
        x
      </button>
    </div>
  );
}
