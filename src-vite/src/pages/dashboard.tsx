import { Fragment, useEffect, useRef, useState } from "react";
import { get_group, get_groups, get_snippets, create_item, update_item, delete_item } from "../api";
import Navbar, { type SearchResult } from "../components/dashboard/navbar";
import Sidebar from "../components/dashboard/sidebar";
import { FaPen, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import CreateItem from "../components/popups/createitem";
import SnippetCard from "../components/dashboard/snippetcard";
import EditItem from "../components/popups/edititem";
import { StatusBar } from "../components/statusbar";
import DeleteItem from "../components/popups/deleteitem";
import useStatusBar from "../hooks/useStatusBar";
import { truncateString } from "../utils/truncatestring";

export default function Dashboard() {
  /*
    Main content of the dashboard is displayed based on the groupName
    This includes virtual groups recent and favourites
  */
  const params = useParams();
  const { groupName } = params;

  /*
    Highlight a searched snippet
    The search results from navbar search can point to a snippet cards inside a group
  */
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);

  // Tracks the snippet elements by their id for scroll restoration
  const snippetRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function scroll_to_snippet(id: number) {
    const el = snippetRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /*
    Navigate to other groups or snippet views
  */
  const navigate = useNavigate();

  /*
    Status bar status for showing success/error messages
    Some messages are not shown here
  */
  const { statusBarQueue, pushToStatusBar, popFromStatusBar, promoteInStatusBar } = useStatusBar(5);

  /*
    States and functions to create a new group or snippet
    Status for create item is shown inside the popup itself, not inside the status bar
  */
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

  async function confirm_create_item(name: string, description: string) {
    // To create a new item, only item type is required for the popup
    // This function is called within the popup
    // To create a group, the groupName parameter is not used, but is included for compatibility with API
    // Group name includes virtual groups as well, but ui doesn't show create button inside virtual groups
    //   or the api rejects them anyway
    const response = await create_item(createItemType, groupName || "", name, description);

    if (!response.status) {
      setCreateItemStatus({ status: "error", message: response.message });
      return;
    }

    setCreateItemOpen(false);
    pushToStatusBar({ status: "success", message: `Created ${createItemType} "${truncateString(name)}"` });

    // The popup doesn't know which item type was Created
    // To ensure the item info is updated, both groups and snippets are fetched again
    const groups = await get_groups();
    if (groups.status) setGroups(groups.groups);
    else pushToStatusBar({ status: "warning", message: groups.message + " (group list may be out of sync)" });

    const snippets = await get_snippets(groupName || "");
    if (snippets.status) setSnippets(snippets.snippets);
    else pushToStatusBar({ status: "warning", message: snippets.message + " (snippet list may be out of sync)" });
  }

  function cancel_create_item() {
    setCreateItemOpen(false);
  }

  /*
    Toggles the favourited status of a snippet
    ISSUE: favourite count in side bar doesn't update unless reloaded
  */
  async function toggle_favourite(groupName: string, name: string, favourite: boolean) {
    const response = await update_item("snippet", groupName, name, null, null, favourite, null);

    if (!response.status) {
      pushToStatusBar({ status: "error", message: response.message });
      return;
    }
  }

  /*
    States and functions for editing a group
    Only groups can be updated from the dashboard
  */
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
    // Groups don't have tags, but it is included for popup prop compatibility
    const response = await update_item("group", groupName || "", name, newName, description, null, tags ? null : null);

    if (!response.status) {
      setEditGroupStatus({ status: "error", message: response.message });
      return;
    }

    setEditGroupOpen(false);
    pushToStatusBar({ status: "success", message: `Updated group "${truncateString(name)}"` });

    // Refresh the page to syn with changes
    if (name !== newName) {
      // Navigate to the new group name if group name was updated
      navigate(`/group/${newName}`);
    } else {
      // ISSUE: this doesn't work because the url is the same
      navigate(`/group/${name}`);
    }
  }

  function cancel_edit_group() {
    setEditGroupOpen(false);
  }

  /*
    States and methods for deleting an item
  */
  const [deleteItemOpen, setDeleteItemOpen] = useState<boolean>(false);
  const [deleteItemType, setDeleteItemType] = useState<"snippet" | "group">(
    "snippet",
  );
  const [deleteItemName, setDeleteItemName] = useState<string>("");
  const [deleteItemStatus, setDeleteItemStatus] = useState<{
    status: "default" | "error";
    message: string;
  }>({ status: "default", message: "" });

  function open_delete_item(itemType: "snippet" | "group", name: string) {
    setDeleteItemType(itemType);
    setDeleteItemName(name);
    setDeleteItemStatus({ status: "default", message: "" });
    setDeleteItemOpen(true);
  }

  async function confirm_delete_item(itemType: "snippet" | "group", name: string) {
    // To delete an item, both item type and item name are required for the popup
    const response = await delete_item(itemType, groupName || "", name);

    if (!response.status) {
      setDeleteItemStatus({ status: "error", message: response.message });
      return;
    }

    setDeleteItemOpen(false);
    pushToStatusBar({ status: "success", message: `Deleted ${itemType} "${truncateString(name)}"` });

    // If the deleted item was the current group, navigate to the default group
    //   because the current group name is no longer valid
    if (itemType === "group" && groupName === name) {
      navigate("/group/default/");
      return;
    }

    // Refresh the group list and snippet list after deletion
    // Becuase the function doesn't know what item type was deleted
    const groups = await get_groups();
    if (groups.status) setGroups(groups.groups);
    else pushToStatusBar({ status: "warning", message: groups.message + " (group list may be out of sync)" });

    const snippets = await get_snippets(groupName || "");
    if (snippets.status) setSnippets(snippets.snippets);
    else pushToStatusBar({ status: "warning", message: snippets.message + " (snippet list may be out of sync)" });
  }

  function cancel_delete_item() {
    setDeleteItemOpen(false);
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
      groupName: string;
      name: string;
      description: string;
      tags: string[];
      favourite: boolean;
    }[]
  >([]);

  useEffect(() => {
    async function get_dashboard_info() {
      const groups = await get_groups();
      if (groups.status) setGroups(groups.groups);
      else pushToStatusBar({ status: "error", message: groups.message });

      const group = await get_group(groupName || "");
      if (group.status) setGroup(group.group);
      else pushToStatusBar({ status: "error", message: group.message });

      const snippets = await get_snippets(groupName || "");
      if (snippets.status) setSnippets(snippets.snippets);
      else pushToStatusBar({ status: "error", message: snippets.message });
    }

    get_dashboard_info();
  }, [groupName]);


  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col overflow-y-hidden">
      {/* Navbar */}
      <Navbar searchResult={searchResult} setSearchResult={setSearchResult} scrollToSnippet={scroll_to_snippet} pushToStatusBar={pushToStatusBar} />

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar groups={groups} openCreateItem={open_create_item} openDeleteItem={open_delete_item} />

        {/* Main Content */}
        <main className="flex flex-col flex-1 min-h-0 p-3">
          {/* Header */}
          <div className="text-[#50fa7b] mb-4 flex justify-between">
            {/* Terminal-style path */}
            <span className="cursor-blink py-2">
              user@cmdsheet<span className="text-white">:</span>
              <span className="text-blue-500">~/{groupName}</span>
              <span className="text-white">$</span>
            </span>

            {/* Edit info and add snipepts */}
            {
              !["recent", "favourites"].includes(groupName || "") &&
              <Fragment>
                <button
                  className="px-1 py-1 rounded text-sm transition ml-auto mr-4"
                  onClick={() => open_edit_group()}
                >
                  <FaPen className="text-[#6272a4] hover:text-[#8be9fd]" />
                </button>

                <button
                  className="text-[#50fa7b] hover:text-[#8be9fd] transition flex items-center gap-2 px-3 py-1
                  border border-[#50fa7b] hover:border-[#bd93f9] rounded"
                  onClick={() => open_create_item("snippet")}
                >
                  <FaPlus />
                  <span>Add snippet</span>
                </button>
              </Fragment>
            }
          </div>

          {/* Description */}
          <div className="mb-4 p-3 bg-[#2c2e3a] rounded text-[#f8f8f2] opacity-80 px-4">
            <p className="text-[#6272a4]">
              {group.description ? group.description : <i className="opacity-25">No description available</i>}
            </p>
          </div>

          {/* Content box */}
          <div className="text-[#6272a4] flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
              {snippets.map((item) => (
                // Outer div with id for scroll restoration
                <div
                  id={`snippet-${item.id}`}
                  ref={(el: HTMLDivElement | null) => {
                    snippetRefs.current[item.id] = el;
                  }}
                  key={item.id}
                >
                  <SnippetCard
                    item={item}
                    toggleFavourite={toggle_favourite}
                    openDeleteItem={open_delete_item}
                    searchResult={searchResult}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <StatusBar statusQueue={statusBarQueue} onPop={popFromStatusBar} onPromote={promoteInStatusBar} />

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
      {
        deleteItemOpen &&
        <DeleteItem
          itemType={deleteItemType}
          itemName={deleteItemName}
          onConfirm={confirm_delete_item}
          onClose={cancel_delete_item}
          status={deleteItemStatus}
        />
      }
    </div>
  );
}
