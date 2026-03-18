import { useState } from "react";
import { FaLayerGroup, FaTrash } from "react-icons/fa";

interface GroupItemProps {
  id: string;
  name: string;
  count: number;
  collapsed: boolean;
  setViewGroup: React.Dispatch<
    React.SetStateAction<"default" | "recent" | "favourites" | string>
  >;
  viewGroup: string;
}

export default function GroupCard(props: GroupItemProps) {
  const { id, name, count, collapsed, setViewGroup, viewGroup } = props;

  // Track if item count is hovered
  // If hovered, show delete button
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group flex items-center justify-between px-3 py-2 gap-4 cursor-pointer
      text-[#f8f8f2] hover:bg-[#44475a] transition
      ${viewGroup === name ? "bg-[#44475a]" : ""}`}
      onClick={() => setViewGroup(name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[#ffb86c] flex items-center w-5 h-7">
          <FaLayerGroup />
        </span>

        {!collapsed && <span className="truncate">{name}</span>}
      </div>

      {/* Delete and count */}
      {!collapsed && (
        <div className="flex items-center gap-2">
          {hovered ? (
            // Delete
            <button
              className="opacity-0 group-hover:opacity-100 text-[#ff5555] hover:text-[#ff79c6] transition"
              onClick={(e) => {
                e.stopPropagation();
                console.log("delete group", id);
              }}
            >
              <FaTrash size={12} />
            </button>
          ) : (
            // Count
            <span className="text-xs text-[#6272a4]">{count}</span>
          )}
        </div>
      )}
    </div>
  );
}
