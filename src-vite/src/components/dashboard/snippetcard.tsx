import { FaCode } from "react-icons/fa";

interface ItemCardProps {
  item: {
    name: string;
    description: string;
    tags: string[];
  };
}

export default function SnippetCard(props: ItemCardProps) {
  const { item } = props;

  return (
    <div className="border border-[#44475a] p-4 hover:border-[#bd93f9] transition cursor-pointer">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#8be9fd]">
          <FaCode size={14} />
        </span>

        <h3 className="text-[#f8f8f2] font-medium truncate">{item.name}</h3>
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
