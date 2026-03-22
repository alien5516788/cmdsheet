import CodeV1 from "./code_v1";

export interface SnippetBlock {
  id: string;
  version: number;
  renderer: "text" | "code" | "math";
  content: string;
}

interface BlockControllerProps {
  index: number;
  addBlock: (posIndex: number, renderer: "text" | "code" | "math") => void;
  removeBlock: (posIndex: number) => void;
}

function BlockController(props: BlockControllerProps) {
  const { index, addBlock, removeBlock } = props;
  const topMost = index === -1;
  return (
    <div className="flex gap-2 opacity-25 hover:opacity-100 transition my-2 border p-2">
      <button className="cursor-pointer" onClick={() => addBlock(index + 1, "text")}>+ Text</button>
      <button className="cursor-pointer" onClick={() => addBlock(index + 1, "code")}>+ Code</button>
      <button className="cursor-pointer" onClick={() => addBlock(index + 1, "math")}>+ Math</button>

      {!topMost &&
        <button
          className="cursor-pointer ml-auto text-red-400"
          onClick={() => removeBlock(index)}
        >
          Delete ↑
        </button>
      }
    </div>
  );
}


interface SnippetEditorProps {
  content: SnippetBlock[];
  updateContent: React.Dispatch<React.SetStateAction<SnippetBlock[]>>
}


export default function SnippetEditor(props: SnippetEditorProps) {
  const { content, updateContent } = props;

  function get_renderer(block: SnippetBlock) {
    const renderer = block.renderer + "_v" + block.version;

    switch (renderer) {
      case "code_v1":
        return <CodeV1 key={block.id} block={block} updateContent={updateContent} />;
      default:
        return <div>Unsupported block</div>;
    }
  }

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
    updateContent(prev => {
      const newBlocks = [...prev];
      newBlocks.splice(posIndex, 0, newBlock);
      return newBlocks;
    });
  }

  function remove_block(posIndex: number) {
    updateContent(prev => [...prev.slice(0, posIndex), ...prev.slice(posIndex + 1)]);
  }


  return (
    <div className="flex-1 bg-[#2c2e3a] rounded p-4 overflow-auto text-sm font-mono whitespace-pre-wrap">
      <BlockController
        index={-1}
        addBlock={add_block}
        removeBlock={remove_block}
      />
      {content.map((block, index) => {
        return (
          <>
            {get_renderer(block) /* <Block /> */}

            <BlockController
              key={block.id} index={index} addBlock={add_block} removeBlock={remove_block}
            />
          </>
        );
      })}
    </div>
  );
}
