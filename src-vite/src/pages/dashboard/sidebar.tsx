import { useEffect, useState } from "react";
import { FaBars, FaCode, FaHistory, FaPlus, FaStar } from "react-icons/fa";
import GroupCard from "./groupcard";
import { useNavigate } from "react-router-dom";

interface SidebarItemProps {
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
  groupName: string;
  label: string;
  icon: React.ReactNode;
  collapsed: boolean;
}

function SidebarItem(props: SidebarItemProps) {
  const { setGroupName, groupName, label, icon, collapsed } = props;
  const navigate = useNavigate();

  return (
    <button
      className={`flex items-center gap-3 px-3 py-2 text-[#f8f8f2] hover:bg-[#44475a] transition
      ${label === groupName ? "bg-[#44475a]" : ""}`}
      onClick={() => {
        setGroupName(label);
        navigate(`/group/${label}`);
      }}
    >
      <span className="text-[#8be9fd] flex items-center w-5 h-7">{icon}</span>
      {!collapsed && <span className="flex items-center h-7">{label}</span>}
    </button>
  );
}

interface SidebarProps {
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
  groupName: string;
}

export default function Sidebar(props: SidebarProps) {
  const { setGroupName, groupName } = props;

  // Collapse sidebar
  const [collapsed, setCollapsed] = useState(false);

  function toggleSidebar() {
    setCollapsed(!collapsed);
  }

  // Fetch group list from API
  const [groups, setGroups] = useState<
    {
      id: string;
      name: string;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const groups = await pywebview.api.get_groups();
        setGroups(groups);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      }
    }

    fetchGroups();
  }, []);

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
          groupName={groupName}
          setGroupName={setGroupName}
          icon={<FaCode />}
          collapsed={collapsed}
        />
        <SidebarItem
          label="recent"
          groupName={groupName}
          setGroupName={setGroupName}
          icon={<FaHistory />}
          collapsed={collapsed}
        />
        <SidebarItem
          label="favourites"
          groupName={groupName}
          setGroupName={setGroupName}
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
          {groups
            .filter((group) =>
              !["default", "recent", "favourites"].includes(group.id),
            )
            .map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                count={group.count}
                collapsed={collapsed}
                setGroupName={setGroupName}
                groupName={groupName}
              />
            ))}
        </div>
      </nav>
    </aside>
  );
}
