import { useState } from "react";
import { FaCode, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ItemCardProps {
  item: {
    name: string;
    description: string;
    tags: string[];
  };
  groupName: string;
}

export default function SnippetCard(props: ItemCardProps) {
  const { item, groupName } = props;

  const navigate = useNavigate();

  // Track if item count is hovered
  // If hovered, show delete button
  const [hovered, setHovered] = useState(false);

  return (
    <div className="border border-[#44475a] p-4 hover:border-[#bd93f9] transition cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        navigate(`/group/${groupName}/${item.name}`);
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#8be9fd]">
          <FaCode size={14} />
        </span>

        <h3 className="text-[#f8f8f2] font-medium truncate">{item.name}</h3>

        {hovered &&
          <span className="text-[#ff5555] hover:text-[#ff79c6] ml-auto">
            <FaTrash size={14} />
          </span>
        }
      </div>

      {/* Description */}
      <p className="text-[#6272a4] text-sm line-clamp-2 mb-3">
        {item.description || "No description available."}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 overflow-hidden max-h-[52px]">
        {item.tags.length > 0 ?
          item.tags.slice(0, 10).map((tag, index) => (
            <span key={index} className="bg-[#6272a4] text-[#f8f8f2] text-xs px-2 py-[2px] truncate max-w-[100px] rounded">
              {tag}
            </span>
          )) :
          <span className="bg-[#6272a4] text-[#f8f8f2] text-xs px-2 py-[2px] truncate max-w-[100px] rounded">
            <i>No tags</i>
          </span>
        }
      </div>
    </div>
  );
}
