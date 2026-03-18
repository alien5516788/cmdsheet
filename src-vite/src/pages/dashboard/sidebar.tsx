import { useState } from "react";
import { FaBars, FaCode, FaHistory, FaPlus, FaStar } from "react-icons/fa";
import GroupCard from "./groupcard";

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
      onClick={() => setViewGroup(label)}
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

  // temp
  const dummyGroups = [
    { id: "g1", name: "web-exploitation", count: 12 },
    { id: "g2", name: "reverse-engineering", count: 8 },
    { id: "g3", name: "docker-workflows", count: 5 },
    {
      id: "g4",
      name: "long-group-name-that-should-truncate-properly",
      count: 20,
    },
    { id: "g5", name: "networking", count: 6 },
    { id: "g6", name: "forensics", count: 3 },
    { id: "g7", name: "automation-scripts", count: 14 },
    { id: "g8", name: "privilege-escalation", count: 9 },
    { id: "g9", name: "web-recon", count: 11 },
    { id: "g10", name: "api-testing", count: 7 },
    { id: "g11", name: "linux-hardening", count: 4 },
    { id: "g12", name: "cloud-security", count: 10 },
    { id: "g13", name: "malware-analysis", count: 6 },
    { id: "g14", name: "osint-tools", count: 13 },
    { id: "g15", name: "ci-cd-pipelines", count: 5 },
  ];

  return (
    <aside
      className={`flex flex-col border-r border-l border-b border-[#44475a] bg-[#282a36]
        transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
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
      <nav className="flex flex-col gap-2 px-2 flex-1 min-h-0 p-3">
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

        {/* Add group button */}
        <button
          className="text-[#50fa7b] hover:text-[#8be9fd] transition flex items-center gap-3 px-3 py-1
          border border-[#50fa7b] hover:border-[#bd93f9] rounded"
          onClick={() => setCollapsed(false)}
        >
          <span className="flex items-center w-5 h-7">
            <FaPlus />
          </span>
          {!collapsed && (
            <span className="flex items-center h-7">Add group</span>
          )}
        </button>

        {/* Custom groups */}
        <div className="mt-2 flex flex-col gap-1 flex-1 overflow-y-auto pr-1 min-h-0">
          {dummyGroups.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              count={group.count}
              collapsed={collapsed}
              setViewGroup={setViewGroup}
              viewGroup={viewGroup}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}
