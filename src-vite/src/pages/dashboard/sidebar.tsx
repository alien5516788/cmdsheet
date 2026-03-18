import { useState } from "react";
import {
  FaBars,
  FaCode,
  FaHistory,
  FaLayerGroup,
  FaStar,
} from "react-icons/fa";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

function SidebarItem(props: SidebarItemProps) {
  const { icon, label, collapsed } = props;
  return (
    <button className="flex items-center gap-3 px-3 py-2 text-[#f8f8f2] hover:bg-[#44475a] transition">
      <span className="text-[#8be9fd] flex items-center w-5 h-7">{icon}</span>
      {!collapsed && <span className="flex items-center h-7">{label}</span>}
    </button>
  );
}

export default function Sidebar() {
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
        <SidebarItem icon={<FaCode />} label="snippets" collapsed={collapsed} />
        <SidebarItem
          icon={<FaLayerGroup />}
          label="groups"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<FaStar />}
          label="favourites"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<FaHistory />}
          label="recent"
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
}
