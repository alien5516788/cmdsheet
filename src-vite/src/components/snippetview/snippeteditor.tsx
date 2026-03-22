import { useState } from "react";
import CodeV1 from "./code_v1";

export interface SnippetBlock {
  id: string;
  version: number;
  renderer: "text" | "code" | "math";
  content: string;
}

function get_renderer(name: "text" | "code" | "math", version: number) {
  const renderer = name + "_v" + version;
  switch (renderer) {
    case "code_v1": return <CodeV1 />;
  }
}

interface SnippetEditorProps {
  content: SnippetBlock[];
  updateContent: (updatedContent: SnippetBlock[]) => void;
}


export default function SnippetEditor(props: SnippetEditorProps) {
  // const { content, updateContent } = props;
  const { onSave } = props;

  // temp
  const content: SnippetBlock[] = [
    {
      id: "ia4w34w34td1rtw",
      version: 1,
      renderer: "code",
      content: "This is the introduction text block."
    },
    {
      id: "id234563u45yb52",
      version: 1,
      renderer: "code",
      content: "print('Hello World')"
    }
  ]

  const [updatedBlocks, setUpdatedBlocks] = useState<SnippetBlock[]>(content);

  function add_block(posIndex: number, renderer: "text" | "code" | "math") {
    /*
      Inserts a new block at the given position
      Existing blocks are shifted down
    */
    const newBlock: SnippetBlock = {
      id: crypto.randomUUID(),
      version: 1,
      renderer,
      content: ""
    };
    setUpdatedBlocks(prev => {
      const newBlocks = [...prev];
      newBlocks.splice(posIndex, 0, newBlock);
      return newBlocks;
    });
  }

  function remove_block(id: string) {
    setUpdatedBlocks(prev => prev.filter(block => block.id !== id));
  }

  return (
    <div className="flex-1 bg-[#2c2e3a] rounded p-4 overflow-auto text-sm font-mono whitespace-pre-wrap">
      // Edit here
    </div>
  );
}
