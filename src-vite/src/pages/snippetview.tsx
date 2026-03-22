import { useEffect, useState } from "react";
import { FaArrowLeft, FaPen, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { get_snippet, update_item } from "../api";
import EditItem from "../components/popups/edititem";
import type { SnippetBlock } from "../components/snippetview/snippeteditor";
import SnippetEditor from "../components/snippetview/snippeteditor";


interface Snippet {
  name: string;
  description: string;
  tags: string[];
  content: SnippetBlock[];
  favourite: boolean;
}

export default function SnippetView() {
  const { groupName, snippetName } = useParams();
  const navigate = useNavigate();

  const [snippet, setSnippet] = useState<Snippet>({
    name: "",
    description: "",
    tags: [],
    content: [],
    favourite: false,
  });

  // Favourite state
  const [favourite, setFavourite] = useState(false);

  async function toggle_favourite(name: string, favourite: boolean) {
    const response = await update_item("snippet", groupName || "", name, null, null, favourite, null);

    if (!response.status) {
      await pywebview.api.print_log("Log: Failed to toggle favourite\n" + response.message);
      return;
    }
  }

  // Update snippet
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
    const response = await update_item("snippet", groupName || "", name, newName, description, null, tags ? tags : null);

    if (!response.status) {
      setEditSnippetStatus({ status: "error", message: response.message });
      return;
    }

    setEditSnippetOpen(false);
    setEditSnippetStatus({ status: "default", message: "" });

    // ISSUE: Doesn't reload if the snippet name is unchanged
    navigate(`/group/${groupName}/${newName}`);
  }

  function cancel_edit_snippet() {
    setEditSnippetOpen(false);
    setEditSnippetStatus({ status: "default", message: "" });
  }

  // Edit snippet content
  const [updatedContent, setUpdatedContent] = useState<SnippetBlock[]>([]);

  function update_content(newContent: SnippetBlock[]) {
    // TODO: make api call
    setUpdatedContent(newContent);
  }


  useEffect(() => {
    async function get_snippetview_info() {
      const response = await get_snippet(groupName || "default", snippetName || "");
      setSnippet(response.status ? response.snippet : {});
      setFavourite(response.status ? response.snippet.favourite : false);
    }
    get_snippetview_info();
  }, [snippetName, groupName, updatedContent]);

  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col overflow-y-hidden">
      <div className="h-full w-[70vw] mx-auto border border-[#44475a]">
        {/* Navbar with Back */}
        <div className="flex items-center bg-[#44475a] p-3 text-[#50fa7b]">
          <button
            className="flex items-center gap-2 text-[#50fa7b] hover:text-[#8be9fd]"
            onClick={() => navigate(`/group/${groupName}`)}
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            {/* Title */}
            <h2 className="text-[#8be9fd] text-xl font-medium mb-3">{snippet.name}</h2>

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
          <div className="mb-4 bg-[#2c2e3a] p-3">
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
                <span className="bg-[#6272a4] text-[#f8f8f2] px-2 py-0.5 rounded text-xs">
                  <i>No tags</i>
                </span>
              )}
            </div>

            {/* Description */}
            <div className="flex justify-between items-start mt-3 mb-4 mr-6">
              <SnippetEditor content={snippet.content} update_content={update_content} />
            </div>
          </div>

          {/* Snippet Content */}
          <div className="flex-1 bg-[#2c2e3a] rounded p-4 overflow-auto text-sm font-mono whitespace-pre-wrap">
            {snippet.toString() || "// No content yet"}
          </div>
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
