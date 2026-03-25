import { useState } from "react";
import { FaCode, FaStar, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import type { SearchResult } from "./navbar";

interface SnippetCardProps {
  item: {
    id: string;
    groupName: string;
    name: string;
    description: string;
    tags: string[];
    favourite: boolean;
  };
  toggleFavourite: (groupName: string, name: string, favourite: boolean) => Promise<void>;
  openDeleteItem: (itemType: "snippet" | "group", name: string) => void;
  searchResult: SearchResult[];
}

export default function SnippetCard(props: SnippetCardProps) {
  const { item, toggleFavourite, openDeleteItem, searchResult } = props;

  const params = useParams();
  const { groupName } = params; // Includes virtual groups recent and favourites

  /*
    Navigate to the snippetview page when clicked
  */
  const navigate = useNavigate();

  /*
    Check if the item is in the search results
    If it is, highlight the card with a yellow border
    ISSUE: This searching for match introduce a performance overhead for a large list
            Consider using a more efficient search algorithm or indexing strategy
  */
  const searchMatched = searchResult.some((result: SearchResult) => {
    return result.name === item.name && result.groupName === item.groupName;
  });

  /*
    Track if item count is hovered
    If hovered, show delete button
    Not shown inside virtual groups
  */
  const [hovered, setHovered] = useState(false);

  /*
    Track if the item is a favourite
    If it is, show a star icon
  */
  const [favourite, setFavourite] = useState(item.favourite);

  return (
    <div className={`border border-[#44475a] p-4 hover:border-[#bd93f9] transition cursor-pointer
      ${searchMatched ? "border-2 border-[#f1fa8c]" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        navigate(`/group/${item.groupName}/${item.name}?prevGroup=${groupName}`);
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-end gap-2 mb-2">
        <span className="text-[#8be9fd]">
          <FaCode size={14} />
        </span>

        <h3 className="text-[#f8f8f2] font-medium truncate mr-auto">{item.name}</h3>

        {hovered && !["recent", "favourites"].includes(groupName || "") &&
          <button className="text-[#ff5555] hover:text-[#ff79c6] mr-3" onClick={(e) => {
            e.stopPropagation();
            openDeleteItem("snippet", item.name);
          }}>
            <FaTrash size={14} />
          </button>
        }

        {
          (hovered || favourite) &&
          <span className={`${favourite ? " text-[#f1fa8c]" : ""} hover:text-[#f8f8f2]`} onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(item.groupName, item.name, !item.favourite)
            setFavourite(!favourite);
          }}>
            <FaStar size={14} />
          </span>
        }
      </div>

      {/* Description */}
      <p className="text-[#6272a4] text-sm line-clamp-2 mb-3">
        {item.description ? item.description : <i className="opacity-25">No description</i>}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 overflow-hidden max-h-[52px]">
        {item.tags.length > 0 ?
          item.tags.slice(0, 10).map((tag, index) => (
            <span key={index} className="bg-[#6272a4] text-[#f8f8f2] text-xs px-2 py-[2px] truncate max-w-[100px] rounded">
              {tag}
            </span>
          )) :
          <span className="bg-[#6272a4] text-[#f8f8f2] text-xs px-2 py-[2px] truncate max-w-[100px] opacity-25 rounded">
            <i>No tags</i>
          </span>
        }
      </div>
    </div>
  );
}
