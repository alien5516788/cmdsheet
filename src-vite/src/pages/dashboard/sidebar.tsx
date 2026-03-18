import { useEffect, useState } from "react";
import { FaBars, FaCode, FaHistory, FaPlus, FaStar } from "react-icons/fa";
import GroupCard, { DefaultGroupCard } from "./groupcard";

interface SidebarProps {
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
  groupName: string;
}

export default function Sidebar(props: SidebarProps) {
  const { setGroupName, groupName } = props;

  // Collapse sidebar
  const [collapsed, setCollapsed] = useState(false);

  // Fetch group list from API
  const [groups, setGroups] = useState<
    {
      id: string;
      name: string;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    async function fetch_groups() {
      try {
        const groups = await pywebview.api.get_groups();
        setGroups(groups);
      } catch (err) {
        await pywebview.api.print_log("Log: Failed to fetch groups\n" + err);
      }
    }

    fetch_groups();
  }, []);

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
      <nav className="flex flex-col gap-2 px-2 flex-1 min-h-0 p-3">
        {/* default, recent, favourites are permanent groups */}
        <DefaultGroupCard
          name="default"
          count={groups.find((g) => g.id === "default")?.count || 0}
          groupName={groupName}
          setGroupName={setGroupName}
          icon={<FaCode />}
          collapsed={collapsed}
        />
        <DefaultGroupCard
          name="recent"
          count={groups.find((g) => g.id === "recent")?.count || 0}
          groupName={groupName}
          setGroupName={setGroupName}
          icon={<FaHistory />}
          collapsed={collapsed}
        />
        <DefaultGroupCard
          name="favourites"
          count={groups.find((g) => g.id === "favourites")?.count || 0}
          groupName={groupName}
          setGroupName={setGroupName}
          icon={<FaStar />}
          collapsed={collapsed}
        />

        {/* Add group button */}
        <button
          className="text-[#50fa7b] hover:text-[#8be9fd] transition flex items-center gap-3 px-3 py-1
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
        <div className="mt-2 flex flex-col gap-1 flex-1 overflow-y-auto pr-1 min-h-0">
          {groups
            .filter(
              (group) =>
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
