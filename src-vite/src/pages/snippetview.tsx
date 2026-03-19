import { useEffect, useState } from "react";
import { FaArrowLeft, FaPen, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { get_error_message } from "../utils/get_error_message";

interface Snippet {
  id: string;
  name: string;
  description: string;
  tags: string[];
  content: string; // the actual snippet content
}

export default function SnippetView() {
  const { groupName, snippetName } = useParams();

  const navigate = useNavigate();

  const [snippet, setSnippet] = useState<Snippet>({
    id: "",
    name: "",
    description: "",
    tags: [],
    content: "",
  });

  async function get_snippet() {
    try {
      const response = await pywebview.api.get_snippet(groupName, snippetName);
      setSnippet(response);
    } catch (err: unknown) {
      await pywebview.api.print_log(get_error_message(err));
    }
  }

  useEffect(() => {
    async function fetch_snippet() {
      await get_snippet();
    }
    fetch_snippet();
  }, [snippetName]);

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
          {/* Snippet Header */}
          <div className="mb-4 bg-[#2c2e3a] p-3">
            <h2 className="text-[#8be9fd] text-xl font-medium">{snippet.name}</h2>

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
              {/* Add tag button (optional) */}
              <button
                className="px-1 py-1 rounded text-sm transition ml-auto"
                onClick={() => console.log("Add tag clicked")}
              >
                <FaPlus className="text-[#6272a4] hover:text-[#8be9fd]" />
              </button>
            </div>

            {/* Description */}
            <div className="flex justify-between items-start mt-2 mb-4">
              <p className="text-[#6272a4]">{snippet.description || "No description available."}</p>
              <button
                className="px-1 py-1 rounded text-sm transition"
                onClick={() => console.log("Edit description clicked")}
              >
                <FaPen className="text-[#6272a4] hover:text-[#8be9fd]" />
              </button>
            </div>
          </div>

          {/* Snippet Content */}
          <div className="flex-1 bg-[#2c2e3a] rounded p-4 overflow-auto text-sm font-mono whitespace-pre-wrap">
            {snippet.content || "// No content yet"}
          </div>
        </main>
      </div>
    </div>
  );
}
