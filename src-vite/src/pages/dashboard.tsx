import { useEffect, useState } from "react";
import Navbar from "../components/dashboard/navbar";
import Sidebar from "../components/dashboard/sidebar";
import { FaPen, FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CreateItem from "../components/popups/createitem";
import { get_group, get_groups, get_snippets, create_item } from "../api";
import SnippetCard from "../components/dashboard/snippetcard";

export default function Dashboard() {
  // Extract groupName from url params
  // Main content of the dashboard is displayed based on the groupName
  const params = useParams();
  const { groupName } = params;

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

  async function confirm_create_item(itemType: "snippet" | "group", groupName: string, name: string, description: string) {
    const response = await create_item(itemType, groupName, name, description);

    if (!response.status) {
      setCreateItemStatus({ status: "error", message: response.message });
      return;
    }

    setCreateItemOpen(false);
    setCreateItemStatus({ status: "default", message: "" })

    const groups = await get_groups();
    setGroups(groups.status ? groups.groups : []);

    const snippets = await get_snippets(groupName || "default");
    setSnippets(snippets.status ? snippets.snippets : []);
  }

  function cancel_create_item() {
    setCreateItemOpen(false);
    setCreateItemStatus({ status: "default", message: "" });
  }

  // Group list
  const [groups, setGroups] = useState<
    {
      id: number;
      name: string;
      snippetcount: number;
    }[]
  >([]);

  // Current group
  const [group, setGroup] = useState<
    {
      name: string;
      description: string;
    }
  >({
    name: groupName || "",
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

      response = await get_group(groupName || "default");
      setGroup(response.status ? response.group : { name: groupName || "default", description: "" });

      response = await get_snippets(groupName || "default");
      setSnippets(response.status ? response.snippets : []);
    }
    get_dashboard_info();
  }, [groupName]);

  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col overflow-y-hidden">
      {/* Navbar */}
      <Navbar groupName={groupName || "default"} />

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
              onClick={() => console.log("Edit info clicked")}
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
                <SnippetCard key={item.id} item={item} groupName={groupName || "default"} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Item Popup */}
      {
        createItemOpen && (
          <CreateItem
            itemType={createItemType}
            onConfirm={confirm_create_item}
            onClose={cancel_create_item}
            status={createItemStatus}
          />
        )
      }
      {/*<EditItem
        itemType={editItemType}
        initialName={editItemName}
        initialDescription={editItemDescription}
        initialTags={editItemTags}
        onConfirm={update_item}
        onClose={cancel_edit_item}
        status={editStatus}
      />*/}

    </div>
  );
}
