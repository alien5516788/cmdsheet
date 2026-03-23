export type StatusBarItem = {
  id: number;
  status: "default" | "success" | "warning" | "error";
  message: string;
};

interface StatusBarProps {
  statusQueue: StatusBarItem[];
  onPop: () => void;
  onPromote: (id: number) => void;
}

export function StatusBar(props: StatusBarProps) {
  const { statusQueue, onPop, onPromote } = props;

  const hasMessages = statusQueue.length > 0;

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
    <div className="flex items-center justify-between px-3 py-1 border border-[#44475a] bg-[#282a36] font-mono text-sm
      sticky bottom-0 opacity-75">
      {/* Messages */}
      <div className={`truncate flex items-center gap-6
        ${hasMessages ? themeConfig[statusQueue[0].status] : themeConfig.default}`}
      >
        {/* Current message */}
        {hasMessages
          ? `[${iconConfig[statusQueue[0].status]} ${statusQueue[0].status}]: ${statusQueue[0].message}`
          : `[${iconConfig.default} default]: No Issue`
        }

        {/* Other messages */}
        {statusQueue.length > 1 && statusQueue.slice(1).map((item) => (
          <button
            key={item.id}
            onClick={() => onPromote(item.id)}
            className={`text-sm ${themeConfig[item.status]} hover:scale-110 transition`}
            title={item.message}
          >
            {`[${iconConfig[item.status]}]`}
          </button>
        ))}
      </div>

      {/* Clear current message */}
      {
        hasMessages &&
        <button onClick={onPop} className="text-[#6272a4] hover:text-[#f8f8f2] px-2">
          x
        </button>
      }
    </div>
  );
}
