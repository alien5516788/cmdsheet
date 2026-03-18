import { FaCog, FaMoon, FaSearch } from "react-icons/fa";

interface NavbarProps {
  viewGroup: "default" | "recent" | "favourites" | string;
}

export default function Navbar(props: NavbarProps) {
  const { viewGroup } = props;

  return (
    <nav className="bg-[#282a36] border border-[#44475a] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="text-[#50fa7b]">cmdsheet</div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6272a4]" />
          <input
            type="text"
            placeholder={`search --${viewGroup}`}
            className="w-full bg-transparent text-[#f8f8f2] placeholder-[#6272a4] pl-10 pr-3 py-2 border border-[#44475a] focus:outline-none focus:border-[#bd93f9] focus:shadow-[0_0_6px_#bd93f9]"
            style={{ caretColor: "#50fa7b" }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 whitespace-nowrap">
          {/* Settings */}
          <button className="text-[#6272a4] hover:text-[#f8f8f2] transition">
            <FaCog size={18} />
          </button>

          {/* Theme Toggle */}
          <button className="text-[#f1fa8c] hover:text-[#f8f8f2] transition">
            <FaMoon size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
