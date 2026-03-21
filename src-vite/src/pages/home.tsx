import { FaPlus, FaFolderOpen, FaKeyboard } from "react-icons/fa";
import { Link } from "react-router-dom";

interface HomeActionProps {
  icon: React.ReactNode;
  label: string;
}

function HomeAction(props: HomeActionProps) {
  const { icon, label } = props;
  return (
    <button className="flex items-center gap-3 text-[#50fa7b] hover:text-[#8be9fd] transition">
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function Home() {
  return (
    <div className="h-screen p-20">
      <div className="h-full border border-[#44475a] rounded-sm flex-col justify-between">
        {/* Header */}
        <div className="mt-20 mb-32 text-center">
          <h1 className="text-3xl text-[#f8f8f2] mb-2">CmdSheet</h1>
          <p className="text-[#6272a4]">
            Your personal command and snippet workspace
          </p>
          <Link
            to="/group/default"
            className="text-[#bd93f9] hover:text-[#8be9fd] transition"
          >
            Get Started
          </Link>
        </div>

        {/* Overview */}
        <div className="m-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Start */}
          <div>
            <h2 className="text-[#bd93f9] mb-4">Start</h2>
            <div className="flex flex-col gap-3">
              <HomeAction icon={<FaPlus />} label="create-snippet" />
              <HomeAction icon={<FaFolderOpen />} label="open-collection" />
              <HomeAction icon={<FaKeyboard />} label="command-palette" />
            </div>
          </div>

          {/* Recent */}
          <div>
            <h2 className="text-[#bd93f9] mb-4">Recent</h2>
            <ul className="text-[#8be9fd] flex flex-col gap-2">
              <li className="hover:underline cursor-pointer">git reset --hard</li>
              <li className="hover:underline cursor-pointer">
                docker compose up
              </li>
              <li className="hover:underline cursor-pointer">nmap -sV target</li>
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h2 className="text-[#bd93f9] mb-4">Tips</h2>
            <ul className="text-[#6272a4] flex flex-col gap-2">
              <li>Use ":" to open command palette</li>
              <li>Press Ctrl + B to toggle sidebar</li>
              <li>Search supports tags and groups</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
