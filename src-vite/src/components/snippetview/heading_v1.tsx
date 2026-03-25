import { useState, useEffect } from "react";
import type { SnippetBlock } from "./snippeteditor";

interface HeadingV1Props {
  block: SnippetBlock;
  updateContent: React.Dispatch<React.SetStateAction<SnippetBlock[]>>;
}

export default function HeadingV1({ block, updateContent }: HeadingV1Props) {
  const [title, setTitle] = useState(block.content);

  // sync when switching blocks
  useEffect(() => {
    async function set_title() {
      setTitle(block.content);
    }
    set_title();
  }, [block.id]);

  // save on blur
  function saveTitle() {
    if (title === block.content) return;

    updateContent(prev =>
      prev.map(b => {
        if (b.id !== block.id) return b;
        return { ...b, content: title };
      }),
    );
  }

  return (
    <div className="overflow-hidden">
      <hr className="opacity-20"/>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={saveTitle} // save on blur
        placeholder="Heading..."
        style={{
          width: "100%",
          fontFamily: "'Fira Sans', sans-serif", // different font for heading
          fontSize: 18,
          fontWeight: 600,
          backgroundColor: "#2e344000", // matches your terminal theme
          color: "#eceff4", // greenish highlight for heading
          border: "none",
          outline: "none",
          padding: "10px",
        }}
      />
    </div>
  );
}
