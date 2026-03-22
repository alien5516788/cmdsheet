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
    default: "text-[#6272a4]",   // subtle comment color
    success: "text-[#50fa7b]",   // green
    warning: "text-[#f1fa8c]",   // yellow
    error: "text-[#ff5555]",     // red
  };

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border border-[#44475a] bg-[#282a36] font-mono text-sm pt-2 sticky bottom-0">
      {/* message */}
      <div className={`truncate ${themeConfig[status.status]}`}>
        {status.status !== "default" && "[STATUS] "}
        {status.message}
      </div>

      {/* clear if not default */}
      {status.status !== "default" && (
        <button
          onClick={() => setStatus({ status: "default", message: "No issue" })}
          className="ml-3 text-[#6272a4] hover:text-[#f8f8f2] transition-colors"
          title="Clear status"
        >
          ✔
        </button>
      )}
    </div>
  );
}
