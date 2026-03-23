interface DeleteItemProps {
  itemType: "snippet" | "group";
  itemName: string;
  onConfirm: (itemType: "snippet" | "group", name: string) => Promise<void>;
  onClose: () => void;
  status: {
    status: "default" | "error";
    message: string;
  };
}

export default function DeleteItem(props: DeleteItemProps) {
  const { itemType, itemName, onConfirm, onClose, status } = props;

  // Theme configuration (danger-focused)
  const themeConfig = {
    default: {
      border: "border-red-500",
      text: "text-red-400",
      button: "bg-red-500 text-black hover:bg-red-400",
    },
    error: {
      border: "border-red-600",
      text: "text-red-500",
      button: "bg-red-600 text-black hover:bg-red-500",
    },
  };

  const currentTheme = themeConfig[status.status];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className={`bg-[#282a36] border rounded-xl p-6 w-[400px] shadow-lg ${currentTheme.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className={`text-lg font-semibold mb-4 ${currentTheme.text}`}>
          Delete {itemType}
        </h2>

        {/* Warning Message */}
        <p className="text-[#f8f8f2] text-sm">
          Are you sure you want to delete{" "}
          <span className="text-[#ff5555] font-mono">{itemName}</span>?
        </p>

        <p className="text-[#6272a4] text-xs mt-2">
          This action cannot be undone.
        </p>

        {/* Status Message */}
        {status.message && (
          <p className={`text-sm mt-3 ${currentTheme.text}`}>
            {status.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded border border-[#6272a4] text-[#f8f8f2] hover:bg-[#44475a] transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`px-4 py-2 rounded transition ${currentTheme.button}`}
            onClick={() => onConfirm(itemType, itemName)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
