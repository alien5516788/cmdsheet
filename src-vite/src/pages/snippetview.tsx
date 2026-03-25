import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaPen, FaStar } from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { get_snippet, update_item, update_snippet_content } from "../api";
import EditItem from "../components/popups/edititem";
import type { SnippetBlock } from "../components/snippetview/snippeteditor";
import SnippetEditor from "../components/snippetview/snippeteditor";
import { StatusBar } from "../components/statusbar";
import useStatusBar from "../hooks/useStatusBar";
import { truncateString } from "../utils/truncatestring";


interface Snippet {
  name: string;
  description: string;
  tags: string[];
  content: SnippetBlock[];
  favourite: boolean;
}

export default function SnippetView() {
  /*
    Content of the snippetview depends on the group and snippet name
  */
  const { groupName, snippetName } = useParams();

  /*
    Navigate back to the dashboard or group view
    groupName is the actual group name which the snippet belongs to
    But the redirection can be happened from both real groups and virtual groups (recent, favourites)
    In order to go back the previous group name is needed, regardless being real or virtual,
      so the previous group name is taken from the search params
    Can have 'prevGroup' query param
  */
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /*
    Status bar status for showing success/error messages
    Some messages are not shown here
  */
  const { statusBarQueue, pushToStatusBar, popFromStatusBar, promoteInStatusBar } = useStatusBar(5);



  // Track changes to current snippet content
  // Snippet editor works with this state to track changes before saving
  const [updatedContent, setUpdatedContent] = useState<SnippetBlock[]>([]);

  /*
    Toggles the favourited status of a snippet
    ISSUE: favourite count in side bar doesn't update unless reloaded
  */
  const [favourite, setFavourite] = useState(false);

  async function toggle_favourite(name: string, favourite: boolean) {
    const response = await update_item("snippet", groupName || "", name, null, null, favourite, null);

    if (!response.status) {
      pushToStatusBar({ status: "error", message: response.message });
      return;
    }
  }

  /*
    Status and functions for the edit snippet dialog
  */
  const [editSnippetOpen, setEditSnippetOpen] = useState<boolean>(false);
  const [editSnippetStatus, setEditSnippetStatus] = useState<{
    status: "default" | "error";
    message: string;
  }>({ status: "default", message: "" });


  function open_edit_snippet() {
    setEditSnippetOpen(true);
    setEditSnippetStatus({ status: "default", message: "" });
  }

  async function confirm_edit_snippet(name: string, newName: string, description: string, tags?: string[] | null) {
    // Favourited state and content of the snipept is not updated here
    const response = await update_item("snippet", groupName || "", name, newName, description, null, tags ? tags : null);

    if (!response.status) {
      setEditSnippetStatus({ status: "error", message: response.message });
      return;
    }

    setEditSnippetOpen(false);
    pushToStatusBar({ status: "success", message: `Updated snippet "${truncateString(name)}"` });

    // Refresh the snippet view to sync with changes
    // ISSUE: Doesn't reload if the snippet name is unchanged
    navigate(`/group/${groupName}/${newName}?prevGroup=${searchParams.get("prevGroup")}`);
  }

  function cancel_edit_snippet() {
    setEditSnippetOpen(false);
    setEditSnippetStatus({ status: "default", message: "" });
  }

  // Current snippet
  const [snippet, setSnippet] = useState<Snippet>({
    name: "",
    description: "",
    tags: [],
    content: [],
    favourite: false,
  });

  useEffect(() => {
    async function get_snippetview_info() {
      const response = await get_snippet(groupName || "default", snippetName || "");
      if (response.status) {
        setSnippet(response.snippet);
        setFavourite(response.snippet.favourite);
        setUpdatedContent(response.snippet.content || []); // important: initialize updatedContent
      } else {
        pushToStatusBar({ status: "error", message: response.message });
      }
    }

    get_snippetview_info();
  }, [snippetName, groupName]);


  /*
    Sync snippet content with db
  */
  const firstRender = useRef(true);

  useEffect(() => {
    // Prevent render on initial load
    // Becuase updatedContent is initialized after the first render
    // so the first save is skipped
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // If there is no content, do nothing
    // ISSUE: problamatic isn't it ?
    if (!updatedContent || updatedContent.length === 0) return;

    async function update_snippet_info() {
      const response = await update_snippet_content(
        groupName || "", snippetName || "", updatedContent
      );
      if (!response.status) pushToStatusBar({ status: "error", message: response.message });
    }

    update_snippet_info();
  }, [updatedContent, groupName, snippetName]);


  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col">
      <div className="h-full w-[70vw] mx-auto flex">
        {/* Large back button aside */}
        <button
          className="flex h-full w-20 items-center gap-2 text-[#8be9fd]
          bg-[#44475a] opacity-10 hover:opacity-50 p-3"
          onClick={() => navigate(`/group/${searchParams.get("prevGroup")}`)}
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        {/* Main Content */}
        <main className="flex-1 flex flex-col border border-[#44475a] overflow-y-auto px-4 pb-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-4  pt-6 px-4 sticky top-0 z-50 bg-[#282a36]">
            {/* Title */}
            <h2 className="text-[#8be9fd] text-xl font-medium mb-3">/{snippet.name}</h2>

            {/* Edit info */}
            <div className="flex gap-2">
              {/* Details */}
              <button
                className="px-1 py-1 rounded text-sm transition"
                onClick={() => open_edit_snippet()}
              >
                <FaPen className="text-[#6272a4] hover:text-[#8be9fd]" />
              </button>

              {/* Favourite */}
              <button
                className="px-1 py-1 rounded text-sm transition ml-auto"
                onClick={() => {
                  toggle_favourite(snippetName || "", !favourite);
                  setFavourite(!favourite);
                }}
              >
                <FaStar className={`${favourite ? " text-[#f1fa8c]" : "text-[#6272a4]"} hover:text-[#f8f8f2]`} />
              </button>
            </div>
          </div>

          {/* Snippet info */}
          <div className="mb-1 bg-[#2c2e3a] p-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 my-2">
              {snippet.tags.length > 0 ? (
                snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#6272a4] text-[#f8f8f2] px-2 py-0.5 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="bg-[#6272a4] text-[#f8f8f2] px-2 py-0.5 rounded text-xs opacity-25">
                  <i>No tags</i>
                </span>
              )}
            </div>

            {/* Description */}
            <div className="flex justify-between items-start mt-2">
              <p className="text-[#6272a4]">
                {snippet.description ? snippet.description : <i className="opacity-25">{"No description available"}</i>}
              </p>
            </div>
          </div>

          {/* Snippet Content */}
          <div className="flex-1 rounded p-4 text-sm font-mono whitespace-pre-wrap">
            <SnippetEditor content={updatedContent} updateContent={setUpdatedContent} />
          </div>

          {/* Status bar */}
          <StatusBar statusQueue={statusBarQueue} onPop={popFromStatusBar} onPromote={promoteInStatusBar} />
        </main>
      </div>

      {
        editSnippetOpen &&
        <EditItem
          itemType="snippet"
          item={snippet}
          onConfirm={confirm_edit_snippet}
          onClose={cancel_edit_snippet}
          status={editSnippetStatus}
        />
      }
    </div>
  );
}
