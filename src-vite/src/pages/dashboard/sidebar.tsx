import { useState } from "react";
import {
  FaBars,
  FaCode,
  FaHistory,
  FaLayerGroup,
  FaPlus,
  FaStar,
} from "react-icons/fa";

interface SidebarItemProps {
  setViewGroup: React.Dispatch<
    React.SetStateAction<"default" | "recent" | "favourites" | string>
  >;
  viewGroup: "default" | "recent" | "favourites" | string;
  label: string;
  icon: React.ReactNode;
  collapsed: boolean;
}

function SidebarItem(props: SidebarItemProps) {
  const { setViewGroup, viewGroup, label, icon, collapsed } = props;
  return (
    <button
      className={`flex items-center gap-3 px-3 py-2 text-[#f8f8f2] hover:bg-[#44475a] transition
      ${label === viewGroup ? "bg-[#44475a]" : ""}`}
      onClick={() => setViewGroup(viewGroup)}
    >
      <span className="text-[#8be9fd] flex items-center w-5 h-7">{icon}</span>
      {!collapsed && <span className="flex items-center h-7">{label}</span>}
    </button>
  );
}

interface SidebarProps {
  setViewGroup: React.Dispatch<
    React.SetStateAction<"default" | "recent" | "favourites" | string>
  >;
  viewGroup: "default" | "recent" | "favourites" | string;
}

export default function Sidebar(props: SidebarProps) {
  const { setViewGroup, viewGroup } = props;

  // Collapse sidebar
  const [collapsed, setCollapsed] = useState(false);

  function toggleSidebar() {
    setCollapsed(!collapsed);
  }

  return (
    <aside
      className={`border-r border-l border-b border-[#44475a] bg-[#282a36] transition-all duration-300
        ${collapsed ? "w-16" : "w-56"}`}
    >
      {/* Collapse Button */}
      <div className="flex justify-start p-5">
        <button
          onClick={toggleSidebar}
          className="text-[#6272a4] hover:text-[#bd93f9]"
        >
          <FaBars />
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 px-2">
        {/* default, recent, favourites are permanent groups */}
        <SidebarItem
          label="default"
          viewGroup={viewGroup}
          setViewGroup={setViewGroup}
          icon={<FaCode />}
          collapsed={collapsed}
        />
        <SidebarItem
          label="recent"
          viewGroup={viewGroup}
          setViewGroup={setViewGroup}
          icon={<FaHistory />}
          collapsed={collapsed}
        />
        <SidebarItem
          label="favourites"
          viewGroup={viewGroup}
          setViewGroup={setViewGroup}
          icon={<FaStar />}
          collapsed={collapsed}
        />

        {/* add group button */}
        <button
          className="text-[#50fa7b] hover:text-[#8be9fd] transition flex items-center gap-3 px-3 py-2
          border border-[#50fa7b] hover:border-[#bd93f9] rounded"
        >
          <span className="flex items-center w-5 h-7">
            <FaPlus />
          </span>
          {!collapsed && (
            <span className="flex items-center h-7">Add group</span>
          )}
        </button>

        {/* Custom groups */}
        <SidebarItem
          label="favourites"
          viewGroup={viewGroup}
          setViewGroup={setViewGroup}
          icon={<FaLayerGroup />}
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
}
