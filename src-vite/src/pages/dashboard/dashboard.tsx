import { useState } from "react";
import ItemCard from "./snippetcard";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { FaPlus } from "react-icons/fa";

export default function Dashboard() {
  // There are 3 fixed groups and any number of custom groups
  // Dashboard can be set to show snippets from a specific group
  const [viewGroup, setViewGroup] = useState<
    "default" | "recent" | "favourites" | string
  >("default");

  // temp
  const dummyData: {
    id: string;
    name: string;
    description: string;
    tags: string[];
  }[] = [
    {
      id: "1",
      name: "Docker Commands",
      description:
        "Common docker commands for container management and debugging workflows",
      tags: ["docker", "devops", "containers", "cli", "linux"],
    },
    {
      id: "2",
      name: "Reset Git Hard",
      description:
        "Force reset git repository to a previous commit. Dangerous but useful.",
      tags: ["git", "version-control", "danger", "cli"],
    },
    {
      id: "3",
      name: "Nmap Scan",
      description:
        "Scan target system for open ports and services using aggressive detection flags. It also can do stealth scanning.",
      tags: [
        "nmap",
        "security",
        "network",
        "recon",
        "pentest",
        "scan",
        "tcp",
        "udp",
        "exploit",
        "enumeration",
        "extra-tag",
      ],
    },
  ];

  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col">
      {/* Navbar */}
      <Navbar viewGroup={viewGroup} />

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar viewGroup={viewGroup} setViewGroup={setViewGroup} />

        {/* Main Content */}
        <main className="h-full flex-1 p-6">
          {/* Header */}
          <div className="text-[#50fa7b] mb-4 flex justify-between">
            {/* Terminal-style path */}
            <span className="cursor-blink">
              user@cmdsheet<span className="text-white">:</span>
              <span className="text-blue-500">~/{viewGroup}</span>
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
          <div className="text-[#6272a4]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyData.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
