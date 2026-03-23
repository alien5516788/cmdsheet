import { useState } from "react";

interface EditItemProps {
  itemType: "snippet" | "group";
  item: { name: string; description: string; tags?: string[] };
  onConfirm: (
    name: string,
    newName: string,
    description: string,
    tags?: string[] | null
  ) => void;
  onClose: () => void;
  status: {
    status: "default" | "error";
    message: string;
  };
}

export default function EditItem(props: EditItemProps) {
  const { itemType, item, onConfirm, onClose, status } = props;

  const themeConfig = {
    default: {
      border: "border-[#8be9fd]",
      text: "text-[#8be9fd]",
      button: "bg-[#8be9fd] text-black hover:bg-[#50fa7b]",
    },
    error: {
      border: "border-red-500",
      text: "text-red-400",
      button: "bg-red-500 text-black hover:bg-red-400",
    },
  };

  const currentTheme = themeConfig[status.status];

  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  // Tags only for snippets
  const [tags, setTags] = useState<string[] | null>(
    itemType === "snippet" ? item.tags ?? [] : null
  );
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    if (!tagInput.trim() || !tags) return;
    if (tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    if (!tags) return;
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className={`bg-[#282a36] border rounded-xl p-6 w-[420px] shadow-lg ${currentTheme.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className={`text-lg font-semibold mb-4 ${currentTheme.text}`}>
          Edit {itemType}
        </h2>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          {/* Name */}
          <input
            type="text"
            value={name}
            placeholder="Name"
            className="bg-[#1e1f29] border border-[#44475a] text-[#f8f8f2] rounded px-3 py-2 outline-none focus:border-[#bd93f9]"
            onChange={(e) => setName(e.target.value)}
            disabled={itemType === "group" && item.name === "default"}
          />

          {/* Description */}
          <textarea
            value={description}
            placeholder="Description"
            className="max-h-[250px] min-h-[100px] bg-[#1e1f29] border border-[#44475a] text-[#f8f8f2] rounded px-3 py-2 outline-none focus:border-[#bd93f9]"
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Tags (only for snippets) */}
          {itemType === "snippet" && tags && (
            <div>
              <div className="flex gap-2 mb-2 flex-wrap">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#6272a4] text-[#f8f8f2] px-2 py-0.5 rounded text-xs flex items-center gap-1"
                    >
                      {tag}
                      <button
                        className="text-[#ff5555] hover:text-[#ff79c6]"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-[#6272a4] text-xs">
                    <i>No tags</i>
                  </span>
                )}
              </div>

              {/* Add tag input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  placeholder="Add tag"
                  className="flex-1 bg-[#1e1f29] border border-[#44475a] text-[#f8f8f2] rounded px-3 py-2 outline-none focus:border-[#bd93f9]"
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <button
                  className="px-3 py-2 bg-[#50fa7b] text-black rounded hover:bg-[#8be9fd]"
                  onClick={addTag}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
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
            onClick={() => onConfirm(item.name, name, description, tags)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
