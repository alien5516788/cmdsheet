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
    {
      id: "4",
      name: "Check Disk Usage",
      description: "Display disk usage in a human-readable format",
      tags: ["linux", "disk", "storage", "cli"],
    },
    {
      id: "5",
      name: "Find Running Processes",
      description: "List all running processes and filter by name",
      tags: ["linux", "process", "ps", "grep"],
    },
    {
      id: "6",
      name: "Kill Process",
      description: "Terminate a process using its PID",
      tags: ["linux", "process", "kill", "system"],
    },
    {
      id: "7",
      name: "SSH Connection",
      description: "Connect to a remote server using SSH",
      tags: ["ssh", "remote", "network", "cli"],
    },
    {
      id: "8",
      name: "Download File with Curl",
      description: "Download files from a URL using curl",
      tags: ["curl", "download", "http", "cli"],
    },
    {
      id: "9",
      name: "Extract Tar File",
      description: "Extract .tar.gz archive files",
      tags: ["linux", "tar", "archive", "cli"],
    },
    {
      id: "10",
      name: "Search Files",
      description: "Search for files recursively using find command",
      tags: ["linux", "find", "search", "filesystem"],
    },
    {
      id: "15",
      name: "Git Push",
      description: "Push local commits to remote repository",
      tags: ["git", "push", "version-control"],
    },
    {
      id: "16",
      name: "Docker Build Image",
      description: "Build a Docker image from a Dockerfile",
      tags: ["docker", "build", "containers"],
    },
    {
      id: "17",
      name: "Docker Run Container",
      description: "Run a container from a Docker image",
      tags: ["docker", "run", "containers"],
    },
    {
      id: "18",
      name: "List Docker Containers",
      description: "List all running Docker containers",
      tags: ["docker", "ps", "containers"],
    },
    {
      id: "19",
      name: "Remove Docker Container",
      description: "Remove a stopped Docker container",
      tags: ["docker", "rm", "containers"],
    },
    {
      id: "20",
      name: "Ping Host",
      description: "Check connectivity to a host",
      tags: ["network", "ping", "diagnostics"],
    },
    {
      id: "21",
      name: "Check Uptime",
      description: "Show how long the system has been running",
      tags: ["linux", "uptime", "system"],
    },
    {
      id: "22",
      name: "Whoami Command",
      description: "Display current logged-in user",
      tags: ["linux", "user", "system"],
    },
  ];

  return (
    <div className="h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col overflow-y-hidden">
      {/* Navbar */}
      <Navbar viewGroup={viewGroup} />

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar viewGroup={viewGroup} setViewGroup={setViewGroup} />

        {/* Main Content */}
        <main className="flex flex-col flex-1 min-h-0 p-3">
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
          <div className="text-[#6272a4] flex-1 overflow-y-auto">
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
