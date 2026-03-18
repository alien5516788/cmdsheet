import { useState } from "react";
import { FaLayerGroup, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// default, recent, favourites groups are permanent and cannot be deleted
// This component is made specifically for the default, recent, and favourites groups
interface DefaultGroupCardProps {
  name: string;
  count: number;
  icon: React.ReactNode;
  groupName: string;
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
  collapsed: boolean;
}

export function DefaultGroupCard(props: DefaultGroupCardProps) {
  const { setGroupName, groupName, name, count, icon, collapsed } = props;
  const navigate = useNavigate();

  return (
    <button
      className={`flex items-center gap-3 px-3 py-2 text-[#f8f8f2] hover:bg-[#44475a] transition
      ${name === groupName ? "bg-[#44475a]" : ""}`}
      onClick={() => {
        setGroupName(name);
        navigate(`/group/${name}`);
      }}
    >
      <span className="text-[#8be9fd] flex items-center w-5 h-7">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex items-center h-7">{name}</span>
          <span className="text-xs text-[#6272a4] ml-auto">{count}</span>
        </>
      )}
    </button>
  );
}

// Apart from the default, recent, and favourites groups, custom groups are rendered with this component
interface GroupCardProps {
  id: string;
  name: string;
  count: number;
  groupName: string;
  setGroupName: React.Dispatch<
    React.SetStateAction<"default" | "recent" | "favourites" | string>
  >;
  collapsed: boolean;
}

export default function GroupCard(props: GroupCardProps) {
  const { id, name, count, collapsed, setGroupName, groupName } = props;

  const navigate = useNavigate();

  // Track if item count is hovered
  // If hovered, show delete button
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group flex items-center justify-between px-3 py-2 gap-4 cursor-pointer
      text-[#f8f8f2] hover:bg-[#44475a] transition
      ${groupName === name ? "bg-[#44475a]" : ""}`}
      onClick={() => {
        setGroupName(name);
        navigate(`/group/${id}`);
      }}
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
