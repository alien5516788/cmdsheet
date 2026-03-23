import { useState } from "react";
import { FaBars, FaPlus } from "react-icons/fa";
import GroupCard from "./groupcard";

interface SidebarProps {
  groups: { name: string; snippetCount: number }[];
  openCreateItem: (itemType: "snippet" | "group") => void;
  openDeleteItem: (itemType: "snippet" | "group", name: string) => void;
}

export default function Sidebar(props: SidebarProps) {
  const { groups, openCreateItem, openDeleteItem } = props;

  // Collapse sidebar
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-l border-b border-[#44475a] bg-[#282a36]
        transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Collapse Button */}
      <div className="flex justify-start p-5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#6272a4] hover:text-[#bd93f9]"
        >
          <FaBars />
        </button>
      </div>

      {/* Links */}
      <aside className="flex flex-col gap-2 px-2 flex-1 min-h-0 p-3">
        {/* Add group button */}
        <button
          className="text-[#50fa7b] hover:text-[#8be9fd] transition flex justify-center items-center gap-3 px-3 py-1
          border border-[#50fa7b] hover:border-[#bd93f9] rounded"
          onClick={() => openCreateItem("group")}
        >
          <span className="flex items-center w-5 h-7">
            <FaPlus />
          </span>
          {!collapsed && (
            <span className="flex items-center h-7">Add group</span>
          )}
        </button>

        {/* Groups */}
        <div className="mt-2 flex flex-col gap-1 flex-1 overflow-y-auto pr-1 min-h-0">
          {groups.map((group) => (
            /*
              Recent, favourites are virtual groups
              Rendering recent and favourite separately ensures they appear on top
            */
            ["recent", "favourites"].includes(group.name) ? (
              <GroupCard
                key={group.name}
                name={group.name}
                snippetCount={group.snippetCount}
                collapsed={collapsed}
                openDeleteItem={openDeleteItem}
              />
            ) : (
              <GroupCard
                key={group.name}
                name={group.name}
                snippetCount={group.snippetCount}
                collapsed={collapsed}
                openDeleteItem={openDeleteItem}
              />
            )
          ))}
        </div>
      </aside>
    </aside>
  );
}
