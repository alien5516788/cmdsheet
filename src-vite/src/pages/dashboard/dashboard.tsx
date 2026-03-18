import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="h-full flex-1 p-6">
          {/* Terminal-style header */}
          <div className="text-[#50fa7b] mb-4 cursor-blink">
            user@cmdsheet:~/snippets
          </div>
          {/* Content box */}
          <div className="text-[#6272a4]">No content available.</div>
        </main>
      </div>
    </div>
  );
}
