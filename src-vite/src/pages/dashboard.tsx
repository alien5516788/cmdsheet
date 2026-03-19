import { useEffect, useState } from "react";
import ItemCard from "../components/dashboard/snippetcard";
import Navbar from "../components/dashboard/navbar";
import Sidebar from "../components/dashboard/sidebar";
import { FaPen, FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CreateItem from "../components/popups/createitem";
import { get_error_message } from "../utils/get_error_message";

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
    status: "default" | "error" | "warning";
    message: string;
  }>({ status: "default", message: "" });

  function toggle_create_item_open(itemType: "snippet" | "group") {
    setCreateItemType(itemType);
    setCreateItemStatus({ status: "default", message: "" });
    setCreateItemOpen(true);
  }

  async function confirm_create_item(
    itemType: "snippet" | "group",
    name: string,
    groupName: string, // only used for snippets
    description: string,
  ) {
    try {
      const response = await pywebview.api.create_item(
        itemType,
        name,
        groupName,
        description,
      );
      if (response.status != "default") {
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
      name: string;
      snippetcount: number;
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

  // Fetch group info from API
  const [group, setGroup] = useState<
    {
      name: string;
      description: string;
      snippetcount: number;
      tags: string[];
    }
  >({
    name: groupName || "",
    description: "",
    snippetcount: 0,
    tags: [],
  });

  async function get_group() {
    try {
      const group = await pywebview.api.get_group(groupName);
      setGroup(group);
    } catch (err) {
      await pywebview.api.print_log("Log: Failed to fetch group\n" + err);
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
      const snippets = await pywebview.api.get_snippets(groupName);
      setSnippets(snippets);
    } catch (err) {
      await pywebview.api.print_log("Log: Failed to fetch snippets\n" + err);
    }
  }

  useEffect(() => {
    async function fetch_groups() {
      await get_groups();
    }
    fetch_groups();

    async function fetch_group() {
      await get_group();
    }
    fetch_group();

    async function fetch_snippets() {
      await get_snippets();
    }
    fetch_snippets();
  }, [groupName]);

  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col overflow-y-hidden">
      {/* Navbar */}
      <Navbar groupName={groupName || "group"} />

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar groups={groups} toggleCreateItemOpen={toggle_create_item_open} />

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

          {/* Group Info */}
          <div className="mb-4 p-3 bg-[#2c2e3a] rounded text-[#f8f8f2] opacity-80">
            {/* Tags Row */}
            <div className="flex justify-between items-center mb-2">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {group.tags.length > 0 ? (
                  group.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#6272a4] text-[#f8f8f2] px-2 py-0.5 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="bg-[#6272a4] text-[#f8f8f2] text-xs px-2 py-0.5 rounded">
                    <i>No tags</i>
                  </span>
                )}
              </div>

              {/* Add tags */}
              <button
                className="px-1 py-1 rounded text-sm transition"
                onClick={() => console.log("Add Description clicked")}
              >
                <FaPlus className="text-[#6272a4] hover:text-[#8be9fd]" />
              </button>
            </div>

            {/* Description Row */}
            <div className="flex justify-between items-start mt-4">
              {/* Description */}
              <p className="text-[#6272a4]">
                {group.description || "No description available."}
              </p>
              {/* Edit Description */}
              <button
                className="px-1 py-1 rounded text-sm transition"
              >
                <FaPen className="text-[#6272a4] hover:text-[#8be9fd]" />
              </button>
            </div>
          </div>

          {/* Content box */}
          <div className="text-[#6272a4] flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {snippets.map((item) => (
                <ItemCard key={item.name} item={item} groupName={groupName || "default"} />
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
    </div>
  );
}
