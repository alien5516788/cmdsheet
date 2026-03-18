import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#282a36] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1e1f29] p-4 space-y-4">
        <h2 className="text-xl font-bold">CmdSheet</h2>

        <nav className="flex flex-col space-y-2">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
