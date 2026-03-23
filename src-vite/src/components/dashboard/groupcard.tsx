import { useState } from "react";
import { FaHistory, FaLayerGroup, FaTrash } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

interface GroupCardProps {
  name: string;
  snippetCount: number;
  collapsed: boolean;
  openDeleteItem: (itemType: "snippet" | "group", name: string) => void;
}

export default function GroupCard(props: GroupCardProps) {
  const { name, snippetCount, collapsed, openDeleteItem } = props;

  // Extract groupName from url params
  // Sidebar link highlights the current group
  const params = useParams();
  const { groupName } = params;

  // Navigate to the group page when clicked
  const navigate = useNavigate();

  // Track if item count is hovered
  // If hovered, show delete button
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`group flex items-center justify-between px-3 py-2 gap-4 cursor-pointer text-[#f8f8f2]
      hover:bg-[#44475a] transition ${groupName === name ? "bg-[#44475a]" : ""}`}
      onClick={() => {
        navigate(`/group/${name}`);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className="flex items-center gap-3 min-w-0">
        {name === "recent" &&
          <span className="text-[#8be9fd] flex items-center w-5 h-7">
            <FaHistory />
          </span>
        }
        {name === "favourites" &&
          <span className="text-[#8be9fd] flex items-center w-5 h-7">
            <FaStar />
          </span>
        }
        {!["recent", "favourites"].includes(name || "") &&
          <span className="text-[#ffb86c] flex items-center w-5 h-7">
            <FaLayerGroup />
          </span>
        }

        {!collapsed && <span className="truncate">{name}</span>}
      </div>

      {/* Delete and count */}
      {!collapsed && (
        <div className="flex items-center gap-2">
          {hovered && !["recent", "favourites", "default"].includes(name || "") ? (
            <button
              className="opacity-0 group-hover:opacity-100 text-[#ff5555] hover:text-[#ff79c6] transition"
              onClick={(e) => {
                e.stopPropagation();
                openDeleteItem("group", name)
              }}
            >
              <FaTrash size={12} />
            </button>
          ) : (
            <span className="text-xs text-[#6272a4]">{snippetCount}</span>
          )}
        </div>
      )}
    </div>
  );
}
