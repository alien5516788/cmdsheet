import { useState, useEffect } from "react";
import type { SnippetBlock } from "./snippeteditor";

interface TextV1Props {
  block: SnippetBlock;
  updateContent: React.Dispatch<React.SetStateAction<SnippetBlock[]>>;
}

export default function TextV1({ block, updateContent }: TextV1Props) {
  const [content, setContent] = useState(block.content);

  // sync when switching blocks
  useEffect(() => {
    async function set_content() {
      setContent(block.content);
    }
    set_content();
  }, [block.id]);

  // simple save on blur (or you can debounce if needed)
  function saveContent() {
    if (content === block.content) return;

    updateContent(prev =>
      prev.map(b => {
        if (b.id !== block.id) return b;
        return { ...b, content };
      }),
    );
  }

  return (
    <div className="overflow-hidden">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        onBlur={saveContent} // save on blur
        rows={5} // adjust default height
        style={{
          width: "100%",
          fontFamily: "cursive", // different font from CodeV1
          fontSize: 16,
          placeContent: "Type here...",
          backgroundColor: "#2e3440", // slightly darker than CodeV1
          color: "#eceff4", // new font color (yellowish terminal vibe)
          border: "none",
          outline: "none",
          padding: "10px",
          resize: "vertical",
          lineHeight: 1.6,
          borderRadius: 8,
          minHeight: 38
        }}
      />
    </div>
  );
}
