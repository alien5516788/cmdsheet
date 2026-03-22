import { useState } from "react";
import { useParams } from "react-router-dom";

interface CreateItemProps {
  itemType: "snippet" | "group";
  onConfirm: (
    itemType: "snippet" | "group",
    groupName: string,
    name: string,
    description: string,
  ) => void;
  onClose: () => void;
  status: {
    status: "default" | "error";
    message: string;
  };
}

export default function CreateItem(props: CreateItemProps) {
  const { itemType, onClose, onConfirm, status } = props;

  // Extract groupName from url params
  // Group name is required to create snippets
  const params = useParams();
  const { groupName } = params;

  // Theme configuration for different statuses
  const themeConfig = {
    default: {
      border: "border-[#50fa7b]",
      text: "text-[#50fa7b]",
      button: "bg-[#50fa7b] text-black hover:bg-[#8be9fd]",
    },
    error: {
      border: "border-red-500",
      text: "text-red-400",
      button: "bg-red-500 text-black hover:bg-red-400",
    },
  };

  const currentTheme = themeConfig[status.status];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-[#282a36] border rounded-xl p-6 w-[400px] shadow-lg ${currentTheme.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className={`text-lg font-semibold mb-4 ${currentTheme.text}`}>
          Add New {itemType}
        </h2>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            className="bg-[#1e1f29] border border-[#44475a] text-[#f8f8f2] rounded px-3 py-2 outline-none focus:border-[#bd93f9]"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <textarea
            placeholder="Description (optional)"
            className="max-h-[250px] min-h-[100px] bg-[#1e1f29] border border-[#44475a] text-[#f8f8f2] rounded px-3 py-2 outline-none focus:border-[#bd93f9]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Message */}
        {status.message && (
          <p className={`text-sm mt-3 ${currentTheme.text}`}>{status.message}</p>
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
            onClick={() => onConfirm(itemType, groupName || "default", name, description)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
