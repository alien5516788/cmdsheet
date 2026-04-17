import { useEffect, useState } from "react";
import { FaCog, FaMoon, FaSun, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { StatusBarItem } from "../statusbar";
import { search_snippets } from "../../api";
import { useTheme } from "../../hooks/useTheme";

export interface SearchResult {
  id: number;
  groupName: string;
  name: string;
}

interface NavbarProps {
  searchResult: SearchResult[];
  setSearchResult: React.Dispatch<React.SetStateAction<SearchResult[]>>;
  scrollToSnippet: (id: number) => void;
  pushToStatusBar: (newStatus: Omit<StatusBarItem, "id">) => void;
}

export default function Navbar(props: NavbarProps) {
  const { theme, setTheme } = useTheme();

  // Searching
  const { searchResult, setSearchResult, scrollToSnippet, pushToStatusBar } =
    props;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [openSearchResultBox, setOpenSearchResultBox] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function search_for_snippets() {
      if (!debouncedQuery.trim()) {
        setSearchResult([]);
        setOpenSearchResultBox(false);
        return;
      }

      const result = await search_snippets(debouncedQuery);
      if (result.status) {
        setSearchResult(result.result);
      } else {
        setSearchResult([]);
        pushToStatusBar({ status: "error", message: result.message });
      }

      setOpenSearchResultBox(true);
    }

    search_for_snippets();
  }, [debouncedQuery]);

  return (
    <nav className="bg-[#282a36] border border-[#44475a] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="text-[#50fa7b]">
          <Link to="/">cmdsheet</Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl relative">
          {/* Search icon */}
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6272a4]" />

          {/* Input */}
          <input
            type="text"
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setOpenSearchResultBox(true)}
            onBlur={() => {
              // If the click is inside the result box, give it time to register the click
              setTimeout(() => {
                setOpenSearchResultBox(false);
              }, 500);
            }}
            className="w-full bg-transparent text-[#f8f8f2] placeholder-[#6272a4] pl-10 pr-3 py-2 border border-[#44475a] focus:outline-none focus:border-[#bd93f9] focus:shadow-[0_0_6px_#bd93f9]"
            style={{ caretColor: "#50fa7b" }}
          />

          {/* Search icon */}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setOpenSearchResultBox(false);
              }}
              className="absolute text-xl px-3 right-3 top-1/2 -translate-y-1/2 text-[#6272a4] hover:text-[#f8f8f2] transition"
            >
              ✕
            </button>
          )}

          {/* Search result */}
          {openSearchResultBox && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#282a36] border border-[#44475a] rounded shadow-lg z-50 max-h-64 overflow-y-auto">
              {searchResult.length === 0 ? (
                <div className="p-3 text-[#6272a4] text-sm">
                  No results found
                </div>
              ) : (
                searchResult.map((item) => (
                  // Link includes snippet id as a hash fragment to support auto scrolling
                  <Link
                    key={item.id}
                    to={`/group/${item.groupName}`}
                    className="block px-3 py-2 hover:bg-[#44475a] transition"
                    onClick={() => {
                      setSearchQuery(item.name);
                      setOpenSearchResultBox(false);
                      // scroll to snippet after a short delay to allow the link to settle
                      setTimeout(() => {
                        scrollToSnippet(item.id);
                      }, 50);
                    }}
                  >
                    <div className="text-[#f8f8f2]">{item.name}</div>
                    <div className="text-[#6272a4] text-xs truncate">
                      {item.groupName}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 whitespace-nowrap">
          {/* Settings */}
          <button
            className="text-[#6272a4] hover:text-[#f8f8f2] transition disabled cursor-not-allowed"
            title="Not implemented"
          >
            <FaCog size={18} />
          </button>

          {/* Theme Toggle */}
          <button
            className="text-[#f1fa8c] hover:text-[#f8f8f2] transition"
            title={theme === "light" ? "Toggle Dark" : "Toggle Light"}
            // TODO: Toggle isn't perisistant across pages; implement global setting feature
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
