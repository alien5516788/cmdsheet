import { useEffect, useState } from "react";
import ItemCard from "../components/dashboard/snippetcard";
import Navbar from "../components/dashboard/navbar";
import Sidebar from "../components/dashboard/sidebar";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CreateItem from "../components/popups/createitem";
import { get_error_message } from "../utils/get_error_message";

export default function Dashboard() {
  // Extract groupId from url params
  const params = useParams();
  const { groupId } = params;

  // Dashboard is required to know which group to display snippets from
  // Since dashboard does not fetch group details, groupName is set from the sidebar
  const [groupName, setGroupName] = useState<string>("default");

  // Add a new snippet or a group
  const [createItemOpen, setCreateItemOpen] = useState<boolean>(false);
  const [createItemType, setCreateItemType] = useState<"snippet" | "group">(
    "snippet",
  );
  const [createItemStatus, setCreateItemStatus] = useState<{
    status: "default" | "error" | "warning";
    message: string;
  }>({ status: "default", message: "" });

  function toggle_create_item_open(itemType: "snippet" | "group") {
    setCreateItemType(itemType);
    setCreateItemStatus({ status: "default", message: "" });
    setCreateItemOpen(true);
  }

  async function check_create_item(itemType: "snippet" | "group", name: string) {
    try {
      const response = await pywebview.api.check_item(itemType, name);
      setCreateItemStatus(response);
    } catch (err: unknown) {
      await pywebview.api.print_log(get_error_message(err));
    }
  }

  async function confirm_create_item(
    itemType: "snippet" | "group",
    name: string,
    description: string,
  ) {
    try {
      const response = await pywebview.api.create_item(
        itemType,
        name,
        description,
      );
      if (response.status === "error") {
        setCreateItemStatus(response);
      } else {
        setCreateItemOpen(false);
        await get_snippets();
        await get_groups();
      }
    } catch (err: unknown) {
      await pywebview.api.print_log(get_error_message(err));
    }
  }

  function cancel_create_item() {
    setCreateItemOpen(false);
    setCreateItemStatus({ status: "default", message: "" });
  }

  // Fetch group list from API
  const [groups, setGroups] = useState<
    {
      id: string;
      name: string;
      count: number;
    }[]
  >([]);

  async function get_groups() {
    try {
      const groups = await pywebview.api.get_groups();
      setGroups(groups);
    } catch (err) {
      await pywebview.api.print_log("Log: Failed to fetch groups\n" + err);
    }
  }

  // Fetch snippet list from API
  const [snippets, setSnippets] = useState<
    {
      id: string;
      name: string;
      description: string;
      tags: string[];
    }[]
  >([]);

  async function get_snippets() {
    try {
      const snippets = await pywebview.api.get_snippets(groupId);
      setSnippets(snippets);
    } catch (err) {
      await pywebview.api.print_log("Log: Failed to fetch snippets\n" + err);
    }
  }

  useEffect(() => {
    async function fetch_snippets() {
      await get_snippets();
    }
    fetch_snippets();

    async function fetch_groups() {
      await get_groups();
    }
    fetch_groups();
  }, [groupId]);

  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col overflow-y-hidden">
      {/* Navbar */}
      <Navbar groupName={groupName} />

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar groups={groups} groupName={groupName} setGroupName={setGroupName} toggleCreateItemOpen={toggle_create_item_open} />

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

            {/* Add Snippet */}
            <button
              className="text-[#50fa7b] hover:text-[#8be9fd] transition flex items-center gap-2 px-3 py-1
              border border-[#50fa7b] hover:border-[#bd93f9] rounded"
              onClick={() => toggle_create_item_open("snippet")}
            >
              <FaPlus />
              <span>Add snippet</span>
            </button>
          </div>

          {/* Content box */}
          <div className="text-[#6272a4] flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {snippets.map((item) => (
                <ItemCard key={item.id} item={item} />
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
            onChange={check_create_item}
            onConfirm={confirm_create_item}
            onClose={cancel_create_item}
            status={createItemStatus}
          />
        )
      }
    </div>
  );
}
