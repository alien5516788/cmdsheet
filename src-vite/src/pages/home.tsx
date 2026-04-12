import { FaPlus, FaFolderOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../../assets/png/48.png";

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
          <div className="flex justify-center items-center gap-4 mb-2">
            <img src={logo} />
            <h1 className="text-3xl text-[#f8f8f2]">CMDsheet</h1>
          </div>

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
        <div className="my-20 flex justify-center gap-[10%]">
          {/* Start */}
          <div>
            <h2 className="text-[#bd93f9] mb-4">Start</h2>
            <div className="flex flex-col gap-3">
              <HomeAction icon={<FaPlus />} label="create-snippet" />
              <HomeAction icon={<FaFolderOpen />} label="open-collection" />
            </div>
          </div>

          {/* Tips */}
          <div>
            <h2 className="text-[#bd93f9] mb-4">Tips</h2>
            <ul className="text-[#6272a4] flex flex-col gap-3">
              <li>Search supports snippets and tags</li>
              <li>Use shortcuts for faster access (available soon...)</li>
              <li>Customizable with themes (available soon..)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
