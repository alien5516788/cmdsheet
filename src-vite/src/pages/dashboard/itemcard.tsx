import { FaCode, FaLayerGroup } from "react-icons/fa";

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    tags: string[];
    type: "snippet" | "group";
  };
}

export default function ItemCard(props: ItemCardProps) {
  const { item } = props;
  const isSnippet = item.type === "snippet";

  return (
    <div className="border border-[#44475a] p-4 hover:border-[#bd93f9] transition cursor-pointer">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className={isSnippet ? "text-[#8be9fd]" : "text-[#ffb86c]"}>
          {isSnippet ? <FaCode size={14} /> : <FaLayerGroup size={14} />}
        </span>

        <h3 className="text-[#f8f8f2] font-medium truncate">{item.name}</h3>
      </div>

      {/* Description */}
      <p className="text-[#6272a4] text-sm line-clamp-2 mb-3">
        {item.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 overflow-hidden max-h-[52px]">
        {item.tags.slice(0, 10).map((tag, index) => (
          <span
            key={index}
            className="text-xs text-[#50fa7b] border border-[#44475a] px-2 py-[2px] truncate max-w-[100px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
