import { useEffect, useState } from "react";
import ItemCard from "./snippetcard";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function Dashboard() {
  // Extract groupId from URL params
  const params = useParams();
  const { groupId } = params;

  // Dashboard is required to which group to display snippets from
  // Group name is set from the sidebar
  const [groupName, setGroupName] = useState<string>("default");

  // Fetch snippet list from API
  const [snippets, setSnippets] = useState<
    {
      id: string;
      name: string;
      description: string;
      tags: string[];
    }[]
  >([]);

  useEffect(() => {
    async function fetchSnippets() {
      try {
        const snippets = await pywebview.api.get_snippets(groupId);
        setSnippets(snippets);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      }
    }

    fetchSnippets();
  }, [groupId]);

  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col overflow-y-hidden">
      {/* Navbar */}
      <Navbar groupName={groupName} />

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar groupName={groupName} setGroupName={setGroupName} />

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

            {/* New Snippet */}
            <button
              className="text-[#50fa7b] hover:text-[#8be9fd] transition flex items-center gap-2 px-3 py-1
              border border-[#50fa7b] hover:border-[#bd93f9] rounded"
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
    </div>
  );
}
