import { useState } from "react";
import ItemCard from "./itemcard";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { FaPlus } from "react-icons/fa";

export default function Dashboard() {
  const [viewType, setViewType] = useState<
    "snippets" | "groups" | "recent" | "favourites"
  >("snippets");

  // temp
  const dummyData: {
    id: string;
    name: string;
    description: string;
    tags: string[];
    type: "snippet" | "group";
  }[] = [
    {
      id: "1",
      name: "Docker Commands",
      description:
        "Common docker commands for container management and debugging workflows",
      tags: ["docker", "devops", "containers", "cli", "linux"],
      type: "snippet",
    },
    {
      id: "2",
      name: "Reset Git Hard",
      description:
        "Force reset git repository to a previous commit. Dangerous but useful.",
      tags: ["git", "version-control", "danger", "cli"],
      type: "snippet",
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
      type: "group",
    },
  ];

  return (
    <div className="min-h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col">
      {/* Navbar */}
      <Navbar viewType={viewType} />

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar viewType={viewType} setViewType={setViewType} />

        {/* Main Content */}
        <main className="h-full flex-1 p-6">
          {/* Header */}
          <div className="text-[#50fa7b] mb-4 flex justify-between">
            {/* Terminal-style path */}
            <span className="cursor-blink">
              user@cmdsheet<span className="text-white">:</span>
              <span className="text-blue-500">~/{viewType}</span>
              <span className="text-white">$</span>
            </span>

            {/* New Snippet */}
            <button className="text-[#50fa7b] hover:text-[#8be9fd] transition flex items-center gap-2">
              <FaPlus />
              <span>new-snippet</span>
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
