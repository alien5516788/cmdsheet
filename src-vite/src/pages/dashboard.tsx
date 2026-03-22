import { useEffect, useState } from "react";
import Navbar from "../components/dashboard/navbar";
import Sidebar from "../components/dashboard/sidebar";
import { FaPen, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import CreateItem from "../components/popups/createitem";
import { get_group, get_groups, get_snippets, create_item, update_item } from "../api";
import SnippetCard from "../components/dashboard/snippetcard";
import EditItem from "../components/popups/edititem";

export default function Dashboard() {
  // Extract groupName from url params
  // Main content of the dashboard is displayed based on the groupName
  const params = useParams();
  const { groupName } = params;

  const navigate = useNavigate();

  // Add a new snippet or a group
  const [createItemOpen, setCreateItemOpen] = useState<boolean>(false);
  const [createItemType, setCreateItemType] = useState<"snippet" | "group">(
    "snippet",
  );
  const [createItemStatus, setCreateItemStatus] = useState<{
    status: "default" | "error";
    message: string;
  }>({ status: "default", message: "" });

  function open_create_item(itemType: "snippet" | "group") {
    setCreateItemType(itemType);
    setCreateItemStatus({ status: "default", message: "" });
    setCreateItemOpen(true);
  }

  async function confirm_create_item(itemType: "snippet" | "group", name: string, description: string) {
    const response = await create_item(itemType, groupName || "", name, description);

    if (!response.status) {
      setCreateItemStatus({ status: "error", message: response.message });
      return;
    }

    setCreateItemOpen(false);
    setCreateItemStatus({ status: "default", message: "" })

    const groups = await get_groups();
    setGroups(groups.status ? groups.groups : []);

    const snippets = await get_snippets(groupName || "");
    setSnippets(snippets.status ? snippets.snippets : []);
  }

  function cancel_create_item() {
    setCreateItemOpen(false);
    setCreateItemStatus({ status: "default", message: "" });
  }

  // Toggle favourite for a snippet
  async function toggle_favourite(name: string, favourite: boolean) {
    const response = await update_item("snippet", groupName || "", name, null, null, favourite, null);

    if (!response.status) {
      await pywebview.api.print_log("Log: Failed to toggle favourite\n" + response.message);
      return;
    }
  }

  // Update group
  // Only groups can be updated from the dashboard
  const [editGroupOpen, setEditGroupOpen] = useState<boolean>(false);
  const [editGroupStatus, setEditGroupStatus] = useState<{
    status: "default" | "error";
    message: string;
  }>({ status: "default", message: "" });


  function open_edit_group() {
    setEditGroupOpen(true);
    setEditGroupStatus({ status: "default", message: "" });
  }

  async function confirm_edit_group(name: string, newName: string, description: string, tags?: string[] | null) {
    // Groups don't have tags
    // 'tags' parameter is only there to be compatible with the edit item component
    const response = await update_item("group", groupName || "", name, newName, description, null, tags ? null : null);

    if (!response.status) {
      setEditGroupStatus({ status: "error", message: response.message });
      return;
    }

    setEditGroupOpen(false);
    setEditGroupStatus({ status: "default", message: "" })

    // ISSUE: Doesn't reload if the group name is unchanged
    navigate(`/group/${newName}`);
  }

  function cancel_edit_group() {
    setEditGroupOpen(false);
    setEditGroupStatus({ status: "default", message: "" });
  }

  // Group list
  const [groups, setGroups] = useState<
    {
      id: number;
      name: string;
      snippetCount: number;
    }[]
  >([]);

  // Current group
  const [group, setGroup] = useState<
    {
      name: string;
      description: string;
    }
  >({
    name: groupName || "default",
    description: ""
  });

  // Snippet list of current group
  const [snippets, setSnippets] = useState<
    {
      id: string;
      name: string;
      description: string;
      tags: string[];
      favourite: boolean;
    }[]
  >([]);


  useEffect(() => {
    async function get_dashboard_info() {
      let response = await get_groups();
      setGroups(response.status ? response.groups : []);

      response = await get_group(groupName || "");
      setGroup(response.status ? response.group : { name: groupName || "", description: "" });

      response = await get_snippets(groupName || "");
      setSnippets(response.status ? response.snippets : []);
    }
    get_dashboard_info();
  }, [groupName]);

  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col overflow-y-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar groups={groups} openCreateItem={open_create_item} />

        {/* Main Content */}
        <main className="flex flex-col flex-1 min-h-0 p-3">
          {/* Header */}
          <div className="text-[#50fa7b] mb-4 flex justify-between">
            {/* Terminal-style path */}
            <span className="cursor-blink">
              user@cmdsheet<span className="text-white">:</span>
              <span className="text-blue-500">~/{groupName}</span>
              <span className="text-white">$</span>
            </span>

            {/* Edit info */}
            <button
              className="px-1 py-1 rounded text-sm transition ml-auto mr-4"
              onClick={() => open_edit_group()}
            >
              <FaPen className="text-[#6272a4] hover:text-[#8be9fd]" />
            </button>

            {/* Add Snippet */}
            <button
              className="text-[#50fa7b] hover:text-[#8be9fd] transition flex items-center gap-2 px-3 py-1
              border border-[#50fa7b] hover:border-[#bd93f9] rounded"
              onClick={() => open_create_item("snippet")}
            >
              <FaPlus />
              <span>Add snippet</span>
            </button>
          </div>

          {/* Description */}
          <div className="mb-4 p-3 bg-[#2c2e3a] rounded text-[#f8f8f2] opacity-80 px-4">
            <p className="text-[#6272a4]">
              {group.description || "No description available."}
            </p>
          </div>

          {/* Content box */}
          <div className="text-[#6272a4] flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {snippets.map((item) => (
                <SnippetCard key={item.id} item={item} groupName={groupName || "default"} toggle_favourite={toggle_favourite} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Item Popup */}
      {
        createItemOpen &&
        <CreateItem
          itemType={createItemType}
          onConfirm={confirm_create_item}
          onClose={cancel_create_item}
          status={createItemStatus}
        />
      }
      {
        editGroupOpen &&
        <EditItem
          itemType="group"
          item={group}
          onConfirm={confirm_edit_group}
          onClose={cancel_edit_group}
          status={editGroupStatus}
        />
      }

    </div>
  );
}
